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

  // Show the photo archive in focused groups of six.
  const gallery = document.querySelector('.gallery-grid');
  const galleryPrev = document.querySelector('.gallery-prev');
  const galleryNext = document.querySelector('.gallery-next');
  const galleryStatus = document.querySelector('.gallery-page-status');
  if (gallery && galleryPrev && galleryNext && galleryStatus) {
    const galleryImages = [...gallery.querySelectorAll('img')];
    const pageSize = 6;
    const pageCount = Math.ceil(galleryImages.length / pageSize);
    let galleryPage = 0;

    const showGalleryPage = (page) => {
      galleryPage = page;
      galleryImages.forEach((image, index) => {
        const visible = Math.floor(index / pageSize) === galleryPage;
        image.hidden = !visible;
        image.tabIndex = visible ? 0 : -1;
      });
      galleryStatus.textContent = `${galleryPage + 1} / ${pageCount}`;
      galleryPrev.disabled = galleryPage === 0;
      galleryNext.disabled = galleryPage === pageCount - 1;
    };

    gallery.classList.add('is-paginated');
    const changeGalleryPage = (page) => {
      showGalleryPage(page);
      gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    galleryPrev.addEventListener('click', () => changeGalleryPage(galleryPage - 1));
    galleryNext.addEventListener('click', () => changeGalleryPage(galleryPage + 1));
    showGalleryPage(0);
  }
});
