import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/classes/mouse-button';
import { SubToolSelected } from '@app/classes/sub-tool-selected';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BrushService } from './brush.service';

// tslint:disable:no-any
// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers

describe('BrushService', () => {
    let service: BrushService;
    let mouseEvent: MouseEvent;
    let mouseEvent1: MouseEvent;
    let mouseEventRight: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let subToolSelected: SubToolSelected;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawLineSpy: jasmine.Spy<any>;
    let drawBrushToolSpy: jasmine.Spy<any>;
    let drawLineBrushSpy: jasmine.Spy<any>;
    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        subToolSelected = SubToolSelected.tool2;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: AutomaticSaveService, useValue: { save: () => '' } },
            ],
        });
        service = TestBed.inject(BrushService);
        drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();
        drawBrushToolSpy = spyOn<any>(service, 'drawBrushTool4').and.callThrough();
        drawLineBrushSpy = spyOn<any>(service, 'drawLineBrush5').and.callThrough();
        service.subToolSelect = SubToolSelected.tool1;
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 10,
            button: MouseButton.Left,
        } as MouseEvent;
        mouseEvent1 = {
            offsetX: 25,
            offsetY: 12,
            button: MouseButton.Left,
        } as MouseEvent;
        mouseEventRight = {
            offsetX: 10,
            offsetY: 25,
            button: MouseButton.Right,
        } as MouseEvent;
    });

    it('should be created', inject([BrushService], (serviceRec: BrushService) => {
        expect(serviceRec).toBeTruthy();
    }));

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 10 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoords).toEqual(expectedResult);
    });
    it(' mouseDown should set mouseDown property to true on left click and right click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });
    it(' mouseDown should set mouseDown property to false on  right click', () => {
        service.onMouseDown(mouseEventRight);
        expect(service.mouseDown).toEqual(false);
    });
    it('switch  brush tool 1', () => {
        service.subToolSelect = SubToolSelected.tool1;
        service.onMouseDown(mouseEvent);
        expect(service.subToolSelect).toEqual(SubToolSelected.tool1);
    });
    it('switch  brush tool 2', () => {
        service.subToolSelect = SubToolSelected.tool1;
        service.subToolSelect = subToolSelected;
        service.onMouseDown(mouseEvent);
        expect(service.subToolSelect).toEqual(subToolSelected);
    });
    it('switch  brush tool 3', () => {
        service.subToolSelect = SubToolSelected.tool3;
        service.onMouseDown(mouseEvent);
        expect(service.subToolSelect).toEqual(SubToolSelected.tool3);
    });
    it('switch  brush tool 4', () => {
        service.subToolSelect = SubToolSelected.tool4;
        service.onMouseDown(mouseEvent);
        expect(service.subToolSelect).toEqual(SubToolSelected.tool4);
    });
    it('switch  brush tool 5', () => {
        service.subToolSelect = SubToolSelected.tool5;
        service.onMouseDown(mouseEvent);
        expect(service.subToolSelect).toEqual(SubToolSelected.tool5);
    });
    it(' onMouseUp should call drawLine if mouse was already down', () => {
        service.subToolSelect = SubToolSelected.tool1;
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawLine if mouse was not already down', () => {
        service.subToolSelect = SubToolSelected.tool1;
        service.mouseDown = false;
        service.mouseDownCoords = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawLine if mouse was already down', () => {
        service.subToolSelect = SubToolSelected.tool1;
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = true;
        // const mousePos = service.getPositionFromMouse(mouseEvent);
        // @ts-ignore
        // BrushService['mouseOut'] = true;
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
        // @ts-ignore
        // expect(BrushService['lastPoint'].toEqual(mousePos));
    });

    it(' onMouseMove should not call drawLine if mouse was not already down', () => {
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = false;
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp should call drawBrushToolSpy if mouse was already down tool4', () => {
        service.subToolSelect = SubToolSelected.tool4;
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(drawBrushToolSpy).toHaveBeenCalled();
    });

    it(' onMouseMove and onMouseUp should call drawBrushToolSpy if mouse was already down tool4', () => {
        service.subToolSelect = SubToolSelected.tool4;
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseMove(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawBrushToolSpy).toHaveBeenCalled();
    });
    it(' onMouseMove and onMouseUp should call drawBrushToolSpy if mouse exit canvas was already down tool4', () => {
        service.subToolSelect = SubToolSelected.tool4;
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseMove(mouseEvent);
        service.onMouseOut(mouseEvent1);
        service.onMouseMove(mouseEvent);
        expect(drawBrushToolSpy).toHaveBeenCalled();
    });

    it(' onMouseMove and onMouseUp should call drawBrushToolSpy if mouse exit canvas was already down tool3', () => {
        service.subToolSelect = SubToolSelected.tool3;
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseMove(mouseEvent);
        service.onMouseOut(mouseEvent1);
        expect(drawLineSpy).toHaveBeenCalled();
    });
    it('onMouseMove and onMouseUp should call drawLineBrushSpy if mouse was already down tool5 ', () => {
        service.subToolSelect = SubToolSelected.tool5;
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseMove(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawLineBrushSpy).toHaveBeenCalled();
    });

    it('onMouseMove and onMouseUp should call drawLineSpy if mouse was already down 6 si def', () => {
        const tool6 = 6; // tools exite pas
        service.subToolSelect = tool6;
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseMove(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });
    it('onMouseMove and onMouseUp should call drawLineSpy if mouse was already down 3', () => {
        service.subToolSelect = SubToolSelected.tool3;
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseMove(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });
    it('onMouseMove and onMouseUp should call drawLineSpy if mouse was already down 2', () => {
        service.subToolSelect = SubToolSelected.tool2;
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseMove(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });
    it('onMouseDown and onMouseUp should call drawLineSpy if mouse was already down 3', () => {
        service.subToolSelect = SubToolSelected.tool3;
        service.mouseDownCoords = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseMove(mouseEvent1);
        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });
    it('exit and over de canvas not downMasse if false', () => {
        service.onMouseOut(mouseEvent);
        service.onMouseEnter(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
        expect(drawBrushToolSpy).not.toHaveBeenCalled();
    });
    it('Mouse exit or over of canvas not downMasse ', () => {
        service.onMouseDown(mouseEvent1);
        service.onMouseOut(mouseEvent);
        service.onMouseEnter(mouseEvent);
        service.onMouseUp(mouseEvent1);
        expect(drawLineSpy).toHaveBeenCalled();
    });
    it('Mouse exit and over canvas not downMasse ', () => {
        service.subToolSelect = SubToolSelected.tool4;
        service.onMouseDown(mouseEvent1);
        service.onMouseOut(mouseEvent);
        service.onMouseEnter(mouseEvent);
        expect(drawBrushToolSpy).toHaveBeenCalled();
    });
    it('onMouseEnter ', () => {
        service['mouseOut'] = true;
        service['mouseDown'] = true;
        const spy = spyOn(service, 'onMouseEnter').and.callThrough();
        service.onMouseEnter(mouseEvent);
        expect(spy).toHaveBeenCalled();
    });
});
