const tasklistButton = document.getElementById("tasklist-button");
const tasklistPanel = document.getElementById("tasklist-panel");

tasklistButton.addEventListener("click", function() {
    if (tasklistPanel.style.display === "none") {
        tasklistPanel.style.display = "block";
    } else {
        tasklistPanel.style.display = "none";
    }
});

const musicButton = document.getElementById("music-button");
const musicPanel = document.getElementById("music-panel");

musicButton.addEventListener("click", function() {
    if (musicPanel.style.display === "none") {
        musicPanel.style.display = "block";
    } else {
        musicPanel.style.display = "none";
    }
});

const statsButton = document.getElementById("stats-button");
const statsPanel = document.getElementById("stats-panel");

statsButton.addEventListener("click", function() {
    if (statsPanel.style.display === "none") {
        statsPanel.style.display = "block";
    } else {
        statsPanel.style.display = "none";
    }
});

const screenButton = document.getElementById("fullscreen-button");
const layout = document.getElementById("page-content");

screenButton.addEventListener("click", function() {
    // entrando no modo de tela cheia
    if (!document.fullscreenElement) {
        if (layout.requestFullscreen) {
            layout.requestFullscreen();
        } else if (layout.mozRequestFullScreen) {
            layout.mozRequestFullScreen();
        } else if (layout.webkitRequestFullscreen) {
            layout.webkitRequestFullscreen();
        } else if (layout.msRequestFullscreen) {
            layout.msRequestFullscreen();
        }
    } else { // saindo do modo tela cheia
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
});

// botão de som
// adiciona um ouvinte de eventos de clique em todos os botões com a classe "button-sound"
document.querySelectorAll(".button-sound").forEach(button => {
    button.addEventListener("click", function() {
        const focusEffect = "active-button";

        // se o botão clicado ja tiver ativo, retira efeito de foco
        if (button.classList.contains(focusEffect)) {
            button.classList.remove(focusEffect);
            stopSound(button.querySelector("audio").id);
        }
        else {
            // remove classe especial de todos os botões
            document.querySelectorAll(".button-sound").forEach(button => {
                button.classList.remove(focusEffect);
                stopSound(button.querySelector("audio").id);
            });

            // adiciona a classe especial apenas ao botão clicado
            button.classList.add(focusEffect);
            playSound(button.querySelector("audio").id);
        }
    });
});

function playSound(soundId) {
    var audio = document.getElementById(soundId);
    audio.setAttribute("loop", "true");
    audio.play();
}

function stopSound(soundId) {
    var audio = document.getElementById(soundId);
    audio.pause();
    audio.currentTime = 0;
}

function changeSoundVolume(soundId, volume) {
    var audio = document.getElementById(soundId);
    audio.volume = volume / 100;
}

const volumeSllider = document.getElementById("volume-slider");
volumeSllider.addEventListener("input", function() {
    const value = volumeSllider.value;
    const fill = `linear-gradient(to right, var(--fill-slider) ${value}%, var(--fill) ${value}%)`
    
    volumeSllider.style.background = fill;

    // muda o volume do som
    document.querySelectorAll(".button-sound").forEach(sound => {
        const focusEffect = "active-button";
        
        if (sound.classList.contains(focusEffect)) {
            changeSoundVolume(sound.querySelector("audio").id, value);
        }   
    });
})