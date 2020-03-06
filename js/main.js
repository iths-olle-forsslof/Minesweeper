// skicka med klickparametrarna i initfunktionen och generera banan efter dem.
// "Om klickparam != 0 init again"
class MineSweeper {
    constructor() {
        this.canvas = document.querySelector('canvas')
        this.ctx = this.canvas.getContext('2d');
        this.cellSize = 25;
        this.cols = 20;
        this.rows = 20;
        this.width = this.cols * this.cellSize;
        this.height = this.rows * this.cellSize;
        this.gameStarted = false;
        this.difficulty;
        this.bombsLeft = document.querySelector('.bombs-left');
        this.board;
        this.canvas.setAttribute('width', this.width)
        this.canvas.setAttribute('height', this.height)
    }

    drawGrid = () => {
        for (let i = 0; i < this.cols; i++){
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.cellSize, 0);
            this.ctx.lineTo(i * this.cellSize, this.height);
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = '#606894';
            this.ctx.stroke();
            this.ctx.closePath();
        }
        
        for (let i = 0; i < this.rows; i++){
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.cellSize);
            this.ctx.lineTo(this.width, i * this.cellSize);
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = '#606894';
            this.ctx.stroke();
            // ctx.closePath();
        }
    }
    // Här skapas kartan, först alla celler, sedan fylls cellerna med bomber
    init = (colPos, rowPos, difficulty) => {
        let grid = []
        let row = []
        this.difficulty = difficulty
        
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const square = new Cell(j, i, this.cellSize, this.difficulty, this.cols, this.rows);
                row.push(square);
            }
            grid.push(row);
            row = [];
        }
        
        // Places bombs randomly // IT WORKS
        this.board = this.makeBombCell(grid);
        
        // Print numbers on all neighbors to bombs
        this.board.forEach(row => {
            row.forEach(cell => {
                cell.checkNeighbor(this.board);
            })
        })

        // restart init function if clicked cell is not 0
        while (this.board[rowPos][colPos].hasNum != 0){
            this.init(colPos, rowPos, this.difficulty);     
        }

        if (this.board[rowPos][colPos].hasNum === 0){
            // Each cell gets a copy of the board
            this.board.forEach(row => {
                row.forEach(cell => {
                    cell.grid = this.board;
                })
            })
            
            this.gameStarted = true;
            return this.board;
        }
    }

    makeBombCell = (grid) => {
        // Creates array with all positions of the cells in the grid
        let options = [];
        for ( let i = 0; i < this.rows; i++ ) {
            for ( let j = 0; j < this.cols; j++) {
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

    // checkNeighbor(cell, grid) {
    //     if (cell.isBomb) {
    //         cell.hasNum = -1;
    //     } else {
    //         let total = 0;
    //         for (let x = -1; x <= 1; x++) {
    //             for (let y = -1; y <= 1; y++) {
    //                 let i = cell.row + x;
    //                 let j = cell.col + y;
    //                 if (i > -1 && i < cell.col && j > -1 && j < cell.row) {
    //                     let neighbor = grid[i][j]
    //                     if (neighbor.isBomb) {
    //                         total++
    //                     }
    //                 }
    //             }
    //         }
    //         cell.hasNum = total;
    //         console.log('cellNum = ', cell.hasNum);
    //     }
    //     return grid
    // }
    
    gameOver = () => {
        this.board.forEach( row => {
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
    
    gameWon = () => {
        this.ctx.font = '24px arial';
        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`You found all mines!`, this.width / 2, this.height / 2);
    }
}

let game = new MineSweeper();
game.drawGrid();

game.canvas.addEventListener('click', event => {
    let posX = event.layerX;
    let posY = event.layerY;
    let colPos = Math.floor(posX / game.cellSize);
    let rowPos = Math.floor(posY / game.cellSize);
    
    if (!game.gameStarted) {
        game.init(colPos, rowPos, 10);
        game.board[rowPos][colPos].reveal();
    }

    if (game.gameStarted) {
        if (!game.board[rowPos][colPos].isBomb && !game.board[rowPos][colPos].revealed && !game.board[rowPos][colPos].isFlagged) {
            game.board[rowPos][colPos].reveal();
        }
        if (!game.board[rowPos][colPos].revealed && game.board[rowPos][colPos].isBomb) {
            game.gameOver();
        }
    }
})

game.canvas.addEventListener('contextmenu', event => {
    let posX = event.layerX;
    let posY = event.layerY;
    let colPos = Math.floor(posX / game.cellSize);
    let rowPos = Math.floor(posY / game.cellSize);
    
    if (game.gameStarted) {   
        if (!game.board[rowPos][colPos].revealed) {
            event.preventDefault();
            game.board[rowPos][colPos].flag();
        } else {
            event.preventDefault();
            game.board[rowPos][colPos].show();
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


