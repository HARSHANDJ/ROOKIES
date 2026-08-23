"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.getDbStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
let dbStatus = {
    isConnected: false,
    state: 'disconnected',
};
const getDbStatus = () => dbStatus;
exports.getDbStatus = getDbStatus;
const connectDB = async () => {
    try {
        mongoose_1.default.set('strictQuery', true);
        // Add connection options
        const conn = await mongoose_1.default.connect(env_1.config.mongoUri, {
            serverSelectionTimeoutMS: 5000,
        });
        dbStatus = {
            isConnected: true,
            state: 'connected',
            host: conn.connection.host,
            name: conn.connection.name,
        };
        console.log(`[KnowSphere DB] MongoDB Connected: ${conn.connection.host} / Database: ${conn.connection.name}`);
    }
    catch (err) {
        dbStatus = {
            isConnected: false,
            state: 'error',
            error: err.message || 'Failed to connect to MongoDB',
        };
        console.warn(`[KnowSphere DB Warning] MongoDB Connection Failed: ${err.message}`);
        console.warn(`[KnowSphere DB Warning] Application running in fallback mode without active DB persistence.`);
    }
    mongoose_1.default.connection.on('disconnected', () => {
        dbStatus = {
            isConnected: false,
            state: 'disconnected',
        };
        console.log('[KnowSphere DB] MongoDB disconnected');
    });
    mongoose_1.default.connection.on('reconnected', () => {
        dbStatus = {
            isConnected: true,
            state: 'connected',
            host: mongoose_1.default.connection.host,
            name: mongoose_1.default.connection.name,
        };
        console.log('[KnowSphere DB] MongoDB reconnected');
    });
};
exports.connectDB = connectDB;
