import { EmailService } from '@app/services/email.service';
import { ImageFormat } from '@common/communication/image-format';
import { Request, Response, Router } from 'express';
import * as FormData from 'form-data';
import * as fs from 'fs';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

export const EVERYTHING_IS_FINE = 200;
export const FORMDATA_IS_MISSING = 400;
export const BAD_IMAGE = 400;
export const BAD_EMAIL = 400;
export const ALL_OTHER_ERRORS = 500;

@injectable()
export class EmailController {
    router: Router;

    constructor(@inject(TYPES.EmailService) private emailService: EmailService) {
        this.configureRouter();
    }
    private configureRouter(): void {
        this.router = Router();
        this.router.post('/', async (req: Request, res: Response) => {
            const email = req.body.email;

            if (email === undefined) {
                console.log("Votre requête a besoin d'un courriel.");
                res.status(BAD_EMAIL).send("Votre requête a besoin d'un courriel.");
                return;
            }

            let imageFile;
            // Multer request type
            // tslint:disable-next-line:no-any
            imageFile = (req as any).file;
            console.log(imageFile);

            if (imageFile === undefined) {
                console.log("Votre requête a besoin d'une image PNG ou JPG.");
                res.status(BAD_IMAGE).send("Votre requête a besoin d'une image PNG ou JPG.");
            }

            const expressImageName = imageFile.path as string;
            const properImageName = imageFile.originalname as string;

            const isEmailValid = this.emailService.isEmailValid(email);
            if (!isEmailValid) {
                console.log("Le courriel fourni n'est pas d'un format valide. Le courriel doit être style abc@email.com");
                res.status(BAD_EMAIL).send("Le courriel fourni n'est pas d'un format valide. Le courriel doit être style abc@email.com");
                return;
            }

            const expectedFileExtension: ImageFormat = await this.emailService.getImageExtension(properImageName);
            const isImageContentEqualExtension: boolean = await this.emailService.isContentValid(expressImageName, expectedFileExtension);
            if (!isImageContentEqualExtension) {
                console.log("L'extension du fichier n'est pas le même que le contenu.");
                res.status(BAD_IMAGE).send("L'extension du fichier n'est pas le même que le contenu.");
                return;
            }

            fs.rename(expressImageName, properImageName, () => {
                const formData = new FormData();
                formData.append('to', email);
                formData.append('payload', fs.createReadStream(properImageName));

                this.emailService.sendEmail(formData);

                res.status(EVERYTHING_IS_FINE).send("Si le courriel existe, l'image devrait se rendre au courriel dans un instant.");
                return;
            });
        });
    }
}
