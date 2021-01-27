// tslint:disable:no-unused-variable
// tslint:disable:no-string-literal
// tslint:disable:no-any

import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Filter } from '@app/classes/filter';
import { ImageFormat } from '@app/classes/image-format';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DialogExportDrawingComponent } from './dialog-export-locally.component';

describe('DialogExportDrawingComponent', () => {
    let component: DialogExportDrawingComponent;
    let fixture: ComponentFixture<DialogExportDrawingComponent>;
    let confirmSpy: jasmine.Spy<any>;
    let drawingStub: DrawingService;

    beforeEach(
        waitForAsync(() => {
            drawingStub = new DrawingService();
            drawingStub.canvas = document.createElement('canvas');

            TestBed.configureTestingModule({
                imports: [
                    MatDialogModule,
                    MatIconModule,
                    MatButtonModule,
                    MatButtonToggleModule,
                    MatInputModule,
                    ReactiveFormsModule,
                    MatGridListModule,
                    BrowserAnimationsModule,
                    HttpClientModule,
                ],
                providers: [{ provide: DrawingService, useValue: drawingStub }],
                declarations: [DialogExportDrawingComponent],
            }).compileComponents();

            fixture = TestBed.createComponent(DialogExportDrawingComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            confirmSpy = spyOn<any>(window, 'confirm').and.callThrough();
        }),
    );

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(' should checkPNG', () => {
        component.checkPNG();
        expect(component['whichExportType']).toBe(ImageFormat.PNG);
    });

    it(' should checkJPG', () => {
        component.checkJPG();
        expect(component['whichExportType']).toBe(ImageFormat.JPG);
    });
    it(' should checkNone', () => {
        component.checkNone();
        expect(component['whichFilter']).toBe(Filter.NONE);
    });
    it(' should checkFirst', () => {
        component.checkFirst();
        expect(component['whichFilter']).toBe(Filter.BLUR);
    });

    it(' should checkSecond', () => {
        component.checkSecond();
        expect(component['whichFilter']).toBe(Filter.GRAY_SCALE);
    });

    it(' should checkThird', () => {
        component.checkThird();
        expect(component['whichFilter']).toBe(Filter.INVERT);
    });

    it(' should checkFourth', () => {
        component.checkFourth();
        expect(component['whichFilter']).toBe(Filter.BRIGHTNESS);
    });

    it(' should checkFifth', () => {
        component.checkFifth();
        expect(component['whichFilter']).toBe(Filter.SEPIA);
    });

    it(' should downloadImage', () => {
        confirmSpy.and.returnValue(true);
        component.nameFormControl.setValue('default');
        const spyDownloadImage = spyOn<any>(component, 'downloadImage').and.callThrough();
        component.downloadImage();
        expect(spyDownloadImage).toHaveBeenCalled();
    });
    it(' should downloadImage cancel', () => {
        confirmSpy.and.returnValue(false);
        component.nameFormControl.setValue('default');
        component.checkFirst();
        component.checkJPG();
        const spyDownloadImage = spyOn<any>(component, 'downloadImage').and.callThrough();
        component.downloadImage();
        expect(spyDownloadImage).toHaveBeenCalled();
    });
    it(' should downloadImage cancel', () => {
        confirmSpy.and.returnValue(true);
        component.nameFormControl.setValue('default');
        component.checkSecond();
        const spyDownloadImage = spyOn<any>(component, 'downloadImage').and.callThrough();
        component.downloadImage();
        expect(spyDownloadImage).toHaveBeenCalled();
        expect(confirmSpy).toHaveBeenCalledWith('Voulez-vous sauvegarder ' + component.nameFormControl.value + '.png\n Filtre grayscale');
    });
    it(' should downloadImage cancel', () => {
        confirmSpy.and.returnValue(true);
        component.nameFormControl.setValue('test');
        component.checkThird();
        const spyDownloadImage = spyOn<any>(component, 'downloadImage').and.callThrough();
        component.downloadImage();
        expect(spyDownloadImage).toHaveBeenCalled();
        expect(confirmSpy).toHaveBeenCalledWith('Voulez-vous sauvegarder test.png\n Filtre invert');
    });
    it(' should downloadImage cancel', () => {
        confirmSpy.and.returnValue(true);
        component.nameFormControl.setValue('default');
        component.checkFourth();
        const spyDownloadImage = spyOn<any>(component, 'downloadImage').and.callThrough();
        component.downloadImage();
        expect(spyDownloadImage).toHaveBeenCalled();
        expect(confirmSpy).toHaveBeenCalledWith('Voulez-vous sauvegarder default.png\n Filtre brightness');
    });
    it(' should downloadImage cancel', () => {
        confirmSpy.and.returnValue(true);
        component.nameFormControl.setValue('default');
        component.checkFifth();
        const spyDownloadImage = spyOn<any>(component, 'downloadImage').and.callThrough();
        component.downloadImage();
        expect(spyDownloadImage).toHaveBeenCalled();
        expect(confirmSpy).toHaveBeenCalledWith('Voulez-vous sauvegarder default.png\n Filtre sepia');
    });
});
