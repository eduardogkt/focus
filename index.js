const tasklistButton = document.getElementById("tasklist-button");
const tasklistPanel = document.getElementById("tasklist-panel");

tasklistButton.addEventListener("click", function() {
    if (tasklistPanel.style.visibility === "hidden") {
        tasklistPanel.style.visibility = "visible";
    } else {
        tasklistPanel.style.visibility = "hidden";
    }
});

const musicButton = document.getElementById("music-button");
const musicPanel = document.getElementById("music-panel");

musicButton.addEventListener("click", function() {
    if (musicPanel.style.visibility === "hidden") {
        musicPanel.style.visibility = "visible";
    } else {
        musicPanel.style.visibility = "hidden";
    }
});

const screenButton = document.getElementById("screen-button");
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