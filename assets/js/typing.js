/**
 * ============================================================================
 * PORTFOLIO UMAR MAULANA - TYPING EFFECT JAVASCRIPT
 * ============================================================================
 * Struktur: Typing Effect -> Configuration -> Control
 * ============================================================================
 */

(function() {
    'use strict';

    // ========================================================================
    // 1. TYPING EFFECT CONFIGURATION
    // ========================================================================
    const typingConfig = {
        words: [
            'Full Stack Web Developer',
            'Photographer',
            'UI/UX Designer',
            'Creative Problem Solver',
            'Digital Craftsman'
        ],
        typingSpeed: 80,
        deletingSpeed: 50,
        pauseBeforeDelete: 2000,
        pauseBeforeType: 500,
        cursorElement: null
    };

    // ========================================================================
    // 2. TYPING EFFECT CLASS
    // ========================================================================
    class TypingEffect {
        constructor(element, options) {
            this.element = element;
            this.words = options.words || [];
            this.typingSpeed = options.typingSpeed || 80;
            this.deletingSpeed = options.deletingSpeed || 50;
            this.pauseBeforeDelete = options.pauseBeforeDelete || 2000;
            this.pauseBeforeType = options.pauseBeforeType || 500;

            this.wordIndex = 0;
            this.charIndex = 0;
            this.isDeleting = false;
            this.isPaused = false;
            this.isInitialized = false;

            // Get the cursor element (sibling or child)
            this.cursorElement = options.cursorElement || null;

            // Store original text if any
            this.originalText = element.textContent.trim();

            // Bind methods
            this.type = this.type.bind(this);
        }

        init() {
            if (this.isInitialized) return;
            this.isInitialized = true;

            // Clear existing text
            this.element.textContent = '';

            // Start typing
            this.type();
        }

        type() {
            if (this.isPaused) return;

            const currentWord = this.words[this.wordIndex] || '';
            const isComplete = this.charIndex === currentWord.length;

            if (this.isDeleting) {
                // Deleting
                if (this.charIndex > 0) {
                    this.charIndex--;
                    this.element.textContent = currentWord.substring(0, this.charIndex);
                    setTimeout(this.type, this.deletingSpeed);
                } else {
                    this.isDeleting = false;
                    this.wordIndex = (this.wordIndex + 1) % this.words.length;
                    setTimeout(this.type, this.pauseBeforeType);
                }
            } else {
                // Typing
                if (this.charIndex < currentWord.length) {
                    this.charIndex++;
                    this.element.textContent = currentWord.substring(0, this.charIndex);
                    setTimeout(this.type, this.typingSpeed);
                } else {
                    // Word complete
                    setTimeout(() => {
                        this.isDeleting = true;
                        this.type();
                    }, this.pauseBeforeDelete);
                }
            }
        }

        // Reset the typing effect
        reset() {
            this.wordIndex = 0;
            this.charIndex = 0;
            this.isDeleting = false;
            this.element.textContent = '';
            this.type();
        }

        // Change words dynamically
        setWords(newWords) {
            this.words = newWords;
            this.reset();
        }

        // Pause the typing
        pause() {
            this.isPaused = true;
        }

        // Resume the typing
        resume() {
            this.isPaused = false;
            this.type();
        }

        // Destroy the effect
        destroy() {
            this.isPaused = true;
            this.isInitialized = false;
            this.element.textContent = this.originalText || '';
        }
    }

    // ========================================================================
    // 3. INITIALIZE TYPING EFFECT
    // ========================================================================
    const typingElement = document.querySelector('.typing-text');

    if (typingElement) {
        // Get cursor element
        const cursorElement = document.querySelector('.typing-cursor');

        // Create typing effect instance
        const typingEffect = new TypingEffect(typingElement, {
            words: typingConfig.words,
            typingSpeed: typingConfig.typingSpeed,
            deletingSpeed: typingConfig.deletingSpeed,
            pauseBeforeDelete: typingConfig.pauseBeforeDelete,
            pauseBeforeType: typingConfig.pauseBeforeType,
            cursorElement: cursorElement
        });

        // Start typing when page is loaded
        if (document.readyState === 'complete') {
            typingEffect.init();
        } else {
            window.addEventListener('load', function() {
                setTimeout(function() {
                    typingEffect.init();
                }, 500);
            });
        }

        // Expose for debugging or control
        window.__typingEffect = typingEffect;

        // Re-init on visibility change (if user switches tabs)
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden && typingEffect) {
                // Small delay to ensure everything is ready
                setTimeout(function() {
                    if (!typingEffect.isInitialized) {
                        typingEffect.init();
                    }
                }, 100);
            }
        });
    }

    // ========================================================================
    // 4. MULTIPLE TYPING EFFECTS (for future use)
    // ========================================================================
    class MultiTypingEffect {
        constructor(elements, options) {
            this.effects = [];
            elements.forEach(function(el) {
                const effect = new TypingEffect(el, options);
                this.effects.push(effect);
            }, this);
        }

        initAll() {
            this.effects.forEach(function(effect) {
                effect.init();
            });
        }

        resetAll() {
            this.effects.forEach(function(effect) {
                effect.reset();
            });
        }
    }

    // ========================================================================
    // 5. COUNTER FOR STATS WITH TYPING FEEL
    // ========================================================================
    // This is handled in animation.js with the counter animation

})();