
let stream = null;

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

const modeIdle = document.getElementById("modeIdle");
const modeLive = document.getElementById("modeLive");
const modePreview = document.getElementById("modePreview");

const startBtn = document.getElementById("startBtn");
const captureBtn = document.getElementById("captureBtn");
const retakeBtn = document.getElementById("retakeBtn");
const saveBtn = document.getElementById("saveBtn");

const postBtn = document.getElementById("postBtn");
const captionInput = document.getElementById("captionInput");
const postStatus = document.getElementById("postStatus");

function showMode(which) {
  modeIdle.style.display = which === "idle" ? "flex" : "none";
  modeLive.style.display = which === "live" ? "flex" : "none";
  modePreview.style.display = which === "preview" ? "flex" : "none";
}

function showVideo() {
  video.style.display = "block";
  canvas.style.display = "none";
}

function showCanvas() {
  video.style.display = "none";
  canvas.style.display = "block";
}

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });

    video.srcObject = stream;

    if (postStatus) {
      postStatus.textContent = "";
    }

    showVideo();
    showMode("live");
  } catch (err) {
    console.error(err);
    alert("Camera access was blocked. Please allow camera permissions and try again.");
    showMode("idle");
  }
}

function capturePhoto() {
  const w = video.videoWidth;
  const h = video.videoHeight;

  if (!w || !h) {
    alert("Camera is not ready yet. Try again in a second.");
    return;
  }

  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, w, h);

  showCanvas();
  showMode("preview");
}

function retakePhoto() {
  if (postStatus) {
    postStatus.textContent = "";
  }

  showVideo();
  showMode("live");
}

function savePhoto() {
  if (canvas.width === 0 || canvas.height === 0) {
    alert("Capture a photo first.");
    return;
  }

  const link = document.createElement("a");
  link.download = "photobooth.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function canvasToBlob() {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

async function postPhoto() {
    if (canvas.width === 0 || canvas.height === 0) {
      postStatus.textContent = "Capture a photo first.";
      return;
    }
  
    postStatus.textContent = "Posting...";
  
    const caption = captionInput.value.trim();
  
    try {
      const db = window.firebaseDB;
      const { collection, addDoc, serverTimestamp } = window.firebaseFns;
  
      // resize image before saving -> this allows the saving of data storage
      const resizedCanvas = document.createElement("canvas");
      const maxWidth = 800;
  
      const scale = Math.min(1, maxWidth / canvas.width);
      resizedCanvas.width = canvas.width * scale;
      resizedCanvas.height = canvas.height * scale;
  
      const ctx = resizedCanvas.getContext("2d");
      ctx.drawImage(canvas, 0, 0, resizedCanvas.width, resizedCanvas.height);
  
      // this was the only way to do it, or else i'd have to pay
      const base64Image = resizedCanvas.toDataURL("image/jpeg", 0.7);
  
      await addDoc(collection(db, "community_posts"), {
        imageBase64: base64Image,
        caption: caption,
        createdAt: serverTimestamp()
      });
  
      postStatus.textContent = "Posted successfully!";
      captionInput.value = "";
  
    } catch (err) {
      console.error(err);
      postStatus.textContent = "Upload failed.";
    }
  }

function stopCamera() {
  if (!stream) return;

  stream.getTracks().forEach((t) => t.stop());
  stream = null;
}

startBtn.addEventListener("click", startCamera);
captureBtn.addEventListener("click", capturePhoto);
retakeBtn.addEventListener("click", retakePhoto);
saveBtn.addEventListener("click", savePhoto);

if (postBtn) {
  postBtn.addEventListener("click", postPhoto);
}

window.addEventListener("beforeunload", stopCamera);

showMode("idle");
showVideo();