// Add CSS for ripple effects
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        background: radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        opacity: 0.6;
        animation: ripple-effect 1.5s ease-out forwards;
        z-index: 5;
    }
    
    @keyframes ripple-effect {
        0% {
            width: 0px;
            height: 0px;
            opacity: 0.8;
        }
        100% {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

document.addEventListener('DOMContentLoaded', function() {
  // Original mobile menu script
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        // Toggle hamburger/close icon
        const icon = menuBtn.querySelector('i');
        if (icon) {
          if (icon.classList.contains('fa-bars')) {
              icon.classList.remove('fa-bars');
              icon.classList.add('fa-times');
          } else {
              icon.classList.remove('fa-times');
              icon.classList.add('fa-bars');
          }
        }
    });
  }
  
  // Close menu when clicking a link
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
      link.addEventListener('click', function() {
          if (navLinks) navLinks.classList.remove('active');
          const icon = menuBtn?.querySelector('i');
          if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
          }
      });
  });
  
  // Entry animation script
  const preloader = document.querySelector('.preloader');
  const mainContent = document.querySelector('.main-content');
  const enterButton = document.getElementById('enterButton');
  const cursorGlow = document.querySelector('.cursor-glow');
  const cursorEffect = document.querySelector('.cursor-effect');
  const instructionText = document.querySelector('.instruction-text');
  
  // Exit if necessary elements don't exist
  if (!preloader || !mainContent || !enterButton || !cursorGlow || !cursorEffect) {
    console.error('Required elements not found');
    return;
  }
  
  // Touch detection
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  
  // Add touch-specific class to body if it's a touch device
  if (isTouchDevice) {
      document.body.classList.add('touch-device');
      
      // Update instruction text for touch devices
      if (instructionText) {
          instructionText.textContent = 'Tap the button to continue';
      }
  }
  
  // Function to enter the portfolio - COMMON for both desktop and mobile
  function enterPortfolio() {
      preloader.classList.add('hidden');
      setTimeout(() => {
          mainContent.classList.add('visible');
      }, 400);
  }
  
  // Click/tap event for the enter button - COMMON for both desktop and mobile
  enterButton.addEventListener('click', enterPortfolio);
  
  // Listen for the Enter key - DESKTOP ONLY
  if (!isTouchDevice) {
      document.addEventListener('keydown', function(event) {
          if (event.key === 'Enter' && !preloader.classList.contains('hidden')) {
              enterPortfolio();
          }
      });
  }
  
  // Initial cursor position (center of screen)
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  cursorGlow.style.left = `${mouseX}px`;
  cursorGlow.style.top = `${mouseY}px`;
  
  // --- COMMON FUNCTIONS FOR BOTH DESKTOP AND MOBILE ---
  // Create ripple effect function
  function createRipple(x, y, isClick = false) {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');

    // Position the ripple
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    // Make click ripples larger and more visible
    if (isClick) {
        ripple.style.width = '120px';
        ripple.style.height = '120px';
        ripple.style.opacity = '0.8';
        ripple.style.animationDuration = '1.8s';
    }
    // Add some random variation to mousemove ripples
    else {
        const size = Math.random() * 30 + 70; // 70-100px
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.opacity = `${Math.random() * 0.3 + 0.5}`; // 0.5-0.8 opacity
    }

    cursorEffect.appendChild(ripple);

    // Remove ripple after animation completes
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.remove();
        }
    }, isClick ? 1800 : 1500);
  }
  
  // --- TOUCHSCREEN SUPPORT ---
  if (isTouchDevice) {
      // Touch event handlers
      preloader.addEventListener('touchstart', handleTouchStart, false);
      preloader.addEventListener('touchmove', handleTouchMove, false);
      preloader.addEventListener('touchend', handleTouchEnd, false);
      
      // Variables for touch tracking
      let touchStartX = 0;
      let touchStartY = 0;
      let lastTouchX = 0;
      let lastTouchY = 0;
      let touchTimeoutId = null;
      
      // Handle touch start event
      function handleTouchStart(e) {
          const touch = e.touches[0];
          touchStartX = touch.clientX;
          touchStartY = touch.clientY;
          lastTouchX = touchStartX;
          lastTouchY = touchStartY;
          
          // Move the glow effect to touch position
          mouseX = touch.clientX;
          mouseY = touch.clientY;
          cursorGlow.style.left = `${mouseX}px`;
          cursorGlow.style.top = `${mouseY}px`;
          
          // Scale the glow for touch (make it larger)
          cursorGlow.style.width = '400px';
          cursorGlow.style.height = '400px';
          
          // Create ripple effect on touch
          createRipple(touch.clientX, touch.clientY);
          
          // Clear any existing timeout
          if (touchTimeoutId) {
              clearTimeout(touchTimeoutId);
          }
          
          // Set timeout to shrink glow after touch ends
          touchTimeoutId = setTimeout(() => {
              cursorGlow.style.width = '300px';
              cursorGlow.style.height = '300px';
          }, 1000);
      }
      
      // Handle touch move event
      function handleTouchMove(e) {
          // Prevent default to stop scrolling
          if (!preloader.classList.contains('hidden')) {
              e.preventDefault();
          }
          
          const touch = e.touches[0];
          
          // Move the glow effect to touch position
          mouseX = touch.clientX;
          mouseY = touch.clientY;
          cursorGlow.style.left = `${mouseX}px`;
          cursorGlow.style.top = `${mouseY}px`;
          
          // Calculate velocity for particle effect intensity
          const dx = touch.clientX - lastTouchX;
          const dy = touch.clientY - lastTouchY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Create occasional ripples during fast swipes
          if (distance > 10 && Math.random() < 0.2) {
              createRipple(touch.clientX, touch.clientY);
          }
          
          // Affect nearby particles more intensely with faster swipes
          const particles = document.querySelectorAll('.particle');
          const intensity = Math.min(distance / 2, 5); // Cap the intensity
          
          particles.forEach(particle => {
              const rect = particle.getBoundingClientRect();
              const particleX = rect.left + rect.width / 2;
              const particleY = rect.top + rect.height / 2;
              
              // Calculate distance between touch and particle
              const pdx = mouseX - particleX;
              const pdy = mouseY - particleY;
              const pdistance = Math.sqrt(pdx * pdx + pdy * pdy);
              
              // If particle is within 150px of touch (larger radius for touch), move it
              if (pdistance < 150) {
                  const angle = Math.atan2(pdy, pdx);
                  const force = (150 - pdistance) / 10 * intensity; // Stronger effect based on swipe speed
                  
                  // Apply movement away from touch
                  const moveX = Math.cos(angle) * force;
                  const moveY = Math.sin(angle) * force;
                  
                  particle.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
                  
                  // Increase opacity/size when close to touch
                  particle.style.opacity = Math.min(1, 0.5 + (distance / 100));
                  const originalSize = parseFloat(particle.getAttribute('data-size') || 2);
                  particle.style.width = particle.style.height = `${Math.min(8, originalSize + intensity)}px`;
              } else {
                  // Reset transform when not influenced
                  particle.style.transform = '';
                  const originalSize = parseFloat(particle.getAttribute('data-size') || 2);
                  if (originalSize) {
                      particle.style.width = particle.style.height = `${originalSize}px`;
                  }
              }
          });
          
          // Update last touch position
          lastTouchX = touch.clientX;
          lastTouchY = touch.clientY;
      }
      
      // Handle touch end event
      function handleTouchEnd(e) {
          // Gradually shrink the glow back to normal size
          setTimeout(() => {
              cursorGlow.style.width = '300px';
              cursorGlow.style.height = '300px';
          }, 300);
          
          // Reset any particle transformations gradually
          const particles = document.querySelectorAll('.particle');
          particles.forEach(particle => {
              setTimeout(() => {
                  particle.style.transform = '';
                  const originalSize = parseFloat(particle.getAttribute('data-size') || 2);
                  const originalOpacity = parseFloat(particle.getAttribute('data-opacity') || 0.3);
                  if (originalSize) {
                      particle.style.width = particle.style.height = `${originalSize}px`;
                      particle.style.opacity = originalOpacity;
                  }
              }, Math.random() * 500);
          });
      }
      
      // Add additional CSS for touch devices
      const touchStyle = document.createElement('style');
      touchStyle.textContent = `
          .touch-device .cursor-glow {
              width: 350px;
              height: 350px;
              transition: width 0.3s, height 0.3s, left 0.2s, top 0.2s;
          }
          
          .touch-device .ripple {
              width: 100px;
              height: 100px;
          }
          
          .touch-device .enter-button {
              padding: 16px 44px;
              font-size: 18px;
              position: relative;
              z-index: 1000;
          }
          
          .touch-device .enter-button::after {
              animation: button-pulse 2s infinite;
          }
          
          @keyframes button-pulse {
              0% { left: -100%; }
              50% { left: 100%; }
              100% { left: -100%; }
          }
      `;
      document.head.appendChild(touchStyle);
  } else {
      // --- DESKTOP MOUSE SUPPORT ---
      // Track cursor position (mouse)
      preloader.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Move the glow effect to cursor position
        cursorGlow.style.left = `${mouseX}px`;
        cursorGlow.style.top = `${mouseY}px`;
        
        // Create ripple effect on mouse move (occasionally)
        if (Math.random() < 0.05) { // Reduced from 0.1 to 0.05 for fewer but more noticeable ripples
            createRipple(mouseX, mouseY);
        }
        
        // Affect nearby particles
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            const rect = particle.getBoundingClientRect();
            const particleX = rect.left + rect.width / 2;
            const particleY = rect.top + rect.height / 2;
            
            // Calculate distance between cursor and particle
            const dx = mouseX - particleX;
            const dy = mouseY - particleY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Store original size and opacity if not already stored
            const originalSize = parseFloat(particle.getAttribute('data-size') || 2);
            const originalOpacity = parseFloat(particle.getAttribute('data-opacity') || 0.3);
            
            // If particle is within 100px of cursor, move it slightly
            if (distance < 100) {
                const angle = Math.atan2(dy, dx);
                const force = (100 - distance) / 10; // Stronger effect when closer
                
                // Apply slight movement away from cursor
                const moveX = Math.cos(angle) * force;
                const moveY = Math.sin(angle) * force;
                
                particle.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
                
                // Increase opacity/size when close to cursor
                particle.style.opacity = Math.min(1, parseFloat(originalOpacity) + 0.2);
                particle.style.width = particle.style.height = `${Math.min(6, parseFloat(originalSize) + 1)}px`;
            } else {
                // Reset transform when not influenced
                particle.style.transform = '';
                particle.style.width = particle.style.height = `${originalSize}px`;
                particle.style.opacity = originalOpacity;
            }
        });
      });

      // Add click effect for preloader background
      preloader.addEventListener('click', (e) => {
        if (!e.target.closest('.enter-button')) {
            createRipple(e.clientX, e.clientY, true); // Pass true to indicate it's a click ripple
        }
      });
  }
  
  // Create interactive background stars
  function createStars() {
    const starCount = 30;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random size between 1 and 3px
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        star.style.left = `${posX}%`;
        star.style.top = `${posY}%`;
        
        // Random animation delay
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        cursorEffect.appendChild(star);
    }
  }
  
  // Create animated background particles
  const particlesContainer = document.getElementById('particles');
  
  if (particlesContainer) {
    const particleCount = 50;
    
    // Clear existing particles if any
    while (particlesContainer.firstChild) {
        particlesContainer.removeChild(particlesContainer.firstChild);
    }
    
    for (let i = 0; i < particleCount; i++) {
        createEnhancedParticle(particlesContainer);
    }
  }
  
  function createEnhancedParticle(container) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random position
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    // Increased size range for better visibility
    const size = Math.random() * 6 + 2; // Increased from 4+1 to 6+2
    
    // Higher opacity for better visibility
    const opacity = Math.random() * 0.7 + 0.3; // Increased from 0.5+0.1 to 0.7+0.3
    
    // Set styles
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.opacity = opacity;
    
    // Store original values as data attributes
    particle.setAttribute('data-size', size);
    particle.setAttribute('data-opacity', opacity);
    
    // Increase colored particles and make colors more vibrant
    if (Math.random() < 0.5) { // Increased from 0.3 to 0.5
        // More vibrant color variations with higher saturation
        const hue = Math.random() < 0.7 ? 
            // Blue/purple range
            (220 + Math.random() * 60) : 
            // Occasional accent colors (yellows, cyans)
            (Math.random() * 180);
            
        particle.style.backgroundColor = `hsla(${hue}, 80%, 65%, ${opacity})`;
        
        // Add subtle glow to some particles
        if (Math.random() < 0.3) {
            particle.style.boxShadow = `0 0 ${size * 2}px hsla(${hue}, 90%, 70%, 0.6)`;
        }
    }
    
    // Faster transitions for more responsive interaction
    particle.style.transition = `transform 0.2s ease-out, opacity 0.2s ease-out, width 0.2s ease-out, height 0.2s ease-out, background-color 0.3s ease-out`;
    
    // Start base animation
    animateParticle(particle);
    
    container.appendChild(particle);
  }

  function animateParticle(particle) {
    // Enhanced random movement with larger range
    const moveX = Math.random() * 200 - 100; // Doubled from 100-50 to 200-100
    const moveY = Math.random() * 200 - 100; // Doubled from 100-50 to 200-100
    
    // Variable speeds (some faster, some slower)
    const duration = Math.random() < 0.3 ? 
        (Math.random() * 5 + 8) :  // Faster particles (8-13s)
        (Math.random() * 10 + 15); // Regular particles (15-25s)
    
    // Add scale pulsing to the animation
    const pulseScale = Math.random() < 0.7 ? 
        (Math.random() * 0.4 + 1.1) : // Subtle pulse (1.1-1.5x)
        (Math.random() * 0.8 + 1.5);  // Stronger pulse (1.5-2.3x)
    
    // Create more complex keyframes with scale and opacity changes
    const keyframes = [
        { 
            transform: 'translate(0, 0) scale(1)', 
            opacity: parseFloat(particle.getAttribute('data-opacity')) 
        },
        { 
            transform: `translate(${moveX * 0.3}px, ${moveY * 0.5}px) scale(${pulseScale})`,
            opacity: Math.min(1, parseFloat(particle.getAttribute('data-opacity')) * 1.3),
            offset: 0.25
        },
        { 
            transform: `translate(${moveX}px, ${moveY}px) scale(1)`,
            opacity: Math.max(0.2, parseFloat(particle.getAttribute('data-opacity')) * 0.8),
            offset: 0.5
        },
        { 
            transform: `translate(${moveX * 0.7}px, ${moveY * 0.3}px) scale(${pulseScale * 0.8})`,
            opacity: parseFloat(particle.getAttribute('data-opacity')),
            offset: 0.75
        },
        { 
            transform: 'translate(0, 0) scale(1)',
            opacity: parseFloat(particle.getAttribute('data-opacity'))
        }
    ];
    
    try {
      // Apply the animation with easing
      const animation = particle.animate(keyframes, {
          duration: duration * 1000,
          iterations: Infinity,
          easing: 'cubic-bezier(0.4, 0, 0.6, 1)' // More dynamic easing
      });
      
      // Add a secondary rotation animation for some particles
      if (Math.random() < 0.4) {
          const rotationAmt = Math.random() < 0.5 ? 360 : -360; // Clockwise or counter-clockwise
          const rotationDuration = duration * 0.8; // Slightly faster than position animation
          
          particle.animate([
              { transform: 'rotate(0deg)' },
              { transform: `rotate(${rotationAmt}deg)` }
          ], {
              duration: rotationDuration * 1000,
              iterations: Infinity,
              easing: 'ease-in-out'
          });
      }
    } catch (err) {
      console.warn('Web Animation API not fully supported', err);
      // Fallback for browsers without full Web Animation API support
      particle.style.animation = `particleFloat ${duration}s infinite ease-in-out`;
    }
  }
  
  // Initialize stars
  createStars();
});