var TAMANHO = 20;

var PALAVRAS = [
  { resposta: "RAM", dica: "Memória principal volátil, onde ficam os programas em execução.", linha: 0, coluna: 17, dir: "H", invertida: false },
  { resposta: "REGISTRADORES", dica: "Memórias internas ultrarrápidas do processador, usadas durante a execução.", linha: 0, coluna: 17, dir: "V", invertida: false },
  { resposta: "CPU", dica: "Circuito que busca, decodifica e executa as instruções de um programa.", linha: 5, coluna: 13, dir: "V", invertida: false },
  { resposta: "DATABUS", dica: "Vias que levam o conteúdo efetivamente lido ou gravado na memória.", linha: 7, coluna: 12, dir: "H", invertida: true },
  { resposta: "DMA", dica: "Técnica que transfere dados entre periféricos e memória sem passar pelo processador.", linha: 9, coluna: 2, dir: "V", invertida: false },
  { resposta: "ROM", dica: "Memória gravada de fábrica, usada na inicialização e que não pode ser alterada.", linha: 9, coluna: 12, dir: "V", invertida: false },
  { resposta: "ADDRESSBUS", dica: "Vias que levam o número da posição de memória a ser acessada.", linha: 9, coluna: 15, dir: "V", invertida: false },
  { resposta: "MICROCONTROLADOR", dica: "Chip que reúne processador, memória e periféricos para controlar um dispositivo.", linha: 10, coluna: 2, dir: "H", invertida: false },
  { resposta: "ULA", dica: "Parte do processador que faz contas e comparações lógicas.", linha: 11, coluna: 0, dir: "H", invertida: false },
  { resposta: "UC", dica: "Setor que gera os sinais de comando e coordena os demais componentes.", linha: 12, coluna: 3, dir: "H", invertida: false },
  { resposta: "CACHE", dica: "Memória rápida que guarda cópias de dados muito usados pelo processador.", linha: 8, coluna: 4, dir: "V", invertida: true },
  { resposta: "DUALCORE", dica: "Chip com dois núcleos de processamento no mesmo encapsulamento.", linha: 13, coluna: 8, dir: "H", invertida: false }
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

function iniciar() {
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
