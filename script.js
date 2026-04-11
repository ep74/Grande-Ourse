/* ============================================
   GRANDE OURSE — Script
   Canvas étoilé · Scroll reveal · Navigation
   ============================================ */

(function () {
  'use strict';

  // ---- Starfield Canvas ----
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let width, height;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createStars(count) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.2,
        opacity: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.005 + 0.00125,
        twinkleOffset: Math.random() * Math.PI * 2,
        // Some stars are "blue-ish", some "warm"
        hue: Math.random() > 0.7 ? 210 + Math.random() * 40 : 40 + Math.random() * 20,
        saturation: Math.random() > 0.7 ? 60 : 10,
      });
    }
  }

  function drawStars(time) {
    ctx.clearRect(0, 0, width, height);

    for (const star of stars) {
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
      const alpha = star.opacity * (0.6 + 0.4 * twinkle);
      const r = star.radius * (0.8 + 0.2 * twinkle);

      ctx.beginPath();
      ctx.arc(star.x, star.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${star.hue}, ${star.saturation}%, 90%, ${alpha})`;
      ctx.fill();

      // Glow for brighter stars
      if (star.radius > 1.2) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, r * 3, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, r * 3);
        grad.addColorStop(0, `hsla(${star.hue}, ${star.saturation}%, 90%, ${alpha * 0.3})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fill();
      }
    }
  }

  // Draw the Big Dipper constellation faintly
  function drawConstellation(time) {
    // Big Dipper — accurate positions matching the real constellation
    // Handle extends from lower-left, bowl (casserole) on upper-right
    const constellation = [
      { x: 0.62, y: 0.12 },  // 0 — α Dubhe  (bowl top-right)
      { x: 0.65, y: 0.24 },  // 1 — β Merak  (bowl bottom-right)
      { x: 0.51, y: 0.26 },  // 2 — γ Phecda (bowl bottom-left)
      { x: 0.49, y: 0.15 },  // 3 — δ Megrez (bowl top-left / handle junction)
      { x: 0.37, y: 0.19 },  // 4 — ε Alioth (handle middle)
      { x: 0.26, y: 0.22 },  // 5 — ζ Mizar  (handle upper)
      { x: 0.14, y: 0.30 },  // 6 — η Alkaid (handle tip, far left)
    ];

    const points = constellation.map(p => ({
      x: p.x * width,
      y: p.y * height
    }));

    // Draw connecting lines
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.12)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    // Bowl (α → β → γ → δ → α)
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.lineTo(points[3].x, points[3].y);
    ctx.lineTo(points[0].x, points[0].y); // close bowl
    // Handle (δ → ε → ζ → η)
    ctx.moveTo(points[3].x, points[3].y);
    ctx.lineTo(points[4].x, points[4].y);
    ctx.lineTo(points[5].x, points[5].y);
    ctx.lineTo(points[6].x, points[6].y);
    ctx.stroke();

    // Draw constellation stars (brighter)
    for (const p of points) {
      const pulse = 0.8 + 0.2 * Math.sin(time * 0.01);
      // Glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 6);
      grad.addColorStop(0, `rgba(212, 175, 55, ${0.4 * pulse})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fill();
      // Core
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240, 220, 130, ${0.9 * pulse})`;
      ctx.fill();
    }

    // Polaris — found by extending Merak (β) → Dubhe (α) line ~5× distance
    // Direction vector from β to α, extended above the bowl
    const dx = points[0].x - points[1].x;
    const dy = points[0].y - points[1].y;
    const polaris = {
      x: points[0].x + dx * 3.5,
      y: points[0].y + dy * 3.5
    };
    const polarisPulse = 0.7 + 0.3 * Math.sin(time * 0.015);

    // Faint guide line from Dubhe to Polaris
    ctx.strokeStyle = `rgba(212, 175, 55, ${0.06 * polarisPulse})`;
    ctx.lineWidth = 0.5;
    ctx.setLineDash([4, 8]);
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(polaris.x, polaris.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Large glow
    ctx.beginPath();
    ctx.arc(polaris.x, polaris.y, 20, 0, Math.PI * 2);
    const pGrad = ctx.createRadialGradient(polaris.x, polaris.y, 0, polaris.x, polaris.y, 20);
    pGrad.addColorStop(0, `rgba(212, 175, 55, ${0.5 * polarisPulse})`);
    pGrad.addColorStop(0.4, `rgba(212, 175, 55, ${0.15 * polarisPulse})`);
    pGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = pGrad;
    ctx.fill();

    // Core
    ctx.beginPath();
    ctx.arc(polaris.x, polaris.y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 240, 180, ${polarisPulse})`;
    ctx.fill();

    // Cross rays
    ctx.strokeStyle = `rgba(212, 175, 55, ${0.15 * polarisPulse})`;
    ctx.lineWidth = 0.5;
    const rayLen = 14;
    ctx.beginPath();
    ctx.moveTo(polaris.x - rayLen, polaris.y);
    ctx.lineTo(polaris.x + rayLen, polaris.y);
    ctx.moveTo(polaris.x, polaris.y - rayLen);
    ctx.lineTo(polaris.x, polaris.y + rayLen);
    ctx.stroke();
  }

  let animFrame;
  function animate(time) {
    drawStars(time);
    drawConstellation(time);
    animFrame = requestAnimationFrame(animate);
  }

  function initStarfield() {
    resizeCanvas();
    const count = Math.min(Math.floor(width * height / 3000), 600);
    createStars(count);
    if (animFrame) cancelAnimationFrame(animFrame);
    animFrame = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    initStarfield();
  });

  initStarfield();

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });

  // ---- Mobile nav toggle ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ---- Scroll reveal with IntersectionObserver ----
  const revealElements = document.querySelectorAll('.r');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('v');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Smooth scroll for anchor links (fallback) ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();

// ---- Email Protection Against Bots ----
document.addEventListener('DOMContentLoaded', function() {
  const emailLinks = document.querySelectorAll('.email-link');
  emailLinks.forEach(link => {
    const email = link.dataset.email + '@' + link.dataset.domain;
    link.href = 'mailto:' + email;
    link.querySelector('.email-text').textContent = email;
  });
});
