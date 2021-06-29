const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
	navigator.mediaDevices
		.getUserMedia({ video: true, audio: false })
		.then((localMediaStream) => {
			console.log(localMediaStream);
			video.srcObject = localMediaStream;
			video.play();
		})
		.catch((err) => {
			console.error(`OH NO!!!`, err);
		});
}

function paintToCanvas() {
	// Getting the actuall width and height of the video
	const width = video.videoWidth;
	const height = video.videoHeight;
	// We need to ensure that the canvas is the same size as the video we send to it. If it differs, we need to change it, as follows:
	canvas.width = width;
	canvas.height = height;

	return setInterval(() => {
		ctx.drawImage(video, 0, 0, width, height);
		// NOTE take the pixels out
		let pixels = ctx.getImageData(0, 0, width, height);
		// NOTE mess with the pixels
		// pixels = redEffect(pixels);
		// pixels = rgbSplit(pixels);
		// ctx.globalAlpha = 0.1;
		pixels = greenSCreen(pixels);

		// NOTEput the pixels back
		ctx.putImageData(pixels, 0, 0);
	}, 16);
}

function takePhoto() {
	//Play the photo sound
	snap.currentTime = 0;
	snap.play();

	// Take the data out of the canvas
	const data = canvas.toDataURL('image.jpeg');
	const link = document.createElement('a');
	link.href = data;
	link.setAttribute('download', 'handsome');
	link.innerHTML = `<img src="${data}" alt="Deon" />`;
	strip.insertBefore(link, strip.firstChild);
}

function greenSCreen(pixels) {
	const levels = {};

	document.querySelectorAll('.rgb input').forEach((input) => {
		levels[input.name] = input.value;
	});

	for (i = 0; i < pixels.data.length; i = i + 4) {
		red = pixels.data[i + 0];
		green = pixels.data[i + 1];
		blue = pixels.data[i + 2];
		alpha = pixels.data[i + 3];

		if (
			red >= levels.rmin &&
			green >= levels.gmin &&
			blue >= levels.bmin &&
			red <= levels.rmax &&
			green <= levels.gmax &&
			blue <= levels.bmax
		) {
			// take it out!
			pixels.data[i + 3] = 0;
		}
	}
	return pixels;
}

function rgbSplit(pixels) {
	for (let i = 0; i < pixels.data.length; i += 4) {
		pixels.data[i - 150] = pixels.data[i + 0] + 100; //red
		pixels.data[i + 100] = pixels.data[i + 1] - 50; //green
		pixels.data[i - 150] = pixels.data[i + 2] * 0.5; //blue
	}
	return pixels;
}

function redEffect(pixels) {
	for (let i = 0; i < pixels.data.length; i += 4) {
		pixels.data[i + 0] = pixels.data[i + 0] + 100; //red
		pixels.data[i + 1] = pixels.data[i + 1] - 50; //green
		pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //blue
	}
	return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
