# CÁCH SỬ DỤNG BOT FACEBOOK ĐỠN GIẢN

## 🎯 Mục đích
Bot tự động gửi mã code quà tặng cho khách hàng nhắn tin vào Fanpage Facebook. Mỗi người chỉ nhận 1 lần.

## ⚡ Cách Hoạt Động Đơn Giản

### 1. Khách hàng nhắn tin vào Fanpage:
```
Khách: "Xin chào" hoặc "Bắt đầu"
```

### 2. Bot tự động trả lời:
```
Bot: "Xin chào! 👋 Chào mừng bạn!
Hãy chọn:
[Nhận code] [Tải app]"
```

### 3. Khách nhấn "Nhận code":
```
Bot: "Mã code của bạn: GIFT10K001 🎁
Chúc bạn mua sắm vui vẻ!"
```

### 4. Nếu đã nhận rồi:
```
Bot: "Bạn đã nhận mã code rồi! 
Mỗi người chỉ nhận 1 lần thôi nhé!"
```

## 🔧 Để Bot Hoạt Động:

### Bước 1: Thêm API Keys vào Replit
1. Vào tab **"Secrets"** trong Replit  
2. Thêm 2 secrets:
   - `FACEBOOK_PAGE_ACCESS_TOKEN`: [Token từ Facebook]
   - `FACEBOOK_VERIFY_TOKEN`: `your_verify_token`

### Bước 2: Deploy trên Replit
1. Nhấn nút **"Deploy"** 
2. Lấy URL: `https://your-app.replit.app`

### Bước 3: Kết nối Facebook
1. Vào Facebook Developer Console
2. Tạo app → Thêm Messenger
3. Webhook URL: `https://your-app.replit.app/api/webhook`
4. Subscribe fanpage

## 📱 Quản Lý Bot:
- Vào `https://your-app.replit.app` để quản lý
- Thêm/xóa mã code
- Xem thống kê người dùng
- Thay đổi tin nhắn bot

## 📝 File Quan Trọng:
- `codes.txt` - Danh sách mã code
- Giao diện web để quản lý
- Bot tự động lưu người đã nhận

## ✅ Lợi Ích:
- Hoạt động 24/7 tự động
- Không cần phải trả lời tin nhắn
- Mỗi người chỉ nhận 1 lần
- Theo dõi được thống kê