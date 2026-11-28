/* Mente em Cores — comportamento da loja (JavaScript puro, sem dependências) */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  root.classList.remove('no-js');

  /* funciona também abrindo o arquivo direto no computador (file://) */
  var FILE = location.protocol === 'file:';
  function fixPath(s) { return FILE ? String(s).replace(/^\/loja\//, '') : s; }
  if (FILE) d.querySelectorAll('img[src^="/loja/"]').forEach(function (im) { im.setAttribute('src', fixPath(im.getAttribute('src'))); });

  var WA = '5513996621700';
  function waLink(msg) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg); }

  /* sombra do cabeçalho ao rolar */
  var top = d.querySelector('.top');
  function onScroll() { if (top) top.classList.toggle('scrolled', window.scrollY > 12); }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  /* menu no celular */
  var burger = d.querySelector('.burger');
  function setMenu(open) {
    d.body.classList.toggle('menu-open', open);
    if (burger) { burger.setAttribute('aria-expanded', String(open)); burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); }
  }
  if (burger) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    d.querySelectorAll('.nav-links a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* animação de entrada ao rolar */
  var rv = d.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    rv.forEach(function (el, i) { el.style.setProperty('--rd', (i % 4) * 0.08 + 's'); io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* destaca a campanha do mês atual */
  var porMes = { 0: 'janeiro-branco', 7: 'agosto-lilas', 8: 'setembro-amarelo', 9: 'outubro-rosa', 10: 'novembro-azul' };
  var atual = porMes[new Date().getMonth()];
  if (atual) { var c = d.querySelector('.card[data-id="' + atual + '"]'); if (c) c.classList.add('is-now'); }

  /* janela de detalhes do produto */
  var dados = {};
  try { dados = JSON.parse(d.getElementById('dados').textContent); } catch (e) {}
  var dlg = d.getElementById('modal');
  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  function abrir(id) {
    var p = dados[id]; if (!p || !dlg || !dlg.showModal) return;
    dlg.style.setProperty('--acc', p.acc); dlg.style.setProperty('--bg', p.bg);
    var ref = d.querySelector(p.ref); d.getElementById('m-img').src = ref ? (ref.currentSrc || ref.src) : ''; d.getElementById('m-img').alt = p.alt;
    d.getElementById('m-tag').textContent = p.tag;
    d.getElementById('m-title').textContent = p.nome;
    d.getElementById('m-desc').textContent = p.desc;
    d.getElementById('m-list').innerHTML = p.itens.map(function (t) { return '<li>' + ICON + '<span>' + t + '</span></li>'; }).join('');
    d.getElementById('m-price').textContent = p.preco;
    d.getElementById('m-buy').href = p.link;
    d.getElementById('m-wa').href = waLink('Olá! Tenho uma dúvida sobre: ' + p.nome);
    dlg.showModal(); d.body.style.overflow = 'hidden';
  }
  d.querySelectorAll('[data-open]').forEach(function (b) { b.addEventListener('click', function () { abrir(b.getAttribute('data-open')); }); });
  if (dlg) {
    dlg.addEventListener('close', function () { d.body.style.overflow = ''; });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    var x = d.getElementById('m-close'); if (x) x.addEventListener('click', function () { dlg.close(); });
  }

  /* dica do botão de WhatsApp */
  var tip = d.querySelector('.wa-tip');
  if (tip) {
    var visto = false; try { visto = sessionStorage.getItem('wa-tip') === '1'; } catch (e) {}
    if (!visto) setTimeout(function () { tip.classList.add('show'); }, 5000);
    var fechar = tip.querySelector('button');
    if (fechar) fechar.addEventListener('click', function () { tip.classList.remove('show'); try { sessionStorage.setItem('wa-tip', '1'); } catch (e) {} });
  }

  var y = d.getElementById('ano'); if (y) y.textContent = new Date().getFullYear();
})();
