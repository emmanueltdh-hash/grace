const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');
const modal = document.querySelector('#assessment-modal');
const form = document.querySelector('#assessment-form');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('open');
  mobileNav.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  mobileNav.classList.toggle('open', !open);
  mobileNav.setAttribute('aria-hidden', String(open));
  document.body.classList.toggle('menu-open', !open);
});

mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

document.querySelectorAll('[data-open-modal]').forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault();
    closeMenu();
    modal.showModal();
    document.body.classList.add('modal-open');
  });
});

function closeModal() {
  modal.close();
  document.body.classList.remove('modal-open');
}

document.querySelector('.modal-close').addEventListener('click', closeModal);
document.querySelector('.modal-done').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
form.addEventListener('submit', event => {
  event.preventDefault();
  form.hidden = true;
  modal.querySelector('.modal-head').hidden = true;
  modal.querySelector('.success-state').hidden = false;
});

document.querySelectorAll('details').forEach(detail => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('details').forEach(other => { if (other !== detail) other.open = false; });
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
document.querySelector('#year').textContent = new Date().getFullYear();

const parentCount = document.querySelector('[data-parent-count]');
const parentTarget = Number(parentCount.dataset.parentCount || 100);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceMotion) {
  parentCount.textContent = String(parentTarget);
} else {
  const countObserver = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    countObserver.disconnect();
    const started = performance.now();
    const duration = 1100;
    const animateCount = now => {
      const progress = Math.min((now - started) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      parentCount.textContent = String(Math.round(eased * parentTarget));
      if (progress < 1) requestAnimationFrame(animateCount);
    };
    requestAnimationFrame(animateCount);
  }, { threshold: .6 });
  countObserver.observe(parentCount);
}

const typeHeading = document.querySelector('.type-heading');
const typeParts = [...typeHeading.querySelectorAll('[data-type-copy]')];
const typeText = typeParts.map(part => part.dataset.typeCopy);
const typeDelay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function typeHeroHeading() {
  if (reduceMotion) {
    typeParts.forEach((part, index) => { part.textContent = typeText[index]; });
    typeHeading.classList.add('typing-done');
    return;
  }

  await typeDelay(180);
  for (let partIndex = 0; partIndex < typeParts.length; partIndex += 1) {
    const characters = Array.from(typeText[partIndex]);
    for (const character of characters) {
      typeParts[partIndex].textContent += character;
      await typeDelay(character === ' ' ? 24 : 38);
    }
  }
  typeHeading.classList.add('typing-done');
}

typeHeroHeading();
