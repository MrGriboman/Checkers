import { Checker } from "./checker.mjs"; 
import { Colors } from "./colors.mjs";
import { Game } from "./Game.mjs";

export class Board {
    constructor(block_size, game) {
        this.field = [...Array(100)];
        this.block_size = block_size;
        this.checkers = {};
        this.game = game;
        this.activeChecker = null;
    }   
    
    drawBoard(can, nRow=8, nCol=8) {
        let ctx = can.getContext("2d");
        let w = can.width;
        let h = can.height;

        w /= nCol;            // width of a block
        h /= nRow;            // height of a block

        ctx.fillStyle = "#CC9966";
        for (let i = 0; i < nRow; ++i) {
            for (let j = 0, col = nCol / 2; j < col; ++j) {
                ctx.rect(2 * j * w + (i % 2 ? 0 : w), i * h, w, h);
            }
        }

        ctx.fill();
    }

    populate(can) {
        for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < 8; ++j) {
                if ((i + j) % 2 != 0) {
                    let checker = new Checker(j, i, Colors.BLACK, this.block_size);
                    checker.draw(can);
                    this.checkers[[i, j]] = checker;
                }
            }
        }
        for (let i = 5; i < 8; ++i) {
            for (let j = 0; j < 8; ++j) {
                if ((i + j) % 2 != 0) {
                    let checker = new Checker(j, i, Colors.WHITE, this.block_size);
                    checker.draw(can);
                    this.checkers[[i, j]] = checker;
                }
            }
        }        
    }

    handleClick(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / this.block_size);        
        const y = Math.floor((event.clientY - rect.top) / this.block_size);
        if ([y, x] in this.checkers && this.checkers[[y, x]].color === this.game.turn) {
            this.chooseChecker(canvas, x, y);
        }
        else if (this.activeChecker !== null && (x + y) % 2 != 0) {
            this.moveChecker(canvas, x, y);
        }
    }  
    
    chooseChecker(canvas, x, y) {
        const checker = this.checkers[[y, x]];
        if (!checker.highlighted) {                
            if (this.activeChecker !== null)
                this.activeChecker.downlight(canvas, this.block_size);
            this.activeChecker = checker;
            this.activeChecker.highlight(canvas, this.block_size);
            this.activeChecker.findPossibleMoves(this.checkers);
        }
        else {
            checker.downlight(canvas, this.block_size);
        }
    }

    moveChecker(canvas, x, y) {
        this.activeChecker.downlight(canvas, this.block_size)
        delete this.checkers[[this.activeChecker.y, this.activeChecker.x]]
        this.activeChecker.move(canvas, x, y);
        this.checkers[[this.activeChecker.y, this.activeChecker.x]] = this.activeChecker;
        this.activeChecker = null;
        this.game.turn = (this.game.turn === Colors.BLACK) ? Colors.WHITE : Colors.BLACK;        
    }

    redraw(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawBoard(canvas);
        for (let checker_coords in this.checkers) {
            this.checkers[checker_coords].draw(canvas);
        }
    }
}
