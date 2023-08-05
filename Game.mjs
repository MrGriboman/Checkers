import { Colors } from "./colors.mjs";

export class Game {
    constructor() {
        this.over = false;
        this.turn = Colors.WHITE;
    }

    changeTurn() {
        this.turn = (this.turn === Colors.WHITE) ? Colors.BLACK : Colors.WHITE;
    }

    isGameOver(checkers) {
        let haveWay = false;
        for (let key in checkers) {
            if (checkers[key].color == this.turn) {
                const moves = checkers[key].findPossibleMoves(checkers);
                const {destinations} = moves;
                if (Object.keys(destinations).length > 0)
                    haveWay = true;
            }
        }
        return !haveWay;
    }
}