import { ResizeDirection } from '@app/classes/resize-direction';
import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { CanvasResizeService } from '@app/services/canvas/canvas-resizer.service';
// class that allows to undo and redo resize of the canvas
export class ResizeCanvasAction extends AbsUndoRedo {
    constructor(
        private event: MouseEvent,
        private resizeCtx: CanvasRenderingContext2D,
        private baseCanvas: HTMLCanvasElement,
        private resizeDirection: ResizeDirection,
        private canvasResizeService: CanvasResizeService,
    ) {
        super();
    }

    apply(): void {
        this.canvasResizeService.isResizeDown = true;
        this.canvasResizeService.resizeDirection = this.resizeDirection;
        this.canvasResizeService.addToUndoRedo = false;
        this.canvasResizeService.onResizeUp(this.event, this.resizeCtx, this.baseCanvas);
    }
}
