let aLocal = null;
let localListo = false;
let muted = false;
let started = false;

// Crear el reproductor de audio
if (AUDIO_LOCAL) {
  aLocal = new Audio();

  // Repetir la canción
  aLocal.loop = true;

  // Volumen inicial
  aLocal.volume = VOLUMEN / 100;

  // Avisar cuando el archivo esté listo
  aLocal.addEventListener("canplay", () => {
    localListo = true;
  });

  // Cargar la canción
  aLocal.src = AUDIO_LOCAL;
}


// Iniciar la música
function iniciarMusica() {
  if (!aLocal) {
    console.log("No se encontró el archivo de música.");
    return;
  }

  aLocal
    .play()
    .then(() => {
      console.log("🎵 Música reproduciéndose");
    })
    .catch((error) => {
      console.log("No se pudo reproducir la música:", error);
    });
}


// Botón de entrada
document.getElementById("start").addEventListener("click", function () {

  started = true;

  // Ocultar pantalla inicial
  this.style.opacity = 0;

  setTimeout(() => {
    this.remove();
  }, 1000);

  // Iniciar música
  iniciarMusica();

  // Mostrar botón de silencio
  const m = document.getElementById("mute");

  m.style.display = "block";

  // Controlar silencio
  m.onclick = () => {

    muted = !muted;

    if (aLocal) {
      aLocal.muted = muted;
    }

    m.textContent = muted ? "🔇" : "🔊";
  };

});