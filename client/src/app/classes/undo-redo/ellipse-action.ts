import { SubToolSelected } from '@app/classes/sub-tool-selected';
import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from '@app/services/tools/ellipse.service';

export class EllipseAction extends AbsUndoRedo {
    constructor(
        private mousePosition: Vec2,
        private mouseDownCord: Vec2,
        private primaryColor: string,
        private secondaryColor: string,
        private lineWidth: number,
        private shiftPressed: boolean,
        private selectSubTool: SubToolSelected,
        private canvasSelected: boolean,
        private ellipseService: EllipseService,
        private drawingService: DrawingService,
    ) {
        super();
    }

    apply(): void {
        this.drawingService.baseCtx.strokeStyle = this.primaryColor;
        this.drawingService.baseCtx.shadowColor = this.secondaryColor;
        this.drawingService.baseCtx.lineWidth = this.lineWidth;
        this.drawingService.baseCtx.lineCap = 'round';
        this.ellipseService.selectEllipse(this.mousePosition, this.mouseDownCord, {
            primaryColor: this.primaryColor,
            secondaryColor: this.secondaryColor,
            lineWidth: this.lineWidth,
            shiftPressed: this.shiftPressed,
            selectSubTool: this.selectSubTool,
            canvasSelected: this.canvasSelected,
        });
        this.ellipseService.clearEffectTool();
    }
}
