const modal = document.querySelector('#modal');
const modalImg = document.querySelector('#modalImg');
const modalTitle = document.querySelector('#modalTitle');
const modalDescription = document.querySelector('#modalDescription');
const closeBtn = document.querySelector('#closeBtn');
const modalBtn = document.querySelector('#modalBtn');
const items = document.querySelectorAll('.slider .item');

let currentUrl = '';

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
});

// Pause rotation on hover
items.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.parentElement.style.animationPlayState = 'paused';
    });

    item.addEventListener('mouseleave', () => {
        item.parentElement.style.animationPlayState = 'running';
    });
});