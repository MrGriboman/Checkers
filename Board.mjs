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
        this.gottaKill = false;
        this.available = {};
        this.destinations = {};
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
                    let checker = new Checker(j, i, Colors.BLACK);
                    checker.draw(can);
                    this.checkers[[j, i]] = checker;
                }
            }
        }
        for (let i = 5; i < 8; ++i) {
            for (let j = 0; j < 8; ++j) {
                if ((i + j) % 2 != 0) {
                    let checker = new Checker(j, i, Colors.WHITE);
                    checker.draw(can);
                    this.checkers[[j, i]] = checker;
                }
            }
        }        
    }

    handleClick(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / this.block_size);        
        const y = Math.floor((event.clientY - rect.top) / this.block_size);
        if ([x, y] in this.checkers && this.checkers[[x, y]].color === this.game.turn && Object.keys(this.available).length == 0 || [x, y] in this.available) {            
            this.chooseChecker(canvas, x, y);
        }
        else if (this.activeChecker !== null && [x, y] in this.destinations) {
            this.moveChecker(canvas, x, y);
        }
    }  
    
    chooseChecker(canvas, x, y) {
        const checker = this.checkers[[x, y]];
        if (!checker.highlighted) {                
            if (this.activeChecker !== null)
                this.activeChecker.downlight(canvas, this.block_size);
                this.redraw(canvas);
            this.activeChecker = checker;
            this.activeChecker.highlight(canvas, this.block_size);
            const moves = this.activeChecker.findPossibleMoves(this.checkers);  
            this.destinations = moves.destinations;      
            this.drawPaths(canvas, moves);        
        }
        else {
            checker.downlight(canvas, this.block_size);
            this.redraw(canvas)
        }
    }

    moveChecker(canvas, x, y) {
        this.activeChecker.downlight(canvas, this.block_size)
        delete this.checkers[[this.activeChecker.x, this.activeChecker.y]]
        this.activeChecker.move(canvas, x, y);
        this.checkers[[this.activeChecker.x, this.activeChecker.y]] = this.activeChecker;
        this.activeChecker = null;
        this.game.changeTurn(); 
        this.redraw(canvas);
        this.available = this.thereWillBeBlood();
    }

    redraw(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawBoard(canvas);
        for (let checker_coords in this.checkers) {
            this.checkers[checker_coords].draw(canvas);
        }
    }

    drawPaths(canvas, moves) {
        const {path, destinations, eaten} = moves;
        console.log(destinations)
        const ctx = canvas.getContext('2d');
        for (let key in path) {
            this.colorBlock(ctx, path[key][0], path[key][1], "#7FC7FF");
        }
        for (let key in destinations) {
            this.colorBlock(ctx, key[0], key[2], "#77DD77");
        }
        for (let key in eaten){
            this.colorBlock(ctx, key[0], key[2], "#FF8C69");
            eaten[key].draw(canvas)
        }

    }

    colorBlock(ctx, x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * this.block_size, y * this.block_size, this.block_size, this.block_size);
        //ctx.fill();
    }

    thereWillBeBlood() {
        let available = {};
        for (let checker_coords in this.checkers) {
            const checker = this.checkers[checker_coords];
            if (checker.color != this.game.turn)
                continue;
            const moves = checker.findPossibleMoves(this.checkers);
            const {eaten} = moves;
            if (Object.keys(eaten).length > 0)
                available[[checker.x, checker.y]] = checker;
        }
        return available;
    }
}
