/* =========================================================
   ARYNCARE — Shared site behaviour
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var links = document.querySelector('.nav-links');
  var overlay = document.querySelector('.nav-overlay');
  function closeNav(){
    if(!links) return;
    links.classList.remove('open');
    toggle && toggle.classList.remove('active');
    overlay && overlay.classList.remove('open');
    toggle && toggle.setAttribute('aria-expanded','false');
  }
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.classList.toggle('active');
      overlay && overlay.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    overlay && overlay.addEventListener('click', closeNav);
    links.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeNav); });
  }

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector('.site-header');
  function onScrollHeader(){
    if (!header) return;
    if (window.scrollY > 12) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Back to top ---------- */
  var topBtn = document.querySelector('.top-float');
  if (topBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) topBtn.classList.add('show');
      else topBtn.classList.remove('show');
    }, { passive: true });
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffixEl = el.querySelector('.suffix');
    var decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'),10) : 0;
    var dur = 1600, start = null;
    var numNode = el.firstChild;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var val = (target * eased).toFixed(decimals);
      el.childNodes[0].nodeValue = val;
      if (progress < 1) requestAnimationFrame(step);
      else el.childNodes[0].nodeValue = target.toFixed(decimals);
    }
    // wrap: ensure first child is a text node
    if (el.childNodes.length === 0 || el.childNodes[0].nodeType !== 3) {
      el.insertBefore(document.createTextNode('0'), el.firstChild);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.setAttribute('role','button');
    q.setAttribute('tabindex','0');
    q.setAttribute('aria-expanded','false');
    function toggleItem(){
      var isOpen = item.classList.contains('open');
      // close siblings within same list
      var list = item.closest('.faq-list');
      if (list) {
        list.querySelectorAll('.faq-item.open').forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove('open');
            openItem.querySelector('.faq-a').style.maxHeight = null;
            openItem.querySelector('.faq-q').setAttribute('aria-expanded','false');
          }
        });
      }
      item.classList.toggle('open', !isOpen);
      q.setAttribute('aria-expanded', String(!isOpen));
      a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : null;
    }
    q.addEventListener('click', toggleItem);
    q.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggleItem(); }
    });
  });

  /* ---------- Testimonial slider ---------- */
  var slider = document.querySelector('.testi-slider');
  if (slider) {
    var track = slider.querySelector('.testi-slides');
    var slides = slider.querySelectorAll('.testi-slide');
    var dotsWrap = slider.querySelector('.testi-nav');
    var idx = 0, timer;
    slides.forEach(function (_, i) {
      var d = document.createElement('button');
      d.className = 'testi-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
      d.addEventListener('click', function () { go(i); reset(); });
      dotsWrap && dotsWrap.appendChild(d);
    });
    function go(i) {
      idx = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (idx * 100) + '%)';
      dotsWrap && dotsWrap.querySelectorAll('.testi-dot').forEach(function (d, di) {
        d.classList.toggle('active', di === idx);
      });
    }
    function reset() { clearInterval(timer); timer = setInterval(function(){ go(idx+1); }, 6000); }
    var prev = slider.querySelector('.testi-arrow.prev');
    var next = slider.querySelector('.testi-arrow.next');
    prev && prev.addEventListener('click', function () { go(idx - 1); reset(); });
    next && next.addEventListener('click', function () { go(idx + 1); reset(); });
    reset();
  }

  /* ---------- Button ripple ---------- */
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var circle = document.createElement('span');
      var size = Math.max(rect.width, rect.height);
      circle.className = 'ripple';
      circle.style.width = circle.style.height = size + 'px';
      circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
      circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(circle);
      setTimeout(function () { circle.remove(); }, 650);
    });
  });

  /* ---------- Forms: client-side validation + success state ---------- */
  document.querySelectorAll('form[data-lead-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var wrap = form.closest('.form-card') || form.parentElement;
      var success = wrap ? wrap.querySelector('.form-success') : null;
      form.style.display = 'none';
      if (success) success.classList.add('show');
      else alert('Thank you! Our team will contact you within 24 hours.');
      form.reset();
    });
  });

  /* ---------- Newsletter forms ---------- */
  document.querySelectorAll('form[data-newsletter]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        input.value = '';
        var btn = form.querySelector('button');
        if (btn) { var t = btn.textContent; btn.textContent = 'Subscribed ✓'; setTimeout(function(){btn.textContent = t;}, 2500); }
      }
    });
  });

  /* ---------- Exit intent popup ---------- */
  var modal = document.querySelector('.modal-overlay');
  if (modal && !sessionStorage.getItem('aryncare_exit_shown')) {
    var triggered = false;
    document.addEventListener('mouseout', function (e) {
      if (triggered) return;
      if (e.clientY < 10 && !e.relatedTarget) {
        triggered = true;
        modal.classList.add('show');
        sessionStorage.setItem('aryncare_exit_shown', '1');
      }
    });
    modal.querySelectorAll('[data-modal-close]').forEach(function (el) {
      el.addEventListener('click', function () { modal.classList.remove('show'); });
    });
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.classList.remove('show'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') modal.classList.remove('show'); });
  }

  /* ---------- Industries filter (Industries page) ---------- */
  var filterBar = document.querySelector('[data-industry-filter]');
  if (filterBar) {
    var cards = document.querySelectorAll('[data-industry-card]');
    filterBar.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBar.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var cat = btn.getAttribute('data-filter');
        cards.forEach(function (c) {
          var show = cat === 'all' || c.getAttribute('data-industry-card') === cat;
          c.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Set current year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

});
