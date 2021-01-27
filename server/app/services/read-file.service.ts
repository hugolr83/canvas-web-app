import * as fs from 'fs';
import { injectable } from 'inversify';
import * as path from 'path';

@injectable()
export class ReadFileService {
    private nomeFile: string = '';
    private isReal: boolean = false;
    private textInfo: string = '';
    openFileRead(nomFile: string): boolean {
        this.nomeFile = nomFile;
        try {
            const pathLocal = path.join(__dirname, '../secret/' + this.nomeFile);
            this.textInfo = fs.readFileSync(pathLocal, 'utf-8');
            if (this.textInfo !== '') return true;
        } catch (error) {
            console.log('Error Open Read file :', error);
        }
        return false;
    }
    getInfos(): string[][] {
        if (!this.isReal) {
            this.isReal = this.openFileRead(this.nomeFile);
        }
        const textTableau: string[][] = [];
        if (this.isReal) {
            const textLine = this.textInfo.split('\n');
            textLine.forEach((element) => {
                if (element.split(" ='").length === 2) textTableau.push(element.split(" ='"));
            });
        }
        return textTableau;
    }
}
