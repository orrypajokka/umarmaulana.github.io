/**
 * ============================================================================
 * PORTFOLIO UMAR MAULANA - MAIN JAVASCRIPT
 * ============================================================================
 * Struktur: Loading Screen -> Navbar -> Back to Top -> Smooth Scroll ->
 *           Keyboard A11y -> Performance -> Page Transitions -> Console
 * ============================================================================
 */

(function() {
    'use strict';

    // ========================================================================
    // 1. LOADING SCREEN
    // ========================================================================
    // Diubah: loading screen penuh (600ms) hanya tampil pada kunjungan PERTAMA
    // dalam sesi browser. Untuk navigasi internal berikutnya (klik menu, dsb),
    // loading screen disembunyikan nyaris instan supaya tidak terasa seperti
    // "reload" — perasaan reload itu yang justru mau kita hilangkan sesuai
    // tujuan utama (transisi terasa seperti aplikasi native).
    const loadingScreen = document.getElementById('loading-screen');

    if (loadingScreen) {
        let hasVisitedThisSession = false;
        try {
            hasVisitedThisSession = sessionStorage.getItem('pfl_visited') === '1';
        } catch (err) {
            // sessionStorage bisa gagal di mode private/incognito tertentu.
            // Aman diabaikan: fallback ke perilaku "kunjungan pertama".
        }

        const hideDelay = hasVisitedThisSession ? 50 : 600;
        const fallbackDelay = hasVisitedThisSession ? 800 : 3000;

        window.addEventListener('load', function() {
            setTimeout(function() {
                loadingScreen.classList.add('hidden');
            }, hideDelay);

            try {
                sessionStorage.setItem('pfl_visited', '1');
            } catch (err) {
                // Diabaikan dengan sengaja, lihat catatan di atas.
            }
        });

        // Fallback: hide after 3 seconds (atau 800ms untuk navigasi internal)
        // jika event 'load' tidak kunjung terpicu.
        setTimeout(function() {
            if (!loadingScreen.classList.contains('hidden')) {
                loadingScreen.classList.add('hidden');
            }
        }, fallbackDelay);
    }

    // ========================================================================
    // 2. NAVBAR
    // ========================================================================
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    // Navbar scroll effect
    let lastScrollY = 0;

    function handleNavbarScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    }

    // Throttled scroll handler
    let ticking = false;
    // ========================================================================
    // 4. SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                const targetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }
            }
        });
    });

    // ========================================================================
    // 5. KEYBOARD ACCESSIBILITY
    // ========================================================================
    document.addEventListener('keydown', function(e) {
        // Close mobile menu on Escape key
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
            navLinks.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            hamburger.focus();
        }

        // Close lightbox on Escape key
        const lightbox = document.getElementById('lightbox');
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // ========================================================================
    // 6. PERFORMANCE: Reduce layout shifts
    // ========================================================================
    // Set aspect ratio for images if not already set
    document.querySelectorAll('img:not([width])').forEach(function(img) {
        img.setAttribute('width', 'auto');
        img.setAttribute('height', 'auto');
    });

    // ========================================================================
    // 7. PAGE TRANSITIONS (fallback untuk browser tanpa native View Transitions)
    // ========================================================================
    // STRATEGI:
    // - Solusi UTAMA adalah native Cross-Document View Transitions API, yang
    //   diaktifkan lewat <meta name="view-transition" content="same-origin">
    //   di setiap halaman. Untuk browser yang mendukung (Chromium 126+),
    //   browser menangani seluruh animasi keluar/masuk secara otomatis,
    //   TANPA JavaScript sama sekali. Blok di bawah ini TIDAK berjalan
    //   di browser tersebut.
    // - Untuk browser yang BELUM mendukung, kita pasang fallback ringan:
    //   navigasi tetap navigasi asli (bukan fetch/SPA palsu — supaya semua
    //   script per-halaman, termasuk form handler di contact.html, tetap
    //   berjalan normal), hanya saja kita beri jeda singkat untuk memutar
    //   animasi fade-out sebelum browser benar-benar pindah halaman, dan
    //   animasi fade-in saat halaman baru selesai dimuat.
    // - Menghormati prefers-reduced-motion: jika pengguna mengaktifkannya,
    //   seluruh fallback ini dilewati sepenuhnya (navigasi instan seperti biasa).
    const supportsNativeViewTransitions = 'startViewTransition' in document;
    const prefersReducedMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!supportsNativeViewTransitions && !prefersReducedMotion) {
        const FADE_MS = 380;
        const page = document.getElementById('page-content');

        if (page) {
            // Inject CSS minimal & mandiri (tidak bergantung pada animation.css)
            // supaya fallback ini langsung berfungsi. Hanya opacity & transform
            // yang dianimasikan agar tetap GPU-accelerated dan 60fps.
            const style = document.createElement('style');
            style.id = 'pt-fallback-styles';
            style.textContent =
                '#page-content{opacity:0;transform:translateY(8px);' +
                'animation:pt-enter ' + FADE_MS + 'ms cubic-bezier(.4,0,.2,1) forwards;}' +
                'body.pt-leaving #page-content{will-change:opacity,transform;' +
                'opacity:0;transform:translateY(8px);' +
                'transition:opacity ' + FADE_MS + 'ms cubic-bezier(.4,0,.2,1),' +
                'transform ' + FADE_MS + 'ms cubic-bezier(.4,0,.2,1);}' +
                '@keyframes pt-enter{from{opacity:0;transform:translateY(8px);}' +
                'to{opacity:1;transform:translateY(0);}}';
            document.head.appendChild(style);

            // Jika halaman dipulihkan dari bfcache (tombol back/forward),
            // jangan putar ulang animasi masuk — langsung tampil penuh.
            window.addEventListener('pageshow', function(e) {
                if (e.persisted) {
                    page.style.animation = 'none';
                    page.style.opacity = '1';
                    page.style.transform = 'none';
                }
            });

            document.addEventListener('click', function(e) {
                const link = e.target.closest ? e.target.closest('a[href]') : null;
                if (!link) return;

                // Lewati: klik dengan modifier key, tombol selain klik kiri,
                // link yang sengaja dibuka di tab baru, atau link download.
                if (e.defaultPrevented || e.button !== 0 ||
                    e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                if (link.target && link.target !== '' && link.target !== '_self') return;
                if (link.hasAttribute('download')) return;

                let url;
                try {
                    url = new URL(link.href, window.location.href);
                } catch (err) {
                    return; // href tidak valid sebagai URL (mis. javascript:void(0))
                }

                // Lewati link eksternal (beda origin) — termasuk mailto:, tel:,
                // wa.me, dan Google Maps yang originnya pasti berbeda.
                if (url.origin !== window.location.origin) return;

                // Lewati anchor di halaman yang sama (mis. nav "#about" di index.html)
                // — biarkan smooth-scroll di bagian 4 yang menangani ini.
                if (url.pathname === window.location.pathname && url.hash) return;

                e.preventDefault();
                document.body.classList.add('pt-leaving');

                let navigated = false;
                function goToNextPage() {
                    if (navigated) return;
                    navigated = true;
                    window.location.href = url.href;
                }

                // Navigasi sungguhan dijalankan setelah animasi fade-out selesai,
                // dengan safety-net timeout supaya tidak pernah "macet".
                page.addEventListener('transitionend', goToNextPage, { once: true });
                setTimeout(goToNextPage, FADE_MS + 80);
            });
        }
    }

    // ========================================================================
    // 8. CONSOLE WELCOME
    // ========================================================================
    console.log('%c Umar Maulana Portfolio ', 'background: #0D0D0D; color: #FF6B35; font-size: 20px; font-weight: bold; padding: 10px;');
    console.log('%c Full Stack Developer & Photographer ', 'color: #8A8A8A; font-size: 14px;');
    console.log('%c Built with ❤️ using vanilla HTML, CSS & JavaScript ', 'color: #8A8A8A; font-size: 12px;');

})();