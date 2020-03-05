class Cell {
    constructor( i, j, w, bombs ) {
        this.col = i,
        this.row = j,
        this.size = w,
        this.posX= this.col * this.size;
        this.posY= this.row * this.size;
        this.isBomb = false;
        this.revealed= false;
        this.hasNum = 0;
        this.isFlagged = false;
        this.gameStarted = false;
        this.gameOver = false;
        this.numOfCells = cols * rows;
        this.numOfBombs = bombs;
        this.grid;
    }

    reveal() {
        this.revealed = true;
        this.show();
        if (this.hasNum === 0) {
            this.floodFill()
        }
        this.checkIfGameWon()
    };

    checkIfGameWon() {
        let numRevealed = [];
        this.grid.forEach(row => {
            row.forEach( cell => {
                if (cell.revealed) {
                    numRevealed.push(cell);
                }
            })
            if (this.numOfCells - numRevealed.length === this.numOfBombs) {
                gameWon();
            }
        })
    }

    show() {
        if (this.revealed){
            // ctx.clearRect(this.posX, this.posY, this.size, this.size)
            ctx.beginPath();
            ctx.rect(this.posX, this.posY, this.size, this.size,);
            ctx.fillStyle = '#75d6e0';
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.rect(this.posX, this.posY, this.size, this.size,);
            ctx.strokeStyle = '#606894';
            ctx.stroke();
            ctx.closePath();

            // Skriver ut bomben
            if (this.isBomb) {
                
                ctx.beginPath();
                ctx.fillStyle = '#606894'
                ctx.fillRect(this.posX + 1, this.posY + 1, this.size -2, this.size -2,);
                ctx.fill();
                ctx.closePath();
                
                ctx.beginPath();
                ctx.translate(this.size / 2, this.size / 2)
                ctx.arc(this.posX, this.posY, this.size / 3, 0, 2*Math.PI);
                ctx.fillStyle = 'black';
                ctx.fill();
                ctx.closePath();
                ctx.setTransform(1, 0, 0, 1, 0, 0);

                ctx.beginPath();
                ctx.rect(this.posX, this.posY, this.size, this.size,);
                ctx.strokeStyle = '#606894';
                ctx.stroke();
                ctx.closePath();

                // Skriver ut siffran
            } else {

                ctx.beginPath();
                ctx.rect(this.posX, this.posY, this.size, this.size,);
                ctx.strokeStyle = '#606894';
                ctx.stroke();
                ctx.closePath();
                
                if (this.hasNum > 0) {
                    ctx.font = '16px arial';
                    ctx.translate(this.size / 2, this.size / 2 +2)
                    ctx.fillStyle = '#606894';
                    ctx.textAlign = 'center'
                    ctx.textBaseline = "middle";
                    ctx.fillText(`${this.hasNum}`, this.posX, this.posY);   
                    ctx.setTransform(1, 0, 0, 1, 0, 0);

                    // ctx.beginPath();
                    // ctx.rect(this.posX, this.posY, this.size, this.size,);
                    // ctx.strokeStyle = '#606894';
                    // ctx.stroke();
                    // ctx.closePath();
                    
                }
            }
        }
    }

    checkNeighbor( grid ) {
        if (this.isBomb) {
            this.hasNum = -1;
        
        } else {
            let total = 0;
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    let i = this.row + x;
                    let j = this.col + y;
                    if (i > -1 && i < cols && j > -1 && j < rows) {
                        let neighbor = grid[i][j]
                        if (neighbor.isBomb) {
                            total++
                        }
                    }
                }
            }
            this.hasNum = total;
        }
    }

    flag() {
        if (!this.isFlagged || this.gameOver) {
            // flag
            ctx.translate(this.size - 10, this.size -20)
            ctx.beginPath();
            ctx.moveTo(this.posX, this.posY);
            ctx.lineTo(this.posX - 10, this.posY + 3);
            ctx.lineTo(this.posX, this.posY + 8);
            ctx.fillStyle = '#fffbb3';
            ctx.fill();
            //pole
            ctx.beginPath();
            ctx.moveTo(this.posX + 1, this.posY);
            ctx.lineTo(this.posX-1, this.posY + 15);
            ctx.strokeStyle = '#fc4103';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.beginPath();
            
            this.isFlagged = true;
        } else {
            ctx.clearRect(this.posX, this.posY, this.size, this.size);
            this.isFlagged = false;
            this.show();
        }
    }

    floodFill() {
        // if this is 0 reveal all neighbours who isn't revealed and isn't a bomb
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                let i = this.row + x;
                let j = this.col + y;
                if (i > -1 && i < cols && j > -1 && j < rows) {
                    let neighbor = this.grid[i][j]
                    
                    if (!neighbor.isBomb && !neighbor.revealed) {
                        neighbor.reveal();
                    }
                }
            }
        }
    }
}