import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { TextService } from '@app/services/tools/text.service';

export class TextAction extends AbsUndoRedo {
    constructor(
        private mousePosition: Vec2,
        private mouseDownCoords: Vec2,
        private primaryColor: string,
        private sizeFont: number,
        private fontStyle: string,
        private textAlign: number,
        private fontStyleItalic: string,
        private fontStyleBold: string,
        private text: string[],
        private textService: TextService,
        private drawingService: DrawingService,
        private width: number,
        private height: number,
    ) {
        super();
    }

    apply(): void {
        this.drawingService.baseCtx.strokeStyle = this.primaryColor;
        this.drawingService.baseCtx.fillStyle = this.primaryColor;
        this.textService.drawTextUndo(
            {
                primaryColor: this.primaryColor,
                sizeFont: this.sizeFont,
                fontStyle: this.fontStyle,
                textAlign: this.textAlign,
                fontStyleItalic: this.fontStyleItalic,
                fontStyleBold: this.fontStyleBold,
                mouseDownCoords: this.mouseDownCoords,
                mousePosition: this.mousePosition,
                width: this.width,
                height: this.height,
            },
            this.text,
        );
        this.textService.clearEffectTool();
    }
}
