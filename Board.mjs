import { Checker } from "./checker.mjs"; 
import { Colors } from "./colors.mjs";

export class Board {
    constructor(block_size) {
        this.field = [...Array(100)];
        this.block_size = block_size;
    }   
    
    drawBoard(can, nRow=8, nCol=8) {
        let ctx = can.getContext("2d");
        let w = can.width;
        let h = can.height;

        w /= nCol;            // width of a block
        h /= nRow;            // height of a block

        for (let i = 0; i < nRow; ++i) {
            for (let j = 0, col = nCol / 2; j < col; ++j) {
                ctx.rect(2 * j * w + (i % 2 ? 0 : w), i * h, w, h);
            }
        }

        ctx.fill();
    }

    populate(can) {
        const checker = new Checker(2, 5, Colors.WHITE, this.block_size);
        checker.draw(can)
    }
}
