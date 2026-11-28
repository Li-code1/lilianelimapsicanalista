/* Liliane Lima — blog: filtro por categoria e abertura de artigo via #âncora */
(function () {
  "use strict";

  var filtro = document.getElementById("filtro-categorias");
  var artigos = Array.prototype.slice.call(document.querySelectorAll(".artigo[data-categoria]"));

  if (filtro && artigos.length) {
    var botoes = Array.prototype.slice.call(filtro.querySelectorAll("button[data-filtro]"));

    function aplicar(categoria) {
      botoes.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-filtro") === categoria));
      });
      artigos.forEach(function (a) {
        a.hidden = categoria !== "todos" && a.getAttribute("data-categoria") !== categoria;
      });
    }

    botoes.forEach(function (b) {
      b.addEventListener("click", function () { aplicar(b.getAttribute("data-filtro")); });
    });

    filtro.hidden = false; // sem JS o filtro fica oculto e todos os artigos aparecem
  }

  // Link direto para um artigo (ex.: /blog#ansiedade-o-que-ela-esta-tentando-te-dizer) já abre o texto completo
  function abrirPelaAncora() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    var alvo = document.getElementById(id);
    if (!alvo) return;
    var det = alvo.querySelector("details");
    if (det) det.open = true;
  }
  abrirPelaAncora();
  window.addEventListener("hashchange", abrirPelaAncora);
})();
