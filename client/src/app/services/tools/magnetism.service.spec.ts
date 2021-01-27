/* tslint:disable:no-unused-variable */
/* tslint:disable: no-string-literal */
/* tslint:disable: no-any */

import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ControlGroup } from '@app/classes/control-group';
import { ControlPointName } from '@app/classes/control-points';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from './grid.service';
import { MagnetismParams, MagnetismService } from './magnetism.service';

let service: MagnetismService;

let gridStub: GridService;
let drawingStub: DrawingService;

let baseCtxStub: CanvasRenderingContext2D;
let previewCtxStub: CanvasRenderingContext2D;

let adjustedPosition: Vec2;
let selectionSize: Vec2;

describe('Service: Magnetism', () => {
    beforeEach(() => {
        drawingStub = new DrawingService();
        gridStub = new GridService(drawingStub);

        TestBed.configureTestingModule({
            providers: [{ provide: GridService, useValue: gridStub }],
        });
        service = TestBed.inject(MagnetismService);

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        const gridCanvas = document.createElement('canvas');
        const largeCanvasSize = 1000;
        gridCanvas.width = largeCanvasSize;
        gridCanvas.height = largeCanvasSize;

        const gridCtxStub = gridCanvas.getContext('2d') as CanvasRenderingContext2D;

        drawingStub['canvas'] = canvasTestHelper.canvas;
        drawingStub['gridCanvas'] = gridCanvas;

        drawingStub['baseCtx'] = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        drawingStub['previewCtx'] = previewCtxStub;
        drawingStub['gridCtx'] = gridCtxStub;

        adjustedPosition = { x: 200, y: 200 } as Vec2;
        selectionSize = { x: 50, y: 50 } as Vec2;
    });

    it('should magnetismService exist', () => {
        expect(service).toBeTruthy();
    });

    it('should reset magnetism', () => {
        const spy = spyOn(service, 'resetMagnetism').and.callThrough();
        service.resetMagnetism();
        expect(spy).toHaveBeenCalled();
    });

    it('should convert to position center', () => {
        const spy = spyOn<any>(service, 'convertCalculatingPosition').and.callThrough();
        const returnValue = service['convertCalculatingPosition'](adjustedPosition, ControlPointName.center, selectionSize);
        expect(spy).toHaveBeenCalled();
        expect(returnValue).toEqual({ x: 175, y: 175 } as Vec2);
    });

    it('should convert to position top left', () => {
        const spy = spyOn<any>(service, 'convertCalculatingPosition').and.callThrough();
        const returnValue = service['convertCalculatingPosition'](adjustedPosition, ControlPointName.topLeft, selectionSize);
        expect(spy).toHaveBeenCalled();
        expect(returnValue).toEqual({ x: 200, y: 200 } as Vec2);
    });

    it('should convert to position top', () => {
        const spy = spyOn<any>(service, 'convertCalculatingPosition').and.callThrough();
        const returnValue = service['convertCalculatingPosition'](adjustedPosition, ControlPointName.top, selectionSize);
        expect(spy).toHaveBeenCalled();
        expect(returnValue).toEqual({ x: 175, y: 200 } as Vec2);
    });

    it('should convert to position top right', () => {
        const spy = spyOn<any>(service, 'convertCalculatingPosition').and.callThrough();
        const returnValue = service['convertCalculatingPosition'](adjustedPosition, ControlPointName.topRight, selectionSize);
        expect(spy).toHaveBeenCalled();
        expect(returnValue).toEqual({ x: 150, y: 200 } as Vec2);
    });

    it('should convert to position left', () => {
        const spy = spyOn<any>(service, 'convertCalculatingPosition').and.callThrough();
        const returnValue = service['convertCalculatingPosition'](adjustedPosition, ControlPointName.left, selectionSize);
        expect(spy).toHaveBeenCalled();
        expect(returnValue).toEqual({ x: 200, y: 175 } as Vec2);
    });

    it('should convert to position right', () => {
        const spy = spyOn<any>(service, 'convertCalculatingPosition').and.callThrough();
        const returnValue = service['convertCalculatingPosition'](adjustedPosition, ControlPointName.right, selectionSize);
        expect(spy).toHaveBeenCalled();
        expect(returnValue).toEqual({ x: 150, y: 175 } as Vec2);
    });

    it('should convert to position bottom left', () => {
        const spy = spyOn<any>(service, 'convertCalculatingPosition').and.callThrough();
        const returnValue = service['convertCalculatingPosition'](adjustedPosition, ControlPointName.bottomLeft, selectionSize);
        expect(spy).toHaveBeenCalled();
        expect(returnValue).toEqual({ x: 150, y: 150 } as Vec2);
    });

    it('should convert to position bottom', () => {
        const spy = spyOn<any>(service, 'convertCalculatingPosition').and.callThrough();
        const returnValue = service['convertCalculatingPosition'](adjustedPosition, ControlPointName.bottom, selectionSize);
        expect(spy).toHaveBeenCalled();
        expect(returnValue).toEqual({ x: 175, y: 150 } as Vec2);
    });

    it('should convert to position bottom right', () => {
        const spy = spyOn<any>(service, 'convertCalculatingPosition').and.callThrough();
        const returnValue = service['convertCalculatingPosition'](adjustedPosition, ControlPointName.bottomRight, selectionSize);
        expect(spy).toHaveBeenCalled();
        expect(returnValue).toEqual({ x: 200, y: 150 } as Vec2);
    });

    it('should convert to position NONE', () => {
        const spy = spyOn<any>(service, 'convertCalculatingPosition').and.callThrough();
        const returnValue = service['convertCalculatingPosition'](adjustedPosition, ControlPointName.none, selectionSize);
        expect(spy).toHaveBeenCalled();
        expect(returnValue).toEqual({} as Vec2);
    });

    it('should calculate remainder when position is below half and equal of the squareWidth', () => {
        const squareWidth = 100;
        const calculatingPosition = { x: 500, y: 500 } as Vec2;
        const spy = spyOn<any>(service, 'calculateRemainder').and.callThrough();
        service['calculateRemainder'](squareWidth, calculatingPosition);
        expect(spy).toHaveBeenCalled();
        expect(service['adjustedPosition']).toEqual({ x: 500, y: 500 } as Vec2);
    });

    it('should calculate remainder when position is above the squareWidth', () => {
        const squareWidth = 100;
        const calculatingPosition = { x: 555, y: 555 } as Vec2;
        const spy = spyOn<any>(service, 'calculateRemainder').and.callThrough();
        service['calculateRemainder'](squareWidth, calculatingPosition);
        expect(spy).toHaveBeenCalled();
        expect(service['adjustedPosition']).toEqual({ x: 600, y: 600 } as Vec2);
    });

    it('should apply final position for selectionService', () => {
        service['adjustedPosition'] = { x: 50, y: 50 } as Vec2;
        const params = {
            imagePosition: { x: 100, y: 100 } as Vec2,
            endingPosition: { x: 300, y: 300 } as Vec2,
            controlGroup: {} as ControlGroup,
            selectionSize: { x: 200, y: 200 } as Vec2,
        } as MagnetismParams;
        const spy = spyOn<any>(service, 'applyFinalPosition').and.callThrough();
        service['applyFinalPosition'](params);
        expect(spy).toHaveBeenCalled();
    });

    it('should NOT apply magnetism on mouse move', () => {
        service.isMagnetismActive = false;
        service['isMouseMagnetValueSet'] = false;
        const params = {
            imagePosition: { x: 100, y: 100 } as Vec2,
            endingPosition: { x: 300, y: 300 } as Vec2,
            controlGroup: {} as ControlGroup,
            selectionSize: { x: 200, y: 200 } as Vec2,
        } as MagnetismParams;
        const spy = spyOn(service, 'applyMagnetismMouseMove').and.callThrough();
        service.applyMagnetismMouseMove(params);
        expect(spy).toHaveBeenCalled();
    });

    it('should apply magnetism on mouse move first time', () => {
        service.isMagnetismActive = true;
        service['isMouseMagnetValueSet'] = false;

        const controlGroup = new ControlGroup(drawingStub);
        controlGroup.setPositions({ x: 100, y: 100 }, { x: 300, y: 300 }, { x: 200, y: 200 });
        controlGroup['controlPointName'] = ControlPointName.topLeft;

        const params = {
            imagePosition: { x: 100, y: 100 } as Vec2,
            endingPosition: { x: 300, y: 300 } as Vec2,
            controlGroup: controlGroup as ControlGroup,
            selectionSize: { x: 200, y: 200 } as Vec2,
        } as MagnetismParams;
        const spy = spyOn(service, 'applyMagnetismMouseMove').and.callThrough();
        service.applyMagnetismMouseMove(params);
        expect(spy).toHaveBeenCalled();
    });

    it('should apply magnetism on mouse move second time', () => {
        service.isMagnetismActive = true;
        service['isMouseMagnetValueSet'] = true;

        const controlGroup = new ControlGroup(drawingStub);
        controlGroup.setPositions({ x: 100, y: 100 }, { x: 300, y: 300 }, { x: 200, y: 200 });
        controlGroup['controlPointName'] = ControlPointName.topLeft;

        const params = {
            imagePosition: { x: 100, y: 100 } as Vec2,
            endingPosition: { x: 300, y: 300 } as Vec2,
            controlGroup: controlGroup as ControlGroup,
            selectionSize: { x: 200, y: 200 } as Vec2,
        } as MagnetismParams;
        const spy = spyOn(service, 'applyMagnetismMouseMove').and.callThrough();
        service.applyMagnetismMouseMove(params);
        expect(spy).toHaveBeenCalled();
    });

    it('should NOT apply magnetism on arrow key', () => {
        service.isMagnetismActive = false;
        service['isMouseMagnetValueSet'] = true;

        const controlGroup = new ControlGroup(drawingStub);
        controlGroup.setPositions({ x: 100, y: 100 }, { x: 300, y: 300 }, { x: 200, y: 200 });
        controlGroup['controlPointName'] = ControlPointName.topLeft;

        const params = {
            imagePosition: { x: 100, y: 100 } as Vec2,
            endingPosition: { x: 300, y: 300 } as Vec2,
            controlGroup: controlGroup as ControlGroup,
            selectionSize: { x: 200, y: 200 } as Vec2,
        } as MagnetismParams;

        const spy = spyOn(service, 'applyMagnetismArrowKey').and.callThrough();
        service.applyMagnetismArrowKey(params, { x: 1, y: 0 } as Vec2);
        expect(spy).toHaveBeenCalled();
    });

    it('should apply magnetism on arrow key first time', () => {
        service.isMagnetismActive = true;
        service['isFirstTimeArrow'] = true;

        const controlGroup = new ControlGroup(drawingStub);
        controlGroup.setPositions({ x: 100, y: 100 }, { x: 300, y: 300 }, { x: 200, y: 200 });
        controlGroup['controlPointName'] = ControlPointName.topLeft;

        const params = {
            imagePosition: { x: 100, y: 100 } as Vec2,
            endingPosition: { x: 300, y: 300 } as Vec2,
            controlGroup: controlGroup as ControlGroup,
            selectionSize: { x: 200, y: 200 } as Vec2,
        } as MagnetismParams;

        const spy = spyOn(service, 'applyMagnetismArrowKey').and.callThrough();
        service.applyMagnetismArrowKey(params, { x: 1, y: 0 } as Vec2);
        expect(spy).toHaveBeenCalled();
    });

    it('should apply magnetism on arrow key second time', () => {
        service.isMagnetismActive = true;
        service['prevControlPointName'] = ControlPointName.topLeft;
        service['isFirstTimeArrow'] = false;

        const controlGroup = new ControlGroup(drawingStub);
        controlGroup.setPositions({ x: 100, y: 100 }, { x: 300, y: 300 }, { x: 200, y: 200 });
        controlGroup['controlPointName'] = ControlPointName.topLeft;

        const params = {
            imagePosition: { x: 100, y: 100 } as Vec2,
            endingPosition: { x: 300, y: 300 } as Vec2,
            controlGroup: controlGroup as ControlGroup,
            selectionSize: { x: 200, y: 200 } as Vec2,
        } as MagnetismParams;

        const spy = spyOn(service, 'applyMagnetismArrowKey').and.callThrough();
        service.applyMagnetismArrowKey(params, { x: 1, y: 0 } as Vec2);
        expect(spy).toHaveBeenCalled();
    });
});
