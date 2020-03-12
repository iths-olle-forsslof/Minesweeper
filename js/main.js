let easy = document.querySelector('#easy');
let medium = document.querySelector('#medium');
let hard = document.querySelector('#hard');
let reset = document.querySelector('.restart-btn');

class MineSweeper {
    constructor() {
        this.canvas = document.querySelector('canvas')
        this.ctx = this.canvas.getContext('2d');
        this.cellSize = 25;
        this.cols = 30;
        this.rows = 20;
        this.width = this.cols * this.cellSize;
        this.height = this.rows * this.cellSize;
        this.gameStarted = false;
        this.difficulty;
        this.board;
        this.canvas.setAttribute('width', this.width)
        this.canvas.setAttribute('height', this.height)
    }

    drawGrid = () => {
        for (let i = 1; i < this.cols; i++){
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.cellSize, 0);
            this.ctx.lineTo(i * this.cellSize, this.height);
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = '#606894';
            this.ctx.stroke();
            this.ctx.closePath();
        }
        
        for (let i = 1; i < this.rows; i++){
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.cellSize);
            this.ctx.lineTo(this.width, i * this.cellSize);
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = '#606894';
            this.ctx.stroke();
            // ctx.closePath();
        }
    }

    init = (rowPos, colPos, difficulty) => {
        let grid = []
        let row = []
        this.difficulty = difficulty
        
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const square = new Cell(i, j, this.cellSize, this.difficulty, this.cols, this.rows);
                row.push(square);
            }
            grid.push(row);
            row = [];
        }
        
        // Places bombs randomly
        this.board = this.makeBombCell(grid);
        
        // Print numbers on all neighbors to bombs
        this.board.forEach(row => {
            row.forEach(cell => {
                cell.checkNeighbor(this.board);
            })
        })

        // restart init function if clicked cell is not 0
        while (this.board[rowPos][colPos].hasNum != 0){
            console.log(1);
            
            this.init(rowPos, colPos, this.difficulty);
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
    
    gameOver = () => {
        this.board.forEach( row => {
            row.forEach( cell => {
                cell.gameOver = true;
                cell.revealed = true;
                cell.reveal();
                if (cell.isFlagged) {
                    cell.flag();
                }
            })
        })
    }

    writeGameOver = () => {
        let px;
        for (let i = 0; i < this.width / 6.2; i++) {
            px = i;
            this.ctx.font = `normal bolder ${i}px arial`;
            this.ctx.fillStyle = `rgba(${117 + i * 2}, ${214 + i * -1.3}, ${244 + i *-1.2}, 1)`;
            this.ctx.textAlign = 'center'
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(`GAME OVER`, this.width/2, this.height/2);
        }
        this.ctx.font = `normal bolder ${px}px arial`;
            this.ctx.fillStyle = `rgba(${255}, ${255}, ${255}, 1)`;
            this.ctx.textAlign = 'center'
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(`GAME OVER`, this.width/2, this.height/2);
    }

    gameWon = () => {
        let px;
        for (let i = 0; i < this.width / 6.2; i++) {
            px = i;
            this.ctx.font = `normal bolder ${i}px arial`;
            this.ctx.fillStyle = `rgba(${117 + i * 2}, ${214 + i * -1.3}, ${244 + i *-1.2}, 1)`;
            this.ctx.textAlign = 'center'
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(`YOU WIN!`, this.width/2, this.height/2);
        }
        this.ctx.font = `normal bolder ${px}px arial`;
            this.ctx.fillStyle = `rgba(${66}, ${245}, ${158}, 1)`;
            this.ctx.textAlign = 'center'
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(`YOU WIN!`, this.width/2, this.height/2);
    }
}

let game = new MineSweeper();
game.drawGrid();

game.canvas.addEventListener('click', event => {
    let difficulty = easy.checked ? parseInt(easy.value) : medium.checked ? parseInt(medium.value) : hard.checked ? parseInt(hard.value) : 0;
    let posX = event.layerX;
    let posY = event.layerY;
    let colPos = Math.floor(posX / game.cellSize);
    let rowPos = Math.floor(posY / game.cellSize);
    
    if (!game.gameStarted) {
        game.init(rowPos, colPos, difficulty);
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

reset.addEventListener('mouseup', () => {
    game.ctx.clearRect(0, 0, game.width, game.height)
    game = new MineSweeper();
    game.drawGrid();
})