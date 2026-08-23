import mongoose from 'mongoose';
import { config } from './env';

export interface DatabaseStatus {
  isConnected: boolean;
  state: string;
  host?: string;
  name?: string;
  error?: string;
}

let dbStatus: DatabaseStatus = {
  isConnected: false,
  state: 'disconnected',
};

export const getDbStatus = (): DatabaseStatus => dbStatus;

export const connectDB = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', true);
    
    // Add connection options
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    dbStatus = {
      isConnected: true,
      state: 'connected',
      host: conn.connection.host,
      name: conn.connection.name,
    };

    console.log(`[KnowSphere DB] MongoDB Connected: ${conn.connection.host} / Database: ${conn.connection.name}`);
  } catch (err: any) {
    dbStatus = {
      isConnected: false,
      state: 'error',
      error: err.message || 'Failed to connect to MongoDB',
    };

    console.warn(`[KnowSphere DB Warning] MongoDB Connection Failed: ${err.message}`);
    console.warn(`[KnowSphere DB Warning] Application running in fallback mode without active DB persistence.`);
  }

  mongoose.connection.on('disconnected', () => {
    dbStatus = {
      isConnected: false,
      state: 'disconnected',
    };
    console.log('[KnowSphere DB] MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    dbStatus = {
      isConnected: true,
      state: 'connected',
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    };
    console.log('[KnowSphere DB] MongoDB reconnected');
  });
};
