import express from 'express';

// Extend the Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any; // Use a more specific type if possible
    }
  }
}