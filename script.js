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
    const desktopNavLinks = document.querySelectorAll('.desktop-nav a'); // Get desktop nav links
    const projectModal = document.getElementById('projectModal'); // Get modal element

    // Helper function to close all overlays and restore scroll
    const closeAllOverlaysAndRestoreScroll = () => {
        mobileNavOverlay.classList.remove('active');
        projectModal.classList.remove('active');
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        if (menuToggle) { // Ensure menuToggle exists before setting attribute
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    };

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

        let currentIndex = 0;
        let visibleItems = getVisibleItems(); // Initialize on load

        const updateCarousel = () => {
            const cardWidth = projectCards[0].offsetWidth;
            const gridStyle = getComputedStyle(portfolioGrid);
            const cardGap = parseFloat(gridStyle.gap) || 0;

            const offset = -(currentIndex * (cardWidth + cardGap));
            portfolioGrid.style.transform = `translateX(${offset}px)`;
            updateDots();
            updateButtonStates();
        };

        const updateDots = () => {
            carouselDotsContainer.innerHTML = '';
            const totalDots = Math.ceil(projectCards.length / visibleItems);
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === Math.floor(currentIndex / visibleItems)) {
                    dot.classList.add('active');
                }
                dot.addEventListener('click', () => {
                    currentIndex = i * visibleItems;
                    updateCarousel();
                });
                carouselDotsContainer.appendChild(dot);
            }
        };

        const updateButtonStates = () => {
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= projectCards.length - visibleItems;
        };

        prevBtn.addEventListener('click', () => {
            currentIndex = Math.max(0, currentIndex - visibleItems);
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = Math.min(projectCards.length - visibleItems, currentIndex + visibleItems);
            updateCarousel();
        });

        // Recalculate visible items and update carousel on window resize
        window.addEventListener('resize', () => {
            visibleItems = getVisibleItems();
            currentIndex = 0; // Reset to start on resize for simplicity
            updateCarousel();
        });

        // Initial setup
        updateCarousel();
    } else {
        console.warn("Carousel elements not found or no project cards. Carousel functionality disabled.");
    }

    // --- Mobile Navigation Functionality ---
    if (menuToggle && mobileNavOverlay && closeMenuBtn) {
        menuToggle.addEventListener('click', () => {
            mobileNavOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling background
            menuToggle.setAttribute('aria-expanded', 'true');
        });

        closeMenuBtn.addEventListener('click', () => {
            closeAllOverlaysAndRestoreScroll();
        });

        // Close mobile menu when a link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeAllOverlaysAndRestoreScroll();
            });
        });
    } else {
        console.warn("Mobile navigation elements not found. Mobile menu functionality disabled.");
    }

    // --- Desktop Navigation Functionality (to close modal/restore scroll if needed) ---
    desktopNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeAllOverlaysAndRestoreScroll();
        });
    });

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


    // --- Project Data (Centralized for easy management) ---
    const projectsData = {
        'xfinity-device-lights': {
            title: 'Xfinity Device Lights: Clarifying Status for Users',
            role: 'Experience and Conversational Designer, Developer',
            tags: ['Conversational AI', 'User Flow', 'Problem Solving', 'UX Writing'],
            description: `
                <p>The goal of this project was to reduce customer confusion and support calls related to Xfinity device status lights. Users often struggled to interpret the various colors and blinking patterns, leading to frustration and unnecessary service interactions. My role involved designing a clear, accessible conversational experience that would empower users to quickly diagnose and understand their device's behavior.</p>

                <h3>Problem Statement</h3>
                <p>Customers frequently contact support because they don't understand what the lights on their Xfinity modem or set-top box mean. This leads to long support calls, increased operational costs, and a poor customer experience.</p>

                <h3>My Role & Responsibilities</h3>
                <ul>
                    <li><strong>Experience Designer:</strong> Led the user experience design from discovery to implementation.</li>
                    <li><strong>Conversational Designer:</strong> Crafted intuitive and natural dialogue flows for the AI agent.</li>
                    <li><strong>Developer:</strong> Implemented portions of the conversational logic and tested integrations.</li>
                    <li><strong>User Flow Mapping:</strong> Created detailed user flow diagrams to visualize interaction paths.</li>
                    <li><strong>Content Strategy:</strong> Developed clear and concise UX writing for all conversational prompts and responses.</li>
                </ul>

                <h3>Process</h3>
                <h4>User Research & Discovery</h4>
                <p>Initial research involved analyzing support call transcripts, common customer queries, and existing documentation. We identified key pain points and frequently misunderstood light patterns. Surveys and interviews with support agents provided valuable insights into user behavior and common misconceptions.</p>
                <img src="project-assets/light-research.jpg" alt="Research insights on device light confusion" class="project-image-full">

                <h4>Wireframing & Prototyping</h4>
                <p>Based on research, I developed wireframes for various conversational paths, mapping out how the AI agent would guide users through troubleshooting or information retrieval. Prototypes were created using tools like Figma to simulate the conversational experience.</p>
                <div class="image-gallery">
                    <img src="project-assets/light-wireframe-1.jpg" alt="Wireframe of conversational flow step 1">
                    <img src="project-assets/light-wireframe-2.jpg" alt="Wireframe of conversational flow step 2">
                    <img src="project-assets/light-wireframe-3.jpg" alt="Wireframe of conversational flow step 3">
                </div>
                <p>Each wireframe focused on clarity, conciseness, and error handling, ensuring a robust and user-friendly interaction.</p>

                <h4>Conversational Flow Design</h4>
                <p>I designed the conversational logic, including intents, entities, and responses. Special attention was paid to anticipating user queries, handling ambiguity, and providing clear, actionable information. The flow was designed to be empathetic and guide the user efficiently to a solution or clarification.</p>
                <img src="project-assets/light-flow-diagram.jpg" alt="Detailed conversational flow diagram" class="project-image-full">

                <h4>Usability Testing & Iteration</h4>
                <p>Early prototypes underwent iterative usability testing with target users. Feedback was crucial in refining the conversational prompts, response clarity, and overall user experience. For example, initial testing revealed that users needed more options to describe their light color, leading to the incorporation of more granular color descriptions (e.g., "slow blinking green" vs. "fast blinking orange").</p>
                <img src="project-assets/light-testing-feedback.jpg" alt="Usability testing feedback and insights" class="project-image-full">

                <h3>Solution & Impact</h3>
                <p>The implemented conversational agent successfully guided users through device light identification, providing immediate answers and reducing the need for direct support. This led to a significant decrease in light-related support calls and improved customer satisfaction. The solution also included a feedback mechanism for continuous improvement.</p>
                <img src="project-assets/light-final-ui.jpg" alt="Screenshot of the final conversational UI" class="project-image-full">

                <h3>Learnings & Future Considerations</h3>
                <p>This project reinforced the importance of clear, concise language in conversational AI, and the power of iterative testing. Future iterations could explore integrating visual aids directly into the conversational interface, or leveraging AI to predict user intent based on context.</p>
            `,
            visuals: [] // Can be an array of image paths for a simple gallery or more complex HTML snippets
        },
        'xfinity-weather-alerts': {
            title: 'Xfinity Inclement Weather Alerts: Proactive Customer Messaging',
            role: 'Lead Message Experience Designer & Internal Trial Lead',
            tags: ['UX Design', 'Messaging', 'IoT', 'User Trial', 'Service Design'],
            description: `
                <p>This project focused on enhancing the Xfinity customer experience by proactively alerting users to inclement weather conditions when a smart window or door was left open. My leadership in designing this new messaging experience and establishing an internal employee trial was crucial in validating the concept's user acceptance.</p>

                <h3>Problem Statement</h3>
                <p>Customers with smart home devices were not receiving timely and relevant alerts about potential issues like open windows during adverse weather, leading to property damage or discomfort. A proactive messaging system was needed to address this gap.</p>

                <h3>My Role & Responsibilities</h3>
                <ul>
                    <li><strong>Lead Message Experience Designer:</strong> Drove the end-to-end design of the messaging content, timing, and user interaction.</li>
                    <li><strong>Internal Trial Lead:</strong> Orchestrated and managed an internal employee trial to gather qualitative and quantitative feedback on the new alert system.</li>
                    <li><strong>User Journey Mapping:</strong> Mapped out various scenarios and user paths for different weather events and device states.</li>
                    <li><strong>Cross-functional Collaboration:</strong> Worked closely with engineering, product, and marketing teams to ensure successful implementation and launch.</li>
                </ul>

                <h3>Process</h3>
                <h4>Defining User Scenarios</h4>
                <p>We began by defining various inclement weather scenarios (e.g., heavy rain, high winds, extreme temperatures) and how they interacted with open windows/doors. This helped us understand the urgency and tone required for each message.</p>

                <h4>Designing Message Content & Tone</h4>
                <p>I crafted concise, clear, and actionable message content. The tone was empathetic and informative, guiding users on what action to take (e.g., "Your living room window is open with heavy rain starting. Close it to prevent water damage.").</p>

                <h4>Internal Trial Design & Execution</h4>
                <p>A key part of the process was designing and executing an internal employee trial. This involved recruiting participants, setting up their devices, and collecting structured feedback on message clarity, timeliness, and overall usefulness. The trial provided invaluable early validation and identified areas for refinement.</p>
                <img src="project-assets/weather-trial-setup.jpg" alt="Internal trial setup for weather alerts" class="project-image-full">
                <div class="image-gallery">
                    <img src="project-assets/weather-alert-mockup-1.jpg" alt="UI mockup of a weather alert on mobile">
                    <img src="project-assets/weather-alert-mockup-2.jpg" alt="Another UI mockup of a weather alert">
                </div>

                <h3>Solution & Impact</h3>
                <p>The proactive inclement weather alert system significantly improved customer awareness and satisfaction. Early trial results indicated high user acceptance and a clear understanding of the alerts, demonstrating the value of proactive communication in smart home environments. This feature enhanced the overall perceived reliability and intelligence of Xfinity's smart home offerings.</p>
                <img src="project-assets/weather-solution-final.jpg" alt="Final UI of weather alert message" class="project-image-full">

                <h3>Learnings & Future Considerations</h3>
                <p>The trial demonstrated the power of early user involvement and iterative feedback. It highlighted the importance of clear, unambiguous language in time-sensitive alerts. Future considerations include integrating these alerts with smart home routines (e.g., auto-close windows if certain conditions are met) or offering customizable alert preferences.</p>
            `,
            visuals: []
        },
        'single-home-network': {
            title: 'Single-Home Network Impairment Experience: Proactive Diagnostics',
            role: 'UX Designer - Creation, Testing & Scaling',
            tags: ['Network Monitoring', 'Customer Experience', 'Telemetry', 'UX Design', 'Service Design', 'Scalable Solutions'],
            description: `
                <p>This project involved assisting in the creation, rigorous testing, and successful scaling of the first single-home network impairment experience. This critical messaging system leverages customer telemetry data to proactively identify individuals needing technician appointments to resolve signal issues impacting their internet gateway connection.</p>

                <h3>Problem Statement</h3>
                <p>Many customers experience intermittent internet issues without understanding the root cause, leading to frustrating troubleshooting attempts and reactive support calls. A system was needed to proactively identify and inform customers about network impairments affecting their home gateway.</p>

                <h3>My Role & Responsibilities</h3>
                <ul>
                    <li><strong>UX Designer:</strong> Contributed to the design of the proactive messaging and customer journey.</li>
                    <li><strong>Testing Facilitator:</strong> Assisted in setting up and conducting rigorous testing of the system's accuracy and user comprehension.</li>
                    <li><strong>Scaling Support:</strong> Collaborated on processes to scale the solution for a broader customer base.</li>
                    <li><strong>Data Interpretation:</strong> Helped translate complex telemetry data into actionable user insights and clear customer communications.</li>
                </ul>

                <h3>Process</h3>
                <h4>Telemetry Data Analysis & User Needs</h4>
                <p>We worked with data scientists and engineers to understand the specific telemetry signals indicating network impairments. This technical understanding was then translated into user-centric language and alerts.</p>

                <h4>Designing Proactive Communication</h4>
                <p>I helped design the proactive messages that would inform customers about detected signal issues and guide them towards scheduling a technician appointment. Emphasis was placed on clarity, empathy, and avoiding jargon.</p>
                <img src="project-assets/network-telemetry-example.jpg" alt="Example of network telemetry data visualization" class="project-image-full">

                <h4>Rigorous Testing Phases</h4>
                <p>The system underwent multiple phases of testing, including A/B testing of different message variations and user comprehension tests. We ensured that the messages were understood and that users felt informed, not alarmed, by the proactive outreach.</p>
                <div class="image-gallery">
                    <img src="project-assets/network-message-variant-a.jpg" alt="Mockup of network impairment message variant A">
                    <img src="project-assets/network-message-variant-b.jpg" alt="Mockup of network impairment message variant B">
                </div>

                <h3>Solution & Impact</h3>
                <p>The single-home network impairment experience successfully reduced reactive support calls and improved customer satisfaction by addressing issues before they became critical. By proactively offering technician appointments, Xfinity was able to provide a higher level of service and demonstrate a commitment to network reliability. The solution's scalability allowed it to benefit a large segment of the customer base.</p>
                <img src="project-assets/network-solution-final.jpg" alt="Screenshot of final network impairment message" class="project-image-full">

                <h3>Learnings & Future Considerations</h3>
                <p>This project underscored the value of combining technical data with user-centered design to create impactful proactive experiences. It also highlighted the importance of clear call-to-actions in service-oriented communications. Future considerations include predictive maintenance insights and offering self-troubleshooting steps before suggesting a technician visit.</p>
            `,
            visuals: []
        },
        'project-four': {
            title: '[Project Title 4]',
            role: '[Your Role for Project 4]',
            tags: ['#ProjectTag7', '#ProjectTag8'],
            description: `
                <p>[Detailed description for Project 4 goes here. Talk about the problem, your process, your role, the solution, and the impact.]</p>
                <h4>Relevant Visuals</h4>
                <div class="image-gallery">
                    <img src="project-assets/placeholder-4a.jpg" alt="Project 4 Visual A">
                    <img src="project-assets/placeholder-4b.jpg" alt="Project 4 Visual B">
                </div>
            `,
            visuals: []
        },
        'project-five': {
            title: '[Project Title 5]',
            role: '[Your Role for Project 5]',
            tags: ['#ProjectTag9', '#ProjectTag10'],
            description: `
                <p>[Detailed description for Project 5 goes here. Remember to include sections like: Problem, My Role, Process, Solution, Impact, and Learnings.]</p>
                <h4>User Journey Map Example</h4>
                <img src="project-assets/placeholder-5a.jpg" alt="User Journey Map for Project 5" class="project-image-full">
            `,
            visuals: []
        }
    };

    // --- Modal Functionality ---
    const projectModal = document.getElementById('projectModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalProjectTitle = document.getElementById('modalProjectTitle');
    const modalProjectRole = document.getElementById('modalProjectRole');
    const modalProjectTags = document.getElementById('modalProjectTags');
    const modalProjectDescription = document.getElementById('modalProjectDescription');
    const modalProjectVisuals = document.getElementById('modalProjectVisuals');
    const viewProjectButtons = document.querySelectorAll('.view-project-btn');

    // Open Modal
    viewProjectButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const projectId = event.target.closest('.project-card').dataset.projectId;
            const project = projectsData[projectId];

            if (project) {
                // Populate modal with content
                modalProjectTitle.textContent = project.title;
                modalProjectRole.textContent = `Role: ${project.role}`;

                // Clear existing tags and add new ones
                modalProjectTags.innerHTML = '';
                project.tags.forEach(tag => {
                    const span = document.createElement('span');
                    span.textContent = `#${tag}`;
                    modalProjectTags.appendChild(span);
                });

                modalProjectDescription.innerHTML = project.description;
                // For now, visuals are part of the description HTML. If you have a separate array, you'd process it here.
                // Example if you have a separate `project.visuals` array with image paths:
                // modalProjectVisuals.innerHTML = ''; // Clear previous visuals
                // project.visuals.forEach(visual => {
                //     const img = document.createElement('img');
                //     img.src = visual.src;
                //     img.alt = visual.alt;
                //     img.classList.add('project-image-full'); // Or add to a gallery div
                //     modalProjectVisuals.appendChild(img);
                // });


                // Show modal
                projectModal.classList.add('active');
                document.body.classList.add('modal-open'); // Prevent background scroll
                document.body.style.overflow = 'hidden'; // Ensure scrollbar is hidden
            }
        });
    });

    // Close Modal
    closeModalBtn.addEventListener('click', () => {
        closeAllOverlaysAndRestoreScroll();
    });

    // Close modal when clicking outside of modal content
    window.addEventListener('click', (event) => {
        if (event.target === projectModal) {
            closeAllOverlaysAndRestoreScroll();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && projectModal.classList.contains('active')) {
            closeAllOverlaysAndRestoreScroll();
        }
    });
});