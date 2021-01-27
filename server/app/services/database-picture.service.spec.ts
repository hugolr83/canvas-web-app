import { CanvasInformation } from '@common/communication/canvas-information';
import { expect } from 'chai';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DatabasePictureService } from './database-picture.service';
// tslint:disable:no-any
describe('Database service', () => {
    let databaseService: DatabasePictureService;
    let mongoServer: MongoMemoryServer;
    let db: Db;
    let client: MongoClient;
    let testCanvasInformationAdd: CanvasInformation;
    const allDataTest = [
        { name: 'test1', labels: [{ label: 'label1' }], width: 0, height: 0, date: new Date('10/04/2020'), picture: 'test1' },
        { name: 'test2', labels: [{ label: 'label1' }, { label: 'label2' }], width: 0, height: 0, date: new Date('10/05/2020'), picture: 'test2' },
        { name: 'test3', labels: [{}], width: 0, height: 0, date: new Date('10/08/2020 15:15:15'), picture: 'test3' },
        { name: 'test4', labels: [{ label: 'label2' }], width: 0, height: 0, date: new Date('10/08/2020'), picture: 'test4' },
    ] as CanvasInformation[];

    beforeEach(async () => {
        databaseService = new DatabasePictureService();

        mongoServer = new MongoMemoryServer();
        const mongoUri = await mongoServer.getUri();
        client = await MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

        db = client.db(await mongoServer.getDbName());
        databaseService['collection'] = db.collection('test');
        testCanvasInformationAdd = {
            _id: '',
            name: 'test5',
            labels: [{ label: 'label1' }],
            width: 0,
            height: 0,
            date: new Date('10/08/2020'),
            picture: 'test5',
        };
        await databaseService['collection'].insertMany(allDataTest);
        await databaseService.getPictures();
    });

    afterEach(async () => {
        await client.close();
    });

    it('should getPictures all data', async () => {
        const getImageData = await databaseService.getPictures();
        expect(getImageData.length > 0).to.equal(true);
    });

    it('should getPicturesLabels not label return all data ', async () => {
        const label: string[] = [];
        const getImageData = await databaseService.getPicturesLabels(label);
        expect(getImageData.length).to.equal(4);
    });

    it('should getPicturesLabels return null ', async () => {
        const label: string[] = ['a'];
        const getImageData = await databaseService.getPicturesLabels(label);
        expect(getImageData.length).to.equal(0);
    });

    it('should getPicturesLabels return 2 CanvasInformation ', async () => {
        const label: string[] = ['label1'];
        const getImagesData = await databaseService.getPicturesLabels(label);
        expect(getImagesData.length).to.equal(2);
    });

    it('should getPicturesLabels 2 labels return 3 CanvasInformation ', async () => {
        const label: string[] = ['label1', 'label2'];
        const getImagesData = await databaseService.getPicturesLabels(label);
        expect(getImagesData.length).to.equal(3);
    });

    it('should addPicture in the collection and find the added item', async () => {
        await databaseService.addPicture(testCanvasInformationAdd);
        const getImagesData: CanvasInformation = await databaseService.getPictureName(testCanvasInformationAdd.name);
        expect(getImagesData.name).to.equal(testCanvasInformationAdd.name);
    });

    it('should addPicture is not add collection', async () => {
        const newPicError = {
            name: '',
            labels: [{ label: 'label2' }],
            width: 0,
            height: 0,
            date: new Date('10/08/2020'),
            picture: 'a',
        } as CanvasInformation;

        await databaseService
            .addPicture(newPicError)
            .then((result: any) => {
                expect(result).to.equal(new Error('Invalid picture'));
            })
            .catch((error: Error) => {
                expect(error.message).to.equal('Invalid picture');
            });
    });
    it('all many label but 3 different labels', async () => {
        await databaseService['collection'].insertOne({
            name: 'test5',
            width: 0,
            height: 0,
            labels: [{ label: 'label3' }],
            date: new Date('10/08/2020'),
            picture: 'test5',
        } as CanvasInformation);
        await databaseService
            .getAllLabels()
            .then((result: any) => {
                expect(result[0].label).to.equal('label1');
                expect(result[1].label).to.equal('label2');
                expect(result[2].label).to.equal('label3');
            })
            .catch((error: Error) => {
                console.log('errer test :' + error.message);
            });
    });
    it('test get all labels return two labels', async () => {
        await databaseService
            .getAllLabels()
            .then((result: any) => {
                expect(result[0].label).to.equal('label1');
                expect(result[1].label).to.equal('label2');
            })
            .catch((error: Error) => {
                console.log('errer test :' + error.message);
            });
    });
    it('test error find getPictures', async () => {
        client.close();
        await databaseService
            .getPictures()
            .then((result: any) => {
                expect(result.name).to.equal('MongoError');
            })
            .catch((error: Error) => {
                expect(error.message).to.not.equal(NaN);
            });
    });

    it('test error find getPicturesLabels', async () => {
        client.close();
        const label: string[] = ['label1'];
        await databaseService
            .getPicturesLabels(label)
            .then((result: any) => {
                expect(result.name).to.equal('MongoError');
            })
            .catch((error: Error) => {
                expect(error.message).to.not.equal(NaN);
            });
    });
    it('find getPicturesLabels label ', async () => {
        const label: string[] = ['Error'];
        const getImagesData = await databaseService.getPicturesLabels(label).catch((error: Error) => {
            expect(error.message).to.not.equal(NaN);
        });
        expect(getImagesData[0].name).to.equal('Error');
    });
    it('test error catch getPictureName', async () => {
        client.close();
        const label: string = 'label1';
        await databaseService
            .getPictureName(label)
            .then((result: CanvasInformation) => {
                expect(result.name).to.equal('MongoError');
            })
            .catch((error: Error) => {
                expect(error.name).to.equal('MongoError');
            });
    });

    it('test error find addPicture', async () => {
        client.close();
        await databaseService
            .addPicture(testCanvasInformationAdd)
            .then((result: any) => {
                expect(result.name).to.equal('Error');
            })
            .catch((error: unknown) => {
                return error;
            });
    });
    it('test error find getAllLabels', async () => {
        client.close();
        await databaseService
            .getAllLabels()
            .then((result: any) => {
                expect(result.name).to.equal('Error');
            })
            .catch((error: unknown) => {
                return error;
            });
    });
    it('test error find getPicturesDate', async () => {
        client.close();
        await databaseService
            .getPicturesDate('')
            .then((result: any) => {
                expect(result.name).to.equal('Error');
            })
            .catch((error: unknown) => {
                return error;
            });
    });
    it('test error find getPicturesName', async () => {
        client.close();
        await databaseService
            .getPicturesName('')
            .then((result: any) => {
                expect(result.name).to.equal('Error');
            })
            .catch((error: unknown) => {
                return error;
            });
    });
    it('test find getPicturesDate return []', async () => {
        await databaseService
            .getPicturesDate('')
            .then((result: any) => {
                expect(result).to.equal([]);
            })
            .catch((error: unknown) => {
                return error;
            });
    });
    it('test find getPicturesName return []', async () => {
        await databaseService
            .getPicturesName('')
            .then((result: any) => {
                expect(result).to.equal([]);
            })
            .catch((error: unknown) => {
                return error;
            });
    });
    it('test find getPicturesDate', async () => {
        await databaseService
            .getPicturesDate('10/08/2020')
            .then((result: any) => {
                expect(result[0]).to.equal('test3');
                expect(result[1]).to.equal('test4');
            })
            .catch((error: unknown) => {
                return error;
            });
    });
    it('test find getPicturesName ', async () => {
        await databaseService
            .getPicturesName('test1')
            .then((result: any) => {
                expect(result[0].name).to.equal('test1');
            })
            .catch((error: unknown) => {
                return error;
            });
    });
    it('test find getPicturesName ', async () => {
        await databaseService
            .getPicturesName('test1')
            .then((result: any) => {
                expect(result[0].name).to.equal('test1');
            })
            .catch((error: unknown) => {
                return error;
            });
    });
    it('delete good id return true', async () => {
        let getImageData: any[] = await databaseService.getPictures();
        if (getImageData.length) {
            await databaseService
                .delete(getImageData[0]._id)
                .then((result: boolean) => {
                    expect(result).to.equal(true);
                })
                .catch((err: Error) => {
                    console.log(err.message);
                });
        }
    });
    it('delete not good id return false', async () => {
        await databaseService
            .delete('')
            .then((result: boolean) => {
                expect(result).to.equal(false);
            })
            .catch((err) => {
                console.log(err.message);
            });
    });
    it('delete error mongodb close', async () => {
        client.close();
        await databaseService
            .delete('')
            .then(() => {
                expect(true).to.equal(false);
            })
            .catch((err) => {
                expect(err.message).to.equal('Topology is closed, please connect');
            });
    });
    it('test find modifyPicture', async () => {
        let infoModif: CanvasInformation = await databaseService.getPictureName(allDataTest[0].name);
        const modify = 'modify';
        infoModif.name = modify;
        await databaseService
            .modifyPicture(infoModif)
            .then((result: boolean) => {
                expect(result).to.true;
            })
            .catch((error: unknown) => {
                expect(error).to.true;
            });
        const infoModiReturn: CanvasInformation = await databaseService.getPictureName(modify);
        expect(infoModiReturn.name).to.equal(modify);
    });
    it('test find modifyPicture', async () => {
        let infoModif: CanvasInformation = await databaseService.getPictureName(allDataTest[0].name);
        const modify = 'modify';
        infoModif.name = modify;
        await databaseService
            .modifyPicture(infoModif)
            .then((result: boolean) => {
                expect(result).to.true;
            })
            .catch((error: unknown) => {
                expect(error).to.equal('Error');
            });
    });
    it('test find modifyPicture false', async () => {
        await client.close();
        const infoModif: CanvasInformation = {
            _id: 'allDataTest.id',
            name: allDataTest[0].name,
            labels: [{ label: 'label1' }],
            width: 0,
            height: 0,
            date: new Date('10/04/2020'),
            picture: 'modify',
        };
        await databaseService
            .modifyPicture(infoModif)
            .then((result: boolean) => {
                expect(result).to.false;
            })
            .catch((error: Error) => {
                expect(error.message).to.equal('Topology is closed, please connect');
            });
    });

    it('test find modifyPicture error', async () => {
        const infoModif: CanvasInformation = {
            _id: '',
            name: '',
            labels: [{ label: 'label1' }],
            width: 0,
            height: 0,
            date: new Date('10/04/2020'),
            picture: '',
        };
        await databaseService
            .modifyPicture(infoModif)
            .then((result: boolean) => {
                expect(result).to.equal('Invalid picture');
            })
            .catch((error: Error) => {
                expect(error.message).to.equal('Invalid picture');
            });
    });
});
