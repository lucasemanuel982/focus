const html = document.querySelector("html");
// const focoBT = document.querySelector(".app__card-button--foco");
// const curtoBT = document.querySelector(".app__card-button--curto");
// const longoBT = document.querySelector(".app__card-button--longo");
const banneer = document.querySelector(".app__image");
const titulo = document.querySelector(".app__title");
const satatuPauseBt = document.querySelector("#start-pause");
const iniciarPausarBt = document.querySelector("#start-pause span");
const iniciarPausarBtIcone = document.querySelector(".app__card-primary-butto-icon");
const tempoNaTela = document.querySelector("#timer");
const validacaoItemSelecionado = document.querySelector(".app__section-task-list");

let temporizadorEmSegundos = 10;
let intervaloId = null;



const musicaFocoInput = document.querySelector("#alternar-musica");
const musica = new Audio('/sons/luna-rise-part-one.mp3')
const audioTempoFinalizado = new Audio('/sons/beep.mp3')
const audioTempoPausa = new Audio('/sons/pause.mp3')
const audioTempoPlay = new Audio('/sons/play.wav ')
musica.loop = true;
musicaFocoInput.addEventListener("change", () => {
    if (musica.paused) {
        musica.play();
    }else{
        musica.pause();
        
    }
})

// focoBT.addEventListener("click", () => {
//     temporizadorEmSegundos = 10;
//     alterarContexto('foco');
// })

// curtoBT.addEventListener("click", () => {
//     temporizadorEmSegundos = 10;
//     alterarContexto('descanso-curto')
// })

// longoBT.addEventListener("click", () => {
//     temporizadorEmSegundos = 900;
//     alterarContexto('descanso-longo')
// })

// function alterarContexto(contexto) {
//     mostrarTempo()
//     html.setAttribute("data-contexto", contexto);
//     banneer.setAttribute('src', `/imagens/${contexto}.png`);
//     switch (contexto) {
//         case "foco":
//             focoBT.classList.add("active");
//             longoBT.classList.remove("active");
//             curtoBT.classList.remove("active");

//             titulo.innerHTML = `Otimize sua produtividade,<br>
//                 <strong class="app__title-strong">mergulhe no que importa.</strong>
//             `;
//             break;
//         case "descanso-curto":
//             curtoBT.classList.add("active");
//             focoBT.classList.remove("active");
//             longoBT.classList.remove("active");

//             titulo.innerHTML = `Que tal dá uma respirada,<br>
//                     <strong class="app__title-strong">Faça uma pausa curta!</strong>
//                 `;
//             break;
//         case "descanso-longo":
//             longoBT.classList.add("active");
//             focoBT.classList.remove("active");
//             curtoBT.classList.remove("active");

//             titulo.innerHTML = `Hora de voltar a superfície,<br>
//                             <strong class="app__title-strong">Faça uma pausa longa!</strong>
//                         `;
//             break;
//         default:
//             break;
//     }
// }

const contagemRegrassiva = () => {
    if (temporizadorEmSegundos <= 0) {
        audioTempoFinalizado.play();
        alert("Tempo finalizado");
        const description = document.querySelector(".app__section-active-task-description");
        description.textContent = ''
        const focoAtivo = html.getAttribute("data-contexto") == 'foco';
        if (focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado')
            document.dispatchEvent(evento);
        }
        zerar()
        return
    }
    temporizadorEmSegundos -=1
    mostrarTempo()
}

satatuPauseBt.addEventListener("click", iniciarPausar)    

function iniciarPausar() {

    const classeAtivada = document.querySelectorAll('.app__section-task-list-item-active');
    if (classeAtivada.length > 0 ) {
        if (intervaloId){
            audioTempoPausa.play()
            zerar()
            return
        }
        audioTempoPlay.play()
        intervaloId = setInterval(contagemRegrassiva, 1000)
        iniciarPausarBt.innerHTML = '<strong>Pausar</strong>'
        iniciarPausarBtIcone.setAttribute("src", "/imagens/pause.png")
    }else{
        showAlert('Necessário selecionar uma task', 'yellow');
    }
}

function zerar() {
    clearInterval(intervaloId)
    iniciarPausarBt.innerHTML = '<strong>Começar</strong>'
    iniciarPausarBtIcone.setAttribute("src", "/imagens/play_arrow.png")
    intervaloId = null;
}

function mostrarTempo() {
    const tempo = new Date(temporizadorEmSegundos * 1000)
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', {minute: '2-digit', second: '2-digit' } )
    tempoNaTela.innerHTML = `${tempoFormatado}`
}
mostrarTempo()