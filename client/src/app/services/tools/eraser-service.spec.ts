import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/classes/mouse-button';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserService } from '@app/services/tools/eraser-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// tslint:disable:no-any
describe('EraserService', () => {
    let service: EraserService;
    let undoRedoStub: UndoRedoService;
    let drawingStub: DrawingService;

    let mouseEvent: MouseEvent;
    let mouseEvent1: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let removeLineSpy: jasmine.Spy<any>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        drawingStub = new DrawingService();
        undoRedoStub = new UndoRedoService(drawingStub);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: UndoRedoService, useValue: undoRedoStub },
            ],
        });
        service = TestBed.inject(EraserService);
        removeLineSpy = spyOn<any>(service, 'removeLine').and.callThrough();
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 10,
            offsetY: 25,
            button: MouseButton.Left,
        } as MouseEvent;
        mouseEvent1 = {
            offsetX: 8,
            offsetY: 35,
            button: MouseButton.Left,
        } as MouseEvent;
    });

    it('should be created', inject([EraserService], (serviceEr: EraserService) => {
        expect(serviceEr).toBeTruthy();
    }));

    it(' mouseDown should set mouseDownCoords to correct position', () => {
        const expectedResult: Vec2 = { x: 10, y: 25 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoords).toEqual(expectedResult);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 8,
            offsetY: 35,
            button: MouseButton.Middle,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should not call eraseLine if mouse was already down', () => {
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(removeLineSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp should call eraseLine if mouse was already down', () => {
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseMove(mouseEvent1);
        service.onMouseUp(mouseEvent);
        expect(removeLineSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should call eraseLine if mouse was already down', () => {
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = true;
        service.mouseMove = true;
        service.onMouseUp(mouseEvent);
        expect(removeLineSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawLine if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoords = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(removeLineSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawLine if mouse was already down', () => {
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(removeLineSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call drawLine if mouse was not already down', () => {
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(removeLineSpy).not.toHaveBeenCalled();
    });
});
