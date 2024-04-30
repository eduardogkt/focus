// botões de painel do menu
function togglePanel(buttonId, panelId) {
    const button = document.getElementById(buttonId);
    const panel = document.getElementById(panelId);

    button.addEventListener("click", function() {
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}

togglePanel("tasklist-button", "tasklist-panel");
togglePanel("music-button", "music-panel");
togglePanel("stats-button", "stats-panel");

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
        fullscreenButton.querySelector("img").setAttribute("src", "resources/icons/fullscreen_exit_icon.svg");
    } else {
        fullscreenButton.querySelector("img").setAttribute("src", "resources/icons/fullscreen_icon.svg");
    }
}

// caso aperto botão
fullscreenButton.addEventListener("click", function() {
    if (!isFullscreen) {
        enterFullscreen();
    } else { 
        exitFullscreen();
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
    const fill = `linear-gradient(to right,var(--fill-slider) 0, var(--fill-slider) ${value}%, var(--fill) ${value}%, var(--fill) 100%)`
    
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