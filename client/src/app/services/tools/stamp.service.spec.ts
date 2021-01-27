import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { StampService } from '@app/services/tools/stamp.service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal

describe('StampService', () => {
    let stampService: StampService;
    let baseStubCtx: CanvasRenderingContext2D;
    let cursorStubCtx: CanvasRenderingContext2D;
    let drawingServiceMock: jasmine.SpyObj<DrawingService>;
    let spySaveCanvas: jasmine.SpyObj<any>;
    let drawImageSpy: jasmine.SpyObj<any>;

    let drawCursorImageSpy: jasmine.SpyObj<any>;

    beforeEach(() => {
        drawingServiceMock = jasmine.createSpyObj('DrawingService', ['baseCtx', 'previewCtx', 'cursorCtx']);

        baseStubCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        cursorStubCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceMock }],
        });
        stampService = TestBed.inject(StampService);
        drawingServiceMock = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;

        drawingServiceMock.baseCtx = baseStubCtx;
        drawingServiceMock.cursorCtx = cursorStubCtx;

        stampService['currentStamp'] = new Image();

        spySaveCanvas = spyOn<any>(stampService, 'saveCanvas').and.callThrough();
        drawImageSpy = spyOn<any>(drawingServiceMock.baseCtx, 'drawImage').and.callThrough();

        drawCursorImageSpy = spyOn<any>(stampService, 'drawCursorImage').and.callThrough();
    });

    it('should be created', () => {
        expect(stampService).toBeTruthy();
    });

    it('should call drawImageCursor() onMouseMove', () => {
        const event = { x: 15, y: 6 } as MouseEvent;
        stampService.onMouseMove(event);
        expect(stampService['canvasWidth']).toEqual(drawingServiceMock.cursorCtx.canvas.offsetWidth / 2);
        expect(stampService['canvasHeight']).toEqual(drawingServiceMock.cursorCtx.canvas.offsetHeight / 2);
        expect(drawCursorImageSpy).toHaveBeenCalled();
    });

    it('should increase canvas size', () => {
        const previousWidth = drawingServiceMock.cursorCtx.canvas.width;
        const previousHeight = drawingServiceMock.cursorCtx.canvas.height;
        stampService.increaseSize();
        expect(drawingServiceMock.cursorCtx.canvas.width).toEqual(previousWidth + 10);
        expect(drawingServiceMock.cursorCtx.canvas.height).toEqual(previousHeight + 10);
    });

    it('should decrease canvas size', () => {
        const previousWidth = drawingServiceMock.cursorCtx.canvas.width;
        const previousHeight = drawingServiceMock.cursorCtx.canvas.height;
        stampService.increaseSize();
        stampService.increaseSize();
        stampService.decreaseSize();
        expect(drawingServiceMock.cursorCtx.canvas.width).toEqual(previousWidth + 10);
        expect(drawingServiceMock.cursorCtx.canvas.height).toEqual(previousHeight + 10);
    });

    it('should set currentStamp2Name', () => {
        const event = { x: 15, y: 6 } as MouseEvent;

        stampService.onMouseDown(event);
        const eventLoad = new Event('onload');
        stampService['stampToDraw'].dispatchEvent(eventLoad);

        expect(spySaveCanvas).toHaveBeenCalled();
        expect(stampService['mouseCenterX']).toEqual(event.offsetX - stampService['canvasWidth']);
        expect(stampService['mouseCenterY']).toEqual(event.offsetY - stampService['canvasHeight']);
        expect(drawImageSpy).not.toHaveBeenCalled();
    });

    it('should set display, currentStamp', () => {
        const event = { x: 15, y: 6 } as MouseEvent;
        stampService.onMouseEnter(event);
        expect(drawingServiceMock.cursorCtx.canvas.style.display).toEqual('inline-block');
    });

    it('should set display', () => {
        const event = { x: 15, y: 6 } as MouseEvent;
        stampService.onMouseOut(event);
        expect(drawingServiceMock.cursorCtx.canvas.style.display).toEqual('none');
    });

    it('should return correct angle', () => {
        const angleDeg = 90;
        const angleRad = stampService.convertDegToRad(angleDeg);
        expect(angleRad).toEqual((angleDeg * Math.PI) / 180);
    });

    it('should add 15 to angle', () => {
        const oldAngle = stampService['angle'];
        stampService['isWheelUp'] = true;
        stampService['isAltPressed'] = false;

        stampService.changeAngleWithScroll();

        expect(stampService['angle']).toEqual(oldAngle + 15);
    });

    it('should add 1 to angle', () => {
        const oldAngle = stampService['angle'];
        stampService['isWheelUp'] = true;
        stampService['isAltPressed'] = true;

        stampService.changeAngleWithScroll();

        expect(stampService['angle']).toEqual(oldAngle + 1);
    });

    it('should subtract 15 to angle', () => {
        const oldAngle = stampService['angle'];
        stampService['isWheelUp'] = false;
        stampService['isAltPressed'] = false;

        stampService.changeAngleWithScroll();

        expect(stampService['angle']).toEqual(oldAngle - 15);
    });

    it('should subtract 1 to angle', () => {
        const oldAngle = stampService['angle'];
        stampService['isWheelUp'] = false;
        stampService['isAltPressed'] = true;

        stampService.changeAngleWithScroll();

        expect(stampService['angle']).toEqual(oldAngle - 1);
    });

    it('should set isWheelUp', () => {
        const event = { deltaY: -20 } as WheelEvent;
        stampService.addOrRetract(event);
        expect(stampService['isWheelUp']).toEqual(true);
    });

    it('should set isWheelUp', () => {
        const event = { deltaY: 20 } as WheelEvent;
        stampService.addOrRetract(event);
        expect(stampService['isWheelUp']).toEqual(false);
    });
});
