import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger} from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

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

    await app.listen(port);
    logger.log(`Application listening on port ${port}`);
}

bootstrap();
