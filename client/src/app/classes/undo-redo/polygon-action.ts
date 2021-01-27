import { SubToolSelected } from '@app/classes/sub-tool-selected';
import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PolygonService } from '@app/services/tools/polygon.service';

export class PolygonAction extends AbsUndoRedo {
    constructor(
        private mousePosition: Vec2,
        private mouseDownCord: Vec2,
        private primaryColor: string,
        private secondaryColor: string,
        private lineWidth: number,
        private nbSides: number,
        private isRenderingBase: boolean,
        private selectSubTool: SubToolSelected,
        private polygonService: PolygonService,
        private drawingService: DrawingService,
    ) {
        super();
    }

    apply(): void {
        this.drawingService.baseCtx.lineJoin = this.drawingService.baseCtx.lineCap = 'round';
        this.drawingService.baseCtx.strokeStyle = this.primaryColor;
        this.drawingService.baseCtx.shadowColor = this.secondaryColor;
        this.drawingService.baseCtx.lineWidth = this.lineWidth;
        this.polygonService.selectPolygon(this.mousePosition, this.mouseDownCord, {
            primaryColor: this.primaryColor,
            secondaryColor: this.secondaryColor,
            lineWidth: this.lineWidth,
            nbSides: this.nbSides,
            selectSubTool: this.selectSubTool,
            isRenderingBase: this.isRenderingBase,
        });
        this.polygonService.clearEffectTool();
    }
}
