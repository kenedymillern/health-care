import { ObjectId } from 'mongodb';

export interface Service {
  _id?: ObjectId;
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Career {
  _id?: ObjectId;
  fullName: string;
  email: string;
  phoneNumber: string;
  position: string;
  resume: string; // URL or path to the uploaded resume file
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Contact {
  _id?: ObjectId;
  name: string;
  email: string;
  phoneNumber?: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Review {
  _id?: ObjectId;
  name: string;
  rating: number; // Rating from 1 to 5
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FAQ {
  _id?: ObjectId;
  question: string;
  answer: string;
  createdAt?: Date;
  updatedAt?: Date;
}