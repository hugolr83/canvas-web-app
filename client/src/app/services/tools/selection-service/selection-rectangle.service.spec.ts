import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ControlGroup } from '@app/classes/control-group';
import { ControlPointName } from '@app/classes/control-points';
import { MouseButton } from '@app/classes/mouse-button';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/tools/grid.service';
import { MagnetismService } from '@app/services/tools/magnetism.service';
import { RotationService } from '@app/services/tools/selection-service/rotation.service';
import { SelectionRectangleService } from '@app/services/tools/selection-service/selection-rectangle.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Subscription } from 'rxjs';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal
// tslint:disable:prefer-const

describe('Service: SelectionRectangle', () => {
    let service: SelectionRectangleService;

    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let drawSelectionRectSpy: jasmine.Spy<any>;
    let drawImageSpy: jasmine.Spy<any>;
    let drawPreviewRect: jasmine.Spy<any>;
    let pasteSelectionSpy: jasmine.Spy<any>;

    let magnetismStub: MagnetismService;
    let rotationStub: RotationService;
    let undoStub: UndoRedoService;
    let gridStub: GridService;

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
                SelectionRectangleService,
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: MagnetismService, useValue: magnetismStub },
                { provide: RotationService, useValue: rotationStub },
                { provide: UndoRedoService, useValue: undoStub },
            ],
        });

        service = TestBed.inject(SelectionRectangleService);

        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas as HTMLCanvasElement;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseDown should save the mouse down coords as imagePosition when starting a selection', () => {
        drawServiceSpy.isPreviewCanvasBlank.and.returnValue(true);
        spyOn<any>(service, 'getPositionFromMouse').and.returnValue({ x: 10, y: 10 });
        let mouseEvent = { x: 10, y: 10, button: MouseButton.Left } as MouseEvent;
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

        let mouseEvent = { x: 10, y: 10, button: MouseButton.Left } as MouseEvent;
        service.selection.image = new Image();
        service.selection.endingPos = { x: 20, y: 20 };
        service.onMouseDown(mouseEvent);
        expect(pasteSelectionSpy).toHaveBeenCalled();
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

    it(' updateSelectionPosition should update the selection position to keep imagePosition in the top left and endingPos in the bottom right of the selection with shift pressed', () => {
        service.selection.imagePosition = { x: 11, y: 1 };
        service.selection.endingPos = { x: 1, y: 11 };
        service.selection.width = 10;
        service.selection.height = 10;
        service['shiftPressed'] = true;

        expect(service['updateSelectionPositions']()).toEqual({ x: 1, y: 1 });
    });

    it(' updateSelectionPosition should update the selection position to keep imagePosition in the top left and endingPos in the bottom right of the selection with shift pressed', () => {
        service.selection.imagePosition = { x: 11, y: 11 };
        service.selection.endingPos = { x: 1, y: 1 };
        service.selection.width = 10;
        service.selection.height = 10;
        service['shiftPressed'] = true;

        expect(service['updateSelectionPositions']()).toEqual({ x: 1, y: 1 });
    });

    it(' updateSelectionPosition should update the selection position to keep imagePosition in the top left and endingPos in the bottom right of the selection with shift pressed', () => {
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.width = 10;
        service.selection.height = 10;
        service['shiftPressed'] = true;

        expect(service['updateSelectionPositions']()).toEqual({ x: 1, y: 1 });
    });

    it(' updateSelectionPosition should update the selection position to keep imagePosition in the top left and endingPos in the bottom right of the selection with shift pressed', () => {
        service.selection.imagePosition = { x: 1, y: 11 };
        service.selection.endingPos = { x: 11, y: 1 };
        service.selection.width = 10;
        service.selection.height = 10;
        service['shiftPressed'] = true;

        expect(service['updateSelectionPositions']()).toEqual({ x: 1, y: 1 });
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

    it('pasteSelection should draw the selection in the base canvas', () => {
        drawImageSpy = spyOn<any>(service['drawingService'].baseCtx, 'drawImage');

        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.width = 10;
        service.selection.height = 10;
        service.selection.imageData = new ImageData(10, 10);
        service.selection.image = new Image();

        service.pasteSelection(service.selection);

        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('drawPreview should call drawPreviewRect', () => {
        drawPreviewRect = spyOn<any>(service, 'drawPreviewRect');

        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.width = 10;
        service.selection.height = 10;
        service.selection.imageData = new ImageData(10, 10);
        service.selection.image = new Image();

        service['drawPreview']();

        expect(drawPreviewRect).toHaveBeenCalled();
    });

    it('clearSelection should draw a white rectangle in the selection initial position', () => {
        const fillRectSpy = spyOn<any>(service['drawingService'].baseCtx, 'fillRect');

        service.clearSelection();

        expect(fillRectSpy).toHaveBeenCalled();
    });
});
