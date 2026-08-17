/**
 * BHAGWATI POLYWEAVE / VARDHMAN POLYFAB
 * Modern 3D BOPP Packaging Interactive Controller
 * Jiro-Inspired Motion & 2.5D Experience
 */

document.addEventListener('DOMContentLoaded', () => {
    // Motion preference & touch screen check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth < 992);

    /* ================= 1. JIRO-INSPIRED 3D HERO MOUSE PARALLAX & TILT ================= */
    const heroStageCard = document.querySelector('.hero-stage-card');
    const heroProductImg = document.querySelector('.hero-product-img');
    const heroFloorShadow = document.querySelector('.hero-floor-shadow');
    const heroBackdropGlow = document.querySelector('.hero-backdrop-glow');
    const floatingBadges = document.querySelectorAll('.floating-3d-badge');
    const heroContainer = document.querySelector('.hero-stage-container');

    if (heroStageCard && heroContainer && !prefersReducedMotion && !isTouchDevice) {
        let mouseX = 0, mouseY = 0;
        let currentRx = 0, currentRy = 0;
        let targetRx = 0, targetRy = 0;
        let glowTx = 0, glowTy = 0;
        let targetGlowTx = 0, targetGlowTy = 0;
        let isHovered = false;

        heroContainer.addEventListener('mouseenter', () => {
            isHovered = true;
        });

        heroContainer.addEventListener('mousemove', (e) => {
            const rect = heroContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Normalized coordinates (-1 to 1)
            const normX = (x - centerX) / centerX;
            const normY = (y - centerY) / centerY;

            // Target 3D rotation angles
            targetRy = normX * 16;  // Rotate around Y axis
            targetRx = -normY * 14; // Rotate around X axis

            // Background glow tracking
            targetGlowTx = normX * 40;
            targetGlowTy = normY * 30;
        });

        heroContainer.addEventListener('mouseleave', () => {
            isHovered = false;
            targetRx = 0;
            targetRy = 0;
            targetGlowTx = 0;
            targetGlowTy = 0;
        });

        // Animation loop for ultra-fluid physics (Lerp)
        function render3DHero() {
            if (!prefersReducedMotion && !isTouchDevice) {
                const factor = isHovered ? 0.085 : 0.05;
                currentRx += (targetRx - currentRx) * factor;
                currentRy += (targetRy - currentRy) * factor;
                glowTx += (targetGlowTx - glowTx) * factor;
                glowTy += (targetGlowTy - glowTy) * factor;

                heroStageCard.style.transform = `rotateX(${currentRx.toFixed(2)}deg) rotateY(${currentRy.toFixed(2)}deg)`;

                // Dynamic Floor Shadow movement
                if (heroFloorShadow) {
                    const shadowTx = currentRy * -1.2;
                    const shadowScale = 1 - Math.abs(currentRx) * 0.015;
                    heroFloorShadow.style.transform = `rotateX(65deg) translate(${shadowTx.toFixed(1)}px, 0px) scale(${shadowScale.toFixed(2)})`;
                }

                // Dynamic Ambient Glow
                if (heroBackdropGlow) {
                    heroBackdropGlow.style.transform = `translateY(-50%) translate(${glowTx.toFixed(1)}px, ${glowTy.toFixed(1)}px)`;
                }

                // Multi-Depth Badges Parallax
                floatingBadges.forEach((badge) => {
                    const depth = parseFloat(badge.getAttribute('data-depth') || '1');
                    const badgeTx = currentRy * depth * 0.95;
                    const badgeTy = currentRx * depth * -0.95;
                    const baseZ = badge.classList.contains('floating-badge-top-right') ? 60 : 
                                  badge.classList.contains('floating-badge-bottom-right') ? 70 : 40;
                    badge.style.transform = `translateZ(${baseZ}px) translate(${badgeTx.toFixed(1)}px, ${badgeTy.toFixed(1)}px)`;
                });
            }
            requestAnimationFrame(render3DHero);
        }

        render3DHero();
    }

    /* ================= 2. HERO PRODUCT SWITCHER (500–800ms TRANSITION) ================= */
    const productTabs = document.querySelectorAll('.product-switch-tab');
    const heroMainImg = document.querySelector('.hero-product-img');
    const heroBadgeTopRight = document.querySelector('.floating-badge-top-right .floating-badge-info strong');
    const heroBadgeTopRightSub = document.querySelector('.floating-badge-top-right .floating-badge-info span');
    const heroBadgeBottomLeft = document.querySelector('.floating-badge-bottom-left .floating-badge-info strong');
    const heroBadgeBottomLeftSub = document.querySelector('.floating-badge-bottom-left .floating-badge-info span');

    const heroProductData = {
        'rice': {
            img: 'assets/images/bopp-rice-bag.jpg',
            alt: 'Premium BOPP Woven Rice Bag with Handles',
            badge1Title: '10-Color HD Gravure',
            badge1Sub: 'High-Gloss Rice Packaging',
            badge2Title: '100% Virgin Polymer',
            badge2Sub: 'Zero-Pinhole Extrusion Bond'
        },
        'fertilizer': {
            img: 'assets/images/bopp-fertilizer-bag.jpg',
            alt: 'Heavy-Duty BOPP Fertilizer & Agro Sack',
            badge1Title: 'Micro-Perforated',
            badge1Sub: 'Chemical & Moisture Barrier',
            badge2Title: '50kg Load Tenacity',
            badge2Sub: 'Corrosion-Resistant Liner'
        },
        'cement': {
            img: 'assets/images/bopp-cement-bag.jpg',
            alt: 'AD*STAR Block Bottom Valve Cement Sack',
            badge1Title: 'Block Bottom Valve',
            badge1Sub: 'Zero-Spillage Rotor Packing',
            badge2Title: 'Self-Closing Seal',
            badge2Sub: 'High-Speed Automated Line'
        },
        'feed': {
            img: 'assets/images/bopp-animal-feed.jpg',
            alt: 'Aroma-Sealed BOPP Animal Feed & Pet Food Bag',
            badge1Title: 'Aroma & Fat Barrier',
            badge1Sub: 'Multi-Layer Pet Food Sacks',
            badge2Title: 'D-Cut Handle Option',
            badge2Sub: 'Side Gusset Brand Print'
        },
        'sugar': {
            img: 'assets/images/bopp-sugar-bag.jpg',
            alt: 'Food-Grade BOPP Laminated Sugar Bag',
            badge1Title: 'Food Grade BRCGS',
            badge1Sub: 'Anti-Caking Extrusion Seal',
            badge2Title: '100% FDA Approved',
            badge2Sub: 'Crystal Moisture Protection'
        }
    };

    let isSwitching = false;

    if (productTabs.length > 0 && heroMainImg) {
        productTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                if (isSwitching || tab.classList.contains('active')) return;
                isSwitching = true;

                productTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const key = tab.getAttribute('data-product-key');
                const data = heroProductData[key];

                if (data) {
                    // Outgoing 3D scale-down & rotation
                    heroMainImg.classList.add('switching-out');
                    heroMainImg.classList.remove('switching-in');

                    // Fade out badge texts smoothly
                    if (heroBadgeTopRight) heroBadgeTopRight.style.opacity = '0.2';
                    if (heroBadgeTopRightSub) heroBadgeTopRightSub.style.opacity = '0.2';
                    if (heroBadgeBottomLeft) heroBadgeBottomLeft.style.opacity = '0.2';
                    if (heroBadgeBottomLeftSub) heroBadgeBottomLeftSub.style.opacity = '0.2';

                    setTimeout(() => {
                        heroMainImg.src = data.img;
                        heroMainImg.alt = data.alt;

                        if (heroBadgeTopRight) {
                            heroBadgeTopRight.textContent = data.badge1Title;
                            heroBadgeTopRight.style.opacity = '1';
                        }
                        if (heroBadgeTopRightSub) {
                            heroBadgeTopRightSub.textContent = data.badge1Sub;
                            heroBadgeTopRightSub.style.opacity = '1';
                        }
                        if (heroBadgeBottomLeft) {
                            heroBadgeBottomLeft.textContent = data.badge2Title;
                            heroBadgeBottomLeft.style.opacity = '1';
                        }
                        if (heroBadgeBottomLeftSub) {
                            heroBadgeBottomLeftSub.textContent = data.badge2Sub;
                            heroBadgeBottomLeftSub.style.opacity = '1';
                        }

                        // Incoming 3D scale-up & rotation into place
                        heroMainImg.classList.remove('switching-out');
                        heroMainImg.classList.add('switching-in');

                        setTimeout(() => {
                            heroMainImg.classList.remove('switching-in');
                            isSwitching = false;
                        }, 500);
                    }, 280);
                } else {
                    isSwitching = false;
                }
            });
        });
    }

    /* ================= 3. PRODUCT CARDS 3D PERSPECTIVE HOVER ================= */
    const productCards = document.querySelectorAll('.product-card-3d');
    if (productCards.length > 0 && !prefersReducedMotion && !isTouchDevice) {
        productCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
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
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            });
        });
    }

    /* ================= 4. MANUFACTURING TIMELINE SCROLL PROGRESSION ================= */
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

            // Highlight step nodes progressively
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

    // Hover on step nodes to highlight progress
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

    /* ================= 5. STATISTICS ANIMATED COUNTER (WITH IMMEDIATE FALLBACK) ================= */
    const statElements = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateStats() {
        if (countersAnimated) return;

        statElements.forEach(stat => {
            const rect = stat.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
                const targetValue = parseInt(stat.getAttribute('data-target') || stat.textContent.trim(), 10);
                if (isNaN(targetValue)) return;

                let startValue = 0;
                const duration = 1800; // ms
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
    animateStats(); // Initial check

    /* ================= 6. SCROLL REVEAL (INTERSECTION OBSERVER) ================= */
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

    /* ================= 7. STICKY HEADER ELEVATION ================= */
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

    /* ================= 8. RFQ QUOTE MODAL ================= */
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

    /* ================= 9. MOBILE NAVIGATION DRAWER ================= */
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

    /* ================= 10. BACK TO TOP BUTTON ================= */
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

    /* ================= 11. FORM SUBMISSION FEEDBACK ================= */
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
