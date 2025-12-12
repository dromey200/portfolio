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
    const viewProjectButtons = document.querySelectorAll('.project-card .view-project-btn');

    // Elements to populate inside the modal
    const modalProjectTitle = document.getElementById('modal-project-title');
    const modalProjectRole = document.getElementById('modal-project-role');
    const modalProjectImage = document.getElementById('modal-project-image');
    const modalProjectDescription = document.getElementById('modal-project-description');
    const modalProjectTags = document.getElementById('modal-project-tags');

    // --- Project Data ---
    const projects = {
        'fairway-concierge': {
            title: 'Concept: Fairway – The AI Golf Concierge',
            role: 'Lead Product Designer & Conversational Strategist',
            image: 'fairway-image.jpg',
            // Note: Changed filename to lowercase 'fairway-logic-flow.pdf' to match best practices
            description: 'Designed a multi-modal AI agent for a local golf course to automate tee-time bookings and real-time course status updates. The solution aimed to reduce pro-shop call volume by 40% while improving golfer satisfaction.\n\nKey features included smart booking via natural language, real-time course reliability updates (frost delays, cart rules), and an "At the Turn" food ordering flow.\n\nDisclaimer: This is a proactive design concept developed to explore AI-driven automation for local service businesses.\n\n👉 <a href="fairway-logic-flow.pdf" target="_blank" style="color: #6a89cc; font-weight: bold;">View the Conversation Logic Map (PDF)</a>',
            tags: ['Conversational AI', 'Concept', 'UX Strategy', 'Service Design', 'Prototyping'],
        },
        'device-lights': {
            title: 'Xfinity Device Lights',
            role: 'Experience and Conversational Designer, Developer',
            image: 'device lights.jpg',
            description: 'Designed an intuitive conversational flow to clarify the meaning of Xfinity device light colors and sequences for customers. This involved extensive user research to understand common pain points and developing clear, concise language for the conversational AI. The solution significantly reduced calls to customer support related to device status.',
            tags: ['Conversational AI', 'User Flow', 'Problem Solving', 'Customer Support', 'AI Agent Design'],
        },
        'weather-alerts': {
            title: 'Xfinity Inclement Weather Alerts',
            role: 'Lead Message Experience Designer & Internal Trial Lead',
            image: 'WIMFW.jpg',
            description: 'Led the design of a new messaging experience for Xfinity customers, alerting them to inclement weather when a smart window or door was open. Played a vital role in establishing and executing an internal employee trial to gather crucial feedback, validating that the concept was well-received by users. This project enhanced smart home functionality and proactive customer communication.',
            tags: ['UX Design', 'Messaging', 'IoT', 'User Trial', 'Service Design', 'Proactive Communication'],
        },
        'network-impairment': {
            title: 'Single-Home Network Impairment Experience',
            role: 'UX Designer - Creation, Testing & Scaling',
            image: 'single home.jpg',
            description: 'Assisted in the creation, rigorous testing, and successful scaling of the first single-home network impairment experience. This critical messaging system leverages customer telemetry data to proactively identify individuals needing technician appointments to resolve signal issues impacting their internet gateway connection. This proactive approach significantly improved customer satisfaction and reduced repeat service calls.',
            tags: ['Network Monitoring', 'Customer Experience', 'Telemetry', 'UX Design', 'Service Design', 'Scalable Solutions', 'Data-Driven Design'],
        },
        'xfinity-on-campus': {
            title: 'Xfinity On Campus',
            role: 'UX Designer, Conversational Designer',
            image: 'XOC.jpg',
            description: 'Designed a comprehensive digital solution for students, faculty, and IT to troubleshoot services and find account answers, guiding users to self-service or an agent chat. This platform streamlined support processes for university environments, offering quick access to solutions and reducing the burden on IT staff.',
            tags: ['UX Design', 'Conversational AI', 'Troubleshooting', 'Self-Service', 'Customer Support', 'Higher Education'],
        }
    };


    // --- Dynamic Copyright Year ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }


    // --- Mobile Navigation Functionality ---
    if (menuToggle && mobileNavOverlay && closeMenuBtn && mobileNavLinks.length > 0) {
        menuToggle.addEventListener('click', () => {
            mobileNavOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; 
            menuToggle.setAttribute('aria-expanded', 'true');
        });

        closeMenuBtn.addEventListener('click', () => {
            mobileNavOverlay.classList.remove('active');
            document.body.style.overflow = ''; 
            menuToggle.setAttribute('aria-expanded', 'false');
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                mobileNavOverlay.classList.remove('active');
                document.body.style.overflow = '';
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    } else {
        console.warn("Mobile navigation elements not found. Mobile navigation disabled.");
    }


    // --- Carousel Functionality ---
    if (portfolioGrid && prevBtn && nextBtn && carouselDotsContainer && projectCards.length > 0) {
        const getVisibleItems = () => {
            const gridWidth = portfolioGrid.offsetWidth;
            const cardWidth = projectCards[0].offsetWidth;
            const gap = parseFloat(getComputedStyle(portfolioGrid).gap) || 0;

            if (cardWidth === 0) return 1;
            let items = Math.floor(gridWidth / (cardWidth + gap));
            return Math.max(1, items);
        };

        const updateButtonVisibility = () => {
            prevBtn.disabled = portfolioGrid.scrollLeft <= 0;
            const maxScrollLeft = portfolioGrid.scrollWidth - portfolioGrid.offsetWidth;
            nextBtn.disabled = portfolioGrid.scrollLeft >= maxScrollLeft - 1;
        };

        const createDots = () => {
            carouselDotsContainer.innerHTML = '';
            const totalCards = projectCards.length;
            const visibleItems = getVisibleItems();
            const numDots = Math.ceil(totalCards / visibleItems);

            if (numDots <= 1) {
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
                dot.tabIndex = 0;
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

        const updateActiveDot = () => {
            const dots = carouselDotsContainer.querySelectorAll('.dot');
            if (dots.length === 0) return;

            const scrollPosition = portfolioGrid.scrollLeft;
            const cardWidthWithGap = projectCards[0].offsetWidth + parseFloat(getComputedStyle(portfolioGrid).gap);
            const visibleItems = getVisibleItems();
            const currentPage = Math.round(scrollPosition / (cardWidthWithGap * visibleItems) + 0.01);

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

        portfolioGrid.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
            }
        });

        portfolioGrid.addEventListener('scroll', () => {
            updateButtonVisibility();
            updateActiveDot();
        });

        // Initialize carousel on load
        createDots();
        updateButtonVisibility();
        updateActiveDot();

        window.addEventListener('resize', () => {
            createDots();
            updateButtonVisibility();
            updateActiveDot();
        });
    } else {
        console.warn("Carousel elements not found.");
    }


    // --- Project Modal Functionality ---
    if (projectModal && closeProjectModalBtn && viewProjectButtons.length > 0) {
        viewProjectButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const projectId = button.dataset.projectId; 
                const project = projects[projectId]; 

                if (project) {
                    modalProjectTitle.textContent = project.title;
                    modalProjectRole.textContent = `Role: ${project.role}`;
                    modalProjectImage.src = project.image;
                    modalProjectImage.alt = project.title;
                    
                    // FIXED: Use innerHTML to allow links, and replace \n with <br> for spacing
                    modalProjectDescription.innerHTML = project.description.replace(/\n/g, '<br>'); 

                    modalProjectTags.innerHTML = '';
                    project.tags.forEach(tagText => {
                        const span = document.createElement('span');
                        span.textContent = `#${tagText}`;
                        modalProjectTags.appendChild(span);
                    });

                    projectModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden'; 
                    projectModal.focus(); 
                    
                    // Accessibility
                    document.getElementById('header')?.setAttribute('aria-hidden', 'true');
                    document.getElementById('hero')?.setAttribute('aria-hidden', 'true');
                    document.getElementById('about')?.setAttribute('aria-hidden', 'true');
                    document.getElementById('career')?.setAttribute('aria-hidden', 'true');
                    document.getElementById('portfolio')?.setAttribute('aria-hidden', 'true');
                    document.getElementById('services')?.setAttribute('aria-hidden', 'true');
                    document.getElementById('contact')?.setAttribute('aria-hidden', 'true');
                    document.querySelector('footer')?.setAttribute('aria-hidden', 'true');
                } else {
                    console.error('Project data not found for ID:', projectId);
                }
            });
        });

        const closeModal = () => {
            projectModal.style.display = 'none';
            document.body.style.overflow = ''; 
            document.getElementById('header')?.removeAttribute('aria-hidden');
            document.getElementById('hero')?.removeAttribute('aria-hidden');
            document.getElementById('about')?.removeAttribute('aria-hidden');
            document.getElementById('career')?.removeAttribute('aria-hidden');
            document.getElementById('portfolio')?.removeAttribute('aria-hidden');
            document.getElementById('services')?.removeAttribute('aria-hidden');
            document.getElementById('contact')?.removeAttribute('aria-hidden');
            document.querySelector('footer')?.removeAttribute('aria-hidden');
        };

        closeProjectModalBtn.addEventListener('click', closeModal);

        projectModal.addEventListener('click', (event) => {
            if (event.target === projectModal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && projectModal.style.display === 'flex') {
                closeModal();
            }
        });
    }

    // --- Scroll-based Animations ---
    const sectionsToAnimate = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            } else {
                entry.target.classList.remove('fade-in-up');
            }
        });
    }, observerOptions);

    sectionsToAnimate.forEach(section => {
        sectionObserver.observe(section);
    });

    const heroSection = document.getElementById('hero');
    if (heroSection) {
        setTimeout(() => {
            heroSection.classList.add('fade-in-up');
        }, 100);
    }
});