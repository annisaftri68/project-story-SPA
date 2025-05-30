import './styles/main.css';
import './router';
import './register-sw.js';

// Tambahkan skip to content
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.className = 'skip-link';
skipLink.innerText = 'Skip to Content';
document.body.prepend(skipLink);

// Fokuskan ke konten utama
const mainContent = document.querySelector('#main-content');
skipLink.addEventListener('click', function (event) {
  event.preventDefault();
  skipLink.blur();

  if (mainContent) {
    mainContent.focus();
    mainContent.scrollIntoView();
  }
});

// Transisi halaman
if ('startViewTransition' in document) {
  window.addEventListener('hashchange', () => {
    document.startViewTransition(() => {
      window.dispatchEvent(new CustomEvent('route-change'));
    });
  });
} else {
  window.addEventListener('hashchange', () => {
    window.dispatchEvent(new CustomEvent('route-change'));
  });
}

// Trigger awal
window.dispatchEvent(new CustomEvent('route-change'));
