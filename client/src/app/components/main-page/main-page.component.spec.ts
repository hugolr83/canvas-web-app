// tslint:disable: no-any
import { HttpClientModule } from '@angular/common/http';
import { NgZone } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DialogCreateNewDrawingComponent } from '@app/components/dialog-create-new-drawing/dialog-create-new-drawing.component';
import { MainPageComponent } from '@app/components/main-page/main-page.component';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { CanvasResizeService } from '@app/services/canvas/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/tools/grid.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Subject } from 'rxjs';

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let dialogMock: jasmine.SpyObj<MatDialog>;
    let automaticSaveStub: AutomaticSaveService;
    let canvasReziseStub: CanvasResizeService;
    let drawingStub: DrawingService;
    let undoRedoStub: UndoRedoService;
    let gridStub: GridService;

    beforeEach(
        waitForAsync(() => {
            dialogMock = jasmine.createSpyObj('dialogCreator', ['open']);
            drawingStub = new DrawingService();
            gridStub = new GridService(drawingStub);
            canvasReziseStub = new CanvasResizeService(gridStub, undoRedoStub);
            undoRedoStub = new UndoRedoService(drawingStub);
            automaticSaveStub = new AutomaticSaveService(canvasReziseStub, drawingStub, undoRedoStub);
            automaticSaveStub.save = () => '';
            automaticSaveStub.check = () => false;

            TestBed.configureTestingModule({
                imports: [
                    RouterTestingModule,
                    HttpClientModule,
                    MatIconModule,
                    MatListModule,
                    MatButtonModule,
                    BrowserAnimationsModule,
                    HttpClientModule,
                ],
                declarations: [MainPageComponent, DialogCreateNewDrawingComponent],
                providers: [
                    { provide: MatDialog, useValue: dialogMock },
                    { provide: MatDialogRef, useValue: {} },
                    { provide: AutomaticSaveService, useValue: automaticSaveStub },
                ],
            }).compileComponents();
            TestBed.inject(MatDialog);
            const router = TestBed.inject(Router);

            fixture = TestBed.createComponent(MainPageComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            (fixture.ngZone as NgZone).run(() => {
                router.initialNavigation();
            });
        }),
    );

    afterEach(() => {
        if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
            (fixture.nativeElement as HTMLElement).remove();
        }
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open warning message when creating a new drawing', () => {
        const matDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

        component.dialogCreator = jasmine.createSpyObj('MatDialog', ['open']);
        component.dialogCreator.open = jasmine.createSpy().and.callFake(() => {
            return matDialogRef;
        });

        component.createNewDrawing();
        expect(component.newDrawingRef).toEqual(matDialogRef);
    });

    it('should set isDialogOpenSaveExport to true after closed', () => {
        component.isDialogOpenSaveExport = false;
        const closedSubject = new Subject<any>();

        const dialogRefMock = jasmine.createSpyObj('dialogRef', ['afterClosed']) as jasmine.SpyObj<MatDialogRef<any>>;
        dialogRefMock.afterClosed.and.returnValue(closedSubject.asObservable());
        dialogMock.open.and.returnValue(dialogRefMock);

        component.openCarrousel();
        expect(component.isDialogOpenSaveExport).toEqual(true);

        closedSubject.next();

        expect(component.isDialogOpenSaveExport).toEqual(false);
    });

    it('should set isDialogOpenSaveEport to true after closed', () => {
        component.isDialogOpenSaveExport = true;
        component.openCarrousel();
        expect(component.isDialogOpenSaveExport).toEqual(true);
    });

    it('should open warning message when opening "guide dutilisation"', () => {
        const matDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

        component.dialogCreator = jasmine.createSpyObj('MatDialog', ['open']);
        component.dialogCreator.open = jasmine.createSpy().and.callFake(() => {
            return matDialogRef;
        });

        component.openUserGuide();
        expect(component.checkDocumentationRef).toEqual(matDialogRef);
    });

    it('should call getUpload ', () => {
        const getUploadSpy = spyOn(automaticSaveStub, 'getUpload').and.callThrough();
        // tslint:disable-next-line: no-string-literal
        spyOn<any>(component['router'], 'navigate').and.returnValue(true);
        component.continueDrawing();
        expect(getUploadSpy).toHaveBeenCalled();
    });
});
