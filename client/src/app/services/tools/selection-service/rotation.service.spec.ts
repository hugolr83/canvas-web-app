// variables are needed to initialize
// tslint:disable:no-unused-variable
// tslint:disable:no-magic-numbers
// tslint:disable:no-any

import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { SelectionImage } from '@app/classes/selection';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RotationService } from './rotation.service';
import { SelectionService } from './selection-service';

describe('Service: Rotation', () => {
    let rotationStub: RotationService;
    let drawingServiceMock: jasmine.SpyObj<DrawingService>;
    let selectionMock: jasmine.SpyObj<SelectionService>;
    let event: WheelEvent;

    let addOrRetractSpy: jasmine.SpyObj<any>;
    let translateSpy: jasmine.SpyObj<any>;

    let image: SelectionImage;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceMock = jasmine.createSpyObj('DrawingService', ['baseCtx', 'previewCtx', 'cursorCtx', 'isPreviewCanvasBlank', 'clearCanvas']);
        selectionMock = jasmine.createSpyObj('selectionService', ['clearSelection', 'drawSelection', 'selection']);
        image = new SelectionImage(drawingServiceMock);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceMock },
                { provide: SelectionService, useValue: selectionMock },
            ],
        });

        rotationStub = TestBed.inject(RotationService);

        drawingServiceMock.baseCtx = baseCtxStub;
        drawingServiceMock.previewCtx = previewCtxStub;
        canvas = canvasTestHelper.canvas;
        canvas.width = 100;
        canvas.height = 100;
        drawingServiceMock.canvas = canvas;
        translateSpy = spyOn<any>(drawingServiceMock.baseCtx, 'translate').and.callThrough();

        addOrRetractSpy = spyOn<any>(rotationStub, 'addOrRetract').and.callThrough();

        event = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as WheelEvent;
    });

    it('should be created', () => {
        expect(rotationStub).toBeTruthy();
    });

    it('should call addOrRetract when onWheelScroll', () => {
        drawingServiceMock.baseCtx.fillStyle = 'green';
        drawingServiceMock.baseCtx.fillRect(10, 10, drawingServiceMock.canvas.width, drawingServiceMock.canvas.height);
        rotationStub.onWheelScroll(selectionMock, event);
        expect(addOrRetractSpy).toHaveBeenCalled();
    });

    it('should change retract 15 to the angle 15  ', () => {
        rotationStub.altPressed = false;
        rotationStub.isWheelAdd = false;
        const angle = rotationStub.changeAngleWithScroll(15);
        expect(angle).toEqual(0);
    });

    it('should change add 15 to the angle 15  ', () => {
        rotationStub.altPressed = false;
        rotationStub.isWheelAdd = true;
        const angle = rotationStub.changeAngleWithScroll(15);
        expect(angle).toEqual(30);
    });
    it('should change add 1 to the angle 15  ', () => {
        rotationStub.altPressed = true;
        rotationStub.isWheelAdd = true;
        const angle = rotationStub.changeAngleWithScroll(15);
        expect(angle).toEqual(16);
    });
    it('should change retract 1 to the angle 15  ', () => {
        rotationStub.altPressed = true;
        rotationStub.isWheelAdd = false;
        const angle = rotationStub.changeAngleWithScroll(15);
        expect(angle).toEqual(14);
    });

    it('should set isWheelAdd to true', () => {
        const wheelEvent = { deltaY: -20 } as WheelEvent;
        rotationStub.addOrRetract(wheelEvent);
        expect(rotationStub.isWheelAdd).toEqual(true);
    });

    it('should call translate on baseCtx when calling rotationSelection', () => {
        rotationStub.rotateSelection(image, drawingServiceMock.baseCtx);
        expect(translateSpy).toHaveBeenCalled();
    });
});
