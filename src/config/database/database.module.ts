import { Module, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Handles MongoDB connection using Mongoose in a NestJS environment.
//Does not use @nestjs/config — uses process.env directly.
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI as string, {
      maxPoolSize: Number(process.env.MONGO_POOL_SIZE) || 10,
      serverSelectionTimeoutMS: Number(process.env.MONGO_TIMEOUT_MS) || 30000,
      socketTimeoutMS: Number(process.env.MONGO_TIMEOUT_MS) || 30000,
      autoIndex: process.env.NODE_ENV !== 'production',
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseModule.name);

  // Called once the module is initialized.
  // Sets up event listeners and logs connection status.
  async onModuleInit() {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      this.logger.error('MongoDB URI is missing in environment variables.');
      process.exit(1);
    }

    // Event listeners for Mongoose connection
    mongoose.connection.on('connected', () =>
      this.logger.log('MongoDB connected successfully'),
    );

    mongoose.connection.on('reconnected', () =>
      this.logger.log('MongoDB reconnected'),
    );

    mongoose.connection.on('error', (err) =>
      this.logger.error(`MongoDB connection error: ${err.message}`),
    );

    mongoose.connection.on('disconnected', () =>
      this.logger.warn('MongoDB disconnected'),
    );

    this.logger.log('MongoDB connection initialized');
  }

  // Graceful shutdown for MongoDB when NestJS application stops.
  async onModuleDestroy() {
    await mongoose.connection.close();
    this.logger.log('MongoDB connection closed on application shutdown');
  }
}
