import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanvasInformation, Label } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ClientServerCommunicationService {
    private readonly HTTP_SERVE_LOCAL: string = 'http://localhost:3000/api/data';
    private readonly HTTP_SERVE_LOCAL_EMAIL: string = 'http://localhost:3000/api/email';
    private information: CanvasInformation;
    constructor(private http: HttpClient) {}

    getData(): Observable<CanvasInformation[]> {
        return this.http.get<CanvasInformation[]>(this.HTTP_SERVE_LOCAL).pipe(catchError(this.handleError<CanvasInformation[]>('basicGet')));
    }

    selectPictureWithLabel(message: Message): Observable<CanvasInformation[]> {
        return this.http
            .post<CanvasInformation[]>(this.HTTP_SERVE_LOCAL + '/labels', message)
            .pipe(catchError(this.handleError<CanvasInformation[]>('basicPost')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }

    allLabels(): Observable<CanvasInformation> {
        return this.http
            .get<CanvasInformation>(this.HTTP_SERVE_LOCAL + '/all_labels')
            .pipe(catchError(this.handleError<CanvasInformation>('basicGet')));
    }

    private catchInformation(): void {
        this.allLabels().subscribe((info) => (this.information = info));
    }

    getAllLabels(): Label[] {
        this.catchInformation();
        if (this.information == undefined) return [];
        if (this.information._id === 'list_of_all_labels') {
            return this.information.labels;
        }
        return [];
    }

    savePicture(newPicture: CanvasInformation): Observable<Message> {
        return this.http.post<Message>(this.HTTP_SERVE_LOCAL + '/savePicture', newPicture).pipe(catchError(this.handleError<Message>('basicPost')));
    }

    getElementResearch(message: Message): Observable<CanvasInformation[]> {
        return this.http
            .post<CanvasInformation[]>(this.HTTP_SERVE_LOCAL + '/research', message)
            .pipe(catchError(this.handleError<CanvasInformation[]>('basicPost')));
    }
    deleteQuery(message: Message): Observable<Message> {
        return this.http.post<Message>(this.HTTP_SERVE_LOCAL + '/delete', message).pipe(catchError(this.handleError<Message>('basicPost')));
    }

    sendEmail(formData: FormData): Observable<string> {
        // the response wants an object as type but the containing data is not necessarily an object
        // tslint:disable:next-line: ban-types
        const responseOption: Object = { responseType: 'text' };
        return this.http.post<string>(this.HTTP_SERVE_LOCAL_EMAIL, formData, responseOption);
    }
}
