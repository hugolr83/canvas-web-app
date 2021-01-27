import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { EventOfTest } from '@app/classes/event-of-test';
import { SubToolSelected } from '@app/classes/sub-tool-selected';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from '@app/services/tools/line.service';

// tslint:disable:no-any
// tslint:disable:max-line-length
// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal
describe('Service: Line', () => {
    let service: LineService;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let pathData: Vec2[];
    let drawLineLastPointSpy: jasmine.Spy<any>;
    let mergeFirstPointSpy: jasmine.Spy<any>;
    let drawLineSpy: jasmine.Spy<any>;
    let shiftDrawAngleLineSpy: jasmine.Spy<any>;
    let clearPathSpy: jasmine.Spy<any>;
    let events: EventOfTest;

    let drawPointSpy: jasmine.Spy<any>;
    const sizeCanvas = 100;
    let ctx: CanvasRenderingContext2D;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        baseCtxStub.lineWidth = 2;
        previewCtxStub.lineWidth = 2;
        baseCtxStub.strokeStyle = '#000000';
        previewCtxStub.strokeStyle = '#000000';
        ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, sizeCanvas, sizeCanvas);
        baseCtxStub.putImageData(ctx.getImageData(0, 0, sizeCanvas, sizeCanvas), 0, 0);
        previewCtxStub.putImageData(ctx.getImageData(0, 0, sizeCanvas, sizeCanvas), 0, 0);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(LineService);
        drawLineLastPointSpy = spyOn<any>(service, 'drawLineLastPoint').and.callThrough();
        mergeFirstPointSpy = spyOn<any>(service, 'mergeFirstPoint').and.callThrough();
        drawPointSpy = spyOn<any>(service, 'drawPoint').and.callThrough();
        drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();
        shiftDrawAngleLineSpy = spyOn<any>(service, 'shiftDrawAngleLine').and.callThrough();
        clearPathSpy = spyOn<any>(service, 'clearPath').and.callThrough();
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service.subToolSelect = SubToolSelected.tool1;
        pathData = [];
        events = new EventOfTest();

        baseCtxStub.fillStyle = '#000000'; // make sure everything is black
    });

    it('should create', inject([LineService], (serviceRec: LineService) => {
        expect(serviceRec).toBeTruthy();
    }));

    it('one point function mergeFirstPoint if true', () => {
        pathData.push({ x: 25, y: 10 });
        const boolFunction = mergeFirstPointSpy(pathData);
        expect(boolFunction).toEqual(true);
    });
    it('two point function mergeFirstPoint if true', () => {
        pathData.push({ x: 25, y: 10 });
        pathData.push({ x: 45, y: 30 });
        const boolFunction = mergeFirstPointSpy(pathData);
        expect(boolFunction).toEqual(true);
    });
    it('two point function mergeFirstPoint if false', () => {
        pathData.push({ x: 25, y: 10 });
        pathData.push({ x: 46, y: 31 });
        const boolFunction = mergeFirstPointSpy(pathData);
        expect(boolFunction).toEqual(false);
    });
    it('trois point function mergeFirstPoint if true', () => {
        pathData.push({ x: 25, y: 10 });
        pathData.push({ x: 250, y: 100 });
        pathData.push({ x: 45, y: 30 });
        const boolFunction = mergeFirstPointSpy(pathData);
        expect(boolFunction).toEqual(true);
    });
    it('trois point function mergeFirstPoint if false', () => {
        pathData.push({ x: 25, y: 10 });
        pathData.push({ x: 250, y: 100 });
        pathData.push({ x: 46, y: 31 });
        const boolFunction = mergeFirstPointSpy(pathData);
        expect(boolFunction).toEqual(false);
    });
    it('trois point function mergeFirstPoint if x false ', () => {
        pathData.push({ x: 25, y: 10 });
        pathData.push({ x: 250, y: 100 });
        pathData.push({ x: 46, y: 30 });
        const boolFunction = mergeFirstPointSpy(pathData);
        expect(boolFunction).toEqual(false);
    });
    it('trois point function mergeFirstPoint if y false ', () => {
        pathData.push({ x: 25, y: 10 });
        pathData.push({ x: 250, y: 100 });
        pathData.push({ x: 45, y: 31 });
        const boolFunction = mergeFirstPointSpy(pathData);
        expect(boolFunction).toEqual(false);
    });
    it(' onMouseMove should call drawLine if mouse was already down', () => {
        service.subToolSelect = SubToolSelected.tool1;
        service.onMouseDown(events.mouseEvent1);
        service.onMouseMove(events.mouseEvent);

        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineLastPointSpy).toHaveBeenCalled();
    });
    it(' onMouseMove should call drawLine if mouse was already down', () => {
        service.subToolSelect = SubToolSelected.tool2;
        service.onMouseDown(events.mouseEvent1);

        service.onMouseMove(events.mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineLastPointSpy).toHaveBeenCalled();
    });
    it(' onMouseMove should not call draPoint if mouse was not already down', () => {
        service.subToolSelect = SubToolSelected.tool1;
        service.onMouseDown(events.mouseEvent1);

        service.onMouseMove(events.mouseEvent);
        expect(drawPointSpy).not.toHaveBeenCalled();
    });
    it(' onMouseMove should call drawPoint if mouse was already down', () => {
        service.subToolSelect = SubToolSelected.tool2;
        service.onMouseDown(events.mouseEvent1);

        service.onMouseMove(events.mouseEvent);
        expect(drawPointSpy).toHaveBeenCalled();
    });
    it('doubleClick', () => {
        service.onMouseDown(events.mouseEvent);
        service.onDoubleClick(events.mouseEvent1);
        expect(drawLineSpy).toHaveBeenCalled();
    });
    it('ShiftDrawAngleLine of 0 ', () => {
        pathData.push({ x: 0, y: 0 });
        const vec2 = shiftDrawAngleLineSpy(pathData, { x: 0, y: 0 });
        expect(vec2).toEqual({ x: 0, y: 0 });
    });
    it('ShiftDrawAngleLine of 0 ', () => {
        pathData.push({ x: 50, y: 40 });
        pathData.push({ x: 0, y: 0 });
        const vec2 = shiftDrawAngleLineSpy(pathData, { x: 0, y: 0 });
        expect(vec2).toEqual({ x: 0, y: 0 });
    });
    it('ShiftDrawAngleLine of angle 135 ', () => {
        pathData.push({ x: 50, y: 50 });
        const vec2 = shiftDrawAngleLineSpy(pathData, { x: 0, y: 0 });

        expect(vec2).toEqual({ x: 0, y: 0 });
    });
    it('ShiftDrawAngleLine of angle 45 ', () => {
        pathData.push({ x: 50, y: 50 });
        const vec2 = shiftDrawAngleLineSpy(pathData, { x: 100, y: 0 });
        expect(vec2).toEqual({ x: 100, y: 0 });
    });
    it('ShiftDrawAngleLine of angle 180 ', () => {
        pathData.push({ x: 50, y: 50 });
        const vec2 = shiftDrawAngleLineSpy(pathData, { x: 0, y: 50 });
        expect(vec2).toEqual({ x: 0, y: 50 });
    });
    it('ShiftDrawAngleLine of angle 0 ', () => {
        pathData.push({ x: 50, y: 50 });
        const vec2 = shiftDrawAngleLineSpy(pathData, { x: 100, y: 50 });
        expect(vec2).toEqual({ x: 100, y: 50 });
    });
    it('ShiftDrawAngleLine of angle 270 ', () => {
        pathData.push({ x: 50, y: 50 });
        const vec2 = shiftDrawAngleLineSpy(pathData, { x: 50, y: 100 });
        expect(vec2).toEqual({ x: 50, y: 100 });
    });
    it('ShiftDrawAngleLine of angle 225 ', () => {
        pathData.push({ x: 50, y: 50 });
        const vec2 = shiftDrawAngleLineSpy(pathData, { x: 100, y: 0 });
        expect(vec2).toEqual({ x: 100, y: 0 });
    });
    it('ShiftDrawAngleLine of angle 315 ', () => {
        pathData.push({ x: 50, y: 50 });
        const vec2 = shiftDrawAngleLineSpy(pathData, { x: 100, y: 100 });
        expect(vec2).toEqual({ x: 100, y: 100 });
    });
    it('ShiftDrawAngleLine of angle 90 ', () => {
        pathData.push({ x: 50, y: 50 });
        const vec2 = shiftDrawAngleLineSpy(pathData, { x: 50, y: 0 });
        expect(vec2).toEqual({ x: 50, y: 0 });
    });

    it('onMouseDown function', () => {
        service.onMouseDown(events.mouseEvent1);
        expect(drawLineSpy).toHaveBeenCalled();
        service.onMouseDown(events.mouseEvent2);
        expect(drawLineSpy).toHaveBeenCalled();
        service.onDoubleClick(events.mouseEvent);
        expect(mergeFirstPointSpy).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
        expect(clearPathSpy).toHaveBeenCalled();
    });

    it('onMouseUp should not call drawLineLastPointSpy function ', () => {
        service.onMouseUp(events.mouseEvent2);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });
    it('onKeyEscape should not call clearPath', () => {
        service.onKeyEscape(events.backSpaceEvent);
        expect(clearPathSpy).not.toHaveBeenCalled();
    });
    it('onKeyEscape should call clearPath', () => {
        service.onMouseDown(events.mouseEvent);
        service.onKeyEscape(events.backSpaceEvent);
        expect(clearPathSpy).toHaveBeenCalled();
    });
    it('onMouseDown, onMouseMove, onShiftKeyDown, onMouseMove of brush line in canvas', () => {
        service['pointShiftMemory'] = { x: 0, y: 0 };
        service.onMouseDown(events.mouseEvent1);
        service.onMouseMove(events.mouseEvent2);
        service.onShiftKeyDown(events.backSpaceEvent);
        service.onMouseMove(events.mouseEvent3);
        expect(service['pointShiftMemory']).not.toEqual({ x: 0, y: 0 });
    });
    it('onMouseDown, onMouseMove, onShiftKeyDown and onMouseMove onShiftKeyUp and not brush line in de canvas in position of OnShiftKeyDown', () => {
        service.onMouseDown(events.mouseEvent1);
        service.onMouseMove(events.mouseEvent2);
        service.onShiftKeyDown(events.backSpaceEvent);
        service.onMouseMove(events.mouseEvent3);
        service.onShiftKeyUp(events.backSpaceEvent);
        service.onDoubleClick(events.mouseEvent3);
        expect(shiftDrawAngleLineSpy).toHaveBeenCalled();
    });
    it('onMouseDown, onMouseMove, onShiftKeyDown, onMouseDown and onShiftKeyUp and brush line in de canvas in position ', () => {
        service.onMouseDown(events.mouseEvent1);
        service.onMouseMove(events.mouseEvent2);
        service.onShiftKeyDown(events.backSpaceEvent);
        service.onMouseDown(events.mouseEvent1);
        service.onShiftKeyUp(events.backSpaceEvent);
        service.onDoubleClick(events.mouseEvent1);
        expect(shiftDrawAngleLineSpy).toHaveBeenCalled();
    });
    it('onShiftKeyDown and onShiftKeyUp not call drawLineLastPoint and drawLineSpy', () => {
        service.onShiftKeyDown(events.backSpaceEvent);
        service.onShiftKeyUp(events.backSpaceEvent);
        expect(drawLineLastPointSpy).not.toHaveBeenCalled();
        expect(drawLineSpy).not.toHaveBeenCalled();
    });
    it('if the mouse down when is outside the canvas not call drawLineSpy', () => {
        service.onMouseOut(events.mouseEvent3);
        service.onMouseDown(events.mouseEvent);
        service.onMouseEnter(events.mouseEvent3);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });
});
