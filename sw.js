const CACHE_NAME = 'kart-dashboard-v2';
const urlsToCache = [
  './',
  './index.html',
  './assets/css/styles.css',
  './assets/js/config.js',
  './assets/js/scripts.js',
  './assets/js/championship.js',
  './assets/img/kart-loading.png',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,600;0,700;0,800;1,400;1,700&family=Racing+Sans+One&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna o arquivo em cache se existir
        if (response) {
          return response;
        }
        
        // Ou faz a requisição para a rede
        return fetch(event.request).catch(() => {
            // Em caso de falha de rede ao buscar outras páginas, 
            // aqui poderíamos retornar uma página offline customizada
            console.error('Falha na conexão da rede:', event.request.url);
        });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
