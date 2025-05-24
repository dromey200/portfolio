document.addEventListener('DOMContentLoaded', () => {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const carouselDotsContainer = document.querySelector('.carousel-dots');
    const projectCards = document.querySelectorAll('.project-card');

    const menuToggle = document.querySelector('.menu-toggle'); // New
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay'); // New
    const closeMenuBtn = document.querySelector('.close-menu'); // New
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a'); // New

    if (!portfolioGrid || !prevBtn || !nextBtn || !carouselDotsContainer || projectCards.length === 0) {
        console.error("Missing elements for carousel functionality.");
        // Continue even if carousel elements are missing, so other parts of the site can work.
    }

    // Function to calculate how many items are visible
    const getVisibleItems = () => {
        if (projectCards.length === 0) return 1; // Prevent error if no cards
        const gridWidth = portfolioGrid.offsetWidth;
        const cardWidth = projectCards[0].offsetWidth + 30; // Card width + gap
        return Math.floor(gridWidth / cardWidth);
    };

    // Function to update button visibility
    const updateButtonVisibility = () => {
        if (!portfolioGrid || !prevBtn || !nextBtn) return; // Safely exit if elements are missing
        prevBtn.disabled = portfolioGrid.scrollLeft === 0;
        nextBtn.disabled = portfolioGrid.scrollLeft + portfolioGrid.offsetWidth >= portfolioGrid.scrollWidth - 1; // -1 for tolerance
    };

    // Function to create/update dots
    const createDots = () => {
        if (!carouselDotsContainer || projectCards.length === 0) return; // Safely exit
        carouselDotsContainer.innerHTML = ''; // Clear existing dots
        const totalCards = projectCards.length;
        const visibleItems = getVisibleItems();
        const numDots = Math.ceil(totalCards / visibleItems); // One dot per 'page' of visible items

        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.index = i;
            dot.addEventListener('click', () => {
                if (projectCards.length > 0) { // Check before accessing projectCards[0]
                    portfolioGrid.scrollLeft = i * (projectCards[0].offsetWidth + 30) * visibleItems;
                }
            });
            carouselDotsContainer.appendChild(dot);
        }
        updateActiveDot();
    };

    // Function to update active dot
    const updateActiveDot = () => {
        if (projectCards.length === 0) return; // Safely exit
        const dots = document.querySelectorAll('.dot');
        const scrollPosition = portfolioGrid.scrollLeft;
        const cardWidthWithGap = projectCards[0].offsetWidth + 30;
        const visibleItems = getVisibleItems();

        // Calculate which 'page' or set of items is currently visible
        const currentPage = Math.round(scrollPosition / (cardWidthWithGap * visibleItems));

        dots.forEach((dot, index) => {
            if (index === currentPage) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    // Event Listeners for carousel buttons
    if (prevBtn && nextBtn) { // Only add listeners if buttons exist
        prevBtn.addEventListener('click', () => {
            const cardWidth = projectCards[0].offsetWidth + 30; // Card width + gap
            const visibleItems = getVisibleItems();
            portfolioGrid.scrollBy({
                left: -(cardWidth * visibleItems),
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            const cardWidth = projectCards[0].offsetWidth + 30; // Card width + gap
            const visibleItems = getVisibleItems();
            portfolioGrid.scrollBy({
                left: (cardWidth * visibleItems),
                behavior: 'smooth'
            });
        });
    }

    // Update buttons and dots on scroll
    if (portfolioGrid) { // Only add listener if grid exists
        portfolioGrid.addEventListener('scroll', () => {
            updateButtonVisibility();
            updateActiveDot();
        });
    }

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

    // --- Mobile Navigation Functionality ---
    if (menuToggle && mobileNavOverlay && closeMenuBtn) {
        menuToggle.addEventListener('click', () => {
            mobileNavOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling background
        });

        closeMenuBtn.addEventListener('click', () => {
            mobileNavOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });

        // Close menu when a link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
});