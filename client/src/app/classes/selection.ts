import { DrawingService } from '@app/services/drawing/drawing.service';
import { Vec2 } from './vec2';

export class SelectionImage {
    constructor(drawingService: DrawingService) {
        this.copyImageInitialPos = this.imagePosition = { x: 0, y: 0 };
        this.width = 0;
        this.height = 0;
        this.imageSize = { x: 0, y: 0 };
        this.endingPos = { x: 0, y: 0 };
        this.ellipseRadian = { x: 0, y: 0 };
        this.drawingService = drawingService;
        this.rotationAngle = 0;
    }
    drawingService: DrawingService;
    copyImageInitialPos: Vec2;
    imagePosition: Vec2;
    endingPos: Vec2;
    imageData: ImageData;
    image: HTMLImageElement;
    imageSize: Vec2;
    height: number;
    width: number;
    ellipseRadian: Vec2;
    rotationAngle: number;

    getImage(size: Vec2): void {
        this.imageSize = size;
        this.imageData = this.drawingService.baseCtx.getImageData(this.imagePosition.x, this.imagePosition.y, this.width, this.height);
        this.image = new Image();
        this.image.src = this.getImageURL(this.imageData, this.imageSize.x, this.imageSize.y);
    }

    getImageURL(imgData: ImageData, width: number, height: number): string {
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        const ctx = (canvas.getContext('2d') as CanvasRenderingContext2D) as CanvasRenderingContext2D;
        canvas.width = Math.abs(width);
        canvas.height = Math.abs(height);
        ctx.putImageData(imgData, 0, 0);
        return canvas.toDataURL();
    }

    resetAngle(): void {
        this.rotationAngle = 0;
    }
}
