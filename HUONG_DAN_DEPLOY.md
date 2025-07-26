# FACEBOOK GIFT CODE BOT - HƯỚNG DẪN SỬ DỤNG

## Mô tả
Chatbot Facebook Messenger tự động gửi mã code quà tặng cho khách hàng. Mỗi người chỉ nhận 1 lần.

## Tính năng
✅ Chatbot tự động trả lời tin nhắn Facebook  
✅ Gửi mã code từ file codes.txt  
✅ Giao diện quản lý web  
✅ Theo dõi thống kê người dùng  
✅ Mỗi Facebook user chỉ nhận 1 lần  

## Triển khai trên Replit

### Bước 1: Deploy
1. Nhấn nút **"Deploy"** ở đầu trang Replit
2. Chọn **"Autoscale"** hoặc **"Reserved VM"** 
3. Đợi quá trình deploy hoàn tất (2-3 phút)
4. Bạn sẽ có URL như: `https://your-app-name.replit.app`

### Bước 2: Thêm API Keys
1. Vào **Secrets** tab trong Replit
2. Thêm 2 keys:
   - `FACEBOOK_PAGE_ACCESS_TOKEN`: Token từ Facebook Developer
   - `FACEBOOK_VERIFY_TOKEN`: Chuỗi bất kỳ (VD: "your_verify_token")

### Bước 3: Setup Facebook Developer App

#### 3.1 Tạo Facebook App:
1. Vào https://developers.facebook.com
2. **"My Apps"** → **"Create App"** → **"Business"**
3. Đặt tên app và email

#### 3.2 Thêm Messenger:
1. **"Add Product"** → **"Messenger"**
2. Vào **"Settings"** → **"Webhooks"**

#### 3.3 Cấu hình Webhook:
- **Callback URL**: `https://your-app-name.replit.app/api/webhook`
- **Verify Token**: `my_verify_token_123` (giống trong Secrets)
- **Subscription Fields**: Tick `messages` và `messaging_postbacks`
- Nhấn **"Verify and Save"**

#### 3.4 Lấy Page Access Token:
1. Vào **"Messenger"** → **"Settings"** → **"Access Tokens"**
2. Chọn Fanpage của bạn
3. **"Generate Token"** → Copy token
4. Paste vào Secrets của Replit với key `FACEBOOK_PAGE_ACCESS_TOKEN`

#### 3.5 Subscribe Fanpage:
1. Trong phần **"Webhooks"**
2. Chọn **"Subscribe to Events"** cho Fanpage của bạn

### Bước 4: Test Chatbot
1. Vào Fanpage Facebook của bạn
2. Nhắn tin: **"Bắt đầu"**
3. Bot sẽ gửi menu và bạn có thể nhận mã code

### Bước 5: Quản lý Bot
- Truy cập: `https://your-app-name.replit.app` 
- Thêm mã code vào hệ thống
- Xem thống kê người dùng
- Cập nhật tin nhắn bot

## Lưu ý quan trọng:
✅ Bot chỉ hoạt động với HTTPS (Replit tự động có SSL)
✅ Webhook URL phải accessible từ internet
✅ Page Access Token cần quyền `pages_messaging`
✅ Fanpage phải được approve để gửi tin nhắn công khai

## Khắc phục lỗi thường gặp:
- **Webhook verification failed**: Kiểm tra Verify Token
- **Bot không trả lời**: Kiểm tra Page Access Token
- **Không nhận được tin nhắn**: Kiểm tra subscription events