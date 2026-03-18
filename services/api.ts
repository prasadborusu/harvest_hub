import { User, UserRole, CropHealthHistoryItem, ProductListing, Fertilizer } from '../types';

// This interface is used internally to include the password in the mock user database
interface StoredUser extends User {
  password?: string;
}

// --- MOCK API SERVICE ---
// This file simulates a backend API by using localStorage.
// It's structured to handle multiple users and a session, similar to a real backend.
// It includes an in-memory cache to improve performance by reducing storage lookups.

const MOCK_LATENCY = 300; // ms
const USERS_DB_KEY = 'agri-ai-users';
const SESSION_KEY = 'agri-ai-session';
const CROP_HISTORY_KEY = 'cropHealthHistory';
const PRODUCT_LISTINGS_KEY = 'product-listings';
const FERTILIZER_LISTINGS_KEY = 'fertilizer-listings';

// Simple in-memory cache to reduce redundant localStorage reads
const cache = new Map<string, any>();

const getCapitalizedName = (email: string): string => {
  const namePart = email.split('@')[0];
  return namePart
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

const initializeMockData = () => {
    const usersStr = localStorage.getItem(USERS_DB_KEY);
    if (!usersStr || Object.keys(JSON.parse(usersStr)).length === 0) {
        const mockUsers: Record<string, StoredUser> = {
            'narasimharajuaraaaveeti@gmail.com': {
                email: 'narasimharajuaraaaveeti@gmail.com',
                role: UserRole.FARMER,
                verified: true,
                displayName: 'Farmer One',
                authMethod: 'email',
                password: '123456',
            },
            'farmer2@example.com': {
                email: 'farmer2@example.com',
                role: UserRole.FARMER,
                verified: true,
                displayName: 'Farmer Two',
                authMethod: 'email',
                password: '1234567',
            },
            'buyer1@example.com': {
                email: 'buyer1@example.com',
                role: UserRole.BUYER,
                verified: true,
                displayName: 'Buyer One',
                authMethod: 'email',
                password: '123456',
            },
            'buyer2@example.com': {
                email: 'buyer2@example.com',
                role: UserRole.BUYER,
                verified: true,
                displayName: 'Buyer Two',
                authMethod: 'email',
                password: '1234567',
            },
            'seller1@example.com': {
                email: 'seller1@example.com',
                role: UserRole.SELLER,
                verified: true,
                displayName: 'Seller One',
                authMethod: 'email',
                password: '123456',
            },
            'seller2@example.com': {
                email: 'seller2@example.com',
                role: UserRole.SELLER,
                verified: true,
                displayName: 'Seller Two',
                authMethod: 'email',
                password: '1234567',
            },
            'demo@demo.com': {
              email: 'demo@demo.com',
              role: UserRole.FARMER,
              verified: true,
              displayName: 'Demo User',
              authMethod: 'email',
              password: 'demo',
            },
        };
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(mockUsers));
        cache.delete(USERS_DB_KEY);
        console.log('Mock user data has been initialized.');
    }
};

// Initialize the mock database with default users on first load
initializeMockData();

export const api = {
  // --- Internal Helper Methods ---
  async getUsers(): Promise<Record<string, StoredUser>> {
    if (cache.has(USERS_DB_KEY)) {
      return cache.get(USERS_DB_KEY);
    }
    await new Promise(resolve => setTimeout(resolve, 50));
    const usersStr = localStorage.getItem(USERS_DB_KEY);
    const users = usersStr ? JSON.parse(usersStr) : {};
    cache.set(USERS_DB_KEY, users);
    return users;
  },

  async saveUsers(users: Record<string, StoredUser>): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 50));
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    cache.set(USERS_DB_KEY, users); // Update cache
  },

  // --- User Authentication ---
  async signup(email: string, password: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY));
    const users = await this.getUsers();
    if (users[email]) {
      if (users[email].authMethod === 'google') {
        throw new Error('This email is registered with Google. Please use "Sign in with Google".');
      }
      throw new Error('An account with this email already exists. Please sign in.');
    }
    users[email] = { email, verified: false, authMethod: 'email', password };
    await this.saveUsers(users);
    console.log(`(Simulation) Verification email sent to ${email}.`);
  },

  async login(email: string, password: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY));
    const users = await this.getUsers();
    const user = users[email];
    if (!user) {
      throw new Error('No account found with this email.');
    }
    if (user.authMethod === 'google') {
      throw new Error('This account was created with Google. Please use "Sign in with Google".');
    }
    if (!user.verified) {
      throw new Error('Please verify your email before signing in.');
    }
    if (user.password !== password) {
        throw new Error('Incorrect password.');
    }
    localStorage.setItem(SESSION_KEY, email);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userToReturn } = user;
    return userToReturn;
  },

  async loginWithGoogle(email?: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY));
    const users = await this.getUsers();
    const googleEmail = email || window.prompt("To simulate Google Sign-In, please enter your email address:") || '';
    if (!googleEmail) {
      throw new Error('Email is required for Google sign-in.');
    }
    let user = users[googleEmail];
    if (user && user.authMethod === 'email') {
      throw new Error('This account was created with an email and password. Please sign in normally.');
    }
    if (!user) {
      user = {
        email: googleEmail,
        verified: true,
        authMethod: 'google',
        displayName: getCapitalizedName(googleEmail),
      };
      users[googleEmail] = user;
      await this.saveUsers(users);
    }
    localStorage.setItem(SESSION_KEY, googleEmail);
    return user;
  },
  
  async verifyUser(email: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY));
    const users = await this.getUsers();
    const user = users[email];
    if (user && user.authMethod === 'email') {
        user.verified = true;
        await this.saveUsers(users);
    } else {
        throw new Error('Could not find a standard account to verify for this email.');
    }
  },

  async checkSession(): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY));
    const sessionEmail = localStorage.getItem(SESSION_KEY);
    if (!sessionEmail) {
      return null;
    }
    const users = await this.getUsers();
    const user = users[sessionEmail];
    return user || null;
  },
  
  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY));
    localStorage.removeItem(SESSION_KEY);
  },

  async selectRole(email: string, role: UserRole): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY));
    const users = await this.getUsers();
    const user = users[email];
    if (!user) {
        throw new Error("Could not find user to update role.");
    }
    user.role = role;
    await this.saveUsers(users);
    return user;
  },
  
  // --- Crop Health History ---
  async getCropHealthHistory(): Promise<CropHealthHistoryItem[]> {
    if (cache.has(CROP_HISTORY_KEY)) {
        return cache.get(CROP_HISTORY_KEY);
    }
    await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY));
    const storedHistory = localStorage.getItem(CROP_HISTORY_KEY);
    const history = storedHistory ? JSON.parse(storedHistory) : [];
    cache.set(CROP_HISTORY_KEY, history);
    return history;
  },
  
  async saveCropHealthHistory(newItem: CropHealthHistoryItem): Promise<CropHealthHistoryItem[]> {
    await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY));
    const history = await this.getCropHealthHistory();
    const updatedHistory = [newItem, ...history].slice(0, 10);
    localStorage.setItem(CROP_HISTORY_KEY, JSON.stringify(updatedHistory));
    cache.set(CROP_HISTORY_KEY, updatedHistory);
    return updatedHistory;
  },

  // --- Product Listings (Farmer's Produce) ---
  async getProductListings(): Promise<ProductListing[]> {
    if (cache.has(PRODUCT_LISTINGS_KEY)) {
        return cache.get(PRODUCT_LISTINGS_KEY);
    }
    await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY));
    const storedListings = localStorage.getItem(PRODUCT_LISTINGS_KEY);
    const listings = storedListings ? JSON.parse(storedListings) : [];
    cache.set(PRODUCT_LISTINGS_KEY, listings);
    return listings;
  },

  async saveProductListings(listings: ProductListing[]): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY));
    localStorage.setItem(PRODUCT_LISTINGS_KEY, JSON.stringify(listings));
    cache.set(PRODUCT_LISTINGS_KEY, listings);
  },
  
  // --- Fertilizer Listings (Seller's Products) ---
  async getFertilizerListings(): Promise<Fertilizer[]> {
    if (cache.has(FERTILIZER_LISTINGS_KEY)) {
        return cache.get(FERTILIZER_LISTINGS_KEY);
    }
    await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY));
    const storedListings = localStorage.getItem(FERTILIZER_LISTINGS_KEY);
    let listings = storedListings ? JSON.parse(storedListings) : [];
    // Populate with mock data if empty
    if (listings.length === 0) {
        listings = [
            { id: 'fer-1', name: 'Nitrogen-Rich Growth Booster', description: 'Promotes lush leaf growth and vibrant color. Ideal for leafy greens and young plants.', price: 550, imageUrl: 'https://i.ibb.co/6yK2Pz5/fertilizer1.jpg' },
            { id: 'fer-2', name: 'Fungicide Shield', description: 'Effective against common fungal infections like blight and mildew. Protects plant health.', price: 720, imageUrl: 'https://i.ibb.co/k2S1T9p/fertilizer2.jpg' },
            { id: 'fer-3', name: 'Organic Compost Mix', description: 'Enriches soil with essential nutrients, improving texture and water retention. 100% organic.', price: 400, imageUrl: 'https://i.ibb.co/gZ7Bw0z/fertilizer3.jpg' }
        ];
        localStorage.setItem(FERTILIZER_LISTINGS_KEY, JSON.stringify(listings));
    }
    cache.set(FERTILIZER_LISTINGS_KEY, listings);
    return listings;
  },

  async saveFertilizerListings(listings: Fertilizer[]): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY));
    localStorage.setItem(FERTILIZER_LISTINGS_KEY, JSON.stringify(listings));
    cache.set(FERTILIZER_LISTINGS_KEY, listings);
  }
};
