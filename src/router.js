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

  // Validasi token: jika tidak ada token & bukan halaman publik => redirect ke login
  const token = localStorage.getItem('token');
  const isPublicPage = ['#/login', '#/register'].includes(hash);
  if (!token && !isPublicPage) {
    window.location.hash = '#/login';
    return;
  }

  app.innerHTML = '';

  const presenter = routes[hash];
  if (presenter) {
    presenter(app);
  } else {
    const notFound = new NotFoundView();
    notFound.render(app);
  }
}

// View Transition API jika tersedia
if ('startViewTransition' in document) {
  window.addEventListener('hashchange', () => {
    document.startViewTransition(loadRoute);
  });
} else {
  window.addEventListener('hashchange', loadRoute);
}

window.addEventListener('route-change', loadRoute);
window.dispatchEvent(new CustomEvent('route-change'));
