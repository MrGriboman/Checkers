import { Board } from "./Board.mjs";
import { Colors } from "./colors.mjs";

window.addEventListener('load', function() {
    const canvas = document.getElementById("canvas");
    const block_size = canvas.scrollWidth / 8;    
    const board = new Board(block_size);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    board.drawBoard(canvas);
    board.populate(canvas);
});
