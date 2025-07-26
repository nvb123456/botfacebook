# Hướng Dẫn Sử Dụng Facebook Gift Code Bot

## Mô tả
Chatbot Facebook Messenger tự động gửi mã code quà tặng cho khách hàng. Mỗi người chỉ nhận 1 lần.

## Tính năng chính
- ✅ Chatbot tự động trả lời tin nhắn Facebook
- ✅ Gửi mã code từ file codes.txt  
- ✅ Giao diện quản lý web
- ✅ Theo dõi thống kê người dùng
- ✅ Mỗi Facebook user chỉ nhận 1 lần

## Cài đặt

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Tạo file môi trường
Tạo file `.env` với nội dung:
```
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_access_token_here
FACEBOOK_VERIFY_TOKEN=your_verify_token_123
```

### 3. Chạy ứng dụng

**Trên Windows:**
```bash
# Cách 1: Tự động (khuyến khích)
run.cmd

# Cách 2: Sử dụng file .bat
start-windows.bat

# Cách 3: Manual
npm install
set NODE_ENV=development && npx tsx server/index.ts
```

**Trên Linux/Mac:**
```bash
npm run dev
```

## Triển khai

### Bước 1: Deploy lên server
- Upload code lên server (VPS, Heroku, Replit, v.v.)
- Cài đặt dependencies và chạy

### Bước 2: Setup Facebook Developer

1. **Tạo Facebook App:**
   - Vào https://developers.facebook.com
   - Tạo ứng dụng mới → chọn "Business"      
   - Thêm sản phẩm "Messenger"

2. **Cấu hình Webhook:**
   - Messenger → Settings → Webhooks
   - Callback URL: `https://your-domain.com/api/webhook`
   - Verify Token: `your_verify_token_123`
   - Subscription Fields: `messages`, `messaging_postbacks`

3. **Lấy Page Access Token:**
   - Messenger Settings → Access Tokens
   - Chọn Fanpage của bạn
   - Copy Page Access Token

4. **Subscribe Fanpage:**
   - Subscribe ứng dụng với Fanpage

### Bước 3: Thêm mã code
1. Truy cập giao diện quản lý: `https://your-domain.com`
2. Thêm mã code vào hệ thống
3. Test chatbot bằng cách nhắn "Bắt đầu" vào Fanpage

## Hoạt động của Bot

### Tin nhắn chào:
```
🎮 Chào bạn đến với hệ thống hỗ trợ của [Tên thương hiệu]

💥 Nhận code quà tặng 10k khi tạo tài khoản và xác thực số điện thoại thành công ( gift chỉ sử dụng được khi xác thực sdt thành công )

👇 Nhấn "Bắt đầu" để nhận ngay!
```

### Menu lựa chọn:
- 🎁 Nhận code
- 📲 Tải app

### Khi nhận code:
```
🎉 Chúc mừng [Tên]! Đây là mã code của bạn:

🎁 Mã code: GIFT10K2024

📲 Tải app tại: Test.com

⚠️ Lưu ý: Mỗi người chỉ nhận 1 lần duy nhất!
```

## Quản lý qua Web

Truy cập giao diện quản lý để:
- Xem thống kê (tổng code, đã dùng, còn lại, người dùng)
- Thêm/xóa mã code
- Quản lý danh sách người dùng
- Cập nhật thông điệp bot
- Xem preview tin nhắn bot

## Khắc phục lỗi Windows

**Lỗi: 'NODE_ENV' is not recognized as an internal or external command**

Giải pháp:
1. Sử dụng file `start-windows.bat` đã cung cấp
2. Hoặc chạy: `set NODE_ENV=development && tsx server/index.ts`
3. Cài đặt cross-env: `npm install cross-env` (đã có sẵn)

**Lỗi npm audit**
```bash
npm audit fix
```

## Lưu ý quan trọng

1. **File codes.txt**: Mã code sẽ được lấy từ dòng đầu tiên và xóa sau khi gửi
2. **Mỗi user 1 lần**: Hệ thống lưu Facebook ID để tránh spam
3. **Webhook cần HTTPS**: Facebook yêu cầu webhook phải có SSL
4. **Page Access Token**: Cần quyền `pages_messaging` để gửi tin nhắn

## Hỗ trợ

Nếu có lỗi, kiểm tra:
- File `.env` có đúng token không
- Webhook URL có truy cập được không
- Fanpage đã subscribe ứng dụng chưa
- Có mã code trong hệ thống không
- Trên Windows: Sử dụng start-windows.bat

## Cấu trúc dự án

```
├── client/          # Frontend React
├── server/          # Backend Express
├── shared/          # Schema chung
├── codes.txt        # File chứa mã code
├── package.json     # Dependencies
└── README_HUONG_DAN.md
```