/**
 * VARDHMAN POLYFAB INDUSTRIES - JAVASCRIPT INTERACTIONS
 * High-End B2B Manufacturing & Export Portal
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navigation Toggle
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

    // 2. Sticky Header Elevation
    const siteHeader = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (siteHeader) {
            if (window.scrollY > 40) {
                siteHeader.style.boxShadow = '0 4px 20px rgba(11, 25, 44, 0.1)';
            } else {
                siteHeader.style.boxShadow = 'var(--shadow-sm)';
            }
        }
    });

    // 3. Animated Number Counters on Scroll
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    function animateCounters() {
        if (animated) return;
        statNumbers.forEach(stat => {
            const rect = stat.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const targetText = stat.innerText.trim();
                const numMatch = targetText.match(/(\d+)/);
                if (numMatch) {
                    const targetNum = parseInt(numMatch[1], 10);
                    const suffix = targetText.replace(numMatch[1], '');
                    let current = 0;
                    const step = Math.ceil(targetNum / 40);
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= targetNum) {
                            stat.innerText = targetNum + suffix;
                            clearInterval(timer);
                        } else {
                            stat.innerText = current + suffix;
                        }
                    }, 35);
                }
                animated = true;
            }
        });
    }

    if (statNumbers.length > 0) {
        window.addEventListener('scroll', animateCounters);
        animateCounters();
    }

    // 4. FAQ Accordion
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

    // 5. Product Category Filters (products.html)
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

    // 6. Product Detail Image Switcher (product-detail.html)
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

    // 7. RFQ Quote Modal
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
                        if (productSelect.options[i].text.toLowerCase().includes(productName.toLowerCase())) {
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

    // 8. Back-to-Top Button
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 9. Form Submission Handling with Feedback
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Submitting RFQ...';
            }

            setTimeout(() => {
                alert('Thank you for your RFQ submission! Our technical sales engineering team will contact you with a customized quotation and specification sheet within 12 business hours.');
                form.reset();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
                closeModal();
            }, 800);
        });
    });
});
