// Mobile menu
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const header = document.querySelector('.site-header');

function closeNav() {
  if (nav) {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  }
}

if (toggle && nav) {
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!header?.contains(e.target)) {
      closeNav();
    }
  });

  // Prevent menu from closing when clicking inside nav
  nav.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// Enhanced Smooth Scroll
function smoothScrollTo(target, offset = 0) {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return;
  
  const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
  const targetPosition = element.offsetTop - headerHeight - offset;
  
  // Use native smooth scrolling if supported, otherwise fallback
  if ('scrollBehavior' in document.documentElement.style) {
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  } else {
    // Fallback for older browsers
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let start = null;
    
    function animation(currentTime) {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function (ease-out)
      const ease = 1 - Math.pow(1 - progress, 3);
      
      window.scrollTo(0, startPosition + distance * ease);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }
    
    requestAnimationFrame(animation);
  }
}

// Enhanced smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    
    if (target) {
      e.preventDefault();
      
      // Close mobile menu if open
      nav?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
      
      // Smooth scroll with offset
      smoothScrollTo(target, 20);
    }
  });
});

// Smooth scroll for buttons and other elements
document.querySelectorAll('[data-scroll-to]').forEach(element => {
  element.addEventListener('click', e => {
    const target = element.getAttribute('data-scroll-to');
    const targetElement = document.querySelector(target);
    
    if (targetElement) {
      e.preventDefault();
      smoothScrollTo(targetElement, 20);
    }
  });
});

// Modal: open on "Click to View"
const modal = document.getElementById('enquiry-modal');

function openModal() {
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  // focus first input
  const first = modal.querySelector('input[name="name"]');
  first?.focus();
}
function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

// Unlock buttons removed - forms submit directly to form.php

// Also open modal from Feature Spotlight CTA
document.querySelectorAll('.enquire-open').forEach(btn => {
  btn.addEventListener('click', () => openModal());
});

// Close on backdrop or X
modal?.addEventListener('click', (e) => {
  if ((e.target instanceof Element) && e.target.hasAttribute('data-close')) {
    closeModal();
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Forms will submit directly to form.php - no JavaScript handling needed

// Footer year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Scroll to Top Button
const scrollToTopBtn = document.getElementById('scroll-to-top');

if (scrollToTopBtn) {
  // Show/hide button based on scroll position
  function toggleScrollToTop() {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  }

  // Scroll to top functionality
  scrollToTopBtn.addEventListener('click', () => {
    smoothScrollTo('body', 0);
  });

  // Listen for scroll events
  window.addEventListener('scroll', toggleScrollToTop);
  
  // Initial check
  toggleScrollToTop();
}

// Enhanced mobile scroll behavior
function enhanceMobileScroll() {
  // Only prevent overscroll bounce on specific carousel elements, not the entire body
  document.querySelectorAll('.carousel-viewport, .amenities-viewport').forEach(viewport => {
    viewport.addEventListener('touchmove', function(e) {
      // Allow normal scrolling within carousels, only prevent overscroll
      const scrollTop = viewport.scrollTop;
      const scrollHeight = viewport.scrollHeight;
      const clientHeight = viewport.clientHeight;
      
      // Prevent overscroll at top
      if (scrollTop <= 0 && e.touches[0].clientY > e.touches[0].clientY) {
        e.preventDefault();
      }
      // Prevent overscroll at bottom
      if (scrollTop >= scrollHeight - clientHeight && e.touches[0].clientY < e.touches[0].clientY) {
        e.preventDefault();
      }
    }, { passive: false });
  });
  
  // Smooth scroll for mobile navigation with better touch handling
  if ('ontouchstart' in window) {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('touchend', (e) => {
        const href = link.getAttribute('href');
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          smoothScrollTo(target, 10); // Smaller offset for mobile
        }
      });
    });
  }
}

// Initialize mobile enhancements
enhanceMobileScroll();

// FAQ Accordion Functionality
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other FAQ items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}

// Initialize FAQ when DOM is loaded
document.addEventListener('DOMContentLoaded', initFAQ);

// Gallery Carousel (vanilla JS)
(function initCarousel(){
  const root = document.querySelector('.carousel');
  if (!root) return;

  const track = root.querySelector('.carousel-track');
  const slides = Array.from(track.querySelectorAll('.slide'));
  const prev = root.querySelector('.carousel-arrow.prev');
  const next = root.querySelector('.carousel-arrow.next');
  const dotsWrap = root.querySelector('.carousel-dots');
  const thumbs = Array.from(root.querySelectorAll('.carousel-thumbs .thumb'));
  const autoplay = root.getAttribute('data-autoplay') === 'true';
  const intervalMs = Number(root.getAttribute('data-interval')) || 4500;

  // Build dots
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Go to slide ${i+1}`);
    if (i === 0) b.classList.add('is-active');
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(dotsWrap.children);

  let index = 0;
  let timer = null;

  function setActive(i){
    index = (i + slides.length) % slides.length;
    slides.forEach((s, j) => s.classList.toggle('is-active', j === index));
    dots.forEach((d, j) => d.classList.toggle('is-active', j === index));
    thumbs.forEach((t, j) => t.classList.toggle('is-active', j === index));
  }

  function nextSlide(){ setActive(index + 1); }
  function prevSlide(){ setActive(index - 1); }

  next?.addEventListener('click', nextSlide);
  prev?.addEventListener('click', prevSlide);
  dots.forEach((d, i) => d.addEventListener('click', () => setActive(i)));
  thumbs.forEach((t, i) => t.addEventListener('click', () => setActive(i)));

  // Autoplay with pause on hover
  function start(){ if (!autoplay) return; stop(); timer = setInterval(nextSlide, intervalMs); }
  function stop(){ if (timer) clearInterval(timer); timer = null; }
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  start();

  // Swipe support
  let startX = 0, dx = 0, isDown = false;
  const vp = root.querySelector('.carousel-viewport');
  vp.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; isDown = true; stop(); }, {passive: true});
  vp.addEventListener('touchmove', (e) => { if (!isDown) return; dx = e.touches[0].clientX - startX; }, {passive: true});
  vp.addEventListener('touchend', () => {
    if (Math.abs(dx) > 40) { dx < 0 ? nextSlide() : prevSlide(); }
    isDown = false; dx = 0; start();
  });
})();

// Amenities Carousel
(function initAmenitiesCarousel(){
  const root = document.querySelector('.amenities-slider');
  if (!root) return;

  const track = root.querySelector('.amenities-track');
  const slides = Array.from(track.querySelectorAll('.amenity-slide'));
  const prev = root.querySelector('.amenities-arrow.prev');
  const next = root.querySelector('.amenities-arrow.next');
  const dotsWrap = root.querySelector('.amenities-dots');
  const autoplay = root.getAttribute('data-autoplay') === 'true';
  const intervalMs = Number(root.getAttribute('data-interval')) || 5000;

  // Build dots
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Go to amenity ${i+1}`);
    if (i === 0) b.classList.add('is-active');
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(dotsWrap.children);

  let index = 0;
  let timer = null;

  function setActive(i){
    index = (i + slides.length) % slides.length;
    
    // Remove all classes
    slides.forEach(s => s.classList.remove('is-active', 'is-prev', 'is-next'));
    dots.forEach(d => d.classList.remove('is-active'));
    
    // Set active
    slides[index].classList.add('is-active');
    dots[index].classList.add('is-active');
    
    // Set prev/next for partial visibility with blur
    const prevIndex = (index - 1 + slides.length) % slides.length;
    const nextIndex = (index + 1) % slides.length;
    slides[prevIndex].classList.add('is-prev');
    slides[nextIndex].classList.add('is-next');
    
    // No transform needed - using flexbox order instead
  }

  function nextSlide(){ setActive(index + 1); }
  function prevSlide(){ setActive(index - 1); }

  next?.addEventListener('click', nextSlide);
  prev?.addEventListener('click', prevSlide);
  dots.forEach((d, i) => d.addEventListener('click', () => setActive(i)));

  // Mobile arrows
  const mobileNext = root.querySelector('.amenities-arrow.next.mobile');
  const mobilePrev = root.querySelector('.amenities-arrow.prev.mobile');
  mobileNext?.addEventListener('click', nextSlide);
  mobilePrev?.addEventListener('click', prevSlide);

  // Autoplay with pause on hover
  function start(){ if (!autoplay) return; stop(); timer = setInterval(nextSlide, intervalMs); }
  function stop(){ if (timer) clearInterval(timer); timer = null; }
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  
  // Initialize
  setActive(0);
  start();

  // Swipe support
  let startX = 0, dx = 0, isDown = false;
  const vp = root.querySelector('.amenities-viewport');
  vp.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; isDown = true; stop(); }, {passive: true});
  vp.addEventListener('touchmove', (e) => { if (!isDown) return; dx = e.touches[0].clientX - startX; }, {passive: true});
  vp.addEventListener('touchend', () => {
    if (Math.abs(dx) > 40) { dx < 0 ? nextSlide() : prevSlide(); }
    isDown = false; dx = 0; start();
  });
})();
