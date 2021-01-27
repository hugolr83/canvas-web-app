import { Component, OnInit } from '@angular/core';
import { CanvasResizeService } from '@app/services/canvas/canvas-resizer.service';
import { ClientServerCommunicationService } from '@app/services/client-server/client-server-communication.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CanvasInformation, Label } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';

const MAX_CHARACTER = 64;

@Component({
    selector: 'app-dialog-upload',
    templateUrl: './dialog-upload.component.html',
    styleUrls: ['./dialog-upload.component.scss'],
})
export class DialogUploadComponent implements OnInit {
    dataLabel: Label[] = [];
    textLabel: string = '';
    textName: string = '';
    private labelSelect: string[] = [];
    errorTextLabel: boolean = false;
    saveLoad: boolean = false;

    constructor(
        private clientServerComService: ClientServerCommunicationService,
        private canvasResizeService: CanvasResizeService,
        private drawingService: DrawingService,
    ) {}

    ngOnInit(): void {
        this.addAllLabels();
    }

    private addAllLabels(): void {
        this.dataLabel = this.clientServerComService.getAllLabels();
    }
    isLabelExisting(label: string): void {
        let itList = true;
        for (let index = 0; index < this.labelSelect.length; index++) {
            if (this.labelSelect[index] === label) {
                this.labelSelect.splice(index, 1);
                itList = false;
            }
        }
        if (itList) {
            this.labelSelect.push(label);
        }
    }
    refresh(): void {
        this.addAllLabels();
    }
    saveServer(): void {
        this.saveLoad = true;
        const nameResult = !this.checkName(this.textName);
        const labelResult = !this.checkLabel(this.textLabel);
        this.errorTextLabel = !labelResult;
        if (nameResult && labelResult) {
            const labelName: Label[] = [];
            if (this.textLabel !== '') {
                const texts = this.textLabel.split('#');
                texts.forEach((textLabel) => {
                    if (textLabel !== '') labelName.push({ label: textLabel });
                });
            }
            let checkInTheList = true;
            this.labelSelect.forEach((element) => {
                checkInTheList = true;
                labelName.forEach((elementLabels) => {
                    if (checkInTheList && element === elementLabels.label) {
                        checkInTheList = false;
                    }
                });
                if (checkInTheList) {
                    labelName.push({ label: element });
                }
            });
            const savePicture: CanvasInformation = {
                _id: '',
                date: new Date(),
                height: this.canvasResizeService.canvasSize.y,
                width: this.canvasResizeService.canvasSize.x,
                labels: labelName,
                name: this.textName,
                picture: this.drawingService.convertBaseCanvasToBase64(),
            };
            this.clientServerComService.savePicture(savePicture).subscribe((info) => this.processedMessage(info));
        } else {
            this.saveLoad = false;
        }
    }

    processedMessage(message: Message): void {
        if (message === undefined) {
            alert('Sauvegarde : Échec \nAucune communication au serveur');
        } else {
            alert('Sauvegarde : ' + message.title + '\n' + message.body);
        }

        this.saveLoad = false;
    }

    checkName(name: string): boolean {
        return name === '' || name === undefined || this.notGoodCharacter(name) || name.split(' ').length !== 1;
    }

    checkLabel(label: string): boolean {
        if (label.length === 0) {
            return false;
        }
        if (label.split(' ').length !== 1) return true;
        const arrayText = label.split('#');
        for (const textLabel of arrayText) {
            if (this.notGoodCharacter(textLabel)) {
                return true;
            }
            if (textLabel.length > MAX_CHARACTER) {
                return true;
            }
        }
        return false;
    }

    notGoodCharacter(text: string): boolean {
        return (
            text.split('#').length !== 1 ||
            text.split("'").length !== 1 ||
            text.split('/').length !== 1 ||
            text.split('"').length !== 1 ||
            text.split('-').length !== 1 ||
            text.split('&').length !== 1 ||
            text.split('*').length !== 1 ||
            text.split('!').length !== 1 ||
            text.split('$').length !== 1 ||
            text.split('?').length !== 1 ||
            text.split('|').length !== 1 ||
            text.split('%').length !== 1
        );
    }
}
