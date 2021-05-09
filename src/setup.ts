import { ValidationPipe, HttpStatus, INestApplication } from '@nestjs/common';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as connectPgSimple from 'connect-pg-simple';

import { AppModule } from './app.module';

export function setup(app: INestApplication): INestApplication {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  app.use(cookieParser('test'));

  app.use(
    session({
      secret: 'session',
      resave: false,
      saveUninitialized: false,
      store:
        process.env.NODE_ENV === 'production'
          ? new (connectPgSimple(session))()
          : new session.MemoryStore(),
      cookie: {
        httpOnly: true,
        signed: true,
        sameSite: 'strict',
        secure: false
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors({
    origin: 'test'?.split(/\s*,\s*/) ?? '*',
    credentials: true,
    exposedHeaders: ['Authorization'],
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  return app;
}
