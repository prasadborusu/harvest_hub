
export interface CropHealthHistoryItem {
  id: string;
  imageUrl: string;
  analysis: {
    disease: string;
    remedy: string;
  };
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CROP_ANALYSIS = 'CROP_ANALYSIS',
  VOICE_ASSISTANT = 'VOICE_ASSISTANT',
  FERTILIZER_STORE = 'FERTILIZER_STORE',
  MANAGE_LISTINGS = 'MANAGE_LISTINGS',
  SELL_PRODUCE = 'SELL_PRODUCE',
  BROWSE_PRODUCE = 'BROWSE_PRODUCE',
}

export enum UserRole {
  FARMER = 'FARMER',
  BUYER = 'BUYER',
  SELLER = 'SELLER', // Fertilizer Seller
}

export enum LanguageCode {
  ENGLISH = 'en-US',
  HINDI = 'hi-IN',
  TELUGU = 'te-IN',
  MALAYALAM = 'ml-IN',
}

export interface User {
  username: string;
  role: UserRole;
  displayName: string;
}

export interface ProductListing {
  id: string;
  name: string;
  quantity: string;
  price: number;
  imageUrl: string;
  description: string;
}

export interface Fertilizer {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}