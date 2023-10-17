const div1 = document.getElementById("div1");
const div2 = document.getElementById("div2");
const back = document.getElementById("back");
const video = document.getElementById('video');
var timer = document.getElementById("activeTimer");

// Go to sensor-based password
document.addEventListener("DOMContentLoaded", function () {
  div1.addEventListener("click", function () {
    startTimer();
    if(div1.classList.contains("active")) {
      div1.classList.remove("active");
      div1.classList.add("inactive");
      div2.classList.remove("inactive");
      div2.classList.add("active");
    }
  });
});


// Go back to lock screen
document.addEventListener("DOMContentLoaded", function () {
  back.addEventListener("click", function () {
    stopTimer();
    if(div2.classList.contains("active")) {
      div2.classList.remove("active");
      div2.classList.add("inactive");
      div1.classList.remove("inactive");
      div1.classList.add("active");
    }
  });
});

// Function to start the timer
function startTimer() {
  var sec = 30;
  timer = setInterval(function () {
    if (sec > 9) {
      document.getElementById("activeTimer").innerHTML = "Timer: 0:" + sec;
      sec--;
    } else {
      document.getElementById("activeTimer").innerHTML = "Timer: 0:0" + sec;
      sec--;
    }
    if (sec < 0) {
      clearInterval(timer);
    }
  }, 1000);
}

// Function to stop the timer
function stopTimer() {
  clearInterval(timer);
  document.getElementById("activeTimer").innerHTML = "Timer: 0:30"
}

// Load in all the models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo).then(console.log("loaded all models"))


// Start the video feedback, asks for permission
function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then((stream) => {(video.srcObject = stream)})
  .catch((err) => alert(`${err.name} ${err.message}`));
}

// Detects and draws on face your expression
video.addEventListener('play', () => {
  //const canvas = faceapi.createCanvasFromMedia(video)
  //document.body.append(canvas)
  //const displaySize = { width: video.width, height: video.height }
  //faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    //const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const detectionsWithExpressions = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions()
    console.log(detectionsWithExpressions)
    //const resizedDetections = faceapi.resizeResults(detections, displaySize)
    //canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    //faceapi.draw.drawDetections(canvas, resizedDetections)
    //faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    //faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 1000)
})

