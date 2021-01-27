/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ControlGroup } from '@app/classes/control-group';
import { ControlPointName } from '@app/classes/control-points';
import { MouseButton } from '@app/classes/mouse-button';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/tools/grid.service';
import { MagnetismService } from '@app/services/tools/magnetism.service';
import { RotationService } from '@app/services/tools/selection-service/rotation.service';
import { SelectionEllipseService } from '@app/services/tools/selection-service/selection-ellipse.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Subscription } from 'rxjs/internal/Subscription';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal
// tslint:disable:no-shadowed-variable
// tslint:disable:prefer-const

describe('Service: SelectionRectangle', () => {
    let service: SelectionEllipseService;

    let magnetismStub: MagnetismService;
    let rotationStub: RotationService;
    let undoStub: UndoRedoService;
    let gridStub: GridService;
    let drawSelectionRectSpy: jasmine.Spy<any>;
    let drawImageSpy: jasmine.Spy<any>;
    let drawEllipseSpy: jasmine.Spy<any>;
    let drawPreviewRect: jasmine.Spy<any>;
    let ellipseSpy: jasmine.Spy<any>;

    let pasteSelectionSpy: jasmine.Spy<any>;

    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'isPreviewCanvasBlank']);

        magnetismStub = new MagnetismService(gridStub);
        gridStub = new GridService(drawServiceSpy);
        undoStub = new UndoRedoService(drawServiceSpy);
        rotationStub = new RotationService(drawServiceSpy);

        TestBed.configureTestingModule({
            providers: [
                SelectionEllipseService,
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: MagnetismService, useValue: magnetismStub },
                { provide: RotationService, useValue: rotationStub },
                { provide: UndoRedoService, useValue: undoStub },
            ],
        });

        service = TestBed.inject(SelectionEllipseService);

        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesn't copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas as HTMLCanvasElement;
    });

    it('should be created', inject([SelectionEllipseService], (service: SelectionEllipseService) => {
        expect(service).toBeTruthy();
    }));

    it('onMouseDown should not do anything if its the right mouse button that is pressed', () => {
        drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
        pasteSelectionSpy = spyOn<any>(service, 'pasteSelection');
        spyOn<any>(service, 'getPositionFromMouse').and.returnValue({ x: 10, y: 10 });
        spyOn<any>(service, 'isInsideSelectionCoords').and.returnValue(false);

        service['controlGroup'] = new ControlGroup(drawServiceSpy);
        spyOn<any>(service['controlGroup'], 'isInControlPoint').and.returnValue(ControlPointName.none);

        const mouseEvent = { x: 10, y: 10, button: MouseButton.Right } as MouseEvent;
        service.selection.image = new Image();
        service.selection.endingPos = { x: 20, y: 20 };
        service.onMouseDown(mouseEvent);
        expect(pasteSelectionSpy).not.toHaveBeenCalled();
    });

    it('onMouseDown should save the mouse down coords as imagePosition when starting a selection', () => {
        drawServiceSpy.isPreviewCanvasBlank.and.returnValue(true);
        spyOn<any>(service, 'getPositionFromMouse').and.returnValue({ x: 10, y: 10 });
        const mouseEvent = { x: 10, y: 10, button: MouseButton.Left } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(service.selection.imagePosition).toEqual({ x: 10, y: 10 });
    });

    it('onMouseDown should paste a selection if the user click outside of the selection', () => {
        drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
        pasteSelectionSpy = spyOn<any>(service, 'pasteSelection');
        spyOn<any>(service, 'getPositionFromMouse').and.returnValue({ x: 10, y: 10 });
        spyOn<any>(service, 'isInsideSelectionCoords').and.returnValue(false);

        service['controlGroup'] = new ControlGroup(drawServiceSpy);
        spyOn<any>(service['controlGroup'], 'isInControlPoint').and.returnValue(ControlPointName.none);

        const mouseEvent = { x: 10, y: 10, button: MouseButton.Left } as MouseEvent;
        service.selection.image = new Image();
        service.selection.endingPos = { x: 20, y: 20 };
        service.onMouseDown(mouseEvent);
        expect(pasteSelectionSpy).toHaveBeenCalled();
    });

    it('onMouseDown should paste a rectangle selection if the entire canvas is selected', () => {
        drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
        pasteSelectionSpy = spyOn<any>(service, 'pasteSelection');
        spyOn<any>(service, 'getPositionFromMouse').and.returnValue({ x: 10, y: 10 });
        spyOn<any>(service, 'isInsideSelectionCoords').and.returnValue(false);

        service['controlGroup'] = new ControlGroup(drawServiceSpy);
        spyOn<any>(service['controlGroup'], 'isInControlPoint').and.returnValue(ControlPointName.none);

        service['isAllSelect'] = true;
        const mouseEvent = { x: 10, y: 10, button: MouseButton.Left } as MouseEvent;
        service.selection.image = new Image();
        service.selection.endingPos = { x: 20, y: 20 };
        service.onMouseDown(mouseEvent);
        expect(pasteSelectionSpy).not.toHaveBeenCalled();
    });

    it('onKeyEscape should paste a selection if the selection is drawn', () => {
        drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
        service.mouseDown = true;
        pasteSelectionSpy = spyOn<any>(service, 'pasteSelection');
        service['upArrow'].timerStarted = true;
        service['downArrow'].timerStarted = true;
        service['leftArrow'].timerStarted = true;
        service['rightArrow'].timerStarted = true;
        service['timerStarted'] = true;

        service['upArrow'].subscription = new Subscription();
        service['downArrow'].subscription = new Subscription();
        service['leftArrow'].subscription = new Subscription();
        service['rightArrow'].subscription = new Subscription();
        service['subscriptionTimer'] = new Subscription();

        const upSubscription = spyOn<any>(service['upArrow'].subscription, 'unsubscribe');
        const downSubscription = spyOn<any>(service['downArrow'].subscription, 'unsubscribe');
        const leftSubscription = spyOn<any>(service['leftArrow'].subscription, 'unsubscribe');
        const rightSubscription = spyOn<any>(service['rightArrow'].subscription, 'unsubscribe');
        const timerSubscription = spyOn<any>(service['subscriptionTimer'], 'unsubscribe');

        service.selection.image = new Image();

        service.onKeyEscape();

        expect(pasteSelectionSpy).toHaveBeenCalled();
        expect(upSubscription).toHaveBeenCalled();
        expect(downSubscription).toHaveBeenCalled();
        expect(leftSubscription).toHaveBeenCalled();
        expect(rightSubscription).toHaveBeenCalled();
        expect(timerSubscription).toHaveBeenCalled();
    });

    it('onKeyEscape should paste a rectangle selection if the entire canvas is selected', () => {
        service.mouseDown = true;
        pasteSelectionSpy = spyOn<any>(service, 'pasteSelection');
        service['isAllSelect'] = true;

        service.selection.image = new Image();

        service.onKeyEscape();

        expect(pasteSelectionSpy).not.toHaveBeenCalled();
    });

    it('drawSelection should draw the selection and its surrounding rectangle', () => {
        drawSelectionRectSpy = spyOn<any>(service, 'drawSelectionRect');
        drawImageSpy = spyOn<any>(service['drawingService'].previewCtx, 'drawImage');
        spyOn<any>(service, 'flipImage');
        service['scaled'] = true;

        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.width = 10;
        service.selection.height = 10;
        service.selection.imageData = new ImageData(10, 10);
        service.selection.image = new Image();

        service.drawSelection({ x: 1, y: 1 });

        expect(drawSelectionRectSpy).toHaveBeenCalled();
        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('drawSelection should call drawSelectionAll if the all canvas is selected', () => {
        const drawSelectionAllSpy = spyOn<any>(service, 'drawSelectionAll');
        service['isAllSelect'] = true;

        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.width = 10;
        service.selection.height = 10;
        service.selection.imageData = new ImageData(10, 10);
        service.selection.image = new Image();

        service.drawSelection({ x: 1, y: 1 });

        expect(drawSelectionAllSpy).toHaveBeenCalled();
    });

    it('drawSelectionAll should draw the selection the size of the entire canvas and the rectangle around it', () => {
        drawSelectionRectSpy = spyOn<any>(service, 'drawSelectionRect');
        drawImageSpy = spyOn<any>(service['drawingService'].previewCtx, 'drawImage');

        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.width = 10;
        service.selection.height = 10;
        service.selection.imageData = new ImageData(10, 10);
        service.selection.image = new Image();

        service['drawSelectionAll']();

        expect(drawSelectionRectSpy).toHaveBeenCalled();
        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('pasteSelection should draw the ellipse selection in the base canvas', () => {
        drawImageSpy = spyOn<any>(service['drawingService'].baseCtx, 'drawImage');
        drawEllipseSpy = spyOn<any>(service, 'drawEllipse');
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.width = 10;
        service.selection.height = 10;
        service.selection.imageData = new ImageData(10, 10);
        service.selection.image = new Image();

        service.pasteSelection(service.selection);

        expect(drawEllipseSpy).toHaveBeenCalled();
        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('pasteSelection should draw a rectangle selection in the base canvas if all the canvas is selected', () => {
        drawEllipseSpy = spyOn<any>(service, 'drawEllipse');
        service['isAllSelect'] = true;
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.width = 10;
        service.selection.height = 10;
        service.selection.imageData = new ImageData(10, 10);
        service.selection.image = new Image();

        service.pasteSelection(service.selection);

        expect(drawEllipseSpy).not.toHaveBeenCalled();
    });

    it('drawPreview should call drawPreviewRect and draw the ellipse surrounding the selection', () => {
        drawPreviewRect = spyOn<any>(service, 'drawPreviewRect');
        drawEllipseSpy = spyOn<any>(service, 'drawEllipse');

        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.width = 10;
        service.selection.height = 10;
        service.selection.imageData = new ImageData(10, 10);
        service.selection.image = new Image();
        service['shiftPressed'] = false;

        service['drawPreview']();

        expect(drawPreviewRect).toHaveBeenCalled();
        expect(drawEllipseSpy).toHaveBeenCalled();
    });

    it('drawPreview should call drawPreviewRect and draw the circle surrounding the selection', () => {
        drawPreviewRect = spyOn<any>(service, 'drawPreviewRect');
        drawEllipseSpy = spyOn<any>(service, 'drawEllipse');

        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.width = 10;
        service.selection.height = 10;
        service.selection.imageData = new ImageData(10, 10);
        service.selection.image = new Image();
        service['shiftPressed'] = true;

        service['drawPreview']();

        expect(drawPreviewRect).toHaveBeenCalled();
        expect(drawEllipseSpy).toHaveBeenCalled();
    });

    it('drawEllipse should draw an ellipse in the appropriate canvas', () => {
        ellipseSpy = spyOn<any>(service['drawingService'].previewCtx, 'ellipse');

        service.selection.ellipseRadian = { x: 5, y: 5 };

        service['drawEllipse'](service['drawingService'].previewCtx, { x: 10, y: 10 }, 5, 5);

        expect(ellipseSpy).toHaveBeenCalled();
    });

    it('clearSelection should draw a white rectangle in the selection initial position if all the canvas is selected', () => {
        const fillRectSpy = spyOn<any>(service['drawingService'].baseCtx, 'fillRect');
        service['isAllSelect'] = true;
        service.clearSelection();

        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('clearSelection should draw a white ellipse in the selection initial position', () => {
        drawEllipseSpy = spyOn<any>(service, 'drawEllipse');
        service['isAllSelect'] = false;
        service.clearSelection();

        expect(drawEllipseSpy).toHaveBeenCalled();
    });
});
