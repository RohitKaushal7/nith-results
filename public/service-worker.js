const VERSION = "0.1.0";
const CACHE = "cache-v" + VERSION;

const SPA_ROUTES = ["/?", "/r/"];

self.addEventListener("install", function (event) {});

// Destroy inapplicable caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter((cacheName) => CACHE !== cacheName);
      })
      .then((unusedCaches) => {
        console.log("DESTROYING CACHE", unusedCaches.join(","));
        return Promise.all(
          unusedCaches.map((unusedCache) => {
            return caches.delete(unusedCache);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// FETCH
self.addEventListener("fetch", (event) => {
  if (
    !event.request.url.startsWith(self.location.origin) ||
    event.request.method !== "GET"
  ) {
    // External request, or POST, ignore
    return void event.respondWith(fetch(event.request));
  }

  event.respondWith(
    // Always try to download from server first
    fetch(event.request)
      .then((response) => {
        // When a download is successful cache the result
        caches.open(CACHE).then((cache) => {
          if (SPA_ROUTES.some((route) => event.request.url.includes(route))) {
            cache.put("/", response);
          } else {
            cache.put(event.request, response);
          }
        });
        // And of course display it
        return response.clone();
      })
      .catch((_err) => {
        // A failure probably means network access issues
        // See if we have a cached version

        if (SPA_ROUTES.some((route) => event.request.url.includes(route))) {
          return caches.match("/").then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return _err;
          });
        }

        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            // We did have a cached version, display it
            return cachedResponse;
          }

          // We did not have a cached version, display offline page
          //   return caches.open(CACHE).then((cache) => {
          //     const offlineRequest = new Request(OFFLINE);
          //     return cache.match(offlineRequest);
          //   });
          return _err;
        });
      })
  );
});
