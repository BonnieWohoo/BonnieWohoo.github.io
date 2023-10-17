const div1 = document.getElementById("div1");
const div2 = document.getElementById("div2");
const back = document.getElementById("back");
const video = document.getElementById('video');
var timer = document.getElementById("activeTimer");

// PASSWORD TO UNLOCK
const password = {
  ORANGECAT: "sad",
  BLUECAT: "happy",
  PURPLECAT: "surprised"
}


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

// Function to detect highest expression
function detectExpression(detections) {
  let highestExpression = "Neutral"; // Default value

  // Initialize the highest score to a lower value
  let highestScore = -1;

  detections.forEach((result, i) => {
    const expressions = result.expressions;

    for (const expression in expressions) {
      if (expressions[expression] > highestScore) {
        highestExpression = expression;
        highestScore = expressions[expression];
      }
    }
  });

  // Return the single highest expression as a string
  return highestExpression;
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
    const currentExpression = detectExpression(detectionsWithExpressions);
    console.log(detectExpression(detectionsWithExpressions));
    //console.log(currentExpression);
    checkPass(currentExpression);
    //const resizedDetections = faceapi.resizeResults(detections, displaySize)
    //canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    //faceapi.draw.drawDetections(canvas, resizedDetections)
    //faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    //faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 1000)
})

// takes in highestExpression
function checkPass(highestExpression){
  // get the cat image container
  const catContainer = document.getElementById("cat-container");
  const catChildren = catContainer.children;
  const currentImageId = catChildren[0].id.toUpperCase();
  //console.log(currentImageId);
  // there should only be one child image at the time
  // TO DO: Check the ID name to the preset dictionary

// problem, if you smile one of the expressions, it chanages
// you have to check the photo in the div? 

  const keys = Object.keys(password);
  switch(currentImageId){
    // the password is orange, blue, purple, so do the next colour cat, except for 


    case keys[0]:
        // show that is it unlocking by changing switching the image
        // or get rid of the image
        const catImg = document.createElement("img");
      if(highestExpression == password.ORANGECAT && currentImageId == "ORANGECAT"){
        catChildren[0].remove();
        // new cat image will be blue
        catImg.src = "../assets/thumbnails_blue_cat.png";
        catImg.setAttribute('id','blueCat');
        catImg.setAttribute('class','cat-2');
        catContainer.appendChild(catImg);
      }
    case keys[1]:
      if(highestExpression == password.BLUECAT && currentImageId == "BLUECAT"){
        catChildren[0].remove();
        catImg.src = "../assets/thumbnails_purple_cat.png";
        catImg.setAttribute('id','purpleCat');
        catImg.setAttribute('class','cat-3');
        catContainer.appendChild(catImg);
      }
    case keys[2]:
      if(highestExpression == password.PURPLECAT && currentImageId == "PURPLECAT"){
        // change the unlock image
        const indicator = document.getElementsByClassName("indicator");
        const indicatorChild = indicator[0];
        indicatorChild.remove();
        // delete the lock 
        const newIndicator = document.createElement("i");
        newIndicator.setAttribute("class","fa-solid fa-unlock");
        newIndicator.setAttribute("color","#ffffff");
        indicator.appendChild(newIndicator);
      }
  }
}




