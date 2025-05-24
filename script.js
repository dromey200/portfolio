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

    // --- Carousel Functionality ---
    if (portfolioGrid && prevBtn && nextBtn && carouselDotsContainer && projectCards.length > 0) {
        // Function to calculate how many items are visible
        const getVisibleItems = () => {
            const gridWidth = portfolioGrid.offsetWidth;
            const cardStyle = getComputedStyle(projectCards[0]);
            const cardWidth = projectCards[0].offsetWidth; // Includes padding but not margin/gap
            const cardMarginRight = parseFloat(cardStyle.marginRight); // Check for margin-right
            const cardGap = parseFloat(cardStyle.gap) || 30; // Use actual gap if defined, otherwise default 30px
            
            // For flexbox gap, it's often more reliable to just use the card's outer width including its own margin/gap contribution
            // For this setup, where gap is on the parent, cardWidth + gap is correct.
            return Math.floor((gridWidth + cardGap) / (cardWidth + cardGap));
        };

        // Function to update button visibility
        const updateButtonVisibility = () => {
            prevBtn.disabled = portfolioGrid.scrollLeft <= 0;
            // Check if scrollable content end is reached
            const maxScrollLeft = portfolioGrid.scrollWidth - portfolioGrid.offsetWidth;
            nextBtn.disabled = portfolioGrid.scrollLeft >= maxScrollLeft - 1; // -1 for tolerance
        };

        // Function to create/update dots
        const createDots = () => {
            carouselDotsContainer.innerHTML = ''; // Clear existing dots
            const totalCards = projectCards.length;
            const visibleItems = getVisibleItems();
            
            // Calculate number of "pages"
            const numDots = Math.ceil(totalCards / visibleItems);

            for (let i = 0; i < numDots; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                dot.dataset.index = i;
                dot.addEventListener('click', () => {
                    const cardWidth = projectCards[0].offsetWidth;
                    const cardStyle = getComputedStyle(projectCards[0]);
                    const cardGap = parseFloat(getComputedStyle(portfolioGrid).gap) || 30; // Get gap from parent grid
                    
                    // Calculate scroll position based on "pages"
                    portfolioGrid.scrollLeft = i * (cardWidth + cardGap) * visibleItems;
                });
                carouselDotsContainer.appendChild(dot);
            }
            updateActiveDot();
        };

        // Function to update active dot
        const updateActiveDot = () => {
            const dots = document.querySelectorAll('.dot');
            if (projectCards.length === 0 || dots.length === 0) return;

            const scrollPosition = portfolioGrid.scrollLeft;
            const cardWidth = projectCards[0].offsetWidth;
            const cardGap = parseFloat(getComputedStyle(portfolioGrid).gap) || 30;
            const visibleItems = getVisibleItems();

            // Calculate current "page" based on scroll position
            const currentPage = Math.round(scrollPosition / ((cardWidth + cardGap) * visibleItems));

            dots.forEach((dot, index) => {
                if (index === currentPage) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };

        // Event Listeners for carousel buttons
        prevBtn.addEventListener('click', () => {
            const cardWidth = projectCards[0].offsetWidth;
            const cardGap = parseFloat(getComputedStyle(portfolioGrid).gap) || 30;
            const visibleItems = getVisibleItems();
            portfolioGrid.scrollBy({
                left: -((cardWidth + cardGap) * visibleItems),
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            const cardWidth = projectCards[0].offsetWidth;
            const cardGap = parseFloat(getComputedStyle(portfolioGrid).gap) || 30;
            const visibleItems = getVisibleItems();
            portfolioGrid.scrollBy({
                left: ((cardWidth + cardGap) * visibleItems),
                behavior: 'smooth'
            });
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

    // --- Mobile Navigation Functionality ---
    if (menuToggle && mobileNavOverlay && closeMenuBtn && mobileNavLinks) {
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
    } else {
        console.warn("Mobile navigation elements not found. Mobile menu functionality disabled.");
    }
});