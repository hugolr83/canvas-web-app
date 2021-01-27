/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ControlGroup } from '@app/classes/control-group';
import { ControlPointName } from '@app/classes/control-points';
import { FlipDirection } from '@app/classes/flip-direction';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { SelectionService } from './selection-service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal
// tslint:disable:max-file-line-count
// tslint:disable:no-shadowed-variable

describe('Service: SelectionService', () => {
    let service: SelectionService;

    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let drawSelectionSpy: jasmine.Spy<any>;
    let subscriptionTimerSubscribeSpy: jasmine.Spy<any>;
    let copySelectionSpy: jasmine.Spy<any>;
    let scaleSelectionSpy: jasmine.Spy<any>;
    let drawPreviewSpy: jasmine.Spy<any>;
    let pasteSelectionSpy: jasmine.Spy<any>;
    let onMouseUpSpy: jasmine.Spy<any>;
    let strokeRectSpy: jasmine.Spy<any>;
    let controlGroupDrawSpy: jasmine.Spy<any>;
    let selectionGetImageSpy: jasmine.Spy<any>;
    let selectionGetImageURLSpy: jasmine.Spy<any>;
    let onArrowDownSpy: jasmine.Spy<any>;
    let onArrowUpSpy: jasmine.Spy<any>;
    let copyImageSpy: jasmine.Spy<any>;
    let clearSelectionSpy: jasmine.Spy<any>;
    let saveFlippedImageSpy: jasmine.Spy<any>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'isPreviewCanvasBlank']);
        TestBed.configureTestingModule({
            providers: [SelectionService, { provide: DrawingService, useValue: drawServiceSpy }],
        });

        service = TestBed.inject(SelectionService);

        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesn't copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas as HTMLCanvasElement;
    });

    it('should be created', inject([SelectionService], (service: SelectionService) => {
        expect(service).toBeTruthy();
    }));

    it(' onMouseUp should copy a selection and draw it if the selection is done being drawn', () => {
        copySelectionSpy = spyOn<any>(service, 'copySelection').and.callThrough();
        drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();

        const mouseEvent = {
            button: 0,
            offsetX: 11,
            offsetY: 11,
        } as MouseEvent;

        service.mouseDown = true;
        service['inSelection'] = false;
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service['controlPointName'] = ControlPointName.none;
        service.selection.width = 10;
        service.selection.height = 10;
        service.selection.imageData = new ImageData(10, 10);
        service.selection.image = new Image();
        service.onMouseUp(mouseEvent);
        expect(copySelectionSpy).toHaveBeenCalled();
        expect(drawSelectionSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should draw a selection that has been scaled or moved', () => {
        drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();

        const mouseEvent = {
            button: 0,
            offsetX: 11,
            offsetY: 11,
        } as MouseEvent;

        service.mouseDown = true;
        service['inSelection'] = true;
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service['controlPointName'] = ControlPointName.none;
        service.selection.width = 10;
        service.selection.height = 10;
        service.selection.imageData = new ImageData(10, 10);
        service.selection.image = new Image();
        service.onMouseUp(mouseEvent);
        expect(drawSelectionSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should scale and draw a selection if a control point has been selected', () => {
        drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
        scaleSelectionSpy = spyOn<any>(service, 'scaleSelection').and.callThrough();

        const mouseEvent = {
            button: 0,
            offsetX: 20,
            offsetY: 20,
        } as MouseEvent;

        service.mouseDown = true;
        service['inSelection'] = true;
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service['previousMousePos'] = { x: 10, y: 10 };
        service['controlPointName'] = ControlPointName.left;
        service['controlGroup'] = new ControlGroup(service['drawingService']);
        service.selection.width = 10;
        service.selection.height = 10;
        service.selection.imageData = new ImageData(10, 10);
        service.selection.image = new Image();
        service.onMouseMove(mouseEvent);
        expect(scaleSelectionSpy).toHaveBeenCalled();
        expect(drawSelectionSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should draw a preview of a selection if a selection is being drawn', () => {
        drawPreviewSpy = spyOn<any>(service, 'drawPreview').and.callThrough();

        const mouseEvent = {
            button: 0,
            offsetX: 20,
            offsetY: 20,
        } as MouseEvent;

        service.mouseDown = true;
        service['inSelection'] = false;
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service['previousMousePos'] = { x: 10, y: 10 };
        service['controlPointName'] = ControlPointName.none;
        service['controlGroup'] = new ControlGroup(service['drawingService']);
        service.selection.width = 10;
        service.selection.height = 10;
        service.selection.imageData = new ImageData(10, 10);
        service.selection.image = new Image();
        service.onMouseMove(mouseEvent);
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it(' onMouseOut should put the image back on its initial position if a selection has been drawn', () => {
        pasteSelectionSpy = spyOn<any>(service, 'pasteSelection').and.callThrough();

        const mouseEvent = {
            button: 0,
            offsetX: 20,
            offsetY: 20,
        } as MouseEvent;

        service.mouseDown = true;
        service['inSelection'] = true;
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.copyImageInitialPos = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service['controlPointName'] = ControlPointName.none;
        service['controlGroup'] = new ControlGroup(service['drawingService']);
        service.selection.width = 10;
        service.selection.height = 10;
        service.selection.imageData = new ImageData(10, 10);
        service.selection.image = new Image();
        service.onMouseOut(mouseEvent);
        expect(pasteSelectionSpy).toHaveBeenCalled();
    });

    it(' onMouseOut should call the onMouseUp function if a selection is being drawn', () => {
        onMouseUpSpy = spyOn<any>(service, 'onMouseUp');

        const mouseEvent = {
            button: 0,
            offsetX: 20,
            offsetY: 20,
        } as MouseEvent;

        service.mouseDown = true;
        service['inSelection'] = false;
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.copyImageInitialPos = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.onMouseOut(mouseEvent);
        expect(onMouseUpSpy).toHaveBeenCalled();
    });

    it(' onShiftKeyDown should redraw the preview selection with the appropriate size', () => {
        drawPreviewSpy = spyOn<any>(service, 'drawPreview');
        const keyEvent = {} as KeyboardEvent;

        service.mouseDown = true;
        service['inSelection'] = false;
        service['controlPointName'] = ControlPointName.none;
        service['controlGroup'] = new ControlGroup(service['drawingService']);
        service.onShiftKeyDown(keyEvent);
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it(' onShiftKeyUp should redraw the preview selection with the appropriate size', () => {
        drawPreviewSpy = spyOn<any>(service, 'drawPreview');
        const keyEvent = {} as KeyboardEvent;

        service.mouseDown = true;
        service['inSelection'] = false;
        service['controlPointName'] = ControlPointName.none;
        service['controlGroup'] = new ControlGroup(service['drawingService']);
        service.onShiftKeyUp(keyEvent);
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it(' clearEffectTool should reset drawing effects on canvas', () => {
        service.clearEffectTool();
        expect(service['drawingService'].previewCtx.lineCap).toEqual('square');
    });

    it(' selectAll should copy a full canvas selection and draw it ', () => {
        copySelectionSpy = spyOn<any>(service, 'copySelection').and.callThrough();
        drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();

        service.selectAll();
        expect(copySelectionSpy).toHaveBeenCalled();
        expect(drawSelectionSpy).toHaveBeenCalled();
    });

    it(' drawPreviewRect should draw a preview rectangle if shift is not pressed ', () => {
        strokeRectSpy = spyOn<any>(service['drawingService'].previewCtx, 'strokeRect').and.callThrough();

        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.width = 10;
        service.selection.height = 10;

        service['drawPreviewRect'](service['drawingService'].previewCtx, false);
        expect(strokeRectSpy).toHaveBeenCalled();
    });

    it(' drawPreviewRect should draw a preview square if shift is not pressed ', () => {
        strokeRectSpy = spyOn<any>(service['drawingService'].previewCtx, 'strokeRect').and.callThrough();

        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.width = 10;
        service.selection.height = 10;

        service['drawPreviewRect'](service['drawingService'].previewCtx, true);
        expect(strokeRectSpy).toHaveBeenCalled();
    });

    it(' drawSelectionRect should call the get image function and save a base image', () => {
        strokeRectSpy = spyOn<any>(service['drawingService'].previewCtx, 'strokeRect').and.callThrough();

        service['controlGroup'] = new ControlGroup(service['drawingService']);

        controlGroupDrawSpy = spyOn<any>(service['controlGroup'], 'draw');
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.width = 10;
        service.selection.height = 10;

        service['drawSelectionRect']({ x: 1, y: 1 }, 10, 10);

        expect(strokeRectSpy).toHaveBeenCalled();
        expect(controlGroupDrawSpy).toHaveBeenCalled();
    });

    it(' copySelection should call the get image function and save a base image', () => {
        selectionGetImageSpy = spyOn<any>(service.selection, 'getImage');
        selectionGetImageURLSpy = spyOn<any>(service.selection, 'getImageURL');
        service.selection.width = 10;
        service.selection.height = 10;
        service.selection.imageData = new ImageData(10, 10);

        service['copySelection']();

        expect(selectionGetImageSpy).toHaveBeenCalled();
        expect(selectionGetImageURLSpy).toHaveBeenCalled();
    });

    it(' updateSelectionPosition should update the selection position to keep imagePosition in the top left and endingPos in the bottom right of the selection', () => {
        service.selection.imagePosition = { x: 11, y: 1 };
        service.selection.endingPos = { x: 1, y: 11 };
        service.selection.width = 10;
        service.selection.height = 10;

        expect(service['updateSelectionPositions']()).toEqual({ x: 1, y: 1 });
    });

    it(' updateSelectionPosition should update the selection position to keep imagePosition in the top left and endingPos in the bottom right of the selection', () => {
        service.selection.imagePosition = { x: 11, y: 11 };
        service.selection.endingPos = { x: 1, y: 1 };
        service.selection.width = 10;
        service.selection.height = 10;

        expect(service['updateSelectionPositions']()).toEqual({ x: 1, y: 1 });
    });

    it(' updateSelectionPosition should update the selection position to keep imagePosition in the top left and endingPos in the bottom right of the selection', () => {
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.width = 10;
        service.selection.height = 10;

        expect(service['updateSelectionPositions']()).toEqual({ x: 1, y: 1 });
    });

    it(' updateSelectionPosition should update the selection position to keep imagePosition in the top left and endingPos in the bottom right of the selection', () => {
        service.selection.imagePosition = { x: 1, y: 11 };
        service.selection.endingPos = { x: 11, y: 1 };
        service.selection.width = 10;
        service.selection.height = 10;

        expect(service['updateSelectionPositions']()).toEqual({ x: 1, y: 1 });
    });

    it(' isInsideSelectionCoords should check if the mouse coords parameter are in the selection bounds ', () => {
        drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.width = 10;
        service.selection.height = 10;

        expect(service['isInsideSelectionCoords']({ x: 5, y: 5 })).toEqual(true);
    });

    it(' isInsideSelectionCoords should check if the mouse coords parameter are in the selection bounds ', () => {
        drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.width = 10;
        service.selection.height = 10;

        expect(service['isInsideSelectionCoords']({ x: 15, y: 15 })).toEqual(false);
    });

    it(' onLeftArrow should call the on arrowDown function of the left arrow ', () => {
        onArrowDownSpy = spyOn<any>(service['leftArrow'], 'onArrowDown');
        service.onLeftArrow();
        expect(onArrowDownSpy).toHaveBeenCalled();
    });

    it(' onRightArrow should call the on arrowDown function of the left arrow ', () => {
        onArrowDownSpy = spyOn<any>(service['rightArrow'], 'onArrowDown');
        service.onRightArrow();
        expect(onArrowDownSpy).toHaveBeenCalled();
    });

    it(' onUpArrow should call the on arrowDown function of the left arrow ', () => {
        onArrowDownSpy = spyOn<any>(service['upArrow'], 'onArrowDown');
        service.onUpArrow();
        expect(onArrowDownSpy).toHaveBeenCalled();
    });

    it(' onDownArrow should call the on arrowDown function of the left arrow ', () => {
        onArrowDownSpy = spyOn<any>(service['downArrow'], 'onArrowDown');
        service.onDownArrow();
        expect(onArrowDownSpy).toHaveBeenCalled();
    });

    it(' onLeftArrowUp should call the on arrowDown function of the left arrow ', () => {
        onArrowUpSpy = spyOn<any>(service['leftArrow'], 'onArrowUp');
        service.onLeftArrowUp();
        expect(onArrowUpSpy).toHaveBeenCalled();
    });

    it(' onRightArrow should call the on arrowDown function of the left arrow ', () => {
        onArrowUpSpy = spyOn<any>(service['rightArrow'], 'onArrowUp');
        service.onRightArrowUp();
        expect(onArrowUpSpy).toHaveBeenCalled();
    });

    it(' onUpArrow should call the on arrowDown function of the left arrow ', () => {
        onArrowUpSpy = spyOn<any>(service['upArrow'], 'onArrowUp');
        service.onUpArrowUp();
        expect(onArrowUpSpy).toHaveBeenCalled();
    });

    it(' onDownArrow should call the on arrowDown function of the left arrow ', () => {
        onArrowUpSpy = spyOn<any>(service['downArrow'], 'onArrowUp');
        service.onDownArrowUp();
        expect(onArrowUpSpy).toHaveBeenCalled();
    });

    it(' startTimer should not start a timer if its already started', () => {
        service['timerStarted'] = true;
        service.startTimer();
        expect(service['timerStarted']).toEqual(true);
    });

    it(' startTimer should not start a timer if its already started', () => {
        service['timerStarted'] = true;
        service.startTimer();
        expect(service['timerStarted']).toEqual(true);
    });

    it(' resetTimer should reset the main timer if no arrows are pressed', () => {
        service['rightArrow'].arrowPressed = false;
        service['leftArrow'].arrowPressed = false;
        service['upArrow'].arrowPressed = false;
        service['downArrow'].arrowPressed = false;
        service['timerStarted'] = true;
        service['subscriptionTimer'] = new Subscription();
        subscriptionTimerSubscribeSpy = spyOn<any>(service['subscriptionTimer'], 'unsubscribe').and.callThrough();
        service.resetTimer();
        expect(subscriptionTimerSubscribeSpy).toHaveBeenCalled();
    });

    it(' resetTimer should not reset the main timer if some arrows are pressed', () => {
        service['rightArrow'].arrowPressed = true;
        service['leftArrow'].arrowPressed = false;
        service['upArrow'].arrowPressed = false;
        service['downArrow'].arrowPressed = false;
        service['timerStarted'] = true;
        service['subscriptionTimer'] = new Subscription();
        subscriptionTimerSubscribeSpy = spyOn<any>(service['subscriptionTimer'], 'unsubscribe').and.callThrough();
        service.resetTimer();
        expect(subscriptionTimerSubscribeSpy).not.toHaveBeenCalled();
    });

    it(' copyImage should copy the selection into the clipboard', () => {
        selectionGetImageURLSpy = spyOn<any>(service.selection, 'getImageURL');
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.copyImageInitialPos = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.ellipseRadian = { x: 5, y: 5 };
        service.selection.width = 10;
        service.selection.height = 10;
        service.selection.imageSize = { x: 10, y: 10 };
        service.selection.imageData = new ImageData(10, 10);
        service.selection.image = new Image();

        service.copyImage();
        expect(selectionGetImageURLSpy).toHaveBeenCalled();
        expect(service['clipboard'].end).toEqual({ x: 11, y: 11 });
    });

    it(' cutImage should copy the selection into the clipboard and clear the selection place if it hasn t been cleared already', () => {
        clearSelectionSpy = spyOn<any>(service, 'clearSelection');
        copyImageSpy = spyOn<any>(service, 'copyImage');
        service.cleared = false;

        service.cutImage();
        expect(clearSelectionSpy).toHaveBeenCalled();
        expect(copyImageSpy).toHaveBeenCalled();
    });

    it(' deleteImage should delete the selection', () => {
        clearSelectionSpy = spyOn<any>(service, 'clearSelection');

        service.deleteImage();
        expect(clearSelectionSpy).toHaveBeenCalled();
    });

    it(' pasteImage should draw a selection from the clipboard', () => {
        pasteSelectionSpy = spyOn<any>(service, 'pasteSelection');
        drawSelectionSpy = spyOn<any>(service, 'drawSelection');
        drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);

        service['clipboard'].imagePosition = { x: 1, y: 1 };
        service['clipboard'].start = { x: 1, y: 1 };
        service['clipboard'].end = { x: 11, y: 11 };
        service['clipboard'].ellipseRadian = { x: 5, y: 5 };
        service['clipboard'].width = 10;
        service['clipboard'].height = 10;
        service['clipboard'].imageSize = { x: 10, y: 10 };
        service['clipboard'].imageData = new ImageData(10, 10);
        service['clipboard'].image = new Image();

        service.pasteImage();
        expect(pasteSelectionSpy).toHaveBeenCalled();
        expect(drawSelectionSpy).toHaveBeenCalled();
    });

    it(' scaleSelection should update a selection according to the control point selected and if shift is pressed (top)', () => {
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.ellipseRadian = { x: 5, y: 5 };
        service.selection.width = 10;
        service.selection.height = 10;
        service['shiftPressed'] = false;
        service['controlPointName'] = ControlPointName.top;

        service['scaleSelection']({ x: 2, y: 2 });

        expect(service.selection.ellipseRadian).toEqual({ x: 5, y: 4 });
        expect(service.selection.imagePosition).toEqual({ x: 1, y: 3 });
        expect(service.selection.endingPos).toEqual({ x: 11, y: 11 });
        expect(service.selection.width).toEqual(10);
        expect(service.selection.height).toEqual(8);
    });

    it(' scaleSelection should update a selection according to the control point selected and if shift is pressed (bottom)', () => {
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.ellipseRadian = { x: 5, y: 5 };
        service.selection.width = 10;
        service.selection.height = 10;
        service['shiftPressed'] = false;
        service['controlPointName'] = ControlPointName.bottom;

        service['scaleSelection']({ x: 2, y: 2 });

        expect(service.selection.ellipseRadian).toEqual({ x: 5, y: 6 });
        expect(service.selection.imagePosition).toEqual({ x: 1, y: 1 });
        expect(service.selection.endingPos).toEqual({ x: 11, y: 13 });
        expect(service.selection.width).toEqual(10);
        expect(service.selection.height).toEqual(12);
    });

    it(' scaleSelection should update a selection according to the control point selected and if shift is pressed (left)', () => {
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.ellipseRadian = { x: 5, y: 5 };
        service.selection.width = 10;
        service.selection.height = 10;
        service['shiftPressed'] = false;
        service['controlPointName'] = ControlPointName.left;

        service['scaleSelection']({ x: 2, y: 2 });

        expect(service.selection.ellipseRadian).toEqual({ x: 4, y: 5 });
        expect(service.selection.imagePosition).toEqual({ x: 3, y: 1 });
        expect(service.selection.endingPos).toEqual({ x: 11, y: 11 });
        expect(service.selection.width).toEqual(8);
        expect(service.selection.height).toEqual(10);
    });

    it(' scaleSelection should update a selection according to the control point selected and if shift is pressed (right)', () => {
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.ellipseRadian = { x: 5, y: 5 };
        service.selection.width = 10;
        service.selection.height = 10;
        service['shiftPressed'] = false;
        service['controlPointName'] = ControlPointName.right;

        service['scaleSelection']({ x: 2, y: 2 });

        expect(service.selection.ellipseRadian).toEqual({ x: 6, y: 5 });
        expect(service.selection.imagePosition).toEqual({ x: 1, y: 1 });
        expect(service.selection.endingPos).toEqual({ x: 13, y: 11 });
        expect(service.selection.width).toEqual(12);
        expect(service.selection.height).toEqual(10);
    });

    it(' scaleSelection should update a selection according to the control point selected and if shift is pressed (top left)', () => {
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.ellipseRadian = { x: 5, y: 5 };
        service.selection.width = 10;
        service.selection.height = 10;
        service['shiftPressed'] = false;
        service['controlPointName'] = ControlPointName.topLeft;

        service['scaleSelection']({ x: 2, y: 2 });

        expect(service.selection.ellipseRadian).toEqual({ x: 4, y: 4 });
        expect(service.selection.imagePosition).toEqual({ x: 3, y: 3 });
        expect(service.selection.endingPos).toEqual({ x: 11, y: 11 });
        expect(service.selection.width).toEqual(8);
        expect(service.selection.height).toEqual(8);
    });

    it(' scaleSelection should update a selection according to the control point selected and if shift is pressed (top right)', () => {
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.ellipseRadian = { x: 5, y: 5 };
        service.selection.width = 10;
        service.selection.height = 10;
        service['shiftPressed'] = false;
        service['controlPointName'] = ControlPointName.topRight;

        service['scaleSelection']({ x: 2, y: 2 });

        expect(service.selection.ellipseRadian).toEqual({ x: 6, y: 4 });
        expect(service.selection.imagePosition).toEqual({ x: 1, y: 3 });
        expect(service.selection.endingPos).toEqual({ x: 13, y: 11 });
        expect(service.selection.width).toEqual(12);
        expect(service.selection.height).toEqual(8);
    });

    it(' scaleSelection should update a selection according to the control point selected and if shift is pressed (bottom right)', () => {
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.ellipseRadian = { x: 5, y: 5 };
        service.selection.width = 10;
        service.selection.height = 10;
        service['shiftPressed'] = false;
        service['controlPointName'] = ControlPointName.bottomRight;

        service['scaleSelection']({ x: 2, y: 2 });

        expect(service.selection.ellipseRadian).toEqual({ x: 4, y: 6 });
        expect(service.selection.imagePosition).toEqual({ x: 3, y: 1 });
        expect(service.selection.endingPos).toEqual({ x: 11, y: 13 });
        expect(service.selection.width).toEqual(8);
        expect(service.selection.height).toEqual(12);
    });

    it(' scaleSelection should update a selection according to the control point selected and if shift is pressed (bottom left)', () => {
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.ellipseRadian = { x: 5, y: 5 };
        service.selection.width = 10;
        service.selection.height = 10;
        service['shiftPressed'] = false;
        service['controlPointName'] = ControlPointName.bottomLeft;

        service['scaleSelection']({ x: 2, y: 2 });

        expect(service.selection.ellipseRadian).toEqual({ x: 6, y: 6 });
        expect(service.selection.imagePosition).toEqual({ x: 1, y: 1 });
        expect(service.selection.endingPos).toEqual({ x: 13, y: 13 });
        expect(service.selection.width).toEqual(12);
        expect(service.selection.height).toEqual(12);
    });

    it(' scaleSelection should update a selection according to the control point selected and if shift is pressed (top + shift)', () => {
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.ellipseRadian = { x: 5, y: 5 };
        service.selection.width = 10;
        service.selection.height = 10;
        service['shiftPressed'] = true;
        service['controlPointName'] = ControlPointName.top;

        service['scaleSelection']({ x: 2, y: 2 });

        expect(service.selection.ellipseRadian).toEqual({ x: 5, y: 3 });
        expect(service.selection.imagePosition).toEqual({ x: 1, y: 3 });
        expect(service.selection.endingPos).toEqual({ x: 11, y: 9 });
        expect(service.selection.width).toEqual(10);
        expect(service.selection.height).toEqual(6);
    });

    it(' scaleSelection should update a selection according to the control point selected and if shift is pressed (bottom + shift)', () => {
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.ellipseRadian = { x: 5, y: 5 };
        service.selection.width = 10;
        service.selection.height = 10;
        service['shiftPressed'] = true;
        service['controlPointName'] = ControlPointName.bottom;

        service['scaleSelection']({ x: 2, y: 2 });

        expect(service.selection.ellipseRadian).toEqual({ x: 5, y: 7 });
        expect(service.selection.imagePosition).toEqual({ x: 1, y: -1 });
        expect(service.selection.endingPos).toEqual({ x: 11, y: 13 });
        expect(service.selection.width).toEqual(10);
        expect(service.selection.height).toEqual(14);
    });

    it(' scaleSelection should update a selection according to the control point selected and if shift is pressed (left + shift)', () => {
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.ellipseRadian = { x: 5, y: 5 };
        service.selection.width = 10;
        service.selection.height = 10;
        service['shiftPressed'] = true;
        service['controlPointName'] = ControlPointName.left;

        service['scaleSelection']({ x: 2, y: 2 });

        expect(service.selection.ellipseRadian).toEqual({ x: 3, y: 5 });
        expect(service.selection.imagePosition).toEqual({ x: 3, y: 1 });
        expect(service.selection.endingPos).toEqual({ x: 9, y: 11 });
        expect(service.selection.width).toEqual(6);
        expect(service.selection.height).toEqual(10);
    });

    it(' scaleSelection should update a selection according to the control point selected and if shift is pressed (right + shift)', () => {
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.ellipseRadian = { x: 5, y: 5 };
        service.selection.width = 10;
        service.selection.height = 10;
        service['shiftPressed'] = true;
        service['controlPointName'] = ControlPointName.right;

        service['scaleSelection']({ x: 2, y: 2 });

        expect(service.selection.ellipseRadian).toEqual({ x: 7, y: 5 });
        expect(service.selection.imagePosition).toEqual({ x: -1, y: 1 });
        expect(service.selection.endingPos).toEqual({ x: 13, y: 11 });
        expect(service.selection.width).toEqual(14);
        expect(service.selection.height).toEqual(10);
    });

    it(' scaleSelection should update a selection according to the control point selected and if shift is pressed (top left + shift)', () => {
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.ellipseRadian = { x: 5, y: 5 };
        service.selection.width = 10;
        service.selection.height = 10;
        service['shiftPressed'] = true;
        service['controlPointName'] = ControlPointName.topLeft;

        service['scaleSelection']({ x: 2, y: 2 });

        expect(service.selection.ellipseRadian).toEqual({ x: 3, y: 3 });
        expect(service.selection.imagePosition).toEqual({ x: 3, y: 3 });
        expect(service.selection.endingPos).toEqual({ x: 9, y: 9 });
        expect(service.selection.width).toEqual(6);
        expect(service.selection.height).toEqual(6);
    });

    it(' scaleSelection should update a selection according to the control point selected and if shift is pressed (top right + shift)', () => {
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.ellipseRadian = { x: 5, y: 5 };
        service.selection.width = 10;
        service.selection.height = 10;
        service['shiftPressed'] = true;
        service['controlPointName'] = ControlPointName.topRight;

        service['scaleSelection']({ x: 2, y: 2 });

        expect(service.selection.ellipseRadian).toEqual({ x: 7, y: 3 });
        expect(service.selection.imagePosition).toEqual({ x: -1, y: 3 });
        expect(service.selection.endingPos).toEqual({ x: 13, y: 9 });
        expect(service.selection.width).toEqual(14);
        expect(service.selection.height).toEqual(6);
    });

    it(' scaleSelection should update a selection according to the control point selected and if shift is pressed (bottom right + shift)', () => {
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.ellipseRadian = { x: 5, y: 5 };
        service.selection.width = 10;
        service.selection.height = 10;
        service['shiftPressed'] = true;
        service['controlPointName'] = ControlPointName.bottomRight;

        service['scaleSelection']({ x: 2, y: 2 });

        expect(service.selection.ellipseRadian).toEqual({ x: 7, y: 7 });
        expect(service.selection.imagePosition).toEqual({ x: -1, y: -1 });
        expect(service.selection.endingPos).toEqual({ x: 13, y: 13 });
        expect(service.selection.width).toEqual(14);
        expect(service.selection.height).toEqual(14);
    });

    it(' scaleSelection should update a selection according to the control point selected and if shift is pressed (bottom left + shift)', () => {
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.ellipseRadian = { x: 5, y: 5 };
        service.selection.width = 10;
        service.selection.height = 10;
        service['shiftPressed'] = true;
        service['controlPointName'] = ControlPointName.bottomLeft;

        service['scaleSelection']({ x: 2, y: 2 });

        expect(service.selection.ellipseRadian).toEqual({ x: 3, y: 7 });
        expect(service.selection.imagePosition).toEqual({ x: 3, y: -1 });
        expect(service.selection.endingPos).toEqual({ x: 9, y: 13 });
        expect(service.selection.width).toEqual(6);
        expect(service.selection.height).toEqual(14);
    });

    it(' flip image should call saveFlippedImage with the appropriate scale (diagonal)', () => {
        saveFlippedImageSpy = spyOn<any>(service, 'saveFlippedImage');

        service.selection.imageSize = { x: 10, y: 10 };
        service.selection.width = -10;
        service.selection.height = -10;
        service['flip'] = FlipDirection.none;

        service['flipImage']();

        expect(saveFlippedImageSpy).toHaveBeenCalledWith({ x: -1, y: -1 }, service.selection.imageSize);
    });

    it(' flip image should call saveFlippedImage with the appropriate scale (vertical)', () => {
        saveFlippedImageSpy = spyOn<any>(service, 'saveFlippedImage');

        service.selection.imageSize = { x: 10, y: 10 };
        service.selection.width = 10;
        service.selection.height = -10;
        service['flip'] = FlipDirection.none;

        service['flipImage']();

        expect(saveFlippedImageSpy).toHaveBeenCalledWith({ x: 1, y: -1 }, { x: 0, y: service.selection.imageSize.y });
    });

    it(' flip image should call saveFlippedImage with the appropriate scale (horizontal)', () => {
        saveFlippedImageSpy = spyOn<any>(service, 'saveFlippedImage');

        service.selection.imageSize = { x: 10, y: 10 };
        service.selection.width = -10;
        service.selection.height = 10;
        service['flip'] = FlipDirection.none;

        service['flipImage']();

        expect(saveFlippedImageSpy).toHaveBeenCalledWith({ x: -1, y: 1 }, { x: service.selection.imageSize.x, y: 0 });
    });

    it(' flip image should call saveFlippedImage with the appropriate scale (none)', () => {
        saveFlippedImageSpy = spyOn<any>(service, 'saveFlippedImage');

        service.selection.imageSize = { x: 10, y: 10 };
        service.selection.width = 10;
        service.selection.height = 10;
        service['flip'] = FlipDirection.vertical;

        service['flipImage']();

        expect(saveFlippedImageSpy).toHaveBeenCalledWith({ x: 1, y: 1 }, { x: 0, y: 0 });
    });

    it(' saveFlippedImage should create a flipped image', () => {
        selectionGetImageURLSpy = spyOn<any>(service.selection, 'getImageURL');

        service.selection.imageSize = { x: 10, y: 10 };
        service['baseImage'] = new Image();
        service['saveFlippedImage']({ x: 1, y: 1 }, { x: 0, y: 0 });

        expect(selectionGetImageURLSpy).toHaveBeenCalled();
    });
});
