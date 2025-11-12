import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/database/database.module';
import { MainModules } from './modules';
@Module({
  imports: [DatabaseModule, MainModules],
})
export class AppModule {}
