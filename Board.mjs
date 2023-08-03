import { Checker } from "./checker.mjs"; 
import { Colors } from "./colors.mjs";
import { Game } from "./Game.mjs";

export class Board {
    constructor(block_size) {
        this.field = [...Array(100)];
        this.block_size = block_size;
        this.checkers = {};
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
        console.log(this.checkers)
    }

    chooseChecker(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / this.block_size);        
        const y = Math.floor((event.clientY - rect.top) / this.block_size);
        console.log("x: " + x + " y: " + y);
        if ([y, x] in this.checkers)
            this.highlightChecker(canvas, x, y);     
    }

    highlightChecker(canvas, x, y) {
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = "#00FF00";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(x * this.block_size + this.block_size / 2, y * this.block_size + this.block_size / 2, this.block_size / 2 - 10, 0, 2 * Math.PI);
        ctx.stroke();
    }
}
