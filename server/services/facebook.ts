interface FacebookMessage {
  object: string;
  entry: Array<{
    id: string;
    time: number;
    messaging: Array<{
      sender: { id: string };
      recipient: { id: string };
      timestamp: number;
      message?: {
        mid: string;
        text: string;
      };
      postback?: {
        title: string;
        payload: string;
      };
    }>;
  }>;
}

interface FacebookProfile {
  first_name: string;
  last_name: string;
  profile_pic: string;
  locale: string;
  timezone: number;
  gender: string;
}

export class FacebookService {
  private pageAccessToken: string;
  private verifyToken: string;

  constructor() {
    this.pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN || "";
    this.verifyToken = process.env.FACEBOOK_VERIFY_TOKEN || "your_verify_token_123";
  }

  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    if (mode === "subscribe" && token === this.verifyToken) {
      return challenge;
    }
    return null;
  }

  async sendMessage(recipientId: string, message: string): Promise<void> {
    if (!this.pageAccessToken) {
      console.warn("Facebook Page Access Token not configured");
      return;
    }

    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/me/messages?access_token=${this.pageAccessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text: message },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Facebook API Error:', error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  async sendButtonTemplate(recipientId: string, text: string, buttons: Array<{ type: string; title: string; payload?: string; url?: string }>): Promise<void> {
    if (!this.pageAccessToken) {
      console.warn("Facebook Page Access Token not configured");
      return;
    }

    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/me/messages?access_token=${this.pageAccessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: {
            attachment: {
              type: "template",
              payload: {
                template_type: "button",
                text: text,
                buttons: buttons,
              },
            },
          },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Facebook API Error:', error);
      }
    } catch (error) {
      console.error('Error sending button template:', error);
    }
  }

  async getUserProfile(userId: string): Promise<FacebookProfile | null> {
    if (!this.pageAccessToken) {
      console.warn("Facebook Page Access Token not configured");
      return null;
    }

    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/${userId}?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=${this.pageAccessToken}`);
      
      if (!response.ok) {
        const error = await response.text();
        console.error('Facebook Profile API Error:', error);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  parseWebhookMessage(body: FacebookMessage): Array<{
    senderId: string;
    text?: string;
    postback?: string;
  }> {
    const messages: Array<{ senderId: string; text?: string; postback?: string }> = [];

    if (body.object === 'page') {
      body.entry.forEach(entry => {
        entry.messaging.forEach(messaging => {
          const senderId = messaging.sender.id;
          
          if (messaging.message && messaging.message.text) {
            messages.push({
              senderId,
              text: messaging.message.text,
            });
          }
          
          if (messaging.postback) {
            messages.push({
              senderId,
              postback: messaging.postback.payload,
            });
          }
        });
      });
    }

    return messages;
  }
}

export const facebookService = new FacebookService();
