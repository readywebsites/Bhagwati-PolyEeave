/**
 * BHAGWATI POLYWEAVE / VARDHMAN POLYFAB
 * Modern 3D BOPP Packaging Interactive Controller
 * Jiro-Inspired Motion & 2.5D Experience
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth < 992);

    /* ================= 1. 3D HERO PRODUCT MOUSE PARALLAX & TILT ================= */
    const heroStageCard = document.querySelector('.hero-stage-card');
    const heroProductImg = document.querySelector('.hero-product-img');
    const floatingBadges = document.querySelectorAll('.floating-3d-badge');
    const heroContainer = document.querySelector('.hero-stage-container');

    if (heroStageCard && heroContainer && !prefersReducedMotion && !isTouchDevice) {
        let mouseX = 0, mouseY = 0;
        let currentRx = 0, currentRy = 0;
        let targetRx = 0, targetRy = 0;
        let isHovered = false;

        heroContainer.addEventListener('mouseenter', () => {
            isHovered = true;
        });

        heroContainer.addEventListener('mousemove', (e) => {
            const rect = heroContainer.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within container
            const y = e.clientY - rect.top;  // y position within container
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Normalized coordinates (-1 to 1)
            const normX = (x - centerX) / centerX;
            const normY = (y - centerY) / centerY;

            // Target 3D rotation angles (degrees)
            targetRy = normX * 14;  // Rotate around Y axis
            targetRx = -normY * 12; // Rotate around X axis
        });

        heroContainer.addEventListener('mouseleave', () => {
            isHovered = false;
            targetRx = 0;
            targetRy = 0;
        });

        // Animation loop for fluid physics (Lerp)
        function render3DHero() {
            if (!prefersReducedMotion && !isTouchDevice) {
                // Smooth interpolation (lerp)
                const factor = isHovered ? 0.08 : 0.05;
                currentRx += (targetRx - currentRx) * factor;
                currentRy += (targetRy - currentRy) * factor;

                heroStageCard.style.transform = `rotateX(${currentRx.toFixed(2)}deg) rotateY(${currentRy.toFixed(2)}deg)`;

                // Badges Parallax
                floatingBadges.forEach((badge) => {
                    const depth = parseFloat(badge.getAttribute('data-depth') || '1');
                    const badgeTx = currentRy * depth * 0.9;
                    const badgeTy = currentRx * depth * -0.9;
                    const baseZ = badge.classList.contains('floating-badge-top-right') ? 45 : 
                                  badge.classList.contains('floating-badge-bottom-right') ? 50 : 35;
                    badge.style.transform = `translateZ(${baseZ}px) translate(${badgeTx.toFixed(1)}px, ${badgeTy.toFixed(1)}px)`;
                });
            }
            requestAnimationFrame(render3DHero);
        }

        render3DHero();
    }

    /* ================= 2. HERO PRODUCT SWITCHER TABS ================= */
    const productTabs = document.querySelectorAll('.product-switch-tab');
    const heroMainImg = document.querySelector('.hero-product-img');
    const heroBadgeTopRight = document.querySelector('.floating-badge-top-right .floating-badge-info strong');
    const heroBadgeTopRightSub = document.querySelector('.floating-badge-top-right .floating-badge-info span');

    // Product Database for Hero 3D Showcase
    const heroProductData = {
        'rice': {
            img: 'assets/images/bopp-rice-bag.jpg',
            alt: 'Premium BOPP Woven Rice Bag with handles',
            badgeTitle: '10-Color HD Gravure',
            badgeSub: 'High-Gloss Rice Packaging'
        },
        'fertilizer': {
            img: 'assets/images/bopp-fertilizer-bag.jpg',
            alt: 'Heavy-Duty BOPP Fertilizer & Agro Sack',
            badgeTitle: 'Micro-Perforated',
            badgeSub: 'Chemical & Moisture Barrier'
        },
        'cement': {
            img: 'assets/images/bopp-cement-bag.jpg',
            alt: 'AD*STAR Block Bottom Valve Cement Sack',
            badgeTitle: 'Block Bottom Valve',
            badgeSub: 'Zero-Spillage High-Speed Filling'
        },
        'feed': {
            img: 'assets/images/bopp-animal-feed.jpg',
            alt: 'Aroma-Sealed BOPP Animal Feed & Pet Food Bag',
            badgeTitle: 'Aroma & Fat Barrier',
            badgeSub: 'Multi-Layer Pet Food Sacks'
        },
        'sugar': {
            img: 'assets/images/bopp-sugar-bag.jpg',
            alt: 'Food-Grade BOPP Laminated Sugar Bag',
            badgeTitle: 'Food Grade BRCGS',
            badgeSub: 'Anti-Caking Extrusion Seal'
        }
    };

    if (productTabs.length > 0 && heroMainImg) {
        productTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                productTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const key = tab.getAttribute('data-product-key');
                const data = heroProductData[key];

                if (data) {
                    // Smooth 3D flip out
                    heroMainImg.style.opacity = '0';
                    heroMainImg.style.transform = 'scale(0.92) rotateY(15deg)';

                    setTimeout(() => {
                        heroMainImg.src = data.img;
                        heroMainImg.alt = data.alt;
                        if (heroBadgeTopRight) heroBadgeTopRight.textContent = data.badgeTitle;
                        if (heroBadgeTopRightSub) heroBadgeTopRightSub.textContent = data.badgeSub;

                        // Smooth 3D flip in
                        heroMainImg.style.opacity = '1';
                        heroMainImg.style.transform = 'scale(1) rotateY(0deg)';
                    }, 200);
                }
            });
        });
    }

    /* ================= 3. 2.5D BOPP BAG ANATOMY LAYER EXPLORER ================= */
    const layerItems = document.querySelectorAll('.layer-item-card');
    const showcaseBagImg = document.querySelector('.showcase-bag-img');

    if (layerItems.length > 0 && showcaseBagImg) {
        layerItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                layerItems.forEach(l => l.classList.remove('active'));
                item.classList.add('active');

                // Dynamic visual shift based on selected layer
                const angles = [
                    { ry: -8, rx: 4, scale: 1.02 },
                    { ry: -14, rx: 6, scale: 1.05 },
                    { ry: 4, rx: -4, scale: 1.03 },
                    { ry: 10, rx: 8, scale: 1.06 }
                ];
                const angle = angles[index] || angles[0];
                showcaseBagImg.style.transform = `rotateY(${angle.ry}deg) rotateX(${angle.rx}deg) scale(${angle.scale})`;
            });
        });
    }

    /* ================= 4. ANIMATED STATISTICS COUNTER ON SCROLL ================= */
    const statElements = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateStats() {
        if (countersAnimated) return;

        statElements.forEach(stat => {
            const rect = stat.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
                const targetValue = parseInt(stat.getAttribute('data-target') || stat.textContent.trim(), 10);
                if (isNaN(targetValue)) return;

                let startValue = 0;
                const duration = 1800; // ms
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // EaseOutExpo curve
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

    /* ================= 5. SCROLL REVEAL (INTERSECTION OBSERVER) ================= */
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
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    /* ================= 6. STICKY HEADER ELEVATION ================= */
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

    /* ================= 7. FAQ ACCORDION ================= */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(other => other.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

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

    // Escape key listener for modal
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

    /* ================= 10. PRODUCT CATEGORY FILTER (products.html) ================= */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-grid .product-card');

    if (filterButtons.length > 0 && productCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filterValue = btn.getAttribute('data-filter');

                productCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue || (category && category.includes(filterValue))) {
                        card.style.display = 'flex';
                        setTimeout(() => { card.style.opacity = '1'; }, 50);
                    } else {
                        card.style.opacity = '0';
                        setTimeout(() => { card.style.display = 'none'; }, 200);
                    }
                });
            });
        });
    }

    /* ================= 11. PRODUCT DETAIL IMAGE SWITCHER (product-detail.html) ================= */
    const mainDetailImg = document.querySelector('.gallery-main img');
    const thumbItems = document.querySelectorAll('.thumb-item');

    if (mainDetailImg && thumbItems.length > 0) {
        thumbItems.forEach(thumb => {
            thumb.addEventListener('click', () => {
                thumbItems.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                const newSrc = thumb.querySelector('img').getAttribute('src');
                mainDetailImg.setAttribute('src', newSrc);
            });
        });
    }

    /* ================= 12. BACK TO TOP BUTTON ================= */
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

    /* ================= 13. FORM SUBMISSION FEEDBACK ================= */
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
