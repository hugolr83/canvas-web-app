import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Filter } from '@app/classes/filter';
import { ImageFormat } from '@app/classes/image-format';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-dialog-export-locally',
    templateUrl: './dialog-export-locally.component.html',
    styleUrls: ['./dialog-export-locally.component.scss'],
})
export class DialogExportDrawingComponent implements AfterViewInit {
    private whichExportType: ImageFormat = ImageFormat.PNG;
    private whichFilter: Filter = Filter.NONE;

    nameFormControl: FormControl;

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

    constructor(private drawingService: DrawingService) {
        this.nameFormControl = new FormControl('default', Validators.pattern('^[a-zA-Z]{1,63}$'));
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

    downloadImage(): void {
        if (this.nameFormControl.valid) {
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
            if (confirm('Voulez-vous sauvegarder ' + textImageFormat)) {
                const finalImageCanvas = document.createElement('canvas');
                const finalImageCtx = finalImageCanvas.getContext('2d') as CanvasRenderingContext2D;

                finalImageCanvas.width = this.drawingService.canvas.width;
                finalImageCanvas.height = this.drawingService.canvas.height;

                finalImageCtx.filter = this.filterString.get(this.whichFilter) as string;
                finalImageCtx.drawImage(this.previewImage.nativeElement, 0, 0);

                // https://stackoverflow.com/a/50300880
                const link = document.createElement('a');
                link.download = this.nameFormControl.value + this.imageFormatString.get(this.whichExportType);
                if (this.whichExportType === ImageFormat.JPG) {
                    link.href = finalImageCanvas.toDataURL('image/jpeg', 1.0);
                } else {
                    link.href = finalImageCanvas.toDataURL('image/png', 1.0);
                }
                link.click();
            }
        }
    }
}
