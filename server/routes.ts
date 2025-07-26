import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { facebookService } from "./services/facebook";
import { codeManager } from "./services/codeManager";
import { insertBotUserSchema, insertGiftCodeSchema, insertBotSettingsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Facebook Webhook verification
  app.get("/api/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    const result = facebookService.verifyWebhook(mode as string, token as string, challenge as string);
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(403).send("Forbidden");
    }
  });

  // Facebook Webhook message handler
  app.post("/api/webhook", async (req, res) => {
    try {
      const messages = facebookService.parseWebhookMessage(req.body);
      
      for (const message of messages) {
        await handleMessage(message.senderId, message.text, message.postback);
      }
      
      res.status(200).send("OK");
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Handle incoming messages
  async function handleMessage(senderId: string, text?: string, postback?: string) {
    const settings = await storage.getBotSettings();
    if (!settings?.autoReply) return;

    const existingUser = await storage.getBotUser(senderId);
    
    // Handle "Bắt đầu" or get started
    if (text?.toLowerCase().includes("bắt đầu") || text?.toLowerCase().includes("get started") || postback === "GET_STARTED") {
      // Get user profile
      const profile = await facebookService.getUserProfile(senderId);
      const userName = profile ? `${profile.first_name} ${profile.last_name}` : "Bạn";
      
      // Send welcome message
      const welcomeMessage = settings.welcomeMessage.replace("{BRAND_NAME}", settings.brandName);
      await facebookService.sendMessage(senderId, welcomeMessage);
      
      // Send menu buttons
      await facebookService.sendButtonTemplate(senderId, "Chọn một tùy chọn:", [
        {
          type: "postback",
          title: "🎁 Nhận code",
          payload: "GET_CODE"
        },
        {
          type: "web_url",
          title: "📲 Tải app",
          url: settings.appUrl
        }
      ]);
      
      return;
    }
    
    // Handle "Nhận code" postback
    if (postback === "GET_CODE") {
      if (existingUser) {
        await facebookService.sendMessage(senderId, `⚠️ Bạn đã nhận code rồi!\n\nMã code của bạn: ${existingUser.usedCode}\n\n📲 Tải app tại: ${settings.appUrl}\n\n💡 Mỗi người chỉ nhận 1 lần duy nhất!`);
        return;
      }
      
      // Get available code
      const availableCode = await codeManager.getAndRemoveFirstCode();
      
      if (!availableCode) {
        await facebookService.sendMessage(senderId, "😔 Hiện tại đã hết mã code. Vui lòng thử lại sau!");
        return;
      }
      
      // Get user profile
      const profile = await facebookService.getUserProfile(senderId);
      const userName = profile ? `${profile.first_name} ${profile.last_name}` : "Người dùng";
      
      // Save user and mark code as used
      try {
        await storage.createBotUser({
          facebookId: senderId,
          name: userName,
          usedCode: availableCode,
        });
        
        await storage.addGiftCode({ code: availableCode });
        await storage.markCodeAsUsed(availableCode, senderId);
        
        // Send success message
        await facebookService.sendMessage(senderId, 
          `🎉 Chúc mừng ${userName}! Đây là mã code của bạn:\n\n` +
          `🎁 Mã code: ${availableCode}\n\n` +
          `📲 Tải app tại: ${settings.appUrl}\n\n` +
          `⚠️ Lưu ý: Mỗi người chỉ nhận 1 lần duy nhất!`
        );
        
      } catch (error) {
        console.error("Error saving user:", error);
        await facebookService.sendMessage(senderId, "😔 Có lỗi xảy ra. Vui lòng thử lại sau!");
        // Add code back to file if user creation failed
        await codeManager.addCode(availableCode);
      }
      
      return;
    }
    
    // Default response for other messages
    if (text) {
      await facebookService.sendMessage(senderId, `Chào bạn! 👋\n\nNhắn "Bắt đầu" để nhận mã code quà tặng nhé!`);
    }
  }

  // API Routes for dashboard
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/bot-users", async (req, res) => {
    try {
      const users = await storage.getAllBotUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/bot-users/:facebookId", async (req, res) => {
    try {
      const { facebookId } = req.params;
      const success = await storage.deleteBotUser(facebookId);
      if (success) {
        res.json({ message: "User deleted successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/gift-codes", async (req, res) => {
    try {
      const codes = await codeManager.getAllCodes();
      res.json(codes.map(code => ({ code, isUsed: false })));
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/gift-codes", async (req, res) => {
    try {
      const { code } = insertGiftCodeSchema.parse(req.body);
      const success = await codeManager.addCode(code);
      if (success) {
        res.json({ message: "Code added successfully" });
      } else {
        res.status(400).json({ message: "Code already exists" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.post("/api/gift-codes/bulk", async (req, res) => {
    try {
      const { codes } = z.object({ codes: z.array(z.string()) }).parse(req.body);
      const addedCodes = await codeManager.addBulkCodes(codes);
      res.json({ message: `Added ${addedCodes.length} codes successfully`, addedCodes });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.delete("/api/gift-codes/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const success = await codeManager.removeCode(code);
      if (success) {
        res.json({ message: "Code deleted successfully" });
      } else {
        res.status(404).json({ message: "Code not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/bot-settings", async (req, res) => {
    try {
      const settings = await storage.getBotSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/bot-settings", async (req, res) => {
    try {
      const settings = insertBotSettingsSchema.parse(req.body);
      const updatedSettings = await storage.updateBotSettings(settings);
      res.json(updatedSettings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Download route for project files
  app.get("/download", async (req, res) => {
    try {
      const filePath = "/home/runner/workspace/facebook-gift-bot-final.tar.gz";
      res.download(filePath, "facebook-gift-bot.tar.gz", (err) => {
        if (err) {
          console.error("Download error:", err);
          res.status(500).send("Error downloading file");
        }
      });
    } catch (error) {
      console.error("Download error:", error);
      res.status(500).send("Error downloading file");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
