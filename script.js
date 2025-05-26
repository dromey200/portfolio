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

    // --- Carousel Functionality ---
    if (portfolioGrid && prevBtn && nextBtn && carouselDotsContainer && projectCards.length > 0) {
        // Function to calculate how many items are visible
        const getVisibleItems = () => {
            const gridWidth = portfolioGrid.offsetWidth;
            const cardStyle = getComputedStyle(projectCards[0]);
            const cardWidth = projectCards[0].offsetWidth; // Includes padding but not margin/gap
            // Safely get the gap from the parent grid's computed style
            const gridStyle = getComputedStyle(portfolioGrid);
            const cardGap = parseFloat(gridStyle.gap) || 0; // Get actual gap

            // Calculate how many cards fit plus their gaps
            // This is more robust as it uses the actual computed gap
            return Math.floor((gridWidth + cardGap) / (cardWidth + cardGap));
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

            for (let i = 0; i < numDots; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                dot.setAttribute('role', 'button');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.tabIndex = 0; // Make dots focusable
                dot.addEventListener('click', () => {
                    const scrollAmount = (projectCards[0].offsetWidth + parseFloat(getComputedStyle(portfolioGrid).gap)) * visibleItems * i;
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
            const dots = document.querySelectorAll('.carousel-dots .dot');
            if (dots.length === 0) return;

            const scrollPosition = portfolioGrid.scrollLeft;
            const cardWidthWithGap = projectCards[0].offsetWidth + parseFloat(getComputedStyle(portfolioGrid).gap);
            const visibleItems = getVisibleItems();

            // Calculate the current "page" based on scroll position
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

    // --- Mobile Navigation Functionality ---
    if (menuToggle && mobileNavOverlay && closeMenuBtn && mobileNavLinks) {
        menuToggle.addEventListener('click', () => {
            mobileNavOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling background
            menuToggle.setAttribute('aria-expanded', 'true');
        });

        closeMenuBtn.addEventListener('click', () => {
            mobileNavOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            menuToggle.setAttribute('aria-expanded', 'false');
        });

        // Close menu when a link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavOverlay.classList.remove('active');
                document.body.style.overflow = '';
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    } else {
        console.warn("Mobile navigation elements not found. Mobile menu functionality disabled.");
    }

    // --- Scroll-based Animations (Intersection Observer) ---
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the section is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target);
            } else {
                // Optional: Remove class if scrolling away, to re-trigger on scroll back
                // entry.target.classList.remove('fade-in-up');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.classList.add('animate-on-scroll'); // Add base class for animation
        sectionObserver.observe(section);
    });
});