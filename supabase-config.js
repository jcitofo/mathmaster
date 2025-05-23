/**
 * Supabase Configuration for MathMaster 3ème
 */

const SUPABASE_URL = 'https://gnzcahffbzjviuzbgvkt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduemNhaGZmYnpqdml1emJndmt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5OTc3OTUsImV4cCI6MjA2MzU3Mzc5NX0.C5Ifolh4E66fIsmzYYx76BaS_40ZngKfS-CZtxOx_f4';

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Supabase service functions
class SupabaseService {
    constructor() {
        this.client = supabase;
        this.currentUser = null;
    }

    // Authentication methods
    async signUp(email, password, userData = {}) {
        try {
            const { data, error } = await this.client.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: userData
                }
            });
            
            if (error) throw error;
            
            // Create profile
            if (data.user) {
                await this.createProfile(data.user.id, userData);
            }
            
            return { data, error: null };
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            return { data: null, error };
        }
    }

    async signIn(email, password) {
        try {
            const { data, error } = await this.client.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) throw error;
            
            this.currentUser = data.user;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            return { data: null, error };
        }
    }

    async signOut() {
        try {
            const { error } = await this.client.auth.signOut();
            if (error) throw error;
            
            this.currentUser = null;
            return { error: null };
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            return { error };
        }
    }

    // Get current session
    async getSession() {
        try {
            const { data: { session }, error } = await this.client.auth.getSession();
            if (error) throw error;
            
            if (session?.user) {
                this.currentUser = session.user;
            }
            
            return { session, error: null };
        } catch (error) {
            console.error('Erreur lors de la récupération de session:', error);
            return { session: null, error };
        }
    }

    // Listen to auth changes
    onAuthStateChanged(callback) {
        return this.client.auth.onAuthStateChange((event, session) => {
            this.currentUser = session?.user || null;
            callback(event, session);
        });
    }

    // Profile methods
    async createProfile(userId, userData) {
        try {
            const { data, error } = await this.client
                .from('profiles')
                .insert([{
                    id: userId,
                    username: userData.username || `user_${Date.now()}`,
                    full_name: userData.full_name || userData.name || '',
                    class: userData.class || '3ème',
                    level: userData.level || 'Débutant'
                }]);
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur lors de la création du profil:', error);
            return { data: null, error };
        }
    }

    async getProfile(userId) {
        try {
            const { data, error } = await this.client
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur lors de la récupération du profil:', error);
            return { data: null, error };
        }
    }

    async updateProfile(userId, updates) {
        try {
            const { data, error } = await this.client
                .from('profiles')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            return { data: null, error };
        }
    }

    // Theme methods
    async getThemes() {
        try {
            const { data, error } = await this.client
                .from('themes')
                .select('*')
                .order('order_index');
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur lors de la récupération des thèmes:', error);
            return { data: null, error };
        }
    }

    // Progress methods
    async getUserProgress(userId) {
        try {
            const { data, error } = await this.client
                .from('user_progress')
                .select(`
                    *,
                    theme:themes(*)
                `)
                .eq('user_id', userId);
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur lors de la récupération de la progression:', error);
            return { data: null, error };
        }
    }

    async updateProgress(userId, themeId, progressData) {
        try {
            const { data, error } = await this.client
                .from('user_progress')
                .upsert({
                    user_id: userId,
                    theme_id: themeId,
                    ...progressData,
                    last_activity: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la progression:', error);
            return { data: null, error };
        }
    }

    // Activity methods
    async addActivity(userId, activityData) {
        try {
            const { data, error } = await this.client
                .from('activities')
                .insert([{
                    user_id: userId,
                    ...activityData
                }]);
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'activité:', error);
            return { data: null, error };
        }
    }

    async getUserActivities(userId, limit = 10) {
        try {
            const { data, error } = await this.client
                .from('activities')
                .select(`
                    *,
                    theme:themes(title)
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(limit);
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur lors de la récupération des activités:', error);
            return { data: null, error };
        }
    }

    // Badge methods
    async getBadges() {
        try {
            const { data, error } = await this.client
                .from('badges')
                .select('*');
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur lors de la récupération des badges:', error);
            return { data: null, error };
        }
    }

    async getUserBadges(userId) {
        try {
            const { data, error } = await this.client
                .from('user_badges')
                .select(`
                    *,
                    badge:badges(*)
                `)
                .eq('user_id', userId)
                .order('earned_at', { ascending: false });
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur lors de la récupération des badges utilisateur:', error);
            return { data: null, error };
        }
    }

    async awardBadge(userId, badgeId) {
        try {
            const { data, error } = await this.client
                .from('user_badges')
                .insert([{
                    user_id: userId,
                    badge_id: badgeId
                }]);
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur lors de l\'attribution du badge:', error);
            return { data: null, error };
        }
    }

    // Exercise methods
    async getExercises(themeId = null) {
        try {
            let query = this.client
                .from('exercises')
                .select('*')
                .order('order_index');
            
            if (themeId) {
                query = query.eq('theme_id', themeId);
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur lors de la récupération des exercices:', error);
            return { data: null, error };
        }
    }

    async saveExerciseResult(userId, exerciseId, resultData) {
        try {
            const { data, error } = await this.client
                .from('user_exercise_results')
                .insert([{
                    user_id: userId,
                    exercise_id: exerciseId,
                    ...resultData
                }]);
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du résultat:', error);
            return { data: null, error };
        }
    }

    // Diagnostic methods
    async saveDiagnosticResult(userId, diagnosticData) {
        try {
            const { data, error } = await this.client
                .from('diagnostic_results')
                .insert([{
                    user_id: userId,
                    ...diagnosticData
                }]);
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du diagnostic:', error);
            return { data: null, error };
        }
    }

    // Real-time subscriptions
    subscribeToUserProgress(userId, callback) {
        return this.client
            .channel('user_progress')
            .on('postgres_changes', 
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'user_progress',
                    filter: `user_id=eq.${userId}`
                }, 
                callback
            )
            .subscribe();
    }

    subscribeToUserActivities(userId, callback) {
        return this.client
            .channel('user_activities')
            .on('postgres_changes', 
                { 
                    event: 'INSERT', 
                    schema: 'public', 
                    table: 'activities',
                    filter: `user_id=eq.${userId}`
                }, 
                callback
            )
            .subscribe();
    }

    subscribeToUserBadges(userId, callback) {
        return this.client
            .channel('user_badges')
            .on('postgres_changes', 
                { 
                    event: 'INSERT', 
                    schema: 'public', 
                    table: 'user_badges',
                    filter: `user_id=eq.${userId}`
                }, 
                callback
            )
            .subscribe();
    }
}

// Export the service instance
const supabaseService = new SupabaseService();
