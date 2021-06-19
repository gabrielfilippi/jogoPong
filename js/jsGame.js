//ELEMENTOS
let vBall = $("#divBall");
let vCpu = $("#divCpu"); 
let vPlayer = $("#divPlayer");;
let lastPoint = "";
let counter = null;
let countDownInit = 4;
let countDown = 0

// CONTROLE DE ANIMAÇÃO
let frames;

//POSIÇÕES
let posBallX, posBallY;
let posPlayerX, posPlayerY, posCpuX, posCpuY;

//DIREÇÃO DE ACORDO COM A TECLA 
let dirPlayerY;

//POSÇÕES INICIAIS (PARA INICIAR O JOGO)
// Posições iniciais
let posPlayerInitX = 10, posCpuInitX = 930;
let posPlayerInitY = 180, posCpuInitY = 180;
let posBallInitX = 475, posBallInitY = 240;

//TAMANHOS 
let pongFieldX = 0, pongFieldY = 0; pongFieldW = 960, pongFieldH = 500;
let barWidth = 20, barHeight = 140, ballWidth = 20, ballHeight = 20;

//Direção
let ballX, ballY;
let playerY = 0, cpuY = 0;

//VELOCIDADE
let velBall=5;
let velCpu, velPlayer

//CONTROLE
let playerPoints = 0;
let cpuPoints = 0;

let game = false;

$(document).ready(function () {
    //controlamos os eventos das teclas. Quando a tecla for precionado
    $(document).keydown(function (event) {
        let key = event.keyCode;
        if (key == 38) { // CIMA
            dirPlayerY = -1;
        } else if (key == 40) { // BAIXO
            dirPlayerY = +1;
        }
    });

    //controlamos os eventos das teclas. Quando a tecla nao ser mais precionada, soltada.
    $(document).keyup(function (event) {
        let key = event.keyCode;
        if (key == 38) { // CIMA
            dirPlayerY = 0;
        } else if (key == 40) {
            dirPlayerY = 0;
        }
    });

    //quando o botao for clicado iniciamos o jogo
    $("#btnInitGame").on("click", function () {
        clearInterval(counter);
        $(".alert").html("");
        initGame();
    });

    //quando o botao for clicado reiniciamos o jogo fazendo um reload da pagina.
    $("#btnRestartGame").on("click", function () {
        window.location.href = window.location.href;
    });
});

//iniciamos o jogo caso o a variavel game nao for true.
function initGame() {
    if (!game) {
        velBall += 0.5;
        velCpu = 10;
        velPlayer = 10;
        //se nao cancelarmos vai ficar uma chamada em cima da outra, de uma vai pra duas, de duas vai pra 3...
        cancelAnimationFrame(frames);

        game = true;
        dirPlayerY = 0;
        ballY = 0;

        //fizemos um random simples para fazer um "sorteio" se a bola vai para esquerda ou direita.
        if ((Math.random() * 10) < 5) { //esquerda
            ballX = -1;
        } else { //direita
            ballX = 1;
        }

        posPlayerX = posPlayerInitX;
        posCpuX = posCpuInitX;
        posPlayerY = posPlayerInitY;
        posCpuY = posCpuInitY;
        posBallX = posBallInitX;
        posBallY = posBallInitY;
        controllGame();
    }
}

function controllGame() {
    if (game) {
        controllPlayer();
        controllBall();
        controllCpu();
    }

    frames = requestAnimationFrame(controllGame);
}

//controlamos a barra do jogador
function controllPlayer() {
    if (game) {
        posPlayerY += velPlayer * dirPlayerY;
        //breakar a barra para nao passar do limite do campo
        if ((posPlayerY + barHeight >= pongFieldH) || (posPlayerY <= 0)) {
            posPlayerY += (velPlayer * dirPlayerY) * (-1); // o negativo eh para a barra voltar no sentido ao contrario quando bater no limite do campo 
        }
        vPlayer.css("top", posPlayerY + "px");
    }
}

//controlamos a bola e a colisao da mesma
function controllBall() {
    if (game) {
        //MOVIMENTACAO DA BOLA 
        posBallX += velBall * ballX;
        posBallY += velBall * ballY;

        //Colisao com o jogador (Barra)
        if (
            (posBallX <= posPlayerX + barWidth) &&
            ((posBallY + ballHeight >= posPlayerY) && (posBallY <= posPlayerY + barHeight)) ) {
            //quanto mais no centro bater , mais reto a bola vai.
            //quanto mais no extremo a bola bater mais rapido e na diagonal (eixo Y) ele vai ir

            ballY = (((posBallY + (ballHeight / 2)) - (posPlayerY + (ballHeight / 2)+60)) / 20); //16 => as partes em que queremos dividir a barrinha
            ballX *= -1;
        }

        //Colisao com o CPU (Barra)
        if (
            (posBallX >= posCpuX - barWidth) &&
            ((posBallY + ballHeight >= posCpuY) && (posBallY <= posCpuY + barHeight)) ) {
            //quanto mais no centro bater , mais reto a bola vai.
            //quanto mais no extremo a bola bater mais rapido e na diagonal (eixo Y) ele vai ir

            ballY = (((posBallY + (ballHeight / 2)) - (posCpuY + (ballHeight / 2) +60)) / 20); //16 => as partes em que queremos dividir a barrinha
            ballX *= -1;
        }

        //Colisao com os limites superior/inferiores (para nao sair do limite do campo)
        if ((posBallY >= 480) || (posBallY <= 0)) {
            ballY *= -1;
        }

        //Quando sair dos limites do GOL (direita/esquerda), eh ponto.
        if (posBallX >= (pongFieldW - ballWidth)) {
            playerPoints++;
            $("#pointsPlayerBoard").html(playerPoints);
            lastPoint = "player";
            controllPoints();
        } else if (posBallX <= 0) {
            cpuPoints++;
            $("#pointsCpuBoard").html(cpuPoints);
            lastPoint = "cpu";
            controllPoints();
        }

        vBall.css("top", posBallY + "px");
        vBall.css("left", posBallX + "px");
    }

}

//Controlamos a CPU
function controllCpu() {
    if (game) {
        //Se a posicao X da bola for maior que a metade do campo e a bola estiver indo para a direita
        if ((posBallX > (pongFieldW / 2)) && (ballX > 0)) {
            //movemos a CPU
            if (((posBallY + (ballHeight / 2)) > ((posCpuY + (barHeight / 2))) + velCpu)) {
                //movemos para baixo
                if ((posCpuY + barHeight) <= pongFieldH) {
                    posCpuY += velCpu;
                }
            } else if ((posBallY + (ballHeight / 2)) < (posCpuY + (barHeight / 2)) - velCpu) {
                //movemos para baixo
                if (posCpuY >= 0) {
                    posCpuY -= velCpu;
                }
            }
        } else {
            //posicionamos a CPU no centro
            if ((posCpuY + (barHeight / 2)) < (pongFieldH / 2)) {
                posCpuY += velCpu;
            } else if ((posCpuY + (barHeight / 2)) > (pongFieldH / 2)) {
                posCpuY -= velCpu;
            }
        }
        $(vCpu).css("top", posCpuY + "px");
    }
}

// controla os pontos do jogador e cpu
function controllPoints() {
    clearInterval(counter);
    if (playerPoints == 10) {
        $(".alert").css("color", "#0e9118")
        $(".alert").html("Parabéns você ganhou!");
        resetGame();
    } else if (cpuPoints == 10) {
        $(".alert").css("color", "#931111")
        $(".alert").html("Parece que não foi desta vez que você ganhou da CPU!");
        resetGame();
    } else {
        resertRound();
    }
}

//paramos o jogo e mostramos o botao de "Jogar Novamente"
function resetGame() {
    game = false;
    $(".divBtnStart").hide();
    $(".divBtnReload").show();
}

// Reiniciamos a partida quando for ponto.
function resertRound() {
    posBallX = posBallInitX;
    posBallY = posBallInitY;
    posPlayerY = posPlayerInitY;
    posCpuY = posCpuInitY;
    game = false;
    vPlayer.css("top", posPlayerY + "px");
    vCpu.css("top", posCpuY + "px");

    countDown = countDownInit;
    counter = setInterval(timer, 1000);
}

//funcao chamada quando é feito um ponto na partida, mostra quem ganho e reinicia a partida automaticamente
function timer() {
    countDown -= 1;
   
    if (countDown == 0) {
        clearInterval(counter);
        $(".alert").html("");
        initGame();
    }else{
        if (lastPoint == "player") {
            $(".alert").html("Seu ponto, jogo iniciando em: " + countDown + "seg");
        } else {
            $(".alert").html("Ponto da CPU, jogo iniciando em: " + countDown + "seg");
        }
    }

}
