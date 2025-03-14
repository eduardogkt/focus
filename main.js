$(function() {

// localStorage.clear();

// lista de sons disponíveis
const sounds = [
    { id: "fire-sound-button", audio: new Audio("assets/audio/fire.mp3") },
    { id: "rain-sound-button", audio: new Audio("assets/audio/rain.mp3") },
    { id: "ocean-sound-button", audio: new Audio("assets/audio/ocean.mp3") },
    { id: "cafe-sound-button", audio: new Audio("assets/audio/cafe.mp3") },
    
    { id: "chime-alert", audio: new Audio("assets/audio/alert/chime-alert.mp3") },
    { id: "ding-alert", audio: new Audio("assets/audio/alert/ding-alert.mp3") },
    { id: "dong-alert", audio: new Audio("assets/audio/alert/dong-alert.mp3") },
    { id: "plew-alert", audio: new Audio("assets/audio/alert/plew-alert.mp3") },
    { id: "cat-alert", audio: new Audio("assets/audio/alert/cat-alert.mp3") }
];

lucide.createIcons();

getSettings();

// =============================================================================
// funções gerais

// verifica se há aviso para o elemento
function hasWarning(selector) {
    return $(selector).siblings(".warning").length > 0;
}

// adiciona um aviso antes do elemento
function addWarning(selector, description) {
    $(selector).before(`<span class="warning">${description}</span>`);
    $(selector).addClass("warning-border");
}

// esconde todos os menus de opção
function hideOptionsMenus() {
    $(".opt-menu").hide();
}

// mostra/esconde menus de opção
function toggleMenus(event) {
    event.stopPropagation(); // evita que o clique se propague para o document

    const button = $(event.currentTarget);
    const menu = button.siblings(".opt-menu");

    const displayType = menu.attr("id") === "playlist-info-menu" ? "block" : "flex";

    if (menu.css("display") === displayType) {
        menu.hide();
    } else {
        hideOptionsMenus();
        menu.css("display", displayType);
    }
}

// fecha o menu de opções quando clicar fora
$(document).on("click", hideOptionsMenus);
$(document).on("click", ".opt-menu-wrapper", event => event.stopPropagation());
$(document).on("click", ".button-opt", toggleMenus);

// =============================================================================
// seções e paineis

// esconde/mostra seções do painel de música
function toggleSection(buttonSelector, sectionSelector, optName) {
    $(document).on("click", buttonSelector, function () {
        const button = $(this);
        const section = $(sectionSelector);
        const isVisible = section.toggle().is(":visible");

        button.find("svg").attr("data-lucide", isVisible ? "eye-off" : "eye");
        button.find("span").text(isVisible ? `Hide ${optName}` : `Show ${optName}`);

        lucide.createIcons();
        hideOptionsMenus();
    });
}

// ativa a funcionalidade de alternância para os botões do painel de música
toggleSection("#playlist-opt-hide-playlist-button", ".playlist", "playlist");
toggleSection("#playlist-opt-hide-sounds-button", ".sounds", "sounds");

// botões de painel do menu (considera menus com display block)
function togglePanel(buttonSelector, panelSelector) {
    $(document).on("click", buttonSelector, function () {
        $(panelSelector).toggle();
        if (panelSelector === "#settings-panel") {
            $(".over").fadeIn(200);
        }
    });
}

// ativa a funcionalidade de alternância para os painéis do menu
togglePanel("#tasklist-button", "#tasklist-panel");
togglePanel("#music-button", "#music-panel");
togglePanel("#stats-button", "#stats-panel");
togglePanel("#settings-button", "#settings-panel");

// =============================================================================
// tela cheia

// seletores
const fullscreenButton = $("#fullscreen-button");
const layout = $("#page-content")[0];

// alterna entre tela cheia e normal
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        layout.requestFullscreen?.() || layout.mozRequestFullScreen?.() ||
        layout.webkitRequestFullscreen?.() || layout.msRequestFullscreen?.();
    } else {
        document.exitFullscreen?.() || document.mozCancelFullScreen?.() ||
        document.webkitExitFullscreen?.() || document.msExitFullscreen?.();
    }
}

// atualiza o ícone do botão de tela cheia
function updateFullscreenIcon() {
    const icon = document.fullscreenElement ? 
        "assets/icons/fullscreen_exit_icon.svg" : 
        "assets/icons/fullscreen_icon.svg";
    
    fullscreenButton.find("img").attr("src", icon);
}

// alterna tela cheia ao clicar no botão
fullscreenButton.on("click", toggleFullscreen);

// atualiza o ícone e estado quando mudar de tela cheia
$(document).on("fullscreenchange", updateFullscreenIcon);

// sai da tela cheia ao pressionar "Esc"
$(document).on("keydown", function(event) {
    if (event.key === "Escape" && document.fullscreenElement) {
        document.exitFullscreen();
    }
});

// =============================================================================
// sons

// evento de clique nos botões de som
$(".button-sound").on("click", function () {
    const activeClass = "active-button";
    const button = $(this);
    const soundId = button.attr("id");
    const isActive = button.hasClass(activeClass);

    // para todos os sons e remove a classe de todos os botões
    $(".button-sound").removeClass(activeClass);
    sounds.forEach(({ id }) => stopSound(id));

    // se o botão clicado não estava ativo, ativa-o e toca o som
    if (!isActive) {
        button.addClass(activeClass);
        playSound(soundId);
    }
});

// evento de ajuste de volume dos sons
$(".sound-range").on("input", function () {
    const volume = $(this).val();

    updateSlider($(".sound-range"), volume);

    // altera o volume do som
    $(".button-sound").each(function () {
        changeSoundVolume($(this).attr("id"), volume);
    });
});

// evento de ajuste de volume do alerta
$(".alert-range").on("input", function () {
    const volume = $(this).val();

    updateSlider($(".alert-range"), volume);

    // altera o volume do alerta
    changeSoundVolume($("#setting-opt-alert").val(), volume);
});

// evento de tocar o alerta ao soltar o click do mouse
$(".alert-range").on("mouseup", function() {
    const alert = sounds.find(sound => sound.id === $("#setting-opt-alert").val()).audio;
    alert.play();
})

// atualiza o preenchimento visual da barra
function updateSlider(slider, value) {
    slider.val(value);

    slider.css("background-image", `
        linear-gradient(to right,
                        var(--fill-slider) 0, 
                        var(--fill-slider) ${value}%, 
                        var(--fill)        ${value}%, 
                        var(--fill)        100%)`
    );
}

// toca o som correspondente
function playSound(soundId) {
    const sound = sounds.find(sound => sound.id === soundId);
    if (sound) {
        sound.audio.loop = true;
        sound.audio.play();
    }
}

// para o som correspondente
function stopSound(soundId) {
    const sound = sounds.find(sound => sound.id === soundId);
    if (sound) {
        sound.audio.pause();
        sound.audio.currentTime = 0;
    }
}

// altera o volume do som correspondente
function changeSoundVolume(soundId, volume) {
    const sound = sounds.find(sound => sound.id === soundId);
    if (sound) {
        sound.audio.volume = volume / 100;
    }
}


// =============================================================================
// playlist
const addPlaylistButton = $("#add-playlist-button");
const addPlaylistSection = $("#add-playlist-section");

// evento para exibir o formulário de adição de playlist
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
            <button class="button button-pill" id="button-playlist-create" type="button">send</button>
            <button class="button button-pill" id="button-playlist-cancel" type="button">cancel</button>
        </div>
    </form>`;

    addPlaylistSection.html(form);

    // Adiciona eventos aos botões dentro do formulário
    $("#button-playlist-cancel").on("click", removePlaylistForm);
    $("#button-playlist-create").on("click", setCustomPlaylist);
}

function removePlaylistForm() {
    addPlaylistSection.empty().append(addPlaylistButton.show());
    addPlaylistButton.on("click", addPlaylist);
    lucide.createIcons();
}

function setCustomPlaylist() {
    const userInput = $("#input-playlist").val().trim();

    if (userInput) {
        const customPlaylist = getPlaylist(userInput);
        $(".playlist-container").html(customPlaylist);
        removePlaylistForm();
    } else if (!hasWarning("#input-playlist")) {
        addWarning(".input-playlist", "empty field");
    }
}

function getPlaylist(input) {
    // iframe: pequeno height="152", grande height="352"
    
    if (input.includes("embed")) {
        return input;
    }

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

const DEFAULT_FOCUS_TIME = 60 * 50;
const DEFAULT_SHORT_BREAK_TIME = 60 * 10;
const DEFAULT_LONG_BREAK_TIME = 60 * 20;

let focusTime =      $("#focus-time").val() * 60       || DEFAULT_FOCUS_TIME;
let shortBreakTime = $("#short-break-time").val() * 60 || DEFAULT_SHORT_BREAK_TIME;
let longBreakTime =  $("#long-break-time").val() * 60  || DEFAULT_LONG_BREAK_TIME;

let timers = {
    focus:      { mode: "#focus-mode",       time: focusTime },
    shortBreak: { mode: "#short-break-mode", time: shortBreakTime },
    longBreak:  { mode: "#long-break-mode",  time: longBreakTime },
    current:    { mode: "#focus-mode",       time: focusTime }
};

let timerId = null;
let running = false;
let remainingSeconds = timers.current.time;

let sequence = 0;
let autoSequence = $("#opt-auto-sequence").is(":checked");
let numOfSequences = 4;

let timerAlert = sounds.find(sound => sound.id === $("#setting-opt-alert").val()).audio;

setTimerMode(timers.focus);

timerOpts.on("click", function() {
    // if (running) return; // evita troca de modo enquanto o timer está rodando

    timerOpts.removeClass("active");
    $(this).addClass("active");

    switch ($(this).attr("id")) {
        case $(timers.focus.mode).attr("id"):      setTimerMode(timers.focus);      break;
        case $(timers.shortBreak.mode).attr("id"): setTimerMode(timers.shortBreak); break;
        case $(timers.longBreak.mode).attr("id"):  setTimerMode(timers.longBreak);  break;
    }
});

playButton.on("click", function() { 
    running ? stopTimer() : startTimer();
});

resetButton.on("click", function() {
    $(this).addClass("rotate-ccw");
    setTimeout(() => resetButton.removeClass("rotate-ccw"), 1000);
    resetTimer();
});

function setTimerMode(timer) {
    timers.current.mode = timer.mode;
    timers.current.time = timer.time;
    resetTimer();
    updateTimerDisplay(timer.time);
}

function updateTimer() {
    if (remainingSeconds <= 0) {
        playTimerAlert();
        changeTimer();
        return;
    }

    remainingSeconds--;
    updateTimerDisplay(remainingSeconds);
}

function startTimer() {
    if (running) return; // previne múltiplos intervalos

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
    let minutes = Math.floor((remainingSeconds % 3600) / 60);
    let seconds = remainingSeconds % 60;

    let timeString = hours > 0 
        ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
        : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    $("#timer-clock").text(timeString);
    $(document).prop("title", `${timeString} | focus`);
}

function changeTimer() {
    if (timers.current.mode === timers.focus.mode) {
        updateStats(timers.current.time / 60);
        if (autoSequence) {
            sequence++;
            
            if (sequence >= numOfSequences) {
                sequence = 0;
                startTimerMode(timers.longBreak);
            } else {
                startTimerMode(timers.shortBreak);
            }
        } else {
            resetTimer();
        }
    } else {
        startTimerMode(timers.focus);
    }
}

function playTimerAlert() {
    timerAlert.play();
}

function setTimerModeOpt(timer) {
    timerOpts.removeClass("active");
    $(timer.mode).addClass("active");
    setTimerMode(timer);
}

function startTimerMode(timer) {
    setTimerModeOpt(timer);
    startTimer();
}


// =============================================================================
// stats

const statsFocusTime = $(".time-stats");
const statsSprintCount = $(".streak-stats");

let totalFocusTime = 0;
let sprintCount = 0;

let stats = JSON.parse(localStorage.getItem("stats")) || {focusTime: 0, sprintCount: 0};

function updateStats(sprintTime) {
    totalFocusTime += sprintTime;
    statsFocusTime.text(`${Math.floor(totalFocusTime)} minutes`);
    statsSprintCount.text(++sprintCount);

    stats.focusTime = totalFocusTime;
    stats.sprintCount = sprintCount;

    localStorage.setItem("stats", JSON.stringify(stats));
}

// Reseta as estatísticas
$(".button-reset-stats").on("click", function() {
    totalFocusTime = 0;
    sprintCount = -1;
    
    stats = {focusTime: 0, sprintCount: 0};
    localStorage.setItem("stats", JSON.stringify(stats));
    
    updateStats(0);
    hideOptionsMenus();
});

// =============================================================================
// quote

let enableQuote = $("#opt-show-quote").is(":checked");

// url de api antiga: "http://api.quotable.io/random";
// utilizando api zenquotes pois tem conexão segura https
// com alloworigins por conta do cabeçalho cors 
const quoteApiUrl = "https://api.allorigins.win/get?url=" 
                    + encodeURIComponent("https://zenquotes.io/api/random");

displayQuote();

async function getQuote(url) {
    try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Failed to fetch quote");
        
        const data = await resp.json();
        const quoteData = JSON.parse(data.contents)[0]

        $("#quote-box").html(`"${quoteData.q}"`);
        $("#author-box").html(`— ${quoteData.a}`);
    } catch (error) {
        console.error("Error fetching quote:", error);
        $("#quote-box").html("Failed to load quote.");
        $("#author-box").html("");
    }
}

function displayQuote() {
    $("#quote").toggleClass("hidden", !enableQuote);
    if (enableQuote) {
        getQuote(quoteApiUrl);
    }
}

$("#quote-button").on("click", function() {
    getQuote(quoteApiUrl);

    $(this).addClass("rotate-cw");
    setTimeout(() => $("#quote-button").removeClass("rotate-cw"), 1000);
});


// =============================================================================
// tasklist

const addTaskButton = $("#button-task-add");
const tasklist = $("#task-list");
const createTaskBox = `
    <div class="task-create glass-effect" id="task-create">
        <textarea 
            id="task-input" 
            class="input-text" 
            placeholder="Task description..." 
            maxlength="500" 
            rows="3"
        ></textarea>
        <div class="create-buttons">
            <button class="button button-pill" id="button-task-create">send</button>
            <button class="button button-pill" id="button-task-cancel">cancel</button>
        </div>
    </div>`;

let hideCompleted = $("#tasklist-opt-hide-completed").attr("data-ativo") || false;

$(document).on("click", ".check", handleCompletedTasks);
$(document).on("click", "#button-task-add", addTask);
$(document).on("click", ".button-opt-task-edit", editTask);
$(document).on("click", ".button-opt-task-remove", removeTask);

$("#tasklist-opt-rem-all").on("click", removeAllTasks);
$("#tasklist-opt-rem-completed").on("click", removeCompletedTasks);
$("#tasklist-opt-hide-completed").on("click", hideCompletedTasks);

// executa ao iniciar para atulizar o botão
// necessário por conta das tasks salvas localmente
hideCompletedTasks();

function addTask() {
    if ($("#task-create").length) return; // evita múltiplos formulários abertos

    addTaskButton.remove();
    tasklist.append(createTaskBox);
    
    $("#button-task-cancel").on("click", removeAddTaskBox);
    $("#button-task-create").on("click", createTask);
}

function removeAddTaskBox() {
    tasklist.append(addTaskButton);
    $("#task-create").remove();
    saveTasks();
}

function createTask() {
    const userInput = $("#task-input").val().trim();

    if (!validateInput(userInput)) {
        return
    }

    const task = $(`
        <div class="task glass-effect">
            <i data-lucide="circle" class="check-icon"></i>
            <input type="checkbox" class="check" />
            <span class="task-description">${userInput}</span>
            <div class="opt-menu-wrapper">
                <button class="button button-opt button-opt-task">
                    <i data-lucide="ellipsis-vertical" class="opt-icon"></i>
                </button>
                <div class="opt-menu task-opt-menu">
                    <button class="button button-opt-menu button-opt-task-edit">
                        <i data-lucide="pencil" class="opt-icon"></i>
                        <span>Edit</span>
                    </button>
                    <button class="button button-opt-menu button-opt-task-remove">
                        <i data-lucide="circle-minus" class="opt-icon"></i>
                        <span>Remove</span>
                    </button>
                </div>
            </div>
        </div>`);

    tasklist.append(task);
    
    lucide.createIcons();
    removeAddTaskBox();
    saveTasks();
    addTask();  // continua adicionando tarefas
}

function handleCompletedTasks() {
    $(".check").each(function() {
        const task = $(this).parent();
        if ($(this).is(":checked")) {
            task.addClass("checked");
            task.find(".button-opt").prop("disabled", true);
            
            if (hideCompleted) {
                task.hide();
            }
        } else {
            task.removeClass("checked");
            task.find(".button-opt").prop("disabled", false);
        }
    });
    saveTasks();
}

function editTask() {
    const task = $(this).closest(".task");
    const description = task.find(".task-description").text();
  
    task.after(createTaskBox);
    task.hide();

    $("#task-input").val(description);
    
    $("#button-task-cancel").on("click", showTask);
    
    $("#button-task-create").on("click", function() {
        const userInput = $("#task-input").val().trim();

        if (!validateInput(userInput)) {
            return
        }

        task.find(".task-description").text(userInput)
        showTask();
    });

    function showTask() {
        task.show();
        $("#task-create").remove();
    }

    hideOptionsMenus();
    saveTasks();
}

function removeTask() {
    $(this).closest(".task").remove();
    saveTasks();
}

function removeAllTasks() {
    $(".task").remove();
    hideOptionsMenus();
    saveTasks();
}

function removeCompletedTasks() {
    $(".task.checked").remove();
    hideOptionsMenus();
    saveTasks();
}

function hideCompletedTasks() {
    if (hideCompleted === true) {
        hideCompleted = false;
        $(".task.checked").show();
    } else {
        hideCompleted = true;
        $(".task.checked").hide();
    }

    const button = $("#tasklist-opt-hide-completed");
    button.find("svg").attr("data-lucide", hideCompleted ? "eye" : "eye-off");
    button.find("span").text(hideCompleted ? "Show completed tasks" : "Hide completed tasks");

    lucide.createIcons();
    hideOptionsMenus();
    saveTasks();
}

function validateInput(userInput) {
    $("#warning").remove();
        
    if (!userInput) {
        if (!hasWarning("#task-input")) {
            addWarning("#task-input", "empty field");
        }
        return false;
    }
    return true;
}

function saveTasks() {
    let data = {
        tasklist: $("#tasklist-panel").html(),
        hideCompleted: hideCompleted
    }

    localStorage.setItem("task-list", JSON.stringify(data));
}

// =============================================================================
// settings

const settingButtons = $(".button-setting");
const settingSections = $(".setting-section");

// configurações e suas seções correspondentes
const settings = [
    { name: "opt-setting-timer",   sections: ["#setting-timers", "#setting-sequence"] },
    { name: "opt-setting-theme",   sections: ["#setting-gris-theme", "#setting-solid-theme", "#setting-theme"] },
    { name: "opt-setting-sound",   sections: ["#setting-sound", "#setting-alert"] },
    { name: "opt-setting-stats",   sections: ["#setting-stats"] },
    { name: "opt-setting-display", sections: ["#setting-display-panels", "#setting-display-others"] },
    { name: "opt-setting-other",   sections: ["#setting-reset"] }
]

// fecha o painel de configurações
$("#button-close-settings").on("click", function() {
    $("#settings-panel, .over").fadeOut(200);

    // se fechar sem salvar, volta às configurações anteriores
    // timeout por causa do fadeOut
    setTimeout(getSettings, 200);
})

// troca entre seções de configurações
settingButtons.on("click", function() {
    settingSections.removeClass("show-section");
    settingButtons.removeClass("active-setting");

    $(this).addClass("active-setting");

    const settingId = $(this).attr("id");

    settings.forEach(function(setting) {
         if (setting.name === settingId) {
            setting.sections.forEach(function(section) { 
                $(section).addClass("show-section");
            });
        }
    })
})

// muda o background da pagina
$(".theme").on("click", function() {
    $(".theme").removeClass("active-theme");
    $(this).addClass("active-theme");

    const image = $(this).find("img").attr("src");
    const color = $(this).find("div").attr("id")?.split("-").shift();

    setBackground(image, color);
});

function setBackground(image, color) {
    if (image) {
        $(".container").css("background-image", `url(${image})`);
    }
    else {
        $(".container").css("background-image", "none");
        $(".container").css("background-color", `var(--${color})`);
    }
}

// toca o alerta quando seleciona-o
$("#setting-opt-alert").on("click", function() {
    const alert = sounds.find(sound => sound.id === $("#setting-opt-alert").val()).audio;
    alert.play();
})

// opções de display de painal de música
$("#opt-show-music").on("click", function() {
    const isChecked = $(this).is(":checked");
    $("#opt-show-playlist").prop("checked", isChecked);
    $("#opt-show-sounds").prop("checked", isChecked);

    $("#playlist-opt-hide-playlist-button").toggle(isChecked)
    $("#playlist-opt-hide-sounds-button").toggle(isChecked)
})

// opções de display de seções do painal de música
$(".music-sub-setting").on("click", function() {
    if ($(".music-sub-setting:checked").length > 0) {
        $("#opt-show-music").prop("checked", true);
    }
    else if ($(".music-sub-setting:checked").length === 0) {
        $("#opt-show-music").prop("checked", false);
    }
})

// restaura as configurações para os valores padrão
$("#button-reset-settings").on("click", async function() {
    localStorage.removeItem("settings");
    
    // retorna para modo foco
    setTimerModeOpt(timers.focus);

    getDefaultSettings();
});

// restaura as configuração para o padrão
async function getDefaultSettings() {
    // carrega as configurações padrão do arquivo
    let defaultSettings = await fetch("assets/json/default-settings.json")
                                .then(resp => resp.json());
    localStorage.setItem("settings", JSON.stringify(defaultSettings));

    getSettings();
}

// salva as confugurações
$("#button-save-settings").click(function () {
    // timer
    let newFocusTime = $("#focus-time").val() * 60
    let newShortBreakTime = $("#short-break-time").val() * 60
    let newLongBreakTime = $("#long-break-time").val() * 60

    const changedTime = 
        (newFocusTime !== timers.focus.time) || 
        (newShortBreakTime !== timers.shortBreak.time) ||
        (newLongBreakTime !== timers.longBreak.time)

    if (changedTime) {
        if (newFocusTime > 0) {
            timers.focus.time = newFocusTime;
        }
        if (newShortBreakTime > 0) {
            timers.shortBreak.time = newShortBreakTime;
        }
        if (newLongBreakTime > 0) {
            timers.longBreak.time = newLongBreakTime;
        }

        setTimerMode(timers.focus);
    }

    let newAutoSequence = $("#opt-auto-sequence").is(":checked");
    if (autoSequence !== newAutoSequence) {
        sequence = 0;
    }
    autoSequence = newAutoSequence;

    // sound
    timerAlert = sounds.find(sound => sound.id === $("#setting-opt-alert").val()).audio;

    // display
    let showPlaylist = $("#opt-show-playlist").is(":checked");
    let showSounds = $("#opt-show-sounds").is(":checked");
    let showMusic = $("#opt-show-music").is(":checked");
    let showStats = $("#opt-show-stats").is(":checked");
    let showTasklist = $("#opt-show-tasklist").is(":checked");
    let showFullscreen = $("#opt-show-fullscreen").is(":checked");

    $(".playlist").toggle(showPlaylist);
    $(".sounds").toggle(showSounds);

    $("#music-button").toggle(showSounds);
    $("#stats-button").toggle(showStats);
    $("#tasklist-button").toggle(showTasklist);
    $("#fullscreen-button").toggle(showFullscreen);
    
    $("#playlist-opt-hide-playlist-button").toggle(showPlaylist);
    $("#playlist-opt-hide-sounds-button").toggle(showSounds);
    
    if (!showMusic) {
        $("#music-panel").toggle(false)
    }
    if (!showTasklist) {
        $("#tasklist-panel").toggle(false)
    }
    if (!showStats) {
        $("#stats-panel").toggle(false)
    }

    enableQuote = $("#opt-show-quote").is(":checked");
    $("#quote").toggle(enableQuote);

    if (enableQuote) {
        displayQuote();
    }

    let settings = {
        timer: {
            focus: newFocusTime,
            shortBreak: newShortBreakTime,
            longBreak: newLongBreakTime,
            autoSequence: newAutoSequence
        },
        
        theme: {
            active: "#" + $(".active-theme").find(">:first-child").attr("id"),
            color: $(".active-theme").find("div").attr("id")?.split("-").shift(),
            image: $(".active-theme").find("img").attr("src")
        },
        
        sounds: {
            sound: {
                volume: $(".sound-range").val()
            },
            alert: {
                alert: $("#setting-opt-alert").val(),
                volume: $(".alert-range").val()
            },
        },

        display: {
            panels: {
                music: {
                    music: showMusic,
                    playlist: showPlaylist,
                    sounds: showSounds
                },
                stats: showStats,
                tasklist: showTasklist
            },
            others: {
                fullscreen: showFullscreen,
                quote: enableQuote
            }
        }
    }
    
    localStorage.setItem("settings", JSON.stringify(settings));
    $("#settings-panel, .over").fadeOut(200);
});

// obtém as configurações salvas anteriormente
function getSettings() {
    if (localStorage.getItem("settings")) {
        const settings = JSON.parse(localStorage.getItem("settings"));
        if (settings) {
            getTimerSettings(settings.timer);
            getThemeSettings(settings.theme);
            getSoundSettings(settings.sounds);        
            getDisplaySettings(settings.display);
        }
    }
    else {
        getDefaultSettings();
    }

    if (localStorage.getItem("stats")) {
        const stats = JSON.parse(localStorage.getItem("stats"));
        getStatsSettings(stats);
    }

    if (localStorage.getItem("task-list")) {
        const tasklistData = JSON.parse(localStorage.getItem("task-list"));
        getTasklistData(tasklistData);
    }
}

function getTimerSettings(t) {
    if (!t) {
        console.log("informações de timer não encontradas");
        return;
    }

    $("#focus-time").val(t.focus / 60);
    $("#short-break-time").val(t.shortBreak / 60);
    $("#long-break-time").val(t.longBreak / 60);
    $("#opt-auto-sequence").prop("checked", t.autoSequence);
}

function getThemeSettings(t) {
    if (!t) {
        console.log("informações de theme não encontradas");
        return;
    }

    $(".theme").removeClass("active-theme");
    $(t.active).parent().addClass("active-theme");
    setBackground(t.image, t.color);
}

function getSoundSettings(s) {
    if (!s || !s.sound || !s.alert) {
        console.log("informações de sound não encontradas");
        return;
    }

    $(".sound-range").val(s.sound.volume);
    setTimeout(() => {
        $(".sound-range").trigger("input");
    }, 50);
    
    $(".alert-range").val(s.alert.volume)
    setTimeout(() => {    
        $(".alert-range").trigger("input");
    }, 50);
    $("#setting-opt-alert").val(s.alert.alert)
}

function getDisplaySettings(d) {
    if (!d || !d.others || !d.panels || !d.panels.music) {
        console.log(d, d.others, d.panels, d.panels.music)
        console.log("informações de display não encontradas");
        return;
    }

    let showPlaylist = d.panels.music.playlist;
    let showSounds = d.panels.music.sounds;
    let showMusic = d.panels.music.music;
    let showStats = d.panels.stats;
    let showTasklist = d.panels.tasklist;
    let showFullscreen = d.others.fullscreen;
    let showQuote = d.others.quote;

    $("#opt-show-playlist").prop("checked", showPlaylist);
    $("#opt-show-sounds").prop("checked", showSounds);
    $("#opt-show-music").prop("checked", showMusic);
    $("#opt-show-stats").prop("checked", showStats);
    $("#opt-show-tasklist").prop("checked", showTasklist);
    $("#opt-show-fullscreen").prop("checked", showFullscreen);
    $("#opt-show-quote").prop("checked", showQuote);

    $(".playlist").toggle(showPlaylist);
    $(".sounds").toggle(showSounds);
    
    $("#music-button").toggle(showMusic);
    $("#stats-button").toggle(showStats);
    $("#tasklist-button").toggle(showTasklist);
    $("#fullscreen-button").toggle(showFullscreen);

    $("#playlist-opt-hide-playlist-button").toggle(showPlaylist);
    $("#playlist-opt-hide-sounds-button").toggle(showSounds);
}

function getStatsSettings(s) {
    if (!s) {
        console.log("informações de status não encontradas");
        return;
    }

    $(".time-stats").text(`${Math.floor(s.focusTime)} minutes`);
    $(".streak-stats").text(s.sprintCount);
}

function getTasklistData(td) {
    if (!td) {
        console.log("informações de tasklist não encontradas");
        return;
    }

    $("#tasklist-panel").html(td.tasklist);
    $("#tasklist-opt-hide-completed").attr("data-ativo", td.hideCompleted);

    $(".task.checked").each(function() {
        $(this).find(".check").prop("checked", true);
    })
}

});
