/**
 * ELEVATEXMEDIA — Master Frontend Engine
 * Modern, accessible, responsive interactions & robust form handling
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initHeaderScroll();
  initMobileNav();
  initScrollReveal();
  initActiveNav();
  initServiceSelectors();
  initFaqAccordion();
  initConsultationForm();
  initBackToTop();
  initStudioClock();
  initHeroVideo();
});

/* --------------------------------------------------------------------------
   01. SCROLL PROGRESS INDICATOR
-------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   02. HEADER SCROLL EFFECT
-------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   03. RESPONSIVE MOBILE NAVIGATION DRAWER
-------------------------------------------------------------------------- */
function initMobileNav() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-close-btn');
  const drawer = document.getElementById('mobile-nav');
  const backdrop = document.getElementById('mobile-nav-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!menuBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    menuBtn.classList.add('active');
    menuBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    if (backdrop) backdrop.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    menuBtn.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    if (backdrop) backdrop.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  };

  menuBtn.addEventListener('click', () => {
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   04. INTERSECTION OBSERVER SCROLL REVEALS
-------------------------------------------------------------------------- */
function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal');
  
  if (!revealElements.length) return;

  if (prefersReducedMotion) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.05,
    rootMargin: '0px 0px -10px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   05. ACTIVE NAVIGATION LINK HIGHLIGHTING
-------------------------------------------------------------------------- */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-25% 0px -65% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

/* --------------------------------------------------------------------------
   06. SERVICE SELECTOR & DIRECT INQUIRY LINKING
-------------------------------------------------------------------------- */
function initServiceSelectors() {
  const serviceButtons = document.querySelectorAll('.service-cta-btn, [data-select-service]');
  const servicePills = document.querySelectorAll('.pill-option');
  const serviceInput = document.getElementById('selected-service-input');
  const contactSection = document.getElementById('contact');

  // Pill click handler inside form
  servicePills.forEach(pill => {
    pill.addEventListener('click', () => {
      servicePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (serviceInput) {
        serviceInput.value = pill.getAttribute('data-value');
      }
    });
  });

  // Quick link from service cards / footer
  serviceButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetService = btn.getAttribute('data-target-service') || btn.getAttribute('data-select-service');
      
      if (targetService) {
        // Activate matching pill
        let matched = false;
        servicePills.forEach(pill => {
          const pillVal = pill.getAttribute('data-value');
          if (pillVal === targetService || targetService.toLowerCase().includes(pillVal.toLowerCase())) {
            pill.classList.add('active');
            matched = true;
          } else {
            pill.classList.remove('active');
          }
        });

        if (serviceInput && targetService) {
          serviceInput.value = targetService;
        }
      }

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const nameInput = document.getElementById('client-name');
          if (nameInput) nameInput.focus();
        }, 500);
      }
    });
  });
}













/* --------------------------------------------------------------------------
   09. FAQ ACCORDION INTERACTION (ACCESSIBLE)
-------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item, index) => {
    const questionBtn = item.querySelector('.faq-question');
    const answerDiv = item.querySelector('.faq-answer');
    if (!questionBtn || !answerDiv) return;

    const answerId = `faq-answer-${index + 1}`;
    answerDiv.id = answerId;
    questionBtn.setAttribute('aria-controls', answerId);

    questionBtn.addEventListener('click', () => {
      const isExpanded = questionBtn.getAttribute('aria-expanded') === 'true';

      // Close all other accordions
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherBtn = otherItem.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isExpanded) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      } else {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   10. WEB3FORMS CONSULTATION FORM INTEGRATION & HONEST FALLBACK ENGINE
-------------------------------------------------------------------------- */
function initConsultationForm() {
  const form = document.getElementById('consultation-form');
  const submitBtn = document.getElementById('submit-btn');
  const successCard = document.getElementById('form-success-state');
  const errorCard = document.getElementById('form-error-state');
  const fallbackCard = document.getElementById('form-fallback-state');
  const resetBtn = document.getElementById('reset-form-btn');
  const retryBtn = document.getElementById('retry-form-btn');

  if (!form || !submitBtn) return;

  // Web3Forms official submission endpoint & configuration
  const web3formsEndpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT || 'https://api.web3forms.com/submit';
  const web3formsAccessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
  const targetEmail = import.meta.env.VITE_CONTACT_EMAIL || 'hello@elevatexmedia.com';

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const clearErrors = () => {
    const errorGroups = form.querySelectorAll('.form-group.has-error');
    errorGroups.forEach(group => group.classList.remove('has-error'));
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const nameInput = document.getElementById('client-name');
    const emailInput = document.getElementById('client-email');
    const phoneInput = document.getElementById('client-phone');
    const companyInput = document.getElementById('client-company');
    const serviceInput = document.getElementById('selected-service-input');
    const budgetSelect = document.getElementById('client-budget');
    const messageInput = document.getElementById('client-message');

    let isValid = true;

    if (!nameInput.value.trim()) {
      nameInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    if (!validateEmail(emailInput.value.trim())) {
      emailInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    if (!isValid) {
      const firstError = form.querySelector('.form-group.has-error input');
      if (firstError) firstError.focus();
      return;
    }

    // Build Web3Forms structured submission payload
    const payload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      service: serviceInput ? serviceInput.value : 'General Growth Inquiry',
      budget: budgetSelect ? budgetSelect.value : 'To Be Discussed',
      message: messageInput ? messageInput.value.trim() : 'Consultation requested',
      subject: 'New ElevateXMedia Client Enquiry',
      from_name: 'ElevateXMedia Consultation Portal'
    };

    if (phoneInput && phoneInput.value.trim()) {
      payload.phone = phoneInput.value.trim();
    }

    if (companyInput && companyInput.value.trim()) {
      payload.company = companyInput.value.trim();
    }

    // Case 1: Web3Forms access key is configured in environment
    if (web3formsAccessKey && web3formsAccessKey.trim() !== '') {
      payload.access_key = web3formsAccessKey.trim();

      // Loading state: disable button to prevent duplicate submissions
      submitBtn.classList.add('loading');
      submitBtn.setAttribute('disabled', 'true');

      try {
        const response = await fetch(web3formsEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json().catch(() => ({}));

        submitBtn.classList.remove('loading');
        submitBtn.removeAttribute('disabled');

        if (response.ok && data.success === true) {
          // Success confirmed by Web3Forms
          form.style.display = 'none';
          if (errorCard) errorCard.style.display = 'none';
          if (fallbackCard) fallbackCard.style.display = 'none';
          if (successCard) {
            const clientNameSpan = document.getElementById('success-client-name');
            const serviceTagSpan = document.getElementById('success-service-tag');
            if (clientNameSpan) clientNameSpan.textContent = payload.name;
            if (serviceTagSpan) serviceTagSpan.textContent = payload.service;
            successCard.style.display = 'block';
            successCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          // Clear inputs on genuine delivery success
          form.reset();
          clearErrors();
        } else {
          // Unsuccessful response from Web3Forms: retain visitor input for retry
          console.error('Web3Forms returned unsuccessful response:', data);
          showFormError(data.message || 'Submission was rejected by the form service.');
        }
      } catch (err) {
        console.error('Network error during Web3Forms submission:', err);
        submitBtn.classList.remove('loading');
        submitBtn.removeAttribute('disabled');
        showFormError('Network error or connection timed out.');
      }
    } else {
      // Case 2: No Web3Forms access key configured yet
      // Provide honest email-client fallback without falsely claiming backend delivery
      submitBtn.classList.add('loading');
      submitBtn.setAttribute('disabled', 'true');

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.removeAttribute('disabled');

        form.style.display = 'none';
        if (errorCard) errorCard.style.display = 'none';
        if (successCard) successCard.style.display = 'none';

        if (fallbackCard) {
          const fallbackNameSpan = document.getElementById('fallback-client-name');
          const emailActionBtn = document.getElementById('fallback-email-btn');

          if (fallbackNameSpan) fallbackNameSpan.textContent = payload.name;

          if (emailActionBtn) {
            const mailSubject = encodeURIComponent(`Project Inquiry: ${payload.service} - ${payload.name}`);
            const mailBody = encodeURIComponent(
              `Hi ElevateXMedia Team,\n\n` +
              `I would like to discuss a project with ElevateXMedia.\n\n` +
              `• Name: ${payload.name}\n` +
              `• Email: ${payload.email}\n` +
              `• Phone: ${payload.phone || 'N/A'}\n` +
              `• Company / Website: ${payload.company || 'N/A'}\n` +
              `• Service: ${payload.service}\n` +
              `• Estimated Investment Tier: ${payload.budget}\n` +
              `• Project Overview:\n${payload.message || 'Ready to discuss on discovery call.'}\n\n` +
              `Best regards,\n${payload.name}`
            );
            emailActionBtn.href = `mailto:${targetEmail}?subject=${mailSubject}&body=${mailBody}`;
          }

          fallbackCard.style.display = 'block';
          fallbackCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 350);
    }
  });

  function showFormError(reasonText) {
    form.style.display = 'none';
    if (successCard) successCard.style.display = 'none';
    if (fallbackCard) fallbackCard.style.display = 'none';
    if (errorCard) {
      const errorReasonSpan = document.getElementById('error-api-reason');
      if (errorReasonSpan && reasonText) {
        errorReasonSpan.textContent = `(${reasonText})`;
      }
      errorCard.style.display = 'block';
      errorCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      clearErrors();
      form.style.display = 'flex';
      if (successCard) successCard.style.display = 'none';
      if (fallbackCard) fallbackCard.style.display = 'none';
      if (errorCard) errorCard.style.display = 'none';
    });
  }

  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      // Retain visitor input for seamless retry
      form.style.display = 'flex';
      if (errorCard) errorCard.style.display = 'none';
    });
  }
}

/* --------------------------------------------------------------------------
   11. BACK TO TOP BUTTON
-------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   12. STUDIO CLOCK & REAL-TIME STATUS (ACTIVE WORLDWIDE)
-------------------------------------------------------------------------- */
function initStudioClock() {
  const timeDisplay = document.getElementById('local-time-display');
  const yearDisplay = document.getElementById('current-year');

  if (yearDisplay) {
    yearDisplay.textContent = new Date().getFullYear();
  }

  if (!timeDisplay) return;

  const updateClock = () => {
    const now = new Date();
    const utcHours = now.getUTCHours().toString().padStart(2, '0');
    const utcMinutes = now.getUTCMinutes().toString().padStart(2, '0');
    timeDisplay.textContent = `Operating Globally • ${utcHours}:${utcMinutes} UTC`;
  };

  updateClock();
  setInterval(updateClock, 30000);
}

/* --------------------------------------------------------------------------
   13. CINEMATIC HERO VIDEO PLAYBACK ENGINE (FAILSAFE AUTOPLAY)
-------------------------------------------------------------------------- */
function initHeroVideo() {
  const video = document.getElementById('hero-video');
  if (!video) return;

  // Enforce browser-compliant muted autoplay flags
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', 'true');
  video.setAttribute('autoplay', '');

  const startPlayback = () => {
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback: start immediately on first user touch, click, scroll or keypress
        const kickstart = () => {
          video.muted = true;
          video.play().catch(() => {});
          ['scroll', 'click', 'touchstart', 'pointerdown', 'keydown'].forEach(evt => {
            window.removeEventListener(evt, kickstart);
          });
        };
        ['scroll', 'click', 'touchstart', 'pointerdown', 'keydown'].forEach(evt => {
          window.addEventListener(evt, kickstart, { once: true, passive: true });
        });
      });
    }
  };

  // Attempt immediate playback
  startPlayback();

  // Also hook into media ready events in case buffer is loading
  video.addEventListener('canplay', () => {
    if (video.paused) startPlayback();
  }, { once: true });

  video.addEventListener('loadeddata', () => {
    if (video.paused) startPlayback();
  }, { once: true });
}
