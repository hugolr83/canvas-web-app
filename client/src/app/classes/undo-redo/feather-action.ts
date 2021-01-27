import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { FeatherService } from '@app/services/tools/feather.service';

export class FeatherAction extends AbsUndoRedo {
    constructor(
        private changesFeather: Vec2[],
        private angle: number,
        private length: number,
        private primaryColor: string,
        private drawingService: DrawingService,
        private featherService: FeatherService,
    ) {
        super();
    }

    apply(): void {
        this.drawingService.baseCtx.strokeStyle = this.primaryColor;
        this.drawingService.baseCtx.lineJoin = this.drawingService.baseCtx.lineCap = 'round';
        this.drawingService.previewCtx.lineJoin = this.drawingService.previewCtx.lineCap = 'round';
        this.featherService.drawFeather(this.drawingService.baseCtx, this.changesFeather, {
            primaryColor: this.primaryColor,
            angle: this.angle,
            length: this.length,
        });
        this.featherService.clearEffectTool();
    }
}
