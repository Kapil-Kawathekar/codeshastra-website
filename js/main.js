/* ============================================
   CodeShastra — Interactive JavaScript
   Particles, tilt effects, scroll animations,
   custom cursor, and more
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===========================
    // Custom Cursor
    // ===========================
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .service-card, .portfolio-card, input, textarea, select');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hover');
                cursorRing.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hover');
                cursorRing.classList.remove('hover');
            });
        });
    }

    // ===========================
    // Interactive Particle Canvas
    // ===========================
    const canvas = document.getElementById('heroCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let canvasMouseX = 0, canvasMouseY = 0;

    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = `rgba(16, 185, 129, ${this.opacity})`;
        }

        update() {
            // Gentle drift
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction — particles gently push away
            const dx = this.x - canvasMouseX;
            const dy = this.y - canvasMouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const force = (120 - dist) / 120;
                this.x += (dx / dist) * force * 1.5;
                this.y += (dy / dist) * force * 1.5;
            }

            // Wrap around
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // Create particles
    const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Track mouse on canvas
    canvas.parentElement.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        canvasMouseX = e.clientX - rect.left;
        canvasMouseY = e.clientY - rect.top;
    });

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ===========================
    // Navigation
    // ===========================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // ===========================
    // Scroll Reveal Animations
    // ===========================
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ===========================
    // Counter Animation
    // ===========================
    const counters = document.querySelectorAll('.stat-number');
    let counterStarted = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counterStarted) {
                counterStarted = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.count);
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;

                    function updateCounter() {
                        current += step;
                        if (current < target) {
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    }
                    updateCounter();
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) counterObserver.observe(statsSection);

    // ===========================
    // Tilt Effect on Cards
    // ===========================
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ===========================
    // Testimonials Slider
    // ===========================
    const track = document.getElementById('testimonialTrack');
    const cards = document.querySelectorAll('.testimonial-card');
    const dotsContainer = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;
    let slidesPerView = 3;

    function updateSlidesPerView() {
        if (window.innerWidth < 768) {
            slidesPerView = 1;
        } else if (window.innerWidth < 1024) {
            slidesPerView = 2;
        } else {
            slidesPerView = 3;
        }
    }
    updateSlidesPerView();

    function getTotalSlides() {
        return Math.max(1, cards.length - slidesPerView + 1);
    }

    function createDots() {
        dotsContainer.innerHTML = '';
        const total = getTotalSlides();
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function goToSlide(index) {
        const total = getTotalSlides();
        currentSlide = Math.max(0, Math.min(index, total - 1));
        const percent = (currentSlide * 100) / cards.length;
        track.style.transform = `translateX(-${percent}%)`;

        document.querySelectorAll('.slider-dots .dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    createDots();

    window.addEventListener('resize', () => {
        updateSlidesPerView();
        createDots();
        goToSlide(Math.min(currentSlide, getTotalSlides() - 1));
    });

    // Auto-advance testimonials
    let autoSlide = setInterval(() => {
        const total = getTotalSlides();
        goToSlide((currentSlide + 1) % total);
    }, 5000);

    // Pause on hover
    const slider = document.getElementById('testimonialSlider');
    slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
    slider.addEventListener('mouseleave', () => {
        autoSlide = setInterval(() => {
            const total = getTotalSlides();
            goToSlide((currentSlide + 1) % total);
        }, 5000);
    });

    // Touch swipe for testimonials
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goToSlide(currentSlide + 1);
            else goToSlide(currentSlide - 1);
        }
    }, { passive: true });

    // ===========================
    // Contact Form
    // ===========================
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            Sending...
        `;
        btn.disabled = true;

        // Simulate sending (replace with actual form submission)
        setTimeout(() => {
            btn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
                Message Sent!
            `;
            btn.style.background = '#059669';

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
                btn.style.background = '';
                contactForm.reset();
            }, 3000);
        }, 1500);
    });

    // ===========================
    // Smooth Scroll for Anchors
    // ===========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const position = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: position, behavior: 'smooth' });
            }
        });
    });

    // ===========================
    // Parallax on Scroll (subtle)
    // ===========================
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroContent = document.querySelector('.hero-content');
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
            heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
        }
    });

    // ===========================
    // Active Nav Link on Scroll
    // ===========================
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);

            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    link.style.color = 'var(--green-600)';
                } else {
                    link.style.color = '';
                }
            }
        });
    });

    // ===========================
    // Magnetic Button Effect
    // ===========================
    const magneticBtns = document.querySelectorAll('.btn-primary');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

});

// Add spin animation for loading state
const style = document.createElement('style');
style.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
document.head.appendChild(style);
