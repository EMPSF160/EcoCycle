/**
 * VERDANT ECOSYSTEMS | 2027 SUSTAINABILITY PLATFORM
 * Core Application Engine: Theme, RTL, Navigation, Utilities
 */

(function () {
  'use strict';

  // --- 1. Immediate Theme & RTL Restoration ---
  const savedTheme = localStorage.getItem('verdant_theme') || 'light';
  const savedDir = localStorage.getItem('verdant_dir') || 'ltr';

  document.documentElement.setAttribute('data-theme', savedTheme);
  document.documentElement.setAttribute('data-bs-theme', savedTheme);
  document.documentElement.setAttribute('dir', savedDir);
  document.documentElement.setAttribute('lang', savedDir === 'rtl' ? 'ar' : 'en');

  // --- 2. DOM Ready Initializations ---
  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initDirToggle();
    initStickyHeader();
    initActiveNav();
    initMobileNav();
    initCounters();
    initLucide();
    initAOS();
    initUserSession();
  });

  // --- 3. Lucide Icons ---
  function initLucide() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // --- 4. AOS Animations ---
  function initAOS() {
    if (window.AOS) {
      window.AOS.init({
        duration: 800,
        once: true,
        offset: 50,
        easing: 'ease-out-cubic'
      });
    }
  }

  // --- 5. Theme Toggle Logic ---
  function initThemeToggle() {
    const themeButtons = document.querySelectorAll('.theme-toggle-btn');
    const updateIcons = (theme) => {
      themeButtons.forEach(btn => {
        const iconContainer = btn.querySelector('.theme-icon');
        if (iconContainer) {
          iconContainer.innerHTML = theme === 'dark' 
            ? '<i data-lucide="sun" class="w-5 h-5 text-warning"></i>' 
            : '<i data-lucide="moon" class="w-5 h-5"></i>';
        }
        btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      });
      initLucide();
    };

    updateIcons(document.documentElement.getAttribute('data-theme'));

    themeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('verdant_theme', newTheme);
        updateIcons(newTheme);

        showToast(
          newTheme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled',
          'info'
        );
      });
    });
  }

  // --- 6. RTL / LTR Direction Toggle Logic ---
  function initDirToggle() {
    const dirButtons = document.querySelectorAll('.dir-toggle-btn');
    const updateLabels = (dir) => {
      dirButtons.forEach(btn => {
        const textSpan = btn.querySelector('.dir-label');
        if (textSpan) {
          textSpan.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
        }
        btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
      });
    };

    updateLabels(document.documentElement.getAttribute('dir'));

    dirButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentDir = document.documentElement.getAttribute('dir');
        const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';

        document.documentElement.setAttribute('dir', newDir);
        document.documentElement.setAttribute('lang', newDir === 'rtl' ? 'ar' : 'en');
        localStorage.setItem('verdant_dir', newDir);
        updateLabels(newDir);

        showToast(
          newDir === 'rtl' ? 'RTL Layout Activated' : 'LTR Layout Activated',
          'info'
        );

        // Re-dispatch resize event to update swipers/charts if present
        window.dispatchEvent(new Event('resize'));
      });
    });
  }

  // --- 7. Sticky Header ---
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 25) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // --- 8. Active Nav Link ---
  function initActiveNav() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';

    const navLinks = document.querySelectorAll('.nav-link-custom, .dropdown-item-custom');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === page || (page === '' && href === 'index.html'))) {
        link.classList.add('active');
        // If inside dropdown, highlight parent toggle too
        const parentDropdown = link.closest('.dropdown');
        if (parentDropdown) {
          const toggle = parentDropdown.querySelector('.dropdown-toggle');
          if (toggle) toggle.classList.add('active');
        }
      }
    });
  }

  // --- 9. Mobile Nav offcanvas closure ---
  function initMobileNav() {
    const offcanvasEl = document.getElementById('mobileNavDrawer');
    if (!offcanvasEl) return;

    const navLinks = offcanvasEl.querySelectorAll('a[href]:not([data-bs-toggle])');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (bsOffcanvas) bsOffcanvas.hide();
      });
    });
  }

  // --- 10. Animated Numerical Counters ---
  function initCounters() {
    const counters = document.querySelectorAll('.counter-value');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = +counter.getAttribute('data-target');
          const duration = 2000;
          const start = 0;
          const startTime = performance.now();

          const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);

            counter.textContent = current.toLocaleString();

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              counter.textContent = target.toLocaleString();
            }
          };

          requestAnimationFrame(updateCount);
          obs.unobserve(counter);
        }
      });
    }, { threshold: 0.2 });

    counters.forEach(c => observer.observe(c));
  }

  // --- 11. User Session Status in Header ---
  function initUserSession() {
    const currentUser = JSON.parse(localStorage.getItem('verdant_active_user'));
    const authContainers = document.querySelectorAll('.auth-nav-slot');

    authContainers.forEach(container => {
      if (currentUser && currentUser.name) {
        container.innerHTML = `
          <div class="dropdown">
            <button class="btn btn-outline-custom dropdown-toggle py-1 px-3" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="font-size: 0.88rem;">
              <i data-lucide="user-check" style="width: 16px; height: 16px; color: var(--color-secondary);"></i>
              <span>${escapeHtml(currentUser.name.split(' ')[0])}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-custom dropdown-menu-end">
              <li class="px-3 py-2 border-bottom border-light">
                <small class="text-muted d-block">Signed in as</small>
                <strong class="d-block text-truncate" style="max-width: 200px;">${escapeHtml(currentUser.email || currentUser.name)}</strong>
              </li>
              <li>
                <a class="dropdown-item dropdown-item-custom text-danger" href="#" id="btnLogoutAction">
                  <i data-lucide="log-out" style="width: 16px; height: 16px;"></i>
                  <span>Sign Out</span>
                </a>
              </li>
            </ul>
          </div>
        `;

        const btnLogout = container.querySelector('#btnLogoutAction');
        if (btnLogout) {
          btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('verdant_active_user');
            showToast('You have been signed out.', 'info');
            setTimeout(() => {
              window.location.href = 'index.html';
            }, 600);
          });
        }
      } else {
        container.innerHTML = `
          <a href="login.html" class="btn btn-outline-custom py-2 px-3" style="font-size: 0.88rem;">
            <i data-lucide="log-in" style="width: 16px; height: 16px;"></i>
            <span>Client Portal</span>
          </a>
        `;
      }
    });

    initLucide();
  }

  // --- 12. Global Toast Notification System ---
  window.showToast = function (message, type = 'success') {
    let container = document.querySelector('.toast-container-custom');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container-custom';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    
    let iconName = 'check-circle-2';
    let iconColor = 'text-success';
    if (type === 'error') {
      iconName = 'alert-triangle';
      iconColor = 'text-danger';
    } else if (type === 'info') {
      iconName = 'info';
      iconColor = 'text-primary';
    }

    toast.innerHTML = `
      <i data-lucide="${iconName}" class="${iconColor}" style="width: 20px; height: 20px; flex-shrink: 0;"></i>
      <span style="font-size: 0.9rem; font-weight: 500;">${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);
    initLucide();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  };

  function escapeHtml(string) {
    if (!string) return '';
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
      })[s];
    });
  }

  window.escapeHtml = escapeHtml;

})();
