const video = document.querySelector("video");
const textElem = document.querySelector("[data-text")

async function setup() {
   const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  //  Bug check line bellow to fix
   video.srcObject = stream;

   // Check if video playing
   video.addEventListener("playing", async () => {
    const worker = Tesseract.createWorker();
    await worker.load();
    await worker.loadLanguage("fr");
    await worker.initialize("fr");

    // Create the canvas
    const canvas = document.createElement("canvas");
    canvas.width = video.width;
    canvas.height = video.height;

    // Check for keypress and put the video in the canvas
    document.addEventListener("keypress", async event => {
        if (event.code !== "Space") return
        canvas.getContext("2d").drawImage(video, 0 , 0, video.width, video.height)
        const {
            data : { text }
        } = await worker.recognize(canvas);

        speechSynthesis.speak(new SpeechSynthesisUtterance(text.replace(/\s/g, " ")));

        textElem.textContent = text;
    })
   })
}

setup();
