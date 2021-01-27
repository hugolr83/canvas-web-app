import { DatabasePictureService } from '@app/services/database-picture.service';
import { CanvasInformation, Label } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
const HTTP_STATUS_BAD_REQUEST = 400;
const MAX_CHARACTER = 64;
@injectable()
export class DataController {
    router: Router;

    constructor(@inject(TYPES.DatabasePictureService) private databaseService: DatabasePictureService) {
        this.configureRouter();
    }
    private configureRouter(): void {
        this.router = Router();
        this.router.get('/', (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getPictures()
                .then((canvasInformation: CanvasInformation[]) => {
                    res.json(canvasInformation);
                })
                .catch((reason: unknown) => {
                    const errorMessage: CanvasInformation = {
                        _id: 'Error',
                        name: reason as string,
                        labels: [],
                        width: 0,
                        height: 0,
                        date: new Date(),
                        picture: '',
                    };
                    res.json(errorMessage);
                });
        });
        this.router.get('/all_labels', (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getAllLabels()
                .then((labelsInformation: Label[]) => {
                    const informationMessage: CanvasInformation = {
                        _id: 'list_of_all_labels',
                        name: 'labels',
                        labels: labelsInformation,
                        width: 0,
                        height: 0,
                        date: new Date(),
                        picture: '',
                    };
                    res.json(informationMessage);
                })
                .catch((reason: unknown) => {
                    const errorMessage: CanvasInformation = {
                        _id: 'Error',
                        name: reason as string,
                        labels: [],
                        width: 0,
                        height: 0,
                        date: new Date(),
                        picture: '',
                    };
                    res.json(errorMessage);
                });
        });
        this.router.post('/labels', (req: Request, res: Response, next: NextFunction) => {
            let sbody: string;
            let labels: string[] = [];
            if (req.body.title === 'labels') {
                try {
                    sbody = req.body.body;
                    labels = this.textToTable(sbody);
                } catch (error) {
                    const errorData: CanvasInformation = {
                        _id: 'Error',
                        name: error as string,
                        labels: [],
                        width: 0,
                        height: 0,
                        date: new Date(),
                        picture: '',
                    };
                    res.status(HTTP_STATUS_BAD_REQUEST).json(errorData);
                    sbody = 'Error';
                }
            } else {
                const errorData: CanvasInformation = {
                    _id: 'Error',
                    name: 'Titre message non valide',
                    labels: [],
                    width: 0,
                    height: 0,
                    date: new Date(),
                    picture: '',
                };
                res.status(HTTP_STATUS_BAD_REQUEST).json(errorData);
                sbody = 'Error';
            }

            if (sbody !== 'Error') {
                this.databaseService
                    .getPicturesLabels(labels)
                    .then((canvasInfo: CanvasInformation[]) => {
                        res.json(canvasInfo);
                    })
                    .catch((reason: unknown) => {
                        const errorMessage: CanvasInformation = {
                            _id: 'Error',
                            name: reason as string,
                            labels: [],
                            width: 0,
                            height: 0,
                            date: new Date(),
                            picture: '',
                        };
                        res.json(errorMessage);
                    });
            }
        });
        this.router.post('/research', (req: Request, res: Response, next: NextFunction) => {
            let research: string;

            if (req.body.title !== undefined) {
                research = req.body.body;
                switch (req.body.title) {
                    case 'name':
                        this.databaseService
                            .getPicturesName(research)
                            .then((canvasInfo: CanvasInformation[]) => {
                                res.json(canvasInfo);
                            })
                            .catch((reason: unknown) => {
                                const errorMessage: CanvasInformation = {
                                    _id: 'Error',
                                    name: reason as string,
                                    labels: [],
                                    width: 0,
                                    height: 0,
                                    date: new Date(),
                                    picture: '',
                                };
                                res.json(errorMessage);
                            });
                        break;
                    case 'date':
                        this.databaseService
                            .getPicturesDate(research)
                            .then((canvasInfo: CanvasInformation[]) => {
                                res.json(canvasInfo);
                            })
                            .catch((reason: unknown) => {
                                const errorMessage: CanvasInformation = {
                                    _id: 'Error',
                                    name: reason as string,
                                    labels: [],
                                    width: 0,
                                    height: 0,
                                    date: new Date(),
                                    picture: '',
                                };
                                res.json(errorMessage);
                            });
                        break;
                    default:
                        const errorData: CanvasInformation = {
                            _id: 'Error',
                            name: 'not good research : ' + req.body.title,
                            labels: [],
                            width: 0,
                            height: 0,
                            date: new Date(),
                            picture: '',
                        };
                        res.status(HTTP_STATUS_BAD_REQUEST).json(errorData);
                        break;
                }
            } else {
                const errorData: CanvasInformation = {
                    _id: 'Error',
                    name: 'not request in post',
                    labels: [],
                    width: 0,
                    height: 0,
                    date: new Date(),
                    picture: '',
                };
                res.status(HTTP_STATUS_BAD_REQUEST).json(errorData);
            }
        });
        this.router.post('/savePicture', (req: Request, res: Response, next: NextFunction) => {
            if (this.testBodyCanvasInformation(req)) {
                const newPicture: CanvasInformation = {
                    _id: req.body._id,
                    name: req.body.name,
                    labels: req.body.labels,
                    date: req.body.date,
                    picture: req.body.picture,
                    height: req.body.height,
                    width: req.body.width,
                };

                if (this.checkName(newPicture.name) || this.checkLabel(newPicture.labels)) {
                    const errorMessage: Message = {
                        title: 'Error',
                        body:
                            'name error : ' +
                            this.checkName(newPicture.name) +
                            '\nRequest : ' +
                            newPicture.name +
                            ';\nlabel error : ' +
                            this.checkLabel(newPicture.labels) +
                            '\nRequest : ' +
                            newPicture.labels,
                    };
                    console.log(errorMessage);
                    res.status(HTTP_STATUS_BAD_REQUEST).json(errorMessage);
                } else {
                    if (newPicture._id === '') {
                        this.databaseService
                            .addPicture(newPicture)
                            .then((good: boolean) => {
                                const successMessage: Message = {
                                    title: 'success',
                                    body: 'addPicture : ' + good,
                                };
                                res.json(successMessage);
                            })
                            .catch((reason: unknown) => {
                                const errorMessage: Message = {
                                    title: 'Error',
                                    body: reason as string,
                                };
                                res.json(errorMessage);
                                console.log(reason);
                            });
                    } else {
                        this.databaseService
                            .modifyPicture(newPicture)
                            .then((good: boolean) => {
                                const successMessage: Message = {
                                    title: 'success',
                                    body: 'modifyPicture : ' + good,
                                };
                                res.json(successMessage);
                            })
                            .catch((reason: unknown) => {
                                const errorMessage: Message = {
                                    title: 'Error',
                                    body: reason as string,
                                };
                                res.json(errorMessage);
                                console.log(reason);
                            });
                    }
                }
            } else {
                const errorMessage: Message = {
                    title: 'Error',
                    body: 'it is not picture',
                };
                res.status(HTTP_STATUS_BAD_REQUEST).json(errorMessage);
            }
        });
        this.router.post('/delete', (req: Request, res: Response, next: NextFunction) => {
            if (req.body.title !== undefined || req.body.body !== undefined) {
                if (req.body.title === 'delete') {
                    this.databaseService
                        .delete(req.body.body)
                        .then((bool: boolean) => {
                            const succesMessage: Message = {
                                title: bool ? 'Success' : 'Not delete',
                                body: bool ? 'Success' : 'not good id',
                            };
                            res.json(succesMessage);
                        })
                        .catch((err: Error) => {
                            const errorMessage: Message = {
                                title: 'Error',
                                body: err.message.toString(),
                            };
                            res.status(HTTP_STATUS_BAD_REQUEST).json(errorMessage);
                        });
                } else {
                    const errorMessage: Message = {
                        title: 'Error',
                        body: 'It not delete title element',
                    };
                    res.status(HTTP_STATUS_BAD_REQUEST).json(errorMessage);
                }
            } else {
                const errorMessage: Message = {
                    title: 'Error',
                    body: 'not request message',
                };
                res.status(HTTP_STATUS_BAD_REQUEST).json(errorMessage);
            }
        });
    }
    private textToTable(theTest: string): string[] {
        return theTest.split(',');
    }
    private testBodyCanvasInformation(req: Request): boolean {
        return (
            req.body._id !== undefined &&
            req.body.name !== undefined &&
            req.body.date !== undefined &&
            req.body.width !== undefined &&
            req.body.height !== undefined &&
            req.body.picture !== undefined
        );
    }
    private checkName(name: string): boolean {
        return name === '' || name === undefined || this.notGoodCharacter(name) || name.split(' ').length !== 1;
    }
    private checkLabel(labels: Label[]): boolean {
        for (const label of labels) {
            console.log(label);
            if (this.notGoodCharacter(label.label)) {
                return true;
            }
            if (label.label.length > MAX_CHARACTER) return true;
        }
        return false;
    }
    private notGoodCharacter(text: string): boolean {
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
