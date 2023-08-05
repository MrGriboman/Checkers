import { Colors } from "./colors.mjs";

export class Checker {
    constructor(x, y, color) {
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
        if (this.color == Colors.BLACK && y == 7 || this.color == Colors.WHITE && y == 0)
            this.turnIntoKing();
        this.draw(canvas)     
    }

    draw(canvas) {
        const ctx = canvas.getContext('2d');
        const block_size = canvas.width / 8;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x * block_size + block_size / 2, this.y * block_size + block_size / 2, block_size / 2 - 10, 0, 2 * Math.PI);
        ctx.fill();
        if (this.isKing) {
            ctx.beginPath();
            ctx.fillStyle = Colors.GOLD;
            ctx.arc(this.x * block_size + block_size / 2, this.y * block_size + block_size / 2, block_size / 4, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    highlight(canvas, block_size) {
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = Colors.GREEN;
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
        ctx.fillStyle = Colors.BROWN;
        ctx.rect(this.x * block_size, this.y * block_size, block_size, block_size);
        ctx.fill();
    }

    findPossibleMoves(checkers, x=this.x, y=this.y, path=[], destinations={}, eaten={}, eaten_t={}) {        
        for (let i = -1; i <= 1; i += 2) {
            for (let j = -1; j <= 1; j += 2) {
                let found_new_path = false;                         
                if ([x + i, y + j] in checkers && checkers[[x + i, y + j]].color !== this.color && (x + 2*i >= 0 && x + 2*i < 8 && y + 2*j >= 0 && y + 2*j < 8) && !([x + 2*i, y + 2*j] in checkers)) { 
                    if ([x + i, y + j] in eaten)
                        continue;
                    found_new_path = true;                    
                    path.push([x + 2*i, y + 2*j]);
                    eaten[[x + i, y + j]] = checkers[[x + i, y + j]];   
                    eaten_t[[x + i, y + j]] = checkers[[x + i, y + j]];                 
                    this.findPossibleMoves(checkers, x + 2*i, y + 2*j, path, destinations, eaten, eaten_t);
                }
                if (found_new_path) {                    
                    destinations[[path.at(-1)[0], path.at(-1)[1]]] = eaten_t;
                    eaten_t = {};
                }
            }
        }                       
        if (Object.keys(eaten).length == 0) {            
            const offset = (this.color == Colors.WHITE) ? -1 : 1;
            if (!([x + 1, y + offset] in checkers) && x + 1 < 8 && y + offset >= 0) {
                destinations[[x + 1, y + offset]] = true;
            }
            if (!([x - 1, y + offset] in checkers) && x - 1 >= 0 && y + offset >= 0) {
                destinations[[x - 1, y + offset]] = true;
            }
        }
        return { 
            'path': path,
            'destinations': destinations,
            'eaten': eaten
        }
    }
}
