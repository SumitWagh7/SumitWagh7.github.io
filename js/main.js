/**
 * Personal Portfolio Main Orchestrator
 * Coordinates Theme Toggling, Loading screens, Scroll Reveals, Typewriting, and Database Control Panels
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialise Core Subsystem Classes
    const particles = new ParticlesBackground('particles-canvas');
    const projects = new ProjectsManager();
    const contact = new ContactFormHandler();

    // 2. Hide preloader when everything is ready
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('loaded');
            // Remove from DOM after transition completes to save resources
            setTimeout(() => preloader.remove(), 600);
        }
    });

    // 3. Theme Toggling (Dark / Light) System
    const themeBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const targetTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // Set DOM property
            document.documentElement.setAttribute('data-theme', targetTheme);
            localStorage.setItem('portfolio-theme', targetTheme);

            // Dispatch custom event to notify Particles System
            const themeEvent = new CustomEvent('themeChanged', { 
                detail: { theme: targetTheme } 
            });
            document.dispatchEvent(themeEvent);
        });
    }

    // 4. Typewriter Title Animation
    const typeTarget = document.getElementById('typing-text');
    const words = [
        "Java & Spring Boot Developer",
        "Angular Frontend Engineer",
        "Python & C++ Programmer",
        "Computer Science Student"
    ];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function handleTyping() {
        if (!typeTarget) return;

        const currentWord = words[wordIdx];
        
        if (isDeleting) {
            typeTarget.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 50; // Deleting is faster
        } else {
            typeTarget.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 100;
        }

        // State adjustments
        if (!isDeleting && charIdx === currentWord.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at end of word
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(handleTyping, typingSpeed);
    }
    
    // Start typing loop
    setTimeout(handleTyping, 1000);

    // 5. Navigation Bar Scrolled styling & Back to Top controls
    const header = document.querySelector('.header');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Sticky scrolled header state
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top floating button visibility
        if (scrollY > 600) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 6. Responsive Menu Hamburger Actions
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('open');
            navLinks.classList.toggle('open');
        });

        // Close menu panel when clicking a link
        links.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('open');
                navLinks.classList.remove('open');
            });
        });

        // Close menu panel if touch action hits backdrop outside container
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('open') && 
                !navLinks.contains(e.target) && 
                !menuBtn.contains(e.target)) {
                menuBtn.classList.remove('open');
                navLinks.classList.remove('open');
            }
        });
    }

    // 7. High-Performance Intersection Observer for Scroll Reveals & Active Nav States
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');
    const reveals = document.querySelectorAll('.reveal');
    const skillsSection = document.getElementById('about');
    let skillsAnimated = false;

    // Trigger skills loading bars animations
    function animateSkills() {
        const skillFills = document.querySelectorAll('.skill-progress-fill');
        skillFills.forEach(fill => {
            const targetWidth = fill.getAttribute('data-width');
            fill.style.width = targetWidth;
        });
        skillsAnimated = true;
    }

    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: '0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Set active class on navbar links
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    }
                });

                // Load skill progress bars when viewing About section
                if (id === 'about' && !skillsAnimated) {
                    animateSkills();
                }
            }
        });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));

    // Observe Scroll Reveals elements
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                // Unobserve once revealed to maintain high frame rate scroll speeds
                revealObserver.unobserve(entry.target);
            }
        });
    }, { root: null, threshold: 0.05 });

    reveals.forEach(rev => revealObserver.observe(rev));

    // ==========================================================================
    // 8. Developer Database Admin Control Panel Controller
    // ==========================================================================
    const dbTrigger = document.getElementById('db-trigger');
    const dbModal = document.getElementById('db-modal');
    const dbModalClose = dbModal ? dbModal.querySelector('.modal-close-btn') : null;
    const dbModalBackdrop = dbModal ? dbModal.querySelector('.modal-backdrop') : null;
    
    // Tab Controllers
    const tabButtons = document.querySelectorAll('.console-sidebar .console-tab-btn');
    const consoleSections = document.querySelectorAll('.console-main-pane .console-section');

    if (dbTrigger && dbModal) {
        // Toggle Database Modal Open
        dbTrigger.addEventListener('click', () => {
            dbModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock main scroll
            renderDatabaseDashboard();
        });

        // Toggle Modal Close
        const closeConsole = () => {
            dbModal.classList.remove('active');
            document.body.style.overflow = ''; // Unlock main scroll
        };

        if (dbModalClose) dbModalClose.addEventListener('click', closeConsole);
        if (dbModalBackdrop) dbModalBackdrop.addEventListener('click', closeConsole);
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && dbModal.classList.contains('active')) {
                closeConsole();
            }
        });

        // Tab Switching Actions
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tabButtons.forEach(b => b.classList.remove('active'));
                consoleSections.forEach(s => s.classList.remove('active'));

                btn.classList.add('active');
                const targetTab = btn.dataset.tab;
                const targetSection = document.getElementById(targetTab);
                if (targetSection) targetSection.classList.add('active');

                renderDatabaseDashboard();
            });
        });

        // SQL Dashboard Renders
        function renderDatabaseDashboard() {
            // Render Messages Tab
            const inboxTbody = document.getElementById('inbox-tbody');
            if (inboxTbody) {
                inboxTbody.innerHTML = '';
                const messages = window.db.getMessages();

                if (messages.length === 0) {
                    inboxTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No messages currently logged. Use the contact form to submit a query!</td></tr>`;
                } else {
                    messages.forEach(msg => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td style="font-weight: 700; color: var(--text-primary);">${escapeHTML(msg.name)}</td>
                            <td><a href="mailto:${msg.email}" style="color: var(--secondary);">${escapeHTML(msg.email)}</a></td>
                            <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHTML(msg.message)}">${escapeHTML(msg.message)}</td>
                            <td style="font-size: 0.8rem;">${msg.timestamp}</td>
                            <td>
                                <button class="db-action-btn delete-msg-btn" data-id="${msg.id}" title="Delete Row">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </td>
                        `;
                        inboxTbody.appendChild(tr);
                    });

                    // Bind Table Row Deletions
                    inboxTbody.querySelectorAll('.delete-msg-btn').forEach(dBtn => {
                        dBtn.addEventListener('click', (e) => {
                            const id = dBtn.dataset.id;
                            window.db.deleteMessage(id);
                        });
                    });
                }
            }

            // Render Raw JSON Code Blocks
            const rawProjectsCode = document.getElementById('code-projects-raw');
            const rawMessagesCode = document.getElementById('code-messages-raw');
            
            if (rawProjectsCode) {
                rawProjectsCode.textContent = JSON.stringify(window.db.getProjects(), null, 4);
            }
            if (rawMessagesCode) {
                rawMessagesCode.textContent = JSON.stringify(window.db.getMessages(), null, 4);
            }
        }

        // Helper to prevent HTML injection inside table views
        function escapeHTML(str) {
            return str.replace(/[&<>'"]/g, 
                tag => ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    "'": '&#39;',
                    '"': '&quot;'
                }[tag] || tag)
            );
        }

        // Listen for Database Changes to keep table elements completely synchronized
        document.addEventListener('databaseUpdated', () => {
            if (dbModal.classList.contains('active')) {
                renderDatabaseDashboard();
            }
        });

        // project Insertion Form Handling
        const dbProjForm = document.getElementById('db-project-form');
        if (dbProjForm) {
            dbProjForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const title = dbProjForm.title.value.trim();
                const category = dbProjForm.category.value;
                const rawTags = dbProjForm.tags.value.trim();
                const shortDesc = dbProjForm.shortDesc.value.trim();
                const longDesc = dbProjForm.longDesc.value.trim();

                if (!title || !rawTags || !shortDesc || !longDesc) {
                    alert('Please complete all project row inputs before inserting!');
                    return;
                }

                // Split tags by comma, trim spaces
                const tags = rawTags.split(',').map(t => t.trim()).filter(t => t.length > 0);

                const payload = {
                    title,
                    category,
                    tags,
                    shortDesc,
                    longDesc
                };

                // Insert Project inside local database
                const inserted = window.db.insertProject(payload);

                // Clear input form
                dbProjForm.reset();

                // Trigger sliding success Toast notification!
                if (window.ContactFormHandler) {
                    const tempToast = new ContactFormHandler();
                    tempToast.showToast(
                        'Project Database Record Created!',
                        `"${inserted.title}" has been successfully added to the portfolio catalog under "${inserted.category}".`,
                        'success'
                    );
                }

                // Automatically switch back to Projects Showcase pane to check it out
                closeConsole();
                window.location.hash = '#portfolio';
            });
        }

        // Wipe Database Action Bindings
        const resetDbBtn = document.querySelector('.btn-reset-db');
        if (resetDbBtn) {
            resetDbBtn.addEventListener('click', () => {
                const conf = confirm('WIPE LOCAL DATABASE?\n\nThis will completely purge all contact message records and return project tables to their original seeds. Proceed?');
                if (conf) {
                    window.db.resetDatabase();
                    
                    if (window.ContactFormHandler) {
                        const tempToast = new ContactFormHandler();
                        tempToast.showToast(
                            'Database Successfully Purged!',
                            'All tables have been re-seeded and local buffers cleared.',
                            'success'
                        );
                    }
                    closeConsole();
                }
            });
        }
    }
});
