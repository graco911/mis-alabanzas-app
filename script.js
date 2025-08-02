const songsData = [
  {
    title: "AMARTE SOLO A TI SEÑOR",
    lyrics: "AMARTE SOLO A TI SEÑOR,\n" +
            "AMARTE SOLO A TI SEÑOR,\n" +
            "AMARTE SOLO A TI SEÑOR\n\n" +
            "Y NO MIRAR ATRÁS,\n" +
            "SEGUIR TU CAMINAR SEÑOR,\n" +
            "SEGUIR SIN DESMAYAR SEÑOR,\n" +
            "POSTRADO ANTE TU ALTAR SEÑOR,\n" +
            "Y NO MIRAR ATRÁS.\n\n" +
            "AMARTE SOLO A TI SEÑOR,\n" +
            "LLEVAR SIEMPRE TU CRUZ SEÑOR,\n" +
            "AMARTE SOLO A TI SEÑOR\n" +
            "Y NO MIRAR ATRÁS,\n\n" +
            "AL DÉBIL PROTEGER SEÑOR,\n" +
            "AL POBRE DEFENDER SEÑOR,\n" +
            "TU REINO PROCLAMAR SEÑOR\n" +
            "Y NO MIRAR ATRÁS."
  },
  {
    title: "Azul",
    lyrics: "Es que este amor es azul como el mar azul..."
  },
  {
    title: "Burbujas de amor",
    lyrics: "Tengo un corazón\nMutilado de esperanza y de razón..."
  },
  {
    title: "A quién le importa",
    lyrics: "La gente me señala\nMe apuntan con el dedo..."
  }
];

document.addEventListener('DOMContentLoaded', () => {

// Referencias a elementos del DOM
const lettersContainer = document.getElementById('letters');
const songsContainer = document.getElementById('songs');
const searchInput = document.getElementById('searchInput');

let activeLetter = ''; // <- nunca será undefined

// Crear botones A-Z
for (let i = 65; i <= 90; i++) {
  const btn = document.createElement('button');
  const letter = String.fromCharCode(i);
  btn.textContent = letter;
  btn.onclick = () => {
    activeLetter = letter;
    filterSongs();
  };
  lettersContainer.appendChild(btn);
}

// Escuchar cambios en el campo de búsqueda
searchInput.addEventListener('input', () => {
  filterSongs();
});

// Función para filtrar y mostrar canciones
function filterSongs() {
  songsContainer.innerHTML = '';
  const query = searchInput.value.toLowerCase();

  let filtered = songsData;

  // Si hay una letra seleccionada, filtrar por esa letra
  if (activeLetter) {
    filtered = filtered.filter(song =>
      song.title.toUpperCase().startsWith(activeLetter)
    );
  }

    if (query) {
    filtered = filtered.filter(song =>
        song.title.toLowerCase().includes(query) ||
        song.lyrics.toLowerCase().includes(query) // <-- busqueda en letra también
    );
    }

  // Mostrar mensaje si no hay resultados
  if (filtered.length === 0) {
    const mensaje = activeLetter
      ? `No hay canciones que empiecen con "${activeLetter}".`
      : `No se encontraron canciones.`;
    songsContainer.innerHTML = `<p>${mensaje}</p>`;
    return;
  }

  // Mostrar canciones filtradas
  filtered.sort((a, b) => a.title.localeCompare(b.title)).forEach(song => {
    const titleDiv = document.createElement('div');
    titleDiv.className = 'song-title';
    titleDiv.textContent = song.title;

    const lyricsDiv = document.createElement('div');
    lyricsDiv.className = 'lyrics';
    lyricsDiv.textContent = song.lyrics;

    titleDiv.onclick = () => {
      lyricsDiv.style.display = lyricsDiv.style.display === 'none' ? 'block' : 'none';
    };

    songsContainer.appendChild(titleDiv);
    songsContainer.appendChild(lyricsDiv);
  });
}

// Elementos del modal
const modal = document.getElementById('infoModal');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const closeBtn = document.querySelector('.close-button');

// Textos para cada sección
const infoContent = {
  about: {
    title: 'Acerca de',
    text: 'Este proyecto es un cancionero digital para visualizar letras de canciones de forma práctica y accesible desde cualquier dispositivo.'
  },
  contact: {
    title: 'Contacto',
    text: 'Puedes contactarnos a través del correo: contacto@cancionero.com o enviarnos un mensaje por redes sociales.'
  },
  privacy: {
    title: 'Políticas de privacidad',
    text: 'Este sitio no recopila información personal. Todo el contenido está disponible públicamente y es para fines educativos.'
  },
  credits: {
    title: 'Créditos',
    text: 'Diseñado y desarrollado por Carlos Graniel Córdova. Inspirado en la necesidad de compartir música y letras de manera sencilla.'
  }
};

// Mostrar el modal con el contenido correspondiente
function showModal(section) {
  const content = infoContent[section];
  if (content) {
    modalTitle.textContent = content.title;
    modalText.textContent = content.text;
    modal.style.display = 'flex';
  }
}

// Cerrar el modal
closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = 'none';
};

// Asignar eventos a los enlaces del footer
document.querySelectorAll('.footer a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const section = link.getAttribute('href').substring(1); // "about", "contact", etc.
    showModal(section);
  });
});

});
