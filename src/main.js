// dropdown js
const dropdownButtons = document.querySelectorAll("[data-dropdown-toggle]");

dropdownButtons.forEach((button) => {
    const menuId = button.getAttribute("data-dropdown-toggle");
    const menu = document.querySelector(`[data-dropdown-menu='${menuId}']`);

    if (menu) {
        button.addEventListener("click", function (event) {
            event.stopPropagation();

            // Hide all other dropdowns
            document.querySelectorAll("[data-dropdown-menu]").forEach((otherMenu) => {
                if (otherMenu !== menu) {
                    otherMenu.classList.add("hidden");
                }
            });

            // Toggle current dropdown
            menu.classList.toggle("hidden");
        });

        // Optional: close dropdown if clicking outside
        document.addEventListener("click", function (event) {
            if (!menu.contains(event.target) && !button.contains(event.target)) {
                menu.classList.add("hidden");
            }
        });
    }
});

// Mobile Menu Functionality
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuContent = mobileMenu.querySelector('div');

// Open mobile menu
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('hidden');
    // Trigger reflow
    mobileMenu.offsetHeight;
    mobileMenuContent.classList.remove('translate-x-full', 'rtl:-translate-x-full');
    document.body.style.overflow = 'hidden';
});

// Close mobile menu  
function closeMobileMenu() {
    mobileMenuContent.classList.add('translate-x-full', 'rtl:-translate-x-full');
    setTimeout(() => {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

mobileMenuClose.addEventListener('click', closeMobileMenu);

// Close menu when clicking outside
mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
        closeMobileMenu();
    }
});

// Close menu when pressing escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        closeMobileMenu();
    }
});

// counter js
document.querySelectorAll('.counter').forEach(function (el) {
    const countTo = parseInt(el.getAttribute('data-count'), 10);
    const duration = 3000;
    const start = 0;
    const startTime = performance.now();

    function animateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentCount = Math.floor(progress * countTo);
        el.textContent = currentCount;

        if (progress < 1) {
            requestAnimationFrame(animateCount);
        } else {
            el.textContent = countTo;
        }
    }

    requestAnimationFrame(animateCount);
});

// FAQ Toggle Functionality
document.addEventListener('DOMContentLoaded', function () {
    // Get all FAQ toggle elements
    const faqToggles = document.querySelectorAll('.faq-toggle');

    // Add click event listener to each toggle
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            // Get the content element that follows this toggle
            const content = this.nextElementSibling;
            // Get the icon element
            const icon = this.querySelector('.faq-icon');

            // Toggle the hidden class on the content
            content.classList.toggle('hidden');

            // Rotate the icon based on the state
            if (content.classList.contains('hidden')) {
                icon.style.transform = 'rotate(0deg)';
            } else {
                icon.style.transform = 'rotate(45deg)';
            }
        });
    });

    // Initially hide all FAQ content
    document.querySelectorAll('.faq-content').forEach(content => {
        content.classList.add('hidden');
    });
});

// pricing card js
document.addEventListener('DOMContentLoaded', function () {
    // Get all package buttons
    const packageBtns = document.querySelectorAll('.package-btn');

    // Add click event to each button
    packageBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove border from all cards
            document.querySelectorAll('.package-card').forEach(card => {
                card.classList.remove('border-primary', 'border-2');
                card.classList.add('border-2', 'border-gray-200');
            });

            // Add border to selected card
            const card = this.closest('.package-card');
            card.classList.remove('border-2', 'border-gray-200');
            card.classList.add('border-primary', 'border-2');
        });
    });
});

// Star Rating Functionality
document.addEventListener('DOMContentLoaded', function() {
    const starButtons = document.querySelectorAll('.star-rating');
    let selectedRating = 0;

    starButtons.forEach((star, index) => {
        star.addEventListener('click', function(e) {
            e.preventDefault();
            selectedRating = index + 1;
            
            // Update star colors
            starButtons.forEach((s, i) => {
                if (i < selectedRating) {
                    s.classList.remove('text-gray-300');
                    s.classList.add('text-yellow-400');
                } else {
                    s.classList.remove('text-yellow-400');
                    s.classList.add('text-gray-300');
                }
            });
        });

        // Hover effect
        star.addEventListener('mouseenter', function() {
            const hoverRating = index + 1;
            starButtons.forEach((s, i) => {
                if (i < hoverRating) {
                    s.classList.add('text-yellow-400');
                    s.classList.remove('text-gray-300');
                }
            });
        });
    });

    // Reset to selected rating on mouse leave
    const starContainer = document.querySelector('.star-rating')?.parentElement;
    if (starContainer) {
        starContainer.addEventListener('mouseleave', function() {
            starButtons.forEach((s, i) => {
                if (i < selectedRating) {
                    s.classList.add('text-yellow-400');
                    s.classList.remove('text-gray-300');
                } else {
                    s.classList.add('text-gray-300');
                    s.classList.remove('text-yellow-400');
                }
            });
        });
    }
});


// hero swiper
if (document.querySelector('.hero-swiper')) {
    const heroSwiper = new Swiper('.hero-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        effect: "fade",
        loop: true,
        ...(document.documentElement.dir === 'rtl' ? { rtl: true } : {}),
        speed: 500,
        autoplay: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });
}

// pets swiper
if (document.querySelector('.pets-swiper')) {
    const productSwiper = new Swiper('.pets-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        ...(document.documentElement.dir === 'rtl' ? { rtl: true } : {}),
        speed: 500,
        navigation: {
            nextEl: '.swiper-button-next.pets-arrow',
            prevEl: '.swiper-button-prev.pets-arrow',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 32,
            },
        }
    });
}

// testimonial swiper
if (document.querySelector('.testimonial-swiper')) {
    const productSwiper = new Swiper('.testimonial-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        ...(document.documentElement.dir === 'rtl' ? { rtl: true } : {}),
        speed: 500,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 2,
            },
        }
    });
}

// team swiper
if (document.querySelector('.team-swiper')) {
    const teamSwiper = new Swiper('.team-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        ...(document.documentElement.dir === 'rtl' ? { rtl: true } : {}),
        speed: 500,
        navigation: {
            nextEl: '.swiper-button-next.team-arrow',
            prevEl: '.swiper-button-prev.team-arrow',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 24,
            },
            1280: {
                slidesPerView: 4,
                spaceBetween: 24,
            },
        }
    });
}