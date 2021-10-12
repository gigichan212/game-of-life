let screen = 0; // Switching between Opening and GameOn
let mode = 0; // Switching between different Styles
let keyMode = false;
let grey = false

let unitLength = 20;
let boxColor = '#';
let boxColor2 = '#';
let strokeColor = '#';
let columns; /* To be determined by window width*/
let rows; /* To be determined by window height */
let currentBoard;
let nextBoard;
/** About speed */
let slider;
let fr = 2;
/** About Keyboard control */
let keyX = 0;
let keyY = 0;
let keyTempStorelist = [];
let confirmed = false; // confirm to select life
/** About Rule of survival*/
let LonelinessOption = 2;
let OverpopulationOption = 3;
let reproductionOption = 3;
/** About the Sound */
document.createElement("audio");
let myAudio = document.querySelector('#myAudio');
myAudio.src = "assets/audio/leadguitar.mp3";
myAudio.play();
myAudio.pause();
let playing = false;
const play = document.querySelector("#play")



/** About Rule of survival*/
const LonelinessOptions = document.querySelector('#dieForLoneliness');
LonelinessOptions.addEventListener('change', (event) => {
    LonelinessOption = event.target.value
    console.log("LonelinessOption: " + LonelinessOption)
});

const OverpopulationOptions = document.querySelector('#dieForOverpopulation');
OverpopulationOptions.addEventListener('change', (event) => {
    OverpopulationOption = event.target.value
    console.log("OverpopulationOption: " + OverpopulationOption)
});

const reproductionOptions = document.querySelector('#reproduction');
reproductionOptions.addEventListener('change', (event) => {
    reproductionOption = event.target.value
    console.log("reproduction: " + reproductionOption)
});


/** Popover */
$(function () {
    $('[data-toggle="popover"]').popover()
})

/** Multiple Color */
let colorLetter = "0123456789ABCDEF"
function colorGen() {
    boxColor = '#';
    boxColor2 = '#';
    strokeColor = "#"
    for (z = 0; z < 6; z++) {
        boxColor = boxColor + colorLetter[Math.floor(Math.random() * 16)]
        boxColor2 = boxColor2 + colorLetter[Math.floor(Math.random() * 16)]
        strokeColor = strokeColor + colorLetter[Math.floor(Math.random() * 16)]
    }
    console.log(boxColor)
    console.log(boxColor2)
}


/**
* Preset Function
*/
// 1. Clear All Life (keep Setting )
function clearLife() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = 0;
            nextBoard[i][j] = 0;
        }
    }
}
// 2. Initialize/reset the board state
function init() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = 0;
            nextBoard[i][j] = 0;
        }
    }
    LonelinessOptions.value = 2;
    LonelinessOption = 2;

    OverpopulationOptions.value = 3;
    OverpopulationOption = 3;

    reproductionOptions.value = 3;
    reproductionOption = 3;

    slider.value(2)

    confirmed = false

    mode = 0
}


/** Buttons */
// 1. RANDOM
const randombtn = document.querySelector('#random-game')
randombtn.addEventListener("click", function () {
    colorGen()
    if (screen == 1) {
        init();
        currentBoard = [];
        nextBoard = [];
        for (let i = 0; i < columns; i++) {
            currentBoard[i] = [];
            nextBoard[i] = []
            for (let j = 0; j < rows; j++) {
                currentBoard[i][j] = random() > 0.8 ? 1 : 0;
                nextBoard[i][j] = 0;
            }

        }
        gameOn()
        noLoop()
    }

});
// 2. Pause
const pausebtn = document.querySelector('#pause-game')
pausebtn.addEventListener("click", function () {
    noLoop();
});
// 3. Continue
const continuebtn = document.querySelector("#continue-game")
continuebtn.addEventListener("click", function () {
    loop();
    mode = 0
})
// 4. Clear Life
const clearbtn = document.querySelector('#clear-game')
clearbtn.addEventListener("click", function () {
    if (screen == 1) {
        clearLife()
        keyTempStorelist = []
        confirmed = false
    }
});

// 5. Reset All 
const resetbtn = document.querySelector('#reset-game')
resetbtn.addEventListener("click", function () {
    if (screen == 1) {
        init();
        keyTempStorelist = []
    }
});

// 6. Color Mode 
const greybtn = document.querySelector('#grey')
greybtn.addEventListener("click", function () {
    if (!grey) {
        frameRate(100)
        grey = true
        document.querySelector('.game.row').style.backgroundColor = "grey"
        greybtn.innerHTML = "BRIGHT"
        greybtn.style.backgroundColor = "white"
        greybtn.style.color = "#dc3545"
    } else if (grey) {
        frameRate(100)
        grey = false
        document.querySelector('.game.row').style.backgroundColor = "white"
        greybtn.innerHTML = "GREY"
        greybtn.style.backgroundColor = "#6c757d"
        greybtn.style.color = "white"
    }

});


// 7. BoardSize
const boardSize = document.querySelector('#boardSize');
boardSize.addEventListener('change', (event) => {
    if (event.target.value == 10) {
        unitLength = 10
    }
    else if (event.target.value == 20) {
        unitLength = 20
    } else if (event.target.value == 30) {
        unitLength = 30
    }

    columns = floor(width / unitLength);
    rows = floor(height / unitLength);

    currentBoard = [];
    nextBoard = [];
    for (let i = 0; i < columns; i++) {
        currentBoard[i] = [];
        nextBoard[i] = []
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = 0;
            nextBoard[i][j] = 0;
        }

    }
});



function setup() {
    colorGen()
    /* Set the canvas to be under the element #canvas*/
    let canvas = createCanvas(600, windowHeight - 100);
    if (windowWidth < 800) {
        resizeCanvas(windowWidth - 50, windowHeight - 100);
    }
    canvas.parent(document.querySelector('#canvas'));

    canvas.mousePressed(canvasPressed);
    // About Speed
    slider = createSlider(2, 20, 0, 0); //(start value, end value, default value, step)
    slider.style('width', '60%');
    slider.style('color', '#dc3545')
    slider.id("speedControl")
    slider.parent(document.querySelector("#speed"))


    frameRate(fr);


    /*Calculate the number of columns and rows */
    columns = floor(width / unitLength);
    rows = floor(height / unitLength);
    console.log("width: " + width)
    console.log("height: " + height)
    console.log("columns: " + columns)
    console.log("rows: " + rows)

    /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
    currentBoard = [];
    nextBoard = [];
    for (let i = 0; i < columns; i++) {
        currentBoard[i] = [];
        nextBoard[i] = []
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = random() > 0.8 ? 1 : 0;
            nextBoard[i][j] = 0;
        }

    }
    // console.log(currentBoard)

    // Now both currentBoard and nextBoard are array of array of undefined values.

    // Start with no looping
    noLoop()


}

function windowResized() {
    resizeCanvas(600, windowHeight - 100);
    if (windowWidth < 800) {
        resizeCanvas(windowWidth - 50, windowHeight - 100);
    }
}

/** About Mode and Screen */
// From Opening to GameOn
function canvasPressed() {
    if (screen == 0) {
        screen = 1
        playing = true;
        play.innerHTML = '<i class="fas fa-volume-up"></i>'
        myAudio.play();
    }
}

// Switching between different Styles
const patterns = document.querySelector('#patterns')
patterns.addEventListener("change", function (event) {
    if (event.target.value === "none") {
        mode = 0
        clearLife()
    }
    else if (event.target.value === "glider") {
        mode = 1
        console.log("mode: " + mode)
    } else if (event.target.value === "quadpole") {
        mode = 2
        console.log("mode: " + mode)
    }
});

function draw() {
    if (screen == 0) {
        startScreen()
    } else if (mode == 0) {
        gameOn()
    } else if (mode == 1) {
        mode1()
    } else if (mode == 2) {
        mode2()
    }
}

// 1. Opening Screen 
function startScreen() {
    frameRate(20)
    textAlign(CENTER);
    textStyle(BOLD);
    textSize(40 + (mouseX / width) * 20);
    textFont("Comic Sans MS");
    text("Click to Start", width / 2, height / 2);
}
// 2. Gameon Screen
function gameOn() {
    /** About Board Size*/
    if (grey) {
        background("grey")
    } else if (!grey) {
        background(255)
    }

    generate();

    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentBoard[i][j] == 1) {
                fill(boxColor);
                stroke(strokeColor);
                if (nextBoard[i][j] == 1) {
                    fill("#E8E8E8")
                    stroke("#505050");
                } else if ((nextBoard[i][j] != 1) && i % 2 == 0) {
                    fill(boxColor);
                    stroke(strokeColor);
                }
                else {
                    fill(boxColor2)
                    stroke(strokeColor);
                }

            } else {
                if (grey) {
                    fill("grey");
                    stroke("#dc3545");
                } else if (!grey) {
                    fill(255);
                    stroke(strokeColor);
                }

            }


            // About Speed
            let val = slider.value();
            frameRate(val);
            rect(i * unitLength, j * unitLength, unitLength, unitLength);
        }
    }

}




function generate() {
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            let neighbors = 0;
            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    if (i === 0 && j === 0) {
                        // the cell itself is not its own neighbor
                        continue;
                    }
                    // The modulo operator is crucial for wrapping on the edge
                    neighbors += currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
                }
            }

            // Rules of Life
            if (currentBoard[x][y] == 1 && neighbors < LonelinessOption) {
                // Die of Loneliness
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 1 && neighbors > OverpopulationOption) {
                // Die of Overpopulation
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 0 && neighbors == reproductionOption) {
                // New life due to Reproduction
                nextBoard[x][y] = 1;
            } else {
                // Stasis
                nextBoard[x][y] = currentBoard[x][y];
            }
        }
    }

    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
}


/** Placing Life */
// 1. Using Mouse to control
// When mouse is dragged
function mouseDragged() {

    noLoop()
    if (screen === 1 && mode === 0) {
        /**
         * If the mouse coordinate is outside the board
         */
        if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
            return;
        }
        const x = Math.floor(mouseX / unitLength);
        const y = Math.floor(mouseY / unitLength);
        currentBoard[x][y] = 1;
        fill(0);
        stroke("#dc3545");
        rect(x * unitLength, y * unitLength, unitLength + 1, unitLength + 1);
    } else {
        return;
    }

}
// When mouse is released
function mouseReleased() {
    if (screen === 1) {
        loop();
    } else {
        return
    }

}

// 2. Using Keybroad to control
function keyPressed() {
    if (keyCode == 18 && (mode === 1 || mode === 2)) {
        keyMode = false;
        textAlign(CENTER);
        textStyle(BOLD);
        textSize(40);
        fill(0);
        stroke(255);
        textFont("Comic Sans MS");
        text("Key Mode is not Avaiable", width / 2, height / 2);
    } else if (screen === 1 && keyCode == 18 && keyMode == false) {
        keyMode = true;
        textAlign(CENTER);
        textStyle(BOLD);
        textSize(40);
        fill(0);
        stroke(255);
        textFont("Comic Sans MS");
        text("Key Mode is On", width / 2, height / 2);
    } else if (screen === 1 && keyCode == 18 && keyMode == true) {
        textAlign(CENTER);
        textStyle(BOLD);
        textSize(40);
        fill(0);
        stroke(255);
        textFont("Comic Sans MS");
        text("Key Mode is Off", width / 2, height / 2);
        loop()
        keyMode = false;
    }


    if (screen === 1 && keyMode == true && mode == 0) {
        console.log("keypressed")
        // if keycode ==  "tab"
        if (keyCode === 9) {
            if (!confirmed) {
                confirmed = true
            } else {
                confirmed = false
            }

        }

        let x = Math.floor(keyX / unitLength);
        let y = Math.floor(keyY / unitLength);

        
        if (x <= -1) {
            keyX = unitLength * columns - unitLength//0
            x = columns - 1//0
        } else if (x >= columns) {
            x = 0//columns - 1
            keyX = 0//unitLength * columns - unitLength
        } else if (y <= -1) {
            keyY = unitLength * rows - unitLength
            y = rows - 1
        } else if (y >= rows) {
            y = 0 // rows - 1
            keyY = 0 //unitLength * rows - unitLength
        }
        // console.log("keyX: " + keyY)
        // console.log("keyY: " + keyX)
        // console.log("x: "+ x)
        // console.log("y: "+ y )


        if (confirmed == false) {
            // left 
            if (keyCode === 37) {
                keyX -= unitLength;
            }
            // right 
            if (keyCode === 39) {
                keyX += unitLength;
            }
            // up 
            if (keyCode === 38) {
                keyY -= unitLength;
            }
            // down
            if (keyCode === 40) {
                keyY += unitLength;
            }
            fill("#dc3545");
            stroke(255);
            rect(x * unitLength, y * unitLength, unitLength + 1, unitLength + 1);

            // if keycode ==  "space"
            if (keyCode === 32) {
                noLoop()
            }
        } else if (confirmed == true) {
            noLoop()
            if (keyIsDown(LEFT_ARROW)) {
                keyX -= unitLength;
            }
            if (keyIsDown(RIGHT_ARROW)) {
                keyX += unitLength;
            }
            if (keyIsDown(UP_ARROW)) {
                keyY -= unitLength;
            }
            if (keyIsDown(DOWN_ARROW)) {
                keyY += unitLength;
            }
            console.log("confirmed")
            fill(0);
            stroke("#dc3545");
            rect(x * unitLength, y * unitLength, unitLength + 1, unitLength + 1);
            keyTempStorelist.push([x, y])
            for (const keyTempStore of keyTempStorelist) {
                currentBoard[keyTempStore[0]][keyTempStore[1]] = 1;
                console.log(keyTempStore)
            }

        }


        // if keycode ==  "enter"
        if (keyCode === 13) {
            loop()
            confirmed = false
            keyTempStorelist = []
        }

        // if keycode ==  "esc"
        if (keyCode === 27) {
            clearLife()
            keyTempStorelist = []
            confirmed = false
        }
        return false

    }

}



/** Switching between different Patterns */
function mode1() {
    currentBoard = [];
    nextBoard = [];
    for (let i = 0; i < columns; i++) {
        currentBoard[i] = [];
        nextBoard[i] = []
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = 0
        }

    }
    currentBoard[0][0] = 1
    currentBoard[2][0] = 1
    currentBoard[1][1] = 1
    currentBoard[2][1] = 1
    currentBoard[1][2] = 1

    if (grey) {
        background("grey")
    } else if (!grey) {
        background(255)
    }

    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentBoard[i][j] == 1) {
                fill(boxColor);
                stroke(strokeColor);
                if (nextBoard[i][j] == 1) {
                    fill("#E8E8E8")
                    stroke("#505050");
                } else if ((nextBoard[i][j] != 1) && i % 2 == 0) {
                    fill(boxColor);
                    stroke(strokeColor);
                }
                else {
                    fill(boxColor2)
                    stroke(strokeColor);
                }

            } else {
                if (grey) {
                    frameRate(20)
                    fill("grey");
                    stroke("#dc3545");
                } else if (!grey) {
                    frameRate(20)
                    fill(255);
                    stroke(strokeColor);
                }
            }


            // About Speed
            let val = slider.value();
            frameRate(val);
            rect(i * unitLength, j * unitLength, unitLength, unitLength);

        }
    }
}

function mode2() {
    currentBoard = [];
    nextBoard = [];
    for (let i = 0; i < columns; i++) {
        currentBoard[i] = [];
        nextBoard[i] = []
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = 0
        }

    }
    currentBoard[0][0] = 1
    currentBoard[0][1] = 1
    currentBoard[1][0] = 1
    currentBoard[1][2] = 1
    currentBoard[3][2] = 1
    currentBoard[3][4] = 1
    currentBoard[5][4] = 1
    currentBoard[5][6] = 1
    currentBoard[6][5] = 1
    currentBoard[6][6] = 1

    if (grey) {
        frameRate(20)
        background("grey")
    } else if (!grey) {
        frameRate(20)
        background(255)
    }
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentBoard[i][j] == 1) {
                fill(boxColor);
                stroke(strokeColor);
                if (nextBoard[i][j] == 1) {
                    fill("#E8E8E8")
                    stroke("#505050");
                } else if ((nextBoard[i][j] != 1) && i % 2 == 0) {
                    fill(boxColor);
                    stroke(strokeColor);
                }
                else {
                    fill(boxColor2)
                    stroke(strokeColor);
                }

            } else {
                if (grey) {
                    frameRate(20)
                    fill("grey");
                    stroke("#dc3545");
                } else if (!grey) {
                    frameRate(20)
                    fill(255);
                    stroke(strokeColor);
                }
            }


            // About Speed
            let val = slider.value();
            frameRate(val);
            rect(i * unitLength, j * unitLength, unitLength, unitLength);

        }
    }
}



/** About the Sound */
play.addEventListener("click", (event) => {
    if (playing == false) {
        playing = true;
        play.innerHTML = '<i class="fas fa-volume-up"></i>'
    } else if (playing == true) {
        playing = false;
        play.innerHTML = '<i class="fas fa-volume-mute"></i>'
    }

    if (playing == true) {
        myAudio.play();
    } else if (playing == false) {
        myAudio.pause();
    }
})

