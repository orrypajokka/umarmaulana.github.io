/**
 * ============================================================================
 * PORTFOLIO UMAR MAULANA - GALLERY JAVASCRIPT
 * ============================================================================
 * Struktur: Portfolio Filter -> Lightbox -> Photography Category Filter
 * ============================================================================
 */

(function() {
    'use strict';

    // ========================================================================
    // 1. PORTFOLIO FILTER
    // ========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterButtons.length > 0 && portfolioItems.length > 0) {
        filterButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                // Update active button
                filterButtons.forEach(function(btn) {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');

                const filterValue = this.getAttribute('data-filter');

                // Filter items with animation
                portfolioItems.forEach(function(item) {
                    const category = item.getAttribute('data-category');

                    if (filterValue === 'all' || category === filterValue) {
                        item.style.display = 'block';
                        setTimeout(function() {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.9)';
                        setTimeout(function() {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ========================================================================
    // 2. PHOTOGRAPHY CATEGORY FILTER
    // ========================================================================
    const categoryButtons = document.querySelectorAll('.category-btn');
    const photoItems = document.querySelectorAll('.photo-item');

    if (categoryButtons.length > 0 && photoItems.length > 0) {
        categoryButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                // Update active button
                categoryButtons.forEach(function(btn) {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');

                const categoryValue = this.getAttribute('data-category');

                photoItems.forEach(function(item) {
                    const category = item.getAttribute('data-category');

                    if (categoryValue === 'all' || category === categoryValue) {
                        item.style.display = 'block';
                        setTimeout(function() {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.9)';
                        setTimeout(function() {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ========================================================================
    // 3. LIGHTBOX
    // ========================================================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    let lightboxImages = [];
    let currentImageIndex = 0;

    // Collect all photo items with images
    function updateLightboxImages() {
        const visiblePhotos = document.querySelectorAll('.photo-item[style*="display: block"], .photo-item:not([style*="display: none"])');
        lightboxImages = [];

        visiblePhotos.forEach(function(item) {
            const img = item.querySelector('img');
            if (img) {
                lightboxImages.push({
                    src: img.getAttribute('src'),
                    alt: img.getAttribute('alt') || 'Photography'
                });
            }
        });

        // If no visible photos, fallback to all photos
        if (lightboxImages.length === 0) {
            document.querySelectorAll('.photo-item img').forEach(function(img) {
                lightboxImages.push({
                    src: img.getAttribute('src'),
                    alt: img.getAttribute('alt') || 'Photography'
                });
            });
        }
    }

    function openLightbox(index) {
        if (!lightbox || !lightboxImg) return;

        updateLightboxImages();

        if (lightboxImages.length === 0) return;

        currentImageIndex = index >= 0 && index < lightboxImages.length ? index : 0;

        const image = lightboxImages[currentImageIndex];
        lightboxImg.setAttribute('src', image.src);
        lightboxImg.setAttribute('alt', image.alt);

        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Preload next and previous images
        preloadAdjacentImages();
    }

    function closeLightbox() {
        if (!lightbox) return;

        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');

        // Restore body scroll
        document.body.style.overflow = '';

        // Clear image to free memory
        setTimeout(function() {
            if (lightboxImg) {
                lightboxImg.removeAttribute('src');
                lightboxImg.setAttribute('alt', '');
            }
        }, 300);
    }

    function navigateLightbox(direction) {
        if (lightboxImages.length === 0) return;

        currentImageIndex = (currentImageIndex + direction + lightboxImages.length) % lightboxImages.length;

        const image = lightboxImages[currentImageIndex];
        lightboxImg.setAttribute('src', image.src);
        lightboxImg.setAttribute('alt', image.alt);

        // Preload adjacent images
        preloadAdjacentImages();
    }

    function preloadAdjacentImages() {
        const indices = [
            (currentImageIndex + 1) % lightboxImages.length,
            (currentImageIndex - 1 + lightboxImages.length) % lightboxImages.length
        ];

        indices.forEach(function(index) {
            if (lightboxImages[index]) {
                const img = new Image();
                img.src = lightboxImages[index].src;
            }
        });
    }

    // Event listeners for lightbox
    if (lightbox) {
        // Open lightbox on photo click
        document.querySelectorAll('.photo-item').forEach(function(item, index) {
            item.addEventListener('click', function() {
                // Get the actual index in the filtered array
                const visibleItems = document.querySelectorAll('.photo-item[style*="display: block"], .photo-item:not([style*="display: none"])');
                let actualIndex = 0;
                visibleItems.forEach(function(visibleItem, i) {
                    if (visibleItem === item) {
                        actualIndex = i;
                    }
                });
                openLightbox(actualIndex);
            });

            // Keyboard accessibility
            item.setAttribute('role', 'button');
            item.setAttribute('tabindex', '0');
            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });

        // Close lightbox
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        // Click outside image to close
        lightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });

        // Navigation
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', function(e) {
                e.stopPropagation();
                navigateLightbox(-1);
            });
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', function(e) {
                e.stopPropagation();
                navigateLightbox(1);
            });
        }

        // Keyboard navigation for lightbox
        document.addEventListener('keydown', function(e) {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    navigateLightbox(-1);
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    navigateLightbox(1);
                }
            }
        });
    }

    // ========================================================================
    // 4. VIEW PROJECT - Portfolio Detail
    // ========================================================================
    const viewProjectButtons = document.querySelectorAll('.view-project');

    viewProjectButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            // For demo, show alert with project info
            // In production, this would open a modal or navigate to project detail
            alert('Project detail for: ' + projectId + '\n\nThis would open a detailed project view with more information, images, and project description.');
        });
    });

    // ========================================================================
    // 5. EXPOSE FUNCTIONS FOR GLOBAL USE
    // ========================================================================
    window.__gallery = {
        openLightbox: openLightbox,
        closeLightbox: closeLightbox,
        navigateLightbox: navigateLightbox,
        updateLightboxImages: updateLightboxImages
    };

})();