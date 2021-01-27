import { Injectable } from '@angular/core';

import { cursorName } from '@app/classes/cursor-name';
import { MouseButton } from '@app/classes/mouse-button';
import {
    ICON_WIDTH,
    MIN_CANVAS_SIZE,
    RESIZE_DASH_SPACING,
    RESIZE_DASH_THICKNESS,
    SIDEBAR_WIDTH,
    WORK_AREA_PADDING_SIZE,
} from '@app/classes/resize-canvas';
import { ResizeDirection } from '@app/classes/resize-direction';
import { ResizeCanvasAction } from '@app/classes/undo-redo/resize-canvas-action';
import { Vec2 } from '@app/classes/vec2';

import { GridService } from '@app/services/tools/grid.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class CanvasResizeService {
    readonly DEFAULT_WIDTH: number = (window.innerWidth - SIDEBAR_WIDTH - ICON_WIDTH) / 2;
    readonly DEFAULT_HEIGHT: number = window.innerHeight / 2;

    canvasSize: Vec2 = { x: this.DEFAULT_WIDTH, y: this.DEFAULT_HEIGHT };

    isResizeDown: boolean = false;
    resizeDirection: ResizeDirection;
    resizeCursor: string = cursorName.default;

    resizeWidth: number = window.innerWidth - SIDEBAR_WIDTH - ICON_WIDTH;
    resizeHeight: number = window.innerHeight;

    addToUndoRedo: boolean = false;

    // Resize canvas index
    readonly PRIORITY_INDEX: number = 10;
    readonly NORMAL_INDEX: number = 1;
    resizeIndex: number = 1;

    constructor(private gridService: GridService, private undoRedoService: UndoRedoService) {}

    private clearCanvas(context: CanvasRenderingContext2D, dimension: Vec2): void {
        context.clearRect(0, 0, dimension.x, dimension.y);
    }

    onResizeDown(event: MouseEvent, resizeDirection: ResizeDirection): void {
        this.isResizeDown = event.button === MouseButton.Left;
        this.resizeDirection = resizeDirection;
        if (this.isResizeDown) {
            this.resizeIndex = this.PRIORITY_INDEX; // We now put the whole surface in the foreground.
            this.resizeDirection = resizeDirection;
            this.addToUndoRedo = true;
        }
    }

    private changeResizeY(event: MouseEvent, canvasResizeService: CanvasResizeService): number {
        if (event.offsetY < MIN_CANVAS_SIZE) {
            return MIN_CANVAS_SIZE;
        }
        if (event.offsetY > canvasResizeService.resizeHeight - WORK_AREA_PADDING_SIZE) {
            return canvasResizeService.resizeHeight - WORK_AREA_PADDING_SIZE;
        }
        return event.offsetY;
    }

    private changeResizeX(event: MouseEvent, canvasResizeService: CanvasResizeService): number {
        if (event.offsetX < MIN_CANVAS_SIZE) {
            return MIN_CANVAS_SIZE;
        }
        if (event.offsetX > canvasResizeService.resizeWidth - WORK_AREA_PADDING_SIZE) {
            return canvasResizeService.resizeWidth - WORK_AREA_PADDING_SIZE;
        }
        return event.offsetX;
    }

    onResize(event: MouseEvent, resizeCtx: CanvasRenderingContext2D): void {
        if (this.isResizeDown) {
            this.clearCanvas(resizeCtx, { x: this.resizeWidth, y: this.resizeHeight });
            resizeCtx.setLineDash([RESIZE_DASH_SPACING]);
            resizeCtx.strokeStyle = '#000000';
            resizeCtx.lineWidth = RESIZE_DASH_THICKNESS;
            switch (this.resizeDirection) {
                case ResizeDirection.vertical:
                    resizeCtx.strokeRect(0, 0, this.canvasSize.x, this.changeResizeY(event, this));
                    break;
                case ResizeDirection.horizontal:
                    resizeCtx.strokeRect(0, 0, this.changeResizeX(event, this), this.canvasSize.y);
                    break;
                case ResizeDirection.verticalAndHorizontal:
                    resizeCtx.strokeRect(0, 0, this.changeResizeX(event, this), this.changeResizeY(event, this));
                    break;
            }
        }
    }

    private changeCanvasY(event: MouseEvent): void {
        if (event.offsetY < MIN_CANVAS_SIZE) {
            this.canvasSize.y = MIN_CANVAS_SIZE;
            return;
        }
        if (event.offsetY > this.resizeHeight - WORK_AREA_PADDING_SIZE) {
            this.canvasSize.y = this.resizeHeight - WORK_AREA_PADDING_SIZE;
            return;
        }
        this.canvasSize.y = event.offsetY;
    }

    private changeCanvasX(event: MouseEvent): void {
        if (event.offsetX < MIN_CANVAS_SIZE) {
            this.canvasSize.x = MIN_CANVAS_SIZE;
            return;
        }
        if (event.offsetX > this.resizeWidth - WORK_AREA_PADDING_SIZE) {
            this.canvasSize.x = this.resizeWidth - WORK_AREA_PADDING_SIZE;
            return;
        }
        this.canvasSize.x = event.offsetX;
    }

    // The following reference has been used to preserver canvas image. The whitening is automatic.
    // https://stackoverflow.com/questions/8977369/drawing-png-to-a-canvas-element-not-showing-transparency
    onResizeUp(event: MouseEvent, resizeCtx: CanvasRenderingContext2D, baseCanvas: HTMLCanvasElement): void {
        if (this.isResizeDown) {
            const originalImage = new Image();
            originalImage.src = baseCanvas.toDataURL('image/png', 1);
            switch (this.resizeDirection) {
                case ResizeDirection.vertical:
                    this.changeCanvasY(event);
                    break;
                case ResizeDirection.horizontal:
                    this.changeCanvasX(event);
                    break;
                case ResizeDirection.verticalAndHorizontal:
                    this.changeCanvasX(event);
                    this.changeCanvasY(event);
                    break;
            }
            const ctx = baseCanvas.getContext('2d') as CanvasRenderingContext2D;
            // onload because drawing an image depends on the condition that the originalImage is loaded.
            // Being asynchronous is keypart of web developement
            originalImage.onload = () => {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.drawImage(originalImage, 0, 0);

                // reapply grid
                this.gridService.activateGrid();
            };
        }
        this.clearCanvas(resizeCtx, { x: this.resizeWidth, y: this.resizeHeight });
        this.resizeIndex = this.NORMAL_INDEX;

        this.isResizeDown = false;
        this.resizeCursor = cursorName.default;

        if (this.addToUndoRedo) {
            const resizeAction = new ResizeCanvasAction(event, resizeCtx, baseCanvas, this.resizeDirection, this);
            this.undoRedoService.addUndo(resizeAction);
        }
        this.addToUndoRedo = false;
    }

    onResizeOut(event: MouseEvent, resizeCtx: CanvasRenderingContext2D, baseCanvas: HTMLCanvasElement): void {
        this.onResizeUp(event, resizeCtx, baseCanvas);
    }
}
