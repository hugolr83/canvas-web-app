import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { SubToolSelected } from '@app/classes/sub-tool-selected';
import { Tool } from '@app/classes/tool';
import { ToolInfoPolygon } from '@app/classes/tool-info-polygone';
import { PolygonAction as PolygonsAction } from '@app/classes/undo-redo/polygon-action';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class PolygonService extends Tool {
    lineWidth: number = 1;
    fillColor: string; // primary
    strokeColor: string; // secondary
    mousePosition: Vec2;
    private distanceX: number;
    private distanceY: number;
    private dottedLineWidth: number = 2;
    private dottedSpace: number = 10;
    numberOfSides: number = 3; // smallest number of sides allowed
    private radius: number;
    mouseEnter: boolean = false;
    mouseOut: boolean = false;
    isRenderingBase: boolean;
    private strokeCircleColor: string = '#000000';
    private lineCircleWidth: number = 1;
    // tslint:disable-next-line:no-magic-numbers
    possibleNbSides: number[] = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // numbers of sides allowed for polygon -> authorized disable magical number

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
        this.drawingService.baseCtx.lineWidth = this.dottedLineWidth;
        this.drawingService.previewCtx.lineWidth = this.dottedLineWidth;
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
            this.isRenderingBase = true;
            this.selectPolygon(mousePosition, this.mouseDownCoords, {
                primaryColor: this.strokeColor,
                secondaryColor: this.fillColor,
                lineWidth: this.lineWidth,
                nbSides: this.numberOfSides,
                selectSubTool: this.subToolSelect,
                isRenderingBase: this.isRenderingBase,
            });
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        // undo-redo
        const polygonAction = new PolygonsAction(
            this.mousePosition,
            this.mouseDownCoords,
            this.strokeColor,
            this.fillColor,
            this.lineWidth,
            this.numberOfSides,
            this.isRenderingBase,
            this.subToolSelect,
            this,
            this.drawingService,
        );

        this.undoRedoService.addUndo(polygonAction);
        this.undoRedoService.clearRedo();

        this.mouseDown = false;
        this.mouseEnter = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.mousePosition = mousePosition;

            // draw on previewCanvas
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.isRenderingBase = false;
            this.selectPolygon(mousePosition, this.mouseDownCoords, {
                primaryColor: this.strokeColor,
                secondaryColor: this.fillColor,
                lineWidth: this.lineWidth,
                nbSides: this.numberOfSides,
                selectSubTool: this.subToolSelect,
                isRenderingBase: this.isRenderingBase,
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

    drawFillPolygon(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2, mouseUpPos: Vec2): void {
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = this.fillColor;
        ctx.lineWidth = this.lineWidth;

        this.drawingService.baseCtx.beginPath();
        this.drawingService.previewCtx.beginPath();

        ctx.fillStyle = this.fillColor;
        ctx.setLineDash([0, 0]);
        this.drawPolygon(ctx, this.numberOfSides);
        ctx.fill();
        // draw preview circle
        if (this.drawingService.previewCtx === ctx) {
            ctx.lineWidth = this.lineCircleWidth;
            ctx.strokeStyle = this.strokeCircleColor;
            ctx.setLineDash([this.dottedSpace, this.dottedSpace]);
            ctx.arc(this.mouseDownCoords.x, this.mouseDownCoords.y, this.radius, 0, 2 * Math.PI, false);
            ctx.stroke();
        }
    }

    drawPolygonOutline(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2, mouseUpPos: Vec2): void {
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = this.fillColor;
        ctx.lineWidth = this.lineWidth;

        this.drawingService.baseCtx.beginPath();
        this.drawingService.previewCtx.beginPath();

        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeColor;
        ctx.setLineDash([0, 0]);
        this.drawPolygon(ctx, this.numberOfSides);
        ctx.stroke();
        ctx.strokeStyle = this.strokeCircleColor;
        this.drawPreviewCircle(ctx, mouseDownPos, mouseUpPos);
    }

    drawFillPolygonOutline(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2, mouseUpPos: Vec2): void {
        this.drawingService.baseCtx.beginPath();
        this.drawingService.previewCtx.beginPath();

        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        ctx.setLineDash([0, 0]);
        this.drawPolygon(ctx, this.numberOfSides);
        ctx.stroke();
        ctx.fill();
        ctx.strokeStyle = this.strokeCircleColor;
        this.drawPreviewCircle(ctx, mouseDownPos, mouseUpPos);
    }

    selectPolygon(mousePosition: Vec2, mouseDownCoords: Vec2, infoPolygon: ToolInfoPolygon): void {
        this.distanceX = mousePosition.x - mouseDownCoords.x;
        this.distanceY = mousePosition.y - mouseDownCoords.y;

        this.mouseDownCoords = mouseDownCoords;
        this.fillColor = infoPolygon.secondaryColor;
        this.strokeColor = infoPolygon.primaryColor;
        this.lineWidth = infoPolygon.lineWidth;
        this.numberOfSides = infoPolygon.nbSides;
        this.radius = Math.sqrt(Math.pow(this.distanceX, 2) + Math.pow(this.distanceY, 2));
        const onWhichCanvas = infoPolygon.isRenderingBase ? this.drawingService.baseCtx : this.drawingService.previewCtx;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        switch (infoPolygon.selectSubTool) {
            case SubToolSelected.tool1: {
                this.drawFillPolygon(onWhichCanvas, mouseDownCoords, mousePosition);
                break;
            }
            case SubToolSelected.tool2: {
                this.drawPolygonOutline(onWhichCanvas, mouseDownCoords, mousePosition);
                break;
            }
            case SubToolSelected.tool3: {
                this.drawFillPolygonOutline(onWhichCanvas, mouseDownCoords, mousePosition);
                break;
            }
        }
    }

    // draw a basic Polygon
    private drawPolygon(ctx: CanvasRenderingContext2D, numberOfSides: number): void {
        const angle = (Math.PI * 2) / numberOfSides;

        this.drawingService.previewCtx.beginPath();
        this.drawingService.baseCtx.beginPath();

        ctx.moveTo(this.mouseDownCoords.x + this.radius * Math.cos(0), this.mouseDownCoords.y + this.radius * Math.sin(0));
        for (let i = 1; i <= numberOfSides; i++) {
            ctx.lineTo(this.mouseDownCoords.x + this.radius * Math.cos(i * angle), this.mouseDownCoords.y + this.radius * Math.sin(i * angle));
        }
    }

    drawPreviewCircle(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2, mousePosition: Vec2): void {
        if (this.drawingService.previewCtx === ctx) {
            ctx.beginPath(); // Define new path for outlined circle
            ctx.strokeStyle = this.strokeCircleColor;
            ctx.lineWidth = this.lineCircleWidth;
            ctx.setLineDash([this.dottedSpace, this.dottedSpace]);
            ctx.arc(this.mouseDownCoords.x, this.mouseDownCoords.y, this.radius + this.lineWidth / 2, 0, 2 * Math.PI, false);
            ctx.stroke();
        }
        this.automaticSaveService.save();
    }

    clearEffectTool(): void {
        this.drawingService.baseCtx.shadowColor = 'rgba(0,0,0,0)';
        this.drawingService.previewCtx.shadowColor = 'rgba(0,0,0,0)';
        this.drawingService.baseCtx.strokeStyle = this.colorService.primaryColor; // to draw after erasing
        this.drawingService.previewCtx.strokeStyle = this.colorService.primaryColor;
        this.drawingService.baseCtx.lineJoin = 'bevel';
        this.drawingService.baseCtx.lineCap = 'butt';
        this.drawingService.previewCtx.lineJoin = 'bevel';
        this.drawingService.previewCtx.lineCap = 'butt';
        this.drawingService.previewCtx.lineWidth = this.drawingService.baseCtx.lineWidth = this.lineWidth;
        this.drawingService.baseCtx.setLineDash([]); // reset
        this.drawingService.previewCtx.setLineDash([]);
        this.clearPreviewCtx();
    }
}
