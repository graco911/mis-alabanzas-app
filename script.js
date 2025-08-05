let songsData = [];
let activeLetter = '';

function filterSongs() {
  const songsContainer = document.getElementById('songs');
  const searchInput = document.getElementById('searchInput');

  songsContainer.innerHTML = '';
  const query = searchInput.value.toLowerCase();

  let filtered = songsData;

  if (activeLetter) {
    filtered = filtered.filter(song =>
      song.title.toUpperCase().startsWith(activeLetter)
    );
  }

  if (query) {
    filtered = filtered.filter(song =>
      song.title.toLowerCase().includes(query) ||
      song.lyrics.toLowerCase().includes(query)
    );
  }

  if (filtered.length === 0) {
    const mensaje = activeLetter
      ? `No hay canciones que empiecen con "${activeLetter}".`
      : `No se encontraron canciones.`;
    songsContainer.innerHTML = `<p>${mensaje}</p>`;
    return;
  }

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

async function loadSongsFromCSV() {
  try {
    const response = await fetch('alabanzas_list.csv');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const text = await response.text();
    if (!text) throw new Error('El archivo CSV está vacío.');

    const lines = text.trim().split('\n');
    if (lines.length < 2) throw new Error('El CSV no tiene datos para procesar.');

    const headers = lines[0].split(',');

const songs = lines.slice(1).map(line => {
  const matched = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
  if (!matched) return null;

  const values = matched.map(v => v.replace(/^"|"$/g, '').replace(/\\n/g, '\n'));

  return {
    title: values[0],  // usa nombres fijos para evitar problemas con headers dinámicos
    lyrics: values[1]
  };
}).filter(song => song !== null);

    songsData = songs;
    filterSongs(); // renderizar las canciones

  } catch (error) {
    console.error("Error al cargar CSV:", error);
  }
}

async function loadSongsFromJSON() {
  try {
    const response = await fetch('alabanzas.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const json = await response.json();
    if (!Array.isArray(json) || json.length === 0) throw new Error('El archivo JSON está vacío o malformado.');

    const songs = json.map(item => ({
      title: item.Titulo || '',
      lyrics: item.Letra || '',
      topic: item.Tema || ''
    }));

    songsData = songs;
    filterSongs(); // renderizar las canciones

  } catch (error) {
    console.error("Error al cargar JSON:", error);
  }
}

document.addEventListener('DOMContentLoaded', () => {

  loadSongsFromJSON();

  // Referencias a elementos del DOM
  const lettersContainer = document.getElementById('letters');
  const searchInput = document.getElementById('searchInput');

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
