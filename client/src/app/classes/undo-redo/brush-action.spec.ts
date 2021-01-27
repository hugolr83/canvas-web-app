import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { PointArc } from '@app/classes/point-arc';
import { SubToolSelected } from '@app/classes/sub-tool-selected';
import { BrushAction } from '@app/classes/undo-redo/brush-action';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { CanvasResizeService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BrushService } from '@app/services/tools/brush.service';
import { GridService } from '@app/services/tools/grid.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// tslint:disable:prefer-const
// tslint:disable:no-magic-number
describe('BrushAction', () => {
    let brushActionStub: BrushAction;
    let brushAction2: BrushAction;
    let drawingStub: DrawingService;
    let colorStub: ColorService;
    let undoRedoStub: UndoRedoService;
    let brushStub: BrushService;
    let changesBrush: Vec2[] = [];
    let brushPointData: PointArc[] = [];
    let primaryColor: string;
    let secondaryColor: string;
    let thicknessBrush: number;
    let selectedBrushTool1: SubToolSelected;
    let selectedBrushTool2: SubToolSelected;
    let vec2: Vec2 = { x: 0, y: 0 };
    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let autoSaveStub: AutomaticSaveService;
    let canvas: HTMLCanvasElement;
    let canvasResizeStub: CanvasResizeService;
    let gridStub: GridService;

    beforeEach(() => {
        // tslint:disable:no-magic-numbers
        vec2.x = 5;
        // tslint:disable:no-magic-numbers
        vec2.y = 6;
        changesBrush.push({ x: 5, y: 6 });
        changesBrush.push({ x: 25, y: 15 });
        primaryColor = '#ffffff';
        secondaryColor = 'rgba(0,0,0,0)';
        // tslint:disable:no-magic-numbers
        thicknessBrush = 3;
        selectedBrushTool1 = SubToolSelected.tool4;
        selectedBrushTool2 = SubToolSelected.tool1;
        const pt1 = new PointArc(vec2, 5, 1);
        const pt2 = new PointArc(vec2, 12, 1);
        brushPointData.push(pt1, pt2);
        drawingStub = new DrawingService();
        autoSaveStub = new AutomaticSaveService(canvasResizeStub, drawingStub, undoRedoStub);
        gridStub = new GridService(drawingStub);
        canvasResizeStub = new CanvasResizeService(gridStub, undoRedoStub);
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        brushStub = new BrushService(drawingStub, colorStub, undoRedoStub, autoSaveStub);
        brushActionStub = new BrushAction(
            changesBrush,
            brushPointData,
            primaryColor,
            secondaryColor,
            thicknessBrush,
            selectedBrushTool1,
            brushStub,
            drawingStub,
        );

        brushAction2 = new BrushAction(
            changesBrush,
            brushPointData,
            primaryColor,
            secondaryColor,
            thicknessBrush,
            selectedBrushTool2,
            brushStub,
            drawingStub,
        );
        canvas = canvasTestHelper.canvas;
        // tslint:disable:no-magic-numbers
        canvas.width = 100;
        // tslint:disable:no-magic-numbers
        canvas.height = 100;
        baseStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        drawingStub.canvas = canvas;
        drawingStub.baseCtx = baseStub;
        drawingStub.previewCtx = previewStub;

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: ColorService, useValue: colorStub },
                { provide: UndoRedoService, useValue: undoRedoStub },
                { provide: BrushService, useValue: brushStub },
                { provide: BrushAction, useValue: brushActionStub },
                { provide: AutomaticSaveService, useValue: { save: () => '' } },
            ],
        });
        brushActionStub = TestBed.inject(BrushAction);
        brushStub = TestBed.inject(BrushService);
    });

    it('strokeColor and lineWidth values must match with  primaryColor and thicknessBrush', () => {
        drawingStub.baseCtx.shadowColor = drawingStub.previewCtx.shadowColor = '#000000' as string;
        brushActionStub.apply();
        expect(drawingStub.baseCtx.strokeStyle).toEqual(primaryColor);
        expect(drawingStub.baseCtx.lineWidth).toEqual(thicknessBrush);
    });

    it('should call switchBrush', () => {
        const switchSpy = spyOn(brushStub, 'switchBrush').and.stub();
        brushActionStub.apply();
        expect(switchSpy).toHaveBeenCalled();
    });

    it('should call drawLine', () => {
        const drawLineSpy = spyOn(brushStub, 'drawLine').and.stub();
        brushActionStub.apply();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('should call drawBrushTool4', () => {
        const drawBrushTool4Spy = spyOn(brushStub, 'drawBrushTool4').and.stub();
        brushActionStub.apply();
        expect(drawBrushTool4Spy).toHaveBeenCalled();
    });

    it('should not call drawBrushTool4', () => {
        const drawBrushTool4Spy = spyOn(brushStub, 'drawBrushTool4').and.stub();
        brushAction2.apply();
        expect(drawBrushTool4Spy).not.toHaveBeenCalled();
    });

    it('should call clearEffectTool', () => {
        const clearEffectSpy = spyOn(brushStub, 'clearEffectTool').and.stub();
        brushActionStub.apply();
        expect(clearEffectSpy).toHaveBeenCalled();
    });
});
