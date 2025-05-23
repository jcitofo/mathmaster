/**
 * MathMaster 3ème - Données pour l'application
 * Ce fichier contient les données structurées pour le contenu éducatif
 */

// Structure des données pour les thèmes et le contenu d'apprentissage
const courseData = {
    // Thème: Calcul numérique
    "calculNumerique": {
        title: "Calcul numérique",
        icon: "calculator",
        iconBg: "blue",
        description: "Travail sur les opérations, les nombres relatifs, les fractions et les puissances.",
        subtopics: [
            {
                id: "operations",
                title: "Opérations",
                content: `
                    <h3>Les opérations fondamentales</h3>
                    <p>En mathématiques, les quatre opérations fondamentales sont l'addition (+), la soustraction (-), la multiplication (×) et la division (÷).</p>
                    <div class="math-formula">
                        <p>Addition: a + b</p>
                        <p>Soustraction: a - b</p>
                        <p>Multiplication: a × b</p>
                        <p>Division: a ÷ b</p>
                    </div>
                    <h3>Priorités opératoires</h3>
                    <p>Les priorités opératoires déterminent l'ordre dans lequel les opérations doivent être effectuées.</p>
                    <ol>
                        <li>Parenthèses</li>
                        <li>Puissances</li>
                        <li>Multiplications et divisions (de gauche à droite)</li>
                        <li>Additions et soustractions (de gauche à droite)</li>
                    </ol>
                `
            },
            {
                id: "fractions",
                title: "Fractions",
                content: `
                    <h3>Définition</h3>
                    <p>Une fraction est une expression de la forme a/b où a est le numérateur et b le dénominateur (b ≠ 0).</p>
                    <h3>Opérations sur les fractions</h3>
                    <div class="math-formula">
                        <p>Addition: a/b + c/d = (ad + bc)/bd</p>
                        <p>Soustraction: a/b - c/d = (ad - bc)/bd</p>
                        <p>Multiplication: a/b × c/d = ac/bd</p>
                        <p>Division: a/b ÷ c/d = a/b × d/c = ad/bc</p>
                    </div>
                `
            },
            {
                id: "puissances",
                title: "Puissances",
                content: `
                    <h3>Définition</h3>
                    <p>Pour tout nombre a et tout entier naturel n, a<sup>n</sup> représente le produit de n facteurs égaux à a.</p>
                    <div class="math-formula">
                        <p>a<sup>n</sup> = a × a × ... × a (n fois)</p>
                        <p>a<sup>0</sup> = 1 (pour a ≠ 0)</p>
                        <p>a<sup>1</sup> = a</p>
                    </div>
                    <h3>Propriétés des puissances</h3>
                    <div class="math-formula">
                        <p>a<sup>m</sup> × a<sup>n</sup> = a<sup>m+n</sup></p>
                        <p>a<sup>m</sup> ÷ a<sup>n</sup> = a<sup>m-n</sup></p>
                        <p>(a<sup>m</sup>)<sup>n</sup> = a<sup>m×n</sup></p>
                    </div>
                `
            }
        ],
        exercises: [
            {
                id: "ex-calc-num-1",
                title: "Calculer des expressions numériques",
                difficulty: "Facile",
                duration: 5,
                questions: [
                    {
                        question: "Calculer : 3 + 4 × 2",
                        options: ["11", "14", "10", "8"],
                        answer: 0,
                        explanation: "D'après les priorités opératoires, on effectue d'abord la multiplication : 3 + 4 × 2 = 3 + 8 = 11"
                    },
                    {
                        question: "Calculer : (7 - 3) × 5 ÷ 2",
                        options: ["10", "5", "7", "2"],
                        answer: 0,
                        explanation: "On calcule d'abord la parenthèse, puis on effectue les opérations de gauche à droite : (7 - 3) × 5 ÷ 2 = 4 × 5 ÷ 2 = 20 ÷ 2 = 10"
                    }
                ]
            },
            {
                id: "ex-calc-num-2",
                title: "Opérations sur les fractions",
                difficulty: "Moyenne",
                duration: 10,
                questions: [
                    {
                        question: "Calculer : 3/4 + 1/6",
                        options: ["4/10", "5/6", "11/12", "2/3"],
                        answer: 2,
                        explanation: "3/4 + 1/6 = (3×6 + 1×4)/(4×6) = (18 + 4)/24 = 22/24 = 11/12"
                    }
                ]
            }
        ],
        dnbExercises: [
            {
                id: "dnb-calc-num-1",
                title: "Exercice DNB 2021 - Métropole",
                description: "Calculer et donner le résultat sous la forme d'une fraction irréductible",
                content: `
                    <div class="math-formula">
                        <p>A = 2/3 - 1/5</p>
                        <p>B = 3/4 × (1 - 1/3)</p>
                    </div>
                `
            }
        ]
    },
    
    // Thème: Calcul littéral
    "calculLitteral": {
        title: "Calcul littéral",
        icon: "superscript",
        iconBg: "green",
        description: "Manipuler des expressions avec des lettres : réduction, développement, factorisation.",
        subtopics: [
            {
                id: "expressions",
                title: "Expressions littérales",
                content: `
                    <h3>Définition</h3>
                    <p>Une expression littérale est une expression mathématique contenant des nombres et des lettres reliés par des opérations.</p>
                    <h3>Exemples</h3>
                    <div class="math-formula">
                        <p>3x + 2</p>
                        <p>a² - b²</p>
                        <p>2(x + y)</p>
                    </div>
                `
            },
            {
                id: "developpement",
                title: "Développement",
                content: `
                    <h3>Principe</h3>
                    <p>Développer une expression littérale consiste à transformer un produit en une somme à l'aide de la distributivité.</p>
                    <h3>Formules de distributivité</h3>
                    <div class="math-formula">
                        <p>k(a + b) = ka + kb</p>
                        <p>k(a - b) = ka - kb</p>
                        <p>(a + b)(c + d) = ac + ad + bc + bd</p>
                    </div>
                    <h3>Exemples</h3>
                    <div class="math-formula">
                        <p>2(x + 3) = 2x + 6</p>
                        <p>3(x - 2) = 3x - 6</p>
                        <p>(x + 2)(x + 3) = x² + 3x + 2x + 6 = x² + 5x + 6</p>
                    </div>
                `
            },
            {
                id: "factorisation",
                title: "Factorisation",
                content: `
                    <h3>Principe</h3>
                    <p>Factoriser une expression littérale consiste à transformer une somme en un produit.</p>
                    <h3>Formules de factorisation</h3>
                    <div class="math-formula">
                        <p>ka + kb = k(a + b)</p>
                        <p>ka - kb = k(a - b)</p>
                        <p>a² - b² = (a - b)(a + b)</p>
                    </div>
                    <h3>Exemples</h3>
                    <div class="math-formula">
                        <p>2x + 6 = 2(x + 3)</p>
                        <p>3x - 6 = 3(x - 2)</p>
                        <p>x² - 4 = x² - 2² = (x - 2)(x + 2)</p>
                    </div>
                `
            }
        ],
        exercises: [
            {
                id: "ex-calc-lit-1",
                title: "Développer des expressions",
                difficulty: "Moyenne",
                duration: 8,
                questions: [
                    {
                        question: "Développer l'expression : 3(2x + 5)",
                        options: ["6x + 15", "6x + 5", "5x + 15", "3x + 15"],
                        answer: 0,
                        explanation: "3(2x + 5) = 3 × 2x + 3 × 5 = 6x + 15"
                    },
                    {
                        question: "Développer l'expression : (x + 2)(x - 3)",
                        options: ["x² - x - 6", "x² - 3x + 2", "x² - x + 6", "x² + 5x - 6"],
                        answer: 0,
                        explanation: "(x + 2)(x - 3) = x² - 3x + 2x - 6 = x² - x - 6"
                    }
                ]
            },
            {
                id: "ex-calc-lit-2",
                title: "Factoriser des expressions",
                difficulty: "Difficile",
                duration: 10,
                questions: [
                    {
                        question: "Factoriser l'expression : 3x + 15",
                        options: ["3(x + 5)", "3(x + 15)", "3x(1 + 5)", "3 + x + 15"],
                        answer: 0,
                        explanation: "3x + 15 = 3x + 3 × 5 = 3(x + 5)"
                    }
                ]
            }
        ],
        dnbExercises: [
            {
                id: "dnb-calc-lit-1",
                title: "Exercice DNB 2022 - Métropole",
                description: "Calcul littéral et développement d'expressions",
                content: `
                    <p>Dans cet exercice, x désigne un nombre.</p>
                    <ol>
                        <li>Développer et réduire l'expression A = (2x - 3)(x + 1)</li>
                        <li>Factoriser l'expression B = x² - 9</li>
                        <li>Montrer que (5x - 4)² - (3x)² = 25x² - 40x + 16 - 9x² = 16x² - 40x + 16</li>
                    </ol>
                `
            }
        ]
    },
    
    // Thème: Pythagore
    "pythagore": {
        title: "Pythagore",
        icon: "ruler-combined",
        iconBg: "teal",
        description: "Théorème de Pythagore et ses applications en géométrie.",
        subtopics: [
            {
                id: "theoreme",
                title: "Théorème de Pythagore",
                content: `
                    <h3>Énoncé</h3>
                    <p>Dans un triangle rectangle, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés.</p>
                    <div class="math-formula">
                        <p>Si ABC est un triangle rectangle en A, alors :</p>
                        <p>BC² = AB² + AC²</p>
                    </div>
                    <h3>Application</h3>
                    <p>Le théorème de Pythagore permet de :</p>
                    <ul>
                        <li>Calculer la longueur de l'hypoténuse connaissant les deux autres côtés</li>
                        <li>Calculer la longueur d'un côté de l'angle droit connaissant l'hypoténuse et l'autre côté</li>
                    </ul>
                `
            },
            {
                id: "reciproque",
                title: "Réciproque du théorème de Pythagore",
                content: `
                    <h3>Énoncé</h3>
                    <p>Si, dans un triangle, le carré d'un côté est égal à la somme des carrés des deux autres côtés, alors ce triangle est rectangle et l'angle droit est opposé au plus grand côté.</p>
                    <div class="math-formula">
                        <p>Si BC² = AB² + AC², alors le triangle ABC est rectangle en A.</p>
                    </div>
                    <h3>Application</h3>
                    <p>La réciproque du théorème de Pythagore permet de vérifier si un triangle est rectangle.</p>
                `
            }
        ],
        exercises: [
            {
                id: "ex-pythagore-1",
                title: "Calculer des longueurs",
                difficulty: "Facile",
                duration: 5,
                questions: [
                    {
                        question: "Dans un triangle ABC rectangle en A, on a AB = 3 cm et AC = 4 cm. Calculer BC.",
                        options: ["5 cm", "7 cm", "9 cm", "12 cm"],
                        answer: 0,
                        explanation: "D'après le théorème de Pythagore : BC² = AB² + AC² = 3² + 4² = 9 + 16 = 25, donc BC = 5 cm"
                    }
                ]
            },
            {
                id: "ex-pythagore-2",
                title: "Vérifier si un triangle est rectangle",
                difficulty: "Moyenne",
                duration: 8,
                questions: [
                    {
                        question: "Un triangle a pour côtés 5 cm, 12 cm et 13 cm. Est-il rectangle ?",
                        options: ["Oui, en angle droit au sommet opposé au côté de 13 cm", "Oui, en angle droit au sommet opposé au côté de 12 cm", "Oui, en angle droit au sommet opposé au côté de 5 cm", "Non, ce triangle n'est pas rectangle"],
                        answer: 0,
                        explanation: "Vérifions avec la réciproque de Pythagore : 13² = 169, et 5² + 12² = 25 + 144 = 169. Donc 13² = 5² + 12², le triangle est rectangle en angle droit au sommet opposé au côté de 13 cm."
                    }
                ]
            }
        ],
        dnbExercises: [
            {
                id: "dnb-pythagore-1",
                title: "Exercice DNB 2021 - Métropole",
                description: "Application du théorème de Pythagore",
                content: `
                    <p>Dans un repère orthonormé (O, I, J), on considère les points A(3, 1) et B(7, 5).</p>
                    <ol>
                        <li>Placer les points A et B dans le repère.</li>
                        <li>Calculer la distance AB.</li>
                    </ol>
                `
            }
        ]
    }
};

// Données pour les exercices du DNB
const dnbData = {
    "2021": {
        "metropole": {
            id: "dnb-2021-metropole",
            title: "Brevet des collèges 2021 - Métropole",
            duration: 120,
            parts: [
                {
                    title: "Partie 1 : Calcul numérique et algébrique",
                    exercises: [courseData.calculNumerique.dnbExercises[0].id, courseData.calculLitteral.dnbExercises[0].id]
                },
                {
                    title: "Partie 2 : Géométrie",
                    exercises: [courseData.pythagore.dnbExercises[0].id]
                }
            ]
        }
    }
};

// Progression recommandée par niveau
const learningPaths = {
    "debutant": [
        {
            theme: "calculNumerique", 
            subtopics: ["operations", "fractions"],
            exercises: ["ex-calc-num-1"]
        },
        {
            theme: "pythagore", 
            subtopics: ["theoreme"],
            exercises: ["ex-pythagore-1"]
        },
        {
            theme: "calculLitteral", 
            subtopics: ["expressions", "developpement"],
            exercises: ["ex-calc-lit-1"]
        }
    ],
    "intermediaire": [
        {
            theme: "calculNumerique", 
            subtopics: ["operations", "fractions", "puissances"],
            exercises: ["ex-calc-num-1", "ex-calc-num-2"]
        },
        {
            theme: "calculLitteral", 
            subtopics: ["expressions", "developpement", "factorisation"],
            exercises: ["ex-calc-lit-1", "ex-calc-lit-2"]
        },
        {
            theme: "pythagore", 
            subtopics: ["theoreme", "reciproque"],
            exercises: ["ex-pythagore-1", "ex-pythagore-2"]
        }
    ],
    "avance": [
        {
            theme: "calculNumerique", 
            subtopics: ["operations", "fractions", "puissances"],
            exercises: ["ex-calc-num-1", "ex-calc-num-2"]
        },
        {
            theme: "calculLitteral", 
            subtopics: ["expressions", "developpement", "factorisation"],
            exercises: ["ex-calc-lit-1", "ex-calc-lit-2"]
        },
        {
            theme: "pythagore", 
            subtopics: ["theoreme", "reciproque"],
            exercises: ["ex-pythagore-1", "ex-pythagore-2"]
        },
        {
            theme: "dnb", 
            exercises: ["dnb-2021-metropole"]
        }
    ]
};

// Questions pour le diagnostic initial
const diagnosticQuestions = [
    {
        id: "diag-1",
        theme: "calculNumerique",
        question: "Calculer : 7 × (3 + 4) - 5",
        options: ["44", "49", "24", "42"],
        answer: 2,
        explanation: "7 × (3 + 4) - 5 = 7 × 7 - 5 = 49 - 5 = 44"
    },
    {
        id: "diag-2",
        theme: "calculLitteral",
        question: "Développer : 2(x - 3) + 4",
        options: ["2x - 6 + 4", "2x - 2", "2x + 4", "2x - 6"],
        answer: 0,
        explanation: "2(x - 3) + 4 = 2x - 6 + 4 = 2x - 2"
    },
    {
        id: "diag-3",
        theme: "pythagore",
        question: "Dans un triangle rectangle en A, on a AB = 5 cm et AC = 12 cm. Calculer BC.",
        options: ["17 cm", "13 cm", "60 cm", "7 cm"],
        answer: 1,
        explanation: "D'après le théorème de Pythagore : BC² = AB² + AC² = 5² + 12² = 25 + 144 = 169, donc BC = 13 cm"
    }
];

// Exporter les données pour utilisation dans l'application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        courseData,
        dnbData,
        learningPaths,
        diagnosticQuestions
    };
}
