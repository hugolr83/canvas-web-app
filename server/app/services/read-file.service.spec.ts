import { expect } from 'chai';
import { ReadFileService } from './read-file.service';
describe('Read File service', () => {
    let readFileService: ReadFileService;
    const nomFile = 'test_read.txt';

    beforeEach(async () => {
        readFileService = new ReadFileService();
    });

    it('should constructor ReadFileService', () => {
        const text = "test =' test1\ntest2 =' test2\ntrreawwadrweq";
        readFileService.openFileRead(nomFile);
        expect(readFileService['textInfo']).to.be.equal(text);
        expect(readFileService['isReal']).to.be.equal(false);
        expect(readFileService['nomeFile']).to.be.equal(nomFile);
    });

    it('should test constructor not nom file', () => {
        let newReadFileService = new ReadFileService();
        expect(newReadFileService['isReal']).to.be.equal(false);
        expect(newReadFileService['textInfo']).to.be.equal('');
        expect(newReadFileService['nomeFile']).to.be.equal('');
    });
    it(' openFileRead return true', () => {
        expect(readFileService.openFileRead(nomFile)).to.be.equal(true);
    });
    it(' openFileRead return false', () => {
        expect(readFileService.openFileRead('')).to.be.equal(false);
    });
    it(' getInfos isReal false , nomeFile "" and return []', () => {
        readFileService['nomeFile'] = '';
        readFileService['isReal'] = false;
        expect(readFileService.getInfos().length).to.be.equal(0);
    });
    it(' getInfos isReal false and reussi openFileRead return 2 line info', () => {
        readFileService['nomeFile'] = nomFile;
        readFileService['isReal'] = false;
        expect(readFileService.getInfos().length).to.be.equal(2);
    });
    it(' getInfos return 2 line info', () => {
        readFileService.openFileRead(nomFile);
        readFileService['isReal'] = true;
        const texts = readFileService.getInfos();
        expect(texts.length).to.be.equal(2);
        expect(texts[0][0]).to.be.equal('test');
        expect(texts[0][1]).to.be.equal(' test1');
    });
});
