// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Hero slider
  const slides = document.querySelectorAll('.hero .slide');
  const dotsWrap = document.querySelector('.hero .dots');
  if (slides.length > 1 && dotsWrap) {
    let current = 0;
    let timer;
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => { show(i); restart(); });
      dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll('button');
    function show(i) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = i;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }
    function restart() {
      clearInterval(timer);
      timer = setInterval(() => show((current + 1) % slides.length), 5000);
    }
    restart();
  }

  // Mark the current page in the nav
  const here = location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.site-nav a').forEach((a) => {
    const path = new URL(a.href).pathname.replace(/\/$/, '') || '/';
    if (path === here) a.setAttribute('aria-current', 'page');
  });
});
