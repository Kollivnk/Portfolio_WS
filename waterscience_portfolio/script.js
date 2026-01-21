document.addEventListener('DOMContentLoaded', () => {
    // 1. Dark/Light Theme Toggle
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'light') {
            toggleSwitch.checked = true;
        }
    }

    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    }

    toggleSwitch.addEventListener('change', switchTheme, false);

    // 2. Header Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Reveal Animations (Intersection Observer)
    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('[data-aos]').forEach(el => {
        revealObserver.observe(el);
    });

    // 5. Hero Micro-animations with Stagger
    const heroElements = [
        '.hero .badge',
        '.hero h1',
        '.hero .sub-headline',
        '.hero .hero-description',
        '.hero-actions'
    ];

    heroElements.forEach((selector, index) => {
        const el = document.querySelector(selector);
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 200 + (index * 150));
        }
    });

    // 6. Parallax effect for background video
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const backgroundVideo = document.querySelector('.background-video');
        if (backgroundVideo) {
            backgroundVideo.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // 7. Add hover effect to company cards
    const companyCards = document.querySelectorAll('.company-card');
    companyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // 8. Presentation Slide Navigation
    initializeSlides();
});

// Slide Navigation Functions
let currentSlideIndex = 1;
const totalSlides = 8;

function initializeSlides() {
    updateSlideDisplay();
    updateNavButtons();
}

function changeSlide(direction) {
    currentSlideIndex += direction;
    if (currentSlideIndex < 1) currentSlideIndex = totalSlides;
    if (currentSlideIndex > totalSlides) currentSlideIndex = 1;
    updateSlideDisplay();
    updateNavButtons();
}

function goToSlide(slideNumber) {
    currentSlideIndex = slideNumber;
    updateSlideDisplay();
    updateNavButtons();
}

function updateSlideDisplay() {
    // Hide all slides
    document.querySelectorAll('.presentation-slide').forEach(slide => {
        slide.classList.remove('active');
        // Reset all animations
        const animatedElements = slide.querySelectorAll('.slide-item ul li, .achievement-item, .performance-item, .strength-item, .challenge-item, .learning-category ul li, .improvement-item, .goal-item, .feedback-section');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // Trigger reflow
            el.style.animation = null;
        });
    });
    
    // Show current slide with animation
    const currentSlide = document.querySelector(`.presentation-slide[data-slide="${currentSlideIndex}"]`);
    if (currentSlide) {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
            currentSlide.classList.add('active');
        });
    } else {
        console.error(`Slide ${currentSlideIndex} not found!`);
    }
    
    // Update slide indicator
    const currentSlideEl = document.getElementById('current-slide');
    if (currentSlideEl) {
        currentSlideEl.textContent = currentSlideIndex;
    }
    
    // Update dots with animation
    document.querySelectorAll('.dot').forEach((dot, index) => {
        const wasActive = dot.classList.contains('active');
        dot.classList.toggle('active', index + 1 === currentSlideIndex);
        if (!wasActive && dot.classList.contains('active')) {
            dot.style.transform = 'scale(1.3)';
            setTimeout(() => {
                dot.style.transform = 'scale(1)';
            }, 200);
        }
    });
}

function updateNavButtons() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn) prevBtn.disabled = false;
    if (nextBtn) nextBtn.disabled = false;
}

// Keyboard navigation for slides
document.addEventListener('keydown', (e) => {
    const reviewSection = document.getElementById('review');
    if (reviewSection && window.getComputedStyle(reviewSection).display !== 'none') {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        }
    }
});
