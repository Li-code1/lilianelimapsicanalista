/* Liliane Lima — scripts compartilhados (menu, voltar ao topo, ano do rodapé) */
(function () {
  "use strict";

  var body = document.body;
  var burger = document.querySelector(".burger");
  var menu = document.getElementById("menu-principal");
  var desktopQuery = window.matchMedia("(min-width: 1241px)");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function setMenu(open, returnFocus) {
    if (!burger || !menu) return;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    body.classList.toggle("nav-open", open);
    if (!open && returnFocus) burger.focus();
  }

  if (burger && menu) {
    burger.addEventListener("click", function () {
      setMenu(burger.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && body.classList.contains("nav-open")) setMenu(false, true);
    });
    var onChange = function (e) { if (e.matches) setMenu(false); };
    if (desktopQuery.addEventListener) desktopQuery.addEventListener("change", onChange);
    else if (desktopQuery.addListener) desktopQuery.addListener(onChange);
  }

  var topo = document.getElementById("voltar-topo");
  if (topo) {
    topo.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
    });
  }

  var ano = document.getElementById("ano-atual");
  if (ano) ano.textContent = new Date().getFullYear();
})();
