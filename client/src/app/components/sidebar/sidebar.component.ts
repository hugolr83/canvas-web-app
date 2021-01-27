import { Component, HostListener } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { cursorName } from '@app/classes/cursor-name';
import { SubToolSelected } from '@app/classes/sub-tool-selected';
import { ToolUsed } from '@app/classes/tool';
import { CarouselComponent } from '@app/components/dialog-carrousel-picture/dialog-carrousel-picture.component';
import { DialogCreateNewDrawingComponent } from '@app/components/dialog-create-new-drawing/dialog-create-new-drawing.component';
import { DialogExportEmailComponent } from '@app/components/dialog-export-email/dialog-export-email.component';
import { DialogExportDrawingComponent } from '@app/components/dialog-export-locally/dialog-export-locally.component';
import { DialogUploadComponent } from '@app/components/dialog-upload/dialog-upload.component';
import { WriteTextDialogUserGuideComponent } from '@app/components/write-text-dialog-user-guide/write-text-dialog-user-guide.component';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolService } from '@app/services/tool-service';
import { BrushService } from '@app/services/tools/brush.service';
import { EllipseService } from '@app/services/tools/ellipse.service';
import { EraserService } from '@app/services/tools/eraser-service';
import { FeatherService } from '@app/services/tools/feather.service';
import { GridService, MAX_SQUARE_WIDTH, MIN_SQUARE_WIDTH, SQUARE_STEP_SIZE } from '@app/services/tools/grid.service';
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
import { StampService } from '@app/services/tools/stamp.service';
import { TextService } from '@app/services/tools/text.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    // This file is longer than 350 lines because of all the hostlistener, but we have no over choice than to put them in this component
    // tslint:disable:max-file-line-count
    // We need this alias for the enum so ngSwitchCase look way better than just numbers.
    // I can't stand reading numbers anymore.
    // tslint:disable-next-line: typedef
    toolUsed = ToolUsed;

    isDialogOpen: boolean = false;
    isDialogLoadSaveExport: boolean = true;
    lineWidth: number;
    newDrawingRef: MatDialogRef<DialogCreateNewDrawingComponent>;
    checkDocumentationRef: MatDialogRef<WriteTextDialogUserGuideComponent>;
    dialogLoadRef: MatDialogRef<CarouselComponent>;
    dialogSaveRef: MatDialogRef<DialogUploadComponent>;
    exportDrawingRef: MatDialogRef<DialogExportDrawingComponent>;
    exportEmailRef: MatDialogRef<DialogExportEmailComponent>;
    private isPencilChecked: boolean = false;
    private isEraserChecked: boolean = false;
    private isBrushChecked: boolean = false;
    private isLineChecked: boolean = false;
    private isRectangleChecked: boolean = false;
    private isEllipseChecked: boolean = false;
    private isColorChecked: boolean = false;
    private isDropperChecked: boolean = false;
    private isSelectionEllipseChecked: boolean = false;
    private isSelectionRectangleChecked: boolean = false;
    private isPolygonChecked: boolean = false;
    private isPaintBucketChecked: boolean = false;
    private isSprayChecked: boolean = false;
    private isFeatherChecked: boolean = false;
    private isTextChecked: boolean = false;
    private isMagicWandSelectionChecked: boolean = false;
    private isStampChecked: boolean = false;
    private curCanvasDefaultSize: number = 40;

    constructor(
        public drawingService: DrawingService,
        public dialogCreator: MatDialog,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        public toolService: ToolService,
        public rectangleService: RectangleService,
        public ellipseService: EllipseService,
        public brushService: BrushService,
        public pencilService: PencilService,
        public eraserService: EraserService,
        public colorService: ColorService,
        public lineService: LineService,
        public polygonService: PolygonService,
        public paintBucketService: PaintBucketService,
        public undoRedoService: UndoRedoService,
        public selectionRectangleService: SelectionRectangleService,
        public selectionEllipseService: SelectionEllipseService,
        public magicWandService: MagicWandService,
        public gridService: GridService,
        public magnetismService: MagnetismService,
        public featherService: FeatherService,
        private automaticSaveService: AutomaticSaveService,
        public rotationService: RotationService,
        public stampService: StampService,
    ) {
        this.toolService.switchTool(ToolUsed.Color); // default tool on the sidebar
        this.iconRegistry.addSvgIcon('eraser', this.sanitizer.bypassSecurityTrustResourceUrl('assets/clarity_eraser-solid.svg'));
        this.iconRegistry.addSvgIcon('polygon', this.sanitizer.bypassSecurityTrustResourceUrl('assets/polygon.svg'));
        this.iconRegistry.addSvgIcon('paint-bucket', this.sanitizer.bypassSecurityTrustResourceUrl('assets/paint-bucket.svg'));
        this.iconRegistry.addSvgIcon('feather', this.sanitizer.bypassSecurityTrustResourceUrl('assets/feather.svg'));
    }

    clearCanvas(): void {
        if (!this.drawingService.isCanvasBlank()) {
            this.newDrawingRef = this.dialogCreator.open(DialogCreateNewDrawingComponent);
            this.isDialogOpen = true;
            this.newDrawingRef.afterClosed().subscribe(() => {
                this.isDialogOpen = false;
            });
            this.automaticSaveService.save();
        }
    }

    exportDrawing(): void {
        if (this.isDialogLoadSaveExport) {
            this.exportDrawingRef = this.dialogCreator.open(DialogExportDrawingComponent);
            this.isDialogLoadSaveExport = false;
            this.exportDrawingRef.afterClosed().subscribe(() => {
                this.isDialogLoadSaveExport = true;
            });
            this.automaticSaveService.save();
        }
    }

    exportEmail(): void {
        if (this.isDialogLoadSaveExport) {
            this.exportEmailRef = this.dialogCreator.open(DialogExportEmailComponent);
            this.isDialogLoadSaveExport = false;
            this.exportEmailRef.afterClosed().subscribe(() => {
                this.isDialogLoadSaveExport = true;
            });
        }
    }

    createNewDrawing(): void {
        this.dialogCreator.open(DialogCreateNewDrawingComponent);
        this.automaticSaveService.save();
    }

    openCarrousel(): void {
        if (this.isDialogLoadSaveExport) {
            this.isDialogLoadSaveExport = false;
            this.dialogLoadRef = this.dialogCreator.open(CarouselComponent, {
                width: '90%',
                height: '90%',
            });
            this.dialogLoadRef.afterClosed().subscribe(() => {
                this.isDialogLoadSaveExport = true;
            });
        }
    }
    openSaveServer(): void {
        if (this.isDialogLoadSaveExport) {
            this.isDialogLoadSaveExport = false;
            this.dialogSaveRef = this.dialogCreator.open(DialogUploadComponent, {
                width: '90%',
                height: '90%',
            });
            this.dialogSaveRef.afterClosed().subscribe(() => {
                this.isDialogLoadSaveExport = true;
            });
        }
    }

    openUserGuide(): void {
        this.checkDocumentationRef = this.dialogCreator.open(WriteTextDialogUserGuideComponent, {
            width: '90%',
            height: '100%',
            disableClose: true,
        });
    }

    pickPencil(): void {
        this.drawingService.cursorUsed = cursorName.pencil;
        this.toolService.switchTool(ToolUsed.Pencil);
        this.isDialogLoadSaveExport = true;
    }

    // the following get are used to make sure the display of sidebar tools are
    // are properly pressed on
    get pencilChecked(): boolean {
        return this.isPencilChecked;
    }

    pickEraser(): void {
        this.drawingService.cursorUsed = cursorName.eraser;
        this.toolService.switchTool(ToolUsed.Eraser);
        this.isDialogLoadSaveExport = true;
    }

    get eraserChecked(): boolean {
        return this.isEraserChecked;
    }

    pickBrush(subTool: number): void {
        this.drawingService.cursorUsed = cursorName.default;
        this.toolService.switchTool(ToolUsed.Brush);
        this.toolService.currentTool.subToolSelect = subTool;
        if (this.drawingService.baseCtx.lineWidth < this.brushService.pixelMinBrush) {
            this.drawingService.baseCtx.lineWidth = this.drawingService.previewCtx.lineWidth = this.brushService.pixelMinBrush;
        } else this.drawingService.previewCtx.lineWidth = this.drawingService.baseCtx.lineWidth;
        this.isDialogLoadSaveExport = true;
    }

    get brushChecked(): boolean {
        return this.isBrushChecked;
    }

    pickLine(): void {
        this.drawingService.cursorUsed = cursorName.default;
        this.toolService.switchTool(ToolUsed.Line);
        this.toolService.currentTool.subToolSelect = SubToolSelected.tool1;
        this.isDialogLoadSaveExport = true;
    }

    get lineChecked(): boolean {
        return this.isLineChecked;
    }

    pickRectangle(subTool: SubToolSelected): void {
        this.drawingService.cursorUsed = cursorName.default;
        this.toolService.switchTool(ToolUsed.Rectangle);
        this.toolService.currentTool.subToolSelect = subTool;
        this.isDialogLoadSaveExport = true;
    }

    get rectangleChecked(): boolean {
        return this.isRectangleChecked;
    }

    pickEllipse(subTool2: number): void {
        this.drawingService.cursorUsed = cursorName.default;
        this.toolService.switchTool(ToolUsed.Ellipse);
        this.toolService.currentTool.subToolSelect = subTool2;
        this.isDialogLoadSaveExport = true;
    }

    get ellipseChecked(): boolean {
        return this.isEllipseChecked;
    }

    pickPolygon(subTool3: number): void {
        this.drawingService.cursorUsed = cursorName.default;
        this.toolService.switchTool(ToolUsed.Polygon);
        this.toolService.currentTool.subToolSelect = subTool3;
        this.isDialogLoadSaveExport = true;
    }

    get polygonChecked(): boolean {
        return this.isPolygonChecked;
    }

    pickColor(): void {
        this.drawingService.cursorUsed = cursorName.default;
        this.toolService.switchTool(ToolUsed.Color);
        this.isDialogLoadSaveExport = true;
    }

    get colorChecked(): boolean {
        return this.isColorChecked;
    }

    pickPaintBucket(): void {
        this.drawingService.cursorUsed = cursorName.default;
        this.toolService.switchTool(ToolUsed.PaintBucket);
        this.isDialogLoadSaveExport = true;
    }

    get paintBucketChecked(): boolean {
        return this.isPaintBucketChecked;
    }
    pickDropper(): void {
        this.resetCursorCanvas();
        this.drawingService.cursorUsed = 'pointer';
        this.toolService.switchTool(ToolUsed.Dropper);
        this.isDialogLoadSaveExport = true;
    }

    get dropperChecked(): boolean {
        return this.isDropperChecked;
    }

    pickSelectionRectangle(): void {
        this.drawingService.cursorUsed = cursorName.default;
        this.toolService.switchTool(ToolUsed.SelectionRectangle);
        this.isDialogLoadSaveExport = true;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    get selectionRectangleChecked(): boolean {
        return this.isSelectionRectangleChecked;
    }

    pickSelectionEllipse(): void {
        this.drawingService.cursorUsed = cursorName.default;
        this.toolService.switchTool(ToolUsed.SelectionEllipse);
        this.isDialogLoadSaveExport = true;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    get selectionEllipseChecked(): boolean {
        return this.isSelectionEllipseChecked;
    }

    pickSprayer(): void {
        this.drawingService.cursorUsed = cursorName.default;
        this.toolService.switchTool(ToolUsed.Spray);
    }

    get sprayChecked(): boolean {
        return this.isSprayChecked;
    }

    pickText(): void {
        this.drawingService.cursorUsed = 'text';
        this.toolService.switchTool(ToolUsed.Text);
    }
    private isOnPreviewCtx(): boolean {
        if (this.toolService.currentToolName === ToolUsed.Text) {
            return !(this.toolService.currentTool as TextService).isOnPreviewCanvas();
        }
        return true;
    }
    get textChecked(): boolean {
        return this.isTextChecked;
    }

    pickMagicWandSelection(): void {
        this.drawingService.cursorUsed = cursorName.default;
        this.toolService.switchTool(ToolUsed.MagicWand);
        this.isDialogLoadSaveExport = true;
    }

    get MagicWandSelectionChecked(): boolean {
        return this.isMagicWandSelectionChecked;
    }
    pickStamp(): void {
        this.resetCursorCanvas();
        this.drawingService.cursorUsed = 'none';
        this.toolService.switchTool(ToolUsed.Stamp);
        this.isStampChecked = true;
    }

    get stampChecked(): boolean {
        return this.isStampChecked;
    }

    pickGridSettings(): void {
        this.drawingService.cursorUsed = cursorName.default;
        this.toolService.switchTool(ToolUsed.Grid);
        this.isDialogLoadSaveExport = true;
    }
    pickFeather(): void {
        this.resetCursorCanvas();
        this.drawingService.cursorUsed = cursorName.none;
        this.toolService.switchTool(ToolUsed.Feather);
    }

    get selectionFeatherChecked(): boolean {
        return this.isFeatherChecked;
    }

    resetCursorCanvas(): void {
        this.drawingService.cursorCtx.canvas.width = this.curCanvasDefaultSize;
        this.drawingService.cursorCtx.canvas.height = this.curCanvasDefaultSize;
        this.drawingService.cursorCtx.clearRect(0, 0, this.drawingService.cursorCtx.canvas.width, this.drawingService.cursorCtx.canvas.height);
    }

    resetCheckedButton(): void {
        this.isPencilChecked = false;
        this.isEraserChecked = false;
        this.isBrushChecked = false;
        this.isLineChecked = false;
        this.isRectangleChecked = false;
        this.isEllipseChecked = false;
        this.isColorChecked = false;
        this.isPaintBucketChecked = false;
        this.isDropperChecked = false;
        this.isSelectionEllipseChecked = false;
        this.isSelectionRectangleChecked = false;
        this.isSprayChecked = false;
        this.isFeatherChecked = false;
        this.isTextChecked = false;
        this.isStampChecked = false;
    }

    checkboxChangeToggle(args: MatCheckboxChange): void {
        this.toolService.currentTool.subToolSelect = args.checked ? SubToolSelected.tool2 : SubToolSelected.tool1;
    }

    btnCallRedo(): void {
        this.undoRedoService.redo();
        this.automaticSaveService.save();
    }

    btnCallUndo(): void {
        this.undoRedoService.undo();
        this.automaticSaveService.save();
    }

    btnCallGrid(): void {
        if (this.gridService.isGridSettingsChecked) {
            this.gridService.isGridSettingsChecked = false;
            this.gridService.deactivateGrid();
            return;
        }
        this.gridService.isGridSettingsChecked = true;
        this.gridService.activateGrid();
        return;
    }

    buttonSelectAllMagicWand(): void {
        this.pickSelectionRectangle();
        this.selectionRectangleService.selectAll();
    }

    // keybinding control o for new drawing
    @HostListener('window:keydown.control.o', ['$event']) onKeyDown(event: KeyboardEvent): void {
        if (!this.isDialogOpen && !this.drawingService.isCanvasBlank() && this.isDialogLoadSaveExport && this.isOnPreviewCtx()) {
            event.preventDefault();
            this.clearCanvas();
        }
    }

    @HostListener('window:keydown.1', ['$event']) changeRectangleMode(event: KeyboardEvent): void {
        if (this.toolService.currentToolName !== ToolUsed.Color && this.isDialogLoadSaveExport && this.isOnPreviewCtx()) {
            this.resetCheckedButton();
            this.isRectangleChecked = true;
            this.pickRectangle(1);
        }
    }

    @HostListener('window:keydown.2', ['$event']) changleEllipseMode(event: KeyboardEvent): void {
        if (this.toolService.currentToolName !== ToolUsed.Color && this.isDialogLoadSaveExport && this.isOnPreviewCtx()) {
            this.resetCheckedButton();
            this.isEllipseChecked = true;
            this.pickEllipse(SubToolSelected.tool1);
        }
    }

    @HostListener('window:keydown.3', ['$event'])
    changePolygonMode(event: KeyboardEvent): void {
        if (this.toolService.currentToolName !== ToolUsed.Color && this.isDialogLoadSaveExport && this.isOnPreviewCtx()) {
            this.resetCheckedButton();
            this.isPolygonChecked = true;
            this.pickPolygon(SubToolSelected.tool3);
        }
    }

    @HostListener('window:keydown.e', ['$event'])
    changeEraserMode(event: KeyboardEvent): void {
        if (this.toolService.currentToolName !== ToolUsed.Color && this.isDialogLoadSaveExport && this.isOnPreviewCtx()) {
            this.resetCheckedButton();
            this.isEraserChecked = true;
            this.pickEraser();
        }
    }

    @HostListener('window:keydown.c', ['$event'])
    changePencilMode(event: KeyboardEvent): void {
        if (this.toolService.currentToolName !== ToolUsed.Color && this.isDialogLoadSaveExport && this.isOnPreviewCtx()) {
            this.resetCheckedButton();
            this.isPencilChecked = true;
            this.pickPencil();
        }
    }

    @HostListener('window:keydown.w', ['$event'])
    changeBrushMode(event: KeyboardEvent): void {
        if (this.toolService.currentToolName !== ToolUsed.Color && this.isDialogLoadSaveExport && this.isOnPreviewCtx()) {
            this.resetCheckedButton();
            this.isBrushChecked = true;
            this.pickBrush(SubToolSelected.tool1);
        }
    }

    @HostListener('window:keydown.l', ['$event'])
    changeLineMode(event: KeyboardEvent): void {
        if (this.toolService.currentToolName !== ToolUsed.Color && this.isDialogLoadSaveExport && this.isOnPreviewCtx()) {
            this.resetCheckedButton();
            this.isLineChecked = true;
            this.pickLine();
        }
    }

    @HostListener('window:keydown.b', ['$event'])
    changePaintBucketMode(event: KeyboardEvent): void {
        if (this.toolService.currentToolName !== ToolUsed.PaintBucket && this.isDialogLoadSaveExport && this.isOnPreviewCtx()) {
            this.resetCheckedButton();
            this.isPaintBucketChecked = true;
            this.pickPaintBucket();
        }
    }

    @HostListener('window:keydown.t', ['$event'])
    changeTextMode(event: KeyboardEvent): void {
        if (this.toolService.currentToolName !== ToolUsed.Text && this.isDialogLoadSaveExport && this.isOnPreviewCtx()) {
            this.resetCheckedButton();
            this.isTextChecked = true;
            this.pickText();
        }
    }

    @HostListener('window:keydown.i', ['$event'])
    changeDropperMode(event: KeyboardEvent): void {
        if (this.isDialogLoadSaveExport && this.isOnPreviewCtx()) {
            this.resetCheckedButton();
            this.isDropperChecked = true;
            this.pickDropper();
        }
    }

    @HostListener('window:keydown.r', ['$event'])
    changeSelectionRectangleMode(event: KeyboardEvent): void {
        if (this.isDialogLoadSaveExport && this.isOnPreviewCtx()) {
            this.resetCheckedButton();
            this.isSelectionRectangleChecked = true;
            this.pickSelectionRectangle();
        }
    }

    @HostListener('window:keydown.s', ['$event']) changeSelectionEllipseMode(event: KeyboardEvent): void {
        if (this.isDialogLoadSaveExport && this.isOnPreviewCtx()) {
            this.resetCheckedButton();
            this.isSelectionEllipseChecked = true;
            this.pickSelectionEllipse();
        }
    }

    @HostListener('window:keydown.control.g', ['$event']) openCarrouselKey(event: KeyboardEvent): void {
        if (this.isOnPreviewCtx()) {
            event.preventDefault();
            this.openCarrousel();
        }
    }
    @HostListener('window:keydown.control.s', ['$event']) openSaveServerKey(event: KeyboardEvent): void {
        if (this.isOnPreviewCtx()) {
            event.preventDefault();
            this.openSaveServer();
        }
    }
    @HostListener('window:keydown.control.e', ['$event']) exportDrawingKey(event: KeyboardEvent): void {
        if (this.isOnPreviewCtx()) {
            event.preventDefault();
            this.exportDrawing();
        }
    }
    @HostListener('window:keydown.control.a', ['$event']) selectAllCanvas(event: KeyboardEvent): void {
        if (this.toolService.currentToolName === ToolUsed.SelectionRectangle && this.isDialogLoadSaveExport) {
            event.preventDefault();
            this.selectionRectangleService.selectAll();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.SelectionEllipse && this.isDialogLoadSaveExport) {
            event.preventDefault();
            this.selectionEllipseService.selectAll();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.MagicWand && this.isDialogLoadSaveExport) {
            event.preventDefault();
            this.buttonSelectAllMagicWand();
            return;
        }
    }

    @HostListener('window:keydown.ArrowLeft', ['$event']) onLeftArrow(event: KeyboardEvent): void {
        if (this.toolService.currentToolName === ToolUsed.SelectionRectangle && this.isDialogLoadSaveExport) {
            // preventDefault has to be inside because it is only preventing default when that tool is selected
            event.preventDefault();
            this.selectionRectangleService.onLeftArrow();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.SelectionEllipse && this.isDialogLoadSaveExport) {
            event.preventDefault();
            this.selectionEllipseService.onLeftArrow();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.MagicWand && this.isDialogLoadSaveExport) {
            event.preventDefault();
            this.magicWandService.onLeftArrow();
            return;
        }
    }
    @HostListener('window:keydown.ArrowRight', ['$event']) onRightArrow(event: KeyboardEvent): void {
        if (this.toolService.currentToolName === ToolUsed.SelectionRectangle && this.isDialogLoadSaveExport) {
            // preventDefault has to be inside because it is only preventing default when that tool is selected
            event.preventDefault();
            this.selectionRectangleService.onRightArrow();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.SelectionEllipse && this.isDialogLoadSaveExport) {
            event.preventDefault();
            this.selectionEllipseService.onRightArrow();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.MagicWand && this.isDialogLoadSaveExport) {
            event.preventDefault();
            this.magicWandService.onRightArrow();
            return;
        }
    }

    @HostListener('window:keydown.ArrowDown', ['$event']) onDownArrow(event: KeyboardEvent): void {
        if (this.toolService.currentToolName === ToolUsed.SelectionRectangle && this.isDialogLoadSaveExport) {
            // preventDefault has to be inside because it is only preventing default when that tool is selected
            event.preventDefault();
            this.selectionRectangleService.onDownArrow();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.SelectionEllipse && this.isDialogLoadSaveExport) {
            event.preventDefault();
            this.selectionEllipseService.onDownArrow();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.MagicWand && this.isDialogLoadSaveExport) {
            event.preventDefault();
            this.magicWandService.onDownArrow();
            return;
        }
    }

    @HostListener('window:keydown.ArrowUp', ['$event']) onUpArrow(event: KeyboardEvent): void {
        if (this.toolService.currentToolName === ToolUsed.SelectionRectangle && this.isDialogLoadSaveExport) {
            // preventDefault has to be inside because it is only preventing default when that tool is selected
            event.preventDefault();
            this.selectionRectangleService.onUpArrow();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.SelectionEllipse && this.isDialogLoadSaveExport) {
            event.preventDefault();
            this.selectionEllipseService.onUpArrow();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.MagicWand && this.isDialogLoadSaveExport) {
            event.preventDefault();
            this.magicWandService.onUpArrow();
            return;
        }
    }
    @HostListener('window:keyup.ArrowLeft', ['$event']) onLeftArrowUp(event: KeyboardEvent): void {
        if (this.toolService.currentToolName === ToolUsed.SelectionRectangle && this.isDialogLoadSaveExport) {
            // preventDefault has to be inside because it is only preventing default when that tool is selected
            event.preventDefault();
            this.selectionRectangleService.onLeftArrowUp();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.SelectionEllipse && this.isDialogLoadSaveExport) {
            event.preventDefault();
            this.selectionEllipseService.onLeftArrowUp();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.MagicWand && this.isDialogLoadSaveExport) {
            event.preventDefault();
            this.magicWandService.onLeftArrowUp();
            return;
        }
    }

    @HostListener('window:keyup.ArrowRight', ['$event']) onRightArrowUp(event: KeyboardEvent): void {
        if (this.toolService.currentToolName === ToolUsed.SelectionRectangle && this.isDialogLoadSaveExport) {
            // preventDefault has to be inside because it is only preventing default when that tool is selected
            event.preventDefault();
            this.selectionRectangleService.onRightArrowUp();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.SelectionEllipse && this.isDialogLoadSaveExport) {
            event.preventDefault();
            this.selectionEllipseService.onRightArrowUp();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.MagicWand && this.isDialogLoadSaveExport) {
            event.preventDefault();
            this.magicWandService.onRightArrowUp();
            return;
        }
    }

    @HostListener('window:keyup.ArrowDown', ['$event']) onDownArrowUp(event: KeyboardEvent): void {
        if (this.toolService.currentToolName === ToolUsed.SelectionRectangle && this.isDialogLoadSaveExport) {
            // preventDefault has to be inside because it is only preventing default when that tool is selected
            event.preventDefault();
            this.selectionRectangleService.onDownArrowUp();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.SelectionEllipse && this.isDialogLoadSaveExport) {
            event.preventDefault();
            this.selectionEllipseService.onDownArrowUp();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.MagicWand && this.isDialogLoadSaveExport) {
            event.preventDefault();
            this.magicWandService.onDownArrowUp();
            return;
        }
    }

    @HostListener('window:keyup.ArrowUp', ['$event']) onUpArrowUp(event: KeyboardEvent): void {
        if (this.toolService.currentToolName === ToolUsed.SelectionRectangle) {
            // preventDefault has to be inside because it is only preventing default when that tool is selected
            event.preventDefault();
            this.selectionRectangleService.onUpArrowUp();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.SelectionEllipse && this.isDialogLoadSaveExport) {
            event.preventDefault();
            this.selectionEllipseService.onUpArrowUp();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.MagicWand && this.isDialogLoadSaveExport) {
            event.preventDefault();
            this.magicWandService.onUpArrowUp();
        }
    }

    @HostListener('window:keydown.control.z', ['$event'])
    callUndo(eventK: KeyboardEvent): void {
        if (!this.undoRedoService.isUndoDisabled && this.isDialogLoadSaveExport && this.isOnPreviewCtx()) {
            this.undoRedoService.undo();
            this.automaticSaveService.save();
        }
    }

    @HostListener('window:keydown.control.shift.z', ['$event'])
    callRedo(eventK: KeyboardEvent): void {
        if (!this.undoRedoService.isRedoDisabled && this.isDialogLoadSaveExport && this.isOnPreviewCtx()) {
            this.undoRedoService.redo();
            this.automaticSaveService.save();
        }
    }

    @HostListener('window:keydown.control.c', ['$event']) copySelection(event: KeyboardEvent): void {
        if (this.toolService.currentToolName === ToolUsed.SelectionRectangle) {
            // preventDefault has to be inside because it is only preventing default when that tool is selected
            event.preventDefault();
            this.selectionRectangleService.copyImage();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.SelectionEllipse) {
            event.preventDefault();
            this.selectionEllipseService.copyImage();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.MagicWand) {
            event.preventDefault();
            this.magicWandService.copyImage();
            return;
        }
    }

    @HostListener('window:keydown.control.x', ['$event']) cutSelection(event: KeyboardEvent): void {
        if (this.toolService.currentToolName === ToolUsed.SelectionRectangle) {
            // preventDefault has to be inside because it is only preventing default when that tool is selected
            event.preventDefault();
            this.selectionRectangleService.cutImage();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.SelectionEllipse) {
            event.preventDefault();
            this.selectionEllipseService.cutImage();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.MagicWand) {
            event.preventDefault();
            this.magicWandService.cutImage();
            return;
        }
    }

    @HostListener('window:keydown.control.v', ['$event']) pasteSelection(event: KeyboardEvent): void {
        if (this.toolService.currentToolName === ToolUsed.SelectionRectangle) {
            // preventDefault has to be inside because it is only preventing default when that tool is selected
            event.preventDefault();
            this.selectionRectangleService.pasteImage();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.SelectionEllipse) {
            event.preventDefault();
            this.selectionEllipseService.pasteImage();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.MagicWand) {
            event.preventDefault();
            this.magicWandService.pasteImage();
            return;
        }
    }

    @HostListener('window:keydown.Delete', ['$event']) delSelection(event: KeyboardEvent): void {
        if (this.toolService.currentToolName === ToolUsed.SelectionRectangle) {
            // preventDefault has to be inside because it is only preventing default when that tool is selected
            event.preventDefault();
            this.selectionRectangleService.deleteImage();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.SelectionEllipse) {
            event.preventDefault();
            this.selectionEllipseService.deleteImage();
            return;
        }
        if (this.toolService.currentToolName === ToolUsed.MagicWand) {
            event.preventDefault();
            this.magicWandService.deleteImage();
            return;
        }
    }

    @HostListener('window:keydown.v', ['$event'])
    changeMagicWandMode(event: KeyboardEvent): void {
        if (this.toolService.currentToolName !== ToolUsed.Color && this.isDialogLoadSaveExport) {
            this.resetCheckedButton();
            this.isMagicWandSelectionChecked = true;
            this.pickMagicWandSelection();
        }
    }

    @HostListener('window:keydown.g', ['$event']) activateGrid(event: KeyboardEvent): void {
        if (this.isDialogLoadSaveExport && this.isOnPreviewCtx())
            if (this.gridService.isGridSettingsChecked) {
                this.gridService.isGridSettingsChecked = false;
                this.gridService.deactivateGrid();
            } else {
                this.gridService.isGridSettingsChecked = true;
                this.gridService.activateGrid();
            }
    }

    @HostListener('window:keydown.-', ['$event']) decreaseSquareGrid(event: KeyboardEvent): void {
        if (this.toolService.currentToolName === ToolUsed.Grid && this.gridService.squareWidth - SQUARE_STEP_SIZE >= MIN_SQUARE_WIDTH) {
            this.gridService.squareWidth -= SQUARE_STEP_SIZE;
        }
    }

    @HostListener('window:keydown.+', ['$event'])
    @HostListener('window:keydown.shift.+', ['$event'])
    increaseSquareGrid(event: KeyboardEvent): void {
        if (this.toolService.currentToolName === ToolUsed.Grid && this.gridService.squareWidth + SQUARE_STEP_SIZE <= MAX_SQUARE_WIDTH) {
            this.gridService.squareWidth += SQUARE_STEP_SIZE;
        }
    }

    @HostListener('window:keydown.m', ['$event']) activateMagnetism(event: KeyboardEvent): void {
        if (this.magnetismService.isMagnetismActive) {
            this.magnetismService.isMagnetismActive = false;
            this.magnetismService.resetMagnetism();
        } else {
            this.magnetismService.isMagnetismActive = true;
        }
    }
    @HostListener('window:keydown.a', ['$event'])
    changeSprayMode(event: KeyboardEvent): void {
        if (this.toolService.currentToolName !== ToolUsed.Color && this.isDialogLoadSaveExport && this.isOnPreviewCtx()) {
            event.preventDefault();
            this.resetCheckedButton();
            this.isSprayChecked = true;
            this.pickSprayer();
        }
    }

    @HostListener('window:keydown.p', ['$event'])
    changeFeatherMode(event: KeyboardEvent): void {
        if (this.toolService.currentToolName !== ToolUsed.Color && this.isDialogLoadSaveExport && this.isOnPreviewCtx()) {
            this.resetCheckedButton();
            this.isFeatherChecked = true;
            this.pickFeather();
        }
    }

    @HostListener('window:wheel', ['$event'])
    changeAngleWithWheel(event: WheelEvent): void {
        event.stopPropagation();
        if (this.toolService.currentToolName === ToolUsed.Feather && this.isDialogLoadSaveExport && this.isOnPreviewCtx()) {
            this.featherService.addOrRetract(event);
            this.featherService.changeAngleWithScroll();
        }
        if (this.toolService.currentToolName === ToolUsed.SelectionEllipse) {
            this.rotationService.onWheelScroll(this.selectionEllipseService, event);
        }
        if (this.toolService.currentToolName === ToolUsed.SelectionRectangle) {
            this.rotationService.onWheelScroll(this.selectionRectangleService, event);
        }
        if (this.toolService.currentToolName === ToolUsed.MagicWand) {
            this.rotationService.onWheelScroll(this.magicWandService, event);
        }
        if (this.toolService.currentToolName === ToolUsed.Stamp) {
            this.stampService.addOrRetract(event);
            this.stampService.changeAngleWithScroll();
        }
        event.stopPropagation();
    }

    @HostListener('window:keydown.alt', ['$event'])
    altPressed(event: KeyboardEvent): void {
        if (this.toolService.currentToolName === ToolUsed.Feather && this.isDialogLoadSaveExport && this.isOnPreviewCtx()) {
            this.featherService.altPressed = true;
        }
        if (this.toolService.currentToolName === ToolUsed.Stamp) {
            this.stampService.isAltPressed = true;
        }
        if (
            this.toolService.currentToolName === ToolUsed.SelectionEllipse ||
            this.toolService.currentToolName === ToolUsed.SelectionRectangle ||
            this.toolService.currentToolName === ToolUsed.MagicWand
        ) {
            this.rotationService.altPressed = true;
        }
    }

    @HostListener('window:keyup.alt', ['$event'])
    altReleased(event: KeyboardEvent): void {
        if (this.toolService.currentToolName === ToolUsed.Feather) {
            this.featherService.altPressed = false;
        }
        if (this.toolService.currentToolName === ToolUsed.Stamp) {
            this.stampService.isAltPressed = false;
        }
        if (
            this.toolService.currentToolName === ToolUsed.SelectionEllipse ||
            this.toolService.currentToolName === ToolUsed.SelectionRectangle ||
            this.toolService.currentToolName === ToolUsed.MagicWand
        ) {
            this.rotationService.altPressed = false;
        }
    }

    @HostListener('window:keydown.d', ['$event'])
    changeStampMode(event: KeyboardEvent): void {
        if (this.toolService.currentToolName !== ToolUsed.Color && this.isDialogLoadSaveExport && this.isOnPreviewCtx()) {
            this.resetCheckedButton();
            this.isStampChecked = true;
            this.pickStamp();
        }
    }
}
