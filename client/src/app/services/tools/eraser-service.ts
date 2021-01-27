import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { Tool } from '@app/classes/tool';
import { EraseAction } from '@app/classes/undo-redo/erase-actions';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    private pathData: Vec2[];
    private color: string = '#FFFFFF';
    eraserWidth: number = 5;

    constructor(drawingService: DrawingService, private undoRedoService: UndoRedoService, private automaticSaveService: AutomaticSaveService) {
        super(drawingService);
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseMove = false;
            this.drawingService.baseCtx.strokeStyle = this.color; // draw in white
            this.drawingService.previewCtx.strokeStyle = this.color; // when change color is implemented call pencil with white.
            this.clearEffectTool();
            this.mouseDownCoords = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoords);
        }
        this.clearPath();
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            if (this.mouseMove) {
                this.pathData.push(mousePosition);
                this.removeLine(this.drawingService.baseCtx, this.pathData);
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
            } else {
                // code to draw the dot
                this.clearPath();
                this.drawingService.baseCtx.fillStyle = this.color;
                this.drawingService.baseCtx.fillRect(mousePosition.x, mousePosition.y, this.eraserWidth, this.eraserWidth);
                this.drawingService.previewCtx.fillStyle = this.color;
                this.drawingService.previewCtx.fillRect(mousePosition.x, mousePosition.y, this.eraserWidth, this.eraserWidth);
                this.pathData.push(mousePosition);
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
            }
        }
        const actionEraser = new EraseAction(this.pathData, this.color, this.eraserWidth, this, this.drawingService);
        this.undoRedoService.addUndo(actionEraser);
        this.undoRedoService.clearRedo();
        this.clearPath();
        this.mouseDown = false;
        this.automaticSaveService.save();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseMove = true;
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.removeLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    clearEffectTool(): void {
        this.drawingService.baseCtx.setLineDash([0, 0]);
        this.drawingService.previewCtx.setLineDash([0, 0]);
        this.drawingService.baseCtx.lineWidth = this.eraserWidth;
        this.drawingService.previewCtx.lineWidth = this.eraserWidth;
        this.drawingService.baseCtx.lineCap = 'butt';
        this.drawingService.baseCtx.lineJoin = 'bevel';
        this.drawingService.previewCtx.lineCap = 'butt';
        this.drawingService.previewCtx.lineJoin = 'bevel';
    }
    removeLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }
    clearPath(): void {
        this.pathData = [];
    }
}
