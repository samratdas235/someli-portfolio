/* ==========================================================================
   INTERACTIVE LOGIC - SOMELI BHATTACHARYA PORTFOLIO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    const sections = document.querySelectorAll('.content-section');
    const navItems = document.querySelectorAll('.nav-item');
    const resumeBtn = document.getElementById('btn-view-cv');
    const contactBtn = document.getElementById('btn-contact-me');
    const hireBtn = document.getElementById('btn-hire-me');
    const contactModal = document.getElementById('contact-modal');
    const closeModalBtn = document.getElementById('btn-close-modal');

    // 1. PAGE TABS SWITCHING LOGIC
    function showSection(sectionId) {
        // Hide all sections and remove active classes
        sections.forEach(sec => {
            sec.classList.remove('active');
            sec.style.display = 'none';
        });

        // Find the target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
            // Force reflow to allow transition to register
            targetSection.offsetHeight;
            targetSection.classList.add('active');
            
            // Scroll right pane / window to top
            window.scrollTo({ top: 0, behavior: 'instant' });
        }

        // Update Navbar Active States
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
            }
        });

        // Trigger stats count up if returning to Home
        if (sectionId === 'home') {
            triggerStatsCountUp();
        }
    }

    // Bind Navbar Menu Clicks
    navItems.forEach(item => {
        const link = item.querySelector('a');
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.getAttribute('data-section');
            showSection(sectionId);
        });
    });



    // Set Initial Active Section (moved to bottom of script)


    // 2. GLOBAL CONTACT MODAL LOGIC
    function openContactModal() {
        if (contactModal) {
            contactModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop background scrolling
        }
    }

    function closeContactModal() {
        if (contactModal) {
            contactModal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restore background scrolling
            
            // If success overlay is active, hide it and reset form
            const successOverlay = document.getElementById('form-success-overlay');
            const contactForm = document.getElementById('portfolio-contact-form');
            if (successOverlay && successOverlay.classList.contains('active')) {
                successOverlay.classList.remove('active');
                if (contactForm) contactForm.reset();
            }
        }
    }

    if (contactBtn) contactBtn.addEventListener('click', (e) => { e.preventDefault(); openContactModal(); });
    if (hireBtn) hireBtn.addEventListener('click', (e) => { e.preventDefault(); openContactModal(); });
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeContactModal);

    // Close modal when clicking outside of modal card
    if (contactModal) {
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                closeContactModal();
            }
        });
    }


    // 3. PROJECT FILTERING LOGIC
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filterValue = btn.getAttribute('data-filter');

                // Toggle active class on buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter cards
                projectCards.forEach(card => {
                    const cardCategories = card.getAttribute('data-category') || '';
                    const categoriesArray = cardCategories.split(' ');

                    if (filterValue === 'all' || categoriesArray.includes(filterValue)) {
                        card.classList.remove('hide');
                        card.classList.add('show');
                    } else {
                        card.classList.add('hide');
                        card.classList.remove('show');

                        // Clean up: Close accordion inside hidden card if it was open
                        const insideBtn = card.querySelector('.btn-inside-brain');
                        const insideContent = card.querySelector('.inside-brain-content');
                        if (insideBtn && insideBtn.classList.contains('active')) {
                            insideBtn.classList.remove('active');
                            insideBtn.style.color = 'var(--color-text-white)';
                            if (insideContent) insideContent.classList.remove('active');
                            const arrowIcon = insideBtn.querySelector('.arrow-down-icon');
                            if (arrowIcon) arrowIcon.style.transform = 'rotate(0deg)';
                        }
                    }
                });
            });
        });
    }


    // 4. "INSIDE MY BRAIN" ACCORDION TOGGLING
    const accordionButtons = document.querySelectorAll('.btn-inside-brain');

    accordionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const contentPanel = btn.nextElementSibling;
            
            // Toggle current panel
            btn.classList.toggle('active');
            contentPanel.classList.toggle('active');
            
            // Rotate SVG arrow
            const arrowIcon = btn.querySelector('.arrow-down-icon');
            if (btn.classList.contains('active')) {
                arrowIcon.style.transform = 'rotate(180deg)';
                btn.style.color = 'var(--color-primary)';
            } else {
                arrowIcon.style.transform = 'rotate(0deg)';
                btn.style.color = 'var(--color-text-white)';
            }
        });
    });


    // 5. STATS COUNT-UP ANIMATION
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    const countUp = (element) => {
        const start = parseFloat(element.getAttribute('data-target-start')) || 0;
        const target = parseFloat(element.getAttribute('data-target'));
        const isDecimal = target % 1 !== 0;
        const speed = 1200; // duration in ms
        const increment = (target - start) / (speed / 16); // 60fps frame rate increment
        let current = start;

        const updateNumber = () => {
            current += increment;
            if (current < target) {
                element.innerText = isDecimal ? current.toFixed(1) : Math.floor(current);
                setTimeout(updateNumber, 16);
            } else {
                element.innerText = target;
            }
        };

        updateNumber();
    };

    function triggerStatsCountUp() {
        if (!statsAnimated) {
            statNumbers.forEach(num => countUp(num));
            statsAnimated = true; // Run once when first visited
        }
    }


    // 6. CONTACT FORM INTERACTION & SUCCESS OVERLAY
    const contactForm = document.getElementById('portfolio-contact-form');
    const successOverlay = document.getElementById('form-success-overlay');
    const closeSuccessBtn = document.getElementById('btn-close-success');
    const submitBtn = contactForm ? contactForm.querySelector('.btn-submit') : null;

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Add loading state to button
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>Sending...</span> <svg class="send-icon spinner" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)"></circle><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor"></path></svg>`;
                
                // Add simple spinner animation
                const spinner = submitBtn.querySelector('.spinner');
                spinner.style.animation = 'spin 1s linear infinite';
            }

            // Simulate form submission delay
            setTimeout(() => {
                // Show Success Overlay inside the modal
                if (successOverlay) successOverlay.classList.add('active');
                
                // Reset Button
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<span>Send Message</span> <svg class="send-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>`;
                }
            }, 1500);
        });
    }

    if (closeSuccessBtn && successOverlay) {
        closeSuccessBtn.addEventListener('click', () => {
            closeContactModal();
        });
    }

    // Add spinner keyframes dynamically to document
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styleSheet);

    // Set Initial Active Section after all functions are initialized
    showSection('home');
});
