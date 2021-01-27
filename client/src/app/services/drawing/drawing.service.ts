import { Injectable } from '@angular/core';
import { cursorName } from '@app/classes/cursor-name';
import { Tool, ToolUsed } from '@app/classes/tool';
@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    cursorCtx: CanvasRenderingContext2D;

    gridCanvas: HTMLCanvasElement;
    gridCtx: CanvasRenderingContext2D;

    whichTools: ToolUsed = ToolUsed.Pencil;
    currentTool: Tool;
    cursorUsed: string = cursorName.default;

    readonly cursorCtxWidthAndHeight: number = 40;

    private image: HTMLImageElement;

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    convertBaseCanvasToBase64(): string {
        return this.canvas.toDataURL('image/png', 1.0);
    }

    convertBase64ToBaseCanvas(base64: string): void {
        this.image = new Image();
        this.image.src = base64;
        this.image.onload = () => {
            this.baseCtx.drawImage(this.image, 0, 0);
        };
    }

    // returns true if every pixel's uint32 representation is 0 (or "blank")
    isCanvasBlank(): boolean {
        const pixelBuffer = new Uint32Array(this.baseCtx.getImageData(0, 0, this.canvas.width, this.canvas.height).data.buffer);
        return !pixelBuffer.some((color) => color !== 0);
    }

    isPreviewCanvasBlank(): boolean {
        const pixelBuffer = new Uint32Array(this.previewCtx.getImageData(0, 0, this.canvas.width, this.canvas.height).data.buffer);
        return !pixelBuffer.some((color) => color !== 0);
    }
}
