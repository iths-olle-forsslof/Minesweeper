// skicka med klickparametrarna i initfunktionen och generera banan efter dem.
// "Om klickparam != 0 init again"

let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d');

let easyBtn = document.querySelector('.easy');
let mediumBtn = document.querySelector('.medium');
let hardBtn = document.querySelector('.hard');

// Bestämmer storleken på cellerna
let cellSize = 25;

// Bestämmer antalet kolumner och rader
let cols = 20;
let rows = 20;
// let numOfBombs = 20;

let width = cols * cellSize;
let height = rows * cellSize;

let gameStarted = false;
let difficulty = 60;
let bombsLeft = document.querySelector('.bombs-left');

canvas.setAttribute('width', width)
canvas.setAttribute('height', height)

for (let i = 0; i < cols; i++){
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#606894';
    ctx.stroke();
    ctx.closePath();
}

for (let i = 0; i < cols; i++){
    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(width, i * cellSize);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#606894';
    ctx.stroke();
    // ctx.closePath();
}

// Här skapas kartan, först alla celler, sedan fylls cellerna med bomber
let board;
function init(colPos, rowPos, difficulty) {
    let grid = []
    let row = []
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const square = new Cell(j, i, cellSize, difficulty);
            row.push(square);
        }
        grid.push(row);
        row = [];
    }
    
    // Places bombs randomly
    board = makeBombCell( grid );

    // Print numbers on all neighbors to bombs
    board.forEach(row => {
        row.forEach(cell => {
            cell.checkNeighbor( board )
        })
    })

    // restart init function if clicked cell is not 0
    while (board[rowPos][colPos].hasNum != 0){
        console.log(board[rowPos][colPos].hasNum);
        
        init(colPos, rowPos, difficulty);     
    }

    if (board[rowPos][colPos].hasNum === 0){

        // Each cell gets a copy of the board
        board.forEach(row => {
            row.forEach(cell => {
                cell.grid = board;
            })
        })
        
        gameStarted = true;
        return board;
    }
}

let game;
canvas.addEventListener('click', event => {
    let posX = event.layerX;
    let posY = event.layerY;
    let colPos = Math.floor(posX / cellSize);
    let rowPos = Math.floor(posY / cellSize);
    console.log('col clicked: ' + colPos);
    console.log('row clicked: ' + rowPos);
    
    if (!gameStarted) {
        game = init(colPos, rowPos, difficulty);
        game[rowPos][colPos].reveal()

    }

    if (gameStarted) {
        if (!game[rowPos][colPos].isBomb && !game[rowPos][colPos].revealed && !game[rowPos][colPos].isFlagged) {
            game[rowPos][colPos].reveal();
        }
        if (!game[rowPos][colPos].revealed && game[rowPos][colPos].isBomb) {
            gameOver(game);
        }
    }
})

// Original init function
// function init(difficulty) {
//     let grid = []
//     let row = []

//     for (let i = 0; i < rows; i++) {
//         for (let j = 0; j < cols; j++) {
//             const square = new Cell( j, i, cellSize, difficulty );
//             row.push(square);
//         }
//         grid.push(row);
//         row = [];
//     }

//     let board = makeBombCell( grid );

//     board.forEach( row => {
//         row.forEach( cell => {
//             cell.checkNeighbor( board )
//         })
//     })

//     board.forEach(row => {
//         row.forEach(cell => {
//             cell.grid = board;
//             cell.show();
//         })
//     })

//     let game = board;

//     canvas.addEventListener('click', event => {
//         game.forEach( row => {
//             row.forEach( cell => {
//                 if (event.layerX > cell.posX && event.layerX < cell.posX + cellSize && event.layerY > cell.posY && event.layerY < cell.posY + cellSize) {
//                     if (!gameStarted){
//                         while (cell.hasNum != 0){
//                             console.log(cell);
//                             init(difficulty);
//                         }
//                         if (!cell.isBomb && cell.hasNum === 0) {
//                             gameStarted = true;
//                             cell.reveal();
//                             cell.show();
//                         } else {
//                             init(difficulty);
//                             // gameStarted = true;
//                             // gameOver(newGame)
//                         }
//                         gameStarted = true;
//                     } else {
//                         if (!cell.isBomb && !cell.isFlagged && !cell.revealed) {
//                             cell.reveal();
//                             cell.show();
//                         } else if (cell.isBomb && !cell.isFlagged) {
//                             gameOver(newGame);
//                         }
//                     }
//                 }
//             })
//         })
//     })

//     return board;
// }

function makeBombCell( grid ) {
    // Creates array with all positions of the cells in the grid
    let options = [];
    for ( let i = 0; i < rows; i++ ) {
        for ( let j = 0; j < cols; j++) {
            options.push([i, j])
        }
    }
    // Places bombs randomly
    for (let n = 0; n < grid[0][0].numOfBombs; n++ ) {
        let index = Math.floor(Math.random() * options.length);
        let choice = options[index];
        let i = choice[0];
        let j = choice[1];
        options.splice(index, 1)
        
        grid[i][j].isBomb = true;
    }
    return grid
}

function gameOver(grid) {
    grid.forEach( row => {
        row.forEach( cell => {
            cell.gameOver = true;
            cell.revealed = true;
            cell.show();
            if (cell.isFlagged) {
                cell.flag();
            }
        })
    })
}

function gameWon() {
    ctx.font = '24px arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText(`You found all mines!`, width / 2, height / 2);
}

// easyBtn.addEventListener('click', () => {
//     gameStarted = false;
//     init(20);
//     bombsLeft.innerText = 'Mines: 20';
// })

// mediumBtn.addEventListener('click', () => {
//     gameStarted = false;
//     init(40);
//     bombsLeft.innerHTML = 'Mines: 40';
// })

// hardBtn.addEventListener('click', () => {
//     gameStarted = false;
//     init(120);
//     bombsLeft.innerHTML = 'Mines: 80';
// })

// canvas.addEventListener('contextmenu', event => {
//     newGame.forEach( row => {
//         row.forEach( cell => {
//             if (event.layerX > cell.posX && event.layerX < cell.posX + cellSize && event.layerY > cell.posY && event.layerY < cell.posY + cellSize) {   
//                 if (!cell.revealed) {
//                     event.preventDefault();
//                     cell.flag();
//                 } else {
//                     event.preventDefault();
//                     cell.show();
//                 }
//             }
//         })
//     })
// })
