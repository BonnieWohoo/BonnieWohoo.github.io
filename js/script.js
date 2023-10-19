const div1 = document.getElementById("div1");
const div2 = document.getElementById("div2");
const back = document.getElementById("back");
const video = document.getElementById('video');
var timer = document.getElementById("activeTimer");
var isUnlocked = false;

// PASSWORD TO UNLOCK
const password = {
  ORANGECAT: "sad",
  BLUECAT: "happy",
  PURPLECAT: "surprised"
}

const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
const timeOptions = {hour:'numeric', minute:'numeric', hour12: false}

updateDateTime();

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
    if(div2.classList.contains("active")) {
      div2.classList.remove("active");
      div2.classList.add("inactive");
      div1.classList.remove("inactive");
      div1.classList.add("active");
    }
    stopTimer();
    resetPass();
    updateDateTime();
  });
});


// Function to detect and draw on faces based on expression
async function checkFaces() {
  const detectionsWithExpressions = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
  const currentExpression = detectExpression(detectionsWithExpressions);
  console.log(currentExpression);
  checkPass(currentExpression);
}


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
      console.log("sec" + sec);
      document.getElementsByClassName("indicator")[0].style.backgroundColor = "red";
      clearInterval(timer);
    }
    checkFaces();
    if(isUnlocked){
      clearInterval(timer);
    }
  }, 1000);
}

// Function to stop the timer
function stopTimer() {
  clearInterval(timer);
  document.getElementById("activeTimer").innerHTML = "Timer: 0:30";
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

// Function to reset the password 
function resetPass(){
  console.log("Reseting pass");
  isUnlocked = false;
  const catContainer = document.getElementById("cat-container");
    const catChildren = catContainer.children;
    if(catChildren.length > 0){
      catChildren[0].remove();
    }
    const catImg = document.createElement("img");
    catImg.src = "../assets/thumbnails_orange_cat.png";
    catImg.setAttribute('id','orangeCat');
    catImg.setAttribute('class','cat-1');
    catContainer.appendChild(catImg);
    const indicator = document.getElementsByClassName("indicator")[0];
    indicator.children[0].remove();
    const newIndicator = document.createElement("i");
    newIndicator.setAttribute("class","fa-solid fa-lock");
    indicator.style.backgroundColor = "#FFA9A9";
    indicator.appendChild(newIndicator);
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

// takes in highestExpression and checks if it matches the password
function checkPass(highestExpression){
  const catContainer = document.getElementById("cat-container");
  const catChildren = catContainer.children;
  const currentImageId = catChildren[0].id.toUpperCase();
  const keys = Object.keys(password);
  
  // switch case for all the cat images
  switch(currentImageId){
    case keys[0]:
      if(highestExpression == password.ORANGECAT && currentImageId == "ORANGECAT"){
        catChildren[0].remove();
        // new cat image will be blue
        const catImg = document.createElement("img");
        catImg.src = "../assets/thumbnails_blue_cat.png";
        catImg.setAttribute('id','blueCat');
        catImg.setAttribute('class','cat-2');
        catContainer.appendChild(catImg);
      }
    case keys[1]:
      if(highestExpression == password.BLUECAT && currentImageId == "BLUECAT"){
        catChildren[0].remove();
        const catImg = document.createElement("img");
        catImg.src = "../assets/thumbnails_purple_cat.png";
        catImg.setAttribute('id','purpleCat');
        catImg.setAttribute('class','cat-3');
        catContainer.appendChild(catImg);
      }
    case keys[2]:
      if(highestExpression == password.PURPLECAT && currentImageId == "PURPLECAT"){
        catChildren[0].remove();
        const unlockImg = document.createElement("img");
        unlockImg.src = "../assets/thumbnails_unlock.png";
        unlockImg.setAttribute('id', 'unlock');
        unlockImg.setAttribute('class','cat');
        const indicator = document.getElementsByClassName("indicator")[0];
        console.log(indicator);
        const indicatorChild = indicator.children;
        indicatorChild[0].remove();
        const newIndicator = document.createElement("i");
        newIndicator.setAttribute("class","fa-solid fa-unlock");
        //newIndicator.setAttribute("color","#green");
        indicator.style.backgroundColor = "green";
        indicator.appendChild(newIndicator);
        isUnlocked = true;
      }
  }
}

function updateDateTime() {
  // Get the current date
  const currentDate = new Date();

  // Get the HTML element with the ID "date"
  document.getElementById("date").innerHTML = currentDate.toLocaleDateString('en-us', dateOptions);
  document.getElementById("time").innerHTML = currentDate.toLocaleTimeString('en-us', timeOptions);
}
