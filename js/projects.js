/**
 * Portfolio Projects Database Grid Controller
 * Coordinates project queries, filtering animations, and detail case study modals
 */
class ProjectsManager {
    constructor() {
        this.grid = document.querySelector('.projects-grid');
        this.filterContainer = document.querySelector('.portfolio-filters');
        
        // Modal Selectors
        this.modal = document.getElementById('project-modal');
        this.modalWrapper = this.modal ? this.modal.querySelector('.modal-wrapper') : null;
        this.modalCloseBtn = this.modal ? this.modal.querySelector('.modal-close-btn') : null;
        this.modalBackdrop = this.modal ? this.modal.querySelector('.modal-backdrop') : null;

        if (this.grid) {
            this.init();
            this.bindEvents();
        }
    }

    init() {
        // Query projects from database
        this.projects = window.db.getProjects();
        this.renderProjects(this.projects);
    }

    // Render Cards in Grid
    renderProjects(items) {
        if (!this.grid) return;
        this.grid.innerHTML = '';

        if (items.length === 0) {
            this.grid.innerHTML = `<div class="no-projects-msg" style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">No projects found in this category. Use the Developer Console to insert one!</div>`;
            return;
        }

        items.forEach((proj, idx) => {
            const card = document.createElement('div');
            card.className = `project-card reveal reveal-up reveal-delay-${(idx % 3) + 1}`;
            card.dataset.id = proj.id;
            
            // Build tag strings
            const tagsHTML = proj.tags.slice(0, 3).map(t => `<span class="project-tag">${t}</span>`).join('');

            card.innerHTML = `
                <div class="project-img-wrapper">
                    ${proj.images && proj.images.length
                        ? `<img src="${proj.images[0]}" class="project-preview-image" alt="${proj.title}">`
                        : proj.icon}
                    <div class="project-overlay">
                        <div class="project-overlay-content">
                            <button class="btn btn-primary view-project-btn" data-id="${proj.id}">Explore Case Study</button>
                        </div>
                    </div>
                </div>
                <div class="project-body">
                    <div class="project-tags">
                        ${tagsHTML}
                    </div>
                    <h3 class="project-title">${proj.title}</h3>
                    <p class="project-description">${proj.shortDesc}</p>
                    <div class="project-footer view-project-btn" data-id="${proj.id}">
                        <span>Details</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </div>
                </div>
            `;
            this.grid.appendChild(card);
        });

        // Trigger Reveal Animation on newly added nodes
        setTimeout(() => {
            const children = this.grid.querySelectorAll('.project-card');
            children.forEach(child => child.classList.add('reveal-visible'));
        }, 100);
    }

    bindEvents() {
        // Listen to Database updates
        document.addEventListener('databaseUpdated', (e) => {
            if (e.detail.type === 'projects' || e.detail.type === 'all') {
                this.init();
            }
        });

        // Category Filter Toggles
        if (this.filterContainer) {
            this.filterContainer.addEventListener('click', (e) => {
                const button = e.target.closest('.filter-btn');
                if (!button) return;

                // Toggle active states
                this.filterContainer.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterVal = button.dataset.filter;

                // Animate transition out
                this.grid.style.opacity = '0';
                this.grid.style.transform = 'translateY(10px)';
                this.grid.style.transition = 'all 0.3s ease';

                setTimeout(() => {
                    // Filter dataset
                    const filtered = filterVal === 'all' 
                        ? this.projects 
                        : this.projects.filter(p => p.category === filterVal);

                    this.renderProjects(filtered);
                    
                    // Animate transition back in
                    this.grid.style.opacity = '1';
                    this.grid.style.transform = 'translateY(0)';
                }, 300);
            });
        }

        // View Project Modal Triggers
        this.grid.addEventListener('click', (e) => {
            const trigger = e.target.closest('.view-project-btn');
            if (!trigger) return;

            const id = parseInt(trigger.dataset.id);
            const project = this.projects.find(p => p.id === id);
            
            if (project) {
                this.openModal(project);
            }
        });

        // Close Modal Controls
        if (this.modalCloseBtn) {
            this.modalCloseBtn.addEventListener('click', () => this.closeModal());
        }
        if (this.modalBackdrop) {
            this.modalBackdrop.addEventListener('click', () => this.closeModal());
        }

        // Keyboard accessibility (Escape key closes active modals)
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal(project) {
        if (!this.modal || !this.modalWrapper) return;

        // Build tech stack list
        const tagsHTML = project.tags.map(t => `<span class="project-tag">${t}</span>`).join('');
        
        // Build bullet points
        const featuresHTML = project.features.map(f => `
            <div class="modal-feature-bullet">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>${f}</span>
            </div>
        `).join('');

        // Populate Modal Fields
        const heroContainer = this.modalWrapper.querySelector('.modal-hero-svg');
        if (project.images && project.images.length > 0) {
            heroContainer.classList.add('has-gallery');
            
            const captions = project.captions || [];
            heroContainer.innerHTML = `
                <div class="gallery-container">
                   <button class="gallery-prev">←</button>
                   <div style="position: relative; width: 100%; display: flex; justify-content: center; align-items: center;">
                       <img id="gallery-main-image" src="${project.images[0]}" style="transition: opacity 0.3s ease-in-out;">
                       <div class="gallery-caption" style="position: absolute; bottom: 0; left: 0; width: 100%; background: rgba(15, 23, 42, 0.75); color: #fff; padding: 8px; text-align: center; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px; font-weight: 600; font-size: 0.95rem; transition: opacity 0.3s ease-in-out; display: ${captions[0] ? 'block' : 'none'};">${captions[0] || ''}</div>
                   </div>
                   <button class="gallery-next">→</button>
                </div>
                <div class="gallery-thumbnails">
                ${project.images.map((img, i) =>
                 `<img src="${img}" class="gallery-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">`
                ).join('')}
                </div>
            `;

            let currentIndex = 0;
            const mainImg = heroContainer.querySelector('#gallery-main-image');
            const captionEl = heroContainer.querySelector('.gallery-caption');
            const prevBtn = heroContainer.querySelector('.gallery-prev');
            const nextBtn = heroContainer.querySelector('.gallery-next');
            const thumbs = heroContainer.querySelectorAll('.gallery-thumb');

            const updateGallery = (idx) => {
                currentIndex = idx;
                mainImg.style.opacity = 0;
                if (captionEl) captionEl.style.opacity = 0;
                
                setTimeout(() => {
                    mainImg.src = project.images[currentIndex];
                    if (captionEl) {
                        if (captions[currentIndex]) {
                            captionEl.textContent = captions[currentIndex];
                            captionEl.style.display = 'block';
                        } else {
                            captionEl.style.display = 'none';
                        }
                    }
                    
                    thumbs.forEach((t, i) => {
                        if (i === currentIndex) {
                            t.classList.add('active');
                        } else {
                            t.classList.remove('active');
                        }
                    });

                    mainImg.style.opacity = 1;
                    if (captionEl) captionEl.style.opacity = 1;
                }, 150);
            };

            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const nextIdx = (currentIndex - 1 + project.images.length) % project.images.length;
                updateGallery(nextIdx);
            });

            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const nextIdx = (currentIndex + 1) % project.images.length;
                updateGallery(nextIdx);
            });

            thumbs.forEach((thumb) => {
                thumb.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const nextIdx = parseInt(thumb.dataset.index);
                    updateGallery(nextIdx);
                });
            });

        } else {
            heroContainer.classList.remove('has-gallery');
            heroContainer.innerHTML = project.icon;
        }

        this.modalWrapper.querySelector('.modal-tech-stack').innerHTML = tagsHTML;
        this.modalWrapper.querySelector('.modal-title').textContent = project.title;
        
        // Metadata
        this.modalWrapper.querySelector('.val-role').textContent = project.role;
        this.modalWrapper.querySelector('.val-client').textContent = project.client;
        this.modalWrapper.querySelector('.val-timeline').textContent = project.timeline;
        
        // Narrative description
        this.modalWrapper.querySelector('.val-desc').textContent = project.longDesc;
        this.modalWrapper.querySelector('.modal-features-list').innerHTML = featuresHTML;

        // Anchor Links
        const ghLink = this.modalWrapper.querySelector('.btn-gh');
        const demoLink = this.modalWrapper.querySelector('.btn-demo');
        
        if (ghLink) ghLink.href = project.github;
        if (demoLink) demoLink.href = project.demo;

        // Trigger visual classes
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock main scrollbar
    }

    closeModal() {
        if (!this.modal) return;
        this.modal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock main scrollbar
    }
}
window.ProjectsManager = ProjectsManager;
