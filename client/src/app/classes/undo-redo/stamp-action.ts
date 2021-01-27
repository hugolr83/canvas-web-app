import { DrawingService } from '@app/services/drawing/drawing.service';
import { StampService } from '@app/services/tools/stamp.service';
import { AbsUndoRedo } from './abs-undo-redo';

export class StampAction extends AbsUndoRedo {
    constructor(
        private image: HTMLImageElement,
        private mouseCenterX: number,
        private mouseCenterY: number,
        private drawingService: DrawingService,
        private stampService: StampService,
    ) {
        super();
    }

    apply(): void {
        this.stampService.saveCanvas(this.image, this.mouseCenterX, this.mouseCenterY);
        this.drawingService.baseCtx.drawImage(this.image, this.mouseCenterX, this.mouseCenterY);
    }
}
