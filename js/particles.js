/**
 * Interactive Particles Canvas Engine
 * High-performance, lightweight node-based physics simulations
 */
class ParticlesBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 65;
        this.maxDistance = 120; // Connection line threshold
        this.mouse = {
            x: null,
            y: null,
            radius: 150, // Hover bubble field
            active: false
        };

        this.colors = {
            dark: {
                primary: 'rgba(110, 68, 255, 0.4)',    /* primary-glow violet */
                secondary: 'rgba(0, 242, 254, 0.45)',  /* secondary cyan */
                accent: 'rgba(255, 46, 155, 0.35)',    /* pink accent */
                line: 'rgba(250, 85, 65, 0.04)'        /* light link line */
            },
            light: {
                primary: 'rgba(110, 68, 255, 0.2)',
                secondary: 'rgba(0, 180, 200, 0.25)',
                accent: 'rgba(255, 46, 155, 0.2)',
                line: 'rgba(31, 38, 135, 0.02)'
            }
        };

        this.theme = document.documentElement.getAttribute('data-theme') || 'dark';

        this.init();
        this.bindEvents();
        this.animate();
    }

    init() {
        this.resize();
        this.particles = [];
        
        // Adjust particle density based on screen size
        if (window.innerWidth < 768) {
            this.particleCount = 30;
            this.maxDistance = 90;
        } else {
            this.particleCount = 65;
            this.maxDistance = 120;
        }

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.offsetWidth;
        this.canvas.height = parent.offsetHeight;
    }

    createParticle() {
        const colorsList = this.theme === 'light' ? this.colors.light : this.colors.dark;
        const colorKeys = ['primary', 'secondary', 'accent'];
        const chosenColor = colorsList[colorKeys[Math.floor(Math.random() * colorKeys.length)]];

        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 0.6, // Speed multiplier
            vy: (Math.random() - 0.5) * 0.6,
            radius: Math.random() * 2.5 + 1.2,
            color: chosenColor,
            originalColorKey: colorKeys[Math.floor(Math.random() * colorKeys.length)]
        };
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.init();
        });

        // Mouse listeners
        const parent = this.canvas.parentElement;
        parent.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.mouse.active = true;
        });

        parent.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
            this.mouse.active = false;
        });

        // Listen for custom theme updates from main thread
        document.addEventListener('themeChanged', (e) => {
            this.theme = e.detail.theme;
            this.updateParticleColors();
        });
    }

    updateParticleColors() {
        const colorsList = this.theme === 'light' ? this.colors.light : this.colors.dark;
        this.particles.forEach(p => {
            // Re-assign color to match active theme
            p.color = colorsList[p.originalColorKey || 'primary'];
        });
    }

    drawConnections(i, p1) {
        const colorsList = this.theme === 'light' ? this.colors.light : this.colors.dark;

        for (let j = i + 1; j < this.particles.length; j++) {
            const p2 = this.particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < this.maxDistance) {
                // Calculate line opacity based on closeness
                const alpha = (1 - dist / this.maxDistance) * 0.15;
                this.ctx.strokeStyle = this.theme === 'light' 
                    ? `rgba(31, 38, 135, ${alpha})`
                    : `rgba(250, 85, 65, ${alpha * 0.45})`;
                this.ctx.lineWidth = 0.8;
                this.ctx.beginPath();
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
                this.ctx.stroke();
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, idx) => {
            // Draw particle
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Physics Update (Move)
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off boundaries
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            // Mouse repulsion physics
            if (this.mouse.active && this.mouse.x !== null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    
                    // Gently push particles away from cursor
                    p.x += Math.cos(angle) * force * 1.5;
                    p.y += Math.sin(angle) * force * 1.5;
                }
            }

            // Draw link webs
            this.drawConnections(idx, p);
        });

        requestAnimationFrame(() => this.animate());
    }
}
