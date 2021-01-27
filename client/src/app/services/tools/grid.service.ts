import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';

export const SQUARE_STEP_SIZE = 5;
export const MIN_SQUARE_WIDTH = 5;
export const MAX_SQUARE_WIDTH = 500;

@Injectable({
    providedIn: 'root',
})
export class GridService {
    isGridSettingsChecked: boolean = false;
    opacity: number = 0.1; // 0 means transparent or DISABLED, 1 means super opaque
    squareWidth: number = 100; // the unit is in pixels

    constructor(private drawingService: DrawingService) {}

    getGridData(): ImageData {
        return this.drawingService.gridCtx.getImageData(0, 0, this.drawingService.gridCanvas.width, this.drawingService.gridCanvas.height);
    }

    activateGrid(): void {
        if (this.isGridSettingsChecked) {
            const ctx = this.drawingService.gridCtx;
            this.drawingService.clearCanvas(ctx);
            const w = this.drawingService.canvas.width;
            const h = this.drawingService.canvas.height;
            const nbOfVerticalLines = Math.ceil(w / this.squareWidth);
            const nbOfHorizontalLines = Math.ceil(h / this.squareWidth);
            ctx.fillStyle = 'rgba(0, 0, 0)'; // black lines

            if (this.opacity === 0) return; // draw nothing if opacity is at zero

            ctx.globalAlpha = this.opacity;
            // horizontal lines first
            for (let j = 0; j < nbOfHorizontalLines; ++j) {
                ctx.beginPath();
                ctx.moveTo(0, j * this.squareWidth);
                ctx.lineTo(w, j * this.squareWidth);
                ctx.closePath();
                ctx.stroke();
            }
            // then vertical lines
            for (let i = 0; i < nbOfVerticalLines; ++i) {
                ctx.beginPath();
                ctx.moveTo(i * this.squareWidth, 0);
                ctx.lineTo(i * this.squareWidth, h);
                ctx.closePath();
                ctx.stroke();
            }
        }
    }

    // deactivating the grid means clearing it
    deactivateGrid(): void {
        this.drawingService.clearCanvas(this.drawingService.gridCtx);
        this.isGridSettingsChecked = false;
    }
}
