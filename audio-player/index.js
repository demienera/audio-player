const audio = document.getElementById('audio');
const playButton = document.getElementById('play');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const progress = document.getElementById('progress');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const barsItem = document.querySelectorAll('.bars__item');
const volumeSlider = document.getElementById('volume');
const volumeLabel = document.getElementById('volume-label');

let currentTrackIndex = 0;

let tracks = [
	{
		title: 'Back From The Dead',
		artist: 'Skillet',
		src: 'skillet-back.mp3',
		cover: 'back.webp',
	},
	{
		title: 'Not Gonna Die',
		artist: 'Skillet',
		src: 'skillet-not-gonna-die.mp3',
		cover: 'not.jpg',
	},
	{
		title: 'Rise',
		artist: 'Skillet',
		src: 'skillet-rise.mp3',
		cover: 'rise.jpg',
	},
];

function loadTrack(index) {
	const track = tracks[index];
	audio.src = `./assets/audio/${track.src}`;
	playIcon.style.display = 'block';
	pauseIcon.style.display = 'none';
	audio.load();
	updateTrackInfo(track);
}

function updateTrackInfo(track) {
	document.querySelector('.track-info h4').textContent = track.artist;
	document.querySelector('.track-info p').textContent = track.title;
	document.querySelector('.cover img').src = `./assets/img/${track.cover}`;

	document.body.style.backgroundImage = `url(./assets/img/${track.cover})`;
	document.body.style.backgroundSize = 'cover';
	document.body.style.backdropFilter = 'blur(10px)';
}

function playPauseTrack() {
	if (audio.paused) {
		audio.play();
		playIcon.style.display = 'none';
		pauseIcon.style.display = 'block';
		document.querySelector('.bars').style.opacity = '1';
		runBars();
	} else {
		audio.pause();
		playIcon.style.display = 'block';
		pauseIcon.style.display = 'none';
		pauseBars();
	}
}

function prevTrack() {
	currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
	loadTrack(currentTrackIndex);
	audio.play();
	playIcon.style.display = 'none';
	pauseIcon.style.display = 'block';
	runBars();
}

function nextTrack() {
	currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
	loadTrack(currentTrackIndex);
	audio.play();
	playIcon.style.display = 'none';
	pauseIcon.style.display = 'block';
	runBars();
}

function playNextTrack() {
	currentTrackIndex++;

	if (currentTrackIndex >= tracks.length) {
		currentTrackIndex = 0;
	}

	loadTrack(currentTrackIndex);
	audio.play();
}

loadTrack(currentTrackIndex);

function updateProgress() {
	const currentTime = audio.currentTime;
	const duration = audio.duration;

	if (duration) {
		const progressPercentage = (currentTime / duration) * 100;
		progress.value = progressPercentage;
		updateProgressBar(progressPercentage);
	}

	currentTimeDisplay.textContent = formatTime(currentTime);
	durationDisplay.textContent = isNaN(duration) ? '0:00' : formatTime(duration);
}

function updateProgressBar(value) {
	progress.style.background = `linear-gradient(to right, #1e1e1e ${value}%, #696868 ${value}%)`;
}

progress.addEventListener('input', () => {
	const duration = audio.duration;
	if (duration) {
		const newTime = (progress.value / 100) * duration;
		audio.currentTime = newTime;
	}
	updateProgressBar(progress.value);
});

function formatTime(seconds) {
	const minutes = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function pauseBars() {
	barsItem.forEach((item) => {
		item.style.animationPlayState = 'paused';
	});
}

function runBars() {
	barsItem.forEach((item) => {
		item.style.animationPlayState = 'running';
	});
}

let audioVolume = document.getElementById('volume');
let audioEl = document.getElementById('audio');

audioVolume.addEventListener('input', function () {
	audioEl.volume = +audioVolume.value / 100;
});

audio.volume = volumeSlider.value / 100;

volumeSlider.addEventListener('input', () => {
	const volumeValue = volumeSlider.value;

	audio.volume = volumeValue / 100;
	volumeSlider.style.background = `linear-gradient(to right, #1e1e1e ${volumeValue}%, #696868 ${volumeValue}%)`;
});

audio.addEventListener('ended', playNextTrack);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('loadedmetadata', updateProgress);
playButton.addEventListener('click', playPauseTrack);
prevButton.addEventListener('click', prevTrack);
nextButton.addEventListener('click', nextTrack);
progress.addEventListener('input', () => {
	audio.currentTime = (progress.value / 100) * audio.duration;
});

loadTrack(currentTrackIndex);
