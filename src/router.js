import HomePresenter from './presenters/HomePresenter.js';
import AddStoryPresenter from './presenters/AddStoryPresenter.js';
import LoginPresenter from './presenters/LoginPresenter.js';
import RegisterPresenter from './presenters/RegisterPresenter.js';
import SavedPresenter from './presenters/SavedPresenter.js';
import NotFoundView from './views/NotFoundView.js';

const routes = {
  '#/': HomePresenter,
  '#/add': AddStoryPresenter,
  '#/login': LoginPresenter,
  '#/register': RegisterPresenter,
  '#/saved': SavedPresenter,
};

const defaultRoute = '#/';
const app = document.getElementById('app');

async function loadRoute() {
  // Stop kamera jika aktif
  const video = document.querySelector('video');
  if (video && video._streamRef) {
    const { default: stopCamera } = await import('./utils/stopCamera.js');
    stopCamera(video);
  }

  let hash = window.location.hash || defaultRoute;

  // Validasi token
  const token = localStorage.getItem('token');
  const isPublicPage = ['#/login', '#/register'].includes(hash);
  if (!token && !isPublicPage) {
    window.location.hash = '#/login';
    return;
  }

  // Bersihkan konten sebelum render
  app.innerHTML = '';

  const presenter = routes[hash];
  console.log('Routing ke:', hash, 'Presenter:', presenter);

  if (typeof presenter === 'function') {
    const result = presenter(app);
    if (result instanceof Promise) await result;
  } else {
    const notFound = new NotFoundView();
    notFound.render(app);
  }
}

// Dukungan View Transition jika tersedia
if ('startViewTransition' in document) {
  window.addEventListener('hashchange', () => {
    document.startViewTransition(loadRoute);
  });
} else {
  window.addEventListener('hashchange', loadRoute);
}

window.addEventListener('route-change', loadRoute);
window.dispatchEvent(new CustomEvent('route-change'));
