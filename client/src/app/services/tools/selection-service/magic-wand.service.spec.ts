/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ControlGroup } from '@app/classes/control-group';
import { ControlPointName } from '@app/classes/control-points';
import { MouseButton } from '@app/classes/mouse-button';
import { SelectionImage } from '@app/classes/selection';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { CanvasResizeService } from '@app/services/canvas/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/tools/grid.service';
import { MagnetismService } from '@app/services/tools/magnetism.service';
import { Bound, MagicWandService } from '@app/services/tools/selection-service/magic-wand.service';
import { RotationService } from '@app/services/tools/selection-service/rotation.service';
import { SelectionService } from '@app/services/tools/selection-service/selection-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Subscription } from 'rxjs/internal/Subscription';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:max-file-line-count
// tslint:disable:prefer-const
// tslint:disable:prettier
// tslint:disable:no-string-literal

describe('Service: MagicWand', () => {
    let magicWandService: MagicWandService;

    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let magnetismStub: MagnetismService;
    let rotationStub: RotationService;
    let undoRedoStub: UndoRedoService;
    let gridStub: GridService;
    let selectionStub: SelectionService;
    let controlMock: ControlGroup;
    let autoSave: AutomaticSaveService;
    let canvasResizerStub: CanvasResizeService;

    let canvas: HTMLCanvasElement;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'isPreviewCanvasBlank']);
        canvasResizerStub = new CanvasResizeService(gridStub, undoRedoStub);
        autoSave = new AutomaticSaveService(canvasResizerStub, drawServiceSpy,undoRedoStub);
        magicWandService = new MagicWandService(drawServiceSpy, magnetismStub, undoRedoStub, rotationStub, autoSave);
        magnetismStub = new MagnetismService(gridStub);
        gridStub = new GridService(drawServiceSpy);
        undoRedoStub = new UndoRedoService(drawServiceSpy);
        rotationStub = new RotationService(drawServiceSpy);
        selectionStub = new SelectionService(drawServiceSpy, magnetismStub, rotationStub, autoSave);

        controlMock = new ControlGroup(drawServiceSpy);
        selectionStub['controlGroup'] = controlMock;

        selectionStub.selection = new SelectionImage(drawServiceSpy);
        selectionStub.selection.image = new Image();

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: MagnetismService, useValue: magnetismStub },
                { provide: UndoRedoService, useValue: undoRedoStub },
                { provide: RotationService, useValue: rotationStub },
            ],
        });

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas as HTMLCanvasElement;
        canvas.height = 1000;
        canvas.width = 1000;

        canvasTestHelper.drawCanvas.width = 1000;
        canvasTestHelper.drawCanvas.height = 1000;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        drawServiceSpy.baseCtx = baseCtxStub;
        drawServiceSpy.previewCtx = previewCtxStub;
        drawServiceSpy.canvas = canvas;
    });

    it('should be created', () => {
        expect(magicWandService).toBeTruthy();
    });

    it('should call selectedFloodFill', () => {
        const mouseDownPos: Vec2 = { x: 10, y: 15 } as Vec2;
        const spy = spyOn<any>(magicWandService, 'selectedFloodFill').and.callThrough();
        magicWandService['selectedFloodFill'](mouseDownPos.x, mouseDownPos.y, { red: 0, green: 0, blue: 0, alpha: 1 });
        expect(spy).toHaveBeenCalled();
    });

    it('should call matchFillColor', () => {
        const firstColor = { red: 0, green: 0, blue: 0, alpha: 1 };
        const secondColor = { red: 0, green: 0, blue: 0, alpha: 1 };
        const spy = spyOn<any>(magicWandService, 'matchFillColor').and.callThrough();
        const returnValue = magicWandService['matchFillColor'](firstColor, secondColor);
        expect(spy).toHaveBeenCalled();
        expect(returnValue).toEqual(true);
    });

    it('should call selectAllSimilar', () => {
        const mouseDownPos: Vec2 = { x: 10, y: 15 } as Vec2;
        const spy = spyOn<any>(magicWandService, 'selectAllSimilar').and.callThrough();
        magicWandService['selectAllSimilar'](mouseDownPos.x, mouseDownPos.y, { red: 0, green: 0, blue: 0, alpha: 1 });
        expect(spy).toHaveBeenCalled();
    });

    it('should call preparePreviewLayer', () => {
        baseCtxStub.fillStyle = 'rgba(101, 231, 0, 1)';
        baseCtxStub.fillRect(0, 0, 10, 10);
        previewCtxStub.fillStyle = 'rgba(101, 231, 0, 1)';
        previewCtxStub.fillRect(0, 0, 10, 10);
        const spy = spyOn<any>(magicWandService, 'preparePreviewLayer').and.callThrough();
        magicWandService['preparePreviewLayer'](baseCtxStub.getImageData(0, 0, 1000, 1000));
        expect(spy).toHaveBeenCalled();
    });

    it('should call checkNotTransparentPixel', () => {
        const spy = spyOn<any>(magicWandService, 'checkNotTransparentPixel').and.callThrough();
        magicWandService['checkNotTransparentPixel'](baseCtxStub.getImageData(0, 0, 1000, 1000), 100, { red: 255, green: 255, blue: 255, alpha: 0 });
        expect(spy).toHaveBeenCalled();
    });

    it('should find upper bound', () => {
        previewCtxStub.fillStyle = 'rgba(101, 231, 0, 1)';
        previewCtxStub.fillRect(10, 10, 10, 10);
        const spy = spyOn<any>(magicWandService, 'findBound').and.callThrough();
        magicWandService['findBound'](Bound.UPPER, previewCtxStub.getImageData(0, 0, 1000, 1000));
        expect(spy).toHaveBeenCalled();
    });

    it('should find lower bound', () => {
        previewCtxStub.fillStyle = 'rgba(101, 231, 0, 1)';
        previewCtxStub.fillRect(10, 10, 10, 10);
        const spy = spyOn<any>(magicWandService, 'findBound').and.callThrough();
        magicWandService['findBound'](Bound.LOWER, previewCtxStub.getImageData(0, 0, 1000, 1000));
        expect(spy).toHaveBeenCalled();
    });

    it('should find left bound', () => {
        previewCtxStub.fillStyle = 'rgba(101, 231, 0, 1)';
        previewCtxStub.fillRect(10, 10, 10, 10);
        const spy = spyOn<any>(magicWandService, 'findBound').and.callThrough();
        magicWandService['findBound'](Bound.LEFT, previewCtxStub.getImageData(0, 0, 1000, 1000));
        expect(spy).toHaveBeenCalled();
    });

    it('should find right bound', () => {
        previewCtxStub.fillStyle = 'rgba(101, 231, 0, 1)';
        previewCtxStub.fillRect(10, 10, 10, 10);
        const spy = spyOn<any>(magicWandService, 'findBound').and.callThrough();
        magicWandService['findBound'](Bound.RIGHT, previewCtxStub.getImageData(0, 0, 1000, 1000));
        expect(spy).toHaveBeenCalled();
    });

    it('should find NO bound', () => {
        previewCtxStub.fillStyle = 'rgba(101, 231, 0, 1)';
        previewCtxStub.fillRect(10, 10, 10, 10);
        const spy = spyOn<any>(magicWandService, 'findBound').and.callThrough();
        magicWandService['findBound'](Bound.NONE, previewCtxStub.getImageData(0, 0, 1000, 1000));
        expect(spy).toHaveBeenCalled();
    });

    it('should snip selection', () => {
        previewCtxStub.fillStyle = 'rgba(101, 231, 0, 1)';
        previewCtxStub.fillRect(10, 10, 10, 10);
        const spy = spyOn<any>(magicWandService, 'snipSelection').and.callThrough();
        magicWandService['snipSelection'](previewCtxStub.getImageData(0, 0, 1000, 1000), { x: 10, y: 10 }, { x: 10, y: 10 });
        expect(spy).toHaveBeenCalled();
    });

    it('should call saveSelectionData', () => {
        baseCtxStub.fillStyle = 'rgba(101, 231, 0, 1)';
        baseCtxStub.fillRect(1, 1, 10, 10);
        const spy = spyOn<any>(magicWandService, 'saveSelectionData').and.callThrough();
        spyOn<any>(magicWandService, 'findBound').and.returnValue({ x: 0, y: 1 });
        magicWandService['saveSelectionData'](baseCtxStub.getImageData(0, 0, 1000, 1000));
        expect(spy).toHaveBeenCalled();
    });

    it('should call saveSelectionData and snipSelection to be saved', () => {
        baseCtxStub.fillStyle = 'rgba(101, 231, 0, 1)';
        baseCtxStub.fillRect(1, 1, 10, 10);
        const spy = spyOn<any>(magicWandService, 'saveSelectionData').and.callThrough();
        spyOn<any>(magicWandService, 'snipSelection').and.returnValue(canvas.toDataURL());
        magicWandService['saveSelectionData'](baseCtxStub.getImageData(0, 0, 1000, 1000));
        expect(spy).toHaveBeenCalled();
    });

    it('should onMouseDown with wrong click', () => {
        const event = { offsetX: 11, offsetY: 11, button: MouseButton.Middle } as MouseEvent;
        const spy = spyOn<any>(magicWandService, 'onMouseDown').and.callThrough();
        magicWandService.onMouseDown(event);
        expect(spy).toHaveBeenCalled();
    });

    it('should onMouseDown with left click', () => {
        drawServiceSpy.isPreviewCanvasBlank.and.returnValue(true);
        baseCtxStub.fillStyle = 'rgba(0, 0, 0, 0)';
        baseCtxStub.fillRect(0, 0, 1000, 1000);
        magicWandService.selection.imagePosition = { x: 1, y: 1 };
        magicWandService.selection.endingPos = { x: 11, y: 11 };
        magicWandService['inSelection'] = false;
        magicWandService['controlGroup'] = new ControlGroup(magicWandService['drawingService']);
        magicWandService['controlGroup'].controlPointName = ControlPointName.none;
        const event = { offsetX: 11, offsetY: 11, button: MouseButton.Left } as MouseEvent;
        spyOn<any>(magicWandService['controlGroup'], 'isInControlPoint').and.returnValue(false);
        const spy = spyOn<any>(magicWandService, 'onMouseDown').and.callThrough();
        spyOn<any>(magicWandService, 'snipSelection').and.returnValue(canvas.toDataURL());
        spyOn<any>(magicWandService, 'saveSelectionData').and.callThrough();
        magicWandService.onMouseDown(event);
        expect(spy).toHaveBeenCalled();
    });

    it('should onMouseDown with right click', () => {
        baseCtxStub.fillStyle = 'rgba(0, 0, 0, 0)';
        baseCtxStub.fillRect(0, 0, 1000, 1000);
        const event = { offsetX: 11, offsetY: 11, button: MouseButton.Right } as MouseEvent;
        const spy = spyOn<any>(magicWandService, 'onMouseDown').and.callThrough();
        spyOn<any>(magicWandService, 'snipSelection').and.returnValue(canvas.toDataURL());
        spyOn<any>(magicWandService, 'saveSelectionData').and.callThrough();
        magicWandService.onMouseDown(event);
        expect(spy).toHaveBeenCalled();
    });

    it('onMouseDown should paste a selection if the user click outside of it', () => {
        const pasteSelectionSpy = spyOn<any>(magicWandService, 'pasteSelection');

        drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
        spyOn<any>(magicWandService, 'isInsideSelectionCoords').and.returnValue(false);
        magicWandService['controlGroup'] = new ControlGroup(magicWandService['drawingService']);
        spyOn<any>(magicWandService['controlGroup'], 'isInControlPoint').and.returnValue(ControlPointName.none);

        magicWandService.selection.imagePosition = { x: 1, y: 1 };
        magicWandService.selection.endingPos = { x: 11, y: 11 };
        magicWandService.originalColor = { red: 101, green: 231, blue: 20, alpha: 1 };
        magicWandService.selection.image = new Image();
        const event = { offsetX: 11, offsetY: 11, button: MouseButton.Left } as MouseEvent;

        magicWandService.onMouseDown(event);

        expect(pasteSelectionSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should draw a selection with new coordinates when the selection has been moved', () => {
        const drawWandSelectionSpy = spyOn<any>(magicWandService, 'drawWandSelection');
        const clearSelectionWandSpy = spyOn<any>(magicWandService, 'clearSelectionWand');
        spyOn<any>(magicWandService, 'getPositionFromMouse').and.returnValue({ x: 10, y: 10 });
        const mouseEvent = {
            button: 0,
            offsetX: 20,
            offsetY: 20,
        } as MouseEvent;

        magicWandService.cleared = false;
        magicWandService.mouseDown = true;
        magicWandService.selection.imagePosition = { x: 1, y: 1 };
        magicWandService.selection.endingPos = { x: 11, y: 11 };
        magicWandService['previousMousePos'] = { x: 5, y: 5 };
        magicWandService.selection.width = 10;
        magicWandService.selection.height = 10;
        magicWandService['inSelection'] = true;
        magicWandService['controlGroup'] = new ControlGroup(magicWandService['drawingService']);
        magicWandService['controlGroup'].controlPointName = ControlPointName.none;
        magicWandService['controlPointName'] = ControlPointName.none;

        magicWandService.onMouseMove(mouseEvent);

        expect(drawWandSelectionSpy).toHaveBeenCalled();
        expect(clearSelectionWandSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should draw a selection with  a new size when the selection has been scaled', () => {
        const drawWandSelectionSpy = spyOn<any>(magicWandService, 'drawWandSelection');
        const scaleSelectionSpy = spyOn<any>(magicWandService, 'scaleSelection');
        spyOn<any>(magicWandService, 'getPositionFromMouse').and.returnValue({ x: 10, y: 10 });
        const mouseEvent = {
            button: 0,
            offsetX: 20,
            offsetY: 20,
        } as MouseEvent;

        magicWandService.cleared = false;
        magicWandService.mouseDown = true;
        magicWandService.selection.imagePosition = { x: 1, y: 1 };
        magicWandService.selection.endingPos = { x: 11, y: 11 };
        magicWandService['previousMousePos'] = { x: 5, y: 5 };
        magicWandService.selection.width = 10;
        magicWandService.selection.height = 10;
        magicWandService.originalColor = { red: 101, green: 231, blue: 20, alpha: 1 };
        magicWandService['inSelection'] = true;
        magicWandService['controlGroup'] = new ControlGroup(magicWandService['drawingService']);
        magicWandService['controlGroup'].controlPointName = ControlPointName.left;
        magicWandService['controlPointName'] = ControlPointName.left;

        magicWandService.onMouseMove(mouseEvent);

        expect(drawWandSelectionSpy).toHaveBeenCalled();
        expect(scaleSelectionSpy).toHaveBeenCalled();
    });

    it('onMouseUp should clear the preview canvas and draw a selection if it has been scaled or moved', () => {
        const drawWandSelectionSpy = spyOn<any>(magicWandService, 'drawWandSelection');

        magicWandService.mouseDown = true;
        magicWandService['inSelection'] = true;
        const mouseEvent = {
            button: 0,
            offsetX: 20,
            offsetY: 20,
        } as MouseEvent;
        magicWandService.selection.imagePosition = { x: 1, y: 1 };
        magicWandService.selection.endingPos = { x: 11, y: 11 };
        magicWandService.selection.width = 10;
        magicWandService.selection.height = 10;
        magicWandService.selection.image = new Image();

        magicWandService.onMouseUp(mouseEvent);

        expect(drawWandSelectionSpy).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('onKeyEscape should paste a selection if the selection is drawn', () => {
        drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
        magicWandService.mouseDown = true;
        const pasteSelectionSpy = spyOn<any>(magicWandService, 'pasteSelection');
        magicWandService['upArrow'].timerStarted = true;
        magicWandService['downArrow'].timerStarted = true;
        magicWandService['leftArrow'].timerStarted = true;
        magicWandService['rightArrow'].timerStarted = true;
        magicWandService['timerStarted'] = true;

        magicWandService['upArrow'].subscription = new Subscription();
        magicWandService['downArrow'].subscription = new Subscription();
        magicWandService['leftArrow'].subscription = new Subscription();
        magicWandService['rightArrow'].subscription = new Subscription();
        magicWandService['subscriptionTimer'] = new Subscription();

        const upSubscription = spyOn<any>(magicWandService['upArrow'].subscription, 'unsubscribe');
        const downSubscription = spyOn<any>(magicWandService['downArrow'].subscription, 'unsubscribe');
        const leftSubscription = spyOn<any>(magicWandService['leftArrow'].subscription, 'unsubscribe');
        const rightSubscription = spyOn<any>(magicWandService['rightArrow'].subscription, 'unsubscribe');
        const timerSubscription = spyOn<any>(magicWandService['subscriptionTimer'], 'unsubscribe');

        magicWandService.selection.image = new Image();

        magicWandService.onKeyEscape();

        expect(pasteSelectionSpy).toHaveBeenCalled();
        expect(upSubscription).toHaveBeenCalled();
        expect(downSubscription).toHaveBeenCalled();
        expect(leftSubscription).toHaveBeenCalled();
        expect(rightSubscription).toHaveBeenCalled();
        expect(timerSubscription).toHaveBeenCalled();
    });

    it('drawWandSelection should draw a selection and its surrounding rectangle', () => {
        const drawSelectionRectSpy = spyOn<any>(magicWandService, 'drawSelectionRect');
        const drawImageSpy = spyOn<any>(magicWandService['drawingService'].previewCtx, 'drawImage');
        spyOn<any>(magicWandService, 'flipImage');
        magicWandService['scaled'] = true;

        magicWandService.selection.imagePosition = { x: 1, y: 1 };
        magicWandService.selection.endingPos = { x: 11, y: 11 };
        magicWandService.selection.width = 10;
        magicWandService.selection.height = 10;
        magicWandService.selection.imageData = new ImageData(10, 10);
        magicWandService.selection.image = new Image();
        magicWandService.selection.rotationAngle = 20;

        magicWandService.drawSelection({ x: 1, y: 1 });

        expect(drawSelectionRectSpy).toHaveBeenCalled();
        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('pasteSelection should draw the selection in the base canvas', () => {
        const drawImageSpy = spyOn<any>(magicWandService['drawingService'].baseCtx, 'drawImage');

        magicWandService.selection.imagePosition = { x: 1, y: 1 };
        magicWandService.selection.endingPos = { x: 11, y: 11 };
        magicWandService.selection.width = 10;
        magicWandService.selection.height = 10;
        magicWandService.selection.imageData = new ImageData(10, 10);
        magicWandService.selection.image = new Image();

        magicWandService.pasteSelection(magicWandService.selection);
        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('clearSelectionWand should replace the selection pixels by white pixels on the base canvas', () => {
        spyOn<any>(magicWandService['drawingService'].baseCtx, 'getImageData').and.returnValue(new ImageData(10, 10));
        const putImageDataSpy = spyOn<any>(magicWandService['drawingService'].baseCtx, 'putImageData');

        magicWandService.selection.imagePosition = { x: 1, y: 1 };
        magicWandService.selection.endingPos = { x: 11, y: 11 };
        magicWandService.selection.width = 10;
        magicWandService.selection.height = 10;
        magicWandService.originalColor = { red: 101, green: 231, blue: 20, alpha: 1 };
        magicWandService.selection.imageData = new ImageData(10, 10);
        magicWandService.selection.image = new Image();

        magicWandService.clearSelectionWand({ x: 1, y: 1 }, magicWandService.originalColor);
        expect(putImageDataSpy).toHaveBeenCalled();
    });

    it('clearSelection should call clearSelectionWand', () => {
        const clearSelectionWandSpy = spyOn<any>(magicWandService, 'clearSelectionWand');

        magicWandService.selection.copyImageInitialPos = { x: 1, y: 1 };
        magicWandService.originalColor = { red: 101, green: 231, blue: 20, alpha: 1 };
        magicWandService.selection.image = new Image();

        magicWandService.clearSelection();
        expect(clearSelectionWandSpy).toHaveBeenCalled();
    });

    it('getColor should return the color of a pixel', () => {
        const canvasTest = document.createElement('canvas') as HTMLCanvasElement;
        const ctx = (canvasTest.getContext('2d') as CanvasRenderingContext2D) as CanvasRenderingContext2D;
        canvasTest.width = 1;
        canvasTest.height = 1;
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 1, 1);
        expect(magicWandService['getColor']({ x: 0, y: 0 }, ctx)).toEqual({ red: 0, green: 0, blue: 0, alpha: 255 });
    });

    it('drawSelection should call drawSelectionWand', () => {
        const drawSelectionWandSpy = spyOn<any>(magicWandService, 'drawWandSelection');
        magicWandService.drawSelection({ x: 0, y: 0 });
        expect(drawSelectionWandSpy).toHaveBeenCalled();
    });
});
