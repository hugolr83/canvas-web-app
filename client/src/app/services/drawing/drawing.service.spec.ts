import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';

// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers

describe('DrawingService', () => {
    let service: DrawingService;

    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        service = new DrawingService();
        canvas = canvasTestHelper.canvas;
        canvas.width = 100;
        canvas.height = 100;
        canvas = canvasTestHelper.canvas;
        baseStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        service.canvas = canvas;
        service.baseCtx = baseStub;
        service.previewCtx = previewStub;
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: service }],
        });

        service = TestBed.inject(DrawingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should clear the whole canvas', () => {
        service.clearCanvas(service.baseCtx);
        const pixelBuffer = new Uint32Array(service.baseCtx.getImageData(0, 0, service.canvas.width, service.canvas.height).data.buffer);
        const hasColoredPixels = pixelBuffer.some((color) => color !== 0);
        expect(hasColoredPixels).toEqual(false);
    });

    it('isCanvasBlank should return true if canvas is empty', () => {
        service.clearCanvas(service.baseCtx);
        expect(service.isCanvasBlank()).toEqual(true);
    });

    it('isCanvasBlank should return false if canvas is not empty', () => {
        service.baseCtx.fillRect(20, 20, 100, 100);
        expect(service.isCanvasBlank()).toEqual(false);
    });

    it('isPreviewCanvasBlank should return false if canvas is not empty', () => {
        service.previewCtx.fillRect(20, 20, 100, 100);
        expect(service.isPreviewCanvasBlank()).toEqual(false);
    });

    it('should not call convertBase64ToCanvas on load', async () => {
        service.previewCtx.fillRect(20, 20, 100, 100);
        const event = new Event('onload');
        service.convertBase64ToBaseCanvas('assets/apple.svg');
        const spy = spyOn(service.baseCtx, 'drawImage').and.stub();
        service['image'].dispatchEvent(event);
        expect(spy).not.toHaveBeenCalled();
    });
});
