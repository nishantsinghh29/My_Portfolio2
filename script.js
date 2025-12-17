AOS.init({
    duration: 900,
    once: true,
    offset: 100
});

const body = document.body;
const navbar = document.getElementById('navbar');
const themeToggle = document.getElementById('theme-toggle');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

// Safe helper
const qs = (s, ctx = document) => ctx.querySelector(s);
const qsa = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

// Theme initialization
try {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun" aria-hidden="true"></i>';
        if (themeToggle) themeToggle.setAttribute('aria-pressed', 'true');
    } else {
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i>';
        if (themeToggle) themeToggle.setAttribute('aria-pressed', 'false');
    }
} catch (err) { console.warn('Theme init error', err); }

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            body.removeAttribute('data-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i>';
            themeToggle.setAttribute('aria-pressed', 'false');
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun" aria-hidden="true"></i>';
            themeToggle.setAttribute('aria-pressed', 'true');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Hamburger toggle with keyboard support
if (hamburger && navMenu) {
    const toggleNav = () => {
        const expanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', String(!expanded));
    };

    hamburger.addEventListener('click', toggleNav);
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleNav();
        }
    });

    qsa('.nav-link', navMenu).forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

// Scroll handler (throttled with rAF)
let isTicking = false;
const onScroll = () => {
    if (!isTicking) {
        window.requestAnimationFrame(() => {
            if (window.scrollY > 100) {
                navbar && navbar.classList.add('scrolled');
            } else {
                navbar && navbar.classList.remove('scrolled');
            }

            const sections = qsa('section[id]');
            const navLinks = qsa('.nav-link');
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= (sectionTop - 220)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') && link.getAttribute('href').slice(1) === current) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.removeAttribute('aria-current');
                }
            });

            isTicking = false;
        });
        isTicking = true;
    }
};

window.addEventListener('scroll', onScroll, { passive: true });

// Typing animation
const typingTexts = [
    'Data Scientist',
    'Machine Learning Engineer',
    'Data Analyst',
    'Python Developer',
    'AI Enthusiast'
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeText() {
    const typingElement = qs('.typing-text');
    if (!typingElement) return;
    const currentText = typingTexts[textIndex];
    let typingSpeed = isDeleting ? 50 : 120;

    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingSpeed = 1800;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        typingSpeed = 600;
    }

    setTimeout(typeText, typingSpeed);
}

typeText();

// Conditional particles init (guarded)
if (typeof particlesJS !== 'undefined') {
    try {
        particlesJS('particles-js', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: '#6366f1' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: '#6366f1', opacity: 0.35, width: 1 },
                move: { enable: true, speed: 2, direction: 'none', out_mode: 'out' }
            },
            interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
                modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
            },
            retina_detect: true
        });
    } catch (err) { console.warn('Particles init failed', err); }
}

// Stats animation
const statNumbers = qsa('.stat-number');
let animated = false;
function animateStats() {
    if (animated) return;
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target')) || 0;
        const duration = 1200;
        const start = performance.now();

        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const value = Math.floor(progress * target);
            stat.textContent = value < target ? value : target + '+';
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    });
    animated = true;
}

const statsSection = qs('.about-stats');
if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) animateStats(); });
    }, { threshold: 0.5 });
    observer.observe(statsSection);
}

// Projects filter
const filterBtns = qsa('.filter-btn');
const projectCards = qsa('.project-card');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.45s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Contact form mailto fallback
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const name = formData.get('name') || '';
        const email = formData.get('email') || '';
        const subject = formData.get('subject') || 'Contact from portfolio';
        const message = formData.get('message') || '';
            // Collect form data
            // Simple validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields.');
                return;
            }

            // Option 1: Open mail client (mailto)
            var mailtoLink = `mailto:singhnishant0506@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\nMessage: ' + message)}`;
            window.location.href = mailtoLink;

            // Option 2: Show thank you message (uncomment if you prefer this)
            // contactForm.reset();
            // alert('Thank you for reaching out! I will get back to you soon.');
    });
}

// Smooth anchor scrolling with offset
qsa('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const hash = this.getAttribute('href');
        if (!hash || hash === '#') return;
        const target = document.querySelector(hash);
        if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            // move focus for accessibility
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        }
    });
});

// small style injection for animation keyframes if not present
if (!document.getElementById('portfolio-fade-keyframes')) {
    const style = document.createElement('style');
    style.id = 'portfolio-fade-keyframes';
    style.textContent = `@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`;
    document.head.appendChild(style);
}
