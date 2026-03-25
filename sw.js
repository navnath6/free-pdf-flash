/* ============================================================
   Service Worker — Offline-first caching
   ============================================================ */
const CACHE_NAME = 'fpdf-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/about.html',
    '/contact.html',
    '/disclaimer.html',
    '/privacy.html',
    '/image-to-pdf.html',
    '/bulk-converter.html',
    '/merge-pdf.html',
    '/split-pdf.html',
    '/compress-pdf.html',
    '/protect-pdf.html',
    '/watermark-pdf.html',
    '/resume-builder.html',
    '/portfolio-generator.html',
    '/manifest.json'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    // Network-first for CDN, cache-first for app shell
    if (e.request.url.includes('cdn') || e.request.url.includes('cdnjs') || e.request.url.includes('unpkg')) {
        e.respondWith(
            fetch(e.request).then(r => {
                const clone = r.clone();
                caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
                return r;
            }).catch(() => caches.match(e.request))
        );
    } else {
        e.respondWith(
            caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
                const clone = resp.clone();
                caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
                return resp;
            }))
        );
    }
});
