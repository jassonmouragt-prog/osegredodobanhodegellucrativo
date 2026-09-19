(function () {
  'use strict';

  var doc = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.getElementById('siteHeader');
  var sticky = document.querySelector('.sticky-cta');

  function scrollHandler() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 24);
    if (sticky) {
      var show = y > 560 && window.innerWidth < 900;
      sticky.classList.toggle('is-shown', show);
      document.body.classList.toggle('has-sticky', show);
    }
  }

  window.addEventListener('scroll', scrollHandler, { passive: true });
  scrollHandler();

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (!id || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top: Math.max(top, 0), behavior: reduced ? 'auto' : 'smooth' });
    });
  });

  if (reduced || !('IntersectionObserver' in window)) {
    doc.classList.add('no-anim');
    return;
  }

  doc.classList.add('io-fallback');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      el.classList.add('is-visible');
      if (el.hasAttribute('data-stagger')) {
        Array.prototype.forEach.call(el.children, function (child, i) {
          child.style.transitionDelay = i * 0.08 + 's';
        });
      } else if (el.getAttribute('data-delay')) {
        el.style.setProperty('--d', parseFloat(el.getAttribute('data-delay')) / 10 + 's');
      }
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('[data-reveal], [data-stagger]').forEach(function (el) {
    io.observe(el);
  });
})();
