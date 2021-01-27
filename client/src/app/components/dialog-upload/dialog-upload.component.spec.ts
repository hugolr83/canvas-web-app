import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Vec2 } from '@app/classes/vec2';
import { CanvasResizeService } from '@app/services/canvas/canvas-resizer.service';
import { ClientServerCommunicationService } from '@app/services/client-server/client-server-communication.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CanvasInformation, Label } from '@common/communication/canvas-information';
import { of } from 'rxjs';
import { DialogUploadComponent } from './dialog-upload.component';

// tslint:disable:no-any
// tslint:disable:no-string-literal
// tslint:disable:no-unused-expression
// tslint:disable:no-empty

describe('DialogUpload', () => {
    let component: DialogUploadComponent;
    let fixture: ComponentFixture<DialogUploadComponent>;
    let httpMock: HttpTestingController;
    const isDate: Date = new Date();
    let processedMessageSpy: jasmine.Spy<any>;
    const testCanvasInformationAdd: CanvasInformation = {
        _id: '',
        name: 'test5',
        width: 0,
        height: 0,
        labels: [{ label: 'label1' }],
        date: isDate,
        picture: 'test5',
    };
    const vec = { x: 50, y: 45 } as Vec2;
    const labels: Label[] = [{ label: 'label1' }, { label: 'label2' }];
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                MatDialogModule,
                MatIconModule,
                MatGridListModule,
                MatIconModule,
                MatSelectModule,
                MatSliderModule,
                MatFormFieldModule,
                MatInputModule,
                FormsModule,
                BrowserAnimationsModule,
                MatButtonToggleModule,
            ],
            declarations: [DialogUploadComponent],
            providers: [
                HttpClient,
                {
                    provide: ClientServerCommunicationService,
                    useValue: {
                        getAllLabels: () => labels,
                        resetData: () => '',
                        getInformation: () => testCanvasInformationAdd,
                        getElementResearch: () => testCanvasInformationAdd,
                        savePicture: () => Message,
                    },
                },
                {
                    provide: CanvasResizeService,
                    useValue: { canvasSize: () => vec },
                },
                {
                    provide: DrawingService,
                    useValue: { convertBaseCanvasToBase64: () => 'image_test' },
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DialogUploadComponent);
        component = fixture.componentInstance;
        spyOn(component['clientServerComService'], 'savePicture').and.returnValue(of());
        httpMock = TestBed.inject(HttpTestingController);
        fixture.detectChanges();
        processedMessageSpy = spyOn<any>(component, 'processedMessage').and.callThrough();
    });
    afterEach(() => {
        if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
            (fixture.nativeElement as HTMLElement).remove();
        }
        httpMock.verify();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('test notGoodCharacter', () => {
        expect(component.notGoodCharacter('')).toEqual(false, 'casse vide');
        expect(component.notGoodCharacter('  ')).toEqual(false);
        expect(component.notGoodCharacter(' a_a a_ ')).toEqual(false);
        expect(component.notGoodCharacter(' a a')).toEqual(false);
        expect(component.notGoodCharacter('a ! a')).toEqual(true);
        expect(component.notGoodCharacter('a | a')).toEqual(true);
        expect(component.notGoodCharacter('a # a')).toEqual(true);
        expect(component.notGoodCharacter('a " a')).toEqual(true);
        expect(component.notGoodCharacter("a ' a")).toEqual(true);
        expect(component.notGoodCharacter('a ? a')).toEqual(true);
        expect(component.notGoodCharacter('a & a')).toEqual(true);
        expect(component.notGoodCharacter('a * a')).toEqual(true);
        expect(component.notGoodCharacter('a / a')).toEqual(true);
        expect(component.notGoodCharacter('a $ a')).toEqual(true);
        expect(component.notGoodCharacter('a % a')).toEqual(true);
        expect(component.notGoodCharacter('a - a')).toEqual(true);
    });
    it('test checkName', () => {
        expect(component.checkName('')).toEqual(true);
        expect(component.checkName(' a ')).toEqual(true);
        expect(component.checkName('a')).toEqual(false);
        expect(component.checkName('a_a_a_a')).toEqual(false);
    });
    it('test checkLabel', () => {
        expect(component.checkLabel('#aaaa')).toEqual(false);
        expect(component.checkLabel('')).toEqual(false);
        expect(component.checkLabel(' a ')).toEqual(true);
        expect(component.checkLabel('a')).toEqual(false);
        expect(component.checkLabel('aaaaaaa&')).toEqual(true);
        expect(component.checkLabel('a_a_a_a')).toEqual(false);
    });
    it('test isLabelExisting', () => {
        component.ngOnInit();
        component.isLabelExisting(labels[0].label);
        expect(component['labelSelect'][0]).toEqual(labels[0].label);
    });
    it('test isLabelExisting with the parameter not in liste dataLabel', () => {
        component.ngOnInit();
        component.isLabelExisting('label3');
        expect(component['labelSelect'].length).toEqual(1);
    });
    it('test the isLabelExisting 3 times with the parameter label1', () => {
        component.isLabelExisting(labels[1].label);
        component.isLabelExisting(labels[1].label);
        component.isLabelExisting(labels[1].label);
        expect(component['labelSelect'][0]).toEqual(labels[1].label);
    });
    it('test the isLabelExisting times with the parameter label1', () => {
        component.isLabelExisting(labels[0].label);
        component.isLabelExisting(labels[1].label);
        component.isLabelExisting(labels[0].label);
        expect(component['labelSelect'][0]).toEqual(labels[1].label);
    });
    it('test not name and not label function saveServer', () => {
        component.saveServer();
        expect(processedMessageSpy).not.toHaveBeenCalled();
    });
    it('test name not and label function saveServer', () => {
        component.textName = 'aaaaaa';
        component.saveServer();
        expect(processedMessageSpy).not.toHaveBeenCalled();
    });
    it('refresh is testing', async () => {
        expect(component.dataLabel[0].label).toEqual(labels[0].label);
        const labelTest: Label = { label: 'modif' };
        spyOn(component['clientServerComService'], 'getAllLabels').and.returnValue([labelTest]);
        component.refresh();
        expect(component.dataLabel[0].label).toEqual(labelTest.label);
    });

    it('test name and label function saveServer', () => {
        component.textName = 'aaaaaa';
        component.isLabelExisting(labels[0].label);
        component.textLabel = 'aaaaaaaaa';
        component.saveServer();
        expect(processedMessageSpy).not.toHaveBeenCalled();
    });
    it('', () => {
        component.saveLoad = true;
        component.processedMessage({ title: 'succès', body: 'réussi' });
        expect(component.saveLoad).toEqual(false);
    });
});
