import HomePresenter from './presenters/HomePresenter.js';
import AddStoryPresenter from './presenters/AddStoryPresenter.js';
import LoginPresenter from './presenters/LoginPresenter.js';
import RegisterPresenter from './presenters/RegisterPresenter.js';
import NotFoundView from './views/NotFoundView.js';

const routes = {
  '#/': HomePresenter,
  '#/add': AddStoryPresenter,
  '#/login': LoginPresenter,
  '#/register': RegisterPresenter,
};

const defaultRoute = '#/';
const app = document.getElementById('app');

async function loadRoute() {
  // Stop camera jika masih aktif
  const video = document.querySelector('video');
  if (video && video._streamRef) {
    const { default: stopCamera } = await import('./utils/stopCamera.js');
    stopCamera(video);
  }

  let hash = window.location.hash || defaultRoute;

  // Validasi token: jika tidak ada token & bukan halaman login/register => redirect
  const token = localStorage.getItem('token');
  const isPublicPage = ['#/login', '#/register'].includes(hash);
  if (!token && !isPublicPage) {
    hash = '#/login';
    window.location.hash = hash;
  }

  const presenter = routes[hash] || ((container) => new NotFoundView().render(container));
  app.innerHTML = '';
  presenter(app);
}

if ('startViewTransition' in document) {
  window.addEventListener('hashchange', () => {
    document.startViewTransition(loadRoute);
  });
} else {
  window.addEventListener('hashchange', loadRoute);
}

window.addEventListener('route-change', loadRoute);
window.dispatchEvent(new CustomEvent('route-change'));
