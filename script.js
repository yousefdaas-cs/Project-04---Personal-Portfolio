/**
 * Personal Portfolio Interactive Functionality
 * Author: Yousef Da'as
 * Technologies: Vanilla JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initMobileNavigation();
  initContactFormValidation();
  initActiveNavigationScroll();
});

/**
 * Theme Switcher with localStorage persistence
 */
function initThemeSwitcher() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const storageKey = 'portfolio-theme-preference';
  const htmlElement = document.documentElement;

  // Retrieve saved preference or fallback to system dark preference
  const savedTheme = localStorage.getItem(storageKey);
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'dark'); // dark is default

  setTheme(initialTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem(storageKey, newTheme);
  });

  function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    themeToggle.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
    );
  }
}

/**
 * Mobile Navigation Drawer Toggle & Escape / Backdrop listeners
 */
function initMobileNavigation() {
  const toggleButton = document.getElementById('nav-toggle');
  const primaryNav = document.getElementById('primary-navigation');
  if (!toggleButton || !primaryNav) return;

  const navLinks = primaryNav.querySelectorAll('.nav-link');

  toggleButton.addEventListener('click', () => {
    const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
    toggleMenu(!isExpanded);
  });

  // Close navigation menu when a navigation item is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (toggleButton.getAttribute('aria-expanded') === 'true') {
        toggleMenu(false);
      }
    });
  });

  // Close when pressing the Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggleButton.getAttribute('aria-expanded') === 'true') {
      toggleMenu(false);
      toggleButton.focus();
    }
  });

  function toggleMenu(open) {
    toggleButton.setAttribute('aria-expanded', String(open));
    primaryNav.classList.toggle('is-open', open);
  }
}

/**
 * Client-Side Validation for Demonstration Contact Form
 */
/**
 * Interactive Email Composer & Clipboard Handler
 */
function initContactFormValidation() {
  const composer = document.getElementById('email-composer');
  const copyBtn = document.getElementById('copy-draft-btn');
  const statusEl = document.getElementById('composer-status');
  if (!composer) return;

  const targetEmail = 'YousefDaas.CS@gmail.com';
  const nameInput = document.getElementById('composer-name');
  const subjectInput = document.getElementById('composer-subject');
  const messageInput = document.getElementById('composer-message');

  function buildMessageContent() {
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    return `Hi Yousef,\n\n${message}\n\nBest regards,\n${name}`;
  }

  // Handle "Send via Email App"
  composer.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !subject || !message) {
      showStatus('Please fill in all fields before sending.', 'error');
      return;
    }

    const fullBody = buildMessageContent();
    const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullBody)}`;

    // Open user's default email client
    window.location.href = mailtoUrl;

    showStatus('Opening your default email app...', 'success');
  });

  // Handle "Copy Message Text"
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      const message = messageInput.value.trim();

      if (!message) {
        showStatus('Please type a message first to copy.', 'error');
        return;
      }

      const formattedText = name ? buildMessageContent() : message;

      navigator.clipboard.writeText(formattedText).then(() => {
        showStatus('Message copied to clipboard! You can paste it into your email.', 'success');
      }).catch(() => {
        showStatus('Unable to copy automatically. Please select and copy manually.', 'error');
      });
    });
  }

  function showStatus(text, type) {
    statusEl.textContent = text;
    statusEl.className = 'form-status';
    if (type === 'success') {
      statusEl.classList.add('is-success');
    } else {
      statusEl.style.backgroundColor = 'var(--error-bg)';
      statusEl.style.color = 'var(--error-color)';
      statusEl.style.border = '1px solid var(--error-color)';
    }
    statusEl.style.display = 'block';
  }
}
/**
 * Highlight active navigation link on scroll using IntersectionObserver
 */
function initActiveNavigationScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('is-active');
          } else {
            link.classList.remove('is-active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}
