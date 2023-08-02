import { Colors } from "./colors.mjs";

export class Checker {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.isKing = false;
        this.color = color;
    }

    turnIntoKing(){
        this.isKing = true;
    }

    move(x, y) {
        this.x = x;
        this.y = y;        
    }

    draw(canvas) {
        const ctx = canvas.getContext('2d');
        const block_size = canvas.width / 8;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
        ctx.fill();
    }
}
