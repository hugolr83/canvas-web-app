import { ResizeDirection } from '@app/classes/resize-direction';
import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { CanvasResizeService } from '@app/services/canvas/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

export class LoadAction extends AbsUndoRedo {
    constructor(
        private picture: CanvasImageSource,
        private height: number, // to get size of drawing
        private width: number,
        private drawingService: DrawingService,
        private canvasResizeService: CanvasResizeService,
    ) {
        super();
    }

    async apply(): Promise<void> {
        const event = { offsetX: this.width, offsetY: this.height } as MouseEvent;
        this.canvasResizeService.resizeDirection = ResizeDirection.verticalAndHorizontal;
        this.canvasResizeService.onResize(event, this.drawingService.baseCtx);
        this.drawingService.baseCtx.drawImage(this.picture, 0, 0);
    }
}
