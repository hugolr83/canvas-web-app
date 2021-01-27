import { DrawingService } from '@app/services/drawing/drawing.service';
import { AbsUndoRedo } from './abs-undo-redo';

export class PaintBucketAction extends AbsUndoRedo {
    constructor(private pixels: ImageData, private drawingService: DrawingService) {
        super();
    }

    apply(): void {
        this.drawingService.baseCtx.putImageData(this.pixels, 0, 0);
    }
}
