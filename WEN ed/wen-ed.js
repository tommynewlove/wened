'use strict'

const btnSpin = document.querySelector('.spin')

// elements
const reels = document.querySelectorAll('.reel')
const box = document.querySelectorAll('.box')
const images = document.querySelectorAll('.image')
const reelsImages = document.querySelectorAll('.reel--image')
const reel1 = document.querySelectorAll(".image1")
const reel2 = document.querySelectorAll(".image2")
const reel3 = document.querySelectorAll(".image3")



const flash1 = document.querySelector('.flash1')
const flash2 = document.querySelector('.flash2')
const flash3 = document.querySelector('.flash3')



// const reelSpin1 = function(){
//     images.forEach(function(el) {
//         el.classList.add('hidden')

//     })
//     const revealImage1 = Math.trunc(Math.random() * 3) + 1
//     document.getElementById(`reel--1--img--${revealImage1}`).classList.remove('hidden')
//     const revealImage2 = Math.trunc(Math.random() * 3) + 1
//     document.getElementById(`reel--2--img--${revealImage2}`).classList.remove('hidden')
//     const revealImage3 = Math.trunc(Math.random() * 3) + 1
//     document.getElementById(`reel--3--img--${revealImage3}`).classList.remove('hidden')
// };

const reelSpin1 = function(){
    reel1.forEach(function(el) {
        el.classList.add('hidden')
        el.classList.remove('win1')
    })
    const revealImage1 = Math.trunc(Math.random() * 3) + 1
    const image = document.getElementById(`reel--1--img--${revealImage1}`)
    image.classList.remove('hidden')
    image.classList.add('win1')

};

const reelSpin2 = function(){
    reel2.forEach(function(el) {
        el.classList.add('hidden')
        el.classList.remove('win2')
    })
    const revealImage2 = Math.trunc(Math.random() * 3) + 1
    const image = document.getElementById(`reel--2--img--${revealImage2}`)
    image.classList.remove('hidden')
    image.classList.add('win2')
};

const reelSpin3 = function(){
    reel3.forEach(function(el) {
        el.classList.add('hidden')
        el.classList.remove('win3')
    })
    const revealImage3 = Math.trunc(Math.random() * 3) + 1
    const image = document.getElementById(`reel--3--img--${revealImage3}`)
    image.classList.remove('hidden')
    image.classList.add('win3')
};

const winner = function() {

    const win1 = document.querySelector('.win1')
    const win2 = document.querySelector('.win2')
    const win3 = document.querySelector('.win3')
    const winner1 = win1.dataset.number
    const winner2 = win2.dataset.number
    const winner3 = win3.dataset.number

    console.log(winner1, winner2, winner3)

    if (winner1 === winner2 && winner1 === winner3) {
        // flash
        const winFlash = setInterval(flash, 300);
        setTimeout(function() {clearInterval(winFlash)} , 3000)
    }
}

const flash = function() {
    const win1 = document.querySelector('.win1')
    const win2 = document.querySelector('.win2')
    const win3 = document.querySelector('.win3')
    if (win1.classList.contains('hidden')) {
        win1.classList.remove('hidden')
        flash1.classList.add('hidden')
        win2.classList.remove('hidden')
        flash2.classList.add('hidden')
        win3.classList.remove('hidden')
        flash3.classList.add('hidden')
    } else {
        win1.classList.add('hidden')
        flash1.classList.remove('hidden')
        win2.classList.add('hidden')
        flash2.classList.remove('hidden')
        win3.classList.add('hidden')
        flash3.classList.remove('hidden')
    }
}


const spin = function() {
    
    // Change class to image container
    reels.forEach(function(reel) {
        reel.classList.add('reel--image')
        reel.classList.remove('reel')
    })

    // // Hide ? 
    box.forEach(function(box) {
        box.classList.add('hidden')
    })

    // Spin images
    // id="reel--1--img--1">


    const revealImage1 = Math.trunc(Math.random() * 3) + 1
    document.getElementById(`reel--1--img--${revealImage1}`).classList.remove('hidden')
    const revealImage2 = Math.trunc(Math.random() * 3) + 1
    document.getElementById(`reel--2--img--${revealImage2}`).classList.remove('hidden')
    const revealImage3 = Math.trunc(Math.random() * 3) + 1
    document.getElementById(`reel--3--img--${revealImage3}`).classList.remove('hidden')

    // // Set Stop Time 
    // const stopTimer = Math.trunc(Math.random() * 2000) + 3001
    // const spinner = setInterval(reelSpin1, 30);
    // setTimeout(function() {clearInterval(spinner)} , stopTimer)

    // Set Stop Time 
    const stopTimer1 = Math.trunc(Math.random() * 1000) + 1000
    const spinner1 = setInterval(reelSpin1, 30);
    setTimeout(function() {clearInterval(spinner1)} , stopTimer1)

    // Set Stop Time 
    const stopTimer2 = Math.trunc(Math.random() * 1000) + 2000
    const spinner2 = setInterval(reelSpin2, 30);
    setTimeout(function() {clearInterval(spinner2)} , stopTimer2)

    // Set Stop Time 
    const stopTimer3 = Math.trunc(Math.random() * 1000) + 3000
    const spinner3 = setInterval(reelSpin3, 30);
    setTimeout(function() {
        clearInterval(spinner3)
        winner()
        // new function find winner
    } , stopTimer3)

    
}

btnSpin.addEventListener('click' , function() {
    spin()
})