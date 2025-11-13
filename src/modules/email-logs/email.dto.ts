import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { IsEnum, IsNumber, Min } from 'class-validator';
import { MailStatus } from '../../config/entity/email-log.schema';
import { Type } from 'class-transformer';

class AttachmentDto {
  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsNotEmpty()
  @IsString()
  path: string;
}

export class SendMailDto {
  @IsEmail({}, { message: 'Invalid recipient email' })
  to: string;

  @IsNotEmpty({ message: 'Subject is required' })
  @IsString()
  subject: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  html?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid CC email' })
  cc?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid BCC email' })
  bcc?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];
}

export class GetEmailsDto {
  /** Optional filter for email status (pending, sent, failed) */
  @IsOptional()
  @IsEnum(MailStatus, {
    message: 'status must be one of pending, sent, or failed',
  })
  status?: MailStatus;

  /** Optional text search (searches subject, from, to) */
  @IsOptional()
  @IsString()
  search?: string;

  /** Optional filter by sender email */
  @IsOptional()
  @IsString()
  from?: string;

  /** Optional filter by recipient email */
  @IsOptional()
  @IsString()
  to?: string;

  /** Page number for pagination (default: 1) */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  /** Number of results per page (default: 10) */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 10;
}
