import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CanvasInformation, Label } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
import { ClientServerCommunicationService } from './client-server-communication.service';

// tslint:disable: no-string-literal

describe('ClientServerCommunicationService', () => {
    let service: ClientServerCommunicationService;
    let httpMock: HttpTestingController;
    let baseUrl: string;
    const expectedCanvasInformation: CanvasInformation[] = [
        { _id: '', name: 'test5', labels: [{ label: 'label1' }], width: 0, height: 0, date: new Date('2020-10-08'), picture: 'test5' },
    ];
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(ClientServerCommunicationService);
        httpMock = TestBed.inject(HttpTestingController);
        baseUrl = service['HTTP_SERVE_LOCAL'];
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return expected CanvasInformation (HttpClient called once)', () => {
        // check the content of the mocked call
        service.getData().subscribe((response: CanvasInformation[]) => {
            expect(response[0]._id).toEqual(expectedCanvasInformation[0]._id, 'id check');
            expect(response[0].name).toEqual(expectedCanvasInformation[0].name, 'name check');
        }, fail);

        const req = httpMock.expectOne(baseUrl);
        expect(req.request.method).toBe('GET');
        // actually send the request
        req.flush(expectedCanvasInformation);
    });

    it('selectPictureWithLabel should message return expected CanvasInformations (HttpClient called once)', () => {
        const expectedMessage: Message = { body: 'label1', title: 'Labels' };
        // check the content of the mocked call
        service.selectPictureWithLabel(expectedMessage).subscribe((response: CanvasInformation[]) => {
            expect(response[0]._id).toEqual(expectedCanvasInformation[0]._id, 'id check');
            expect(response[0].name).toEqual(expectedCanvasInformation[0].name, 'name check');
        }, fail);

        const req = httpMock.expectOne(baseUrl + '/labels');
        expect(req.request.method).toBe('POST');
        // actually send the request
        req.flush(expectedCanvasInformation);
    });

    it('should handle http error safely', () => {
        service.getData().subscribe((response: CanvasInformation[]) => {
            expect(response).toBeUndefined();
        }, fail);

        const req = httpMock.expectOne(baseUrl);
        expect(req.request.method).toBe('GET');
        req.error(new ErrorEvent('Random error occurred'));
    });

    it('should return expected CanvasInformation (HttpClient called once)', () => {
        // tslint:disable:next-line: no-shadowed-variable
        const expectedCanvasInformation: CanvasInformation = {
            _id: '',
            name: 'test5',
            labels: [{ label: 'label1' }],
            width: 0,
            height: 0,
            date: new Date('2020-10-08'),
            picture: 'test5',
        };
        // check the content of the mocked call
        service.allLabels().subscribe((response: CanvasInformation) => {
            expect(response._id).toEqual(expectedCanvasInformation._id, 'id check');
            expect(response.name).toEqual(expectedCanvasInformation.name, 'name check');
        }, fail);

        const req = httpMock.expectOne(baseUrl + '/all_labels');
        expect(req.request.method).toBe('GET');
        // actually send the request
        req.flush(expectedCanvasInformation);
    });
    it('should message return expected CanvasInformations (HttpClient called once)', () => {
        const expectedMessage: Message = { body: 'name', title: 'test' };
        // check the content of the mocked call
        service.getElementResearch(expectedMessage).subscribe((response: CanvasInformation[]) => {
            expect(response[0]._id).toEqual(expectedCanvasInformation[0]._id, 'id check');
            expect(response[0].name).toEqual(expectedCanvasInformation[0].name, 'name check');
        }, fail);

        const req = httpMock.expectOne(baseUrl + '/research');
        expect(req.request.method).toBe('POST');
        // actually send the request
        req.flush(expectedCanvasInformation);
    });
    it('getAllLabels return 0 label', () => {
        const labels: Label[] = service.getAllLabels();
        expect(labels.length).toEqual(0);
        const req = httpMock.expectOne(baseUrl + '/all_labels');
        expect(req.request.method).toBe('GET');
        // actually send the request
    });
    it('getAllLabels return 0 label is not good id', () => {
        service['information'] = expectedCanvasInformation[0];
        const labels: Label[] = service.getAllLabels();
        expect(labels.length).toEqual(0);
        const req = httpMock.expectOne(baseUrl + '/all_labels');
        expect(req.request.method).toBe('GET');
        // actually send the request
    });
    it('getAllLabels return 2 label is good id', () => {
        service['information'] = {
            _id: 'list_of_all_labels',
            name: '',
            labels: [{ label: '' }, { label: '' }],
            width: 0,
            height: 0,
            date: new Date(),
            picture: '',
        };
        const labels: Label[] = service.getAllLabels();
        expect(labels.length).toEqual(2);
        const req = httpMock.expectOne(baseUrl + '/all_labels');
        expect(req.request.method).toBe('GET');
        // actually send the request
    });
    it('should save a picture in the MongoDB', () => {
        const canvasInformation = {
            _id: 'list_of_all_labels',
            name: '',
            labels: [{ label: '' }, { label: '' }],
            width: 0,
            height: 0,
            date: new Date(),
            picture: '',
        } as CanvasInformation;
        const spy = spyOn(service, 'savePicture').and.callThrough();
        service.savePicture(canvasInformation);
        expect(spy).toHaveBeenCalled();
    });
    it('should delete a specific image with title and body', () => {
        const message = { title: 'I_AM_GOD', body: 'A_TRUE_GOD_NEED_NO_BODY' } as Message;
        const spy = spyOn(service, 'deleteQuery').and.callThrough();
        service.deleteQuery(message);
        expect(spy).toHaveBeenCalledWith(message);
    });
    it('should send to the server an email with an image', () => {
        const formData = new FormData();
        const obj = { sup: 'world' };
        const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'image/png' });
        formData.append('image', blob, 'image.png');
        formData.append('email', 'example@email.com');
        const spy = spyOn(service, 'sendEmail').and.callThrough();
        service.sendEmail(formData);
        expect(spy).toHaveBeenCalledWith(formData);
    });
});
