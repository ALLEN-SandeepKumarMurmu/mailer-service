import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
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
