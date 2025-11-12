import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum MailStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  QUEUED = 'queued',
}

@Schema({ timestamps: true, collection: 'email_logs' })
export class EmailLog extends Document {
  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop({ required: true })
  subject: string;

  @Prop()
  template?: string;

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

  @Prop({ default: 0 })
  retryCount: number;
}

export const EmailLogSchema = SchemaFactory.createForClass(EmailLog);
