// Treino #teamporto: guarda o app no celular para abrir rápido e funcionar sem internet.
var V = "tp-0746f34c80";
var PAGE = "/treino/", ADM = "/treino/adm.html";
self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(V).then(function (c) { return Promise.all([c.add(PAGE).catch(function () {}), c.add(ADM).catch(function () {})]); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k.indexOf("tp-") === 0 && k !== V; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
function timeout(ms) { return new Promise(function (_, rej) { setTimeout(function () { rej(new Error("timeout")); }, ms); }); }
self.addEventListener("fetch", function (e) {
  var r = e.request; if (r.method !== "GET") return;
  var u = new URL(r.url);
  // página do app: tenta a rede (versão mais nova); se demorar ou estiver sem sinal, abre a cópia guardada
  var key = null;
  if (r.mode === "navigate" && u.origin === self.location.origin) {
    if (u.pathname === "/treino" || u.pathname === "/treino/" || u.pathname === "/treino/index.html") key = PAGE;
    else if (u.pathname === "/treino/adm.html" || u.pathname === "/treino/adm") key = ADM;
  }
  if (key) {
    e.respondWith(caches.open(V).then(function (c) {
      var net = fetch(r).then(function (res) { if (res && res.ok && !res.redirected) c.put(key, res.clone()); return res; });
      return Promise.race([net, timeout(3500)]).catch(function () {
        return c.match(key).then(function (hit) { return hit || net; });
      });
    }));
    return;
  }
  // bibliotecas do Firebase e fontes: versões fixas, podem ficar guardadas
  if ((u.hostname === "www.gstatic.com" && u.pathname.indexOf("/firebasejs/") === 0) || u.hostname === "fonts.googleapis.com" || u.hostname === "fonts.gstatic.com") {
    e.respondWith(caches.open(V).then(function (c) {
      return c.match(r).then(function (hit) {
        return hit || fetch(r).then(function (res) { if (res && (res.ok || res.type === "opaque")) c.put(r, res.clone()); return res; });
      });
    }));
  }
});
