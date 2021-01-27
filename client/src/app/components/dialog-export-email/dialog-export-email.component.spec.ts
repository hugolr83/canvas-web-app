/* tslint:disable:no-unused-variable */
/* tslint:disable:no-string-literal */
/* tslint:disable:no-magic-numbers */

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Filter } from '@app/classes/filter';
import { ImageFormat } from '@app/classes/image-format';
import { ClientServerCommunicationService } from '@app/services/client-server/client-server-communication.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Label } from '@common/communication/canvas-information';
import { Observable } from 'rxjs';
import { DialogExportEmailComponent } from './dialog-export-email.component';

describe('DialogExportEmailComponent', () => {
    let component: DialogExportEmailComponent;
    let fixture: ComponentFixture<DialogExportEmailComponent>;

    let drawingStub: DrawingService;

    beforeEach(
        waitForAsync(() => {
            drawingStub = new DrawingService();
            const canvas = document.createElement('canvas');
            drawingStub.canvas = canvas;
            drawingStub.canvas.width = 100;
            drawingStub.canvas.height = 100;

            drawingStub.baseCtx = canvas.getContext('2d') as CanvasRenderingContext2D;

            const previewCanvas = document.createElement('canvas');
            drawingStub.previewCtx = previewCanvas.getContext('2d') as CanvasRenderingContext2D;

            const labels: Label[] = [{ label: 'label1' }, { label: 'label2' }];

            drawingStub.convertBaseCanvasToBase64 = () => {
                return 'image_test';
            };

            TestBed.configureTestingModule({
                imports: [
                    MatDialogModule,
                    MatButtonModule,
                    MatButtonToggleModule,
                    MatGridListModule,
                    MatInputModule,
                    FormsModule,
                    BrowserAnimationsModule,
                    HttpClientTestingModule,
                    ReactiveFormsModule,
                ],
                declarations: [DialogExportEmailComponent],
                providers: [
                    {
                        provide: ClientServerCommunicationService,
                        useValue: {
                            getAllLabels: () => labels,
                            savePicture: () => Message,
                        },
                    },
                    {
                        provide: DrawingService,
                        useValue: drawingStub,
                    },
                ],
            }).compileComponents();

            TestBed.inject(HttpClient);
            const clientServerCommStub = TestBed.inject(ClientServerCommunicationService);
            clientServerCommStub.sendEmail = () => {
                return new Observable();
            };

            fixture = TestBed.createComponent(DialogExportEmailComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const testImageCanvas = document.createElement('canvas');
            const testImageCtx = testImageCanvas.getContext('2d') as CanvasRenderingContext2D;
            testImageCanvas.width = 100;
            testImageCanvas.height = 100;
            testImageCtx.fillStyle = 'black';
            testImageCtx.fillRect(0, 0, 100, 100);
            component.previewImage.nativeElement = new Image();
            component.previewImage.nativeElement.src = testImageCanvas.toDataURL();
        }),
    );

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should check as in onClickButton to a png', () => {
        component.checkPNG();
        expect(component['whichExportType']).toEqual(ImageFormat.PNG);
    });

    it('should check as in onClickButton to a jpg', () => {
        component.checkJPG();
        expect(component['whichExportType']).toEqual(ImageFormat.JPG);
    });

    it('should check as in onClickButton to a no filter', () => {
        component.checkNone();
        expect(component['whichFilter']).toEqual(Filter.NONE);
    });

    it('should check as in onClickButton to a blur filter', () => {
        component.checkFirst();
        expect(component['whichFilter']).toEqual(Filter.BLUR);
    });

    it('should check as in onClickButton to a grayscale filter', () => {
        component.checkSecond();
        expect(component['whichFilter']).toEqual(Filter.GRAY_SCALE);
    });

    it('should check as in onClickButton to a invert filter', () => {
        component.checkThird();
        expect(component['whichFilter']).toEqual(Filter.INVERT);
    });

    it('should check as in onClickButton to a brightness filter', () => {
        component.checkFourth();
        expect(component['whichFilter']).toEqual(Filter.BRIGHTNESS);
    });

    it('should check as in onClickButton to a sepia filter', () => {
        component.checkFifth();
        expect(component['whichFilter']).toEqual(Filter.SEPIA);
    });

    it('should export to an email with a PNG no filter', () => {
        component['whichExportType'] = ImageFormat.PNG;
        component.nameFormControl.setValue('god');
        component.emailFormControl.setValue('heaven@satan.com');
        const spy = spyOn(component, 'exportToEmail').and.callThrough();
        const spyConfirm = spyOn(window, 'confirm');
        component.exportToEmail();
        expect(spy).toHaveBeenCalled();
        expect(spyConfirm).toHaveBeenCalledWith("Voulez-vous envoyer l'image god.png\n Aucun filtre au courriel heaven@satan.com ?");
    });

    it('should export to an email with a JPG no filter', () => {
        component['whichExportType'] = ImageFormat.JPG;
        component.nameFormControl.setValue('god');
        component.emailFormControl.setValue('heaven@satan.com');
        const spy = spyOn(component, 'exportToEmail').and.callThrough();
        const spyConfirm = spyOn(window, 'confirm');
        component.exportToEmail();
        expect(spy).toHaveBeenCalled();
        expect(spyConfirm).toHaveBeenCalledWith("Voulez-vous envoyer l'image god.jpeg\n Aucun filtre au courriel heaven@satan.com ?");
    });

    it('should export to an email with a JPG blur filter', () => {
        component['whichExportType'] = ImageFormat.JPG;
        component['whichFilter'] = Filter.BLUR;
        component.nameFormControl.setValue('god');
        component.emailFormControl.setValue('heaven@satan.com');
        const spy = spyOn(component, 'exportToEmail').and.callThrough();
        const spyConfirm = spyOn(window, 'confirm');
        component.exportToEmail();
        expect(spy).toHaveBeenCalled();
        expect(spyConfirm).toHaveBeenCalledWith("Voulez-vous envoyer l'image god.jpeg\n Filtre blur au courriel heaven@satan.com ?");
    });

    it('should export to an email with a JPG brightness filter', () => {
        component['whichExportType'] = ImageFormat.JPG;
        component['whichFilter'] = Filter.BRIGHTNESS;
        component.nameFormControl.setValue('god');
        component.emailFormControl.setValue('heaven@satan.com');
        const spy = spyOn(component, 'exportToEmail').and.callThrough();
        const spyConfirm = spyOn(window, 'confirm');
        component.exportToEmail();
        expect(spy).toHaveBeenCalled();
        expect(spyConfirm).toHaveBeenCalledWith("Voulez-vous envoyer l'image god.jpeg\n Filtre brightness au courriel heaven@satan.com ?");
    });

    it('should export to an email with a JPG grayscale filter', () => {
        component['whichExportType'] = ImageFormat.JPG;
        component['whichFilter'] = Filter.GRAY_SCALE;
        component.nameFormControl.setValue('god');
        component.emailFormControl.setValue('heaven@satan.com');
        const spy = spyOn(component, 'exportToEmail').and.callThrough();
        const spyConfirm = spyOn(window, 'confirm');
        component.exportToEmail();
        expect(spy).toHaveBeenCalled();
        expect(spyConfirm).toHaveBeenCalledWith("Voulez-vous envoyer l'image god.jpeg\n Filtre grayscale au courriel heaven@satan.com ?");
    });

    it('should export to an email with a JPG invert filter', () => {
        component['whichExportType'] = ImageFormat.JPG;
        component['whichFilter'] = Filter.INVERT;
        component.nameFormControl.setValue('god');
        component.emailFormControl.setValue('heaven@satan.com');
        const spy = spyOn(component, 'exportToEmail').and.callThrough();
        const spyConfirm = spyOn(window, 'confirm');
        component.exportToEmail();
        expect(spy).toHaveBeenCalled();
        expect(spyConfirm).toHaveBeenCalledWith("Voulez-vous envoyer l'image god.jpeg\n Filtre invert au courriel heaven@satan.com ?");
    });

    it('should export to an email with a JPG sepia filter', () => {
        component['whichExportType'] = ImageFormat.JPG;
        component['whichFilter'] = Filter.SEPIA;
        component.nameFormControl.setValue('god');
        component.emailFormControl.setValue('heaven@satan.com');
        const spy = spyOn(component, 'exportToEmail').and.callThrough();
        const spyConfirm = spyOn(window, 'confirm');
        component.exportToEmail();
        expect(spy).toHaveBeenCalled();
        expect(spyConfirm).toHaveBeenCalledWith("Voulez-vous envoyer l'image god.jpeg\n Filtre sepia au courriel heaven@satan.com ?");
    });

    it('should export to an email with a JPG sepia filter to the server', async () => {
        component['whichExportType'] = ImageFormat.JPG;
        component['whichFilter'] = Filter.SEPIA;
        component.nameFormControl.setValue('god');
        component.emailFormControl.setValue('heaven@satan.com');
        const spy = spyOn(component, 'exportToEmail').and.callThrough();
        const spyConfirm = spyOn(window, 'confirm').and.callFake(() => {
            return true;
        });
        component.exportToEmail();
        expect(spy).toHaveBeenCalled();
        expect(spyConfirm).toHaveBeenCalledWith("Voulez-vous envoyer l'image god.jpeg\n Filtre sepia au courriel heaven@satan.com ?");
    });

    it('should export to an email with a PNG sepia filter to the server', async () => {
        component['whichExportType'] = ImageFormat.PNG;
        component['whichFilter'] = Filter.SEPIA;
        component.nameFormControl.setValue('god');
        component.emailFormControl.setValue('heaven@satan.com');
        const spy = spyOn(component, 'exportToEmail').and.callThrough();
        const spyConfirm = spyOn(window, 'confirm').and.callFake(() => {
            return true;
        });
        component.exportToEmail();
        expect(spy).toHaveBeenCalled();
        expect(spyConfirm).toHaveBeenCalledWith("Voulez-vous envoyer l'image god.png\n Filtre sepia au courriel heaven@satan.com ?");
    });
});
