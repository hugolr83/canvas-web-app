import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { SubToolSelected } from '@app/classes/sub-tool-selected';
import { Tool } from '@app/classes/tool';
import { ToolGeneralInfo } from '@app/classes/tool-general-info';
import { EllipseAction } from '@app/classes/undo-redo/ellipse-action';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

const DOTTED_SPACE = 10;
const DOTTED_LINE_WIDTH = 2;

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends Tool {
    lineWidth: number = 1;
    fillColor: string;
    strokeColor: string;
    private strokeRectColor: string = '#000000';
    private lineRectWidth: number = 1;
    circle: boolean = false;
    mousePosition: Vec2;
    width: number;
    height: number;
    private mouseEnter: boolean = false;
    private mouseOut: boolean = false;
    canvasSelected: boolean; // which canvas

    constructor(
        drawingService: DrawingService,
        private colorService: ColorService,
        private undoRedoService: UndoRedoService,
        private automaticSaveService: AutomaticSaveService,
    ) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.drawingService.baseCtx.lineWidth = DOTTED_LINE_WIDTH;
        this.drawingService.previewCtx.lineWidth = DOTTED_LINE_WIDTH;
        this.clearEffectTool();
        this.strokeColor = this.colorService.secondaryColor;
        this.fillColor = this.colorService.primaryColor;
        this.drawingService.baseCtx.lineJoin = this.drawingService.baseCtx.lineCap = 'round';
        this.drawingService.previewCtx.lineJoin = this.drawingService.previewCtx.lineCap = 'round';
        if (this.mouseEnter) {
            this.onMouseUp(event);
        }
        if (this.mouseDown) {
            this.mouseDownCoords = this.getPositionFromMouse(event);
        }
        this.mousePosition = this.mouseDownCoords;
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.mousePosition = mousePosition;
            this.canvasSelected = true;
            this.selectEllipse(mousePosition, this.mouseDownCoords, {
                primaryColor: this.strokeColor,
                secondaryColor: this.fillColor,
                lineWidth: this.lineWidth,
                shiftPressed: this.circle,
                selectSubTool: this.subToolSelect,
                canvasSelected: this.canvasSelected,
            });
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        // undo-redo
        const ellipseAction = new EllipseAction(
            this.mousePosition,
            this.mouseDownCoords,
            this.strokeColor,
            this.fillColor,
            this.lineWidth,
            this.circle,
            this.subToolSelect,
            this.canvasSelected,
            this,
            this.drawingService,
        );
        this.undoRedoService.addUndo(ellipseAction);
        this.undoRedoService.clearRedo();

        this.mouseDown = false;
        this.mouseEnter = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.mousePosition = mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.canvasSelected = false;
            this.selectEllipse(mousePosition, this.mouseDownCoords, {
                primaryColor: this.strokeColor,
                secondaryColor: this.fillColor,
                lineWidth: this.lineWidth,
                shiftPressed: this.circle,
                selectSubTool: this.subToolSelect,
                canvasSelected: this.canvasSelected,
            });
        }
    }

    onMouseOut(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseOut = true;
        }
    }

    onMouseEnter(event: MouseEvent): void {
        if (this.mouseOut) {
            this.mouseEnter = true;
        }
        this.mouseOut = false;
    }

    onShiftKeyDown(event: KeyboardEvent): void {
        this.circle = true;
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.canvasSelected = false;
            this.selectEllipse(this.mousePosition, this.mouseDownCoords, {
                primaryColor: this.strokeColor,
                secondaryColor: this.fillColor,
                lineWidth: this.lineWidth,
                shiftPressed: this.circle,
                selectSubTool: this.subToolSelect,
                canvasSelected: this.canvasSelected,
            });
        }
    }

    onShiftKeyUp(event: KeyboardEvent): void {
        this.circle = false;
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.canvasSelected = false;
            this.selectEllipse(this.mousePosition, this.mouseDownCoords, {
                primaryColor: this.strokeColor,
                secondaryColor: this.fillColor,
                lineWidth: this.lineWidth,
                shiftPressed: this.circle,
                selectSubTool: this.subToolSelect,
                canvasSelected: this.canvasSelected,
            });
        }
    }

    selectEllipse(mousePosition: Vec2, mouseDownCoords: Vec2, generalInfo: ToolGeneralInfo): void {
        this.height = mousePosition.y - mouseDownCoords.y;
        this.width = mousePosition.x - mouseDownCoords.x;
        this.mouseDownCoords = mouseDownCoords;
        this.strokeColor = generalInfo.primaryColor;
        this.fillColor = generalInfo.secondaryColor;
        this.lineWidth = generalInfo.lineWidth;

        const onWhichCanvas = generalInfo.canvasSelected ? this.drawingService.baseCtx : this.drawingService.previewCtx;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        switch (generalInfo.selectSubTool) {
            case SubToolSelected.tool1: {
                this.drawFillEllipse(onWhichCanvas, mouseDownCoords);
                break;
            }
            case SubToolSelected.tool2: {
                this.drawEllipseOutline(onWhichCanvas, mouseDownCoords, mousePosition);
                break;
            }
            case SubToolSelected.tool3: {
                this.drawFillEllipseOutline(onWhichCanvas, mouseDownCoords, mousePosition);
                break;
            }
        }
        this.automaticSaveService.save();
    }

    clearEffectTool(): void {
        this.drawingService.baseCtx.shadowColor = 'rgba(0,0,0,0)';
        this.drawingService.previewCtx.shadowColor = 'rgba(0,0,0,0)';
        this.drawingService.baseCtx.strokeStyle = '#000000'; // to draw after erasing
        this.drawingService.previewCtx.strokeStyle = '#000000';
        this.drawingService.baseCtx.lineJoin = 'miter';
        this.drawingService.baseCtx.lineCap = 'square';
        this.drawingService.previewCtx.lineJoin = 'miter';
        this.drawingService.previewCtx.lineCap = 'square';
        this.drawingService.baseCtx.setLineDash([0, 0]); // reset
        this.drawingService.previewCtx.setLineDash([0, 0]);
    }

    // draw a basic ellipse + circle if shift pressed
    private drawEllipse(ctx: CanvasRenderingContext2D, radiusX: number, radiusY: number): void {
        let centerX = 0;
        let centerY = 0;
        centerX = this.mouseDownCoords.x + radiusX;
        centerY = this.mouseDownCoords.y + radiusY;
        if (this.circle) {
            ctx.ellipse(
                centerX,
                centerY,
                Math.min(Math.abs(radiusX), Math.abs(radiusY)),
                Math.min(Math.abs(radiusX), Math.abs(radiusY)),
                0,
                0,
                2 * Math.PI,
            );
        } else {
            ctx.ellipse(centerX, centerY, Math.abs(radiusX), Math.abs(radiusY), 0, 0, 2 * Math.PI);
        }
    }

    drawFillEllipse(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2): void {
        this.drawingService.previewCtx.beginPath();
        this.drawingService.baseCtx.beginPath();
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeRectColor;
        ctx.setLineDash([DOTTED_SPACE, DOTTED_SPACE]);
        this.drawEllipse(ctx, this.width / 2, this.height / 2);
        ctx.fill();
        if (this.drawingService.previewCtx === ctx) {
            ctx.strokeRect(mouseDownPos.x, mouseDownPos.y, this.width, this.height);
        }
    }

    drawEllipseOutline(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2, mouseUpPos: Vec2): void {
        this.drawingService.baseCtx.beginPath();
        this.drawingService.previewCtx.beginPath();
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeColor;
        ctx.setLineDash([0, 0]);
        this.drawEllipse(ctx, this.width / 2, this.height / 2);
        ctx.stroke();

        ctx.beginPath(); // Define new path for outlined rectangle

        ctx.strokeStyle = this.strokeRectColor;
        ctx.lineWidth = this.lineRectWidth;
        ctx.setLineDash([DOTTED_SPACE, DOTTED_SPACE]);
        this.drawPreviewRect(ctx, mouseDownPos, mouseUpPos);
    }

    drawFillEllipseOutline(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2, mouseUpPos: Vec2): void {
        this.drawingService.previewCtx.beginPath();
        this.drawingService.baseCtx.beginPath();
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        ctx.setLineDash([0, 0]);

        this.drawEllipse(ctx, this.width / 2, this.height / 2);
        ctx.stroke();
        ctx.fill();

        ctx.beginPath(); // Define new path for outlined rectangle

        ctx.strokeStyle = this.strokeRectColor;
        ctx.lineWidth = this.lineRectWidth;
        ctx.setLineDash([DOTTED_SPACE, DOTTED_SPACE]);
        this.drawPreviewRect(ctx, mouseDownPos, mouseUpPos);
    }

    drawPreviewRect(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2, mousePosition: Vec2): void {
        if (this.drawingService.previewCtx === ctx) {
            if (mousePosition.x > mouseDownPos.x && mousePosition.y > mouseDownPos.y) {
                ctx.strokeRect(
                    mouseDownPos.x - this.lineWidth / 2,
                    mouseDownPos.y - this.lineWidth / 2,
                    this.width + this.lineWidth,
                    this.height + this.lineWidth,
                );
                return;
            }
            if (mousePosition.x < mouseDownPos.x && mousePosition.y < mouseDownPos.y) {
                ctx.strokeRect(
                    mouseDownPos.x + this.lineWidth / 2,
                    mouseDownPos.y + this.lineWidth / 2,
                    this.width - this.lineWidth,
                    this.height - this.lineWidth,
                );
                return;
            }
            if (mousePosition.x > mouseDownPos.x && mousePosition.y < mouseDownPos.y) {
                ctx.strokeRect(
                    mouseDownPos.x - this.lineWidth / 2,
                    mouseDownPos.y + this.lineWidth / 2,
                    this.width + this.lineWidth,
                    this.height - this.lineWidth,
                );
                return;
            }
            if (mousePosition.x < mouseDownPos.x && mousePosition.y > mouseDownPos.y) {
                ctx.strokeRect(
                    mouseDownPos.x + this.lineWidth / 2,
                    mouseDownPos.y - this.lineWidth / 2,
                    this.width - this.lineWidth,
                    this.height + this.lineWidth,
                );
                return;
            }
        }
    }
}
