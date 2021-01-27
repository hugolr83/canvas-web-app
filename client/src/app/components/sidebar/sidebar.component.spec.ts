import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { cursorName } from '@app/classes/cursor-name';
import { SubToolSelected } from '@app/classes/sub-tool-selected';
import { ToolUsed } from '@app/classes/tool';
import { ColorComponent } from '@app/components/color/color.component';
import { DialogCreateNewDrawingComponent } from '@app/components/dialog-create-new-drawing/dialog-create-new-drawing.component';
import { DropperColorComponent } from '@app/components/dropper-color/dropper-color.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { WriteTextDialogUserGuideComponent } from '@app/components/write-text-dialog-user-guide/write-text-dialog-user-guide.component';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { CanvasResizeService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolService } from '@app/services/tool-service';
import { BrushService } from '@app/services/tools/brush.service';
import { DropperService } from '@app/services/tools/dropper.service';
import { EllipseService } from '@app/services/tools/ellipse.service';
import { EraserService } from '@app/services/tools/eraser-service';
import { FeatherService } from '@app/services/tools/feather.service';
import { GridService } from '@app/services/tools/grid.service';
import { LineService } from '@app/services/tools/line.service';
import { MagnetismService } from '@app/services/tools/magnetism.service';
import { PaintBucketService } from '@app/services/tools/paint-bucket.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { PolygonService } from '@app/services/tools/polygon.service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { MagicWandService } from '@app/services/tools/selection-service/magic-wand.service';
import { RotationService } from '@app/services/tools/selection-service/rotation.service';
import { SelectionEllipseService } from '@app/services/tools/selection-service/selection-ellipse.service';
import { SelectionRectangleService } from '@app/services/tools/selection-service/selection-rectangle.service';
import { SelectionService } from '@app/services/tools/selection-service/selection-service';
import { SprayService } from '@app/services/tools/spray.service';
import { StampService } from '@app/services/tools/stamp.service';
import { TextService } from '@app/services/tools/text.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:max-file-line-count
// tslint:disable:prefer-const

describe('SidebarComponent', () => {
    let sidebarComponent: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let drawingStub: DrawingService;
    let toolServiceStub: ToolService;
    let rectangleStub: RectangleService;
    let ellipseStub: EllipseService;
    let brushStub: BrushService;
    let pencilStub: PencilService;
    let eraserStub: EraserService;
    let lineStub: LineService;
    let colorStub: ColorService;
    let dropperServiceStub: DropperService;
    let polygonStub: PolygonService;
    let paintBucketStub: PaintBucketService;
    let canvasResizeStub: CanvasResizeService;
    let selectionRectangleStub: SelectionRectangleService;
    let selectionEllipseStub: SelectionEllipseService;
    let undoRedoStub: UndoRedoService;
    let selectionStub: SelectionService;
    let sprayStub: SprayService;
    let textServiceStub: TextService;
    let automaticSaveStub: AutomaticSaveService;
    let stampServiceStub: StampService;
    let featherStub: FeatherService;
    let magnetismStub: MagnetismService;
    let gridStub: GridService;
    let rotationStub: RotationService;
    let magicWandStub: MagicWandService;
    let autoSave: AutomaticSaveService;
    let pasteImageRectSpy: jasmine.SpyObj<any>;
    let pasteImageEllipseSpy: jasmine.SpyObj<any>;
    let deactivateGridSpy: jasmine.SpyObj<any>;
    let activateGridSpy: jasmine.SpyObj<any>;
    let resetMagnetismSpy: jasmine.SpyObj<any>;

    let canvas: HTMLCanvasElement;
    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let cursorStub: CanvasRenderingContext2D;
    let gridCtxStub: CanvasRenderingContext2D;
    let dialogMock: jasmine.SpyObj<MatDialog>;
    beforeEach(
        waitForAsync(async () => {
            drawingStub = new DrawingService();
            automaticSaveStub = new AutomaticSaveService(canvasResizeStub, drawingStub, undoRedoStub);
            colorStub = new ColorService(drawingStub);
            undoRedoStub = new UndoRedoService(drawingStub);
            rectangleStub = new RectangleService(drawingStub, colorStub, undoRedoStub, automaticSaveStub);
            ellipseStub = new EllipseService(drawingStub, colorStub, undoRedoStub, automaticSaveStub);
            brushStub = new BrushService(drawingStub, colorStub, undoRedoStub, automaticSaveStub);
            pencilStub = new PencilService(drawingStub, colorStub, undoRedoStub, automaticSaveStub);
            eraserStub = new EraserService(drawingStub, undoRedoStub, automaticSaveStub);
            lineStub = new LineService(drawingStub, colorStub, undoRedoStub, automaticSaveStub);
            dropperServiceStub = new DropperService(drawingStub, colorStub, automaticSaveStub);
            paintBucketStub = new PaintBucketService(drawingStub, colorStub, undoRedoStub, automaticSaveStub);
            magicWandStub = new MagicWandService(drawingStub, magnetismStub, undoRedoStub, rotationStub, autoSave);
            sprayStub = new SprayService(drawingStub, colorStub, undoRedoStub, automaticSaveStub);
            selectionStub = new SelectionService(drawingStub, magnetismStub, rotationStub, autoSave);
            textServiceStub = new TextService(drawingStub, colorStub, undoRedoStub, automaticSaveStub);
            stampServiceStub = new StampService(drawingStub, undoRedoStub);
            featherStub = new FeatherService(drawingStub, colorStub, undoRedoStub, automaticSaveStub);
            magnetismStub = new MagnetismService(gridStub);
            gridStub = new GridService(drawingStub);
            rotationStub = new RotationService(drawingStub);

            toolServiceStub = new ToolService(
                pencilStub,
                eraserStub,
                brushStub,
                lineStub,
                rectangleStub,
                ellipseStub,
                dropperServiceStub,
                polygonStub,
                paintBucketStub,
                selectionRectangleStub,
                selectionEllipseStub,
                magicWandStub,
                sprayStub,
                featherStub,
                textServiceStub,
                stampServiceStub,
            );

            magnetismStub = new MagnetismService(gridStub);
            selectionRectangleStub = new SelectionRectangleService(drawingStub, magnetismStub, rotationStub, undoRedoStub, autoSave);
            selectionEllipseStub = new SelectionEllipseService(drawingStub, magnetismStub, rotationStub, undoRedoStub, autoSave);
            polygonStub = new PolygonService(drawingStub, colorStub, undoRedoStub, automaticSaveStub);
            canvas = canvasTestHelper.canvas;
            canvas.width = 100;
            canvas.height = 100;
            baseStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
            previewStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
            cursorStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
            gridCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
            // Configuration du spy du service
            // tslint:disable:no-string-literal
            drawingStub.canvas = canvas;
            drawingStub.baseCtx = baseStub; // Jasmine doesnt copy properties with underlying data
            drawingStub.previewCtx = previewStub;
            drawingStub.cursorCtx = cursorStub;
            drawingStub.gridCtx = gridCtxStub;
            dialogMock = jasmine.createSpyObj('dialogCreator', ['open']);

            await TestBed.configureTestingModule({
                declarations: [
                    SidebarComponent,
                    ColorComponent,
                    WriteTextDialogUserGuideComponent,
                    DialogCreateNewDrawingComponent,
                    DropperColorComponent,
                ],
                imports: [
                    MatIconModule,
                    MatGridListModule,
                    MatSliderModule,
                    MatSlideToggleModule,
                    MatButtonToggleModule,
                    MatButtonModule,
                    MatListModule,
                    MatInputModule,
                    MatCheckboxModule,
                    BrowserAnimationsModule,
                    HttpClientModule,
                ],
                providers: [
                    { provide: AutomaticSaveService, useValue: { save: () => '' } },
                    { provide: DrawingService, useValue: drawingStub },
                    { provide: ToolService, useValue: toolServiceStub },
                    { provide: RectangleService, useValue: rectangleStub },
                    { provide: EllipseService, useValue: ellipseStub },
                    { provide: BrushService, useValue: brushStub },
                    { provide: PencilService, useValue: pencilStub },
                    { provide: EraserService, useValue: eraserStub },
                    { provide: LineService, useValue: lineStub },
                    { provide: SelectionRectangleService, useValue: selectionRectangleStub },
                    { provide: SelectionEllipseService, useValue: selectionEllipseStub },
                    { provide: ToolService, useValue: toolServiceStub },
                    { provide: DropperService, useValue: dropperServiceStub },
                    { provide: MatDialog, useValue: dialogMock },
                    { provide: MatDialogRef, useValue: {} },
                    { provide: PolygonService, useValue: polygonStub },
                    { provide: Observable, useValue: {} },
                    { provide: SelectionService, useValue: selectionStub },
                    { provide: UndoRedoService, useValue: undoRedoStub },
                    { provide: StampService, useValue: stampServiceStub },
                    { provide: SprayService, useValue: sprayStub },
                    { provide: FeatherService, useValue: featherStub },
                    { provide: GridService, useValue: gridStub },
                    { provide: MagnetismService, useValue: magnetismStub },
                    { provide: RotationService, useValue: rotationStub },
                ],
            }).compileComponents();
            TestBed.inject(MatDialog);
            TestBed.inject(DomSanitizer);
            selectionRectangleStub = TestBed.inject(SelectionRectangleService);
            selectionEllipseStub = TestBed.inject(SelectionEllipseService);
            fixture = TestBed.createComponent(SidebarComponent);
            pasteImageRectSpy = spyOn<any>(selectionRectangleStub, 'pasteImage').and.stub();
            pasteImageEllipseSpy = spyOn<any>(selectionEllipseStub, 'pasteImage').and.stub();
            deactivateGridSpy = spyOn<any>(gridStub, 'deactivateGrid').and.stub();
            activateGridSpy = spyOn<any>(gridStub, 'activateGrid').and.stub();
            resetMagnetismSpy = spyOn<any>(magnetismStub, 'resetMagnetism').and.stub();
            sidebarComponent = fixture.componentInstance;
            fixture.detectChanges();
        }),
    );

    afterEach(() => {
        if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
            (fixture.nativeElement as HTMLElement).remove();
        }
    });

    it('should create', () => {
        expect(sidebarComponent).toBeTruthy();
    });
    it('pickPencil', () => {
        sidebarComponent.pickPencil();
        expect(toolServiceStub.currentToolName).toEqual(ToolUsed.Pencil);
    });
    it('pickEraser()', () => {
        sidebarComponent.pickEraser();
        expect(toolServiceStub.currentToolName).toEqual(ToolUsed.Eraser);
    });
    it('pickRectangle()', () => {
        sidebarComponent.pickRectangle(SubToolSelected.tool1);
        expect(toolServiceStub.currentToolName).toEqual(ToolUsed.Rectangle);
    });
    it('pickEllipse()', () => {
        sidebarComponent.pickEllipse(SubToolSelected.tool1);
        expect(toolServiceStub.currentToolName).toEqual(ToolUsed.Ellipse);
    });

    it(' should clear canvas dialog', () => {
        drawingStub.baseCtx.fillStyle = 'green';
        drawingStub.baseCtx.fillRect(10, 10, drawingStub.canvas.width, drawingStub.canvas.height);

        const closedSubject = new Subject<any>();

        const dialogRefMock = jasmine.createSpyObj('dialogRef', ['afterClosed']) as jasmine.SpyObj<MatDialogRef<any>>;
        dialogRefMock.afterClosed.and.returnValue(closedSubject.asObservable());
        dialogMock.open.and.returnValue(dialogRefMock);

        sidebarComponent.clearCanvas();
        expect(sidebarComponent.isDialogOpen).toEqual(true);

        closedSubject.next();

        expect(sidebarComponent.isDialogOpen).toEqual(false);
    });

    it('should export Drawing ', () => {
        sidebarComponent.isDialogLoadSaveExport = true;
        const closedSubject = new Subject<any>();

        const dialogRefMock = jasmine.createSpyObj('dialogRef', ['afterClosed']) as jasmine.SpyObj<MatDialogRef<any>>;
        dialogRefMock.afterClosed.and.returnValue(closedSubject.asObservable());
        dialogMock.open.and.returnValue(dialogRefMock);

        sidebarComponent.exportDrawing();
        expect(sidebarComponent.isDialogLoadSaveExport).toEqual(false);

        closedSubject.next();

        expect(sidebarComponent.isDialogLoadSaveExport).toEqual(true);
    });

    it(' should create new drawing dialog', () => {
        sidebarComponent.dialogCreator = jasmine.createSpyObj('MatDialog', ['open']);
        sidebarComponent.dialogCreator.open = jasmine.createSpy().and.callFake(() => {
            return sidebarComponent;
        });
        sidebarComponent.createNewDrawing();
        expect(sidebarComponent.dialogCreator.open).toHaveBeenCalled();
    });
    it(' should open user guide dialog', () => {
        const closedSubject = new Subject<any>();

        const dialogRefMock = jasmine.createSpyObj('dialogRef', ['afterClosed']) as jasmine.SpyObj<MatDialogRef<any>>;
        dialogRefMock.afterClosed.and.returnValue(closedSubject.asObservable());
        dialogMock.open.and.returnValue(dialogRefMock);
        sidebarComponent.isDialogLoadSaveExport = true;
        sidebarComponent.openCarrousel();
        expect(sidebarComponent.isDialogLoadSaveExport).toEqual(false);

        closedSubject.next();

        expect(sidebarComponent.isDialogLoadSaveExport).toEqual(true);
    });

    it('should open save server ', () => {
        sidebarComponent.isDialogLoadSaveExport = true;
        const closedSubject = new Subject<any>();

        const dialogRefMock = jasmine.createSpyObj('dialogRef', ['afterClosed']) as jasmine.SpyObj<MatDialogRef<any>>;
        dialogRefMock.afterClosed.and.returnValue(closedSubject.asObservable());
        dialogMock.open.and.returnValue(dialogRefMock);

        sidebarComponent.openSaveServer();
        expect(sidebarComponent.isDialogLoadSaveExport).toEqual(false);

        closedSubject.next();

        expect(sidebarComponent.isDialogLoadSaveExport).toEqual(true);
    });

    it('should open writeTextDialogUserComponent', () => {
        const matDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        sidebarComponent.dialogCreator = jasmine.createSpyObj('MatDialog', ['open']);
        sidebarComponent.dialogCreator.open = jasmine.createSpy().and.callFake(() => {
            return matDialogRef;
        });
        sidebarComponent.openUserGuide();
        expect(sidebarComponent.checkDocumentationRef).toEqual(matDialogRef);
    });
    it(' should pick pencil', () => {
        const switchToolSpy = spyOn<any>(toolServiceStub, 'switchTool').and.stub();
        sidebarComponent.pickPencil();
        expect(drawingStub.cursorUsed).toEqual(cursorName.pencil);
        expect(switchToolSpy).toHaveBeenCalled();
    });
    it(' should pick eraser', () => {
        const switchToolSpy = spyOn<any>(toolServiceStub, 'switchTool').and.stub();
        sidebarComponent.pickEraser();
        expect(drawingStub.cursorUsed).toEqual(cursorName.eraser);
        expect(switchToolSpy).toHaveBeenCalled();
    });
    it(' should pick brush and set baseCtx and previewCtx lineWidth', () => {
        const switchToolSpy = spyOn<any>(toolServiceStub, 'switchTool').and.stub();
        drawingStub.baseCtx.lineWidth = 10;
        brushStub.pixelMinBrush = 20;
        sidebarComponent.pickBrush(2);
        expect(drawingStub.cursorUsed).toEqual(cursorName.default);
        expect(switchToolSpy).toHaveBeenCalled();
        expect(toolServiceStub.currentTool.subToolSelect).toEqual(2);
        expect(drawingStub.baseCtx.lineWidth).toEqual(brushStub.pixelMinBrush);
        expect(drawingStub.previewCtx.lineWidth).toEqual(brushStub.pixelMinBrush);
    });
    it(' should pick brush and set previewCtx lineWidth', () => {
        const switchToolSpy = spyOn(toolServiceStub, 'switchTool').and.stub();
        drawingStub.baseCtx.lineWidth = 20;
        brushStub.pixelMinBrush = 10;
        sidebarComponent.pickBrush(2);
        expect(drawingStub.cursorUsed).toEqual(cursorName.default);
        expect(switchToolSpy).toHaveBeenCalled();
        expect(toolServiceStub.currentTool.subToolSelect).toEqual(2);
        expect(drawingStub.previewCtx.lineWidth).toEqual(drawingStub.baseCtx.lineWidth);
    });
    it('should pick line', () => {
        const switchToolSpy = spyOn(toolServiceStub, 'switchTool').and.stub();
        sidebarComponent.pickLine();
        expect(drawingStub.cursorUsed).toEqual(cursorName.default);
        expect(switchToolSpy).toHaveBeenCalled();
        expect(toolServiceStub.currentTool.subToolSelect).toEqual(SubToolSelected.tool1);
    });
    it('should pick rectangle', () => {
        const switchToolSpy = spyOn(toolServiceStub, 'switchTool').and.stub();
        sidebarComponent.pickRectangle(SubToolSelected.tool2);
        expect(drawingStub.cursorUsed).toEqual(cursorName.default);
        expect(switchToolSpy).toHaveBeenCalled();
        expect(toolServiceStub.currentTool.subToolSelect).toEqual(SubToolSelected.tool2);
    });
    it('should pick ellipse', () => {
        const switchToolSpy = spyOn(toolServiceStub, 'switchTool').and.stub();
        sidebarComponent.pickEllipse(1);
        expect(drawingStub.cursorUsed).toEqual(cursorName.default);
        expect(switchToolSpy).toHaveBeenCalled();
        expect(toolServiceStub.currentTool.subToolSelect).toEqual(SubToolSelected.tool1);
    });
    it('should pick polygon', () => {
        const switchToolSpy = spyOn(toolServiceStub, 'switchTool').and.stub();
        sidebarComponent.pickPolygon(1);
        expect(drawingStub.cursorUsed).toEqual(cursorName.default);
        expect(switchToolSpy).toHaveBeenCalled();
        expect(toolServiceStub.currentTool.subToolSelect).toEqual(SubToolSelected.tool1);
    });
    it('should pick color', () => {
        const switchToolSpy = spyOn(toolServiceStub, 'switchTool').and.stub();
        sidebarComponent.pickColor();
        expect(drawingStub.cursorUsed).toEqual(cursorName.default);
        expect(switchToolSpy).toHaveBeenCalled();
    });

    it('should pick paint bucket', () => {
        const switchToolSpy = spyOn(toolServiceStub, 'switchTool').and.stub();
        sidebarComponent.pickPaintBucket();
        expect(drawingStub.cursorUsed).toEqual(cursorName.default);
        expect(switchToolSpy).toHaveBeenCalled();
    });

    it('should pick dropper', () => {
        const switchToolSpy = spyOn(toolServiceStub, 'switchTool').and.stub();
        const resetCursor = spyOn(sidebarComponent, 'resetCursorCanvas').and.stub();
        sidebarComponent.pickDropper();
        expect(drawingStub.cursorUsed).toEqual('pointer');
        expect(switchToolSpy).toHaveBeenCalled();
        expect(resetCursor).toHaveBeenCalled();
    });
    it('should pick selection rectangle', () => {
        const switchToolSpy = spyOn(toolServiceStub, 'switchTool').and.stub();
        sidebarComponent.pickSelectionRectangle();
        expect(drawingStub.cursorUsed).toEqual(cursorName.default);
        expect(switchToolSpy).toHaveBeenCalled();
    });
    it('should pick selection ellipse', () => {
        const switchToolSpy = spyOn(toolServiceStub, 'switchTool').and.callThrough();
        sidebarComponent.pickSelectionEllipse();
        expect(drawingStub.cursorUsed).toEqual(cursorName.default);
        expect(switchToolSpy).toHaveBeenCalled();
    });
    it('should pick stamp', () => {
        const switchToolSpy = spyOn(toolServiceStub, 'switchTool').and.callThrough();
        const resetCursor = spyOn(sidebarComponent, 'resetCursorCanvas').and.stub();
        sidebarComponent.pickStamp();
        expect(drawingStub.cursorUsed).toEqual('none');
        expect(switchToolSpy).toHaveBeenCalled();
        expect(resetCursor).toHaveBeenCalled();
    });

    it('should pick sprayer', () => {
        const switchToolSpy = spyOn(toolServiceStub, 'switchTool').and.callThrough();
        sidebarComponent.pickSprayer();
        expect(drawingStub.cursorUsed).toEqual(cursorName.default);
        expect(switchToolSpy).toHaveBeenCalled();
    });
    it('should set all checked to false', () => {
        sidebarComponent.resetCheckedButton();
        expect(sidebarComponent.pencilChecked).toEqual(false);
        expect(sidebarComponent.eraserChecked).toEqual(false);
        expect(sidebarComponent.brushChecked).toEqual(false);
        expect(sidebarComponent.lineChecked).toEqual(false);
        expect(sidebarComponent.rectangleChecked).toEqual(false);
        expect(sidebarComponent.ellipseChecked).toEqual(false);
        expect(sidebarComponent.polygonChecked).toEqual(false);
        expect(sidebarComponent.colorChecked).toEqual(false);
        expect(sidebarComponent.dropperChecked).toEqual(false);
        expect(sidebarComponent.selectionRectangleChecked).toEqual(false);
        expect(sidebarComponent.selectionEllipseChecked).toEqual(false);
        expect(sidebarComponent.selectionEllipseChecked).toEqual(false);
        expect(sidebarComponent.selectionRectangleChecked).toEqual(false);
        expect(sidebarComponent.textChecked).toEqual(false);
        expect(sidebarComponent.stampChecked).toEqual(false);
        expect(sidebarComponent.sprayChecked).toEqual(false);
    });

    it('should set subtoolselected as tool 2', () => {
        const event = { checked: true } as MatCheckboxChange;
        sidebarComponent.checkboxChangeToggle(event);
        expect(toolServiceStub.currentTool.subToolSelect).toEqual(SubToolSelected.tool2);
    });
    it('should set subtoolselected as tool 1', () => {
        const event = { checked: false } as MatCheckboxChange;
        sidebarComponent.checkboxChangeToggle(event);
        expect(toolServiceStub.currentTool.subToolSelect).toEqual(SubToolSelected.tool1);
    });

    it('should call preventDefault clearCanvas and set isDialogOpen to true', () => {
        sidebarComponent.isDialogOpen = false;
        drawingStub.baseCtx.beginPath();
        drawingStub.baseCtx.moveTo(50, 50);
        drawingStub.baseCtx.lineTo(100, 100);
        drawingStub.baseCtx.stroke();
        const event = new KeyboardEvent('window:keydown.control.o', {});
        const preventDefaultSpy = spyOn(event, 'preventDefault').and.callThrough();
        const clearCanvasSpy = spyOn(sidebarComponent, 'clearCanvas').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.onKeyDown(event);
        expect(preventDefaultSpy);
        expect(clearCanvasSpy).toHaveBeenCalled();
    });

    it('should call resetCheckedButton set isRectangleChecked to true should call pickRectangle', () => {
        toolServiceStub.currentToolName = ToolUsed.Pencil;
        const event = new KeyboardEvent('window:keydown.1', {});
        const spyReset = spyOn(sidebarComponent, 'resetCheckedButton').and.callThrough();
        const spyPickRect = spyOn(sidebarComponent, 'pickRectangle').and.callThrough();
        window.dispatchEvent(event);
        sidebarComponent.changeRectangleMode(event);
        expect(spyReset).toHaveBeenCalled();
        expect(sidebarComponent.rectangleChecked).toEqual(true);
        expect(spyPickRect).toHaveBeenCalled();
    });
    it('should call resetCheckedButton set isEllipseChecked to true should call pickEllipse', () => {
        toolServiceStub.currentToolName = ToolUsed.Pencil;
        const event = new KeyboardEvent('window:keydown.2', {});
        const spyReset = spyOn(sidebarComponent, 'resetCheckedButton').and.callThrough();
        const spyPickEllipse = spyOn(sidebarComponent, 'pickEllipse').and.callThrough();
        window.dispatchEvent(event);
        sidebarComponent.changleEllipseMode(event);
        expect(spyReset).toHaveBeenCalled();
        expect(sidebarComponent.ellipseChecked).toEqual(true);
        expect(spyPickEllipse).toHaveBeenCalled();
    });
    it('should call resetCheckedButton set isPolygonChecked to true should call pickPolygon', () => {
        toolServiceStub.currentToolName = ToolUsed.Pencil;
        const event = new KeyboardEvent('window:keydown.3', {});
        const spyReset = spyOn(sidebarComponent, 'resetCheckedButton').and.callThrough();
        const spyPickPoly = spyOn(sidebarComponent, 'pickPolygon').and.callThrough();
        window.dispatchEvent(event);
        sidebarComponent.changePolygonMode(event);
        expect(spyReset).toHaveBeenCalled();
        expect(sidebarComponent.polygonChecked).toEqual(true);
        expect(spyPickPoly).toHaveBeenCalled();
    });

    it(' should call resetCheckButton set isEraserChecked to true should call pickEraser', () => {
        toolServiceStub.currentToolName = ToolUsed.Pencil;
        const event = new KeyboardEvent('window:keydown.e', {});
        const spyReset = spyOn(sidebarComponent, 'resetCheckedButton').and.callThrough();
        const spyPickEraser = spyOn(sidebarComponent, 'pickEraser').and.callThrough();
        window.dispatchEvent(event);
        sidebarComponent.changeEraserMode(event);
        expect(spyReset).toHaveBeenCalled();
        expect(sidebarComponent.eraserChecked).toEqual(true);
        expect(spyPickEraser).toHaveBeenCalled();
    });

    it(' should call resetCheckButton set isPencilChecked to true should call pickPencil', () => {
        toolServiceStub.currentToolName = ToolUsed.Pencil;
        const event = new KeyboardEvent('window:keydown.e', {});
        const spyReset = spyOn(sidebarComponent, 'resetCheckedButton').and.callThrough();
        const spyPickPencil = spyOn(sidebarComponent, 'pickPencil').and.callThrough();
        window.dispatchEvent(event);
        sidebarComponent.changePencilMode(event);
        expect(spyReset).toHaveBeenCalled();
        expect(sidebarComponent.pencilChecked).toEqual(true);
        expect(spyPickPencil).toHaveBeenCalled();
    });

    it(' should call resetCheckButton set isBrushChecked to true should call pickBrush', () => {
        toolServiceStub.currentToolName = ToolUsed.Pencil;
        const event = new KeyboardEvent('window:keydown.w', {});
        const spyReset = spyOn(sidebarComponent, 'resetCheckedButton').and.callThrough();
        const spyPickBrush = spyOn(sidebarComponent, 'pickBrush').and.callThrough();
        window.dispatchEvent(event);
        sidebarComponent.changeBrushMode(event);
        expect(spyReset).toHaveBeenCalled();
        expect(sidebarComponent.brushChecked).toEqual(true);
        expect(spyPickBrush).toHaveBeenCalled();
    });

    it(' should call resetCheckButton set isLineChecked to true should call pickLine', () => {
        toolServiceStub.currentToolName = ToolUsed.Pencil;
        const event = new KeyboardEvent('window:keydown.l', {});
        const spyReset = spyOn(sidebarComponent, 'resetCheckedButton').and.callThrough();
        const spyPickLine = spyOn(sidebarComponent, 'pickLine').and.callThrough();
        window.dispatchEvent(event);
        sidebarComponent.changeLineMode(event);
        expect(spyReset).toHaveBeenCalled();
        expect(sidebarComponent.lineChecked).toEqual(true);
        expect(spyPickLine).toHaveBeenCalled();
    });

    it('should call resetCheckButton and set isPaintBucketChecked to true when changePaintBucketMode is called', () => {
        toolServiceStub.currentToolName = ToolUsed.Pencil;
        const event = new KeyboardEvent('window:keydown.b', {});
        const spyReset = spyOn(sidebarComponent, 'resetCheckedButton').and.callThrough();
        window.dispatchEvent(event);
        sidebarComponent.changePaintBucketMode(event);
        expect(spyReset).toHaveBeenCalled();
        expect(sidebarComponent.paintBucketChecked).toEqual(true);
    });

    it(' should call resetCheckButton set isDropperChecked to true should call pickDropper', () => {
        toolServiceStub.currentToolName = ToolUsed.Pencil;
        const event = new KeyboardEvent('window:keydown.i', {});
        const spyReset = spyOn(sidebarComponent, 'resetCheckedButton').and.callThrough();
        const spyPickDropper = spyOn(sidebarComponent, 'pickDropper').and.callThrough();
        window.dispatchEvent(event);
        sidebarComponent.changeDropperMode(event);
        expect(spyReset).toHaveBeenCalled();
        expect(sidebarComponent.dropperChecked).toEqual(true);
        expect(spyPickDropper).toHaveBeenCalled();
    });

    it(' should call resetCheckButton set isSelectionChecked and isSelectionRectangleChecked to true should call pickSelectionRect', () => {
        toolServiceStub.currentToolName = ToolUsed.Pencil;
        const event = new KeyboardEvent('window:keydown.r', {});
        const spyReset = spyOn(sidebarComponent, 'resetCheckedButton').and.stub();
        const spyPickSelectionRect = spyOn(sidebarComponent, 'pickSelectionRectangle').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.changeSelectionRectangleMode(event);
        expect(spyReset).toHaveBeenCalled();
        expect(sidebarComponent.selectionRectangleChecked).toEqual(true);
        expect(spyPickSelectionRect).toHaveBeenCalled();
    });

    it(' should call resetCheckButton set isSelectionChecked and isSelectionEllipseChecked to true should call pickSelectionEllipse', () => {
        toolServiceStub.currentToolName = ToolUsed.Pencil;
        const event = new KeyboardEvent('window:keydown.s', {});
        const spyReset = spyOn(sidebarComponent, 'resetCheckedButton').and.callThrough();
        const spyPickSelectionEllipse = spyOn(sidebarComponent, 'pickSelectionEllipse').and.stub();
        sidebarComponent.isDialogLoadSaveExport = true;
        window.dispatchEvent(event);
        sidebarComponent.changeSelectionEllipseMode(event);
        expect(spyReset).toHaveBeenCalled();
        expect(sidebarComponent.selectionEllipseChecked).toEqual(true);
        expect(spyPickSelectionEllipse).toHaveBeenCalled();
    });

    it('should call prevent default and selectAll for rectangle', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionRectangle;
        const event = new KeyboardEvent('window:keydown.control.a', {});
        const spyPreventDefault = spyOn(event, 'preventDefault').and.callThrough();
        const spySelectAllRect = spyOn(selectionRectangleStub, 'selectAll').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.selectAllCanvas(event);
        expect(spyPreventDefault).toHaveBeenCalled();
        expect(spySelectAllRect).toHaveBeenCalled();
    });

    it('should call prevent default and selectAll for ellipse', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionEllipse;
        const event = new KeyboardEvent('window:keydown.control.a', {});
        const spyPreventDefault = spyOn(event, 'preventDefault').and.callThrough();
        const spySelectAllEllipse = spyOn(selectionEllipseStub, 'selectAll').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.selectAllCanvas(event);
        expect(spyPreventDefault).toHaveBeenCalled();
        expect(spySelectAllEllipse).toHaveBeenCalled();
    });

    it('should call openCarousel when clicking ctrl  g', () => {
        const event = new KeyboardEvent('window:keydown.control.g', {});
        const spyopenCarrouselKey = spyOn(sidebarComponent, 'openCarrousel').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.openCarrouselKey(event);
        expect(spyopenCarrouselKey).toHaveBeenCalled();
    });

    it('should call openSaveServer when clicking ctrl s', () => {
        const event = new KeyboardEvent('window:keydown.control.s', {});
        const spyOpenSaveServerKey = spyOn(sidebarComponent, 'openSaveServer').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.openSaveServerKey(event);
        expect(spyOpenSaveServerKey).toHaveBeenCalled();
    });

    it('should call exportDrawing when clicking ctrl e', () => {
        const event = new KeyboardEvent('window:keydown.control.e', {});
        const spyExportDrawingKey = spyOn(sidebarComponent, 'exportDrawing').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.exportDrawingKey(event);
        expect(spyExportDrawingKey).toHaveBeenCalled();
    });

    it('should call onLeftArrow  when clicking on the left arrow key when using selectRectangle', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionRectangle as ToolUsed;
        const event = new KeyboardEvent('window:keydown.ArrowLeft', {});
        const spyPreventDefault = spyOn(event, 'preventDefault').and.callThrough();
        const spyonLeftArrowRect = spyOn(selectionRectangleStub, 'onLeftArrow').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.onLeftArrow(event);
        expect(spyPreventDefault).toHaveBeenCalled();
        expect(spyonLeftArrowRect).toHaveBeenCalled();
    });

    it('should call onLeftArrow  when clicking on the left arrow key when using selectEllipse', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionEllipse;
        const event = new KeyboardEvent('window:keydown.ArrowLeft', {});
        const spyPreventDefault = spyOn(event, 'preventDefault').and.callThrough();
        const spyonLeftArrowEllipse = spyOn(selectionEllipseStub, 'onLeftArrow').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.onLeftArrow(event);
        expect(spyPreventDefault).toHaveBeenCalled();
        expect(spyonLeftArrowEllipse).toHaveBeenCalled();
    });

    it('should call onRightArrow  when clicking on the right arrow key when using selectRectangle', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionRectangle as ToolUsed;
        const event = new KeyboardEvent('window:keydown.ArrowRight', {});
        const spyPreventDefault = spyOn(event, 'preventDefault').and.callThrough();
        const spyonRightArrowRect = spyOn(selectionRectangleStub, 'onRightArrow').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.onRightArrow(event);
        expect(spyPreventDefault).toHaveBeenCalled();
        expect(spyonRightArrowRect).toHaveBeenCalled();
    });

    it('should call onRightArrow  when clicking on the right arrow key when using selectEllipse', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionEllipse;
        const event = new KeyboardEvent('window:keydown.ArrowRight', {});
        const spyPreventDefault = spyOn(event, 'preventDefault').and.callThrough();
        const spyonRightArrowEllipse = spyOn(selectionEllipseStub, 'onRightArrow').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.onRightArrow(event);
        expect(spyPreventDefault).toHaveBeenCalled();
        expect(spyonRightArrowEllipse).toHaveBeenCalled();
    });

    it('should call onDownArrow  when clicking on the down arrow key when using selectRectangle', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionRectangle as ToolUsed;
        const event = new KeyboardEvent('window:keydown.ArrowDown', {});
        const spyPreventDefault = spyOn(event, 'preventDefault').and.callThrough();
        const spyonDownArrowRect = spyOn(selectionRectangleStub, 'onDownArrow').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.onDownArrow(event);
        expect(spyPreventDefault).toHaveBeenCalled();
        expect(spyonDownArrowRect).toHaveBeenCalled();
    });

    it('should call onDownArrow  when clicking on the right down key when using selectEllipse', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionEllipse;
        const event = new KeyboardEvent('window:keydown.ArrowDown', {});
        const spyPreventDefault = spyOn(event, 'preventDefault').and.callThrough();
        const spyonDownArrowEllipse = spyOn(selectionEllipseStub, 'onDownArrow').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.onDownArrow(event);
        expect(spyPreventDefault).toHaveBeenCalled();
        expect(spyonDownArrowEllipse).toHaveBeenCalled();
    });

    it('should call onUpArrow  when clicking on the up arrow key when using selectRectangle', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionRectangle as ToolUsed;
        const event = new KeyboardEvent('window:keydown.ArrowUp', {});
        const spyPreventDefault = spyOn(event, 'preventDefault').and.callThrough();
        const spyonUpArrowRect = spyOn(selectionRectangleStub, 'onUpArrow').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.onUpArrow(event);
        expect(spyPreventDefault).toHaveBeenCalled();
        expect(spyonUpArrowRect).toHaveBeenCalled();
    });

    it('should call onUpArrow  when clicking on the right up key when using selectEllipse', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionEllipse;
        const event = new KeyboardEvent('window:keydown.ArrowUp', {});
        const spyPreventDefault = spyOn(event, 'preventDefault').and.callThrough();
        const spyonUpArrowEllipse = spyOn(selectionEllipseStub, 'onUpArrow').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.onUpArrow(event);
        expect(spyPreventDefault).toHaveBeenCalled();
        expect(spyonUpArrowEllipse).toHaveBeenCalled();
    });

    it('should call onLeftArrowUp  when releasing on the left arrow key when using selectRectangle', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionRectangle as ToolUsed;
        const event = new KeyboardEvent('window:keyup.ArrowLeft', {});
        const spyPreventDefault = spyOn(event, 'preventDefault').and.callThrough();
        const spyonLeftUpArrowRect = spyOn(selectionRectangleStub, 'onLeftArrowUp').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.onLeftArrowUp(event);
        expect(spyPreventDefault).toHaveBeenCalled();
        expect(spyonLeftUpArrowRect).toHaveBeenCalled();
    });

    it('should call onLeftArrowUp  when releasing on the left arrow key when using selectEllipse', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionEllipse as ToolUsed;
        const event = new KeyboardEvent('window:keyup.ArrowLeft', {});
        const spyPreventDefault = spyOn(event, 'preventDefault').and.callThrough();
        const spyonLeftUpArrowEllipse = spyOn(selectionEllipseStub, 'onLeftArrowUp').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.onLeftArrowUp(event);
        expect(spyPreventDefault).toHaveBeenCalled();
        expect(spyonLeftUpArrowEllipse).toHaveBeenCalled();
    });

    it('should call onRightArrowUp  when releasing on the right arrow key when using selectRectangle', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionRectangle as ToolUsed;
        const event = new KeyboardEvent('window:keyup.ArrowRight', {});
        const spyPreventDefault = spyOn(event, 'preventDefault').and.callThrough();
        const spyonRightUpArrowRect = spyOn(selectionRectangleStub, 'onRightArrowUp').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.onRightArrowUp(event);
        expect(spyPreventDefault).toHaveBeenCalled();
        expect(spyonRightUpArrowRect).toHaveBeenCalled();
    });

    it('should call onRightArrowUp  when releasing on the right arrow key when using selectEllipse', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionEllipse as ToolUsed;
        const event = new KeyboardEvent('window:keyup.ArrowRight', {});
        const spyPreventDefault = spyOn(event, 'preventDefault').and.callThrough();
        const spyonRightUpArrowEllipse = spyOn(selectionEllipseStub, 'onRightArrowUp').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.onRightArrowUp(event);
        expect(spyPreventDefault).toHaveBeenCalled();
        expect(spyonRightUpArrowEllipse).toHaveBeenCalled();
    });

    it('should call onDownArrowUp  when releasing on the down arrow key when using selectRectangle', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionRectangle as ToolUsed;
        const event = new KeyboardEvent('window:keyup.ArrowDown', {});
        const spyPreventDefault = spyOn(event, 'preventDefault').and.callThrough();
        const spyonDownUpArrowRect = spyOn(selectionRectangleStub, 'onDownArrowUp').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.onDownArrowUp(event);
        expect(spyPreventDefault).toHaveBeenCalled();
        expect(spyonDownUpArrowRect).toHaveBeenCalled();
    });

    it('should call onDownArrowUp  when releasing on the down arrow key when using selectEllipse', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionEllipse as ToolUsed;
        const event = new KeyboardEvent('window:keyup.ArrowDown', {});
        const spyPreventDefault = spyOn(event, 'preventDefault').and.callThrough();
        const spyonDownUpArrowEllipse = spyOn(selectionEllipseStub, 'onDownArrowUp').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.onDownArrowUp(event);
        expect(spyPreventDefault).toHaveBeenCalled();
        expect(spyonDownUpArrowEllipse).toHaveBeenCalled();
    });

    it('should call onUpArrowUp  when releasing on the up arrow key when using selectRectangle', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionRectangle as ToolUsed;
        const event = new KeyboardEvent('window:keyup.ArrowUp', {});
        const spyPreventDefault = spyOn(event, 'preventDefault').and.callThrough();
        const spyonUpUpArrowRect = spyOn(selectionRectangleStub, 'onUpArrowUp').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.onUpArrowUp(event);
        expect(spyPreventDefault).toHaveBeenCalled();
        expect(spyonUpUpArrowRect).toHaveBeenCalled();
    });

    it('should call onUpArrowUp  when releasing on the up arrow key when using selectEllipse', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionEllipse as ToolUsed;
        const event = new KeyboardEvent('window:keyup.ArrowUp', {});
        const spyPreventDefault = spyOn(event, 'preventDefault').and.callThrough();
        const spyonUpUpArrowEllipse = spyOn(selectionEllipseStub, 'onUpArrowUp').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.onUpArrowUp(event);
        expect(spyPreventDefault).toHaveBeenCalled();
        expect(spyonUpUpArrowEllipse).toHaveBeenCalled();
    });

    it('should call undo if isUndoDisabled is false and ctrl z is pressed', () => {
        const event = new KeyboardEvent('window:keydown.control.z', {});
        undoRedoStub.isUndoDisabled = false;
        const spyUndo = spyOn(undoRedoStub, 'undo').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.callUndo(event);
        expect(spyUndo).toHaveBeenCalled();
    });

    it('should call redo if isRedoDisabled is false and ctrl shift z is pressed', () => {
        const event = new KeyboardEvent('window:keydown.control.shift.z', {});
        undoRedoStub.isRedoDisabled = false;
        const spyRedo = spyOn(undoRedoStub, 'redo').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.callRedo(event);
        expect(spyRedo).toHaveBeenCalled();
    });

    it('should change to spray mode if a is pressed', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionEllipse;
        const event = new KeyboardEvent('window:keydown.a', {});
        const spySprayer = spyOn(sidebarComponent, 'pickSprayer').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.changeSprayMode(event);
        expect(spySprayer).toHaveBeenCalled();
    });

    it('should call btnCallRedo', () => {
        const spyRedo = spyOn(undoRedoStub, 'redo').and.stub();
        sidebarComponent.btnCallRedo();
        expect(spyRedo).toHaveBeenCalled();
    });

    it('should call btnCallUndo', () => {
        const spyUndo = spyOn(undoRedoStub, 'undo').and.stub();
        sidebarComponent.btnCallUndo();
        expect(spyUndo).toHaveBeenCalled();
    });

    it('should call deactivateGrid when clicking on button and isGridSettingsChecked =true', () => {
        gridStub.isGridSettingsChecked = true;
        sidebarComponent.btnCallGrid();
        expect(deactivateGridSpy).toHaveBeenCalled();
        expect(gridStub.isGridSettingsChecked).toEqual(false);
    });

    it('should call deactivateGrid when clicking on button and isGridSettingsChecked = false', () => {
        gridStub.isGridSettingsChecked = false;
        sidebarComponent.btnCallGrid();
        expect(gridStub.isGridSettingsChecked).toEqual(true);
    });

    it('should pick text', () => {
        const switchToolSpy = spyOn(toolServiceStub, 'switchTool').and.stub();
        sidebarComponent.pickText();
        expect(drawingStub.cursorUsed).toEqual('text');
        expect(switchToolSpy).toHaveBeenCalled();
        expect(sidebarComponent.isDialogLoadSaveExport).toEqual(true);
    });

    it('should pick feather', () => {
        const switchToolSpy = spyOn(toolServiceStub, 'switchTool').and.stub();
        sidebarComponent.pickFeather();
        expect(drawingStub.cursorUsed).toEqual(cursorName.none);
        expect(switchToolSpy).toHaveBeenCalled();
    });

    it('should call resetChecked button, set isFeatherChecked to true and call pickFeather when pressing p', () => {
        toolServiceStub.currentToolName = ToolUsed.Feather;
        const event = new KeyboardEvent('window:keydown.p', {});
        const resetCheckedButtonSpy = spyOn(sidebarComponent, 'resetCheckedButton').and.callThrough();
        const spyPickFeather = spyOn(sidebarComponent, 'pickFeather').and.callThrough();
        window.dispatchEvent(event);
        sidebarComponent.changeFeatherMode(event);
        expect(resetCheckedButtonSpy).toHaveBeenCalled();
        expect(spyPickFeather).toHaveBeenCalled();
    });

    it('should call changeFeatherAngle when scrolling using the mouse wheel', () => {
        toolServiceStub.currentToolName = ToolUsed.Feather;
        const event = new WheelEvent('window:wheel', {});
        const changeFeatherAngleSpy = spyOn(sidebarComponent, 'changeAngleWithWheel').and.callThrough();
        const changeAngleWithScrollSpy = spyOn(featherStub, 'changeAngleWithScroll').and.callThrough();
        window.dispatchEvent(event);
        sidebarComponent.changeAngleWithWheel(event);
        expect(changeFeatherAngleSpy).toHaveBeenCalled();
        expect(changeAngleWithScrollSpy).toHaveBeenCalled();
    });

    it('should call addOrRetract when scrolling using the mouse wheel and changeFeatherAngle is called', () => {
        toolServiceStub.currentToolName = ToolUsed.Feather;
        const event = new WheelEvent('window:wheel', {});
        const addOrRetractSpy = spyOn(featherStub, 'addOrRetract').and.callThrough();
        window.dispatchEvent(event);
        sidebarComponent.changeAngleWithWheel(event);
        expect(addOrRetractSpy).toHaveBeenCalled();
    });

    it('should call onWheelScroll when scrolling using the mouse wheel and changeFeatherAngle is called', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionEllipse;
        const event = new WheelEvent('window:wheel', {});
        const onWheelScrollSpy = spyOn(rotationStub, 'onWheelScroll').and.callThrough();
        window.dispatchEvent(event);
        sidebarComponent.changeAngleWithWheel(event);
        expect(onWheelScrollSpy).toHaveBeenCalled();
    });

    it('should call onWheelScroll when scrolling using the mouse wheel and changeFeatherAngle is called', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionRectangle;
        const event = new WheelEvent('window:wheel', {});
        const onWheelScrollSpy = spyOn(rotationStub, 'onWheelScroll').and.callThrough();
        window.dispatchEvent(event);
        sidebarComponent.changeAngleWithWheel(event);
        expect(onWheelScrollSpy).toHaveBeenCalled();
    });

    it('should call onWheelScroll when scrolling using the mouse wheel and changeFeatherAngle is called', () => {
        toolServiceStub.currentToolName = ToolUsed.MagicWand;
        const event = new WheelEvent('window:wheel', {});
        const onWheelScrollSpy = spyOn(rotationStub, 'onWheelScroll').and.callThrough();
        window.dispatchEvent(event);
        sidebarComponent.changeAngleWithWheel(event);
        expect(onWheelScrollSpy).toHaveBeenCalled();
    });

    it('should call addOrRetract and changeAngleWithScroll when scrolling using the mouse wheel and changeFeatherAngle is called', () => {
        toolServiceStub.currentToolName = ToolUsed.Stamp;
        const event = new WheelEvent('window:wheel', {});
        const addOrRetractSpy = spyOn(stampServiceStub, 'addOrRetract').and.callThrough();
        const changeAngleWithScrollSpy = spyOn(stampServiceStub, 'changeAngleWithScroll').and.callThrough();
        window.dispatchEvent(event);
        sidebarComponent.changeAngleWithWheel(event);
        expect(addOrRetractSpy).toHaveBeenCalled();
        expect(changeAngleWithScrollSpy).toHaveBeenCalled();
    });

    it('should change altPressed value to true when alt is pressed ', () => {
        toolServiceStub.currentToolName = ToolUsed.Feather;
        const event = new KeyboardEvent('window:keydown.alt', {});
        const altPressedSpy = spyOn(sidebarComponent, 'altPressed').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.altPressed(event);
        expect(altPressedSpy).toHaveBeenCalled();
    });

    it('should change featherStub altpressed to true', () => {
        toolServiceStub.currentToolName = ToolUsed.Feather;
        const event = new KeyboardEvent('window:keydown.alt', {});
        window.dispatchEvent(event);
        sidebarComponent.altPressed(event);
        expect(featherStub.altPressed).toEqual(true);
    });
    it('should change featherStub altpressed to true', () => {
        toolServiceStub.switchTool(ToolUsed.SelectionRectangle);
        const event = new KeyboardEvent('window:keydown.alt', {});
        window.dispatchEvent(event);
        sidebarComponent.altPressed(event);
        expect(rotationStub.altPressed).toEqual(true);
    });
    it('should change featherStub altpressed to true', () => {
        toolServiceStub.currentToolName = ToolUsed.Stamp;
        const event = new KeyboardEvent('window:keydown.alt', {});
        window.dispatchEvent(event);
        sidebarComponent.altPressed(event);
        expect(stampServiceStub.isAltPressed).toEqual(true);
    });
    it('should pickGridSettings', () => {
        const switchToolSpy = spyOn(toolServiceStub, 'switchTool').and.stub();
        sidebarComponent.pickGridSettings();
        expect(drawingStub.cursorUsed).toEqual(cursorName.default);
        expect(switchToolSpy).toHaveBeenCalled();
    });

    it('should call resetCheckButton and set isTextChecked to true when changeTextMode is called', () => {
        toolServiceStub.currentToolName = ToolUsed.Pencil;
        const event = new KeyboardEvent('window:keydown.t', {});
        const spyReset = spyOn(sidebarComponent, 'resetCheckedButton').and.callThrough();
        window.dispatchEvent(event);
        sidebarComponent.changeTextMode(event);
        expect(spyReset).toHaveBeenCalled();
        expect(sidebarComponent.textChecked).toEqual(true);
    });

    it('should call copyImage if control c is pressed for selection Rectangle', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionRectangle;
        const event = new KeyboardEvent('window:keydown.control.c', {});
        const preventDefaultSpy = spyOn(event, 'preventDefault').and.callThrough();
        const copyImageSpy = spyOn(selectionRectangleStub, 'copyImage').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.copySelection(event);
        expect(copyImageSpy).toHaveBeenCalled();
        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should call copyImage if control c is pressed for selection Ellipse', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionEllipse;
        const event = new KeyboardEvent('window:keydown.control.c', {});
        const preventDefaultSpy = spyOn(event, 'preventDefault').and.callThrough();
        const copyImageSpy = spyOn(selectionEllipseStub, 'copyImage').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.copySelection(event);
        expect(copyImageSpy).toHaveBeenCalled();
        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should call cutImage if control x is pressed for selection Rectangle', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionRectangle;
        const event = new KeyboardEvent('window:keydown.control.x', {});
        const preventDefaultSpy = spyOn(event, 'preventDefault').and.callThrough();
        const cutSelectionSpy = spyOn(selectionRectangleStub, 'copyImage').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.cutSelection(event);
        expect(cutSelectionSpy).toHaveBeenCalled();
        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should call cutImage if control x is pressed for selection Ellipse', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionEllipse;
        const event = new KeyboardEvent('window:keydown.control.x', {});
        const preventDefaultSpy = spyOn(event, 'preventDefault').and.callThrough();
        const cutSelectionSpy = spyOn(selectionEllipseStub, 'copyImage').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.cutSelection(event);
        expect(cutSelectionSpy).toHaveBeenCalled();
        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should call pasteImage if control v is pressed for selection Rectangle', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionRectangle;
        const event = new KeyboardEvent('window:keydown.control.v', {});
        const preventDefaultSpy = spyOn(event, 'preventDefault').and.callThrough();
        window.dispatchEvent(event);
        sidebarComponent.pasteSelection(event);
        expect(pasteImageRectSpy).toHaveBeenCalled();
        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should call pasteImage if control v is pressed for selection Ellipse', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionEllipse;
        const event = new KeyboardEvent('window:keydown.control.v', {});
        const preventDefaultSpy = spyOn(event, 'preventDefault').and.callThrough();
        window.dispatchEvent(event);
        sidebarComponent.pasteSelection(event);
        expect(pasteImageEllipseSpy).toHaveBeenCalled();
        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should call deleteSelection if delete is pressed for selection Rectangle', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionRectangle;
        drawingStub.baseCtx.fillStyle = 'green';
        drawingStub.baseCtx.fillRect(10, 10, drawingStub.canvas.width, drawingStub.canvas.height);
        const event = new KeyboardEvent('window:keydown.Delete', {});
        const preventDefaultSpy = spyOn(event, 'preventDefault').and.callThrough();
        const delSelectionSpy = spyOn(selectionRectangleStub, 'deleteImage').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.delSelection(event);
        expect(delSelectionSpy).toHaveBeenCalled();
        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should call deleteSelection if delete is pressed for selection Ellipse', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionEllipse;
        drawingStub.baseCtx.fillStyle = 'green';
        drawingStub.baseCtx.fillRect(10, 10, drawingStub.canvas.width, drawingStub.canvas.height);
        const event = new KeyboardEvent('window:keydown.Delete', {});
        const preventDefaultSpy = spyOn(event, 'preventDefault').and.callThrough();
        const delSelectionSpy = spyOn(selectionEllipseStub, 'deleteImage').and.stub();
        window.dispatchEvent(event);
        sidebarComponent.delSelection(event);
        expect(delSelectionSpy).toHaveBeenCalled();
        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should call deactivateGrid if isGridSettingsChecked = true', () => {
        const event = new KeyboardEvent('window:keydown.g', {});
        gridStub.isGridSettingsChecked = true;
        window.dispatchEvent(event);
        sidebarComponent.activateGrid(event);
        expect(gridStub.isGridSettingsChecked).toEqual(false);
        expect(deactivateGridSpy).toHaveBeenCalled();
    });

    it('should call activateGrid if isGridSettingsChecked = false', () => {
        const event = new KeyboardEvent('window:keydown.g', {});
        gridStub.isGridSettingsChecked = false;
        window.dispatchEvent(event);
        sidebarComponent.activateGrid(event);
        expect(gridStub.isGridSettingsChecked).toEqual(true);
        expect(activateGridSpy).toHaveBeenCalled();
    });

    it('should decrement the value of squareWidth', () => {
        const event = new KeyboardEvent('window:keydown.-', {});
        toolServiceStub.currentToolName = ToolUsed.Grid;
        const oldValue = gridStub.squareWidth;
        window.dispatchEvent(event);
        sidebarComponent.decreaseSquareGrid(event);
        expect(gridStub.squareWidth).toEqual(oldValue - 5);
    });

    it('should increment the value of squareWidth', () => {
        toolServiceStub.currentToolName = ToolUsed.Grid;
        const event = new KeyboardEvent('window:keydown.+', {});
        const oldValue = gridStub.squareWidth;
        window.dispatchEvent(event);
        sidebarComponent.increaseSquareGrid(event);
        expect(gridStub.squareWidth).toEqual(oldValue + 5);
    });

    it('should call resetMagnetism if isMagnetismActive = true', () => {
        const event = new KeyboardEvent('window:keydown.m', {});
        magnetismStub.isMagnetismActive = true;
        window.dispatchEvent(event);
        sidebarComponent.activateMagnetism(event);
        expect(magnetismStub.isMagnetismActive).toEqual(false);
        expect(resetMagnetismSpy).toHaveBeenCalled();
    });

    it('should call resetMagnetism if isMagnetismActive = false and set isMagentismActive to true', () => {
        magnetismStub.isMagnetismActive = false;
        const event = new KeyboardEvent('window:keydown.m', {});
        window.dispatchEvent(event);
        sidebarComponent.activateMagnetism(event);
        expect(magnetismStub.isMagnetismActive).toEqual(true);
    });

    it('should change altPressed value to false when releasing alt ', () => {
        toolServiceStub.currentToolName = ToolUsed.Feather;
        const event = new KeyboardEvent('window:keyup.alt', {});
        window.dispatchEvent(event);
        sidebarComponent.altReleased(event);
        expect(featherStub.altPressed).toEqual(false);
    });
    it('should change altPressed value to false when releasing alt ', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionEllipse;
        const event = new KeyboardEvent('window:keyup.alt', {});
        window.dispatchEvent(event);
        sidebarComponent.altReleased(event);
        expect(rotationStub.altPressed).toEqual(false);
    });
    it('should change altPressed value to false when releasing alt ', () => {
        toolServiceStub.currentToolName = ToolUsed.Stamp;
        const event = new KeyboardEvent('window:keyup.alt', {});
        window.dispatchEvent(event);
        sidebarComponent.altReleased(event);
        expect(stampServiceStub.isAltPressed).toEqual(false);
    });
    it('should change dPressed value to false when releasing d ', () => {
        toolServiceStub.currentToolName = ToolUsed.Color;
        const event = new KeyboardEvent('window:keydown.d', {});
        expect(sidebarComponent['isStampChecked']).toEqual(false);
        window.dispatchEvent(event);
        sidebarComponent.changeStampMode(event);
        expect(sidebarComponent['isStampChecked']).toEqual(false);
    });
    it('should change dPressed value to false when releasing d ', () => {
        toolServiceStub.currentToolName = ToolUsed.NONE;
        const event = new KeyboardEvent('window:keydown.d', {});
        expect(sidebarComponent['isStampChecked']).toEqual(false);
        window.dispatchEvent(event);
        sidebarComponent.changeStampMode(event);
        expect(sidebarComponent['isStampChecked']).toEqual(true);
    });
    it('should change vPressed value to false when releasing v ', () => {
        sidebarComponent['isDialogLoadSaveExport'] = true;
        toolServiceStub.currentToolName = ToolUsed.NONE;
        const event = new KeyboardEvent('window:keydown.v', {});
        expect(sidebarComponent['isMagicWandSelectionChecked']).toEqual(false);
        window.dispatchEvent(event);
        sidebarComponent.changeMagicWandMode(event);
        expect(sidebarComponent['isMagicWandSelectionChecked']).toEqual(true);
    });
    it('should change vPressed value to false when releasing v ', () => {
        sidebarComponent['isDialogLoadSaveExport'] = true;
        toolServiceStub.currentToolName = ToolUsed.Color;
        const event = new KeyboardEvent('window:keydown.v', {});
        expect(sidebarComponent['isMagicWandSelectionChecked']).toEqual(false);
        window.dispatchEvent(event);
        sidebarComponent.changeMagicWandMode(event);
        expect(sidebarComponent['isMagicWandSelectionChecked']).toEqual(false);
    });
    it('should change Pressed cvalue to false when releasing c ', () => {
        sidebarComponent['isDialogLoadSaveExport'] = true;
        toolServiceStub.currentToolName = ToolUsed.Color;
        const event = new KeyboardEvent('window:keydown.c', {});
        expect(sidebarComponent['isStampChecked']).toEqual(false);
        window.dispatchEvent(event);
        sidebarComponent.changePencilMode(event);
        expect(sidebarComponent['isStampChecked']).toEqual(false);
    });

    it('should change Pressed cvalue to false when releasing c ', () => {
        sidebarComponent['isDialogLoadSaveExport'] = true;
        toolServiceStub.currentToolName = ToolUsed.NONE;
        const event = new KeyboardEvent('window:keydown.c', {});
        expect(sidebarComponent['isPencilChecked']).toEqual(false);
        window.dispatchEvent(event);
        sidebarComponent.changePencilMode(event);
        expect(sidebarComponent['isPencilChecked']).toEqual(true);
    });
});
