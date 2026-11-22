var TAMANHO = 20;

var PALAVRAS = [
  { resposta: "RAM", dica: "Memória principal do computador; é volátil e guarda programas e dados enquanto estão em uso.", linha: 0, coluna: 17, dir: "H", invertida: false },
  { resposta: "REGISTRADORES", dica: "Memórias muito pequenas e rápidas dentro do processador, usadas durante a execução das instruções.", linha: 0, coluna: 17, dir: "V", invertida: false },
  { resposta: "CPU", dica: "Parte central do computador que busca, interpreta e executa as instruções dos programas.", linha: 5, coluna: 13, dir: "V", invertida: false },
  { resposta: "DATABUS", dica: "Caminhos por onde os dados passam entre o processador, a memória e outros componentes.", linha: 7, coluna: 12, dir: "H", invertida: true },
  { resposta: "DMA", dica: "Recurso que permite transferir dados entre periféricos e a memória sem passar pelo processador.", linha: 9, coluna: 2, dir: "V", invertida: false },
  { resposta: "ROM", dica: "Memória não volátil, com conteúdo gravado de fábrica, usada na inicialização do computador.", linha: 9, coluna: 12, dir: "V", invertida: false },
  { resposta: "ADDRESSBUS", dica: "Caminhos que indicam o endereço da memória que o processador quer acessar.", linha: 9, coluna: 15, dir: "V", invertida: false },
  { resposta: "MICROCONTROLADOR", dica: "Chip que reúne processador, memória e periféricos para controlar um dispositivo eletrônico.", linha: 10, coluna: 2, dir: "H", invertida: false },
  { resposta: "ULA", dica: "Parte do processador que faz cálculos matemáticos e comparações lógicas.", linha: 11, coluna: 0, dir: "H", invertida: false },
  { resposta: "UC", dica: "Parte do processador que comanda e coordena o funcionamento dos outros componentes.", linha: 12, coluna: 3, dir: "H", invertida: false },
  { resposta: "CACHE", dica: "Memória rápida que guarda cópias de dados usados com frequência pelo processador.", linha: 8, coluna: 4, dir: "V", invertida: true },
  { resposta: "DUALCORE", dica: "Processador com dois núcleos no mesmo chip, capaz de executar tarefas em paralelo.", linha: 13, coluna: 8, dir: "H", invertida: false }
];

var celulas = {};
var palavraAtiva = null;
var direcaoPreferida = "H";
var ultimoClique = "";

var tabuleiroEl = document.getElementById("board");
var contadorEl = document.getElementById("counter");
var dicasHEl = document.getElementById("clues-h");
var dicasVEl = document.getElementById("clues-v");

function prepararPalavras() {
  for (var i = 0; i < PALAVRAS.length; i++) {
    var palavra = PALAVRAS[i];
    palavra.casas = [];
    palavra.status = null;

    for (var j = 0; j < palavra.resposta.length; j++) {
      var linha = palavra.linha;
      var coluna = palavra.coluna;

      if (palavra.dir === "H") {
        coluna = palavra.invertida ? palavra.coluna + palavra.resposta.length - 1 - j : palavra.coluna + j;
      } else {
        linha = palavra.invertida ? palavra.linha + palavra.resposta.length - 1 - j : palavra.linha + j;
      }

      palavra.casas.push([linha, coluna]);
    }
  }

  for (var i = 0; i < PALAVRAS.length; i++) {
    var palavra = PALAVRAS[i];
    for (var j = 0; j < palavra.casas.length; j++) {
      var chave = palavra.casas[j][0] + "," + palavra.casas[j][1];
      if (!celulas[chave]) {
        celulas[chave] = { linha: palavra.casas[j][0], coluna: palavra.casas[j][1], palavras: [], input: null, el: null, numero: null };
      }
      celulas[chave].palavras.push(palavra);
    }
  }
}

function colocarNumeros() {
  var numero = 0;
  for (var linha = 0; linha < TAMANHO; linha++) {
    for (var coluna = 0; coluna < TAMANHO; coluna++) {
      var celula = celulas[linha + "," + coluna];
      if (!celula) continue;

      var comecaAqui = false;
      for (var i = 0; i < celula.palavras.length; i++) {
        var p = celula.palavras[i];
        if (p.casas[0][0] === linha && p.casas[0][1] === coluna) comecaAqui = true;
      }

      if (comecaAqui) {
        numero++;
        celula.numero = numero;
      }
    }
  }

  for (var i = 0; i < PALAVRAS.length; i++) {
    var inicio = PALAVRAS[i].casas[0];
    PALAVRAS[i].numero = celulas[inicio[0] + "," + inicio[1]].numero;
  }
}

function montarTabuleiro() {
  tabuleiroEl.innerHTML = "";

  for (var linha = 0; linha < TAMANHO; linha++) {
    for (var coluna = 0; coluna < TAMANHO; coluna++) {
      var celula = celulas[linha + "," + coluna];
      var div = document.createElement("div");
      div.className = "cell";

      if (!celula) {
        div.className = "cell cell--void";
        div.setAttribute("aria-hidden", "true");
        tabuleiroEl.appendChild(div);
        continue;
      }

      celula.el = div;

      if (celula.numero) {
        var spanNumero = document.createElement("span");
        spanNumero.className = "cell-number";
        spanNumero.textContent = celula.numero;
        div.appendChild(spanNumero);
      }

      var input = document.createElement("input");
      input.className = "cell-input";
      input.type = "text";
      input.maxLength = 1;
      input.autocomplete = "off";
      input.autocapitalize = "characters";
      input.spellcheck = false;

      celula.input = input;
      div.appendChild(input);
      tabuleiroEl.appendChild(div);
    }
  }
}

function montarPistas() {
  dicasHEl.innerHTML = "";
  dicasVEl.innerHTML = "";

  var horizontais = [];
  var verticais = [];
  for (var i = 0; i < PALAVRAS.length; i++) {
    if (PALAVRAS[i].dir === "H") horizontais.push(PALAVRAS[i]);
    else verticais.push(PALAVRAS[i]);
  }

  horizontais.sort(function (a, b) { return a.numero - b.numero; });
  verticais.sort(function (a, b) { return a.numero - b.numero; });

  function criarPista(palavra, lista) {
    var item = document.createElement("li");
    var botao = document.createElement("button");
    botao.type = "button";
    botao.className = "clue";

    var numero = document.createElement("span");
    numero.className = "clue-number";
    numero.textContent = palavra.numero;

    var texto = document.createElement("span");
    texto.className = "clue-text";
    texto.textContent = palavra.dica;

    if (palavra.invertida) {
      var tag = document.createElement("span");
      tag.className = "clue-tag";
      tag.textContent = palavra.dir === "H" ? " ← de trás para frente" : " ↑ de baixo para cima";
      texto.appendChild(tag);
    }

    botao.appendChild(numero);
    botao.appendChild(texto);
    botao.addEventListener("click", function () { selecionarPalavra(palavra); });

    palavra.botaoPista = botao;
    item.appendChild(botao);
    lista.appendChild(item);
  }

  for (var i = 0; i < horizontais.length; i++) criarPista(horizontais[i], dicasHEl);
  for (var i = 0; i < verticais.length; i++) criarPista(verticais[i], dicasVEl);
}

function atualizarDestaque() {
  for (var chave in celulas) celulas[chave].el.classList.remove("is-active");
  for (var i = 0; i < PALAVRAS.length; i++) {
    if (PALAVRAS[i].botaoPista) PALAVRAS[i].botaoPista.classList.remove("is-active");
  }

  if (!palavraAtiva) return;

  for (var i = 0; i < palavraAtiva.casas.length; i++) {
    var casa = palavraAtiva.casas[i];
    celulas[casa[0] + "," + casa[1]].el.classList.add("is-active");
  }
  if (palavraAtiva.botaoPista) palavraAtiva.botaoPista.classList.add("is-active");
}

function focarPalavra(palavra) {
  var alvo = palavra.casas[0];
  for (var i = 0; i < palavra.casas.length; i++) {
    var casa = palavra.casas[i];
    if (celulas[casa[0] + "," + casa[1]].input.value === "") {
      alvo = casa;
      break;
    }
  }
  celulas[alvo[0] + "," + alvo[1]].input.focus();
}

function selecionarPalavra(palavra) {
  palavraAtiva = palavra;
  direcaoPreferida = palavra.dir;
  ultimoClique = "";
  atualizarDestaque();
  focarPalavra(palavra);
}

function escolherPalavra(linha, coluna, alternar) {
  var celula = celulas[linha + "," + coluna];
  if (!celula) return;

  var opcoes = celula.palavras;
  var escolhida = palavraAtiva;

  if (alternar && opcoes.length > 1 && palavraAtiva && opcoes.indexOf(palavraAtiva) !== -1) {
    escolhida = opcoes[0] === palavraAtiva ? opcoes[1] : opcoes[0];
  } else if (!palavraAtiva || opcoes.indexOf(palavraAtiva) === -1) {
    escolhida = opcoes[0];
    for (var i = 0; i < opcoes.length; i++) {
      if (opcoes[i].dir === direcaoPreferida) {
        escolhida = opcoes[i];
        break;
      }
    }
  }

  palavraAtiva = escolhida;
  direcaoPreferida = escolhida.dir;
  atualizarDestaque();
}

function moverDentroDaPalavra(linha, coluna, passo) {
  if (!palavraAtiva) return;
  var indice = -1;
  for (var i = 0; i < palavraAtiva.casas.length; i++) {
    if (palavraAtiva.casas[i][0] === linha && palavraAtiva.casas[i][1] === coluna) indice = i;
  }
  if (indice === -1) return;
  var novoIndice = indice + passo;
  if (novoIndice < 0 || novoIndice >= palavraAtiva.casas.length) return;
  var proxima = palavraAtiva.casas[novoIndice];
  celulas[proxima[0] + "," + proxima[1]].input.focus();
}

function acharCelulaNaDirecao(linha, coluna, dLinha, dColuna) {
  var l = linha + dLinha;
  var c = coluna + dColuna;
  while (l >= 0 && l < TAMANHO && c >= 0 && c < TAMANHO) {
    if (celulas[l + "," + c]) return [l, c];
    l += dLinha;
    c += dColuna;
  }
  return null;
}

function limparStatusDaCelula(linha, coluna) {
  var celula = celulas[linha + "," + coluna];
  if (!celula) return;
  var mudou = false;
  for (var i = 0; i < celula.palavras.length; i++) {
    if (celula.palavras[i].status !== null) {
      celula.palavras[i].status = null;
      mudou = true;
    }
  }
  if (mudou) atualizarStatus();
}

function atualizarStatus() {
  for (var chave in celulas) {
    var celula = celulas[chave];
    var temErro = false;
    var tudoCerto = true;
    for (var i = 0; i < celula.palavras.length; i++) {
      var st = celula.palavras[i].status;
      if (st === "wrong") temErro = true;
      if (st !== "correct") tudoCerto = false;
    }
    celula.el.classList.toggle("is-correct", !temErro && tudoCerto);
    celula.el.classList.toggle("is-wrong", temErro);
  }

  var corretas = 0;
  for (var i = 0; i < PALAVRAS.length; i++) {
    var palavra = PALAVRAS[i];
    if (palavra.status === "correct") corretas++;
    if (palavra.botaoPista) {
      palavra.botaoPista.classList.toggle("is-correct", palavra.status === "correct");
      palavra.botaoPista.classList.toggle("is-wrong", palavra.status === "wrong");
    }
  }

  contadorEl.textContent = corretas + " de " + PALAVRAS.length + " palavras";
}

function conferirRespostas() {
  for (var i = 0; i < PALAVRAS.length; i++) {
    var palavra = PALAVRAS[i];
    var digitada = "";
    var completa = true;

    for (var j = 0; j < palavra.casas.length; j++) {
      var casa = palavra.casas[j];
      var valor = celulas[casa[0] + "," + casa[1]].input.value;
      if (valor === "") completa = false;
      digitada += valor;
    }

    if (!completa) palavra.status = "incomplete";
    else if (digitada === palavra.resposta) palavra.status = "correct";
    else palavra.status = "wrong";
  }

  atualizarStatus();
}

function reiniciarCruzadinha() {
  for (var chave in celulas) {
    celulas[chave].input.value = "";
    celulas[chave].el.classList.remove("is-active", "is-correct", "is-wrong");
  }
  for (var i = 0; i < PALAVRAS.length; i++) {
    PALAVRAS[i].status = null;
    if (PALAVRAS[i].botaoPista) PALAVRAS[i].botaoPista.classList.remove("is-active", "is-correct", "is-wrong");
  }
  palavraAtiva = null;
  direcaoPreferida = "H";
  ultimoClique = "";
  if (document.activeElement && document.activeElement.classList.contains("cell-input")) document.activeElement.blur();
  atualizarStatus();
}

function ligarEventosCruzadinha() {
  for (var chave in celulas) {
    (function (celula) {
      var input = celula.input;

      input.addEventListener("focus", function () {
        escolherPalavra(celula.linha, celula.coluna, false);
      });

      input.addEventListener("click", function () {
        var chaveAtual = celula.linha + "," + celula.coluna;
        var alternar = celula.palavras.length > 1 && ultimoClique === chaveAtual;
        escolherPalavra(celula.linha, celula.coluna, alternar);
        ultimoClique = chaveAtual;
      });

      input.addEventListener("input", function () {
        var letra = input.value.replace(/[^a-zA-Z]/g, "");
        letra = letra.slice(-1).toUpperCase();
        input.value = letra;
        limparStatusDaCelula(celula.linha, celula.coluna);
        if (letra !== "") moverDentroDaPalavra(celula.linha, celula.coluna, 1);
      });

      input.addEventListener("keydown", function (event) {
        if (event.key === "Backspace") {
          if (input.value !== "") return;
          event.preventDefault();
          if (!palavraAtiva) return;

          var indice = -1;
          for (var i = 0; i < palavraAtiva.casas.length; i++) {
            if (palavraAtiva.casas[i][0] === celula.linha && palavraAtiva.casas[i][1] === celula.coluna) indice = i;
          }
          if (indice > 0) {
            var anterior = palavraAtiva.casas[indice - 1];
            var celulaAnterior = celulas[anterior[0] + "," + anterior[1]];
            celulaAnterior.input.value = "";
            limparStatusDaCelula(anterior[0], anterior[1]);
            celulaAnterior.input.focus();
          }
          return;
        }

        if (event.key === "Enter") {
          event.preventDefault();
          conferirRespostas();
          return;
        }

        var direcao = null;
        if (event.key === "ArrowUp") direcao = [-1, 0];
        if (event.key === "ArrowDown") direcao = [1, 0];
        if (event.key === "ArrowLeft") direcao = [0, -1];
        if (event.key === "ArrowRight") direcao = [0, 1];

        if (direcao) {
          event.preventDefault();
          var alvo = acharCelulaNaDirecao(celula.linha, celula.coluna, direcao[0], direcao[1]);
          if (alvo) celulas[alvo[0] + "," + alvo[1]].input.focus();
        }
      });
    })(celulas[chave]);
  }
}

var BUSCA_PALAVRAS = [
  "CPU", "ULA", "UC", "REGISTRADORES", "RAM", "ROM", "EEPROM", "FLASH",
  "CACHE", "MEMORIADEMASSA", "DMA", "ADDRESSBUS", "DATABUS", "MICROCONTROLADOR", "DUALCORE", "QUADCORE"
];

var GRADE_BUSCA = [
  "JOLRVPLDALDXRIEMAMWM",
  "QUFVLQHLWAXNOUATOVYJ",
  "VXLEEPROMNLKGKWUCPUF",
  "DIVANGSNKVZLNIKVGYCG",
  "TLWFKXUTOQANZKLFIHXT",
  "UQKLJSVQWHKVDATABUSM",
  "NXFAMKJWZDERNHZZVNLE",
  "YZASUDSFFVMATEKPRCLM",
  "LKPHJWTWSEEMWWJNEYSO",
  "PTHXEJYGIIFAXRQEGVNR",
  "BIFZBCXSURWVPWOOIXMI",
  "RVGQQIEGBOHTDPWMSLCA",
  "MICROCONTROLADORTAZD",
  "QUADCOREOKOYPKIVRGRE",
  "ADDRESSBUSEDRKJWAFTM",
  "TUZLNZJCXPFMISCYDLTA",
  "IJDUALCOREJAQIAXOCCS",
  "GNCSCINMXQOKIDCGRZZS",
  "ODLWIUCXAWPZSSHGEYDA",
  "UNZZNSCYAHPSZPERSHYW"
];

var buscaTabuleiroEl = document.getElementById("ws-board");
var buscaContadorEl = document.getElementById("ws-counter");
var buscaListaEl = document.getElementById("ws-words");

var buscaCelulas = [];
var palavrasAchadas = [];
var inicioSelecao = null;
var selecaoAtual = [];
var inicioPendente = null;

function montarCacaPalavras() {
  buscaTabuleiroEl.innerHTML = "";
  buscaListaEl.innerHTML = "";
  buscaCelulas = [];

  for (var linha = 0; linha < 20; linha++) {
    for (var coluna = 0; coluna < 20; coluna++) {
      var div = document.createElement("div");
      div.className = "ws-cell";
      div.textContent = GRADE_BUSCA[linha][coluna];
      div.dataset.row = linha;
      div.dataset.col = coluna;
      buscaTabuleiroEl.appendChild(div);
      buscaCelulas.push(div);
    }
  }

  for (var i = 0; i < BUSCA_PALAVRAS.length; i++) {
    var item = document.createElement("li");
    item.className = "ws-word";
    item.dataset.word = BUSCA_PALAVRAS[i];
    item.textContent = BUSCA_PALAVRAS[i];
    buscaListaEl.appendChild(item);
  }
}

function pegarCelulaBusca(linha, coluna) {
  return buscaCelulas[linha * 20 + coluna];
}

function linhaReta(inicio, fim) {
  var dLinha = fim[0] - inicio[0];
  var dColuna = fim[1] - inicio[1];
  var ehReta = dLinha === 0 || dColuna === 0 || Math.abs(dLinha) === Math.abs(dColuna);
  if (!ehReta) return null;

  var passos = Math.max(Math.abs(dLinha), Math.abs(dColuna));
  var passoLinha = dLinha === 0 ? 0 : dLinha / Math.abs(dLinha);
  var passoColuna = dColuna === 0 ? 0 : dColuna / Math.abs(dColuna);

  var linha = [];
  for (var i = 0; i <= passos; i++) {
    linha.push([inicio[0] + passoLinha * i, inicio[1] + passoColuna * i]);
  }
  return linha;
}

function limparSelecaoBusca() {
  for (var i = 0; i < selecaoAtual.length; i++) {
    var casa = selecaoAtual[i];
    pegarCelulaBusca(casa[0], casa[1]).classList.remove("is-selecting");
  }
  selecaoAtual = [];
}

function destacarSelecao(linha) {
  limparSelecaoBusca();
  selecaoAtual = linha;
  for (var i = 0; i < linha.length; i++) {
    pegarCelulaBusca(linha[i][0], linha[i][1]).classList.add("is-selecting");
  }
}

function posicaoDoEvento(event) {
  var elemento = document.elementFromPoint(event.clientX, event.clientY);
  if (!elemento) return null;
  var celula = elemento.closest(".ws-cell");
  if (!celula) return null;
  return [Number(celula.dataset.row), Number(celula.dataset.col)];
}

function atualizarContadorBusca() {
  buscaContadorEl.textContent = palavrasAchadas.length + " de " + BUSCA_PALAVRAS.length + " palavras encontradas";
}

function finalizarSelecao(linha) {
  if (!linha || linha.length === 0) return;

  var texto = "";
  for (var i = 0; i < linha.length; i++) texto += GRADE_BUSCA[linha[i][0]][linha[i][1]];
  var textoInvertido = texto.split("").reverse().join("");

  for (var i = 0; i < BUSCA_PALAVRAS.length; i++) {
    var palavra = BUSCA_PALAVRAS[i];
    if (palavrasAchadas.indexOf(palavra) !== -1) continue;

    if (texto === palavra || textoInvertido === palavra) {
      palavrasAchadas.push(palavra);
      for (var j = 0; j < linha.length; j++) pegarCelulaBusca(linha[j][0], linha[j][1]).classList.add("is-found");

      var itens = buscaListaEl.querySelectorAll(".ws-word");
      for (var k = 0; k < itens.length; k++) {
        if (itens[k].dataset.word === palavra) itens[k].classList.add("is-found");
      }

      atualizarContadorBusca();
      return;
    }
  }
}

function reiniciarBusca() {
  palavrasAchadas = [];
  limparSelecaoBusca();
  inicioSelecao = null;
  inicioPendente = null;

  for (var i = 0; i < buscaCelulas.length; i++) buscaCelulas[i].classList.remove("is-selecting", "is-found");
  var itens = buscaListaEl.querySelectorAll(".ws-word");
  for (var i = 0; i < itens.length; i++) itens[i].classList.remove("is-found");

  atualizarContadorBusca();
}

function ligarEventosBusca() {
  buscaTabuleiroEl.addEventListener("pointerdown", function (event) {
    var pos = posicaoDoEvento(event);
    if (!pos) return;

    event.preventDefault();
    if (buscaTabuleiroEl.setPointerCapture) {
      try { buscaTabuleiroEl.setPointerCapture(event.pointerId); } catch (e) {}
    }

    if (inicioPendente && (inicioPendente[0] !== pos[0] || inicioPendente[1] !== pos[1])) {
      var linha = linhaReta(inicioPendente, pos);
      inicioPendente = null;
      inicioSelecao = null;
      limparSelecaoBusca();
      finalizarSelecao(linha);
      return;
    }

    inicioSelecao = pos;
    inicioPendente = null;
    destacarSelecao([pos]);
  });

  buscaTabuleiroEl.addEventListener("pointermove", function (event) {
    if (!inicioSelecao) return;
    var pos = posicaoDoEvento(event);
    if (!pos) return;
    var linha = linhaReta(inicioSelecao, pos);
    if (linha) destacarSelecao(linha);
  });

  buscaTabuleiroEl.addEventListener("pointerup", function (event) {
    if (!inicioSelecao) return;

    var pos = posicaoDoEvento(event);
    var linha = null;
    if (pos) linha = linhaReta(inicioSelecao, pos);

    if (linha && linha.length > 1) {
      finalizarSelecao(linha);
      limparSelecaoBusca();
      inicioSelecao = null;
      inicioPendente = null;
      return;
    }

    if (selecaoAtual.length > 1) {
      finalizarSelecao(selecaoAtual);
      limparSelecaoBusca();
      inicioSelecao = null;
      inicioPendente = null;
      return;
    }

    inicioPendente = inicioSelecao;
    inicioSelecao = null;
  });

  buscaTabuleiroEl.addEventListener("pointercancel", function () {
    limparSelecaoBusca();
    inicioSelecao = null;
  });

  document.getElementById("ws-reset-btn").addEventListener("click", reiniciarBusca);
}

function iniciar() {
  montarCacaPalavras();
  ligarEventosBusca();
  atualizarContadorBusca();

  prepararPalavras();
  colocarNumeros();
  montarTabuleiro();
  montarPistas();
  ligarEventosCruzadinha();

  document.getElementById("check-btn").addEventListener("click", conferirRespostas);
  document.getElementById("reset-btn").addEventListener("click", reiniciarCruzadinha);

  atualizarStatus();
}

iniciar();
