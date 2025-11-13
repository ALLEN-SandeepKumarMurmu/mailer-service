import * as dotenv from 'dotenv';
dotenv.config();

import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SendMailDto } from './email.dto';
import { EmailLog, MailStatus } from '../../config/entity/email-log.schema';

@Injectable()
export class EmailLogsService {
  private readonly logger = new Logger(EmailLogsService.name);
  private readonly transporter;

  constructor(
    @InjectModel(EmailLog.name)
    private readonly emailLogModel: Model<EmailLog>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD, // Gmail app password
      },
    });
  }

  async sendMail(payload: SendMailDto) {
    // 1️⃣ Create log entry with status = pending
    const log = new this.emailLogModel({
      to: payload.to,
      from: process.env.MAIL_USER,
      subject: payload.subject,
      cc: payload.cc,
      bcc: payload.bcc,
      text: payload.text,
      html: payload.html,
      status: MailStatus.PENDING,
    });

    await log.save();
    this.logger.log(`📨 Created log entry (pending) for ${payload.to}`);

    try {
      // 2️⃣ Build mail options dynamically
      const mailOptions: Record<string, any> = {
        from: process.env.MAIL_USER,
        to: payload.to,
        subject: payload.subject,
      };

      if (payload.text) mailOptions.text = payload.text;
      if (payload.html) mailOptions.html = payload.html;
      if (payload.cc) mailOptions.cc = payload.cc;
      if (payload.bcc) mailOptions.bcc = payload.bcc;
      if (payload.attachments?.length)
        mailOptions.attachments = payload.attachments;

      // 3️⃣ Send mail
      const info = await this.transporter.sendMail(mailOptions);

      // 4️⃣ Update log entry to "sent"
      log.status = MailStatus.SENT;
      log.messageId = info.messageId;
      await log.save();

      this.logger.log(`✅ Mail sent successfully to ${payload.to} (Message ID: ${info.messageId})`);

      return {
        success: true,
        message: 'Mail sent successfully',
        messageId: info.messageId,
      };
    } catch (error) {
      // 5️⃣ On failure — mark as failed with reason
      log.status = MailStatus.FAILED;
      log.errorMessage = error.message;
      await log.save();

      this.logger.error(`Failed to send mail to ${payload.to}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  // Optional: view all email logs
  async findAll() {
    return await this.emailLogModel.find().sort({ createdAt: -1 }).exec();
  }
}