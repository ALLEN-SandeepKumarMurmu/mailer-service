import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum MailStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
}

@Schema({ timestamps: true, collection: 'email_logs' })
export class EmailLog extends Document {
  @Prop({ required: true })
  to: string;

  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  subject: string;

  @Prop()
  cc?: string;

  @Prop()
  bcc?: string;

  @Prop()
  html?: string;

  @Prop()
  text?: string;

  @Prop({
    type: String,
    enum: MailStatus,
    default: MailStatus.PENDING,
  })
  status: MailStatus;

  @Prop()
  messageId?: string;

  @Prop()
  errorMessage?: string;
}

export const EmailLogSchema = SchemaFactory.createForClass(EmailLog);
