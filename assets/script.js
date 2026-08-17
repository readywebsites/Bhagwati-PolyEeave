/**
 * BHAGWATI POLYWEAVE / VARDHMAN POLYFAB
 * Cinematic Video Hero, 3D Interactive Motion & Mobile Carousels Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth < 992);

    /* ================= 1. CINEMATIC HERO VIDEO & SCROLL TRANSITION ================= */
    const heroVideo = document.querySelector('.hero-video-bg');
    const heroVideoContainer = document.querySelector('.hero-video-container');
    const heroContent = document.querySelector('.hero-cinematic-content');
    const heroWrap = document.querySelector('.hero-cinematic-wrap');
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');

    if (heroVideo) {
        heroVideo.addEventListener('loadeddata', () => {
            heroVideo.classList.add('loaded');
        });
        if (heroVideo.readyState >= 2) {
            heroVideo.classList.add('loaded');
        }
    }

    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const nextSection = document.querySelector('.stats-bar-section') || document.querySelector('#product-story');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Video Scroll Scaling
    let isTicking = false;
    function onScrollTransitions() {
        const scrollY = window.scrollY;
        const heroHeight = heroWrap ? heroWrap.offsetHeight : 700;

        if (scrollY <= heroHeight + 100) {
            const progress = Math.min(Math.max(scrollY / heroHeight, 0), 1);

            if (heroVideoContainer && !prefersReducedMotion) {
                const scale = 1 - (progress * 0.08);
                const translateY = progress * 40;
                heroVideoContainer.style.transform = `scale(${scale.toFixed(3)}) translateY(${translateY.toFixed(1)}px)`;
            }

            if (heroContent && !prefersReducedMotion) {
                const contentOpacity = Math.max(1 - (progress * 1.5), 0);
                const contentTranslate = -progress * 60;
                heroContent.style.opacity = contentOpacity.toFixed(2);
                heroContent.style.transform = `translateY(${contentTranslate.toFixed(1)}px)`;
            }

            if (scrollIndicator) {
                const indOpacity = Math.max(1 - (progress * 3.5), 0);
                scrollIndicator.style.opacity = indOpacity.toFixed(2);
            }
        }

        isTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!isTicking) {
            window.requestAnimationFrame(onScrollTransitions);
            isTicking = true;
        }
    }, { passive: true });

    onScrollTransitions();

    /* ================= 2. PRODUCT STORY EMERGENCE PARALLAX ================= */
    const productStoryImg = document.querySelector('.product-story-img');
    const productStoryStage = document.querySelector('.product-story-stage');

    if (productStoryStage && productStoryImg && !prefersReducedMotion && !isTouchDevice) {
        productStoryStage.addEventListener('mousemove', (e) => {
            const rect = productStoryStage.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = -((y - centerY) / centerY) * 12;
            const rotateY = ((x - centerX) / centerX) * 14;

            productStoryStage.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
        });

        productStoryStage.addEventListener('mouseleave', () => {
            productStoryStage.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    }

    /* ================= 3. REUSABLE MOBILE HORIZONTAL CAROUSEL FACTORY ================= */
    function initMobileCarousel(config) {
        const wrapper = document.querySelector(config.wrapperSelector);
        const track = document.querySelector(config.trackSelector);
        const slides = document.querySelectorAll(config.slideSelector);
        const dots = document.querySelectorAll(config.dotsSelector);
        const prevBtn = document.querySelector(config.prevSelector);
        const nextBtn = document.querySelector(config.nextSelector);
        const delay = config.delay || 3500;

        if (!wrapper || !track || slides.length === 0) return null;

        let currentSlide = 0;
        const totalSlides = slides.length;
        let autoPlayInterval = null;
        let pauseTimeout = null;
        let touchStartX = 0;
        let touchStartY = 0;
        let touchCurrentX = 0;
        let isSwiping = false;

        function isMobile() {
            return window.innerWidth <= 768;
        }

        function update(animate = true) {
            if (!isMobile()) return;

            if (animate) {
                track.style.transition = 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)';
            } else {
                track.style.transition = 'none';
            }

            const translatePercent = -(currentSlide * 100);
            track.style.transform = `translateX(${translatePercent}%)`;

            // Update active state on slides
            slides.forEach((slide, idx) => {
                if (idx === currentSlide) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            // Update pagination dots
            dots.forEach((dot, idx) => {
                if (idx === currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        function goTo(index, animate = true) {
            currentSlide = (index + totalSlides) % totalSlides;
            update(animate);
        }

        function next() {
            goTo(currentSlide + 1);
        }

        function prev() {
            goTo(currentSlide - 1);
        }

        function startAutoplay() {
            stopAutoplay();
            if (isMobile() && !prefersReducedMotion) {
                autoPlayInterval = setInterval(next, delay);
            }
        }

        function stopAutoplay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        }

        function handleInteraction() {
            stopAutoplay();
            clearTimeout(pauseTimeout);
            pauseTimeout = setTimeout(() => {
                startAutoplay();
            }, 5000);
        }

        // Touch Gestures
        wrapper.addEventListener('touchstart', (e) => {
            if (!isMobile()) return;
            handleInteraction();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchCurrentX = touchStartX;
            isSwiping = true;
        }, { passive: true });

        wrapper.addEventListener('touchmove', (e) => {
            if (!isSwiping || !isMobile()) return;
            touchCurrentX = e.touches[0].clientX;
        }, { passive: true });

        wrapper.addEventListener('touchend', () => {
            if (!isSwiping || !isMobile()) return;
            isSwiping = false;
            const diffX = touchStartX - touchCurrentX;
            const threshold = 40; // minimum swipe distance

            if (diffX > threshold) {
                next(); // swipe left -> next slide
            } else if (diffX < -threshold) {
                prev(); // swipe right -> prev slide
            }
        });

        // Navigation Controls
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                handleInteraction();
                prev();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                handleInteraction();
                next();
            });
        }

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                handleInteraction();
                goTo(idx);
            });
        });

        // Responsive Resize Switch
        function onResize() {
            if (isMobile()) {
                goTo(currentSlide, false);
                startAutoplay();
            } else {
                stopAutoplay();
                track.style.transform = 'none';
                track.style.transition = 'none';
                slides.forEach(slide => slide.classList.remove('active'));
            }
        }

        window.addEventListener('resize', onResize, { passive: true });

        // Initialize
        if (isMobile()) {
            goTo(0, false);
            startAutoplay();
        }

        return { goTo, next, prev, startAutoplay, stopAutoplay };
    }

    // Initialize 1. Products Carousel
    initMobileCarousel({
        wrapperSelector: '.product-carousel-wrapper',
        trackSelector: '.product-carousel-track',
        slideSelector: '.product-carousel-slide',
        dotsSelector: '.carousel-dots .carousel-dot',
        prevSelector: '.carousel-prev',
        nextSelector: '.carousel-next',
        delay: 3500
    });

    // Initialize 2. Applications Carousel
    initMobileCarousel({
        wrapperSelector: '.app-carousel-wrapper',
        trackSelector: '.app-carousel-track',
        slideSelector: '.app-carousel-slide',
        dotsSelector: '.app-carousel-dots .carousel-dot',
        prevSelector: '.app-carousel-prev',
        nextSelector: '.app-carousel-next',
        delay: 3500
    });

    /* ================= 4. DESKTOP PRODUCT CARDS 3D PERSPECTIVE HOVER ================= */
    const productCards = document.querySelectorAll('.product-card-3d');
    if (productCards.length > 0 && !prefersReducedMotion && !isTouchDevice) {
        productCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (window.innerWidth <= 768) return;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = -((y - centerY) / centerY) * 8;
                const rotateY = ((x - centerX) / centerX) * 8;
                card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                if (window.innerWidth <= 768) return;
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            });
        });
    }

    /* ================= 5. MANUFACTURING TIMELINE SCROLL PROGRESSION ================= */
    const processSection = document.querySelector('.process-section');
    const processProgressBar = document.querySelector('.process-timeline-progress-fill');
    const stepNodes = document.querySelectorAll('.process-step-node');

    function updateProcessTimeline() {
        if (!processSection || !processProgressBar) return;
        const rect = processSection.getBoundingClientRect();
        const winHeight = window.innerHeight;

        if (rect.top < winHeight && rect.bottom > 0) {
            const totalScrollable = winHeight + rect.height;
            const currentScroll = winHeight - rect.top;
            const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
            const fillPercent = Math.min(100, progress * 130);
            processProgressBar.style.width = `${fillPercent}%`;

            stepNodes.forEach((node, idx) => {
                const nodeThreshold = (idx + 0.5) / stepNodes.length;
                if (progress >= nodeThreshold) {
                    node.classList.add('active');
                } else {
                    node.classList.remove('active');
                }
            });
        }
    }

    window.addEventListener('scroll', updateProcessTimeline, { passive: true });
    updateProcessTimeline();

    stepNodes.forEach((node, idx) => {
        node.addEventListener('mouseenter', () => {
            stepNodes.forEach((n, i) => {
                if (i <= idx) n.classList.add('active');
                else n.classList.remove('active');
            });
            if (processProgressBar) {
                processProgressBar.style.width = `${((idx + 1) / stepNodes.length) * 100}%`;
            }
        });
    });

    /* ================= 6. STATISTICS ANIMATED COUNTER (WITH IMMEDIATE FALLBACK) ================= */
    const statElements = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateStats() {
        if (countersAnimated) return;

        statElements.forEach(stat => {
            const rect = stat.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
                const targetValue = parseInt(stat.getAttribute('data-target') || stat.textContent.trim(), 10);
                if (isNaN(targetValue)) return;

                const duration = 1800;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    const currentVal = Math.floor(easeProgress * targetValue);

                    stat.textContent = currentVal;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        stat.textContent = targetValue;
                    }
                }

                requestAnimationFrame(updateCounter);
                countersAnimated = true;
            }
        });
    }

    window.addEventListener('scroll', animateStats, { passive: true });
    animateStats();

    /* ================= 7. SCROLL REVEAL (INTERSECTION OBSERVER) ================= */
    const revealElements = document.querySelectorAll('.reveal-init');

    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    /* ================= 8. STICKY HEADER ELEVATION ================= */
    const siteHeader = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (siteHeader) {
            if (window.scrollY > 30) {
                siteHeader.style.boxShadow = '0 10px 30px rgba(7, 21, 38, 0.08)';
                siteHeader.style.backgroundColor = 'rgba(255, 255, 255, 0.97)';
            } else {
                siteHeader.style.boxShadow = 'var(--shadow-sm)';
                siteHeader.style.backgroundColor = 'rgba(255, 255, 255, 0.94)';
            }
        }
    }, { passive: true });

    /* ================= 9. RFQ QUOTE MODAL ================= */
    const modal = document.getElementById('quoteModal');
    const openQuoteBtns = document.querySelectorAll('.open-quote-modal');
    const closeQuoteBtn = document.querySelector('.modal-close');

    function openModal(productName = '') {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (productName) {
                const productSelect = modal.querySelector('select[name="product_type"]');
                if (productSelect) {
                    for (let i = 0; i < productSelect.options.length; i++) {
                        if (productSelect.options[i].text.toLowerCase().includes(productName.toLowerCase()) ||
                            productSelect.options[i].value.toLowerCase().includes(productName.toLowerCase())) {
                            productSelect.selectedIndex = i;
                            break;
                        }
                    }
                }
            }
        }
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    openQuoteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const product = btn.getAttribute('data-product') || '';
            openModal(product);
        });
    });

    if (closeQuoteBtn) closeQuoteBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    /* ================= 10. MOBILE NAVIGATION DRAWER ================= */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileDrawer = document.querySelector('.mobile-nav-drawer');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileClose = document.querySelector('.mobile-close-btn');

    function openMobileNav() {
        if (mobileDrawer && mobileOverlay) {
            mobileDrawer.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeMobileNav() {
        if (mobileDrawer && mobileOverlay) {
            mobileDrawer.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openMobileNav);
    if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileNav);

    /* ================= 11. BACK TO TOP BUTTON ================= */
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ================= 12. FORM SUBMISSION FEEDBACK ================= */
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Submitting RFQ Proposal...';
            }

            setTimeout(() => {
                alert('Thank you for your RFQ submission! Our technical sales engineers will contact you with a customized quotation and specification sheet within 12 business hours.');
                form.reset();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
                closeModal();
            }, 750);
        });
    });
});
