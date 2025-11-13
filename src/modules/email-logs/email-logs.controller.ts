import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();
import { EmailLogsService } from './email-logs.service';
import { SendMailDto } from './email.dto';

@Controller()
export class EmailLogsController {
  private readonly logger = new Logger(EmailLogsController.name);
  constructor(private readonly emailLogsService: EmailLogsService) {}

  @Post()
  async sendMail(@Body() body: SendMailDto) {
    try {
      this.logger.log('Sending email with data:', JSON.stringify(body));
      return this.emailLogsService.sendMail(body);
    } catch (error) {
      this.logger.error('Error sending mail:', error.message);
      return { error: 'Failed to send email', details: error.message };
    }
  }

  @Get('logs')
  findAll() {
    return this.emailLogsService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.emailLogsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateEmailLogDto: UpdateEmailLogDto,
  // ) {
  //   return this.emailLogsService.update(+id, updateEmailLogDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.emailLogsService.remove(+id);
  // }
}
