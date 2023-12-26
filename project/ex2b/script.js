'use strict';
const mobileButton = document.querySelector('.mobile-button');
const hiddenMenu = document.querySelector('.hidden');
const albumButtons = document.querySelectorAll('.album-button');
const albumTracks = document.querySelector('.album-tracks');

// Header mobile nav button
mobileButton.addEventListener('click', () => {
  if (hiddenMenu.classList.contains('hidden')) {
    hiddenMenu.classList.remove('hidden');
    mobileButton.style.backgroundColor = 'rgb(177, 24, 24)';
  } else {
    hiddenMenu.classList.add('hidden');
    mobileButton.style.backgroundColor = 'white';
  }
});

// Discography/Lyrics album content
async function fetchAlbumsContent() {
  try {
    const res = await fetch('/project/ex2b/content/albums.json');
    if (!res.ok) {
      throw new Error(`Error accessing album content: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`Failed to access albums' content:`, err);
    return null;
  }
}

async function fetchLyrics(albumId, trackName) {
  try {
    const response = await fetch(`/project/ex2b/content/${albumId}.json`);
    if (!response.ok) {
      throw new Error(`Error accessing lyrics: ${response.status}`);
    }
    const lyricsData = await response.json();
    return lyricsData[trackName];
  } catch (err) {
    console.error(`Failed to access lyrics for ${trackName}:`, err);
    return null;
  }
}

function displayAlbumContent(albumId, allAlbumsContent) {
  const albumContent = allAlbumsContent[albumId];
  if (albumContent) {
    const isLyrics = window.location.pathname.includes('lyrics.html');
    if (!isLyrics) {
      albumTracks.innerHTML = `
    <h2>${albumContent.title}</h2>
    <img class="album-thumbnail" src="${
      albumContent.albumCover
    }" alt="{albumContent.title} album cover">
    <p>Release Date: ${albumContent.releaseDate}</p>
    <ol>${albumContent.tracks.map(track => `<li>${track}</li>`).join('')}</ol>`;
      albumTracks.scrollIntoView(true);
    } else {
      albumTracks.innerHTML = `
    <h2>${albumContent.title}</h2>
    <img class="album-thumbnail" src="${
      albumContent.albumCover
    }" alt="{albumContent.title} album cover">
    <p>Release Date: ${albumContent.releaseDate}</p>
    <ol>${albumContent.tracks
      .map(
        track => `<li class="track" data-album-id="${albumId}" data-track-name="${track}">
    ${track}
    <div class="lyrics hidden"></div>
</li>`
      )
      .join('')}</ol>`;
      albumTracks.scrollIntoView(true);
    }
  }
}

albumTracks.addEventListener('click', async e => {
  if (e.target.classList.contains('track') || e.target.closest('.track')) {
    const track = e.target.closest('.track');
    const trackName = track.dataset.trackName;
    const albumId = track.dataset.albumId;
    const lyricsDiv = track.querySelector('.lyrics');

    const lyrics = await fetchLyrics(albumId, trackName);
    if (lyrics) {
      lyricsDiv.innerHTML = lyrics;
      lyricsDiv.classList.toggle('hidden');
    }
  }
});

document.addEventListener('DOMContentLoaded', async function () {
  const allAlbumsContent = await fetchAlbumsContent();

  albumButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      const albumId = e.target.closest('[id]').id;
      displayAlbumContent(albumId, allAlbumsContent);
    });
  });
});
