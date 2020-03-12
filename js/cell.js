class Cell {
    constructor( i, j, w, bombs, numOfCols, numOfRows ) {
        this.row = i,
        this.col = j,
        this.size = w,
        this.numOfBombs = bombs;
        this.numOfCols = numOfCols;
        this.numOfRows = numOfRows;
        this.posX= this.col * this.size;
        this.posY= this.row * this.size;
        this.isBomb = false;
        this.revealed= false;
        this.hasNum = 0;
        this.isFlagged = false;
        this.gameOver = false;
        this.numOfCells = numOfCols * numOfRows;
        this.grid;
        this.moving = false;
        this.color = 'rgba(117, 214, 224, 1)';
        this.alpha = 1;
    }

    reveal() {
        this.revealed = true;
        if (!this.gameOver){
            this.startShowAnimation();
        } else {
            this.startBombClickAnimation();
            setTimeout(() => {
                game.writeGameOver();
            }, 450)
        }
        setTimeout(() => {
            if (this.hasNum === 0) {
                this.floodFill()
            }
        }, 40)
        this.checkIfGameWon()
    };

    show() {
        if (!this.revealed) {
            game.ctx.clearRect(this.posX, this.posY, this.size, this.size,);
            game.ctx.beginPath();
            game.ctx.rect(this.posX, this.posY, this.size, this.size,);
            game.ctx.strokeStyle = '#606894';
            game.ctx.stroke();
            game.ctx.closePath();
        }

        if (this.revealed){
            // game.ctx.clearRect(this.posX, this.posY, this.size, this.size)
            game.ctx.beginPath();
            game.ctx.rect(this.posX, this.posY, this.size, this.size,);
            game.ctx.fillStyle = this.color;
            game.ctx.fill();
            game.ctx.closePath();

            game.ctx.beginPath();
            game.ctx.rect(this.posX, this.posY, this.size, this.size,);
            game.ctx.strokeStyle = '#606894';
            game.ctx.stroke();
            game.ctx.closePath();

            // Skriver ut bomben
            if (this.isBomb) {
                
                game.ctx.beginPath();
                game.ctx.fillStyle = '#606894'
                game.ctx.fillRect(this.posX + 1, this.posY + 1, this.size -2, this.size -2,);
                game.ctx.fill();
                game.ctx.closePath();
                
                game.ctx.beginPath();
                game.ctx.translate(this.size / 2, this.size / 2)
                game.ctx.arc(this.posX, this.posY, this.size / 3, 0, 2*Math.PI);
                game.ctx.fillStyle = 'black';
                game.ctx.fill();
                game.ctx.closePath();
                game.ctx.setTransform(1, 0, 0, 1, 0, 0);

                game.ctx.beginPath();
                game.ctx.rect(this.posX, this.posY, this.size, this.size,);
                game.ctx.strokeStyle = '#606894';
                game.ctx.stroke();
                game.ctx.closePath();

                // Skriver ut siffran
            } else {
                game.ctx.beginPath();
                game.ctx.rect(this.posX, this.posY, this.size, this.size,);
                game.ctx.strokeStyle = '#606894';
                game.ctx.stroke();
                game.ctx.closePath();
                
                if (this.hasNum > 0) {
                    game.ctx.font = 'normal bold 16px arial';
                    game.ctx.translate(this.size / 2, this.size / 2 +2)
                    game.ctx.fillStyle = '#606894';
                    game.ctx.textAlign = 'center'
                    game.ctx.textBaseline = "middle";
                    game.ctx.fillText(`${this.hasNum}`, this.posX, this.posY);   
                    game.ctx.setTransform(1, 0, 0, 1, 0, 0);
                }
            }
        }
    }

    checkNeighbor(grid) {
        if (this.isBomb) {
            this.hasNum = -1;
            
        } else {
            let total = 0;
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    let i = this.row + x;
                    let j = this.col + y;
                    if (i > -1 && i < this.numOfRows && j > -1 && j < this.numOfCols) {
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
            game.ctx.translate(this.size - 10, this.size -20)
            game.ctx.beginPath();
            game.ctx.moveTo(this.posX, this.posY);
            game.ctx.lineTo(this.posX - 10, this.posY + 3);
            game.ctx.lineTo(this.posX, this.posY + 8);
            game.ctx.fillStyle = '#c92448';
            game.ctx.fill();
            //pole
            game.ctx.beginPath();
            game.ctx.moveTo(this.posX + 1, this.posY);
            game.ctx.lineTo(this.posX-1, this.posY + 15);
            game.ctx.strokeStyle = '#57748f';
            game.ctx.lineWidth = 2;
            game.ctx.stroke();
            game.ctx.setTransform(1, 0, 0, 1, 0, 0);
            game.ctx.beginPath();
            
            this.isFlagged = true;
        } else {
            game.ctx.clearRect(this.posX, this.posY, this.size, this.size);
            this.isFlagged = false;
            this.show();
        }
    }

    floodFill() {
        // if this is 0 reveal all neighbours who isn't revealed and isn't a bomb
        if(this.revealed && this.hasNum <= 0){

            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    let i = this.row + x;
                    let j = this.col + y;
                    if (i > -1 && i < this.numOfRows && j > -1 && j < this.numOfCols) {
                        let neighbor = this.grid[i][j]
                        
                        if (!neighbor.isBomb && !neighbor.revealed) {
                            neighbor.reveal();
                        }
                    }
                }
            }
        }
    }
    
    checkIfGameWon() {
        let numRevealed = [];
        this.grid.forEach(row => {
            row.forEach( cell => {
                if (cell.revealed) {
                    numRevealed.push(cell);
                }
            })
        })

        if (this.numOfCells - numRevealed.length === this.numOfBombs) {
            game.gameWon();
        }
    }

    showAnimation = () => {
        game.ctx.clearRect(this.posX, this.posY, this.size, this.size)
        this.show();
        game.ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        game.ctx.fillRect(this.posX, this.posY, this.size, this.size);
        this.alpha -= .2;
        requestAnimationFrame(this.startShowAnimation);
    }

    startShowAnimation = () => {
        if (!this.moving) {
            this.showAnimation()
        }
        setTimeout(() => {
            this.moving = true;
        }, 200);
        
        this.moving = false;
    }

    startBombClickAnimation = () => {
        if (this.gameOver) {
            this.bombClickAnimation()
        }
        setTimeout(() => {
            this.gameOver = false;
        }, 400);
        
        this.gameOver = true;
    }

    bombClickAnimation = () => {
        game.ctx.clearRect(this.posX, this.posY, this.size, this.size)
        this.show();
        game.ctx.fillStyle = `rgba(255, 74, 61, ${this.alpha})`;
        game.ctx.fillRect(this.posX, this.posY, this.size, this.size);
        this.alpha -= .1;
        requestAnimationFrame(this.startBombClickAnimation);
    }
}