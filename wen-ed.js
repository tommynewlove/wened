'use strict';

// variables
let midSpin = false;
let mini1Ready = true;
let mini1Speed;
const images = 4;
// image code, prize, odds
const prizes = [
  [1, 50],
  [2, 25],
  [3, 10],
  [4, 5],
];

const weights = [1, 2, 3, 4];

const randomNumber = function (number) {
  return Math.trunc(Math.random() * number + 1);
};

let hold = false;
let flashHoldInterval1;
let flashHoldInterval2;
let flashHoldInterval3;
let flashSpinInterval;
let flashResetInterval;
let flashReelsInterval;

// image HTML variables
let img = '1';
let imgClass = '1';
let reelNum = '1';
let reelClass = `reel${reelNum}`;
let imgHTML = `<img src="wened${img}.jpg" alt="?" class="image image${imgClass}" data-number="${img}" id="reel--${reelNum}--img--${img}"/>`;

// elements
const spinContainer = document.querySelector('.spin--container');
const btnSpin = document.querySelector('.spin');
const resetContainer = document.querySelector('.reset--container');
const resetBtn = document.querySelector('.reset--btn');
const btnHold1 = document.getElementById('hold--1');
const btnHold2 = document.getElementById('hold--2');
const btnHold3 = document.getElementById('hold--3');
const btnHoldAll = document.querySelectorAll('.hold');

const reels = document.querySelectorAll('.reel');
const box = document.querySelectorAll('.box');

const bet = document.querySelector('.input--bet');
const playerScore = document.querySelector('.player--score');
const credits = document.querySelector('.spins--remaining');
const highScore = document.querySelector('.high--score');

const audioReset = new Audio('enjoy_yourselves.wav');
const audioSpin = new Audio('spin.wav');
const audioJuicy = new Audio('juicyspud.wav');
const audioBiscuit = new Audio('biscuit.wav');

//  minigame1 elements
const mini1Container = document.querySelector('.minigame1--container');
const double = document.querySelector('.double');
const nothing = document.querySelector('.nothing');
const btnMini1Bank = document.querySelector('.bank--btn');
const btnMini1Stop = document.querySelector('.stop--btn');
const scoreMini1 = document.querySelector('.minigame1--score');
const mini1Flash = document.querySelectorAll('.mini1--flash');

//////////////////////////////////////////////////////
// Event Listeners
btnSpin.addEventListener('click', function () {
  spin();
});

resetBtn.addEventListener('click', function () {
  init();
});

btnHold1.addEventListener('click', function (e) {
  if (hold) holdFunc(1);
});

btnHold2.addEventListener('click', function () {
  if (hold) holdFunc(2);
});

btnHold3.addEventListener('click', function () {
  if (hold) holdFunc(3);
});

btnMini1Bank.addEventListener('click', function (e) {
  if (mini1Ready) {
    mini1Bank();
    mini1Ready = false;
  }
});

btnMini1Stop.addEventListener('click', function (e) {
  if (mini1Ready) {
    mini1Stop(mini1Speed, scoreMini1.textContent);
    mini1Ready = false;
  }
});

///////////////////////////////////////////////////
// Functions

// Image Generator
let distribution = [];
const createDistribution = (prizes, weights) => {
  // Create an array to which to choose a random element from
  // The array will contain duplicate entires of the prizes with the most likely having more entries in the array
  weights.forEach(function (el, index) {
    for (let i = 1; i <= el; i++) distribution.push(prizes[index]);
  });

  return distribution;
};
createDistribution(prizes, weights);

// Init
const init = function () {
  // Reset player score and spins remaining
  bet.value = 0;
  credits.textContent = 100;
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
  highScore.style.color = 'white';
  playerScore.style.color = 'white';
  resetContainer.classList.add('hidden');
  spinContainer.classList.remove('hidden');

  // Play reset sound
  // audioReset.play();

  // flash animations
  flashHoldInterval1 = setInterval(flashHoldButtons, 150, 1);
  flashHoldInterval2 = setInterval(flashHoldButtons, 150, 2);
  flashHoldInterval3 = setInterval(flashHoldButtons, 150, 3);
  flashSpinInterval = setInterval(flashSpinButton, 150);
  flashReelsInterval = setInterval(flashReels, 150);
  clearInterval(flashResetInterval);
};

// Generate Image HTML
const generateImgHTML = function (reel, imgNum) {
  imgHTML = `<img src="wened${imgNum}.jpg" alt="?" class="image image${reel}" data-number="${imgNum}" id="reel--${reel}--img--${imgNum}"/>`;
  return imgHTML;
};

// Set first image in the reel
const initReel = function (reelNum) {
  const reel = document.querySelector(`.reel${reelNum}`);
  if (!reel.classList.contains('hold--reel')) {
    // remove current image
    const curImg = document.querySelector(`.image${reelNum}`);
    if (curImg) curImg.remove();

    const imgHTML = generateImgHTML(reelNum, reelNum);
    reel.insertAdjacentHTML('beforeend', imgHTML);
  }
  //
};

// Swap the image in each reel
const reelSpin = function (reelNum) {
  // if reel not on hold swap images
  const reel = document.querySelector(`.reel${reelNum}`);
  // console.log(reel);
  if (!reel.classList.contains('hold--reel')) {
    // remove current image
    const curImg = document.querySelector(`.image${reelNum}`);
    // console.log(curImg);
    const imgNum = Number(curImg.dataset.number);
    //
    if (curImg) curImg.remove();
    // insert next Image
    let nextImg;
    if (imgNum < images) nextImg = imgNum + 1;
    else nextImg = 1;
    const imgHTML = generateImgHTML(reelNum, nextImg);
    reel.insertAdjacentHTML('beforeend', imgHTML);
  }
};

const winningImage = function (reelNum) {
  const reel = document.querySelector(`.reel${reelNum}`);
  if (!reel.classList.contains('hold--reel')) {
    const winnerIndex = Math.trunc(Math.random() * distribution.length);
    const curImg = document.querySelector(`.image${reelNum}`);
    if (curImg) curImg.remove();
    imgHTML = generateImgHTML(reelNum, distribution[winnerIndex][0]);
    reel.insertAdjacentHTML('beforeend', imgHTML);
  }
};

// Spin through reels
const spin = function () {
  // do not continue if already spinning
  if (midSpin) return;

  // do not continue if no spins are remaining
  const curSpins = credits.textContent;
  if (curSpins === '0') {
    return;
  }

  if (bet.value > Number(credits.textContent)) {
    alert('not enuf credits bozo');
    return;
  }

  if (bet.value == 0) {
    alert('enter bet amount doofus');
    return;
  }

  midSpin = true;

  // Clear animations
  clearInterval(flashHoldInterval1);
  clearInterval(flashHoldInterval2);
  clearInterval(flashHoldInterval3);
  clearInterval(flashSpinInterval);
  clearInterval(flashReelsInterval);

  // Reset button color
  btnSpin.style.borderColor = 'red';

  // play spinning audio
  audioSpin.play();

  // Reduce number of spins remaining by bet amt
  credits.textContent = Number(curSpins) - bet.value;

  // Hide the '?' box and swap class to image container for each reel
  reels.forEach(function (reel) {
    if (reel.classList.contains('reel')) {
      // Hide '?' box
      box.forEach(function (box) {
        box.classList.add('hidden');
      });

      // Change class to image container
      reel.classList.add('reel--image');
      // reel.classList.remove('reel');
    }
    // reset reel container border colour
    if (!hold) reel.style.borderColor = 'goldenrod';
  });

  // Reset hold buttons
  ResetHoldButtons();

  // let spinTime = 0;
  // // Spin reels
  // const spin = function () {
  // Create array of reels in play
  let liveReels = [];
  reels.forEach(function (el) {
    if (!el.classList.contains('hold--reel'))
      liveReels.push(Number(el.dataset.reelnum));
  });
  const totalLiveReels = liveReels.length;
  ///////////////////////////

  // Spin reels
  // Stoptimer is reduced if some reels are held
  // liveReels.forEach(function (reel, i) {
  //   const stopTimer = Math.trunc(Math.random() * 1000) + 1000 * (i + 1);
  //   // if last spin, set the timer to run the endSpin function
  //   if (i + 1 === totalLiveReels) spinTime = stopTimer;
  //   const spinner = setInterval(reelSpin, 30, reel);
  //   setTimeout(function () {
  //     clearInterval(spinner);

  //     const el = document.getElementById(`reel--${i+1}`);
  //     if (!el.classList.contains('hold--reel')) {
  //       el.style.borderColor = 'orangered';
  //     }
  //   }, stopTimer);
  // });

  let spinTime = 0;
  // Spin reels
  const spin = function () {
    // Spin reels
    // Stoptimer is reduced if some reels are held
    liveReels.forEach(function (reel, i) {
      // set the first images
      initReel(i + 1);
      const stopTimer = Math.trunc(Math.random() * 1000) + 1000 * (i + 1);
      // if last spin, set the timer to run the endSpin function
      if (i + 1 === totalLiveReels) spinTime = stopTimer;
      const spinner = setInterval(reelSpin, 30, reel);
      setTimeout(function () {
        clearInterval(spinner);

        const reelNum = i + 1;
        const el = document.getElementById(`reel--${reelNum}`);
        if (!el.classList.contains('hold--reel')) {
          winningImage(reelNum);
          el.style.borderColor = 'orangered';
        }
      }, stopTimer);
    });

    // for (let i = 1; i <= 3; i++) {
    //   const stopTimer = Math.trunc(Math.random() * 1000) + 1000 * i;
    //   // if last spin, set the timer to run the endSpin function
    //   if (i === 3) spinTime = stopTimer;
    //   // Spin reels
    //   const spinner = setInterval(reelSpin, 30, i);
    //   setTimeout(function () {
    //     clearInterval(spinner);

    //     const el = document.getElementById(`reel--${i}`);
    //     if (!el.classList.contains('hold--reel')) {
    //       el.style.borderColor = 'orangered';
    //     }
    //   }, stopTimer);
    // }
  };

  spin();

  // Run the endSpin function to check for any winning combinations and update score etc.
  setTimeout(endSpin, spinTime);
};

// Endspin
const endSpin = function () {
  let win = false;
  const win1 = document.querySelector('.image1').dataset.number;
  const win2 = document.querySelector('.image2').dataset.number;
  const win3 = document.querySelector('.image3').dataset.number;
  const curScore = Number(playerScore.textContent);
  let points =
    prizes
      .filter(arr => arr[0] === Number(win1))
      .map(arr => arr[1])
      .reduce((acc, points) => points, 0) * bet.value;
  let newScore = 0;
  // console.log(points);
  let winArr = [];

  // Clear all held images
  reels.forEach(function (reel) {
    reel.classList.remove('hold--reel');
  });

  // All 3 images match
  if (win1 === win2 && win1 === win3) {
    win = true;
    // set winning reel array
    winArr = [1, 2, 3];
    // play audio
    audioJuicy.play();
    // increase score
    newScore = curScore + points;
    // playerScore.textContent = Number(curScore) + points;
    scoreIncrease(points, newScore);
    // Set css border color
    winningBorder(winArr);
    // Flash winning images
    winFlash(3150, winArr);

    // First 2 images match
  } else if (win1 === win2) {
    win = true;
    winArr = [1, 2];
    audioBiscuit.play();
    points = points / 5;
    newScore = curScore + points;
    // playerScore.textContent = Number(curScore) + 1 * bet;
    // scoreIncrease(points, newScore);
    winningBorder(winArr);
    // winFlash(1350, winArr);
    spinContainer.classList.add('hidden');
    mini1Container.classList.remove('hidden');
    mini1Speed = 800;
    minigame1Speed(mini1Speed, points);

    // No images match
  } else {
    reels.forEach(function (reel) {
      reel.style.borderColor = 'rgb(146, 41, 2, 0.959)';
    });
    midSpin = false;

    // Hold function
    const holdNumber = randomNumber(3);

    if (credits.textContent !== '0') {
      if (holdNumber === 1) {
        hold = true;
        // flash buttons
        flashHoldInterval1 = setInterval(flashHoldButtons, 75, 1);
        flashHoldInterval2 = setInterval(flashHoldButtons, 75, 2);
        flashHoldInterval3 = setInterval(flashHoldButtons, 75, 3);
      }
    }
  }

  if (credits.textContent !== '0')
    flashSpinInterval = setInterval(flashSpinButton, 150);

  // Update high score
  const curSpins = credits.textContent;
  if (curSpins === '0') {
    // update final score
    let finalScore = curScore;
    if (win) finalScore = Number(playerScore.textContent) + points;
    //
    const curHighScore = Number(highScore.textContent);
    if (curHighScore < finalScore) {
      highScore.textContent = finalScore;
      highScore.style.color = 'greenyellow';
    }

    playerScore.style.color = 'greenyellow';
    spinContainer.classList.add('hidden');
    resetContainer.classList.remove('hidden');
    flashResetInterval = setInterval(flashResetButton, 150);
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

const flashReels = function () {
  reels.forEach(function (reel) {
    const borderColor = reel.style.borderColor;
    if (borderColor === 'goldenrod') reel.style.borderColor = 'white';
    else reel.style.borderColor = 'goldenrod';
  });
};

const flashHoldButtons = function (reel) {
  const el = document.getElementById(`hold--${reel}`);
  const borderColor = el.style.borderColor;
  if (borderColor === 'blue') el.style.borderColor = 'white';
  else el.style.borderColor = 'blue';
};

const flashSpinButton = function () {
  if (btnSpin.style.borderColor === 'red') btnSpin.style.borderColor = 'white';
  else btnSpin.style.borderColor = 'red';
};

const flashResetButton = function () {
  if (resetBtn.style.borderColor === 'red')
    resetBtn.style.borderColor = 'white';
  else resetBtn.style.borderColor = 'red';
};

const ResetHoldButtons = function () {
  btnHoldAll.forEach(function (el) {
    clearInterval(flashHoldInterval1);
    clearInterval(flashHoldInterval2);
    clearInterval(flashHoldInterval3);
    el.style.borderColor = 'blue';
    hold = false;
  });
};

const holdFunc = function (reelNum) {
  const reel = document.querySelector(`.reel${reelNum}`);
  reel.style.borderColor = 'blue';
  reel.classList.add('hold--reel');

  if (reelNum === 1) clearInterval(flashHoldInterval1);
  if (reelNum === 2) clearInterval(flashHoldInterval2);
  if (reelNum === 3) clearInterval(flashHoldInterval3);

  const holdBtn = document.getElementById(`hold--${reelNum}`);
  holdBtn.classList.add('held');
  holdBtn.style.borderColor = 'white';
};

const scoreIncrease = function (points, max) {
  const timeInterval = 1000 / points;
  const increaseScore = setInterval(
    function () {
      const curScore = Number(playerScore.textContent);
      const score = curScore + 1;
      if (curScore < max) {
        playerScore.textContent = `${score}`;
      } else clearInterval(increaseScore);
    },
    timeInterval,
    points
  );
};

let flashOptionMini1;
let flashMini1Score;
const minigame1Speed = function (speed, points) {
  mini1Ready = true;
  scoreMini1.textContent = points;
  scoreMini1.style.color = 'white';

  nothing.classList.remove('opacity');
  double.classList.add('opacity');

  const toggleWin = function () {
    mini1Flash.forEach(function (el) {
      el.classList.toggle('opacity');
    });
  };

  flashMini1Score = setInterval(opacity, 50, scoreMini1);
  flashOptionMini1 = setInterval(toggleWin, speed);
};

const mini1Stop = function (speed, score) {
  let endMini1 = false;
  let lose = false;
  clearInterval(flashOptionMini1);

  // if win
  if (!double.classList.contains('opacity')) {
    scoreMini1.style.color = 'greenyellow';
    scoreMini1.textContent = `${Number(score) * 2}`;
  } else {
    endMini1 = true;
    lose = true;
    scoreMini1.textContent = 0;
    scoreMini1.style.color = 'red';
    mini1Bank();
  }

  // flash seletion
  mini1Flash.forEach(function (el) {
    if (!el.classList.contains('opacity')) {
      flashOptionMini1 = setInterval(opacity, 50, el);
    }
  });

  if (!lose) {
    setTimeout(function () {
      clearInterval(flashMini1Score);
      clearInterval(flashOptionMini1);
      scoreMini1.classList.remove('opacity');
      mini1Flash.forEach(el => el.classList.remove('opacity'));
      //
      const speedReduction = speed / 2;
      if (speed == 50) {
        endMini1 = true;
      }
      mini1Speed -= speedReduction;
      //
      if (!endMini1) {
        console.log(speedReduction);
        console.log(mini1Speed);
        minigame1Speed(mini1Speed, Number(score) * 2);
      } else {
        mini1Bank();
      }
    }, 1000);
  }
};

const mini1Bank = function () {
  clearInterval(flashOptionMini1);
  mini1Flash.forEach(el => el.classList.add('opacity'));
  //
  setTimeout(function () {
    clearInterval(flashMini1Score);
    const points = Number(scoreMini1.textContent);
    const max =
      Number(playerScore.textContent) + Number(scoreMini1.textContent);
    scoreIncrease(points, max);
    //
    mini1Container.classList.add('hidden');
    spinContainer.classList.remove('hidden');
    midSpin = false;
  }, 1000);
};

const opacity = function (el) {
  el.classList.toggle('opacity');
};

init();
