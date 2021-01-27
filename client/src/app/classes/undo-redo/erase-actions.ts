import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserService } from '@app/services/tools/eraser-service';

export class EraseAction extends AbsUndoRedo {
    constructor(
        private changesER: Vec2[],
        private color: string,
        private thickness: number,
        private eraserService: EraserService,
        private drawingService: DrawingService,
    ) {
        super();
    }

    apply(): void {
        this.drawingService.baseCtx.lineCap = 'butt';
        this.drawingService.baseCtx.lineJoin = 'bevel';
        this.drawingService.baseCtx.strokeStyle = this.color;
        this.drawingService.baseCtx.lineWidth = this.thickness;
        this.eraserService.removeLine(this.drawingService.baseCtx, this.changesER);
        this.eraserService.clearEffectTool();
    }
}
