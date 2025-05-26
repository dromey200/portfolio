document.addEventListener('DOMContentLoaded', () => {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const carouselDotsContainer = document.querySelector('.carousel-dots');
    const projectCards = document.querySelectorAll('.project-card');

    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const closeMenuBtn = document.querySelector('.close-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

    // --- Modal Elements ---
    const projectModal = document.getElementById('projectModal');
    const closeProjectModalBtn = document.querySelector('#projectModal .close-button');
    const viewProjectButtons = document.querySelectorAll('.project-card .btn-small:not(.disabled)'); // Select only active buttons

    // --- Mobile Navigation Functionality ---
    if (menuToggle && mobileNavOverlay && closeMenuBtn && mobileNavLinks.length > 0) {
        menuToggle.addEventListener('click', () => {
            mobileNavOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            menuToggle.setAttribute('aria-expanded', 'true');
        });

        closeMenuBtn.addEventListener('click', () => {
            mobileNavOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore background scrolling
            menuToggle.setAttribute('aria-expanded', 'false');
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                // event.preventDefault(); // Uncomment if you want to prevent default scroll behavior for smooth scroll
                mobileNavOverlay.classList.remove('active');
                document.body.style.overflow = '';
                menuToggle.setAttribute('aria-expanded', 'false');
                // Optional: Smooth scroll to section if preventDefault() is active
                // const targetId = link.getAttribute('href').substring(1);
                // const targetSection = document.getElementById(targetId);
                // if (targetSection) {
                //     targetSection.scrollIntoView({ behavior: 'smooth' });
                // }
            });
        });
    } else {
        console.warn("Mobile navigation elements not found. Mobile navigation disabled.");
    }


    // --- Carousel Functionality ---
    if (portfolioGrid && prevBtn && nextBtn && carouselDotsContainer && projectCards.length > 0) {
        // Function to calculate how many items are visible
        const getVisibleItems = () => {
            const gridWidth = portfolioGrid.offsetWidth;
            const cardWidth = projectCards[0].offsetWidth; // Includes padding but not margin/gap
            // Safely get the gap from the parent grid. Fallback to 0 if not found or invalid.
            const gap = parseFloat(getComputedStyle(portfolioGrid).gap) || 0;

            if (cardWidth === 0) return 1; // Avoid division by zero if cards aren't rendered yet

            let items = Math.floor(gridWidth / (cardWidth + gap)); // Reverted to more robust calculation
            return Math.max(1, items); // Ensure at least 1 item is visible
        };

        // Function to update button visibility
        const updateButtonVisibility = () => {
            prevBtn.disabled = portfolioGrid.scrollLeft <= 0;
            const maxScrollLeft = portfolioGrid.scrollWidth - portfolioGrid.offsetWidth;
            nextBtn.disabled = portfolioGrid.scrollLeft >= maxScrollLeft - 1; // -1 for tolerance
        };

        // Function to create/update dots
        const createDots = () => {
            carouselDotsContainer.innerHTML = ''; // Clear existing dots
            const totalCards = projectCards.length;
            const visibleItems = getVisibleItems();
            const numDots = Math.ceil(totalCards / visibleItems);

            if (numDots <= 1) { // If all items fit or only one page, no dots needed
                carouselDotsContainer.style.display = 'none';
                return;
            } else {
                carouselDotsContainer.style.display = 'flex';
            }

            for (let i = 0; i < numDots; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                dot.setAttribute('role', 'button');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.tabIndex = 0; // Make dots focusable
                dot.addEventListener('click', () => {
                    const cardWidthWithGap = projectCards[0].offsetWidth + parseFloat(getComputedStyle(portfolioGrid).gap);
                    const scrollAmount = cardWidthWithGap * visibleItems * i;
                    portfolioGrid.scrollTo({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                });
                dot.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        dot.click();
                    }
                });
                carouselDotsContainer.appendChild(dot);
            }
            updateActiveDot();
        };

        // Function to update active dot
        const updateActiveDot = () => {
            const dots = carouselDotsContainer.querySelectorAll('.dot');
            if (dots.length === 0) return;

            const scrollPosition = portfolioGrid.scrollLeft;
            const cardWidthWithGap = projectCards[0].offsetWidth + parseFloat(getComputedStyle(portfolioGrid).gap);
            const visibleItems = getVisibleItems();

            // Calculate the current "page" based on scroll position
            // Use Math.round to handle partial scrolls and snap points
            const currentPage = Math.round(scrollPosition / (cardWidthWithGap * visibleItems));

            dots.forEach((dot, index) => {
                if (index === currentPage) {
                    dot.classList.add('active');
                    dot.setAttribute('aria-current', 'true');
                } else {
                    dot.classList.remove('active');
                    dot.removeAttribute('aria-current');
                }
            });
        };

        // Event Listeners for buttons
        prevBtn.addEventListener('click', () => {
            const cardWidthWithGap = projectCards[0].offsetWidth + parseFloat(getComputedStyle(portfolioGrid).gap);
            const visibleItems = getVisibleItems();
            portfolioGrid.scrollBy({
                left: -(cardWidthWithGap * visibleItems),
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            const cardWidthWithGap = projectCards[0].offsetWidth + parseFloat(getComputedStyle(portfolioGrid).gap);
            const visibleItems = getVisibleItems();
            portfolioGrid.scrollBy({
                left: (cardWidthWithGap * visibleItems),
                behavior: 'smooth'
            });
        });

        // Keyboard navigation for carousel
        portfolioGrid.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
            }
        });

        // Update buttons and dots on scroll
        portfolioGrid.addEventListener('scroll', () => {
            updateButtonVisibility();
            updateActiveDot();
        });

        // Initial setup for carousel
        createDots();
        updateButtonVisibility();
        updateActiveDot();

        // Recalculate on window resize
        window.addEventListener('resize', () => {
            createDots(); // Recreate dots as visible items might change
            updateButtonVisibility();
            updateActiveDot();
        });
    } else {
        console.warn("Carousel elements not found or no project cards. Carousel functionality disabled.");
    }


    // --- Project Modal Functionality ---
    if (projectModal && closeProjectModalBtn && viewProjectButtons.length > 0) {
        viewProjectButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default link behavior
                projectModal.style.display = 'flex'; // Show the modal (using flex for centering)
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
                projectModal.focus(); // Focus the modal for accessibility
                // Set aria-hidden for background content
                document.getElementById('header')?.setAttribute('aria-hidden', 'true'); // Use optional chaining for robustness
                document.getElementById('hero')?.setAttribute('aria-hidden', 'true');
                document.getElementById('about')?.setAttribute('aria-hidden', 'true');
                document.getElementById('brands')?.setAttribute('aria-hidden', 'true'); // Corrected ID to 'brands'
                document.getElementById('portfolio')?.setAttribute('aria-hidden', 'true');
                document.getElementById('contact')?.setAttribute('aria-hidden', 'true');
                document.querySelector('footer')?.setAttribute('aria-hidden', 'true');
            });
        });

        const closeModal = () => {
            projectModal.style.display = 'none'; // Hide the modal
            document.body.style.overflow = ''; // Restore background scrolling
            // Restore aria-hidden for background content
            document.getElementById('header')?.removeAttribute('aria-hidden');
            document.getElementById('hero')?.removeAttribute('aria-hidden');
            document.getElementById('about')?.removeAttribute('aria-hidden');
            document.getElementById('brands')?.removeAttribute('aria-hidden'); // Corrected ID to 'brands'
            document.getElementById('portfolio')?.removeAttribute('aria-hidden');
            document.getElementById('contact')?.removeAttribute('aria-hidden');
            document.querySelector('footer')?.removeAttribute('aria-hidden');
        };

        closeProjectModalBtn.addEventListener('click', closeModal);

        // Close modal if user clicks outside of the modal-content
        projectModal.addEventListener('click', (event) => {
            if (event.target === projectModal) {
                closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && projectModal.style.display === 'flex') {
                closeModal();
            }
        });
    } else {
        console.warn("Project modal elements not found or no active project buttons. Modal functionality disabled.");
    }

    // --- Scroll-based Animations (Intersection Observer) ---
    const sections = document.querySelectorAll('section, footer'); // Include footer for animation

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the section is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ensure header isn't animated if it's meant to be sticky and always visible
                if (entry.target.id !== 'header') { // Check if it's not the header
                    entry.target.classList.add('fade-in-up');
                }
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target);
            } else {
                // Optional: Remove class if scrolling away, to re-trigger on scroll back
                // entry.target.classList.remove('fade-in-up');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        // Exclude header from initial animation class and observation if desired, as it's sticky
        if (section.id !== 'header') {
            section.classList.add('animate-on-scroll'); // Add base class for animation
            sectionObserver.observe(section);
        }
    });
});