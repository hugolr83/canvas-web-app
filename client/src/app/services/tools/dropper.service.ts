import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { RGBA } from '@app/classes/rgba';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

export const FORTY = 40;

@Injectable({
    providedIn: 'root',
})
export class DropperService extends Tool {
    rgba: RGBA;
    currentPosition: Vec2;
    private circleWidth: number;
    private circleHeight: number;
    private circlePositionX: number;
    private circlePositionY: number;
    private circleRadius: number = 18;
    private angleBegin: number = 0;
    private endAngle: number = 2 * Math.PI;
    private currentColor: string;
    circleCtx: CanvasRenderingContext2D;

    constructor(drawingService: DrawingService, private colorService: ColorService, private automaticSaveService: AutomaticSaveService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = true;
        if (event.button === MouseButton.Left) {
            this.mouseDown = false;
            const position = { x: event.offsetX, y: event.offsetY };
            this.rgba = this.colorService.getColor(position, this.drawingService.baseCtx);
            this.colorService.primaryColor = this.colorService.numeralToHex(this.rgba);
            this.drawingService.previewCtx.strokeStyle = this.colorService.primaryColor;
            this.drawingService.baseCtx.strokeStyle = this.colorService.primaryColor;
        }
        if (event.button === MouseButton.Right) {
            this.mouseDown = false;
            const position = { x: event.offsetX, y: event.offsetY };
            this.rgba = this.colorService.getColor(position, this.drawingService.baseCtx);
            this.colorService.secondaryColor = this.colorService.numeralToHex(this.rgba);
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.circleWidth = this.drawingService.cursorCtx.canvas.offsetWidth / 2; // magic number needed to center cursor
        this.circleHeight = this.drawingService.cursorCtx.canvas.offsetHeight / 2;
        this.drawingService.cursorCtx.canvas.style.left = event.offsetX - this.circleWidth + 'px';
        this.drawingService.cursorCtx.canvas.style.top = event.offsetY - this.circleHeight + 'px';
        const position = { x: event.offsetX, y: event.offsetY };
        this.currentColor = this.colorService.numeralToHex(this.colorService.getColor(position, this.drawingService.baseCtx));
        this.shapeCircle(this.currentColor);
        this.shapePreview(this.currentColor);
        this.automaticSaveService.save();
    }
    shapeCircle(color: string): void {
        this.drawingService.cursorCtx.clearRect(0, 0, FORTY, FORTY);
        this.circlePositionX = this.circleWidth;
        this.circlePositionY = this.circleHeight;
        this.drawingService.cursorCtx.beginPath();
        this.drawingService.cursorCtx.arc(this.circlePositionX, this.circlePositionY, this.circleRadius, this.angleBegin, this.endAngle);
        this.drawingService.cursorCtx.fillStyle = color;
        this.drawingService.cursorCtx.fill();
        this.drawingService.cursorCtx.stroke();
    }

    shapePreview(color: string): void {
        this.circleCtx.beginPath();
        this.circleCtx.arc(this.circlePositionX, this.circlePositionY, this.circleRadius, this.angleBegin, this.endAngle);
        this.circleCtx.fillStyle = color;
        this.circleCtx.fill();
        this.circleCtx.stroke();
    }

    onMouseOut(event: MouseEvent): void {
        this.drawingService.cursorCtx.canvas.style.display = 'none';
        this.circleCtx.canvas.style.display = 'none';
    }

    onMouseEnter(event: MouseEvent): void {
        this.drawingService.cursorCtx.canvas.style.display = 'inline-block';
        this.circleCtx.canvas.style.display = 'inline-block';
    }
}
