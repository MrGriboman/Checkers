import { Board } from "./Board.mjs";
import { Colors } from "./colors.mjs";

window.addEventListener('load', function() {
    const canvas = document.getElementById("canvas");
    const board = new Board();
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    board.drawBoard(canvas);
    board.populate(canvas);
});
