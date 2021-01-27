import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Filter } from '@app/classes/filter';
import { ImageFormat } from '@app/classes/image-format';
import { ClientServerCommunicationService } from '@app/services/client-server/client-server-communication.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-dialog-export-email',
    templateUrl: './dialog-export-email.component.html',
    styleUrls: ['./dialog-export-email.component.scss'],
})
export class DialogExportEmailComponent implements AfterViewInit {
    private whichExportType: ImageFormat = ImageFormat.PNG;
    private whichFilter: Filter = Filter.NONE;

    nameFormControl: FormControl;
    emailFormControl: FormControl;

    private filterString: Map<Filter, string> = new Map([
        [Filter.BLUR, 'blur(4px)'],
        [Filter.BRIGHTNESS, 'brightness(200)'],
        [Filter.GRAY_SCALE, 'grayscale(100)'],
        [Filter.INVERT, 'invert(50)'],
        [Filter.SEPIA, 'sepia(50)'],
    ]);

    private imageFormatString: Map<ImageFormat, string> = new Map([
        [ImageFormat.PNG, '.png'],
        [ImageFormat.JPG, '.jpeg'],
    ]);

    constructor(private drawingService: DrawingService, private clientServerService: ClientServerCommunicationService) {
        this.nameFormControl = new FormControl('default', Validators.pattern('^[a-zA-Z]{1,63}$'));
        this.emailFormControl = new FormControl('exemple@email.com', Validators.email);
    }

    @ViewChild('previewImage', { static: false }) previewImage: ElementRef<HTMLImageElement>;

    // https://stackoverflow.com/questions/19262141/resize-image-with-javascript-canvas-smoothly
    ngAfterViewInit(): void {
        this.previewImage.nativeElement.src = this.drawingService.convertBaseCanvasToBase64();
    }

    checkPNG(): void {
        this.whichExportType = ImageFormat.PNG;
    }

    checkJPG(): void {
        this.whichExportType = ImageFormat.JPG;
    }

    checkNone(): void {
        this.whichFilter = Filter.NONE;
        this.previewImage.nativeElement.style.filter = '';
    }
    checkFirst(): void {
        this.whichFilter = Filter.BLUR;
        this.previewImage.nativeElement.style.filter = 'blur(4px)';
    }

    checkSecond(): void {
        this.whichFilter = Filter.GRAY_SCALE;
        this.previewImage.nativeElement.style.filter = 'grayscale(100)';
    }

    checkThird(): void {
        this.whichFilter = Filter.INVERT;
        this.previewImage.nativeElement.style.filter = 'invert(50)';
    }

    checkFourth(): void {
        this.whichFilter = Filter.BRIGHTNESS;
        this.previewImage.nativeElement.style.filter = 'brightness(200)';
    }

    checkFifth(): void {
        this.whichFilter = Filter.SEPIA;
        this.previewImage.nativeElement.style.filter = 'sepia(50)';
    }

    exportToEmail(): void {
        if (this.nameFormControl.valid && this.emailFormControl.valid) {
            let textImageFormat: string = this.nameFormControl.value;
            switch (this.whichExportType) {
                case ImageFormat.PNG:
                    textImageFormat += '.png';
                    break;
                case ImageFormat.JPG:
                    textImageFormat += '.jpeg';
                    break;
            }
            switch (this.whichFilter) {
                case Filter.NONE:
                    textImageFormat += '\n Aucun filtre';
                    break;
                case Filter.BLUR:
                    textImageFormat += '\n Filtre blur';
                    break;
                case Filter.BRIGHTNESS:
                    textImageFormat += '\n Filtre brightness';
                    break;
                case Filter.GRAY_SCALE:
                    textImageFormat += '\n Filtre grayscale';
                    break;
                case Filter.INVERT:
                    textImageFormat += '\n Filtre invert';
                    break;
                case Filter.SEPIA:
                    textImageFormat += '\n Filtre sepia';
                    break;
            }
            if (confirm("Voulez-vous envoyer l'image " + textImageFormat + ' au courriel ' + this.emailFormControl.value + ' ?')) {
                const finalImageCanvas = document.createElement('canvas');
                const finalImageCtx = finalImageCanvas.getContext('2d') as CanvasRenderingContext2D;

                finalImageCanvas.width = this.drawingService.canvas.width;
                finalImageCanvas.height = this.drawingService.canvas.height;

                finalImageCtx.filter = this.filterString.get(this.whichFilter) as string;
                finalImageCtx.drawImage(this.previewImage.nativeElement, 0, 0);

                let base64image;
                if (this.whichExportType === ImageFormat.JPG) {
                    base64image = finalImageCanvas.toDataURL('image/jpeg');
                } else {
                    base64image = finalImageCanvas.toDataURL('image/png');
                }

                // https://stackoverflow.com/a/47497249
                // https://github.com/axios/axios/issues/710#issuecomment-409213073
                fetch(base64image)
                    .then((res) => res.blob())
                    .then((blob) => {
                        const formData = new FormData();

                        formData.append('image', blob, this.nameFormControl.value + this.imageFormatString.get(this.whichExportType));
                        formData.append('email', this.emailFormControl.value);

                        this.clientServerService.sendEmail(formData).subscribe((res) => {
                            confirm(res);
                        });
                    });
            }
        }
    }
}
