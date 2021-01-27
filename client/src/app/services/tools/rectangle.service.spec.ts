/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { SubToolSelected } from '@app/classes/sub-tool-selected';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from '@app/services/tools/rectangle.service';

// tslint:disable:no-any
describe('Service: Rectangle', () => {
    let service: RectangleService;
    let mouseEvent: MouseEvent;
    let shiftEvent: KeyboardEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let colorServiceSpy: jasmine.SpyObj<ColorService>;
    let drawFillRectangleSpy: jasmine.Spy<any>;
    let drawRectangleOutlineSpy: jasmine.Spy<any>;
    let drawFillRectangleOutlineSpy: jasmine.Spy<any>;
    let onMouseUpSpy: jasmine.Spy<any>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'clearEffectTool']);
        colorServiceSpy = jasmine.createSpyObj('ColorService', ['getprimaryColor', 'getsecondaryColor']);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: ColorService, useValue: colorServiceSpy },
            ],
        });
        service = TestBed.inject(RectangleService);
        drawFillRectangleSpy = spyOn<any>(service, 'drawFillRectangle').and.callThrough();
        drawRectangleOutlineSpy = spyOn<any>(service, 'drawRectangleOutline').and.callThrough();
        drawFillRectangleOutlineSpy = spyOn<any>(service, 'drawFillRectangleOutline').and.callThrough();
        onMouseUpSpy = spyOn<any>(service, 'onMouseUp').and.callThrough();

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesn't copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;

        shiftEvent = new KeyboardEvent('keypress', {
            key: 'Shift',
        });
    });

    it('should be created', inject([RectangleService], (serviceRec: RectangleService) => {
        expect(serviceRec).toBeTruthy();
    }));

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoords).toEqual(expectedResult);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 1,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it('switch  rectangle tool 1', () => {
        service.subToolSelect = SubToolSelected.tool1;
        service.onMouseDown(mouseEvent);
        expect(service.subToolSelect).toEqual(SubToolSelected.tool1);
    });
    it('switch  rectangle tool 2', () => {
        service.subToolSelect = SubToolSelected.tool2;
        service.onMouseDown(mouseEvent);
        expect(service.subToolSelect).toEqual(SubToolSelected.tool2);
    });
    it('switch  rectangle tool 3', () => {
        service.subToolSelect = SubToolSelected.tool3;
        service.onMouseDown(mouseEvent);
        expect(service.subToolSelect).toEqual(SubToolSelected.tool3);
    });

    it(' onMouseUp should not call drawFillRectangle if mouse is already up ', () => {
        service.subToolSelect = SubToolSelected.tool1;
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseUp(mouseEvent);
        expect(drawFillRectangleSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp should call drawFillRectangle if mouse was already down and tool1 selected', () => {
        service.subToolSelect = SubToolSelected.tool1;
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(drawFillRectangleSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should call drawFillRectangle if mouse was already down and tool2 selected', () => {
        service.subToolSelect = SubToolSelected.tool2;
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(drawRectangleOutlineSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should call drawFillRectangle if mouse was already down and tool3 selected', () => {
        service.subToolSelect = SubToolSelected.tool3;
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(drawFillRectangleOutlineSpy).toHaveBeenCalled();
    });

    it(' pressing shift should change square value to true', () => {
        service.onMouseDown(mouseEvent);
        service.onShiftKeyDown(shiftEvent);
        expect(service.square).toEqual(true);
    });

    it(' onMouseMove should call drawFillRectangle if mouse was already down', () => {
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = true;
        service.subToolSelect = SubToolSelected.tool1;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawFillRectangleSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call drawFillRectangle if mouse was not already down', () => {
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawFillRectangleSpy).not.toHaveBeenCalled();
    });

    it(' onShiftKeyUp should call drawFillRectangle if mouse was already down and tool1 selected', () => {
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = true;
        service.subToolSelect = SubToolSelected.tool1;
        service.mousePosition = service.getPositionFromMouse(mouseEvent);
        service.onShiftKeyUp(shiftEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawFillRectangleSpy).toHaveBeenCalled();
    });

    it(' onShiftKeyUp should not call drawFillRectangle if mouse was not already down and tool1 selected', () => {
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = false;
        service.onMouseMove(mouseEvent);
        service.onShiftKeyUp(shiftEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawFillRectangleSpy).not.toHaveBeenCalled();
    });

    it(' onShiftKeyDown should call drawFillRectangle if mouse was already down and tool1 selected', () => {
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = true;
        service.subToolSelect = SubToolSelected.tool1;
        service.mousePosition = service.getPositionFromMouse(mouseEvent);
        service.onShiftKeyDown(shiftEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawFillRectangleSpy).toHaveBeenCalled();
    });

    it(' onShiftKeyDown should not call drawFillRectangle if mouse was not already down and tool1 selected', () => {
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = false;
        service.onMouseMove(mouseEvent);
        service.onShiftKeyDown(shiftEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawFillRectangleSpy).not.toHaveBeenCalled();
    });

    it(' onShiftKeyUp should call drawFillRectangle if mouse was already down and tool2 selected', () => {
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = true;
        service.subToolSelect = SubToolSelected.tool2;
        service.mousePosition = service.getPositionFromMouse(mouseEvent);
        service.onShiftKeyUp(shiftEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawRectangleOutlineSpy).toHaveBeenCalled();
    });

    it(' onShiftKeyUp should not call drawFillRectangle if mouse was not already down and tool2 selected', () => {
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = false;
        service.onMouseMove(mouseEvent);
        service.onShiftKeyUp(shiftEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawRectangleOutlineSpy).not.toHaveBeenCalled();
    });

    it(' onShiftKeyDown should call drawFillRectangle if mouse was already down and tool2 selected', () => {
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = true;
        service.subToolSelect = SubToolSelected.tool2;
        service.mousePosition = service.getPositionFromMouse(mouseEvent);
        service.onShiftKeyDown(shiftEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawRectangleOutlineSpy).toHaveBeenCalled();
    });

    it(' onShiftKeyDown should not call drawFillRectangle if mouse was not already down and tool2 selected', () => {
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = false;
        service.onMouseMove(mouseEvent);
        service.onShiftKeyDown(shiftEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawRectangleOutlineSpy).not.toHaveBeenCalled();
    });

    it(' onShiftKeyUp should call drawFillRectangle if mouse was already down and tool3 selected', () => {
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = true;
        service.subToolSelect = SubToolSelected.tool3;
        service.mousePosition = service.getPositionFromMouse(mouseEvent);
        service.onShiftKeyUp(shiftEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawFillRectangleOutlineSpy).toHaveBeenCalled();
    });

    it(' onShiftKeyUp should not call drawFillRectangle if mouse was not already down and tool3 selected', () => {
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = false;
        service.onMouseMove(mouseEvent);
        service.onShiftKeyUp(shiftEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawFillRectangleOutlineSpy).not.toHaveBeenCalled();
    });

    it(' onShiftKeyDown should call drawFillRectangle if mouse was already down and tool1 selected', () => {
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = true;
        service.subToolSelect = SubToolSelected.tool3;
        service.mousePosition = service.getPositionFromMouse(mouseEvent);
        service.onShiftKeyDown(shiftEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawFillRectangleOutlineSpy).toHaveBeenCalled();
    });

    it(' onShiftKeyDown should not call drawFillRectangle if mouse was not already down and tool1 selected', () => {
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = false;
        service.onMouseMove(mouseEvent);
        service.onShiftKeyDown(shiftEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawFillRectangleOutlineSpy).not.toHaveBeenCalled();
    });

    it(' onMouseDown should call onMouseUp if the mouse enter the canvas', () => {
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseEnter = true;
        service.onMouseDown(mouseEvent);
        expect(onMouseUpSpy).toHaveBeenCalled();
    });

    it(' should change mouseOut value to true when the mouse is living the canvas while left click is pressed', () => {
        service.mouseDown = true;
        service.onMouseOut(mouseEvent);
        expect(service.mouseOut).toEqual(true);
    });

    it(' should not change mouseOut value to true when the mouse is living the canvas while left click is not pressed', () => {
        service.mouseDown = false;
        service.onMouseOut(mouseEvent);
        expect(service.mouseOut).toEqual(false);
    });

    it(' should change mouseEnter value to true when the mouse is entering the canvas after leaving it while drawing', () => {
        service.mouseOut = true;
        service.onMouseEnter(mouseEvent);
        expect(service.mouseEnter).toEqual(true);
    });

    it(' should not change mouseEnter value to true when the mouse is entering the canvas after leaving it while not drawing', () => {
        service.mouseOut = false;
        service.onMouseEnter(mouseEvent);
        expect(service.mouseEnter).toEqual(false);
    });
});
