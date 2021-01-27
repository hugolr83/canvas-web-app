import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { StampService } from '@app/services/tools/stamp.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { StampAction } from './stamp-action';

// tslint:disable:no-magic-numbers
describe('StampAction', () => {
    let stampAction: StampAction;
    let drawingStub: DrawingService;
    let stampStub: StampService;
    let undoRedoStub: UndoRedoService;

    let image: HTMLImageElement;
    let mouseCenterX: number;
    let mouseCenterY: number;

    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        mouseCenterX = 100;
        mouseCenterY = 100;

        image = new Image();

        drawingStub = new DrawingService();
        stampStub = new StampService(drawingStub, undoRedoStub);
        undoRedoStub = new UndoRedoService(drawingStub);

        stampAction = new StampAction(image, mouseCenterX, mouseCenterY, drawingStub, stampStub);

        canvas = canvasTestHelper.canvas;
        // tslint:disable:no-magic-numbers
        canvas.width = 100;
        // tslint:disable:no-magic-numbers
        canvas.height = 100;

        baseStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        drawingStub.canvas = canvas;
        drawingStub.baseCtx = baseStub;
        drawingStub.previewCtx = previewStub;

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: StampService, useValue: stampStub },
                { provide: UndoRedoService, useValue: undoRedoStub },
                { provide: StampAction, useValue: stampAction },
            ],
        });
        stampAction = TestBed.inject(StampAction);
        drawingStub = TestBed.inject(DrawingService);
        stampStub = TestBed.inject(StampService);
    });

    it('should call saveCanvas', () => {
        const saveCanvasSpy = spyOn(stampStub, 'saveCanvas').and.stub();
        stampAction.apply();
        expect(saveCanvasSpy).toHaveBeenCalled();
    });
});
