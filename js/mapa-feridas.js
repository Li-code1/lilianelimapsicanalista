(function () {
  "use strict";

  var FERIDAS = [
    {
      id: "rejeicao",
      nome: "Rejeição",
      definicao: "Você sente que não é aceita por quem realmente é. Isso desperta o medo de não pertencer, e faz você se isolar ou se diminuir diante do outro.",
      caminhoCura: [
        "Reconhecer o seu valor, independente da aceitação alheia",
        "Praticar autoafirmação: expressar suas opiniões e desejos sem medo do julgamento",
        "Fortalecer o vínculo com quem você é, o seu senso de \"eu sou\""
      ]
    },
    {
      id: "abandono",
      nome: "Abandono",
      definicao: "Você tem medo de ficar só ou de ser deixada, e por isso busca o tempo todo atenção, presença e apoio emocional de quem está por perto.",
      caminhoCura: [
        "Desenvolver tolerância à solidão e companheirismo com você mesma",
        "Construir uma segurança interna que não dependa da presença constante do outro",
        "Dar espaço para lutos e perdas passadas que ainda não foram elaborados"
      ]
    },
    {
      id: "humilhacao",
      nome: "Humilhação",
      definicao: "Você sente vergonha de si mesma e acha que nunca é o suficiente, o que te leva a se anular, se culpar ou tentar agradar demais.",
      caminhoCura: [
        "Trabalhar autoestima e autocompaixão no dia a dia",
        "Rever as crenças de \"não sou suficiente\" que você carrega desde cedo",
        "Aprender a se posicionar sem precisar se anular para agradar"
      ]
    },
    {
      id: "traicao",
      nome: "Traição",
      definicao: "Você tem dificuldade em confiar em si e nos outros, e isso te leva a controlar tudo e cobrar demais para se sentir segura.",
      caminhoCura: [
        "Reconstruir a confiança aos poucos, com experiências concretas",
        "Soltar o controle excessivo e treinar tolerar a incerteza",
        "Diferenciar o que é fato do que é medo antecipando o pior"
      ]
    },
    {
      id: "injustica",
      nome: "Injustiça",
      definicao: "Você sente que nunca é tratada com justiça, e por isso fica exigente e rígida consigo mesma, buscando a perfeição como proteção.",
      caminhoCura: [
        "Flexibilizar a exigência de perfeição consigo mesma",
        "Acolher os seus sentimentos sem julgá-los como fraqueza",
        "Praticar autocompaixão diante dos próprios erros e imperfeições"
      ]
    }
  ];

  var MAX_SELECIONADAS = 2;
  var CHAVE_ARMAZENAMENTO = "meuMapaFeridasEmocionais";

  var listaFeridasEl = document.getElementById("lista-feridas");
  var statusSelecaoEl = document.getElementById("status-selecao");
  var detalheFeridasEl = document.getElementById("detalhe-feridas");
  var conviteSessaoEl = document.getElementById("convite-sessao-container");
  var formEl = document.getElementById("form-mapa");
  var mensagemStatusEl = document.getElementById("mensagem-status");

  var respostasSalvas = {};

  function construirListaFeridas() {
    FERIDAS.forEach(function (ferida) {
      var wrapper = document.createElement("label");
      wrapper.className = "opcao-ferida";
      wrapper.setAttribute("for", "check-" + ferida.id);

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = "check-" + ferida.id;
      checkbox.value = ferida.id;
      checkbox.addEventListener("change", aoMudarSelecao);

      var texto = document.createElement("span");
      texto.className = "texto-opcao";
      var titulo = document.createElement("strong");
      titulo.textContent = ferida.nome;
      var descricao = document.createElement("span");
      descricao.textContent = ferida.definicao;
      texto.appendChild(titulo);
      texto.appendChild(descricao);

      wrapper.appendChild(checkbox);
      wrapper.appendChild(texto);
      listaFeridasEl.appendChild(wrapper);
    });
  }

  function getCheckboxes() {
    return Array.prototype.slice.call(listaFeridasEl.querySelectorAll('input[type="checkbox"]'));
  }

  function getSelecionadas() {
    return getCheckboxes().filter(function (cb) { return cb.checked; }).map(function (cb) { return cb.value; });
  }

  function aoMudarSelecao() {
    var selecionadas = getSelecionadas();

    if (selecionadas.length > MAX_SELECIONADAS) {
      this.checked = false;
      statusSelecaoEl.textContent = "Você já selecionou " + MAX_SELECIONADAS + " feridas. Desmarque uma antes de escolher outra.";
      statusSelecaoEl.classList.add("aviso");
      return;
    }

    statusSelecaoEl.classList.remove("aviso");
    statusSelecaoEl.textContent = selecionadas.length + " de " + MAX_SELECIONADAS + " feridas selecionadas.";

    getCheckboxes().forEach(function (cb) {
      var opcao = cb.closest(".opcao-ferida");
      opcao.classList.toggle("selecionada", cb.checked);
      if (!cb.checked && selecionadas.length >= MAX_SELECIONADAS) {
        cb.disabled = true;
        opcao.classList.add("desabilitada");
      } else {
        cb.disabled = false;
        opcao.classList.remove("desabilitada");
      }
    });

    renderizarDetalheFeridas(selecionadas);
  }

  function salvarTextareaAtual() {
    detalheFeridasEl.querySelectorAll("textarea").forEach(function (ta) {
      respostasSalvas[ta.dataset.feridaId + "__" + ta.dataset.campo] = ta.value;
    });
  }

  function renderizarDetalheFeridas(selecionadas) {
    salvarTextareaAtual();
    detalheFeridasEl.innerHTML = "";

    selecionadas.forEach(function (feridaId) {
      var ferida = FERIDAS.filter(function (f) { return f.id === feridaId; })[0];
      if (!ferida) return;

      var cartao = document.createElement("section");
      cartao.className = "cartao-ferida";
      cartao.setAttribute("aria-labelledby", "titulo-" + ferida.id);

      var titulo = document.createElement("h2");
      titulo.id = "titulo-" + ferida.id;
      titulo.textContent = ferida.nome;
      cartao.appendChild(titulo);

      var definicao = document.createElement("p");
      definicao.className = "definicao";
      definicao.textContent = ferida.definicao;
      cartao.appendChild(definicao);

      cartao.appendChild(criarBlocoCampo(ferida, "aprenderSozinha", "self",
        "O que você precisa aprender a fazer por si mesma",
        "Escreva o que vier na sua mente..."));

      cartao.appendChild(criarBlocoCampo(ferida, "esperaDosOutros", "outros",
        "O que você ainda espera receber dos outros",
        "Escreva o que vier na sua mente..."));

      cartao.appendChild(criarOrientacaoProfissional(ferida));

      detalheFeridasEl.appendChild(cartao);
    });

    atualizarConviteSessao(selecionadas.length > 0);
  }

  function atualizarConviteSessao(mostrar) {
    conviteSessaoEl.innerHTML = "";
    if (!mostrar) return;

    var bloco = document.createElement("section");
    bloco.className = "convite-sessao";
    bloco.setAttribute("aria-labelledby", "titulo-convite-sessao");

    var titulo = document.createElement("h2");
    titulo.id = "titulo-convite-sessao";
    titulo.textContent = "Se alguma dessas feridas mexeu bastante com você...";
    bloco.appendChild(titulo);

    var texto = document.createElement("p");
    texto.textContent = "Esse mapa é um ponto de partida para se conhecer melhor, mas olhar mais fundo para essas questões junto de um espaço de escuta profissional pode fazer toda a diferença. Se você sentiu que quer ir além, ficarei feliz em te acompanhar nesse processo.";
    bloco.appendChild(texto);

    var link = document.createElement("a");
    link.className = "botao-convite";
    link.href = "https://wa.me/message/CT46CMBPCLFOF1";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Agendar uma sessão";
    bloco.appendChild(link);

    conviteSessaoEl.appendChild(bloco);
  }

  function criarBlocoCampo(ferida, campoId, classeExtra, rotulo, placeholder) {
    var bloco = document.createElement("div");
    bloco.className = "bloco-campo" + (classeExtra === "outros" ? " outros" : "");

    var idCampo = "campo-" + ferida.id + "-" + campoId;
    var label = document.createElement("label");
    label.setAttribute("for", idCampo);
    label.textContent = rotulo;

    var textarea = document.createElement("textarea");
    textarea.id = idCampo;
    textarea.dataset.feridaId = ferida.id;
    textarea.dataset.campo = campoId;
    textarea.placeholder = placeholder;
    textarea.value = respostasSalvas[ferida.id + "__" + campoId] || "";

    bloco.appendChild(label);
    bloco.appendChild(textarea);
    return bloco;
  }

  function criarOrientacaoProfissional(ferida) {
    var details = document.createElement("details");
    details.className = "orientacao";

    var summary = document.createElement("summary");
    summary.textContent = "Orientação profissional: o que ajuda a curar a ferida de " + ferida.nome.toLowerCase();
    details.appendChild(summary);

    var conteudo = document.createElement("div");
    conteudo.className = "conteudo-orientacao";

    var aviso = document.createElement("p");
    aviso.className = "aviso-profissional";
    aviso.textContent = "A seguir, uma orientação profissional sobre o caminho de cura para essa ferida.";
    conteudo.appendChild(aviso);

    var lista = document.createElement("ul");
    ferida.caminhoCura.forEach(function (item) {
      var li = document.createElement("li");
      li.textContent = item;
      lista.appendChild(li);
    });
    conteudo.appendChild(lista);

    details.appendChild(conteudo);
    return details;
  }

  function coletarDadosFormulario() {
    salvarTextareaAtual();
    var selecionadas = getSelecionadas();

    var feridasDados = selecionadas.map(function (feridaId) {
      var ferida = FERIDAS.filter(function (f) { return f.id === feridaId; })[0];
      return {
        id: feridaId,
        nome: ferida.nome,
        aprenderSozinha: respostasSalvas[feridaId + "__aprenderSozinha"] || "",
        esperaDosOutros: respostasSalvas[feridaId + "__esperaDosOutros"] || ""
      };
    });

    return {
      nomePessoa: document.getElementById("nome-pessoa").value.trim(),
      feridas: feridasDados
    };
  }

  function salvarNoNavegador(dados) {
    try {
      localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(dados));
      return true;
    } catch (erro) {
      return false;
    }
  }

  function lerDoNavegador() {
    try {
      var dados = localStorage.getItem(CHAVE_ARMAZENAMENTO);
      return dados ? JSON.parse(dados) : null;
    } catch (erro) {
      return null;
    }
  }

  function mostrarMensagem(texto, ehErro) {
    mensagemStatusEl.textContent = texto;
    mensagemStatusEl.classList.add("visivel");
    mensagemStatusEl.classList.toggle("erro", !!ehErro);
    window.clearTimeout(mostrarMensagem._t);
    mostrarMensagem._t = window.setTimeout(function () {
      mensagemStatusEl.classList.remove("visivel");
    }, 4000);
  }

  function limparFormulario() {
    formEl.reset();
    respostasSalvas = {};
    getCheckboxes().forEach(function (cb) {
      cb.checked = false;
      cb.disabled = false;
      cb.closest(".opcao-ferida").classList.remove("selecionada", "desabilitada");
    });
    detalheFeridasEl.innerHTML = "";
    conviteSessaoEl.innerHTML = "";
    statusSelecaoEl.textContent = "Selecione até 2 feridas.";
    statusSelecaoEl.classList.remove("aviso");
  }

  function carregarDados(dados) {
    limparFormulario();
    document.getElementById("nome-pessoa").value = dados.nomePessoa || "";

    dados.feridas.forEach(function (f) {
      respostasSalvas[f.id + "__aprenderSozinha"] = f.aprenderSozinha;
      respostasSalvas[f.id + "__esperaDosOutros"] = f.esperaDosOutros;
      var cb = document.getElementById("check-" + f.id);
      if (cb) cb.checked = true;
    });

    var selecionadas = getSelecionadas();
    statusSelecaoEl.textContent = selecionadas.length + " de " + MAX_SELECIONADAS + " feridas selecionadas.";
    getCheckboxes().forEach(function (cb) {
      var opcao = cb.closest(".opcao-ferida");
      opcao.classList.toggle("selecionada", cb.checked);
      if (!cb.checked && selecionadas.length >= MAX_SELECIONADAS) {
        cb.disabled = true;
        opcao.classList.add("desabilitada");
      }
    });
    renderizarDetalheFeridas(selecionadas);
  }

  // Eventos

  formEl.addEventListener("submit", function (evento) {
    evento.preventDefault();
    var dados = coletarDadosFormulario();

    if (dados.feridas.length === 0) {
      mostrarMensagem("Selecione ao menos uma ferida antes de salvar.", true);
      return;
    }

    var sucesso = salvarNoNavegador(dados);
    if (sucesso) {
      mostrarMensagem("Suas respostas foram salvas.");
    } else {
      mostrarMensagem("Não foi possível salvar. Tente novamente.", true);
    }
  });

  document.getElementById("botao-imprimir").addEventListener("click", function () {
    detalheFeridasEl.querySelectorAll("details.orientacao").forEach(function (d) { d.open = true; });
    window.print();
  });

  document.getElementById("botao-limpar").addEventListener("click", function () {
    if (window.confirm("Deseja apagar tudo e recomeçar o teste?")) {
      limparFormulario();
    }
  });

  // Inicialização
  construirListaFeridas();
})();
