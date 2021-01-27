import { SubToolSelected } from '@app/classes/sub-tool-selected';
import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from '@app/services/tools/rectangle.service';

export class RectangleAction extends AbsUndoRedo {
    constructor(
        private mousePosition: Vec2,
        private mouseDownCoords: Vec2,
        private primaryColor: string,
        private secondaryColor: string,
        private lineWidth: number,
        private shiftPressed: boolean,
        private selectSubTool: SubToolSelected,
        private canvasSelected: boolean,
        private rectangleService: RectangleService,
        private drawingService: DrawingService,
    ) {
        super();
    }

    apply(): void {
        this.drawingService.baseCtx.strokeStyle = this.primaryColor;
        this.drawingService.baseCtx.shadowColor = this.secondaryColor;
        this.drawingService.baseCtx.lineWidth = this.lineWidth;
        this.rectangleService.selectRectangle(this.mousePosition, this.mouseDownCoords, {
            primaryColor: this.primaryColor,
            secondaryColor: this.secondaryColor,
            lineWidth: this.lineWidth,
            shiftPressed: this.shiftPressed,
            selectSubTool: this.selectSubTool,
            canvasSelected: this.canvasSelected,
        });
        this.rectangleService.clearEffectTool();
    }
}
