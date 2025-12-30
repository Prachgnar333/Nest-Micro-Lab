import { Module } from '@nestjs/common';
import { SeedCommand } from './seed.command';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [SeedCommand],
})
export class CommandsModule {}
