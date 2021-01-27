import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { PaintBucketAction } from '@app/classes/undo-redo/paint-bucket-action';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PaintBucketService } from '@app/services/tools/paint-bucket.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// tslint:disable:prefer-const
// tslint:disable:no-magic-numbers
describe('PaintBucketAction', () => {
    let paintBucketActionStub: PaintBucketAction;
    let drawingStub: DrawingService;
    let colorStub: ColorService;
    let undoRedoStub: UndoRedoService;
    let paintBucketStub: PaintBucketService;
    let autoSaveStub: AutomaticSaveService;

    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        let pixels: ImageData = new ImageData(10, 10);
        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        paintBucketStub = new PaintBucketService(drawingStub, colorStub, undoRedoStub, autoSaveStub);
        paintBucketActionStub = new PaintBucketAction(pixels, drawingStub);
        canvas = canvasTestHelper.canvas;
        canvas.width = 100;
        canvas.height = 100;
        baseStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawingStub.canvas = canvas;
        drawingStub.baseCtx = baseStub;
        drawingStub.previewCtx = previewStub;

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: ColorService, useValue: colorStub },
                { provide: UndoRedoService, useValue: undoRedoStub },
                { provide: PaintBucketService, useValue: paintBucketStub },
                { provide: PaintBucketAction, useValue: paintBucketActionStub },
            ],
        });
        paintBucketActionStub = TestBed.inject(PaintBucketAction);
        paintBucketStub = TestBed.inject(PaintBucketService);
    });

    it('should call putImageData', () => {
        const putImageSpy = spyOn(baseStub, 'putImageData').and.stub();
        paintBucketActionStub.apply();
        expect(putImageSpy).toHaveBeenCalled();
    });
});
