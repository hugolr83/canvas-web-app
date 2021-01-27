/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/classes/mouse-button';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { CanvasResizeService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { FeatherService } from '@app/services/tools/feather.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { GridService } from './grid.service';

// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal

describe('Service: Feather', () => {
    let featherStub: FeatherService;
    let drawingStub: DrawingService;
    let colorStub: ColorService;
    let undoRedoStub: UndoRedoService;
    let gridStub: GridService;
    let automaticSaveStub: AutomaticSaveService;
    let canvasResizeStub: CanvasResizeService;
    let mouseEvent: MouseEvent;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    let featherStubCtx: CanvasRenderingContext2D;
    let lineCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        automaticSaveStub = new AutomaticSaveService(canvasResizeStub, drawingStub, undoRedoStub);
        featherStub = new FeatherService(drawingStub, colorStub, undoRedoStub, automaticSaveStub);
        gridStub = new GridService(drawingStub);
        canvasResizeStub = new CanvasResizeService(gridStub, undoRedoStub);
        featherStub = new FeatherService(drawingStub, colorStub, undoRedoStub, automaticSaveStub);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        featherStubCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        lineCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        canvas = canvasTestHelper.canvas;
        canvas.width = 100;
        canvas.height = 100;
        drawingStub.canvas = canvas;

        featherStub['drawingService'].cursorCtx = featherStubCtx;
        drawingStub.cursorCtx = lineCtxStub;

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: AutomaticSaveService, useValue: automaticSaveStub },
                { provide: ColorService, useValue: colorStub },
                { provide: FeatherService, useValue: featherStub },
                { provide: CanvasResizeService, useValue: canvasResizeStub },
                { provide: UndoRedoService, useValue: undoRedoStub },
            ],
        });

        featherStub = TestBed.inject(FeatherService);
        featherStub['drawingService'].baseCtx = baseCtxStub;
        featherStub['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 10,
            offsetY: 25,
            button: MouseButton.Left,
        } as MouseEvent;
    });

    it('should create', () => {
        expect(featherStub).toBeTruthy();
    });

    it(' mouseDown should set mouseDownCoords to correct position', () => {
        const expectedResult: Vec2 = { x: 10, y: 25 };
        featherStub.onMouseDown(mouseEvent);
        expect(featherStub.mouseDownCoords).toEqual(expectedResult);
    });

    it(' mouseDown should set mouseDown property to true on left click and right click', () => {
        featherStub.onMouseDown(mouseEvent);
        expect(featherStub.mouseDown).toEqual(true);
    });

    it(' onMouseUp should call drawFeather if mouse was already down', () => {
        featherStub.mouseDownCoords = { x: 0, y: 0 };
        featherStub.mouseDown = true;
        const drawFeatherSpy = spyOn(featherStub, 'drawFeather').and.callThrough();
        featherStub.onMouseUp(mouseEvent);
        expect(drawFeatherSpy).toHaveBeenCalled();
    });

    it('on mouseMove should call renderCursor', () => {
        const renderCursorSpy = spyOn(featherStub, 'renderCursor').and.stub();
        featherStub.onMouseMove(mouseEvent);
        expect(renderCursorSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call clearPreviewCtx when moving mouse', () => {
        featherStub.mouseDown = true;
        const clearPreviewCtxSpy = spyOn(featherStub, 'clearPreviewCtx').and.stub();
        featherStub.onMouseMove(mouseEvent);
        expect(clearPreviewCtxSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call drawFeather when moving mouse', () => {
        featherStub.mouseDown = true;
        const drawFeatherCtxSpy = spyOn(featherStub, 'drawFeather').and.stub();
        featherStub.onMouseMove(mouseEvent);
        expect(drawFeatherCtxSpy).toHaveBeenCalled();
    });

    it('should change display style of cursor when onMouseOut', () => {
        drawingStub.cursorCtx.canvas.style.display = 'none';
        featherStub.onMouseOut(mouseEvent);
        expect(drawingStub.cursorCtx.canvas.style.display).toEqual('none');
    });

    it('should change display style of cursor when onMouseEnter', () => {
        drawingStub.cursorCtx.canvas.style.display = 'inline-block';
        featherStub.onMouseEnter(mouseEvent);
        expect(drawingStub.cursorCtx.canvas.style.display).toEqual('inline-block');
    });

    it('should change the angle of attribute featherAngle and retract 15 degree of that value', () => {
        featherStub.featherAngle = 15;
        featherStub.altPressed = false;
        featherStub.isWheelAdd = false;
        featherStub.changeAngleWithScroll();
        expect(featherStub.featherAngle).toEqual(0);
    });

    it('should change the angle of attribute featherAngle and retract 1 of  that value', () => {
        featherStub.featherAngle = 2;
        featherStub.altPressed = true;
        featherStub.isWheelAdd = false;
        featherStub.changeAngleWithScroll();
        expect(featherStub.featherAngle).toEqual(1);
    });

    it('should change the angle of attribute featherAngle and add 15 degree of that value', () => {
        featherStub.featherAngle = 0;
        featherStub.altPressed = false;
        featherStub.isWheelAdd = true;
        featherStub.changeAngleWithScroll();
        expect(featherStub.featherAngle).toEqual(15);
    });

    it('should change the angle of attribute featherAngle and add 1 of  that value', () => {
        featherStub.featherAngle = 0;
        featherStub.altPressed = true;
        featherStub.isWheelAdd = true;
        featherStub.changeAngleWithScroll();
        expect(featherStub.featherAngle).toEqual(1);
    });
});
