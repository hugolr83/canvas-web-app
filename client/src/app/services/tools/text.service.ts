import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { SubToolSelected } from '@app/classes/sub-tool-selected';
import { TextControl } from '@app/classes/text-control';
import { Tool } from '@app/classes/tool';
import { ToolInfoText } from '@app/classes/tool-info-text';
import { TextAction } from '@app/classes/undo-redo/text-action';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// https://css-tricks.com/snippets/javascript/javascript-keycodes/

// tslint:disable:deprecation
// tslint:disable:max-file-line-count
const STROKE_COLOR = '#000000';
const SPACE = 32;
const ARROW_UP = 37;
const ARROW_DOWN = 38;
const ARROW_LEFT = 39;
const ARROW_RIGHT = 40;
const DEL = 56;
const F1 = 112;
const F12 = 123;
const ZERO = 48;
const DOTTED_SPACE = 10;
const TEXT_ZONE_MIN_WIDTH = 100;

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    fontStyle: string = 'Times New Roman';
    // tslint:disable-next-line:no-magic-numbers
    possibleSizeFont: number[] = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 23, 34, 36, 38, 40, 48, 60, 72];
    // different font sizes allowed for text -> authorized disable magical number
    // tslint:disable-next-line:no-magic-numbers
    sizeFont: number = this.possibleSizeFont[6];
    possibleFont: string[] = ['Times New Roman', 'Calibri', 'Courier New', 'Verdana', 'Impact'];
    private mouseEnter: boolean = false;
    private mouseOut: boolean = false;
    private mousePosition: Vec2 = { x: 0, y: 0 };
    canvasSelected: boolean;
    private fontStyleBold: boolean = false;
    private fontStyleItalic: boolean = false;
    private height: number = 0;
    private width: number = 0;
    private lineWidth: number = 2;
    private writeOnPreviewCtx: boolean = false;

    private textAlign: number = 2;
    private textControl: TextControl;
    constructor(
        drawingService: DrawingService,
        private colorService: ColorService,
        private undoRedoService: UndoRedoService,
        private automaticSaveService: AutomaticSaveService,
    ) {
        super(drawingService);
        this.textControl = new TextControl(this.drawingService.previewCtx);
    }
    isOnPreviewCanvas(): boolean {
        return this.writeOnPreviewCtx;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseEnter && !this.mouseOut && this.mouseDown && !this.writeOnPreviewCtx) {
            this.mouseDownCoords = this.getPositionFromMouse(event);
            this.mousePosition = this.mouseDownCoords;
            this.drawPreviewRect(this.drawingService.previewCtx, this.mouseDownCoords, this.mousePosition);
        }
        if (this.writeOnPreviewCtx) {
            this.setCtxFont(this.drawingService.baseCtx);
            this.drawTextUndo(
                {
                    primaryColor: this.colorService.primaryColor,
                    sizeFont: this.sizeFont,
                    fontStyle: this.fontStyle,
                    textAlign: this.textAlign,
                    fontStyleItalic: this.getItalic(),
                    fontStyleBold: this.getBold(),
                    mousePosition: this.mousePosition,
                    mouseDownCoords: this.mouseDownCoords,
                    width: this.width,
                    height: this.height,
                },
                this.textControl.getText(),
            );

            const textAction = new TextAction(
                this.mousePosition,
                this.mouseDownCoords,
                this.colorService.primaryColor,
                this.sizeFont,
                this.fontStyle,
                this.textAlign,
                this.getBold(),
                this.getItalic(),
                this.textControl.getText(),
                this,
                this.drawingService,
                this.width,
                this.height,
            );

            this.undoRedoService.addUndo(textAction);
            this.undoRedoService.clearRedo();

            this.writeOnPreviewCtx = false;
            this.clearEffectTool();
            this.mouseDownCoords = this.getPositionFromMouse(event);
            this.mouseDown = false;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.mousePosition = mousePosition;
            this.canvasSelected = true;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawPreviewRect(this.drawingService.previewCtx, this.mouseDownCoords, this.mousePosition);
            this.mouseDown = false;
            this.writeOnPreviewCtx = true;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown && this.mouseEnter && !this.mouseOut) {
            const mousePosition = this.getPositionFromMouse(event);
            this.mousePosition = mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.height = mousePosition.y - this.mouseDownCoords.y;
            this.width = mousePosition.x - this.mouseDownCoords.x;
            this.drawPreviewRect(this.drawingService.previewCtx, this.mouseDownCoords, this.mousePosition);
            this.canvasSelected = false;
        }
    }

    onMouseOut(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseOut = true;
        }
    }

    onMouseEnter(event: MouseEvent): void {
        this.mouseEnter = true;
        this.mouseOut = false;
    }

    setBold(bold: boolean): void {
        this.fontStyleBold = bold;
        if (this.writeOnPreviewCtx) {
            this.previewText();
        }
    }

    setItalic(italic: boolean): void {
        this.fontStyleItalic = italic;
        if (this.writeOnPreviewCtx) {
            this.previewText();
        }
    }

    private getItalic(): string {
        return this.fontStyleItalic ? 'italic ' : '';
    }

    private getBold(): string {
        return this.fontStyleBold ? 'bold ' : '';
    }

    selectTextPosition(subTool: number): void {
        this.textAlign = subTool;
        switch (subTool) {
            case SubToolSelected.tool1: {
                this.drawingService.previewCtx.textAlign = 'center';
                this.drawingService.baseCtx.textAlign = 'center';
                break;
            }
            case SubToolSelected.tool2: {
                this.drawingService.previewCtx.textAlign = 'left';
                this.drawingService.baseCtx.textAlign = 'left';
                break;
            }
            case SubToolSelected.tool3: {
                this.drawingService.previewCtx.textAlign = 'right';
                this.drawingService.baseCtx.textAlign = 'right';
                break;
            }
        }
        if (this.writeOnPreviewCtx) {
            this.previewText();
        }
    }

    private drawPreviewRect(ctx: CanvasRenderingContext2D, mouseDownCoords: Vec2, mousePosition: Vec2): void {
        ctx.strokeStyle = STROKE_COLOR;
        ctx.fillStyle = STROKE_COLOR;
        ctx.lineWidth = this.lineWidth;
        ctx.setLineDash([DOTTED_SPACE, DOTTED_SPACE]);
        if (this.drawingService.previewCtx === ctx) {
            if (Math.abs(this.width) <= TEXT_ZONE_MIN_WIDTH || Math.abs(this.height) <= this.sizeFont) {
                this.width = Math.abs(this.width) > TEXT_ZONE_MIN_WIDTH ? this.width : TEXT_ZONE_MIN_WIDTH;
                this.height = Math.abs(this.height) > this.sizeFont ? this.height : this.sizeFont + 1;
            }
            this.textControl.setWidth(this.width);
            if (mousePosition.x >= mouseDownCoords.x && mousePosition.y >= mouseDownCoords.y) {
                ctx.strokeRect(
                    mouseDownCoords.x - this.lineWidth / 2,
                    mouseDownCoords.y - this.lineWidth / 2,
                    this.width + this.lineWidth,
                    this.height + this.lineWidth,
                );

                return;
            }
            if (mousePosition.x < mouseDownCoords.x && mousePosition.y < mouseDownCoords.y) {
                ctx.strokeRect(
                    mouseDownCoords.x + this.lineWidth / 2,
                    mouseDownCoords.y + this.lineWidth / 2,
                    this.width - this.lineWidth,
                    this.height - this.lineWidth,
                );
                return;
            }
            if (mousePosition.x > mouseDownCoords.x && mousePosition.y < mouseDownCoords.y) {
                ctx.strokeRect(
                    mouseDownCoords.x - this.lineWidth / 2,
                    mouseDownCoords.y + this.lineWidth / 2,
                    this.width + this.lineWidth,
                    this.height - this.lineWidth,
                );
                return;
            }
            if (mousePosition.x < mouseDownCoords.x && mousePosition.y > mouseDownCoords.y) {
                ctx.strokeRect(
                    mouseDownCoords.x + this.lineWidth / 2,
                    mouseDownCoords.y - this.lineWidth / 2,
                    this.width - this.lineWidth,
                    this.height + this.lineWidth,
                );
                return;
            }
        }
    }

    // Necessary for undo-redo. We have similar function.
    drawTextUndo(toolInfo: ToolInfoText, text: string[]): void {
        this.sizeFont = toolInfo.sizeFont;
        this.fontStyle = toolInfo.fontStyle;
        this.height = toolInfo.height;
        this.drawingService.baseCtx.font = (
            toolInfo.fontStyleBold +
            toolInfo.fontStyleItalic +
            toolInfo.sizeFont +
            'px' +
            "'" +
            toolInfo.fontStyle +
            "'"
        ).toString();
        this.drawingService.baseCtx.strokeStyle = toolInfo.primaryColor; // text color
        this.drawingService.baseCtx.fillStyle = toolInfo.primaryColor;
        this.position(this.drawingService.baseCtx, text, toolInfo);
    }

    drawText(): void {
        this.drawingService.baseCtx.strokeStyle = this.colorService.primaryColor; // text color
        this.drawingService.baseCtx.fillStyle = this.colorService.primaryColor;
        const textPreview: string[] = this.textControl.getText();
        this.position(this.drawingService.baseCtx, textPreview, {
            textAlign: this.textAlign,
            primaryColor: this.colorService.primaryColor,
            sizeFont: this.sizeFont,
            fontStyle: this.fontStyle,
            width: this.width,
            height: this.height,
            mouseDownCoords: this.mouseDownCoords,
            mousePosition: this.mousePosition,
        } as ToolInfoText);
        this.automaticSaveService.save();
    }

    previewText(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawPreviewRect(this.drawingService.previewCtx, this.mouseDownCoords, this.mousePosition);
        this.setCtxFont(this.drawingService.previewCtx);
        const textPreview: string[] = this.textControl.getTextWithCursor();
        this.position(this.drawingService.previewCtx, textPreview, {
            textAlign: this.textAlign,
            sizeFont: this.sizeFont,
            width: this.width,
            height: this.height,
            mouseDownCoords: this.mouseDownCoords,
            mousePosition: this.mousePosition,
        } as ToolInfoText);
    }

    private xTop(width: number, mouseDownCoords: Vec2, mousePosition: Vec2): number {
        return (mouseDownCoords.x < mousePosition.x ? mouseDownCoords.x : mousePosition.x) + width;
    }

    private yTop(sizeFont: number, mouseDownCoords: Vec2, mousePosition: Vec2): number {
        return (mouseDownCoords.y < mousePosition.y ? mouseDownCoords.y : mousePosition.y) + sizeFont;
    }

    private setCtxFont(ctx: CanvasRenderingContext2D): void {
        // set font and size for text with or without italic or bold
        ctx.font = (this.getBold() + this.getItalic() + this.sizeFont + 'px' + "'" + this.fontStyle + "'").toString();
        this.textControl.setCtx(ctx);
    }

    private position(ctx: CanvasRenderingContext2D, text: string[], toolInfoText: ToolInfoText): void {
        let lineBreak = 0;
        switch (toolInfoText.textAlign) {
            case SubToolSelected.tool1:
                text.forEach((element) => {
                    if (this.textControl.checkHeightText(lineBreak, toolInfoText.sizeFont, toolInfoText.height)) {
                        ctx.textAlign = 'center';
                        ctx.fillText(
                            element,
                            this.xTop(toolInfoText.width / 2, toolInfoText.mouseDownCoords, toolInfoText.mousePosition),
                            this.yTop(toolInfoText.sizeFont, toolInfoText.mouseDownCoords, toolInfoText.mousePosition) +
                                lineBreak * toolInfoText.sizeFont,
                            Math.abs(toolInfoText.width),
                        );
                        lineBreak++;
                    }
                });
                break;
            case SubToolSelected.tool2:
                text.forEach((element) => {
                    if (this.textControl.checkHeightText(lineBreak, toolInfoText.sizeFont, toolInfoText.height)) {
                        ctx.textAlign = 'left';
                        ctx.fillText(
                            element,
                            this.xTop(0, toolInfoText.mouseDownCoords, toolInfoText.mousePosition),
                            this.yTop(toolInfoText.sizeFont, toolInfoText.mouseDownCoords, toolInfoText.mousePosition) +
                                lineBreak * toolInfoText.sizeFont,
                            Math.abs(toolInfoText.width),
                        );
                        lineBreak++;
                    }
                });
                break;
            case SubToolSelected.tool3:
                text.forEach((element) => {
                    if (this.textControl.checkHeightText(lineBreak, toolInfoText.sizeFont, toolInfoText.height)) {
                        ctx.textAlign = 'right';
                        ctx.fillText(
                            element,
                            this.xTop(toolInfoText.width, toolInfoText.mouseDownCoords, toolInfoText.mousePosition),
                            this.yTop(toolInfoText.sizeFont, toolInfoText.mouseDownCoords, toolInfoText.mousePosition) +
                                lineBreak * toolInfoText.sizeFont,
                            Math.abs(toolInfoText.width),
                        );
                        lineBreak++;
                    }
                });
                break;
        }
    }

    // keyboard action methods
    arrowTop(): void {
        this.textControl.arrowTop();
        this.previewText();
    }
    arrowBottom(): void {
        this.textControl.arrowBottom();
        this.previewText();
    }

    arrowLeft(): void {
        this.textControl.arrowLeft();
        this.previewText();
    }

    arrowRight(): void {
        this.textControl.arrowRight();
        this.previewText();
    }

    backspace(): void {
        this.textControl.backspace();
        this.previewText();
    }

    delete(): void {
        this.textControl.delete();
        this.previewText();
    }

    enter(): void {
        this.textControl.enter();
        this.previewText();
    }

    keyUpHandler(event: KeyboardEvent): void {
        if (this.writeOnPreviewCtx) {
            if (
                event.keyCode === SPACE ||
                (event.keyCode >= ZERO &&
                    event.keyCode !== DEL &&
                    event.keyCode !== ARROW_LEFT &&
                    event.keyCode !== ARROW_DOWN &&
                    event.keyCode !== ARROW_RIGHT &&
                    event.keyCode !== ARROW_UP)
            )
                if (event.keyCode < F1 || event.keyCode > F12) {
                    this.textControl.addLetter(event.key.toString());
                    this.previewText();
                }
        }
    }

    clearEffectTool(): void {
        this.textControl.clearText();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.height = 0;
        this.width = 0;
    }
}
