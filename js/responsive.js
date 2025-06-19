// Responsive JavaScript Enhancements

document.addEventListener('DOMContentLoaded', () => {
    // Lazy load images for better performance
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.srcset = img.dataset.srcset;
        });
    } else {
        // Use a lazy loading library if native lazy loading is not supported
        const lazyLoadScript = document.createElement('script');
        lazyLoadScript.src = 'https://cdn.jsdelivr.net/npm/lozad@1.16.0/dist/lozad.min.js';
        lazyLoadScript.onload = () => {
            const observer = lozad();
            observer.observe();
        };
        document.body.appendChild(lazyLoadScript);
    }

    // Adjust particle density based on screen size
    const adjustParticles = () => {
        const width = window.innerWidth;
        let particleCount;
        
        if (width <= 480) {
            particleCount = 30;  // Mobile
        } else if (width <= 768) {
            particleCount = 50;  // Tablet
        } else if (width <= 1200) {
            particleCount = 80;  // Desktop
        } else {
            particleCount = 100; // Large Desktop
        }
        
        // Only update if particles.js is loaded and configured
        if (typeof pJSDom !== 'undefined' && pJSDom.length > 0) {
            pJSDom[0].pJS.particles.number.value = particleCount;
            pJSDom[0].pJS.fn.particlesRefresh();
        }
    };

    // Disable animations/transitions on resize to improve performance
    let resizeTimer;
    window.addEventListener('resize', () => {
        document.body.classList.add('resize-animation-stopper');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove('resize-animation-stopper');
            adjustParticles();
        }, 400);
    });
    
    // Initialize particle adjustments
    adjustParticles();
    
    // Better touch support for hover effects
    const addTouchSupportForHover = () => {
        if ('ontouchstart' in document.documentElement) {
            document.body.classList.add('touch-device');
            
            // Add touch toggle functionality to elements with hover effects
            const hoverElements = document.querySelectorAll('.skill-card, .project-card, .interest-item, .social-link');
            
            hoverElements.forEach(element => {
                element.addEventListener('touchstart', function(e) {
                    // Prevent click if this is the first touch and element has hover effect
                    if (!this.classList.contains('touched')) {
                        e.preventDefault();
                        
                        // Remove 'touched' class from all elements
                        hoverElements.forEach(el => el.classList.remove('touched'));
                        
                        // Add touched class to current element
                        this.classList.add('touched');
                    }
                }, { passive: false });
            });
            
            // Remove touched class when touching elsewhere
            document.addEventListener('touchstart', (e) => {
                if (!e.target.closest('.skill-card, .project-card, .interest-item, .social-link')) {
                    hoverElements.forEach(el => el.classList.remove('touched'));
                }
            });
        }
    };
    
    addTouchSupportForHover();
    
    // Improve accessibility with focus states
    const improveAccessibility = () => {
        // Add focus styles that match hover styles for keyboard navigation
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            .nav-links a:focus, .btn:focus, .social-link:focus, .tab-button:focus {
                outline: 2px solid var(--primary-color);
                outline-offset: 3px;
            }
            .btn:focus:not(:focus-visible), .social-link:focus:not(:focus-visible) {
                outline: none;
            }
            .btn:focus-visible, .social-link:focus-visible, .tab-button:focus-visible {
                outline: 2px solid var(--primary-color);
                outline-offset: 3px;
            }
            /* Utility class to stop animations during window resizing */
            .resize-animation-stopper * {
                animation: none !important;
                transition: none !important;
            }
        `;
        document.head.appendChild(styleSheet);
    };
    
    improveAccessibility();
    
    // Optimize scroll performance
    const optimizeScroll = () => {
        let ticking = false;
        
        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Add classes to elements that are in viewport
                    const scrollPosition = window.scrollY + window.innerHeight * 0.9;
                    const sections = document.querySelectorAll('section');
                    
                    sections.forEach(section => {
                        const sectionTop = section.offsetTop;
                        if (scrollPosition > sectionTop) {
                            section.classList.add('in-viewport');
                        }
                    });
                    
                    ticking = false;
                });
                
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // Initial check
    };
    
    optimizeScroll();
});
