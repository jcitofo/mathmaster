/**
 * MathMaster 3ème - Application intégrée avec Supabase
 * Gestion complète de l'authentification, données en temps réel et synchronisation
 */

// Variables globales
let currentUser = null;
let isAuthenticated = false;
let userProfile = null;
let userProgress = {};
let userActivities = [];
let userBadges = [];
let allThemes = [];
let progressSubscription = null;
let activitiesSubscription = null;
let badgesSubscription = null;

// Fonction utilitaire pour l'accès sécurisé aux éléments DOM
function safelyAccessElement(id, property, value = null) {
    try {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Élément non trouvé: ${id}`);
            return null;
        }
        if (value !== null && property) {
            if (property === 'classList') {
                if (typeof value === 'string') {
                    element.classList[value]?.('hidden');
                }
            } else {
                element[property] = value;
            }
        }
        return element;
    } catch (error) {
        console.error(`Erreur lors de l'accès à l'élément ${id}.${property}:`, error);
        return null;
    }
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Initialisation de MathMaster avec Supabase...');
    
    // Enregistrer les gestionnaires d'erreurs globaux
    window.addEventListener('error', function(event) {
        console.error('Erreur globale capturée:', event.error?.message, event.error?.stack);
    });

    try {
        // Vérifier la connexion Supabase
        await checkSupabaseConnection();
        
        // Initialiser l'authentification
        await initializeAuth();
        
        // Initialiser les événements UI
        initializeUIEvents();
        
        // Charger les thèmes depuis Supabase
        await loadThemes();
        
        console.log('✅ Initialisation terminée avec succès');
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        showError('Erreur de connexion. Veuillez vérifier votre connexion internet.');
    }
});

// Vérification de la connexion Supabase
async function checkSupabaseConnection() {
    try {
        const { session, error } = await supabaseService.getSession();
        if (error) {
            console.error('Erreur de connexion Supabase:', error);
            throw error;
        }
        console.log('✅ Connexion Supabase établie');
        return true;
    } catch (error) {
        console.error('❌ Impossible de se connecter à Supabase:', error);
        throw new Error('Connexion à la base de données impossible');
    }
}

// Initialisation de l'authentification
async function initializeAuth() {
    try {
        // Écouter les changements d'état d'authentification
        supabaseService.onAuthStateChanged(async (event, session) => {
            console.log('🔄 Changement d\'état d\'authentification:', event);
            
            if (session?.user) {
                currentUser = session.user;
                isAuthenticated = true;
                console.log('👤 Utilisateur connecté:', currentUser.email);
                
                // Charger le profil utilisateur
                await loadUserProfile();
                
                // Configurer les abonnements en temps réel
                await setupRealtimeSubscriptions();
                
                // Mettre à jour l'interface
                await updateUIWithUserData();
                
                // Masquer le modal de connexion
                hideLoginModal();
            } else {
                currentUser = null;
                isAuthenticated = false;
                userProfile = null;
                console.log('🚪 Utilisateur déconnecté');
                
                // Nettoyer les abonnements
                cleanupSubscriptions();
                
                // Afficher le modal de connexion
                showLoginModal();
            }
        });

        // Vérifier la session existante
        const { session, error } = await supabaseService.getSession();
        if (error) {
            console.error('Erreur lors de la vérification de session:', error);
        }
        
        if (!session) {
            console.log('📝 Aucune session active, affichage du modal de connexion');
            showLoginModal();
        }
        
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
        showError('Erreur d\'authentification');
    }
}

// Charger le profil utilisateur
async function loadUserProfile() {
    try {
        if (!currentUser) return;
        
        const { data: profile, error } = await supabaseService.getProfile(currentUser.id);
        
        if (error) {
            console.error('Erreur lors du chargement du profil:', error);
            return;
        }
        
        if (profile) {
            userProfile = profile;
            console.log('✅ Profil utilisateur chargé:', userProfile);
        } else {
            // Créer un profil par défaut si aucun n'existe
            await createDefaultProfile();
        }
        
    } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
    }
}

// Créer un profil par défaut
async function createDefaultProfile() {
    try {
        const userData = {
            username: `user_${Date.now()}`,
            full_name: currentUser.email.split('@')[0],
            class: '3ème',
            level: 'Débutant'
        };
        
        const { data, error } = await supabaseService.createProfile(currentUser.id, userData);
        
        if (error) {
            console.error('Erreur lors de la création du profil:', error);
            return;
        }
        
        userProfile = { id: currentUser.id, ...userData };
        console.log('✅ Profil par défaut créé:', userProfile);
        
    } catch (error) {
        console.error('Erreur lors de la création du profil par défaut:', error);
    }
}

// Configuration des abonnements en temps réel
async function setupRealtimeSubscriptions() {
    if (!currentUser) return;
    
    try {
        // Abonnement aux changements de progression
        progressSubscription = supabaseService.subscribeToUserProgress(
            currentUser.id,
            (payload) => {
                console.log('🔄 Mise à jour de progression en temps réel:', payload);
                handleProgressUpdate(payload);
            }
        );
        
        // Abonnement aux nouvelles activités
        activitiesSubscription = supabaseService.subscribeToUserActivities(
            currentUser.id,
            (payload) => {
                console.log('🔄 Nouvelle activité en temps réel:', payload);
                handleNewActivity(payload);
            }
        );
        
        // Abonnement aux nouveaux badges
        badgesSubscription = supabaseService.subscribeToUserBadges(
            currentUser.id,
            (payload) => {
                console.log('🔄 Nouveau badge en temps réel:', payload);
                handleNewBadge(payload);
            }
        );
        
        console.log('✅ Abonnements en temps réel configurés');
        
    } catch (error) {
        console.error('Erreur lors de la configuration des abonnements:', error);
    }
}

// Nettoyer les abonnements
function cleanupSubscriptions() {
    if (progressSubscription) {
        supabaseService.client.removeChannel(progressSubscription);
        progressSubscription = null;
    }
    if (activitiesSubscription) {
        supabaseService.client.removeChannel(activitiesSubscription);
        activitiesSubscription = null;
    }
    if (badgesSubscription) {
        supabaseService.client.removeChannel(badgesSubscription);
        badgesSubscription = null;
    }
    console.log('🧹 Abonnements nettoyés');
}

// Charger les thèmes depuis Supabase
async function loadThemes() {
    try {
        const { data: themes, error } = await supabaseService.getThemes();
        
        if (error) {
            console.error('Erreur lors du chargement des thèmes:', error);
            return;
        }
        
        allThemes = themes || [];
        console.log('✅ Thèmes chargés:', allThemes.length);
        
    } catch (error) {
        console.error('Erreur lors du chargement des thèmes:', error);
    }
}

// Mettre à jour l'interface avec les données utilisateur
async function updateUIWithUserData() {
    try {
        if (!currentUser || !userProfile) return;
        
        // Charger la progression utilisateur
        await loadUserProgress();
        
        // Charger les activités utilisateur
        await loadUserActivities();
        
        // Charger les badges utilisateur
        await loadUserBadges();
        
        // Mettre à jour l'affichage
        updateProgressDisplay();
        updateActivityDisplay();
        updateUserInfo();
        updateBadgesDisplay();
        updateThemeCards();
        
        console.log('✅ Interface mise à jour avec les données utilisateur');
        
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'interface:', error);
    }
}

// Charger la progression utilisateur
async function loadUserProgress() {
    try {
        if (!currentUser) return;
        
        const { data: progress, error } = await supabaseService.getUserProgress(currentUser.id);
        
        if (error) {
            console.error('Erreur lors du chargement de la progression:', error);
            return;
        }
        
        // Convertir en objet pour un accès plus facile
        userProgress = {};
        (progress || []).forEach(p => {
            if (p.theme) {
                userProgress[p.theme.id] = p;
            }
        });
        
        console.log('✅ Progression utilisateur chargée:', Object.keys(userProgress).length, 'thèmes');
        
    } catch (error) {
        console.error('Erreur lors du chargement de la progression:', error);
    }
}

// Charger les activités utilisateur
async function loadUserActivities() {
    try {
        if (!currentUser) return;
        
        const { data: activities, error } = await supabaseService.getUserActivities(currentUser.id, 10);
        
        if (error) {
            console.error('Erreur lors du chargement des activités:', error);
            return;
        }
        
        userActivities = activities || [];
        console.log('✅ Activités utilisateur chargées:', userActivities.length);
        
    } catch (error) {
        console.error('Erreur lors du chargement des activités:', error);
    }
}

// Charger les badges utilisateur
async function loadUserBadges() {
    try {
        if (!currentUser) return;
        
        const { data: badges, error } = await supabaseService.getUserBadges(currentUser.id);
        
        if (error) {
            console.error('Erreur lors du chargement des badges:', error);
            return;
        }
        
        userBadges = badges || [];
        console.log('✅ Badges utilisateur chargés:', userBadges.length);
        
    } catch (error) {
        console.error('Erreur lors du chargement des badges:', error);
    }
}

// Gestionnaires des mises à jour en temps réel
function handleProgressUpdate(payload) {
    // Mettre à jour la progression locale
    if (payload.new && payload.new.theme_id) {
        userProgress[payload.new.theme_id] = payload.new;
        updateProgressDisplay();
        updateThemeCards();
    }
}

function handleNewActivity(payload) {
    // Ajouter la nouvelle activité
    if (payload.new) {
        userActivities.unshift(payload.new);
        if (userActivities.length > 10) {
            userActivities.pop();
        }
        updateActivityDisplay();
    }
}

function handleNewBadge(payload) {
    // Ajouter le nouveau badge et afficher une notification
    if (payload.new) {
        userBadges.unshift(payload.new);
        updateBadgesDisplay();
        showBadgeNotification(payload.new);
    }
}

// Affichage et mise à jour de l'interface

// Mettre à jour l'affichage de la progression
function updateProgressDisplay() {
    if (!userProfile) return;
    
    // Mettre à jour le message de bienvenue
    const welcomeNameElem = document.querySelector('h2.text-2xl.md\\:text-3xl span.text-math-primary');
    if (welcomeNameElem) {
        welcomeNameElem.textContent = userProfile.full_name || userProfile.username || 'Utilisateur';
    }
    
    // Calculer la progression globale
    const progressValues = Object.values(userProgress);
    const overallProgress = progressValues.length > 0 ? 
        progressValues.reduce((sum, p) => sum + (p.progress_percentage || 0), 0) / progressValues.length : 0;
    
    // Mettre à jour le cercle de progression
    const progressPercentElem = document.querySelector('.progress-ring__circle');
    if (progressPercentElem) {
        const circumference = 251.2; // 2 * Math.PI * 40
        const offset = circumference - (overallProgress / 100) * circumference;
        progressPercentElem.style.strokeDashoffset = offset;
    }
    
    const progressTextElem = document.querySelector('.relative.w-40.h-40 .text-3xl');
    if (progressTextElem) {
        progressTextElem.textContent = `${Math.round(overallProgress)}%`;
    }
    
    // Mettre à jour les statistiques
    const masteredThemes = progressValues.filter(p => (p.progress_percentage || 0) >= 80).length;
    const totalThemes = allThemes.length || 10;
    
    const masteredElem = document.querySelector('.space-y-3 .flex:first-child .font-medium');
    if (masteredElem) {
        masteredElem.textContent = `${masteredThemes}/${totalThemes}`;
    }
}

// Mettre à jour l'affichage des cartes de thèmes
function updateThemeCards() {
    document.querySelectorAll('.theme-card').forEach((card, index) => {
        const h3Element = card.querySelector('h3');
        if (!h3Element) return;
        
        const themeName = h3Element.textContent;
        
        // Trouver le thème correspondant dans allThemes
        const theme = allThemes.find(t => t.title === themeName);
        if (!theme) return;
        
        const progress = userProgress[theme.id];
        const progressPercentage = progress?.progress_percentage || 0;
        
        // Mettre à jour la barre de progression
        const progressBar = card.querySelector('.bg-gray-200 > div');
        const progressText = card.querySelector('span.text-xs.mt-1');
        
        if (progressBar) {
            progressBar.style.width = `${progressPercentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${progressPercentage}% complété`;
        }
    });
}

// Mettre à jour l'affichage des activités
function updateActivityDisplay() {
    const activityContainer = document.querySelector('.space-y-4');
    if (!activityContainer) return;
    
    // Vider les activités existantes
    activityContainer.innerHTML = '';
    
    // Ajouter les nouvelles activités
    userActivities.forEach(activity => {
        let iconClass, bgClass, textClass, typeLabel;
        
        switch(activity.type) {
            case 'exercise':
                iconClass = 'fa-check-circle';
                bgClass = 'bg-green-100';
                textClass = 'text-green-600';
                typeLabel = 'Exercice réussi';
                break;
            case 'course':
                iconClass = 'fa-book-open';
                bgClass = 'bg-blue-100';
                textClass = 'text-blue-600';
                typeLabel = 'Cours consulté';
                break;
            case 'badge':
                iconClass = 'fa-medal';
                bgClass = 'bg-yellow-100';
                textClass = 'text-yellow-600';
                typeLabel = 'Badge débloqué';
                break;
            case 'diagnostic':
                iconClass = 'fa-clipboard-check';
                bgClass = 'bg-purple-100';
                textClass = 'text-purple-600';
                typeLabel = 'Diagnostic terminé';
                break;
            default:
                iconClass = 'fa-info-circle';
                bgClass = 'bg-gray-100';
                textClass = 'text-gray-600';
                typeLabel = 'Activité';
        }
        
        const activityDate = activity.created_at ? 
            new Date(activity.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            }) : 'Récemment';
        
        const activityHTML = `
            <div class="flex items-start">
                <div class="${bgClass} ${textClass} p-2 rounded-full mr-4">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div class="flex-1">
                    <div class="flex justify-between items-start">
                        <h4 class="font-medium text-gray-800">${typeLabel}</h4>
                        <span class="text-xs text-gray-500">${activityDate}</span>
                    </div>
                    <p class="text-sm text-gray-600">${activity.title}</p>
                    <div class="mt-1">
                        ${activity.score ? 
                            `<span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Score: ${activity.score}%</span>` : 
                            activity.duration ? 
                            `<span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">${activity.duration}</span>` : 
                            activity.type === 'badge' ? 
                            `<span class="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Nouveau</span>` : 
                            ''}
                    </div>
                </div>
            </div>
        `;
        
        activityContainer.innerHTML += activityHTML;
    });
}

// Mettre à jour l'affichage des badges
function updateBadgesDisplay() {
    const badgeContainer = document.querySelector('.grid.grid-cols-4.gap-3');
    if (!badgeContainer || !userBadges) return;
    
    const badgeDivs = badgeContainer.querySelectorAll('div.p-2');
    const earnedBadgeIds = userBadges.map(ub => ub.badge?.id || ub.badge_id);
    
    badgeDivs.forEach((div, index) => {
        const badgeName = div.querySelector('p.text-xs.text-gray-600');
        if (!badgeName) return;
        
        const badgeNameText = badgeName.textContent.toLowerCase();
        let badgeId = '';
        
        // Mapper les noms affichés aux IDs de badges
        switch(badgeNameText) {
            case 'débutant': badgeId = 'debutant'; break;
            case 'rapide': badgeId = 'rapide'; break;
            case 'précis': badgeId = 'precis'; break;
            case 'expert': badgeId = 'expert'; break;
        }
        
        const isEarned = earnedBadgeIds.includes(badgeId);
        const badgeIcon = div.querySelector('.w-12.h-12');
        
        if (isEarned && badgeIcon) {
            badgeIcon.classList.remove('bg-gray-200', 'text-gray-400');
            badgeIcon.classList.add('bg-yellow-100', 'text-yellow-600');
            div.classList.remove('relative');
            
            // Supprimer l'icône de verrouillage
            const lockIcon = div.querySelector('.absolute');
            if (lockIcon) {
                lockIcon.remove();
            }
        }
    });
}

// Mettre à jour les informations utilisateur
function updateUserInfo() {
    if (!userProfile) return;
    
    // Mettre à jour le niveau utilisateur
    const userLevelElem = document.querySelector('#userDropdown p.text-math-light');
    if (userLevelElem) {
        userLevelElem.textContent = `Niveau: ${userProfile.level}`;
    }
    
    // Mettre à jour la classe
    const userClassElem = document.querySelector('#userDropdown p.text-white');
    if (userClassElem) {
        userClassElem.textContent = `Élève de ${userProfile.class}`;
    }
}

// Fonctions d'action utilisateur

// Mettre à jour la progression
async function updateProgress(themeId, progressPercentage, exercisesCompleted = 0) {
    try {
        if (!currentUser) return;
        
        const progressData = {
            progress_percentage: progressPercentage,
            exercises_completed: exercisesCompleted,
            total_exercises: 10 // valeur par défaut
        };
        
        const { data, error } = await supabaseService.updateProgress(currentUser.id, themeId, progressData);
        
        if (error) {
            console.error('Erreur lors de la mise à jour de la progression:', error);
            return;
        }
        
        console.log('✅ Progression mise à jour:', themeId, progressPercentage + '%');
        
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la progression:', error);
    }
}

// Ajouter une activité
async function addActivity(type, title, details = {}) {
    try {
        if (!currentUser) return;
        
        const activityData = {
            type: type,
            title: title,
            description: details.description || null,
            score: details.score || null,
            duration: details.duration || null,
            theme_id: details.themeId || null
        };
        
        const { data, error } = await supabaseService.addActivity(currentUser.id, activityData);
        
        if (error) {
            console.error('Erreur lors de l\'ajout de l\'activité:', error);
            return;
        }
        
        console.log('✅ Activité ajoutée:', title);
        
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'activité:', error);
    }
}

// Attribuer un badge
async function awardBadge(badgeId) {
    try {
        if (!currentUser) return;
        
        const { data, error } = await supabaseService.awardBadge(currentUser.id, badgeId);
        
        if (error) {
            // Ignorer l'erreur si le badge est déjà attribué
            if (error.code === '23505') {
                console.log('Badge déjà attribué:', badgeId);
                return;
            }
            console.error('Erreur lors de l\'attribution du badge:', error);
            return;
        }
        
        console.log('✅ Badge attribué:', badgeId);
        
    } catch (error) {
        console.error('Erreur lors de l\'attribution du badge:', error);
    }
}

// Afficher une notification de badge
function showBadgeNotification(badgeData) {
    const badge = badgeData.badge || badgeData;
    
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-lg shadow-lg z-50 max-w-sm';
    notification.innerHTML = `
        <div class="flex items-center">
            <div class="bg-yellow-400 text-white p-2 rounded-full mr-3">
                <i class="fas fa-trophy"></i>
            </div>
            <div>
                <h4 class="font-medium text-yellow-800">Nouveau badge !</h4>
                <p class="text-sm text-yellow-700">${badge.name}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
        notification.remove();
    }, 5000);
    
    // Afficher des confettis
    showConfetti();
}

// Gestion de l'authentification

// Afficher le modal de connexion
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('hidden');
        
        // Mettre à jour le contenu pour Supabase
        const modalContent = modal.querySelector('.bg-white');
        if (modalContent) {
            modalContent.innerHTML = `
                <h3 class="text-xl font-bold text-math-dark mb-4">Connexion à MathMaster</h3>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-medium mb-2" for="email">
                        Email
                    </label>
                    <input type="email" id="email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-math-primary" placeholder="votre@email.com">
                </div>
                <div class="mb-6">
                    <label class="block text-gray-700 text-sm font-medium mb-2" for="password">
                        Mot de passe
                    </label>
                    <input type="password" id="password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-math-primary" placeholder="Mot de passe">
                </div>
                <div class="flex justify-between items-center mb-4">
                    <button id="signUpBtn" class="text-math-primary hover:text-math-secondary text-sm">
                        Créer un compte
                    </button>
                    <button id="loginBtn" class="btn-gradient text-white px-6 py-2 rounded-lg font-medium shadow-md">
                        Se connecter
                    </button>
                </div>
                <div class="text-center">
                    <button id="demoBtn" class="text-gray-500 hover:text-gray-700 text-sm">
                        Essayer en mode démo
                    </button>
                </div>
            `;
            
            // Ajouter les gestionnaires d'événements
            setupLoginHandlers();
        }
    }
}

// Masquer le modal de connexion
function hideLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Configuration des gestionnaires de connexion
function setupLoginHandlers() {
    const loginBtn = document.getElementById('loginBtn');
    const signUpBtn = document.getElementById('signUpBtn');
    const demoBtn = document.getElementById('demoBtn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }
    
    if (signUpBtn) {
        signUpBtn.addEventListener('click', handleSignUp);
    }
    
    if (demoBtn) {
        demoBtn.addEventListener('click', handleDemoLogin);
    }
}

// Gestionnaire de connexion
async function handleLogin() {
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;
    
    if (!email || !password) {
        showError('Veuillez remplir tous les champs');
        return;
    }
    
    showLoading('Connexion en cours...');
    
    try {
        const { data, error } = await supabaseService.signIn(email, password);
        
        if (error) {
            throw error;
        }
        
        console.log('✅ Connexion réussie');
        hideLoading();
        
    } catch (error) {
        console.error('❌ Erreur de connexion:', error);
        hideLoading();
        showError('Email ou mot de passe incorrect');
    }
}

// Gestionnaire d'inscription
async function handleSignUp() {
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;
    
    if (!email || !password) {
        showError('Veuillez remplir tous les champs');
        return;
    }
    
    if (password.length < 6) {
        showError('Le mot de passe doit contenir au moins 6 caractères');
        return;
    }
    
    showLoading('Création du compte...');
    
    try {
        const userData = {
            full_name: email.split('@')[0],
            class: '3ème',
            level: 'Débutant'
        };
        
        const { data, error } = await supabaseService.signUp(email, password, userData);
        
        if (error) {
            throw error;
        }
        
        console.log('✅ Inscription réussie');
        hideLoading();
        showSuccess('Compte créé avec succès ! Vérifiez votre email.');
        
    } catch (error) {
        console.error('❌ Erreur d\'inscription:', error);
        hideLoading();
        showError('Erreur lors de la création du compte');
    }
}

// Gestionnaire de connexion démo
async function handleDemoLogin() {
    showLo
