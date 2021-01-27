/* tslint:disable:no-unused-variable */
import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/classes/mouse-button';
import { RGBA } from '@app/classes/rgba';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PaintBucketService } from '@app/services/tools/paint-bucket.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:prefer-const

describe('Service: PaintBucket', () => {
    let colorService: ColorService;
    let paintBucketService: PaintBucketService;

    let drawingService: DrawingService;
    let undoRedoService: UndoRedoService;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    let mouseEventTest: MouseEvent;
    let hexToRGBASpy: jasmine.Spy<any>;
    let matchFillColorSpy: jasmine.Spy<any>;
    let floodFillSpy: jasmine.Spy<any>;
    let paintAllSimilarSpy: jasmine.Spy<any>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        drawingService = new DrawingService();

        drawingService.canvas = canvasTestHelper.canvas;
        drawingService.baseCtx = baseCtxStub;

        undoRedoService = new UndoRedoService(drawingService);
        colorService = new ColorService(drawingService);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingService },
                { provide: ColorService, useValue: colorService },
                { provide: UndoRedoService, useValue: undoRedoService },
            ],
        });
        paintBucketService = TestBed.inject(PaintBucketService);
        mouseEventTest = { x: 25, y: 25, button: MouseButton.Left } as MouseEvent;
        // tslint:disable:no-string-literal
        paintBucketService['drawingService'].baseCtx = baseCtxStub; // Jasmine doesn't copy properties with underlying data
        paintBucketService['drawingService'].previewCtx = previewCtxStub;
        // spy for private methods
        hexToRGBASpy = spyOn<any>(paintBucketService, 'hexToRGBA').and.callThrough();
        matchFillColorSpy = spyOn<any>(paintBucketService, 'matchFillColor').and.callThrough();
        floodFillSpy = spyOn<any>(paintBucketService, 'floodFill').and.callThrough();
    });

    it('should be created', () => {
        expect(paintBucketService).toBeTruthy();
    });

    it('should onMouseUp', () => {
        const spy = spyOn<any>(paintBucketService, 'onMouseUp').and.callThrough();
        paintBucketService.onMouseUp({} as MouseEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should call floodFill', () => {
        const mouseDownPos: Vec2 = { x: 10, y: 10 } as Vec2;
        paintBucketService['floodFill'](mouseDownPos.x, mouseDownPos.y, { red: 0, green: 0, blue: 0, alpha: 1 });
        expect(floodFillSpy).toHaveBeenCalled();
    });

    it('should call matchFillColor', () => {
        paintBucketService['matchFillColor']({ red: 0, green: 0, blue: 0, alpha: 1 }, { red: 0, green: 0, blue: 0, alpha: 1 });
        expect(matchFillColorSpy).toHaveBeenCalled();
    });

    it('should call hexToRGBA', () => {
        paintBucketService['hexToRGBA']('#000000');
        expect(hexToRGBASpy).toHaveBeenCalled();
    });

    it('should call paintAllSimilar', () => {
        drawingService.canvas.width = 100;
        drawingService.canvas.height = 100;
        paintAllSimilarSpy = spyOn<any>(paintBucketService, 'paintAllSimilar').and.callThrough();
        paintBucketService['paintAllSimilar'](mouseEventTest.x, mouseEventTest.y, { red: 0, green: 0, blue: 0, alpha: 1 });
        expect(paintAllSimilarSpy).toHaveBeenCalled();
    });

    it('should call toleranceToRGBASpy MIN_TOLERANCE', () => {
        paintBucketService.tolerance = 0;
        const toleranceToRGBASpy = spyOn<any>(paintBucketService, 'toleranceToRGBA').and.callThrough();
        paintBucketService['toleranceToRGBA']();
        expect(toleranceToRGBASpy).toHaveBeenCalled();
    });

    it('should call toleranceToRGBASpy MAX_TOLERANCE', () => {
        paintBucketService.tolerance = 255;
        const toleranceToRGBASpy = spyOn<any>(paintBucketService, 'toleranceToRGBA').and.callThrough();
        paintBucketService['toleranceToRGBA']();
        expect(toleranceToRGBASpy).toHaveBeenCalled();
    });

    it('should call toleranceToRGBASpy other', () => {
        paintBucketService.tolerance = 100;
        const toleranceToRGBASpy = spyOn<any>(paintBucketService, 'toleranceToRGBA').and.callThrough();
        paintBucketService['toleranceToRGBA']();
        expect(toleranceToRGBASpy).toHaveBeenCalled();
    });

    it(' mouseDown should call floodFill on left click', () => {
        const mouseEventLeftClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
        } as MouseEvent;
        paintBucketService.onMouseDown(mouseEventLeftClick);
        expect(floodFillSpy).toHaveBeenCalled();
    });

    it(' mouseDown should call paintAllSimilar on right click', () => {
        paintAllSimilarSpy = spyOn<any>(paintBucketService, 'paintAllSimilar').and.callThrough();
        const mouseEventRightClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Right,
        } as MouseEvent;
        paintBucketService.onMouseDown(mouseEventRightClick);
        expect(paintAllSimilarSpy).toHaveBeenCalled();
    });

    it(' should floodFill a lake of something if clicked on the left edge', () => {
        drawingService.canvas.width = 100;
        drawingService.canvas.height = 100;
        drawingService.clearCanvas(baseCtxStub);
        baseCtxStub.fillStyle = colorService.primaryColor;
        baseCtxStub.fillRect(100, 100, 0, 0);
        const mouseDownPos = { x: 0, y: 0 } as Vec2;
        paintBucketService['floodFill'](mouseDownPos.x, mouseDownPos.y, { red: 10, green: 10, blue: 10, alpha: 1 } as RGBA);
        expect(floodFillSpy).toHaveBeenCalled();
    });

    it(' should floodFill a lake of something if clicked on the right edge', () => {
        drawingService.canvas.width = 100;
        drawingService.canvas.height = 100;
        drawingService.clearCanvas(baseCtxStub);
        baseCtxStub.fillStyle = colorService.primaryColor;
        baseCtxStub.fillRect(100, 100, 0, 0);
        const mouseDownPos = { x: 100, y: 100 } as Vec2;
        paintBucketService['floodFill'](mouseDownPos.x, mouseDownPos.y, { red: 10, green: 10, blue: 10, alpha: 1 } as RGBA);
        expect(floodFillSpy).toHaveBeenCalled();
    });

    it(' should floodFill a lake of something if clicked in the middle', () => {
        drawingService.canvas.width = 100;
        drawingService.canvas.height = 100;
        drawingService.clearCanvas(baseCtxStub);
        baseCtxStub.fillStyle = colorService.primaryColor;
        baseCtxStub.fillRect(100, 100, 0, 0);
        const mouseDownPos = { x: 10, y: 10 } as Vec2;
        paintBucketService['floodFill'](mouseDownPos.x, mouseDownPos.y, { red: 10, green: 10, blue: 10, alpha: 1 } as RGBA);
        expect(floodFillSpy).toHaveBeenCalled();
    });
});
