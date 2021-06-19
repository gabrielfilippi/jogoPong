//ELEMENTOS
let vBall, vCpu, vPlayer;

// CONTROLE DE ANIMAÇÃO
let game, frames;

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
let velBall, velCpu, velPlayer

//CONTROLE
let playerPoints = 0;
let cpuPoints = 0;

game = false;

$(document).ready(function() {

    $(document).keydown(function( event ){
        let key = event.keyCode;
        if(key==38){ // CIMA
            dirPlayerY = -1;
        }else if(key == 40){ // BAIXO
            dirPlayerY = +1;
        }
    });
    
    $(document).keyup(function( event ){
        let key = event.keyCode;
        if(key==38){ // CIMA
            dirPlayerY = 0;
        }else if(key == 40){
            dirPlayerY = 0;
        }
    });

    initElements();
});

function initElements(){
    //atribuimos os elementos a cada variavel
    vPlayer = $("#divPlayer");
    vCpu = $("#divCpu");
    vBall = $("#divBall");    

    $("#btnInitGame").on("click", function(){
        initGame();
    });
}

function initGame(){
    if(!game){
        velBall = 8;
        velCpu = 8;
        velPlayer = 8;
        //se nao cancelarmos vai ficar uma chamada em cima da outra, de uma vai pra duas, de duas vai pra 3...
        cancelAnimationFrame(frames);

        game = true;
        dirPlayerY = 0;
        ballY = 0;
        //fizemos um random simples para fazer um "sorteio" se a bola vai para esquerda ou direita.
        if((Math.random()*10) < 5){ //esquerda
            ballX = -1;
        }else{ //direita
            ballX = 1;
        }
        posPlayerX = posPlayerInitX;
        posCpuX = posCpuInitX;
        posBallX = posBallInitX;
        posBallY = posBallInitY;
        posPlayerY = posPlayerInitY;
        posCpuY = posCpuInitY;
        controllGame();
    }
}

function controllGame(){
    if(game){
        controllPlayer();
        controllBall();
        controllCpu();
    }

    frames = requestAnimationFrame(controllGame);
}

function controllPlayer(){
    if(game){
        posPlayerY += velPlayer * dirPlayerY;
        //breakar a barra para nao passar do limite do campo
        if( (posPlayerY+barHeight >= pongFieldH) || (posPlayerY <= 0) ){
            posPlayerY += (velPlayer * dirPlayerY) * (-1); // o negativo eh para a barra voltar no sentido ao contrario quando bater no limite do campo 
        }
        vPlayer.css("top", posPlayerY + "px");
    }
}

function controllBall(){
    //MOVIMENTACAO DA BOLA 
    posBallX += velBall * ballX;
    posBallY += velBall * ballY;

    //Colisao com o jogador (Barra)
    if( 
        (posBallX <= posPlayerX + barWidth) && 
        ( (posBallY + ballHeight) >= posPlayerY) && (posBallY <= posPlayerY + barHeight) ){
        //quanto mais no centro bater , mais reto a bola vai.
        //quanto mais no extremo a bola bater mais rapido e na diagonal (eixo Y) ele vai ir
        
        ballY = (((posBallY + (ballHeight / 2)) - (posPlayerY + (ballHeight / 2))) / 32); //16 => as partes em que queremos dividir a barrinha
        ballX *= -1;
    }

    //Colisao com o CPU (Barra)
    if( 
        (posBallX >= posCpuX - barWidth) && 
        ( (posBallY + ballHeight) >= posCpuY) && (posBallY <= posCpuY + barHeight) ){
        //quanto mais no centro bater , mais reto a bola vai.
        //quanto mais no extremo a bola bater mais rapido e na diagonal (eixo Y) ele vai ir
        
        ballY = (((posBallY + (ballHeight / 2)) - (posCpuY + (ballHeight / 2))) / 25); //16 => as partes em que queremos dividir a barrinha
        ballX *= -1;
    }

    //Colisao com os limites superior/inferiores (para nao sair do limite do campo)
    if ( (posBallY >= 480) || (posBallY <=0 ) ){
        ballY *= -1;
    }
    
    //Quando sair dos limites do GOL (direita/esquerda), eh ponto.
    if(posBallX >= (pongFieldW - ballWidth)){
        velBall=0;
        posBallX = posBallInitX;
        posBallY = posBallInitY;
        posPlayerY =posPlayerInitY;
        posCpuY = posCpuInitY;
        playerPoints ++;
        $("#pointsPlayerBoard").html(playerPoints);
        game = false;
        vPlayer.css("top", posPlayerY + "px");
        vCpu.css("top", posCpuY + "px");
    }else if(posBallX <= 0){
        velBall=0;
        posBallX = posBallInitX;
        posBallY = posBallInitY;
        posPlayerY = posPlayerInitY;
        posCpuY = posCpuInitY;
        cpuPoints ++;
        $("#pointsCpuBoard").html(cpuPoints);
        game = false;
        vPlayer.css("top", posPlayerY + "px");
        vCpu.css("top", posCpuY + "px");
    }

    vBall.css("top", posBallY+"px");
    vBall.css("left", posBallX+"px");
}

function controllCpu(){
    //Se a posicao X da bola for maio que a metade do campo e a bola estiver indo para a direita
    if((posBallX > (pongFieldW/2)) && (ballX > 0)){
        //movemos a CPU
        if(((posBallY + (ballHeight/2)) > ((posCpuY + (barHeight/2))) + velCpu )){
            //movemos para baixo
            if( (posCpuY+barHeight) <= pongFieldH){
                posCpuY +=velCpu;
            }
        }else if( (posBallY + (ballHeight/2)) < (posCpuY + (barHeight/2)) -velCpu ){
            //movemos para baixo
            if( posCpuY >= 0){
                posCpuY -=velCpu;
            }
        }
    }else{
        //posicionamos a CPU no centro
        if( (posCpuY + (barHeight/2)) < (pongFieldH/2) ){
            posCpuY += velCpu;
        }else if( (posCpuY + (barHeight/2)) > (pongFieldH/2) ){
            posCpuY -= velCpu;
        }
    }
    $(vCpu).css("top", posCpuY+"px");
}