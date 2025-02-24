$(function() {

lucide.createIcons();

// =============================================================================

// esconde menus de opção (button-opt)
function hideOptionsMenus() {
    $(".button-opt").each(function() {
        const menu = $(this).siblings(".opt-menu");
        menu.css("display", "none");
    })
}

// fechar menu de opções quando clicar fora
$(document).on("click", hideOptionsMenus);
$(".opt-menu-wrapper").on("click", event => event.stopPropagation());

// mostra/esconde menus de opção (button-opt)
$(".button-opt").on('click', function() {
    const menu = $(this).siblings(".opt-menu");

    // menu de informação de incorporação de playlist display precisa ser block
    const display = 
        (menu.attr("id") === "playlist-info-menu") ? "block" : "flex";

    if (menu.css("display") === display) {
        menu.hide();
    } 
    else {
        hideOptionsMenus();
        menu.css("display", display);
    }
});

// =============================================================================
// botões de menu

// esconte/mostra seções do painel de musica
function toggleSection(buttonId, sectionClass, optName) {
    let section = $(sectionClass);
    let button = $(buttonId);
    
    button.on("click", function() {
        section.toggle(0, function() {
            let isVisible = section.is(":visible");
            button.text((isVisible ? "Hide " : "Show ") + optName);
            hideOptionsMenus();
        })
    });
}

toggleSection("#playlist-opt-hide-playlist-button", ".playlist", "playlist");
toggleSection("#playlist-opt-hide-sounds-button", ".sounds", "sounds");

// botões de painel do menu (considera menus com display block)
function togglePanel(buttonId, panelId) {
    $(buttonId).on("click", () => $(panelId).toggle());
}

togglePanel("#tasklist-button", "#tasklist-panel");
togglePanel("#music-button", "#music-panel");
togglePanel("#stats-button", "#stats-panel");
togglePanel("#settings-button", "#settings-panel");

// =============================================================================
// tela cheia

// botão de tela cheia
const fullscreenButton = $("#fullscreen-button");
const layout = $("#page-content")[0];
let isFullscreen = false;

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } 
    else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } 
    else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } 
    else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

function enterFullscreen() {
    if (layout.requestFullscreen) {
        layout.requestFullscreen();
    } 
    else if (layout.mozRequestFullScreen) {
        layout.mozRequestFullScreen();
    } 
    else if (layout.webkitRequestFullscreen) {
        layout.webkitRequestFullscreen();
    } 
    else if (layout.msRequestFullscreen) {
        layout.msRequestFullscreen();
    }
}

function changeFullscreenIcon() {
    const icon = isFullscreen ? "assets/icons/fullscreen_exit_icon.svg" 
                              : "assets/icons/fullscreen_icon.svg";
    fullscreenButton.find("img").attr("src", icon);
}

function changeFullscreen() {
    isFullscreen ? exitFullscreen() : enterFullscreen();
}

// caso aperte o botão do menu
fullscreenButton.on("click", changeFullscreen);

// caso aperte o atalho "f"
$(document).on("keydown", function(event) {
    if (event.key === "f") {
        changeFullscreen();
    }
});

// caso aperte "Esc"
$(document).on("keydown", function(event) {
    if (event.key === "Escape" && isFullscreen) {
        exitFullscreen();
    }
});

// muda o ícone e estado quando muda de tela cheia
$(document).on("fullscreenchange", function() {
    isFullscreen = !isFullscreen;
    changeFullscreenIcon();
});

// =============================================================================
// sons

// botões de som
// adiciona um ouvinte de eventos de clique em todos os botões com a classe "button-sound"
const sounds = [
    { id: 'fire-sound-button', audio: new Audio('assets/audio/fire.mp3')},
    { id: 'rain-sound-button', audio: new Audio('assets/audio/rain.mp3')},
    { id: 'ocean-sound-button', audio: new Audio('assets/audio/ocean.mp3')},
    { id: 'cafe-sound-button', audio: new Audio('assets/audio/cafe.mp3')},
];

// botões de troca de som
$(".button-sound").on("click", function() {
    const active = "active-button";
    const button = $(this);
    const soundId = button.attr("id");
    const isActive = button.hasClass(active);

    // parando todos os sons
    $(".button-sound").each(function() {
        $(".button-sound").removeClass(active);
        stopSound($(this).attr("id"));
    });

    // se o botão clicado não estiver ativo, liga-o
    if (!isActive) {
        button.addClass(active);
        playSound(soundId);
    }
});

// barra de ajuste de volume
$("#volume-slider").on("input", function() {
    const volume = $(this).val();
    const barFill = `
    linear-gradient(to right,
                    var(--fill-slider) 0, 
                    var(--fill-slider) ${volume}%, 
                    var(--fill)        ${volume}%, 
                    var(--fill)        100%)`;

    $(this).css("background-image", barFill);

    // muda o volume do som
    $(".button-sound").each(function() {
        changeSoundVolume($(this).attr("id"), volume);
    });
});

function playSound(soundId) {
    const sound = sounds.find(sound => sound.id === soundId);
    if (sound) {
        sound.audio.setAttribute("loop", "true");
        sound.audio.play();
    }
}

function stopSound(soundId) {
    const sound = sounds.find(sound => sound.id === soundId);
    if (sound) {
        sound.audio.pause();
        sound.audio.currentTime = 0;
    }
}

function changeSoundVolume(soundId, volume) {
    const sound = sounds.find(sound => sound.id === soundId);
    if (sound) {
        sound.audio.volume = volume / 100;
    }
}

// =============================================================================
// playlist

let addPlaylistButton = $("#add-playlist-button");

addPlaylistButton.on("click", addPlaylist); 

function addPlaylist() {
    const form = ` 
    <form class="form-playlist">
    <label for="playlist-input"></label>
    <textarea
        id="input-playlist"
        class="input-playlist" 
        name="playlist-input" 
        rows="5" 
        cols="20" 
        required
        placeholder="Paste the embedding code or link here."></textarea>
    <div>
        <button class="button button-pill" id="button-playlist-submit" type="button">send</button>
        <button class="button button-pill" id="button-playlist-cancel" type="button">cancel</button>
    </div>
    </form>`;

    $("#add-playlist-section").html(form);

    $("#button-playlist-cancel").on("click", removePlaylistForm);
    $("#button-playlist-submit").on("click", setCustomPlaylist);
}

function removePlaylistForm() {
    const button = `
    <button class="button button-icon" id="add-playlist-button">
        <i data-lucide="plus" class="icon"></i>
        Add your own playlist
    </button>`;
    $("#add-playlist-section").html(button);
    
    // adiciona novamente o evento de clique ao botão de adicionar playlist
    $("#add-playlist-button").on("click", addPlaylist);
    lucide.createIcons();
};

function setCustomPlaylist() {
    const userInput = $("#input-playlist").val().trim();

    if (userInput) {
        const customPlaylist = getPlaylist(userInput);
        $(".playlist-container").html(customPlaylist);
        removePlaylistForm();
    }
    else if (!$(".warning").length) {
        // adicionando alerta de campo vazio
        $(".input-playlist").before(`<span class="warning">* empty field</span>`);
    }
}

function getPlaylist(input) {
    // iframe: pequeno height="152", grande height="352"
    
    // user input é embed code
    if (input.includes("embed")) {
        return input;
    }

    // user input é um link
    const type = input.includes("playlist") ? "playlist" : "album";
    const id = input.split('/').pop().split('?').shift();
    return `
    <iframe 
        src="https://open.spotify.com/embed/${type}/${id}?utm_source=generator" 
        style="border-radius:12px" width="100%" height="152" 
        frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; 
        encrypted-media; fullscreen; picture-in-picture" loading="lazy">
    </iframe>`;
}

// =============================================================================
// timer

const playButton = $("#start-button");
const resetButton = $("#reset-button");
const timerOpts = $(".button-timer-opt");

const DEFAULT_FOCUS_TIME = 60 * 0.1;
const DEFAULT_SHORT_BREAK_TIME = 60 * 0.05;
const DEFAULT_LONG_BREAK_TIME = 60 * 0.05;

const timers = {
    focus:      { mode: "#focus-mode",       time: DEFAULT_FOCUS_TIME },
    shortBreak: { mode: "#short-break-mode", time: DEFAULT_SHORT_BREAK_TIME },
    longBreak:  { mode: "#long-break-mode",  time: DEFAULT_LONG_BREAK_TIME },
    current:    { mode: "#focus-mode",       time: DEFAULT_FOCUS_TIME }
};

let timerId = null;
let running = false;
let remainingSeconds = timers.current.time;

let sequence = 0;
let autoSequence = true;
let numOfSequences = 4;

let timerAlert = new Audio("assets/audio/timer-alert.mp3");

setTimerMode(timers.focus);

timerOpts.on("click", function() {
    timerOpts.removeClass("active");
    $(this).addClass("active");

    switch ($(this).attr("id")) {
        case $(timers.focus.mode).attr("id"):      setTimerMode(timers.focus);      break;
        case $(timers.shortBreak.mode).attr("id"): setTimerMode(timers.shortBreak); break;
        case $(timers.longBreak.mode).attr("id"):  setTimerMode(timers.longBreak);  break;
    }
});

playButton.on("click", function() { 
    (running) ? stopTimer() : startTimer();
});

resetButton.on("click", function() {
    $(this).addClass("rotate-ccw");
    setTimeout(() => resetButton.removeClass("rotate-ccw"), 1000);
    resetTimer();
});

function setTimerMode(timer) {
    timers.current.mode = timer.mode
    timers.current.time = timer.time
    resetTimer();
    updateTimerDisplay(timer.time);
}

function updateTimer() {
    remainingSeconds--;
    updateTimerDisplay(remainingSeconds);
}

function startTimer() {
    timerId = setInterval(updateTimer, 1000);
    running = true;
    playButton.text("stop");
}

function stopTimer() {
    clearInterval(timerId);
    running = false;
    playButton.text("start");
}

function resetTimer() {
    clearInterval(timerId);
    running = false;
    remainingSeconds = timers.current.time;
    playButton.text("start");
    updateTimerDisplay(timers.current.time);
}

function updateTimerDisplay(remainingSeconds) {    
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

    // atualizando o display e o titulo da página
    $("#timer-clock").text(timeString);
    $(document).prop("title", `${timeString} | focus`);

    if (remainingSeconds < 0) {
        playTimerAlert();
        changeTimer();
    }
}

function changeTimer() {
    if (timers.current.time === timers.focus.time) {
        updateStats(timers.current.time / 60);
        if (autoSequence === true) {
            sequence++;
        }
        if (sequence >= numOfSequences) {
            sequence = 0;
            startTimerMode(timers.longBreak);
        }
        else {
            startTimerMode(timers.shortBreak);
        }
    }
    else {
        startTimerMode(timers.focus);
    }
}

function playTimerAlert()  {
    timerAlert.play()
}

function startTimerMode(timer) {
    timerOpts.removeClass("active");
    $(timer.mode).addClass("active");

    setTimerMode(timer);
    startTimer();
}

// =============================================================================
// stats

const statsFocusTime = $("#time-stats");
const statsSprintCount = $("#steak-stats");

let totalFocusTime = 0;
let sprintCount = 0;

function updateStats(sprintTime) {
    totalFocusTime += sprintTime;
    statsFocusTime.text(`${Math.floor(totalFocusTime)} minutes`);
    statsSprintCount.text(++sprintCount);
}

// redefine as estatísitcas
$("#stats-opt-reset-button").on("click", function() {
    totalFocusTime = 0;
    sprintCount = -1;
    updateStats(0);
    hideOptionsMenus();
})

// =============================================================================
// quote

let disableQuote = false;
const quoteApiUrl = "http://api.quotable.io/random";

displayQuote();

async function getQuote(url) {
    const resp = await fetch(quoteApiUrl);
    const data = await resp.json();

    $("#quote-box").html(`"${data.content}" `)
    $("#author-box").html(`— ${data.author}`)
}

function displayQuote() {
    $("#quote").toggleClass("hidden", disableQuote);
    getQuote(quoteApiUrl);    
}

$("#quote-button").on("click", function() {
    getQuote(quoteApiUrl);

    $(this).addClass("rotate-cw");
    setTimeout(() => $("#quote-button").removeClass("rotate-cw"), 1000);
})

// =============================================================================
// tasklist




});
