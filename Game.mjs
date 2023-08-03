import { Colors } from "./colors.mjs";

export class Game {
    constructor() {
        this.over = false;
        this.turn = Colors.WHITE;
    }

    change_turn() {
        this.turn = (this.turn === Colors.WHITE) ? Colors.BLACK : Colors.WHITE;
    }
}