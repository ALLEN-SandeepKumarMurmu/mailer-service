import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { EmailLogsModule } from './email-logs/email-logs.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: '',
        children: [{ path: 'email', module: EmailLogsModule }],
      },
    ]),
    EmailLogsModule,
  ],
})
export class MainModules {}
