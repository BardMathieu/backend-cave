import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from '../config';

@Module({
  imports: [
    MongooseModule.forRoot(config.db),
    TerminusModule,
    UserModule,
    AuthModule
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
