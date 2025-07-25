import { type User, type InsertUser, type BotUser, type InsertBotUser, type GiftCode, type InsertGiftCode, type BotSettings, type InsertBotSettings } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Bot Users
  getBotUser(facebookId: string): Promise<BotUser | undefined>;
  createBotUser(user: InsertBotUser): Promise<BotUser>;
  getAllBotUsers(): Promise<BotUser[]>;
  deleteBotUser(facebookId: string): Promise<boolean>;
  
  // Gift Codes
  getAvailableCode(): Promise<GiftCode | undefined>;
  addGiftCode(code: InsertGiftCode): Promise<GiftCode>;
  addBulkGiftCodes(codes: InsertGiftCode[]): Promise<GiftCode[]>;
  markCodeAsUsed(code: string, facebookId: string): Promise<boolean>;
  getAllGiftCodes(): Promise<GiftCode[]>;
  deleteGiftCode(code: string): Promise<boolean>;
  getStats(): Promise<{ total: number; used: number; remaining: number; totalUsers: number }>;
  
  // Bot Settings
  getBotSettings(): Promise<BotSettings | undefined>;
  updateBotSettings(settings: InsertBotSettings): Promise<BotSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private botUsers: Map<string, BotUser>;
  private giftCodes: Map<string, GiftCode>;
  private botSettings: BotSettings | undefined;

  constructor() {
    this.users = new Map();
    this.botUsers = new Map();
    this.giftCodes = new Map();
    
    // Initialize default bot settings
    this.botSettings = {
      id: randomUUID(),
      brandName: "GameShop",
      appUrl: "https://test.com",
      welcomeMessage: "🎮 Chào bạn đến với hệ thống hỗ trợ của {BRAND_NAME}\n\n💥 Nhận code quà tặng 10k khi tạo tài khoản và xác thực số điện thoại thành công ( gift chỉ sử dụng được khi xác thực sdt thành công )\n\n👇 Nhấn \"Bắt đầu\" để nhận ngay!",
      autoReply: true,
    };
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getBotUser(facebookId: string): Promise<BotUser | undefined> {
    return this.botUsers.get(facebookId);
  }

  async createBotUser(insertBotUser: InsertBotUser): Promise<BotUser> {
    const id = randomUUID();
    const botUser: BotUser = {
      ...insertBotUser,
      id,
      usedCode: insertBotUser.usedCode || null,
      receivedAt: new Date(),
    };
    this.botUsers.set(insertBotUser.facebookId, botUser);
    return botUser;
  }

  async getAllBotUsers(): Promise<BotUser[]> {
    return Array.from(this.botUsers.values()).sort((a, b) => 
      new Date(b.receivedAt!).getTime() - new Date(a.receivedAt!).getTime()
    );
  }

  async deleteBotUser(facebookId: string): Promise<boolean> {
    return this.botUsers.delete(facebookId);
  }

  async getAvailableCode(): Promise<GiftCode | undefined> {
    return Array.from(this.giftCodes.values()).find(code => !code.isUsed);
  }

  async addGiftCode(insertCode: InsertGiftCode): Promise<GiftCode> {
    const id = randomUUID();
    const giftCode: GiftCode = {
      ...insertCode,
      id,
      isUsed: false,
      usedBy: null,
      usedAt: null,
      createdAt: new Date(),
    };
    this.giftCodes.set(insertCode.code, giftCode);
    return giftCode;
  }

  async addBulkGiftCodes(codes: InsertGiftCode[]): Promise<GiftCode[]> {
    const results: GiftCode[] = [];
    for (const code of codes) {
      if (!this.giftCodes.has(code.code)) {
        results.push(await this.addGiftCode(code));
      }
    }
    return results;
  }

  async markCodeAsUsed(code: string, facebookId: string): Promise<boolean> {
    const giftCode = this.giftCodes.get(code);
    if (giftCode && !giftCode.isUsed) {
      giftCode.isUsed = true;
      giftCode.usedBy = facebookId;
      giftCode.usedAt = new Date();
      return true;
    }
    return false;
  }

  async getAllGiftCodes(): Promise<GiftCode[]> {
    return Array.from(this.giftCodes.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async deleteGiftCode(code: string): Promise<boolean> {
    return this.giftCodes.delete(code);
  }

  async getStats(): Promise<{ total: number; used: number; remaining: number; totalUsers: number }> {
    const codes = Array.from(this.giftCodes.values());
    const total = codes.length;
    const used = codes.filter(code => code.isUsed).length;
    const remaining = total - used;
    const totalUsers = this.botUsers.size;
    
    return { total, used, remaining, totalUsers };
  }

  async getBotSettings(): Promise<BotSettings | undefined> {
    return this.botSettings;
  }

  async updateBotSettings(settings: InsertBotSettings): Promise<BotSettings> {
    if (this.botSettings) {
      this.botSettings = { ...this.botSettings, ...settings };
    } else {
      this.botSettings = { 
        id: randomUUID(), 
        brandName: settings.brandName || "GameShop",
        appUrl: settings.appUrl || "https://test.com",
        welcomeMessage: settings.welcomeMessage || "🎮 Chào bạn đến với hệ thống hỗ trợ của {BRAND_NAME}\n\n💥 Nhận code quà tặng 10k khi tạo tài khoản và xác thực số điện thoại thành công ( gift chỉ sử dụng được khi xác thực sdt thành công )\n\n👇 Nhấn \"Bắt đầu\" để nhận ngay!",
        autoReply: settings.autoReply ?? true
      };
    }
    return this.botSettings!;
  }
}

export const storage = new MemStorage();
