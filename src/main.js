/**
 * NOVA — Digital Growth Studio
 * Frontend Architecture & Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initHeaderScroll();
  initMobileNav();
  initScrollReveal();
  initActiveNav();
  initServiceSelectors();
  initWorkFilters();
  initCaseStudyModal();
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
    if (window.scrollY > 40) {
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
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
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
    rootMargin: '-30% 0px -60% 0px'
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
          if (pill.getAttribute('data-value') === targetService || 
              targetService.toLowerCase().includes(pill.getAttribute('data-value').toLowerCase())) {
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
        // Focus client name after scroll
        setTimeout(() => {
          const nameInput = document.getElementById('client-name');
          if (nameInput) nameInput.focus();
        }, 600);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   07. SELECTED WORK FILTER BAR
-------------------------------------------------------------------------- */
function initWorkFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   08. CASE STUDY INSPECT MODAL
-------------------------------------------------------------------------- */
const CASE_STUDIES = {
  'modal-aether': {
    badge: 'STUDIO CONCEPT 01',
    title: 'AETHER — High-Sensory Fragrance House',
    meta: 'Luxury E-Commerce • Direct to Consumer • Global Launch Blueprint',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop',
    overview: 'AETHER represents an architectural exercise in luxury digital conversion. The objective was to eliminate the sensory barrier of purchasing high-end niche perfume online without smelling it first.',
    framework: [
      'Interactive Web Experience: 3D procedural bottle explorer with an intuitive olfactory note diagnostic algorithm.',
      'Performance Acquisition: High-aesthetic micro-cinematic Meta & YouTube ads testing 18 narrative hooks around scent longevity.',
      'WhatsApp VIP Concierge: Post-purchase replenishment bot detecting bottle depletion cycles and offering VIP private pre-orders.',
      'Results Model: Engineered for 3.4x higher cart size through bespoke discovery sampling sets.'
    ]
  },
  'modal-kronos': {
    badge: 'STUDIO CONCEPT 02',
    title: 'KRONOS — Independent Precision Timepieces',
    meta: 'Swiss Horology • High-Ticket Direct-to-Consumer Funnel',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop',
    overview: 'Engineered for five-figure luxury timepieces, KRONOS required an acquisition funnel centered on pedigree, horological craftsmanship, and friction-free private consultation booking.',
    framework: [
      'High-Intent Search & Video: Google Search high-intent capture paired with 4K macro movements on YouTube.',
      'VIP Concierge Routing: Dynamic qualification forms filtering serious collectors into private video slots with master watchmakers.',
      'Conversational Follow-up: Encrypted WhatsApp VIP updates with personalized video messages for prospective buyers.',
      'Attribution Rigor: Server-Side Meta Conversions API (CAPI) with custom 90-day offline conversion tracking.'
    ]
  },
  'modal-lumen': {
    badge: 'STUDIO CONCEPT 03',
    title: 'LUMEN — Next-Gen Liquidity Protocol',
    meta: 'Decentralized Finance • Web Engineering • Community Flywheel',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop',
    overview: 'A community-first growth blueprint for modern FinTech and decentralized protocols where user trust, developer documentation, and viral community retention are paramount.',
    framework: [
      'Headless Documentation Portal: Sub-second search, interactive code samples, and real-time protocol TVL streaming.',
      'Telegram Community Bot Engine: Automated anti-spam verification, tier-gated governance discussions, and instant liquidity alert feeds.',
      'Telegram Mini-App (TWA): Lightweight in-chat onboarding allowing users to inspect portfolio balances directly inside Telegram.',
      'Content Flywheel: Educational motion graphics breaking complex financial mechanics into shareable 30s clips.'
    ]
  },
  'modal-velo': {
    badge: 'STUDIO CONCEPT 04',
    title: 'VELO — Urban Electric Performance Superbike',
    meta: 'Clean Mobility • Creator UGC Pipeline • Dealer Showroom Booking',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1200&auto=format&fit=crop',
    overview: 'VELO combines high-energy urban lifestyle branding with automated regional dealer logistics to turn online hype into physical dealership test-drives.',
    framework: [
      'Creator UGC Production: 24 vetted urban cyclists and mobility influencers generating raw POV riding clips.',
      'Paid Whitelisting: Running creator-whitelisted TikTok and Meta Spark Ads targeting local metropolitan commuting corridors.',
      'Automated WhatsApp Booking Bot: In-chat test ride scheduling with automatic geolocation matching to the nearest authorized showroom.',
      'Automated SMS / WhatsApp Reminders: 94% show-up rate achieved through real-time calendar invites and directions.'
    ]
  }
};

function initCaseStudyModal() {
  const modal = document.getElementById('case-study-modal');
  const modalContent = document.getElementById('modal-content');
  const closeBtn = document.getElementById('modal-close-btn');
  const inspectBtns = document.querySelectorAll('.project-inspect-btn');

  if (!modal || !modalContent) return;

  const openModal = (caseId) => {
    const data = CASE_STUDIES[caseId];
    if (!data) return;

    modalContent.innerHTML = `
      <span class="modal-badge">${data.badge}</span>
      <h3 class="modal-title">${data.title}</h3>
      <p class="modal-meta">${data.meta}</p>
      <img src="${data.image}" alt="${data.title}" class="modal-img" />
      <p class="modal-text">${data.overview}</p>
      <h4 class="modal-breakdown-title">Strategic Architecture & Execution</h4>
      <ul class="modal-deliverables">
        ${data.framework.map(item => `<li>${item}</li>`).join('')}
      </ul>
      <div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
        <a href="#contact" class="btn btn-primary btn-sm modal-cta-btn">
          <span>Inquire About Similar Architecture</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.75 12.25L12.25 1.75M12.25 1.75H4.2M12.25 1.75V9.8" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>
        </a>
      </div>
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Hook modal cta
    const modalCta = modalContent.querySelector('.modal-cta-btn');
    if (modalCta) {
      modalCta.addEventListener('click', () => {
        closeModal();
      });
    }
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  inspectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      openModal(modalId);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   09. FAQ ACCORDION INTERACTION
-------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close other accordions
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const btn = otherItem.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard accessibility Enter / Space
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target === item) {
        questionBtn.click();
      }
    });
  });
}

/* --------------------------------------------------------------------------
   10. STRATEGIC CONSULTATION FORM VALIDATION & SIMULATION
-------------------------------------------------------------------------- */
function initConsultationForm() {
  const form = document.getElementById('consultation-form');
  const submitBtn = document.getElementById('submit-btn');
  const successCard = document.getElementById('form-success-state');
  const resetBtn = document.getElementById('reset-form-btn');

  if (!form || !submitBtn || !successCard) return;

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const clearErrors = () => {
    const errorGroups = form.querySelectorAll('.form-group.has-error');
    errorGroups.forEach(group => group.classList.remove('has-error'));
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const nameInput = document.getElementById('client-name');
    const emailInput = document.getElementById('client-email');
    const budgetSelect = document.getElementById('client-budget');
    const messageInput = document.getElementById('client-message');
    const serviceInput = document.getElementById('selected-service-input');

    let isValid = true;

    if (!nameInput.value.trim()) {
      nameInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    if (!validateEmail(emailInput.value.trim())) {
      emailInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    if (!budgetSelect.value) {
      budgetSelect.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    if (!messageInput.value.trim() || messageInput.value.trim().length < 8) {
      messageInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    if (!isValid) return;

    // Simulate submission state
    submitBtn.classList.add('loading');
    submitBtn.setAttribute('disabled', 'true');

    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.removeAttribute('disabled');

      // Populate confirmation details
      const clientNameSpan = document.getElementById('success-client-name');
      const serviceTagSpan = document.getElementById('success-service-tag');
      
      if (clientNameSpan) clientNameSpan.textContent = nameInput.value.trim();
      if (serviceTagSpan) serviceTagSpan.textContent = serviceInput.value || 'Strategic Growth';

      form.style.display = 'none';
      successCard.style.display = 'block';

      // Scroll to confirmation card
      successCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 750);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      clearErrors();
      form.style.display = 'flex';
      successCard.style.display = 'none';
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
   12. STUDIO CLOCK & REAL-TIME STATUS
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
    // Format in London/GMT or client studio time
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Europe/London'
    };
    try {
      const timeString = new Intl.DateTimeFormat('en-GB', options).format(now);
      timeDisplay.textContent = `Studio Time: London ${timeString} GMT`;
    } catch {
      timeDisplay.textContent = `Studio Time: Active Worldwide`;
    }
  };

  updateClock();
  setInterval(updateClock, 1000);
}

/* --------------------------------------------------------------------------
   13. CINEMATIC HERO VIDEO PLAYBACK ENGINE
-------------------------------------------------------------------------- */
function initHeroVideo() {
  const video = document.getElementById('hero-video');
  if (!video) return;

  video.muted = true;
  video.playsInline = true;

  const attemptPlay = () => {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback: start video on first scroll or touch
        const onFirstInteract = () => {
          video.play().catch(() => {});
          window.removeEventListener('scroll', onFirstInteract);
          window.removeEventListener('click', onFirstInteract);
          window.removeEventListener('touchstart', onFirstInteract);
        };
        window.addEventListener('scroll', onFirstInteract, { once: true, passive: true });
        window.addEventListener('click', onFirstInteract, { once: true });
        window.addEventListener('touchstart', onFirstInteract, { once: true, passive: true });
      });
    }
  };

  if (video.readyState >= 2) {
    attemptPlay();
  } else {
    video.addEventListener('canplay', attemptPlay, { once: true });
  }
}
