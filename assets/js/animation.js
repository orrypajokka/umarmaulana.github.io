/**
 * ============================================================================
 * PORTFOLIO UMAR MAULANA - ANIMATION JAVASCRIPT
 * ============================================================================
 * Struktur: Intersection Observer -> Counter Animation -> Scroll Animations
 * ============================================================================
 */

(function() {
    'use strict';

    // ========================================================================
    // 1. INTERSECTION OBSERVER - FADE IN ELEMENTS
    // ========================================================================
    const fadeElements = document.querySelectorAll('.fade-in, .scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale');

    if ('IntersectionObserver' in window) {
        const fadeObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');

                    // If element has counter numbers, trigger counter
                    const counters = entry.target.querySelectorAll('.stat-number[data-target]');
                    if (counters.length > 0) {
                        counters.forEach(function(counter) {
                            animateCounter(counter);
                        });
                    }

                    // If element has skill progress bars
                    const progressBars = entry.target.querySelectorAll('.skill-progress[data-progress]');
                    if (progressBars.length > 0) {
                        progressBars.forEach(function(bar) {
                            animateSkillBar(bar);
                        });
                    }

                    // Unobserve after animation
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(function(el) {
            fadeObserver.observe(el);
        });

        // Also observe stagger children containers
        document.querySelectorAll('.stagger-children').forEach(function(container) {
            fadeObserver.observe(container);
        });
    } else {
        // Fallback: show all elements immediately
        fadeElements.forEach(function(el) {
            el.classList.add('is-visible');
        });
        document.querySelectorAll('.stagger-children').forEach(function(el) {
            el.classList.add('is-visible');
        });
    }

    // ========================================================================
    // 2. COUNTER ANIMATION
    // ========================================================================
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        if (isNaN(target)) return;

        const isFloat = element.getAttribute('data-target').includes('.');
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function: easeOutQuart
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = eased * target;

            if (isFloat) {
                element.textContent = current.toFixed(1);
            } else {
                element.textContent = Math.floor(current);
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = isFloat ? target.toFixed(1) : target;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // ========================================================================
    // 3. SKILL BAR ANIMATION
    // ========================================================================
    function animateSkillBar(element) {
        const progress = parseInt(element.getAttribute('data-progress'));
        if (isNaN(progress)) return;

        element.style.setProperty('--progress-width', progress + '%');
        element.classList.add('progress-bar-animate');

        // Fallback for browsers that don't support custom properties in animations
        setTimeout(function() {
            element.style.width = progress + '%';
        }, 100);
    }

    // ========================================================================
    // 4. OBSERVE STATS SECTION FOR COUNTERS
    // ========================================================================
    const statsSection = document.querySelector('.stats');
    if (statsSection && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const counters = entry.target.querySelectorAll('.stat-number[data-target]');
                    counters.forEach(function(counter, index) {
                        setTimeout(function() {
                            animateCounter(counter);
                        }, index * 150);
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });

        statsObserver.observe(statsSection);
    }

    // ========================================================================
    // 5. SECTION DIVIDER ANIMATION
    // ========================================================================
    document.querySelectorAll('.section-divider').forEach(function(divider) {
        if ('IntersectionObserver' in window) {
            const dividerObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        divider.classList.add('animate');
                        dividerObserver.unobserve(divider);
                    }
                });
            }, {
                threshold: 0.5
            });
            dividerObserver.observe(divider);
        } else {
            divider.classList.add('animate');
        }
    });

    // ========================================================================
    // 6. PARALLAX EFFECT ON HERO IMAGE
    // ========================================================================
    const heroImage = document.querySelector('.hero-image-wrapper');
    if (heroImage && window.innerWidth > 768) {
        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.1;
            heroImage.style.transform = 'translateY(' + rate + 'px)';
        }, { passive: true });
    }

    // ========================================================================
    // 7. REVEAL ON SCROLL FOR SPECIFIC ELEMENTS
    // ========================================================================
    // Observe all sections for entrance animation
    document.querySelectorAll('.section').forEach(function(section) {
        if ('IntersectionObserver' in window) {
            const sectionObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        sectionObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1
            });

            // Set initial state if not already
            if (!section.classList.contains('fade-in') &&
                !section.classList.contains('scroll-animate')) {
                section.style.opacity = '0';
                section.style.transform = 'translateY(30px)';
                section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                sectionObserver.observe(section);
            }
        }
    });

})();