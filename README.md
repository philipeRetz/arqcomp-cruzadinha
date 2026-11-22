# Cruzadinha de Arquitetura Computacional

Jogo de caça-palavras e cruzadinha 

## Como jogar

- No **caça-palavras**, clique na primeira e depois na última para marcar uma palavra na horizontal, vertical ou diagonal.
- As palavras encontradas ficam verdes no caça-palavras e são marcadas na lista; use **Reiniciar caça-palavras** para limpar.
- Na **cruzadinha**, leia as pistas nas seções **Horizontais** e **Verticais**.
- Clique em uma pista ou em uma casa do tabuleiro e digite as letras.
- Em casas de cruzamento, clique novamente na mesma casa para alternar entre a palavra horizontal e a vertical.
- Use **Backspace** e as setas do teclado para navegar.
- Clique em **Conferir** para ver as palavras certas e erradas e atualizar o contador.
- Palavras incompletas permanecem neutras até serem preenchidas por completo.
- Clique em **Reiniciar** para limpar a cruzadinha.
- Pistas com **←** devem ser lidas da direita para a esquerda; pistas com **↑**, de baixo para cima.

## Tabuleiro da cruzadinha

- Grade **20x20** (as casas sem letras ficam ocultas).
- **12 palavras**, distribuídas na horizontal e na vertical.
- **5 palavras se cruzam diretamente.**
- **Duas palavras aparecem de trás para frente.**
- **Palavras utilizadas e suas dicas:** "RAM", dica: "Memória principal volátil, onde ficam os programas em execução." 
"REGISTRADORES", dica: "Memórias internas ultrarrápidas do processador, usadas durante a execução."  
"CPU", dica: "Circuito que busca, decodifica e executa as instruções de um programa."  
"DATABUS", dica: "Vias que levam o conteúdo efetivamente lido ou gravado na memória."  
"DMA", dica: "Técnica que transfere dados entre periféricos e memória sem passar pelo processador."  
"ROM", dica: "Memória gravada de fábrica, usada na inicialização e que não pode ser alterada."  
"ADDRESSBUS", dica: "Vias que levam o número da posição de memória a ser acessada."  
"MICROCONTROLADOR", dica: "Chip que reúne processador, memória e periféricos para controlar um dispositivo."  
"ULA", dica: "Parte do processador que faz contas e comparações lógicas."  
"UC", dica: "Setor que gera os sinais de comando e coordena os demais componentes."  
"CACHE", dica: "Memória rápida que guarda cópias de dados muito usados pelo processador."  
"DUALCORE", dica: "Chip com dois núcleos de processamento no mesmo encapsulamento."

## Caça-palavras

- Grade **20x20** com as **16 palavras** do enunciado.
- Palavras em **horizontal, vertical e diagonal** (sempre para a direita, para baixo ou na diagonal descendente).
- As quatro palavras que não estão na cruzadinha aparecem apenas aqui: **EEPROM**, **FLASH**, **MEMORIADEMASSA** e **QUADCORE**.
- Ao encontrar uma palavra, as letras ficam verdes e a palavra é riscada na lista.

## Tecnologias

- HTML5
- CSS
- JavaScript
- Nenhuma biblioteca ou dependência externa

**link para o jogo** - https://philiperetz.github.io/arqcomp-cruzadinha/