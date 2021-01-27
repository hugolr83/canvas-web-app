// tslint:disable:no-unused-variable
// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
// tslint:disable:no-any

import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { EventOfTest } from '@app/classes/event-of-test';
import { MIN_CANVAS_SIZE, WORK_AREA_PADDING_SIZE } from '@app/classes/resize-canvas';
import { ResizeDirection } from '@app/classes/resize-direction';
import { CanvasResizeService } from './canvas-resizer.service';

describe('Service: CanvasResize', () => {
    let changeResizeYSpy: jasmine.Spy<any>;
    let changeResizeXSpy: jasmine.Spy<any>;
    let canvasResizeService: CanvasResizeService;
    let baseCtxStub: CanvasRenderingContext2D;
    let comparativeCtxStub: CanvasRenderingContext2D;
    let events: EventOfTest;

    let canvas: HTMLCanvasElement;
    let resizeCanvas: HTMLCanvasElement;
    let resizeCtx: CanvasRenderingContext2D;

    beforeEach(() => {
        canvas = canvasTestHelper.canvas;
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        comparativeCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        resizeCanvas = document.createElement('canvas');
        resizeCtx = resizeCanvas.getContext('2d') as CanvasRenderingContext2D;

        TestBed.configureTestingModule({
            providers: [CanvasResizeService],
        });

        canvasResizeService = TestBed.inject(CanvasResizeService);
        baseCtxStub.fillStyle = 'white';
        baseCtxStub.fillRect(0, 0, MIN_CANVAS_SIZE, MIN_CANVAS_SIZE);
        comparativeCtxStub.fillStyle = 'white';
        comparativeCtxStub.fillRect(0, 0, MIN_CANVAS_SIZE, MIN_CANVAS_SIZE);

        changeResizeXSpy = spyOn<any>(canvasResizeService, 'changeResizeX').and.callThrough();
        changeResizeYSpy = spyOn<any>(canvasResizeService, 'changeResizeY').and.callThrough();
        events = new EventOfTest();
        canvasResizeService.resizeDirection = ResizeDirection.vertical;
    });

    it('should create', inject([CanvasResizeService], (service: CanvasResizeService) => {
        expect(service).toBeTruthy();
    }));

    it('should onResizeDown horizontal', () => {
        canvasResizeService.onResizeDown(events.mouseEvent, ResizeDirection.horizontal);
        expect(canvasResizeService.resizeIndex).toEqual(canvasResizeService.PRIORITY_INDEX);
        expect(canvasResizeService.resizeDirection).toEqual(ResizeDirection.horizontal);
    });

    it('should onResizeDown Right click horizontal', () => {
        canvasResizeService.onResizeDown(events.mouseEventR, ResizeDirection.horizontal);
        expect(canvasResizeService.resizeIndex).toEqual(canvasResizeService.NORMAL_INDEX);
        expect(canvasResizeService.resizeDirection).toEqual(ResizeDirection.horizontal);
    });

    it('should onResizeDown vertical', () => {
        canvasResizeService.onResizeDown(events.mouseEvent, ResizeDirection.vertical);
        expect(canvasResizeService.resizeIndex).toEqual(canvasResizeService.PRIORITY_INDEX);
        expect(canvasResizeService.resizeDirection).toEqual(ResizeDirection.vertical);
    });

    it('should onResizeDown verticalAndHorizontal', () => {
        canvasResizeService.onResizeDown(events.mouseEvent, ResizeDirection.verticalAndHorizontal);
        expect(canvasResizeService.resizeIndex).toEqual(canvasResizeService.PRIORITY_INDEX);
        expect(canvasResizeService.resizeDirection).toEqual(ResizeDirection.verticalAndHorizontal);
    });

    it('changeResizeY is MIN_CANVAS_SIZE', () => {
        const numberResult: number = changeResizeYSpy(events.mouseEvent2, canvasResizeService);
        expect(numberResult).toEqual(MIN_CANVAS_SIZE);
    });

    it('changeResizeX is MIN_CANVAS_SIZE', () => {
        const numberResult: number = changeResizeXSpy(events.mouseEvent2, canvasResizeService);
        expect(numberResult).toEqual(MIN_CANVAS_SIZE);
    });

    it('changeResizeY is overSized', () => {
        const numberResult: number = changeResizeYSpy(events.mouseEventOutSate, canvasResizeService);
        expect(numberResult).toEqual(canvasResizeService.resizeHeight - WORK_AREA_PADDING_SIZE);
    });

    it('changeResizeX is overSized', () => {
        const numberResult: number = changeResizeXSpy(events.mouseEventOutSate, canvasResizeService);
        expect(numberResult).toEqual(canvasResizeService.resizeWidth - WORK_AREA_PADDING_SIZE);
    });

    it('changeResizeY is good size', () => {
        const numberResult: number = changeResizeYSpy(events.mouseEventX499Y500, canvasResizeService);
        expect(numberResult).toEqual(events.mouseEventX499Y500.offsetY);
    });

    it('changeResizeX inclusive value is good', () => {
        canvasResizeService.resizeWidth = 1000;
        const event: MouseEvent = { offsetX: 500, offsetY: 500 } as MouseEvent;
        const numberResult: number = canvasResizeService['changeResizeX'](event, canvasResizeService);
        expect(numberResult).toBe(event.offsetX);
    });

    it('onResize is good vertical', () => {
        canvasResizeService.isResizeDown = true;
        canvasResizeService.resizeDirection = ResizeDirection.vertical;
        const spy = spyOn<any>(canvasResizeService, 'onResize').and.callThrough();
        canvasResizeService.onResize(events.mouseEventX499Y500, baseCtxStub);
        expect(spy).toHaveBeenCalled();
    });

    it('onResize is good horizontal', () => {
        canvasResizeService.isResizeDown = true;
        canvasResizeService.resizeDirection = ResizeDirection.horizontal;
        const spy = spyOn<any>(canvasResizeService, 'onResize').and.callThrough();
        canvasResizeService.onResize(events.mouseEventX499Y500, baseCtxStub);
        expect(spy).toHaveBeenCalled();
    });

    it('onResize is good verticalAndHorizontal', () => {
        canvasResizeService.isResizeDown = true;
        canvasResizeService.resizeDirection = ResizeDirection.verticalAndHorizontal;
        const spy = spyOn<any>(canvasResizeService, 'onResize').and.callThrough();
        canvasResizeService.onResize(events.mouseEventX499Y500, baseCtxStub);
        expect(spy).toHaveBeenCalled();
    });

    it('changeCanvasY smaller than MIN_CANVAS_SIZE', () => {
        canvasResizeService.resizeHeight = 1000;
        const event: MouseEvent = { offsetX: 0, offsetY: 0 } as MouseEvent;
        canvasResizeService['changeCanvasY'](event);
        expect(canvasResizeService.canvasSize.y).toBe(MIN_CANVAS_SIZE);
    });

    it('changeCanvasY greater than drawing area', () => {
        canvasResizeService.resizeHeight = 1000;
        const event: MouseEvent = { offsetX: 0, offsetY: 20000 } as MouseEvent;
        canvasResizeService['changeCanvasY'](event);
        expect(canvasResizeService.canvasSize.y).toBe(canvasResizeService.resizeHeight - WORK_AREA_PADDING_SIZE);
    });

    it('changeCanvasY to be in the respective area, not too small or too big', () => {
        const event: MouseEvent = { offsetX: 0, offsetY: 500 } as MouseEvent;
        canvasResizeService['changeCanvasY'](event);
        expect(canvasResizeService.canvasSize.y).toBe(event.offsetY);
    });

    it('changeCanvasX smaller than MIN_CANVAS_SIZE', () => {
        canvasResizeService.resizeWidth = 1000;
        const event: MouseEvent = { offsetX: 0, offsetY: 0 } as MouseEvent;
        canvasResizeService['changeCanvasX'](event);
        expect(canvasResizeService.canvasSize.x).toBe(MIN_CANVAS_SIZE);
    });

    it('changeCanvasX greater than drawing area', () => {
        canvasResizeService.resizeHeight = 1000;
        const event: MouseEvent = { offsetX: 20000, offsetY: 20000 } as MouseEvent;
        canvasResizeService['changeCanvasX'](event);
        expect(canvasResizeService.canvasSize.x).toBe(canvasResizeService.resizeWidth - WORK_AREA_PADDING_SIZE);
    });

    it('changeCanvasX to be in the respective area, not too small or too big', () => {
        canvasResizeService.resizeWidth = 1000;
        const event: MouseEvent = { offsetX: 500, offsetY: 500 } as MouseEvent;
        canvasResizeService['changeCanvasX'](event);
        expect(canvasResizeService.canvasSize.x).toBe(event.offsetX);
    });

    it('onResizeOut has redirected to onResizeUp', () => {
        const onResizeUpSpy = spyOn(canvasResizeService, 'onResizeUp');
        canvasResizeService.onResizeOut({} as MouseEvent, baseCtxStub, canvasTestHelper.canvas);
        expect(onResizeUpSpy).toHaveBeenCalled();
    });

    it(' should onResizeUp vertical resize', () => {
        canvasResizeService.isResizeDown = true;
        canvasResizeService.resizeDirection = ResizeDirection.vertical;
        const spy = spyOn<any>(canvasResizeService, 'onResizeUp').and.callThrough();
        canvasResizeService.onResizeUp({} as MouseEvent, resizeCtx, canvas);
        expect(spy).toHaveBeenCalled();
    });

    it(' should onResizeUp horizontal resize', () => {
        canvasResizeService.isResizeDown = true;
        canvasResizeService.resizeDirection = ResizeDirection.horizontal;
        const spy = spyOn<any>(canvasResizeService, 'onResizeUp').and.callThrough();
        canvasResizeService.onResizeUp({} as MouseEvent, resizeCtx, canvas);
        expect(spy).toHaveBeenCalled();
    });

    it(' should onResizeUp vertical and horizontal resize', () => {
        canvasResizeService.isResizeDown = true;
        canvasResizeService.addToUndoRedo = true;
        canvasResizeService.resizeDirection = ResizeDirection.verticalAndHorizontal;
        const spy = spyOn<any>(canvasResizeService, 'onResizeUp').and.callThrough();
        canvasResizeService.onResizeUp({} as MouseEvent, resizeCtx, canvas);
        expect(spy).toHaveBeenCalled();
    });
});
