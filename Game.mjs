import { Colors } from "./colors.mjs";

export class Game {
    constructor() {
        this.over = false;
        this.turn = Colors.WHITE;
    }

    changeTurn() {
        this.turn = (this.turn === Colors.WHITE) ? Colors.BLACK : Colors.WHITE;
    }
}