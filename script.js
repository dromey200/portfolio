document.addEventListener('DOMContentLoaded', () => {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const carouselDotsContainer = document.querySelector('.carousel-dots');
    const projectCards = document.querySelectorAll('.project-card');

    if (!portfolioGrid || !prevBtn || !nextBtn || !carouselDotsContainer || projectCards.length === 0) {
        console.error("Missing elements for carousel functionality.");
        return;
    }

    // Function to calculate how many items are visible
    const getVisibleItems = () => {
        const gridWidth = portfolioGrid.offsetWidth;
        const cardWidth = projectCards[0].offsetWidth + 30; // Card width + gap
        return Math.floor(gridWidth / cardWidth);
    };

    // Function to update button visibility
    const updateButtonVisibility = () => {
        prevBtn.disabled = portfolioGrid.scrollLeft === 0;
        nextBtn.disabled = portfolioGrid.scrollLeft + portfolioGrid.offsetWidth >= portfolioGrid.scrollWidth - 1; // -1 for tolerance
    };

    // Function to create/update dots
    const createDots = () => {
        carouselDotsContainer.innerHTML = ''; // Clear existing dots
        const totalCards = projectCards.length;
        const visibleItems = getVisibleItems();
        const numDots = Math.ceil(totalCards / visibleItems); // One dot per 'page' of visible items

        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.index = i;
            dot.addEventListener('click', () => {
                portfolioGrid.scrollLeft = i * (projectCards[0].offsetWidth + 30) * visibleItems;
            });
            carouselDotsContainer.appendChild(dot);
        }
        updateActiveDot();
    };

    // Function to update active dot
    const updateActiveDot = () => {
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

    // Event Listeners for buttons
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

    // Update buttons and dots on scroll
    portfolioGrid.addEventListener('scroll', () => {
        updateButtonVisibility();
        updateActiveDot();
    });

    // Initial setup
    createDots();
    updateButtonVisibility();
    updateActiveDot();

    // Recalculate on window resize
    window.addEventListener('resize', () => {
        createDots(); // Recreate dots as visible items might change
        updateButtonVisibility();
        updateActiveDot();
    });
});