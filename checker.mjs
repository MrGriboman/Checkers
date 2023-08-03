import { Colors } from "./colors.mjs";

export class Checker {
    constructor(x, y, color, block_size) {
        this.x = x;
        this.y = y;
        this.isKing = false;
        this.color = color;
        this.highlighted = false;
    }

    turnIntoKing(){
        this.isKing = true;
    }

    move(canvas, x, y) {
        const block_size = canvas.width / 8;
        this.remove(canvas, block_size)
        this.x = x;
        this.y = y;   
        this.draw(canvas)     
    }

    draw(canvas) {
        const ctx = canvas.getContext('2d');
        const block_size = canvas.width / 8;
        ctx.fillStyle = (this.color === Colors.BLACK) ? "#000000" : "#FFFFFF";
        ctx.beginPath();
        ctx.arc(this.x * block_size + block_size / 2, this.y * block_size + block_size / 2, block_size / 2 - 10, 0, 2 * Math.PI);
        ctx.fill();
    }

    highlight(canvas, block_size) {
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = "#00FF00";
        ctx.lineWidth = 5;        
        ctx.beginPath();
        ctx.arc(this.x * block_size + block_size / 2, this.y * block_size + block_size / 2, block_size / 2 - 10, 0, 2 * Math.PI);
        ctx.stroke();
        this.highlighted = true;
    }

    downlight (canvas, block_size) {
        this.remove(canvas, block_size);
        this.draw(canvas);
        this.highlighted = false;
    }

    remove(canvas, block_size) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(this.x * block_size, this.y * block_size, block_size, block_size);
        ctx.fillStyle = "#CC9966";
        ctx.rect(this.x * block_size, this.y * block_size, block_size, block_size);
        ctx.fill();
    }

    findPossibleMoves(checkers, x=this.x, y=this.y, path=[], destinations=[], eaten={}) {        
        for (let i = -1; i <= 1; i += 2) {
            for (let j = -1; j <= 1; j += 2) {
                let found_new_path = false;                         
                if ([y + i, x + j] in checkers && checkers[[y + i, x + j]].color !== this.color && (y + 2*i >= 0 && y + 2*i < 8 && x + 2*j >= 0 && x + 2*j < 8) && !([y + 2*i, x + 2*j] in checkers)) { 
                    if ([y + i, x + j] in eaten)
                        continue;
                    found_new_path = true;
                    console.log(x + 2*j, y + 2*i);
                    path.push([x + 2*j, y + 2*i]);
                    eaten[[y + i, x + j]] = checkers[[y + i, x + j]];                   
                    this.findPossibleMoves(checkers, x + 2*j, y + 2*i, path, destinations, eaten);
                }
                if (found_new_path) {
                    destinations.push(path.at(-1));
                }
            }
        }
        console.log(path);
        console.log(destinations);
        console.log(eaten);
        return path;
    }
}
