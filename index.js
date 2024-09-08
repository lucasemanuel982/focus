const html = document.querySelector("html");
const banneer = document.querySelector(".app__image");
const titulo = document.querySelector(".app__title");
const satatuPauseBt = document.querySelector("#start-pause");
const iniciarPausarBt = document.querySelector("#start-pause span");
const iniciarPausarBtIcone = document.querySelector(".app__card-primary-butto-icon");
const tempoNaTela = document.querySelector("#timer");
const validacaoItemSelecionado = document.querySelector(".app__section-task-list");
const valorDoTempo =  document.querySelector(".app__card-timer");

let temporizadorEmSegundos = valorDoTempo.value;
let intervaloId = null;



const musicaFocoInput = document.querySelector("#alternar-musica");
const musica = new Audio('./sons/luna-rise-part-one.mp3')
const audioTempoFinalizado = new Audio('./sons/beep.mp3')
const audioTempoPausa = new Audio('./sons/pause.mp3')
const audioTempoPlay = new Audio('./sons/play.wav ')
musica.loop = true;
musicaFocoInput.addEventListener("change", () => {
    if (musica.paused) {
        musica.play();
    }else{
        musica.pause();
        
    }
})

valorDoTempo.addEventListener('blur', function() {
    const [horas, minutos, segundos] = valorDoTempo.value.split(':').map(Number);
    temporizadorEmSegundos = (horas * 3600) + (minutos * 60) + (segundos || 0);
});

const contagemRegrassiva = () => {
    if (temporizadorEmSegundos <= 0) {
        audioTempoFinalizado.play();
        valorDoTempo.value = '';
        alert("Tempo finalizado");
        const description = document.querySelector(".app__section-active-task-description");
        description.textContent = ''
        const focoAtivo = html.getAttribute("data-contexto") == 'foco';
        if (focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado');
            document.dispatchEvent(evento);
        }
        zerar();
        return;
    }
    
    temporizadorEmSegundos -= 1; 
    
    // Atualiza o campo de input com o tempo formatado
    const horas = Math.floor(temporizadorEmSegundos / 3600);
    const minutos = Math.floor((temporizadorEmSegundos % 3600) / 60);
    const segundos = temporizadorEmSegundos % 60;

    valorDoTempo.value = 
        String(horas).padStart(2, '0') + ':' + 
        String(minutos).padStart(2, '0') + ':' + 
        String(segundos).padStart(2, '0');
};


satatuPauseBt.addEventListener("click", iniciarPausar)    

function iniciarPausar() {
    // valorDoTempo.length
    console.log(valorDoTempo.length);
    console.log(valorDoTempo.value);
    const classeAtivada = document.querySelectorAll('.app__section-task-list-item-active');
    
    if (classeAtivada.length > 0 ) {
        if (intervaloId) {
            audioTempoPausa.play();
            zerar();
            return;
        }

        // Inicia o temporizador
        intervaloId = setInterval(contagemRegrassiva, 1000); // Executa a contagem a cada 1 segundo
        audioTempoPlay.play();
        iniciarPausarBt.innerHTML = '<strong>Pausar</strong>';
        iniciarPausarBtIcone.setAttribute("src", "./imagens/pause.png");
    } else if (valorDoTempo.value  == 0) {
        showAlert('Necessário informar o tempo que deseja!', 'yellow');
    } else if (valorDoTempo.value  == "00:00:00") {
        showAlert('Tempo Inválido!', 'yellow');
    } else if (classeAtivada.length  == 0) {
        showAlert('Necessário selecionar uma task!', 'yellow');
    }
}


function zerar() {
    clearInterval(intervaloId); // Para o intervalo
    iniciarPausarBt.innerHTML = '<strong>Começar</strong>';
    iniciarPausarBtIcone.setAttribute("src", "./imagens/play_arrow.png");
    intervaloId = null;
}


function mostrarTempo() {
    const tempo = new Date(temporizadorEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', { hour12: false, minute: '2-digit', second: '2-digit' });
    
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}
mostrarTempo()


document.getElementById('timer').addEventListener('input', function (e) {
    let input = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
    
    if (input.length <= 2) {
        e.target.value = input; // Apenas horas
    } else if (input.length <= 4) {
        e.target.value = input.slice(0, 2) + ':' + input.slice(2); // Horas e minutos
    } else if (input.length <= 6) {
        e.target.value = input.slice(0, 2) + ':' + input.slice(2, 4) + ':' + input.slice(4); // Horas, minutos e segundos
    }
});

