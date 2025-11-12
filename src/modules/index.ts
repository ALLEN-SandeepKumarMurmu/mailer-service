import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { EmailLogsModule } from './email-logs/email-logs.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'email',
        children: [{ path: 'logs', module: EmailLogsModule }],
      },
    ]),
    EmailLogsModule,
  ],
})
export class MainModules {}
