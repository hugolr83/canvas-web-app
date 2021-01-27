import { Application } from '@app/app';
import { TYPES } from '@app/types';
import { ImageFormat } from '@common/communication/image-format';
import { expect } from 'chai';
import { Container } from 'inversify/dts/container/container';
import { SinonSandbox } from 'sinon';
import * as supertest from 'supertest';
import { testingContainer } from '../../test/test-utils';
import * as EmailController from './email.controller';

describe('Email controller', () => {
    let app: Express.Application;
    let testsContainer: Container;
    let testsSandbox: SinonSandbox;

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.EmailService).toConstantValue({});
        testsContainer = container;
        testsSandbox = sandbox;
    });

    it('should someone send a request without any formData, resolve as 400', async () => {
        testsContainer.rebind(TYPES.EmailService).toConstantValue({
            isEmailValid: testsSandbox.stub().returns(false),
            isContentValid: testsSandbox.stub().resolves(false),
            getImageExtension: testsSandbox.stub().resolves(ImageFormat.PNG),
            sendEmail: testsSandbox.stub().resolves(),
        });
        app = testsContainer.get<Application>(TYPES.Application).app;

        return supertest(app)
            .post('/api/email')
            .expect(EmailController.FORMDATA_IS_MISSING)
            .then((response: any) => {
                expect(response.text).to.deep.equal("Votre requête a besoin d'un courriel.");
            });
    });

    it('should someone send a request without an image in formData, resolve as 400', async () => {
        testsContainer.rebind(TYPES.EmailService).toConstantValue({
            isEmailValid: testsSandbox.stub().returns(true),
            isContentValid: testsSandbox.stub().resolves(true),
            getImageExtension: testsSandbox.stub().resolves(ImageFormat.PNG),
            sendEmail: testsSandbox.stub().resolves(),
        });

        return supertest(app)
            .post('/api/email')
            .field('email', 'lol@lol.com')
            .expect(EmailController.BAD_IMAGE)
            .then((response: any) => {
                expect(response.text).to.deep.equal("Votre requête a besoin d'une image PNG ou JPG.");
            });
    });

    it('should image is good but email is invalid as not of email format, resolve as 400', async () => {
        testsContainer.rebind(TYPES.EmailService).toConstantValue({
            isEmailValid: testsSandbox.stub().returns(false),
            isContentValid: testsSandbox.stub().resolves(true),
            getImageExtension: testsSandbox.stub().resolves(ImageFormat.PNG),
            sendEmail: testsSandbox.stub().resolves(),
        });

        return supertest(app)
            .post('/api/email')
            .field('email', 'lol@-dwadf...lol.com')
            .attach('image', './default.png')
            .expect(EmailController.BAD_EMAIL)
            .then((response: any) => {
                expect(response.text).to.deep.equal("Le courriel fourni n'est pas d'un format valide. Le courriel doit être style abc@email.com");
            });
    });

    it('should email is good but image is a fake png, resolve as 400', async () => {
        testsContainer.rebind(TYPES.EmailService).toConstantValue({
            isEmailValid: testsSandbox.stub().returns(true),
            isContentValid: testsSandbox.stub().resolves(false),
            getImageExtension: testsSandbox.stub().resolves(ImageFormat.PNG),
            sendEmail: testsSandbox.stub().resolves(),
        });
        app = testsContainer.get<Application>(TYPES.Application).app;

        return supertest(app)
            .post('/api/email')
            .field('email', 'lol@lol.com')
            .attach('image', './default.jpeg')
            .expect(EmailController.BAD_IMAGE)
            .then((response: any) => {
                expect(response.text).to.deep.equal("L'extension du fichier n'est pas le même que le contenu.");
            });
    });

    it('should image of png format and email sent are good, resolve as 200', async () => {
        testsContainer.rebind(TYPES.EmailService).toConstantValue({
            isEmailValid: testsSandbox.stub().returns(true),
            isContentValid: testsSandbox.stub().resolves(true),
            getImageExtension: testsSandbox.stub().resolves(ImageFormat.PNG),
            sendEmail: testsSandbox.stub().resolves(),
        });
        app = testsContainer.get<Application>(TYPES.Application).app;

        return supertest(app)
            .post('/api/email')
            .field('email', 'lol@lol.com')
            .attach('image', './default.png')
            .expect(EmailController.EVERYTHING_IS_FINE)
            .then((response: any) => {
                expect(response.text).to.deep.equal("Si le courriel existe, l'image devrait se rendre au courriel dans un instant.");
            });
    });

    it('should image of jpg format and email sent are good, resolve as 200', async () => {
        testsContainer.rebind(TYPES.EmailService).toConstantValue({
            isEmailValid: testsSandbox.stub().returns(true),
            isContentValid: testsSandbox.stub().resolves(true),
            getImageExtension: testsSandbox.stub().resolves(ImageFormat.PNG),
            sendEmail: testsSandbox.stub().resolves(),
        });
        app = testsContainer.get<Application>(TYPES.Application).app;

        return supertest(app)
            .post('/api/email')
            .field('email', 'lol@lol.com')
            .attach('image', './default.jpeg')
            .expect(EmailController.EVERYTHING_IS_FINE)
            .then((response: any) => {
                expect(response.text).to.deep.equal("Si le courriel existe, l'image devrait se rendre au courriel dans un instant.");
            });
    });
});
