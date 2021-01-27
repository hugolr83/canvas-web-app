import { DataController } from '@app/controllers/data.controller';
import { EmailController } from '@app/controllers/email.controller';
import { DatabasePictureService } from '@app/services/database-picture.service';
import { EmailService } from '@app/services/email.service';
import { Container } from 'inversify';
import { Application } from './app';
import { Server } from './server';
import { ReadFileService } from './services/read-file.service';
import { TYPES } from './types';

export const containerBootstrapper: () => Promise<Container> = async () => {
    const container: Container = new Container();

    container.bind(TYPES.Server).to(Server);
    container.bind(TYPES.Application).to(Application);

    container.bind(TYPES.DataController).to(DataController);
    container.bind(TYPES.DatabasePictureService).to(DatabasePictureService);

    container.bind(TYPES.EmailController).to(EmailController);
    container.bind(TYPES.EmailService).to(EmailService);

    container.bind(TYPES.ReadFileService).to(ReadFileService);
    return container;
};
