// tslint:disable:no-unused-variable
// tslint:disable:no-any

import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { CanvasResizeService } from '@app/services/canvas/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { GridService } from './grid.service';

let service: GridService;

let drawingStub: DrawingService;
let undoRedoStub: UndoRedoService;
let canvasResizeStub: CanvasResizeService;

let baseCtxStub: CanvasRenderingContext2D;
let previewCtxStub: CanvasRenderingContext2D;

describe('Service: Grid', () => {
    beforeEach(() => {
        drawingStub = new DrawingService();
        undoRedoStub = new UndoRedoService(drawingStub);
        canvasResizeStub = new CanvasResizeService(service, undoRedoStub);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: CanvasResizeService, useValue: canvasResizeStub },
            ],
        });
        service = TestBed.inject(GridService);

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        const gridCanvas = document.createElement('canvas');
        const largeCanvasSize = 1000;
        gridCanvas.width = largeCanvasSize;
        gridCanvas.height = largeCanvasSize;

        const gridCtxStub = gridCanvas.getContext('2d') as CanvasRenderingContext2D;

        drawingStub.canvas = canvasTestHelper.canvas;
        drawingStub.gridCanvas = gridCanvas;

        drawingStub.baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        drawingStub.previewCtx = previewCtxStub;
        drawingStub.gridCtx = gridCtxStub;
    });

    it('should gridService be truthy', () => {
        expect(service).toBeTruthy();
    });

    it('should getGridData', () => {
        const spy = spyOn<any>(service, 'getGridData').and.callThrough();
        service.getGridData();
        expect(spy).toHaveBeenCalled();
    });

    it('should deactivateGrid', () => {
        const spy = spyOn<any>(service, 'deactivateGrid').and.callThrough();
        service.deactivateGrid();
        expect(spy).toHaveBeenCalled();
    });

    it('should activateGrid', () => {
        service.isGridSettingsChecked = true;
        const spy = spyOn<any>(service, 'activateGrid').and.callThrough();
        service.activateGrid();
        expect(spy).toHaveBeenCalled();
    });
});
