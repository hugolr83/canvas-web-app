import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { SubToolSelected } from '@app/classes/sub-tool-selected';
import { Tool } from '@app/classes/tool';
import { ToolGeneralInfo } from '@app/classes/tool-general-info';
import { RectangleAction } from '@app/classes/undo-redo/rectangle-action';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    lineWidth: number = 1;
    fillColor: string; // secondary
    strokeColor: string; // primary
    square: boolean = false; // shift
    height: number;
    width: number;
    mousePosition: Vec2;
    canvasSelected: boolean; // which canvas
    distanceX: number;
    distanceY: number;
    mouseEnter: boolean = false;
    mouseOut: boolean = false;

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
        this.clearEffectTool();
        this.strokeColor = this.colorService.secondaryColor;
        this.fillColor = this.colorService.primaryColor;
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
            this.selectRectangle(mousePosition, this.mouseDownCoords, {
                primaryColor: this.strokeColor,
                secondaryColor: this.fillColor,
                lineWidth: this.lineWidth,
                shiftPressed: this.square,
                selectSubTool: this.subToolSelect,
                canvasSelected: this.canvasSelected,
            });
        }
        // undo- redo
        const rectAction = new RectangleAction(
            this.mousePosition,
            this.mouseDownCoords,
            this.strokeColor,
            this.fillColor,
            this.lineWidth,
            this.square,
            this.subToolSelect,
            this.canvasSelected,
            this,
            this.drawingService,
        );
        this.undoRedoService.addUndo(rectAction);
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
            this.selectRectangle(mousePosition, this.mouseDownCoords, {
                primaryColor: this.strokeColor,
                secondaryColor: this.fillColor,
                lineWidth: this.lineWidth,
                shiftPressed: this.square,
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
        this.square = true;
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.canvasSelected = false;
            this.selectRectangle(this.mousePosition, this.mouseDownCoords, {
                primaryColor: this.strokeColor,
                secondaryColor: this.fillColor,
                lineWidth: this.lineWidth,
                shiftPressed: this.square,
                selectSubTool: this.subToolSelect,
                canvasSelected: this.canvasSelected,
            });
        }
    }

    onShiftKeyUp(event: KeyboardEvent): void {
        this.square = false;
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.canvasSelected = false;
            this.selectRectangle(this.mousePosition, this.mouseDownCoords, {
                primaryColor: this.strokeColor,
                secondaryColor: this.fillColor,
                lineWidth: this.lineWidth,
                shiftPressed: this.square,
                selectSubTool: this.subToolSelect,
                canvasSelected: this.canvasSelected,
            });
        }
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

    drawFillRectangle(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2): void {
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = this.fillColor;
        ctx.lineWidth = this.lineWidth;
        if (this.square) {
            ctx.fillRect(mouseDownPos.x, mouseDownPos.y, this.width, this.height);
        } else {
            ctx.fillRect(mouseDownPos.x, mouseDownPos.y, this.distanceX, this.distanceY);
        }
    }

    drawRectangleOutline(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2): void {
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = this.fillColor;
        ctx.lineWidth = this.lineWidth;

        if (this.square) {
            ctx.strokeRect(mouseDownPos.x, mouseDownPos.y, this.width, this.height);
        } else {
            ctx.strokeRect(mouseDownPos.x, mouseDownPos.y, this.distanceX, this.distanceY);
        }
    }

    drawFillRectangleOutline(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2): void {
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = this.fillColor;
        ctx.lineWidth = this.lineWidth;

        if (this.square) {
            ctx.fillRect(mouseDownPos.x, mouseDownPos.y, this.width, this.height);
            ctx.strokeRect(mouseDownPos.x, mouseDownPos.y, this.width, this.height);
        } else {
            ctx.fillRect(mouseDownPos.x, mouseDownPos.y, this.distanceX, this.distanceY);
            ctx.strokeRect(mouseDownPos.x, mouseDownPos.y, this.distanceX, this.distanceY);
        }
    }
    selectRectangle(mousePosition: Vec2, mouseDownCoords: Vec2, generalInfo: ToolGeneralInfo): void {
        this.distanceX = mousePosition.x - mouseDownCoords.x;
        this.distanceY = mousePosition.y - mouseDownCoords.y;
        this.strokeColor = generalInfo.primaryColor;
        this.fillColor = generalInfo.secondaryColor;
        this.lineWidth = generalInfo.lineWidth;
        // width an height calculus while keeping position sign
        this.height = Math.sign(this.distanceY) * Math.abs(Math.min(this.distanceX, this.distanceY));
        this.width = Math.sign(this.distanceX) * Math.abs(Math.min(this.distanceX, this.distanceY));

        const onWhichCanvas = generalInfo.canvasSelected ? this.drawingService.baseCtx : this.drawingService.previewCtx;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        switch (generalInfo.selectSubTool) {
            case SubToolSelected.tool1: {
                this.drawFillRectangle(onWhichCanvas, mouseDownCoords);
                break;
            }
            case SubToolSelected.tool2: {
                this.drawRectangleOutline(onWhichCanvas, mouseDownCoords);
                break;
            }
            case SubToolSelected.tool3: {
                this.drawFillRectangleOutline(onWhichCanvas, mouseDownCoords);
                break;
            }
        }
        this.automaticSaveService.save();
    }
}
