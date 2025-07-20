const modal = document.querySelector('#modal');
const modalImg = document.querySelector('#modalImg');
const modalTitle = document.querySelector('#modalTitle');
const modalDescription = document.querySelector('#modalDescription');
const closeBtn = document.querySelector('#closeBtn');
const modalBtn = document.querySelector('#modalBtn');
const items = document.querySelectorAll('.slider .item');

// Rotation Control Elements
const slider = document.querySelector('.slider');
const rotationSpeed = document.querySelector('#rotationSpeed');
const speedValue = document.querySelector('#speedValue');
const rotationStyle = document.querySelector('#rotationStyle');
const rotationEffect = document.querySelector('#rotationEffect');
const customAngle = document.querySelector('#customAngle');
const rotateToAngleBtn = document.querySelector('#rotateToAngle');
const clockwiseBtn = document.querySelector('#clockwise');
const counterclockwiseBtn = document.querySelector('#counterclockwise');
const playPauseBtn = document.querySelector('#playPause');
const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');
const resetBtn = document.querySelector('#resetBtn');
const fullscreenBtn = document.querySelector('#fullscreenBtn');
const infoBtn = document.querySelector('#infoBtn');
const currentItemSpan = document.querySelector('#currentItem');
const currentAngleSpan = document.querySelector('#currentAngle');

let currentUrl = '';
let isPaused = false; // Start with rotation active
let currentDirection = 'clockwise';
let currentRotation = 0;
let currentItemIndex = 0;
let totalItems = 8; // Total number of items in the gallery
let animationId = null;

// Initialize rotation controls
function initializeRotationControls() {
    // Set initial state - auto rotation active
    isPaused = false; // Start with rotation active
    updateRotationAnimation();
    updatePlayPauseButton();
    updateActiveItem();
    updateGalleryInfo();
    
    // Speed control
    rotationSpeed.addEventListener('input', (e) => {
        const speed = e.target.value;
        speedValue.textContent = speed + 's';
        if (!isPaused) {
            updateRotationAnimation();
            updateEffectSpeed(speed);
        }
    });
    
    // Style control
    rotationStyle.addEventListener('change', () => {
        if (!isPaused) {
            updateRotationAnimation();
        }
    });
    
    // Rotation effect control
    rotationEffect.addEventListener('change', () => {
        if (!isPaused) {
            updateRotationAnimation();
        } else {
            // Even in paused mode, clear effects
            slider.classList.remove('floating', 'pulse', 'orbit', 'spiral');
        }
    });
    
    // Custom angle control
    rotateToAngleBtn.addEventListener('click', () => {
        const angle = parseInt(customAngle.value) || 45;
        rotateToCustomAngle(angle);
    });
    
    // Real-time angle input (optional)
    customAngle.addEventListener('input', (e) => {
        const angle = parseInt(e.target.value) || 0;
        if (isPaused) {
            // Update in real-time when paused
            currentRotation = angle;
            currentItemIndex = Math.round(angle / 45) % totalItems;
            updateRotationAnimation();
            updateActiveItem();
            updateGalleryInfo();
        }
    });
    
    // Direction control
    clockwiseBtn.addEventListener('click', () => {
        currentDirection = 'clockwise';
        updateDirectionButtons();
        if (!isPaused) {
            updateRotationAnimation();
        }
    });
    
    counterclockwiseBtn.addEventListener('click', () => {
        currentDirection = 'counterclockwise';
        updateDirectionButtons();
        if (!isPaused) {
            updateRotationAnimation();
        }
    });
    
    // Play/Pause control
    playPauseBtn.addEventListener('click', togglePlayPause);
    
    // Navigation controls - manual rotation
    prevBtn.addEventListener('click', (event) => rotateToPrevious(event));
    nextBtn.addEventListener('click', (event) => rotateToNext(event));
    
    // Quick actions
    resetBtn.addEventListener('click', resetGallery);
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    infoBtn.addEventListener('click', showGalleryInfo);
}

// Update rotation animation
function updateRotationAnimation() {
    // Clear all previous classes and styles
    slider.classList.remove('manual-mode', 'custom-rotation', 'floating', 'pulse', 'orbit', 'spiral');
    slider.style.removeProperty('animation');
    slider.style.removeProperty('animation-direction');
    slider.style.removeProperty('animation-play-state');
    slider.style.removeProperty('animation-duration');
    
    if (isPaused) {
        // Manual control mode - no animation
        slider.style.setProperty('--custom-rotation', `${currentRotation}deg`);
        slider.classList.add('manual-mode', 'custom-rotation');
    } else {
        // Auto rotation mode
        const speed = rotationSpeed.value;
        const style = rotationStyle.value;
        const direction = currentDirection === 'clockwise' ? 1 : -1;
        const effect = rotationEffect.value;
        
        if (effect !== 'normal') {
            // Apply effect animation
            slider.classList.add(effect);
            // Set effect speed and direction
            updateEffectSpeed(speed);
            if (direction === -1) {
                slider.style.animationDirection = 'reverse';
            }
        } else {
            // Apply normal rotation animation
            slider.style.animation = `autoRotate ${speed}s ${style} infinite`;
            slider.style.animationDirection = direction === 1 ? 'normal' : 'reverse';
            slider.style.animationPlayState = 'running';
        }
    }
}

// Update direction buttons
function updateDirectionButtons() {
    clockwiseBtn.classList.toggle('active', currentDirection === 'clockwise');
    counterclockwiseBtn.classList.toggle('active', currentDirection === 'counterclockwise');
}

// Update play/pause button display
function updatePlayPauseButton() {
    if (isPaused) {
        playPauseBtn.textContent = '▶️ Auto Play';
        playPauseBtn.classList.add('paused');
    } else {
        playPauseBtn.textContent = '⏸️ Pause';
        playPauseBtn.classList.remove('paused');
    }
}



// Update gallery info
function updateGalleryInfo() {
    currentItemSpan.textContent = `Item: ${currentItemIndex + 1}/${totalItems}`;
    currentAngleSpan.textContent = `Angle: ${currentRotation}°`;
}

// Update effect animation speed
function updateEffectSpeed(speed) {
    const effect = rotationEffect.value;
    if (effect !== 'normal') {
        // Calculate effect speed based on the speed slider
        let effectSpeed;
        switch (effect) {
            case 'floating':
                effectSpeed = speed * 0.83; // 25s base / 30s default
                break;
            case 'pulse':
                effectSpeed = speed * 0.67; // 20s base / 30s default
                break;
            case 'orbit':
                effectSpeed = speed * 0.73; // 22s base / 30s default
                break;
            case 'spiral':
                effectSpeed = speed * 0.6; // 18s base / 30s default
                break;
            default:
                effectSpeed = speed;
        }
        
        // Apply the new speed to the effect
        slider.style.animationDuration = `${effectSpeed}s`;
        slider.style.animationPlayState = 'running';
    }
}

// Toggle play/pause
function togglePlayPause() {
    isPaused = !isPaused;
    updatePlayPauseButton();
    updateRotationAnimation();
}

// Rotate to next item
function rotateToNext(event) {
    addNavigationEffects(event);
    
    if (isPaused) {
        currentItemIndex = (currentItemIndex + 1) % totalItems;
        currentRotation = currentItemIndex * 45;
        updateRotationAnimation(); // This will update the custom rotation
        updateActiveItem();
        updateGalleryInfo();
    } else {
        // If auto rotation is on, temporarily pause and rotate
        const wasPaused = isPaused;
        isPaused = true;
        currentItemIndex = (currentItemIndex + 1) % totalItems;
        currentRotation = currentItemIndex * 45;
        updateRotationAnimation();
        updateActiveItem();
        updateGalleryInfo();
        
        // Resume auto rotation after a delay
        setTimeout(() => {
            isPaused = wasPaused;
            updateRotationAnimation();
        }, 1000);
    }
}

// Rotate to previous item
function rotateToPrevious(event) {
    addNavigationEffects(event);
    
    if (isPaused) {
        currentItemIndex = (currentItemIndex - 1 + totalItems) % totalItems;
        currentRotation = currentItemIndex * 45;
        updateRotationAnimation(); // This will update the custom rotation
        updateActiveItem();
        updateGalleryInfo();
    } else {
        // If auto rotation is on, temporarily pause and rotate
        const wasPaused = isPaused;
        isPaused = true;
        currentItemIndex = (currentItemIndex - 1 + totalItems) % totalItems;
        currentRotation = currentItemIndex * 45;
        updateRotationAnimation();
        updateActiveItem();
        updateGalleryInfo();
        
        // Resume auto rotation after a delay
        setTimeout(() => {
            isPaused = wasPaused;
            updateRotationAnimation();
        }, 1000);
    }
}

// Add navigation effects
function addNavigationEffects(event) {
    // Add glow effect to slider
    slider.classList.add('navigating');
    
    // Add button click effect
    if (event && event.target && event.target.classList.contains('nav-btn')) {
        event.target.classList.add('clicked');
        setTimeout(() => {
            event.target.classList.remove('clicked');
        }, 400);
    }
    
    // Remove glow effect after animation
    setTimeout(() => {
        slider.classList.remove('navigating');
    }, 800);
}

// Update active item highlighting
function updateActiveItem() {
    // Remove active class from all items
    items.forEach(item => item.classList.remove('active'));
    
    // Add active class to current item
    if (items[currentItemIndex]) {
        items[currentItemIndex].classList.add('active');
    }
}

// Rotate to custom angle
function rotateToCustomAngle(angle) {
    // Ensure angle is within 0-360 range
    angle = ((angle % 360) + 360) % 360;
    
    // Update current rotation and item index
    currentRotation = angle;
    currentItemIndex = Math.round(angle / 45) % totalItems;
    
    // Temporarily pause to show custom angle
    const wasPaused = isPaused;
    isPaused = true;
    updateRotationAnimation();
    updateActiveItem();
    updateGalleryInfo();
    
    // Add visual feedback
    addNavigationEffects();
    
    // If auto rotation was on, resume after custom rotation
    if (!wasPaused) {
        setTimeout(() => {
            isPaused = false;
            updateRotationAnimation();
        }, 1500);
    }
}



// Reset gallery to initial state
function resetGallery() {
    currentItemIndex = 0;
    currentRotation = 0;
    isPaused = false; // Start with rotation active
    currentDirection = 'clockwise';
    
    // Reset all controls to default
    rotationSpeed.value = 30;
    speedValue.textContent = '30s';
    rotationStyle.value = 'linear';
    rotationEffect.value = 'normal';
    customAngle.value = 45;
    
    // Update all states
    updatePlayPauseButton();
    updateDirectionButtons();
    updateRotationAnimation();
    updateActiveItem();
    updateGalleryInfo();
    
    addNavigationEffects();
}

// Toggle fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        fullscreenBtn.textContent = '⛶ Exit Fullscreen';
    } else {
        document.exitFullscreen();
        fullscreenBtn.textContent = '⛶ Fullscreen';
    }
}

// Show gallery info
function showGalleryInfo() {
    const info = `
Gallery Information:
• Total Items: ${totalItems}
• Current Item: ${currentItemIndex + 1}
• Current Angle: ${currentRotation}°
• Rotation Speed: ${rotationSpeed.value}s
• Direction: ${currentDirection}
• Status: ${isPaused ? 'Paused' : 'Playing'}
• Style: ${rotationStyle.options[rotationStyle.selectedIndex].text}
• Effect: ${rotationEffect.options[rotationEffect.selectedIndex].text}
    `;
    
    alert(info);
}

// Click to open modal
items.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.getAttribute('data-title');
        const description = item.getAttribute('data-description');
        const url = item.getAttribute('data-url');

        modalImg.src = img.src;
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        currentUrl = url;

        modal.classList.add('active');
    });
});

// Close modal with cross button
closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});

// Modal button functionality - now opens the link
modalBtn.addEventListener('click', () => {
    if (currentUrl) {
        window.open(currentUrl, '_blank');
    }
});

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
    }
    
    // Enter key to apply custom angle
    if (e.key === 'Enter' && document.activeElement === customAngle) {
        const angle = parseInt(customAngle.value) || 45;
        rotateToCustomAngle(angle);
    }
});

// Pause rotation on hover (only when not manually paused)
items.forEach(item => {
    item.addEventListener('mouseenter', () => {
        if (!isPaused) {
            item.parentElement.style.animationPlayState = 'paused';
        }
    });

    item.addEventListener('mouseleave', () => {
        if (!isPaused) {
            item.parentElement.style.animationPlayState = 'running';
        }
    });
});

// Initialize controls when page loads
document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeRotationControls();
        updateActiveItem(); // Set initial active item
    } catch (error) {
        console.error('Error initializing gallery:', error);
    }
});

// Handle page visibility changes for better performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden && !isPaused) {
        // Pause animation when page is not visible
        slider.style.animationPlayState = 'paused';
    } else if (!document.hidden && !isPaused) {
        // Resume animation when page becomes visible
        slider.style.animationPlayState = 'running';
    }
});