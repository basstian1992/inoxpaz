/* ==========================================================================
   INOXPAZ SpA - Motor Interactivo Vanguardista
   Canvas de Chispas TIG/MIG, Filtrado de Servicios, Modal RFQ, Lightbox & WhatsApp
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initWeldingCanvas();
  initMobileMenu();
  initServiceFilters();
  initModalRFQ();
  initProjectLightbox();
  initFormHandlers();
  initStatCounters();
});

/* --------------------------------------------------------------------------
   1. Canvas de Chispas de Soldadura (Welding Arc Sparks Simulation)
   -------------------------------------------------------------------------- */
function initWeldingCanvas() {
  const canvas = document.getElementById('welding-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, active: false };

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  // Spark Particle Class
  class Spark {
    constructor(x, y, isElectricArc = false) {
      this.reset(x, y, isElectricArc);
    }

    reset(x, y, isElectricArc) {
      this.x = x !== undefined ? x : (width * 0.7) + (Math.random() * 80 - 40);
      this.y = y !== undefined ? y : (height * 0.3) + (Math.random() * 60 - 30);

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed + 0.5;

      this.size = Math.random() * 2.2 + 0.8;
      this.alpha = 1;
      this.decay = Math.random() * 0.025 + 0.015;

      const roll = Math.random();
      if (roll > 0.6) {
        this.color = 'rgba(0, 229, 255, '; // Electric Cyan
      } else if (roll > 0.3) {
        this.color = 'rgba(0, 163, 255, '; // Arc Blue
      } else {
        this.color = 'rgba(245, 158, 11, '; // Molten Amber
      }
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.04;
      this.alpha -= this.decay;

      if (this.alpha <= 0) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color + '1)';
      ctx.fill();
      ctx.restore();
    }
  }

  const particleCount = 45;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Spark());
  }

  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  canvas.parentElement.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const flareX = width * 0.7;
    const flareY = height * 0.3;
    const gradient = ctx.createRadialGradient(flareX, flareY, 5, flareX, flareY, 140);
    const flareIntensity = 0.06 + Math.sin(Date.now() * 0.008) * 0.03;
    gradient.addColorStop(0, `rgba(0, 229, 255, ${flareIntensity * 1.5})`);
    gradient.addColorStop(0.5, `rgba(0, 163, 255, ${flareIntensity})`);
    gradient.addColorStop(1, 'rgba(6, 9, 19, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   2. Menú Móvil Responsivo
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!btn || !menu) return;

  function toggleMenu(show) {
    if (show) {
      menu.classList.remove('hidden');
      setTimeout(() => {
        menu.classList.remove('opacity-0');
        menu.classList.add('opacity-100');
      }, 10);
      document.body.style.overflow = 'hidden';
    } else {
      menu.classList.remove('opacity-100');
      menu.classList.add('opacity-0');
      setTimeout(() => {
        menu.classList.add('hidden');
        document.body.style.overflow = '';
      }, 250);
    }
  }

  btn.addEventListener('click', () => toggleMenu(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));
  links.forEach(l => l.addEventListener('click', () => toggleMenu(false)));
}

/* --------------------------------------------------------------------------
   3. Filtrado Interactivo de Servicios Especializados
   -------------------------------------------------------------------------- */
function initServiceFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  if (!filterBtns.length || !serviceCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. Modal de Cotización Técnica (RFQ)
   -------------------------------------------------------------------------- */
function initModalRFQ() {
  const openBtns = document.querySelectorAll('[data-open-rfq]');
  const modal = document.getElementById('rfq-modal');
  const closeBtn = document.getElementById('rfq-modal-close');
  const overlay = document.getElementById('rfq-modal-overlay');

  if (!modal) return;

  function openModal(defaultService = '') {
    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.remove('opacity-0', 'pointer-events-none');
      const box = modal.querySelector('.modal-content');
      if (box) box.classList.remove('scale-95');
    }, 10);
    document.body.style.overflow = 'hidden';

    if (defaultService) {
      const select = document.getElementById('rfq-service-select');
      if (select) select.value = defaultService;
    }
  }

  function closeModal() {
    modal.classList.add('opacity-0', 'pointer-events-none');
    const box = modal.querySelector('.modal-content');
    if (box) box.classList.add('scale-95');
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }, 250);
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || '';
      openModal(service);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   5. Lightbox para Galería de Casos Reales
   -------------------------------------------------------------------------- */
function initProjectLightbox() {
  const projectCards = document.querySelectorAll('.project-card');
  const lightbox = document.getElementById('project-lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbTitle = document.getElementById('lightbox-title');
  const lbDesc = document.getElementById('lightbox-desc');
  const lbClose = document.getElementById('lightbox-close');
  const lbOverlay = document.getElementById('lightbox-overlay');

  if (!lightbox || !projectCards.length) return;

  function openLightbox(imgSrc, title, desc) {
    if (lbImg) lbImg.src = imgSrc;
    if (lbTitle) lbTitle.textContent = title;
    if (lbDesc) lbDesc.textContent = desc;

    lightbox.classList.remove('hidden');
    setTimeout(() => {
      lightbox.classList.remove('opacity-0', 'pointer-events-none');
    }, 10);
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
      lightbox.classList.add('hidden');
      document.body.style.overflow = '';
    }, 250);
  }

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img')?.src || '';
      const title = card.getAttribute('data-title') || 'Proyecto INOXPAZ SpA';
      const desc = card.getAttribute('data-desc') || 'Fabricación y montaje industrial bajo estándares certificados.';
      openLightbox(img, title, desc);
    });
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbOverlay) lbOverlay.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   6. Generador Automático de Solicitudes vía WhatsApp y Formulario
   -------------------------------------------------------------------------- */
function initFormHandlers() {
  const rfqForm = document.getElementById('rfq-form');
  const mainContactForm = document.getElementById('main-contact-form');

  if (rfqForm) {
    rfqForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rfq-name')?.value || 'No especificado';
      const company = document.getElementById('rfq-company')?.value || 'No especificada';
      const phone = document.getElementById('rfq-phone')?.value || 'No especificado';
      const service = document.getElementById('rfq-service-select')?.value || 'Consulta General';
      const material = document.getElementById('rfq-material')?.value || 'No especificado';
      const urgency = document.getElementById('rfq-urgency')?.value || 'Normal';
      const details = document.getElementById('rfq-details')?.value || 'Sin detalles';

      const waText =
        `*SOLICITUD DE COTIZACIÓN TÉCNICA - INOXPAZ SpA*
----------------------------------------
*Cliente:* ${name}
*Empresa:* ${company}
*Teléfono / Contacto:* ${phone}
*Servicio Requerido:* ${service}
*Material:* ${material}
*Nivel de Urgencia:* ${urgency}
*Detalles del Proyecto:*
${details}
----------------------------------------
_Enviado desde el sitio web oficial inoxpaz.cl_`;

      const encoded = encodeURIComponent(waText);
      window.open(`https://wa.me/56954202466?text=${encoded}`, '_blank');
    });
  }

  if (mainContactForm) {
    mainContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value || '';
      const company = document.getElementById('contact-company')?.value || '';
      const email = document.getElementById('contact-email')?.value || '';
      const phone = document.getElementById('contact-phone')?.value || '';
      const service = document.getElementById('contact-service')?.value || '';
      const message = document.getElementById('contact-message')?.value || '';

      const waText =
        `*NUEVA CONSULTA TÉCNICA - INOXPAZ SpA*
----------------------------------------
*Nombre:* ${name}
*Empresa:* ${company}
*Correo:* ${email}
*Teléfono:* ${phone}
*Servicio:* ${service}
*Mensaje:* ${message}
----------------------------------------
_Enviado desde el sitio web oficial inoxpaz.cl_`;

      const encoded = encodeURIComponent(waText);
      window.open(`https://wa.me/56954202466?text=${encoded}`, '_blank');

      const successFeedback = document.getElementById('contact-success-msg');
      if (successFeedback) {
        successFeedback.classList.remove('hidden');
        mainContactForm.reset();
      }
    });
  }
}

/* --------------------------------------------------------------------------
   7. Animación de Métricas Clave (Count Up)
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const statElements = document.querySelectorAll('[data-counter-target]');
  if (!statElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-counter-target'), 10);
        const suffix = el.getAttribute('data-counter-suffix') || '';
        const prefix = el.getAttribute('data-counter-prefix') || '';
        let start = 0;
        const duration = 1500;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = target / steps;

        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            el.textContent = `${prefix}${target}${suffix}`;
            clearInterval(timer);
          } else {
            el.textContent = `${prefix}${Math.floor(start)}${suffix}`;
          }
        }, stepTime);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statElements.forEach(el => observer.observe(el));
}
