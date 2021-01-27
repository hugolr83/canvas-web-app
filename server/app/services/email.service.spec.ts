import { ImageFormat } from '@common/communication/image-format';
import axios, { AxiosResponse } from 'axios';
import { expect } from 'chai';
import * as FormData from 'form-data';
import * as FileStream from 'fs';
import * as Sinon from 'sinon';
import { EmailService } from './email.service';

describe('Email service', () => {
    let emailService: EmailService;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(async () => {
        sandbox = Sinon.createSandbox();
        emailService = new EmailService();
    });

    afterEach(async () => {
        sandbox.restore();
    });

    it('should check email is right', () => {
        const goodEmail = 'abc@email.com';
        const isEmailValid = emailService.isEmailValid(goodEmail);
        expect(isEmailValid).to.be.true;
    });

    it('should check email is not good', () => {
        const badEmail = 'x_x@xinject...df';
        const isEmailValid = emailService.isEmailValid(badEmail);
        expect(isEmailValid).to.be.false;
    });

    it('should check an image extension which is PNG', () => {
        const imagePath = './default.png';
        const imageExtension = emailService.getImageExtension(imagePath);
        expect(imageExtension).to.be.equal(ImageFormat.PNG);
    });

    it('should check an image extension which is JPEG', () => {
        const imagePath = './default.jpeg';
        const imageExtension = emailService.getImageExtension(imagePath);
        expect(imageExtension).to.be.equal(ImageFormat.JPG);
    });

    it('should check an image extension which is NONE', () => {
        const imagePath = './default_weird_image_format.highrez';
        const imageExtension = emailService.getImageExtension(imagePath);
        expect(imageExtension).to.be.equal(ImageFormat.NONE);
    });

    it('should check if content is right extension of PNG', async () => {
        const imagePath = './default.png';
        const isContentValid = await emailService.isContentValid(imagePath, ImageFormat.PNG);
        expect(isContentValid).to.be.true;
    });

    it('should check if content is right extension of JPG', async () => {
        const imagePath = './default.jpeg';
        const isContentValid = await emailService.isContentValid(imagePath, ImageFormat.JPG);
        expect(isContentValid).to.be.true;
    });

    it('should check if content is right extension of NONE', async () => {
        const imagePath = './default_weird_image_format.highrez';
        const isContentValid = await emailService.isContentValid(imagePath, ImageFormat.NONE);
        expect(isContentValid).to.be.false;
    });

    it('should send a normal image with a good email and expect 200, as in everything is fine', async () => {
        sandbox.stub(axios).post.resolves({ data: 'the post request worked successfully in the test' } as AxiosResponse);

        const email = 'abc@email.com';
        const formData = new FormData();
        formData.append('email', email);
        formData.append('image', FileStream.createReadStream('default.png'));

        const response = await emailService.sendEmail(formData);
        expect(response.data).to.be.equal('the post request worked successfully in the test');
    });
});
