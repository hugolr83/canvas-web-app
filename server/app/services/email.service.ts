import { ImageFormat } from '@common/communication/image-format';
import axios, { AxiosResponse } from 'axios';
import * as FileType from 'file-type';
import { FileTypeResult } from 'file-type/core';
import * as FormData from 'form-data';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { ReadFileService } from './read-file.service';

@injectable()
export class EmailService {
    private url: string = 'URL';
    private X_TEAM_KEY: string = 'X_TEAM_KEY';
    // https://regexr.com/3e48o
    private readonly EMAIL_REGEX_VALIDATION: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    constructor() {
        this.readFile('email_info.txt');
    }

    private readFile(nomFile: string): void {
        const readFileService = new ReadFileService();
        readFileService.openFileRead(nomFile);
        const keyElement: string[][] = readFileService.getInfos();
        keyElement.forEach((element) => {
            if (element[0] === this.url) {
                this.url = element[1];
            }
            if (element[0] === this.X_TEAM_KEY) {
                this.X_TEAM_KEY = element[1];
            }
        });
    }

    isEmailValid(email: string): boolean {
        return email.match(this.EMAIL_REGEX_VALIDATION) !== null;
    }

    getImageExtension(imagePath: string): ImageFormat {
        const extension = imagePath.split('.').pop();
        if (extension === 'png' || extension === 'PNG') {
            return ImageFormat.PNG;
        }
        if (extension === 'jpg' || extension === 'jpeg' || extension === 'JPG' || extension === 'JPEG') {
            return ImageFormat.JPG;
        }
        return ImageFormat.NONE;
    }

    async isContentValid(imagePath: string, expectedExtension: ImageFormat): Promise<boolean> {
        // https://www.npmjs.com/package/file-type
        let imageFormatResult: FileTypeResult;
        imageFormatResult = (await FileType.fromFile(imagePath)) as FileTypeResult;
        if (imageFormatResult.ext === 'png' && expectedExtension === ImageFormat.PNG) {
            return true;
        }
        if (imageFormatResult.ext === 'jpg' && expectedExtension === ImageFormat.JPG) {
            return true;
        }
        return false;
    }

    async sendEmail(emailAndImage: FormData): Promise<AxiosResponse> {
        return axios
            .post(this.url, emailAndImage, {
                headers: {
                    'x-team-key': this.X_TEAM_KEY,
                    ...emailAndImage.getHeaders(),
                },
            })
            .then((response: AxiosResponse) => {
                console.log(response.data);
                return response;
            });
    }
}
