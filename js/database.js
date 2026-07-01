/**
 * Portfolio Database Engine (Client-Side JSON Database)
 * Emulates a relational database using localStorage with structured collections.
 */

// Default Seed Projects (Sumit's initial premium works)
const SEED_PROJECTS = [
    {
        id: 1,
        title: "SketchAI — AI Powered Image Transformation Platform",
        category: "full-stack",
        tags: ["Python", "FastAPI", "Spring Boot", "OpenCV", "AI"],
        shortDesc: "AI-powered image transformation platform featuring sketch generation, background replacement, object removal, Ghibli art generation, and enhancement.",
        role: "Lead AI & Full Stack Developer",
        client: "Personal Major Project",
        timeline: "2025 – Present",
        gradient: ["#6e44ff", "#00f2fe"],
        icon: `<img src="https://i.ibb.co/Tqpq5Sr5/sketchai.png" alt="SketchAI" style="width:100%;height:100%;object-fit:cover;">`,
        longDesc: "SketchAI is a locally hosted AI image processing platform built with a hybrid architecture using Spring Boot, Python FastAPI, TensorFlow, and OpenCV. It performs advanced image manipulation such as sketch conversion, background removal, object inpainting, Ghibli-style art generation, and image enhancement without relying on cloud APIs. The system is optimized for low VRAM GPUs and supports offline AI workflows.",
        features: [
            "AI sketch generation and style transformation",
            "Background removal and replacement",
            "Object removal using inpainting",
            "Local AI processing with no cloud dependency",
            "Image enhancement and restoration pipeline"
        ],
        github: "https://github.com/SumitWagh7/SketchAi",
        demo: "https://github.com/SumitWagh7/SketchAi",
        images: [
            "https://raw.githubusercontent.com/SumitWagh7/SumitWagh7.github.io/main/images/sketchai/sketchai_landingpage%20(1).png",
            "https://raw.githubusercontent.com/SumitWagh7/SumitWagh7.github.io/main/images/sketchai/sketchai_smartsketch.png",
            "https://raw.githubusercontent.com/SumitWagh7/SumitWagh7.github.io/main/images/sketchai/sketchai_bgreplacement.png",
            "https://raw.githubusercontent.com/SumitWagh7/SumitWagh7.github.io/main/images/sketchai/sketchai_ghibli_style_art.png"
        ],
        captions: [
            "SketchAI Landing Page",
            "Smart Sketch Generation",
            "Background Replacement",
            "Ghibli Style Transformation"
        ]
    },
    {
        id: 2,
        title: "CineBook – AI Movie Ticket Booking System",
        category: "full-stack",
        tags: ["Java", "Spring Boot", "Angular", "MySQL", "AI Chatbot"],
        shortDesc: "A smart movie ticket booking platform with AI chatbot assistance, seat management, ticket generation, and admin dashboard.",
        role: "Full Stack Developer",
        client: "Academic Major Project",
        timeline: "2025 - 2026",
        gradient: ["#00f2fe", "#ff2e9b"],
        icon: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="16" fill="url(#p2-grad)" />
            <!-- Clapperboard top -->
            <path d="M25 35 L75 35 L70 25 L30 25 Z" fill="white" opacity="0.9" />
            <!-- Clapperboard stripes -->
            <path d="M35 25 L40 35 M50 25 L55 35 M65 25 L70 35" stroke="#00f2fe" stroke-width="3" stroke-linecap="round" />
            <!-- Ticket icon base -->
            <rect x="25" y="42" width="50" height="30" rx="6" stroke="white" stroke-width="4" />
            <circle cx="25" cy="57" r="6" fill="#00f2fe" />
            <circle cx="75" cy="57" r="6" fill="#ff2e9b" />
            <!-- Ticket dash line -->
            <line x1="38" y1="57" x2="62" y2="57" stroke="white" stroke-width="3" stroke-dasharray="4 4" />
            <defs>
                <linearGradient id="p2-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#00f2fe" />
                    <stop offset="1" stop-color="#ff2e9b" />
                </linearGradient>
            </defs>
        </svg>`,
        longDesc: "CineBook is an intelligent movie ticket booking platform developed using Spring Boot, Angular, and MySQL. The platform enables users to browse movies, select theaters, reserve seats, complete bookings, and receive digital tickets. An AI chatbot assists users with movie recommendations and booking support.",
        features: [
            "Smart AI chatbot for recommendations",
            "Real-time seat selection and booking",
            "Admin dashboard for movie management",
            "Digital ticket generation with QR",
            "Secure database-driven booking workflow"
        ],
        github: "https://github.com/SumitWagh7/CineBook-",
        demo: "https://github.com/SumitWagh7/CineBook-",
        images: [
            "https://raw.githubusercontent.com/SumitWagh7/SumitWagh7.github.io/main/images/cinebook/Data_analize_page.png",
            "https://raw.githubusercontent.com/SumitWagh7/SumitWagh7.github.io/main/images/cinebook/Payement_method.png",
            "https://raw.githubusercontent.com/SumitWagh7/SumitWagh7.github.io/main/images/cinebook/admindshboard.png",
            "https://raw.githubusercontent.com/SumitWagh7/SumitWagh7.github.io/main/images/cinebook/movie-choose_page.png",
            "https://raw.githubusercontent.com/SumitWagh7/SumitWagh7.github.io/main/images/cinebook/moviebooking_page.png",
            "https://raw.githubusercontent.com/SumitWagh7/SumitWagh7.github.io/main/images/cinebook/movies_add_page.png",
            "https://raw.githubusercontent.com/SumitWagh7/SumitWagh7.github.io/main/images/cinebook/seat_selection_page.png",
            "https://raw.githubusercontent.com/SumitWagh7/SumitWagh7.github.io/main/images/cinebook/theater_add_page.png",
            "https://raw.githubusercontent.com/SumitWagh7/SumitWagh7.github.io/main/images/cinebook/ticket_conformation_page.png"
        ],
        captions: [
            "Analytics Dashboard",
            "Payment Method",
            "Admin Dashboard",
            "Movie Selection",
            "Booking Page",
            "Add Movies",
            "Seat Selection",
            "Theater Management",
            "Ticket Confirmation"
        ]
    }
];

class PortfolioDB {
    constructor() {
        this.projectKey = 'portfolio_db_projects';
        this.messageKey = 'portfolio_db_messages';
        
        this.init();
    }

    init() {
        // Force database reset once during initialization to remove old project cache
        localStorage.removeItem('portfolio_db_projects');
        localStorage.setItem('portfolio_db_projects', JSON.stringify(SEED_PROJECTS));

        // Initialize messages table if empty
        if (!localStorage.getItem(this.messageKey)) {
            localStorage.setItem(this.messageKey, JSON.stringify([]));
        }
    }

    // ==========================================================================
    // Projects Collection CRUD APIs
    // ==========================================================================
    getProjects() {
        return JSON.parse(localStorage.getItem(this.projectKey) || '[]');
    }

    insertProject(proj) {
        const projects = this.getProjects();
        
        // Auto-increment ID
        const maxId = projects.reduce((max, p) => p.id > max ? p.id : max, 0);
        const newId = maxId + 1;

        // Choose linear gradients based on category or ID
        const gradients = [
            ["#6e44ff", "#00f2fe"], // purple to cyan
            ["#00f2fe", "#ff2e9b"], // cyan to pink
            ["#ff2e9b", "#6e44ff"]  // pink to purple
        ];
        const grad = gradients[(newId - 1) % gradients.length];

        // Generate abstract themed code/design SVG
        const customSvg = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="16" fill="url(#p${newId}-grad)" />
            <rect x="25" y="25" width="50" height="50" rx="8" stroke="white" stroke-width="4" stroke-dasharray="4 2" />
            <circle cx="50" cy="50" r="10" fill="white" />
            <defs>
                <linearGradient id="p${newId}-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop stop-color="${grad[0]}" />
                    <stop offset="1" stop-color="${grad[1]}" />
                </linearGradient>
            </defs>
        </svg>`;

        const newProject = {
            id: newId,
            title: proj.title,
            category: proj.category,
            tags: proj.tags || ["HTML", "CSS", "JS"],
            shortDesc: proj.shortDesc,
            role: proj.role || "Developer",
            client: proj.client || "Client R&D",
            timeline: proj.timeline || "Recent Project (1 Month)",
            gradient: grad,
            icon: customSvg,
            longDesc: proj.longDesc || proj.shortDesc,
            features: proj.features || ["Feature 1", "Feature 2", "Feature 3"],
            github: proj.github || "https://github.com",
            demo: proj.demo || "https://google.com"
        };

        projects.push(newProject);
        localStorage.setItem(this.projectKey, JSON.stringify(projects));
        
        // Dispatch event for UI updates
        document.dispatchEvent(new CustomEvent('databaseUpdated', { detail: { type: 'projects' } }));
        return newProject;
    }

    deleteProject(id) {
        let projects = this.getProjects();
        projects = projects.filter(p => p.id !== parseInt(id));
        localStorage.setItem(this.projectKey, JSON.stringify(projects));
        
        document.dispatchEvent(new CustomEvent('databaseUpdated', { detail: { type: 'projects' } }));
    }

    // ==========================================================================
    // Messages Collection CRUD APIs
    // ==========================================================================
    getMessages() {
        return JSON.parse(localStorage.getItem(this.messageKey) || '[]');
    }

    insertMessage(msg) {
        const messages = this.getMessages();
        const newMessage = {
            id: Date.now(),
            name: msg.name,
            email: msg.email,
            message: msg.message,
            timestamp: new Date().toLocaleString()
        };

        messages.unshift(newMessage); // Insert at start
        localStorage.setItem(this.messageKey, JSON.stringify(messages));
        
        document.dispatchEvent(new CustomEvent('databaseUpdated', { detail: { type: 'messages' } }));
        return newMessage;
    }

    deleteMessage(id) {
        let messages = this.getMessages();
        messages = messages.filter(m => m.id !== parseInt(id));
        localStorage.setItem(this.messageKey, JSON.stringify(messages));
        
        document.dispatchEvent(new CustomEvent('databaseUpdated', { detail: { type: 'messages' } }));
    }

    // Reset database to seeds
    resetDatabase() {
        localStorage.setItem(this.projectKey, JSON.stringify(SEED_PROJECTS));
        localStorage.setItem(this.messageKey, JSON.stringify([]));
        
        document.dispatchEvent(new CustomEvent('databaseUpdated', { detail: { type: 'all' } }));
    }
}

// Instantiate database globally
window.db = new PortfolioDB();
