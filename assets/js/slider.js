/**
 * ============================================================================
 * PORTFOLIO UMAR MAULANA - TESTIMONIAL SLIDER JAVASCRIPT
 * ============================================================================
 * Struktur: Slider Class -> Auto Play -> Controls -> Dots
 * ============================================================================
 */

(function() {
    'use strict';

    // ========================================================================
    // 1. TESTIMONIAL SLIDER
    // ========================================================================
    class TestimonialSlider {
        constructor(container, options) {
            this.container = container;
            this.track = container.querySelector('.testimonial-track');
            this.items = container.querySelectorAll('.testimonial-item');
            this.prevBtn = container.querySelector('.slider-prev');
            this.nextBtn = container.querySelector('.slider-next');
            this.dotsContainer = container.querySelector('.slider-dots');

            this.currentIndex = 0;
            this.totalItems = this.items.length;
            this.isAnimating = false;
            this.autoPlayInterval = null;
            this.autoPlayDelay = options.autoPlayDelay || 5000;
            this.pauseOnHover = options.pauseOnHover !== false;

            this.init();
        }

        init() {
            if (this.totalItems === 0) return;

            // Create dots
            this.createDots();

            // Set initial position
            this.goTo(0, false);

            // Event listeners
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => {
                    this.prev();
                });
            }

            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => {
                    this.next();
                });
            }

            // Dot click events
            if (this.dotsContainer) {
                this.dotsContainer.querySelectorAll('.dot').forEach((dot, index) => {
                    dot.addEventListener('click', () => {
                        this.goTo(index);
                    });
                });
            }

            // Keyboard navigation
            this.container.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prev();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.next();
                }
            });

            // Pause on hover
            if (this.pauseOnHover) {
                this.container.addEventListener('mouseenter', () => {
                    this.pauseAutoPlay();
                });

                this.container.addEventListener('mouseleave', () => {
                    this.startAutoPlay();
                });

                // Touch events for mobile
                this.container.addEventListener('touchstart', () => {
                    this.pauseAutoPlay();
                });

                this.container.addEventListener('touchend', () => {
                    this.startAutoPlay();
                });
            }

            // Start auto play
            this.startAutoPlay();

            // Set initial focus for accessibility
            this.container.setAttribute('role', 'region');
            this.container.setAttribute('aria-label', 'Testimonials carousel');
            this.track.setAttribute('aria-live', 'polite');
        }

        createDots() {
            if (!this.dotsContainer) return;

            this.dotsContainer.innerHTML = '';

            for (let i = 0; i < this.totalItems; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('data-index', i);
                dot.setAttribute('role', 'button');
                dot.setAttribute('tabindex', '0');
                dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
                this.dotsContainer.appendChild(dot);
            }
        }

        goTo(index, animate = true) {
            if (this.isAnimating) return;
            if (index === this.currentIndex && animate) return;

            this.isAnimating = true;

            const maxIndex = this.totalItems - 1;
            index = Math.max(0, Math.min(index, maxIndex));

            this.currentIndex = index;

            // Move the track
            const offset = -index * 100;
            this.track.style.transition = animate ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
            this.track.style.transform = 'translateX(' + offset + '%)';

            // Update dots
            this.updateDots();

            // Update aria attributes
            this.items.forEach((item, i) => {
                item.setAttribute('aria-hidden', i === index ? 'false' : 'true');
            });

            // Reset animation flag
            setTimeout(() => {
                this.isAnimating = false;
            }, 600);
        }

        updateDots() {
            if (!this.dotsContainer) return;

            const dots = this.dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === this.currentIndex);
            });
        }

        next() {
            if (this.isAnimating) return;
            const nextIndex = (this.currentIndex + 1) % this.totalItems;
            this.goTo(nextIndex);
        }

        prev() {
            if (this.isAnimating) return;
            const prevIndex = (this.currentIndex - 1 + this.totalItems) % this.totalItems;
            this.goTo(prevIndex);
        }

        startAutoPlay() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
            }

            if (this.totalItems <= 1) return;

            this.autoPlayInterval = setInterval(() => {
                if (!this.isAnimating) {
                    this.next();
                }
            }, this.autoPlayDelay);
        }

        pauseAutoPlay() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
            }
        }

        destroy() {
            this.pauseAutoPlay();
            this.track.style.transition = 'none';
            this.track.style.transform = 'translateX(0)';
        }
    }

    // ========================================================================
    // 2. INITIALIZE SLIDER
    // ========================================================================
    const sliderContainer = document.querySelector('.testimonial-slider');

    if (sliderContainer) {
        const slider = new TestimonialSlider(sliderContainer, {
            autoPlayDelay: 5000,
            pauseOnHover: true
        });

        // Expose for debugging
        window.__testimonialSlider = slider;

        // Clean up on page unload
        window.addEventListener('beforeunload', function() {
            if (slider) {
                slider.destroy();
            }
        });
    }

    // ========================================================================
    // 3. RESPONSIVE HANDLING FOR SLIDER
    // ========================================================================
    let resizeTimeout;

    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Any responsive adjustments for slider
            const slider = window.__testimonialSlider;
            if (slider) {
                // Refresh position after resize
                slider.goTo(slider.currentIndex, false);
            }
        }, 250);
    });

})();