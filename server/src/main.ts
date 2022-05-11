import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger} from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import axios from 'axios';

async function subscribeToCtxChanges() {
    try {
        const response = await axios.get(
            `${process.env.BROKER_HOST}:${process.env.BROKER_PORT}/v2/subscriptions`,
        );
        console.log(response.status);
        const subs = response.data;
        if (Array.isArray(subs) && subs.length === 0) {
            const response = await axios.post(
                `${process.env.BROKER_HOST}:${process.env.BROKER_PORT}/v2/subscriptions`,
                {
                    description: 'Notify backend of all context changes',
                    subject: {
                        entities: [
                            {
                                idPattern: '.*',
                                type: 'Station',
                            },
                        ],
                    },
                    notification: {
                        http: {
                            url: `${process.env.BASE_URL}:${process.env.PORT}/api/measurements`,
                        },
                        attrsFormat: 'keyValues',
                    },
                    throttling: 1,
                },
            );
            console.log(response);
        }
    } catch (e) {
        console.log(e);
    }
}

async function bootstrap() {
    const port = process.env.PORT;
    const logger = new Logger('bootstrap');
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api/v1');
    app.use(cookieParser());

    //todo cors config
    // app.enableCors({
    //     origin: process.env.BASE_URL,
    //     credentials: true,
    // });

    const config = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('Coursework-2022')
        .setDescription('API')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);

    // await subscribeToCtxChanges();
    await app.listen(port);
    logger.log(`Application listening on port ${port}`);
}

bootstrap();
