'use strict';

let midSpin = false;

// image HTML variables
let img = '1';
let imgClass = '1';
let reelNum = '1';
let reelClass = `reel${reelNum}`;
let imgHTML = `<img src="wened${img}.jpg" alt="?" class="image image${imgClass}" data-number="${img}" id="reel--${reelNum}--img--${img}"/>`;

// elements
const btnSpin = document.querySelector('.spin');
const resetBtn = document.querySelector('.reset--container');

const reels = document.querySelectorAll('.reel');
const box = document.querySelectorAll('.box');

const playerScore = document.querySelector('.player--score');
const spinsRemain = document.querySelector('.spins--remaining');
const highScore = document.querySelector('.high--score');

const audioReset = new Audio('enjoy_yourselves.wav');
const audioSpin = new Audio('spin.wav');
const audioJuicy = new Audio('juicyspud.wav');
const audioBiscuit = new Audio('biscuit.wav');

//////////////////////////////////////////////////////
// Event Listeners
btnSpin.addEventListener('click', function () {
  spin();
});

resetBtn.addEventListener('click', function () {
  init();
});

///////////////////////////////////////////////////
// Functions

// Init
const init = function () {
  // Reset player score and spins remaining
  spinsRemain.textContent = 10;
  playerScore.textContent = 0;
  midSpin = false;

  const reelsImages = document.querySelectorAll('.reel--image');

  // Swap container
  reelsImages.forEach(function (reel) {
    reel.classList.remove('reel--image');
    reel.classList.add('reel');
  });

  // remove images
  for (let i = 1; i <= 3; i++) {
    const curImg = document.querySelector(`.image${i}`);
    if (curImg) curImg.remove();
  }

  // unHide '?' box
  box.forEach(function (box) {
    box.classList.remove('hidden');
  });

  // Reset border background colour
  reels.forEach(function (reel) {
    reel.style.borderColor = 'goldenrod';
  });

  // Reset background colours and hide the reset button
  highScore.style.backgroundColor = '#222';
  playerScore.style.backgroundColor = '#222';
  resetBtn.classList.add('hidden');

  // Play reset sound
  audioReset.play();
};

// Generate Image HTML
const generateImgHTML = function (reel, imgNum) {
  imgHTML = `<img src="wened${imgNum}.jpg" alt="?" class="image image${reel}" data-number="${imgNum}" id="reel--${reel}--img--${imgNum}"/>`;
  return imgHTML;
};

// Swap the image in each reel
const reelSpin = function (reelNum) {
  // Select random image
  const randomImage = Math.trunc(Math.random() * 3) + 1;
  imgHTML = generateImgHTML(reelNum, randomImage);

  // remove current image
  const curImg = document.querySelector(`.image${reelNum}`);
  if (curImg) curImg.remove();

  // insert new Image
  const reel = document.querySelector(`.reel${reelNum}`);
  reel.insertAdjacentHTML('beforeend', imgHTML);
};

// Spin through reels
const spin = function () {
  // do not continue if already spinning
  if (midSpin) return;

  // do not continue if no spins are remaining
  const curSpins = spinsRemain.textContent;
  if (curSpins === '0') {
    return;
  }

  // set to spinning
  midSpin = true;

  // play spinning audio
  audioSpin.play();

  // Reduce number of spins remaining by 1
  spinsRemain.textContent = Number(curSpins) - 1;

  // Hide the '?' box and swap class to image container for each reel
  reels.forEach(function (reel) {
    if (reel.classList.contains('reel')) {
      // Hide '?' box
      box.forEach(function (box) {
        box.classList.add('hidden');
      });

      // Change class to image container
      reel.classList.add('reel--image');
      reel.classList.remove('reel');
    }
    // reset reel container border colour
    reel.style.borderColor = 'goldenrod';
  });

  let spinTime = 0;
  // Spin reels
  const spin = function () {
    for (let i = 1; i <= 3; i++) {
      const stopTimer = Math.trunc(Math.random() * 1000) + 1000 * i;
      // if last spin, set the timer to run the endSpin function
      if (i === 3) spinTime = stopTimer;
      // Spin reels
      const spinner = setInterval(reelSpin, 30, i);
      setTimeout(function () {
        clearInterval(spinner);
        document.getElementById(`reel--${i}`).style.borderColor = 'orangered';
      }, stopTimer);
    }
  };
  spin();

  // Run the endSpin function to check for any winning combinations and update score etc.
  setTimeout(endSpin, spinTime);
};

// Endspin
const endSpin = function () {
  const win1 = document.querySelector('.image1').dataset.number;
  const win2 = document.querySelector('.image2').dataset.number;
  const win3 = document.querySelector('.image3').dataset.number;
  const curScore = playerScore.textContent;
  let winArr = [];

  // All 3 images match
  if (win1 === win2 && win1 === win3) {
    // set winning reel array
    winArr = [1, 2, 3];
    // play audio
    audioJuicy.play();
    // increase score
    playerScore.textContent = Number(curScore) + 10;
    // Set css border color
    winningBorder(winArr)
    // Flash winning images
    winFlash(3150, winArr);

    // First 2 images match
  } else if (win1 === win2) {
    winArr = [1, 2];
    audioBiscuit.play();
    playerScore.textContent = Number(curScore) + 3;
    winningBorder(winArr)
    winFlash(1350, winArr);

    // No images match
  } else {
    reels.forEach(function (reel) {
      reel.style.borderColor = 'rgb(146, 41, 2, 0.959)';
    });
    midSpin = false;
  }

  // Update high score
  const curSpins = spinsRemain.textContent;
  if (curSpins === '0') {
    const finalScore = Number(playerScore.textContent);
    const curHighScore = Number(highScore.textContent);
    if (curHighScore < finalScore) {
      highScore.textContent = finalScore;
      highScore.style.backgroundColor = 'green';
    }

    playerScore.style.backgroundColor = 'green';
    resetBtn.classList.remove('hidden');
  }
};

// Flash timer
const winFlash = function (timeout, winArr) {
  const flashInterval = setInterval(flash, 300, winArr);
  setTimeout(function () {
    clearInterval(flashInterval);
    midSpin = false;
  }, timeout);
};

// Flash animation
const flash = function (reelArr) {
  reelArr.forEach(function (reelNum) {
    const image = document.querySelector(`.image${reelNum}`);
    const flash = document.getElementById(`flash--${reelNum}`);
    if (image.classList.contains('hidden')) {
      flash.classList.add('hidden');
      image.classList.remove('hidden');
    } else {
      image.classList.add('hidden');
      flash.classList.remove('hidden');
    }
  });
};


// Set winning container border color
const winningBorder = function (winArr) {
  winArr.forEach(function (reel) {
    document.getElementById(`reel--${reel}`).style.borderColor = 'greenyellow';
  });
};
