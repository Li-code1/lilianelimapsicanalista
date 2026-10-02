/* Liliane Lima — Teste de Temperamento
   Monta as perguntas, calcula o resultado, mostra as barras de pontuação e gera o PDF.
   A biblioteca jsPDF só é carregada quando a pessoa clica em "Baixar PDF". */
(function () {
  "use strict";

  var JSPDF_URL = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

  var tipos = ["colerico", "sanguineo", "melancolico", "fleumatico"];
  var nomes = { colerico: "Colérico", sanguineo: "Sanguíneo", melancolico: "Melancólico", fleumatico: "Fleumático" };

  var perguntas = [
    "Quando algo foge do seu controle, o que acontece dentro de você?",
    "Em um ambiente com várias pessoas, você costuma:",
    "Quando algo te machuca emocionalmente, você:",
    "Como você costuma lidar com decisões importantes?",
    "Quando você está sob pressão, sua reação é:",
    "Como você lida com conflitos?",
    "O que mais te incomoda nas pessoas?",
    "Como você costuma se comportar em relacionamentos?",
    "Quando algo dá errado, seu pensamento automático é:",
    "Como você lida com suas emoções no dia a dia?",
    "Você sente que sua mente é mais:",
    "Qual dessas frases mais parece com você?"
  ];

  var opcoes = [
    ["Tento assumir o controle rapidamente", "Busco alguém para conversar", "Analiso tudo profundamente", "Tento evitar ou me afastar"],
    ["Tomar iniciativa e liderar", "Interagir e conversar com todos", "Observar antes de agir", "Ficar mais na sua"],
    ["Tenta resolver na hora", "Se distrai ou busca apoio", "Fica pensando por muito tempo", "Guarda para si"],
    ["Decide rápido", "Pede opinião", "Analisa muito antes", "Adia ao máximo"],
    ["Age imediatamente", "Procura apoio", "Pensa demais", "Se fecha"],
    ["Enfrenta direto", "Tenta manter harmonia", "Analisa antes de agir", "Evita confronto"],
    ["Lentidão", "Frieza ou distância", "Erros", "Conflitos"],
    ["Intenso e direto", "Afetuoso e presente", "Profundo e cuidadoso", "Tranquilo e estável"],
    ["“Preciso resolver isso agora”", "“Vou tentar não pensar nisso”", "“Por que isso aconteceu?”", "“Deixa assim…”"],
    ["Expressa com facilidade", "Busca apoio", "Guarda e processa", "Evita lidar"],
    ["Acelerada", "Emocional", "Analítica", "Tranquila"],
    ["“Preciso ter controle”", "“Preciso de conexão”", "“Preciso entender tudo”", "“Só quero paz”"]
  ];

  var descricao = {
    colerico: {
      positivo: "Você é direto, determinado e gosta de resolver as coisas rapidamente.",
      negativo: "Pode ser impulsivo, controlador e ter dificuldade em lidar com emoções.",
      impacto: "Isso pode gerar conflitos, sobrecarga e afastamento de pessoas importantes."
    },
    sanguineo: {
      positivo: "Você é comunicativo, emocional e se conecta facilmente com as pessoas.",
      negativo: "Pode agir por impulso e depender da validação dos outros.",
      impacto: "Isso pode gerar instabilidade emocional e dificuldade em manter foco."
    },
    melancolico: {
      positivo: "Você é analítico, profundo e atento aos detalhes.",
      negativo: "Pode pensar demais e se cobrar excessivamente.",
      impacto: "Isso pode gerar ansiedade, insegurança e travar decisões."
    },
    fleumatico: {
      positivo: "Você é calmo, equilibrado e evita conflitos.",
      negativo: "Pode evitar decisões e guardar emoções.",
      impacto: "Isso pode levar à procrastinação e a se anular."
    }
  };

  var fechamento = [
    "Se você não entende esse padrão, ele continua se repetindo automaticamente.",
    "Esse resultado mostra padrões emocionais que influenciam suas decisões, relações e sua forma de reagir ao mundo.",
    "Entender isso é o primeiro passo para ter mais controle sobre sua vida, melhorar seus relacionamentos e alcançar seus objetivos."
  ];

  var form = document.getElementById("quiz");
  var container = document.getElementById("questions");
  var campoNome = document.getElementById("nome");
  var erro = document.getElementById("quiz-erro");
  var resultado = document.getElementById("resultado");
  if (!form || !container || !resultado) return;

  var ultimo = null; // { nome, principal, secundario, contagem }

  function el(tag, classe, texto) {
    var n = document.createElement(tag);
    if (classe) n.className = classe;
    if (texto != null) n.textContent = texto;
    return n;
  }

  /* ---------- Perguntas ---------- */
  perguntas.forEach(function (texto, i) {
    var fs = el("fieldset", "tt-pergunta");
    fs.appendChild(el("legend", null, (i + 1) + ". " + texto));
    opcoes[i].forEach(function (opcao, j) {
      var label = el("label", "tt-opcao");
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "q" + i;
      input.value = tipos[j];
      label.appendChild(input);
      label.appendChild(el("span", null, opcao));
      fs.appendChild(label);
    });
    container.appendChild(fs);
  });

  /* ---------- Cálculo ---------- */
  function calcular() {
    var contagem = { colerico: 0, sanguineo: 0, melancolico: 0, fleumatico: 0 };
    var faltando = [];

    perguntas.forEach(function (_, i) {
      var marcada = form.querySelector('input[name="q' + i + '"]:checked');
      if (marcada) contagem[marcada.value]++;
      else faltando.push(i);
    });

    if (faltando.length) {
      var primeira = faltando[0];
      erro.textContent = faltando.length === 1
        ? "Falta responder a pergunta " + (primeira + 1) + "."
        : "Faltam " + faltando.length + " perguntas. A primeira sem resposta é a " + (primeira + 1) + ".";
      erro.hidden = false;
      var alvo = form.querySelector('input[name="q' + primeira + '"]');
      if (alvo) {
        alvo.closest("fieldset").scrollIntoView({ behavior: "smooth", block: "center" });
        alvo.focus({ preventScroll: true });
      }
      return;
    }

    erro.hidden = true;
    var ordenado = Object.keys(contagem).sort(function (a, b) { return contagem[b] - contagem[a]; });
    ultimo = {
      nome: (campoNome.value || "").trim() || "Você",
      principal: ordenado[0],
      secundario: ordenado[1],
      contagem: contagem
    };
    mostrarResultado();
  }

  /* ---------- Resultado ---------- */
  function mostrarResultado() {
    var r = ultimo, d = descricao[r.principal];
    resultado.textContent = "";

    var h2 = el("h2", null, r.nome + ", esse é o seu resultado:");
    h2.tabIndex = -1;
    resultado.appendChild(h2);

    var p1 = el("p");
    p1.appendChild(el("strong", null, "Temperamento principal: "));
    p1.appendChild(document.createTextNode(nomes[r.principal]));
    resultado.appendChild(p1);
    resultado.appendChild(el("p", null, d.positivo));

    resultado.appendChild(el("p", "tt-rotulo", "Ponto de atenção:"));
    resultado.appendChild(el("p", null, d.negativo));
    resultado.appendChild(el("p", "tt-rotulo", "Como isso impacta sua vida:"));
    resultado.appendChild(el("p", null, d.impacto));

    var p2 = el("p");
    p2.style.marginTop = "1.4rem";
    p2.appendChild(el("strong", null, "Temperamento secundário: "));
    p2.appendChild(document.createTextNode(nomes[r.secundario]));
    resultado.appendChild(p2);
    resultado.appendChild(el("p", null, descricao[r.secundario].positivo));

    var barras = el("div", "tt-barras");
    barras.setAttribute("role", "list");
    barras.setAttribute("aria-label", "Pontuação por temperamento");
    tipos.forEach(function (t) {
      var linha = el("div", "tt-barra");
      linha.setAttribute("role", "listitem");
      linha.appendChild(el("span", null, nomes[t]));
      var trilho = el("span", "tt-barra-trilho");
      var preench = el("span", "tt-barra-preench");
      preench.style.width = (r.contagem[t] / perguntas.length * 100) + "%";
      trilho.appendChild(preench);
      linha.appendChild(trilho);
      linha.appendChild(el("span", "tt-barra-valor", r.contagem[t] + "/" + perguntas.length));
      barras.appendChild(linha);
    });
    resultado.appendChild(barras);

    var acoes = el("div", "tt-acoes");
    var pdf = el("button", "btn", "Baixar PDF");
    pdf.type = "button";
    pdf.addEventListener("click", function () { baixarPDF(pdf); });
    var refazer = el("button", "btn btn-ghost", "Refazer o teste");
    refazer.type = "button";
    refazer.addEventListener("click", refazerTeste);
    acoes.appendChild(pdf);
    acoes.appendChild(refazer);
    resultado.appendChild(acoes);

    resultado.appendChild(el("p", "tt-chamada", fechamento[0]));
    resultado.appendChild(el("p", null, fechamento[1]));
    resultado.appendChild(el("p", null, fechamento[2]));
    resultado.appendChild(el("p", "aviso tt-aviso", "Este teste é uma ferramenta de autoconhecimento e não substitui uma avaliação psicológica."));

    resultado.hidden = false;
    resultado.scrollIntoView({ behavior: "smooth", block: "start" });
    h2.focus({ preventScroll: true });
  }

  function refazerTeste() {
    form.reset();
    resultado.hidden = true;
    resultado.textContent = "";
    ultimo = null;
    var topo = document.getElementById("teste");
    if (topo) topo.scrollIntoView({ behavior: "smooth", block: "start" });
    campoNome.focus({ preventScroll: true });
  }

  /* ---------- PDF (jsPDF carregado sob demanda) ---------- */
  function carregarJsPDF() {
    return new Promise(function (resolve, reject) {
      if (window.jspdf && window.jspdf.jsPDF) return resolve(window.jspdf.jsPDF);
      var s = document.createElement("script");
      s.src = JSPDF_URL;
      s.onload = function () { window.jspdf && window.jspdf.jsPDF ? resolve(window.jspdf.jsPDF) : reject(); };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function baixarPDF(botao) {
    if (!ultimo) return;
    var textoOriginal = botao.textContent;
    botao.disabled = true;
    botao.textContent = "Gerando PDF…";

    carregarJsPDF().then(function (JsPDF) {
      var r = ultimo, d = descricao[r.principal];
      var doc = new JsPDF();
      var largura = doc.internal.pageSize.getWidth() - 30;
      var altura = doc.internal.pageSize.getHeight();
      var y = 20;

      function escrever(texto, tamanho, negrito, espacoDepois) {
        doc.setFont("helvetica", negrito ? "bold" : "normal");
        doc.setFontSize(tamanho);
        doc.splitTextToSize(texto, largura).forEach(function (linha) {
          if (y > altura - 20) { doc.addPage(); y = 20; }
          doc.text(linha, 15, y);
          y += tamanho * 0.5;
        });
        y += espacoDepois;
      }

      escrever(r.nome + ", esse é o seu resultado:", 16, true, 6);
      escrever("Temperamento principal: " + nomes[r.principal], 12, true, 2);
      escrever(d.positivo, 12, false, 4);
      escrever("Ponto de atenção: " + d.negativo, 12, false, 4);
      escrever("Como isso impacta sua vida: " + d.impacto, 12, false, 8);
      escrever("Temperamento secundário: " + nomes[r.secundario], 12, true, 2);
      escrever(descricao[r.secundario].positivo, 12, false, 8);
      escrever("Pontuação", 12, true, 2);
      tipos.forEach(function (t) {
        escrever(nomes[t] + ": " + r.contagem[t] + " de " + perguntas.length, 12, false, 1);
      });
      y += 8;
      escrever("Teste de autoconhecimento. Não substitui uma avaliação psicológica.", 10, false, 2);
      escrever("Liliane Lima, Psicanalista — lilianelimapsicanalista.com.br", 10, false, 0);

      doc.save("resultado_temperamento.pdf");
    }).catch(function () {
      erro.textContent = "Não foi possível gerar o PDF agora. Verifique a conexão e tente novamente.";
      erro.hidden = false;
      erro.scrollIntoView({ behavior: "smooth", block: "center" });
    }).then(function () {
      botao.disabled = false;
      botao.textContent = textoOriginal;
    });
  }

  document.getElementById("ver-resultado").addEventListener("click", calcular);
  form.addEventListener("change", function () { erro.hidden = true; });
  form.addEventListener("submit", function (e) { e.preventDefault(); calcular(); });
})();
