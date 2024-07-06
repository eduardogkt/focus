// botões de opção (button-opt)
const optButtons = document.querySelectorAll(".button-opt");

// esconde menus de opção (button-opt)
function hideOptionsMenus() {
    optButtons.forEach(function(button) {
        const menu = button.parentNode.childNodes[3];
        console.log(menu.innerHTML);

        menu.style.display = "none";
    })
}

// mostra/esconde menus de opção (button-opt)
optButtons.forEach(function(button) {
    button.addEventListener('click', function() {

        const menu = this.parentNode.querySelector(".opt-menu");

        // caso for o menu de informação de incorporação de playlist
        // display precisa ser block
        const display = 
        (menu.id == "playlist-info-menu") ? "block" : "flex";

        if (menu.style.display === display) {
            menu.style.display = "none";
        } else {
            // esconde todos os menus de opção
            hideOptionsMenus();

            // mostrao menu correspondente
            menu.style.display = display;
        }
    });
});

// hide/show music sections
function toggleSection(buttonId, sectionClass, optName) {
    const button = document.querySelector(buttonId);
    let section = document.querySelector(sectionClass);
    
    button.addEventListener("click", function() {
        const display = section.style.display;
        if (display != "none") {
            section.style.display = "none"
            button.textContent = "Show " + optName;
        } else {
            section.style.display = "block";
            button.textContent = "Hide " + optName;
        }
    });
}

toggleSection("#playlist-opt-hide-playlist-button", ".playlist", "playlist");
toggleSection("#playlist-opt-hide-sounds-button", ".sounds", "sounds");

// botões de painel do menu
function toggleButton(buttonId, panelId, display) {
    const button = document.getElementById(buttonId);
    const menu = document.getElementById(panelId);

    button.addEventListener("click", function() {
        hideOptionsMenus();
        if (menu.style.display === display) {
            menu.style.display = "none";
        } else {
            menu.style.display = display;
        }
    });
}

toggleButton("tasklist-button", "tasklist-panel", "block");
toggleButton("music-button", "music-panel", "block");
toggleButton("stats-button", "stats-panel", "block");
toggleButton("settings-button", "settings-panel", "block");


// botão de tela cheia
const fullscreenButton = document.getElementById("fullscreen-button");
const layout = document.getElementById("page-content");
let isFullscreen = false;

function exitFullscreen() {
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

function enterFullscreen() {
    if (layout.requestFullscreen) {
        layout.requestFullscreen();
    } else if (layout.mozRequestFullScreen) {
        layout.mozRequestFullScreen();
    } else if (layout.webkitRequestFullscreen) {
        layout.webkitRequestFullscreen();
    } else if (layout.msRequestFullscreen) {
        layout.msRequestFullscreen();
    }
}

function changeFullscreenIcon() {
    if (isFullscreen) {
        fullscreenButton.querySelector("img").setAttribute("src", "assets/icons/fullscreen_exit_icon.svg");
    } else {
        fullscreenButton.querySelector("img").setAttribute("src", "assets/icons/fullscreen_icon.svg");
    }
}

function changeFullscreen() {
    if (!isFullscreen) {
        enterFullscreen();
    } else { 
        exitFullscreen();
    }
}

// caso aperto botão do menu
fullscreenButton.addEventListener("click",function() {
    changeFullscreen()
});

// caso aperte atalho f
document.addEventListener("keydown", function(event) {
    if (event.key == "f") {
        changeFullscreen();
    }
});

// caso aperte esc
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && isFullscreen) {
        exitFullscreen();
    }
});

// muda o icone e estado quando muda de tela
document.addEventListener("fullscreenchange", function() {
    isFullscreen = !isFullscreen; // Atualiza o estado quando a mudança de tela cheia ocorre
    changeFullscreenIcon();
});


// botões de som
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
    // salva o campo de background-size
    const backgroundSize = volumeSllider.style.backgroundSize;
    const value = volumeSllider.value;
    const fill = `
    linear-gradient(to right,
                    var(--fill-slider) 0, 
                    var(--fill-slider) ${value}%, 
                    var(--fill)        ${value}%, 
                    var(--fill)        100%)`
    
    volumeSllider.style.background = fill;
    volumeSllider.style.backgroundSize = backgroundSize;

    // muda o volume do som
    document.querySelectorAll(".button-sound").forEach(sound => {
        const focusEffect = "active-button";
        
        if (sound.classList.contains(focusEffect)) {
            changeSoundVolume(sound.querySelector("audio").id, value);
        }   
    });
});

// funções para playlist
const defaultPlaylist = document.querySelector(".playlist-container").textContent;
let addPlaylistButton = document.getElementById("add-playlist-button");

function removePlaylistForm(playlistSection) {
    console.log(playlistSection)

    document.getElementById("add-playlist-section").innerHTML = playlistSection;

    // Adiciona novamente o evento de clique ao botão "Adicionar Playlist"
    let addPlaylistButton = document.getElementById("add-playlist-button");
    addPlaylistButton = document.getElementById("add-playlist-button");
    addPlaylistButton.addEventListener("click", addPlaylist);
    
};

function addPlaylist() {
    const playlistSection = document.getElementById("add-playlist-section").cloneNode(true);
    const playlistSectionCopy = playlistSection.innerHTML;

    let form = 
    ` 
    <form class="form-playlist" action="POST">
    <label for="playlist-input"></label>
    <textarea
        id="input-playlist"
        class="input-playlist" 
        name="playlist-input" 
        rows="5" 
        cols="20" 
        required
        placeholder="Paste the embedding code here."></textarea>
    <div>
        <button class="button button-pill" id="button-playlist-submit" type="button">Send</button>
        <button class="button button-pill" id="button-playlist-cancel" type="button">Cancel</button>
    </div>
    </form>
    `

    let addPlaylistSection = document.getElementById("add-playlist-section");
    addPlaylistSection.innerHTML = form;

    console.log(addPlaylistSection.innerHTML)

    // cancelamento do formulario de playlist
    const cancelPlaylistButton = document.getElementById("button-playlist-cancel");
    cancelPlaylistButton.addEventListener("click", function() {
        removePlaylistForm(playlistSectionCopy)
    });
    
    // enviar playlist personalizada
    const submitPlaylistButton = document.getElementById("button-playlist-submit");
    submitPlaylistButton.addEventListener("click", function() {
        let customPlaylist = document.getElementById("input-playlist").value;
        
        let container = document.querySelector(".playlist-container");
        container.style.backgroundColor = "transparent";
        container.innerHTML = customPlaylist;

        let iframe = document.querySelector(".playlist-container iframe");
        iframe.style.height = "152px";
    
        removePlaylistForm(playlistSectionCopy);
    });
}

addPlaylistButton.addEventListener("click", addPlaylist); 

/* pequeno
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/2j7iCxxDBAxpuZVKoApepZ?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy">
</iframe> 
*/

/* grande
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/2j7iCxxDBAxpuZVKoApepZ?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy">
</iframe>
*/

const timerDisplay = document.querySelector("#timer-clock");
const playButton = document.querySelector("#start-button");
const resetButton = document.querySelector("#reset-button");

const timerOpts = document.querySelectorAll(".button-timer-opt");

const focusMode = document.querySelector("#focus-mode");
const longBreakMode = document.querySelector("#long-break-mode");
const shortBreakMode = document.querySelector("#short-break-mode");

let timerId = null;
let running = false;
let focusTime = 50 * 60;
let shortBreakTime = 10 * 60;
let longBreakTime = 15 * 60;
let currentModeTime = focusTime;
let remainingSeconds = currentModeTime;
let sequence = 0;
let autoSequence = true;
const numOfSequences = 4;

function removeActive() {
    timerOpts.forEach((timerOpt) => timerOpt.classList.remove("active"));
}

timerOpts.forEach(function(timerOpt) {
    timerOpt.addEventListener("click", function() {
        removeActive();
        this.classList.add("active");

        if (timerOpt.id === focusMode.id) {
            setTimerMode(focusTime);
        }
        else if (timerOpt.id === shortBreakMode.id) {
            setTimerMode(shortBreakTime);
        }
        else if (timerOpt.id === longBreakMode.id) {
            setTimerMode(longBreakTime);
        }
    })
})

function setTimerMode(timerModeTime) {
    currentModeTime = timerModeTime;
    resetTimer();
    updateTimer(timerModeTime);
}

function updateTimeTimer() {
    remainingSeconds--;
    updateTimer(remainingSeconds);
}

playButton.addEventListener("click", function() {
    if (!running) {
        startTimer();
    }
    else if (running) {
        stopTimer();
    }
})

function startTimer() {
    timerId = setInterval(updateTimeTimer, 1000);
    running = true;
    playButton.textContent = "stop";
}

function stopTimer() {
    clearInterval(timerId);
    running = false;
    playButton.textContent = "start";
}

resetButton.addEventListener("click", function() {
    this.classList.add("rotate");
    setTimeout(() => resetButton.classList.remove("rotate"), 1000);
    resetTimer();
});

function resetTimer() {
    clearInterval(timerId);
    running = false;
    remainingSeconds = currentModeTime;
    playButton.textContent = "start";
    updateTimer(currentModeTime);
}

function updateTimer(remainingSeconds) {    
    let hours = Math.floor(remainingSeconds / 3600);
    let minutes = Math.floor((remainingSeconds - (hours * 3600)) / 60)
    let seconds = Math.floor(remainingSeconds % 60);

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    timerString = "";
    if (hours == true) {
        timeString = `${hours}:${minutes}:${seconds}`;
    }
    else {
        timeString = `${minutes}:${seconds}`;
    }

    timerDisplay.textContent = timeString;

    document.title = timeString + " | focus";

    if (remainingSeconds < 0) {
        playTimerAlert();
        if (currentModeTime === focusTime) {
            updateStats(currentModeTime / 60);
            if (autoSequence === true) {
                sequence++;
            }
            if (sequence >= numOfSequences) {
                sequence = 0;
                startLongBreak();
            }
            else {
                startShortBreak();
            }
        }
        else {
            startFocusTime();
        }
    }
}

const timerSound = "assets/audio/timer-alert.mp3"
const timerAlert = new Audio(timerSound);

function playTimerAlert()  {
    timerAlert.play()
}

function startLongBreak() {
    removeActive();
    longBreakMode.classList.add("active");

    setTimerMode(longBreakTime);
    startTimer();
}

function startShortBreak() {
    removeActive();
    shortBreakMode.classList.add("active");
    
    setTimerMode(shortBreakTime);
    startTimer();
}

function startFocusTime() {
    removeActive();
    focusMode.classList.add("active");
    
    setTimerMode(focusTime);
    startTimer();
}

const statsFocusTimeLabel = document.querySelector("#time-stats");
const statsSteakCountLabel = document.querySelector("#steak-stats");

let statsFocusTime = 0;
let statsSteakCount = 0;

function updateStats(sprintTime) {
    statsFocusTime += sprintTime;
    statsFocusTimeLabel.textContent = `${Math.floor(statsFocusTime)} minutes`
    statsSteakCountLabel.textContent = statsSteakCount++;

}

setTimerMode(focusTime);

let enableQuote = false;

function displayQuote() {
    const quote = document.querySelector("#quote");
    if (enableQuote === true) {
        console.log('disp')
        quote.classList.remove("hidden");
    } else {
        console.log('not disp')
        quote.classList.add("hidden");
    }
}

displayQuote();