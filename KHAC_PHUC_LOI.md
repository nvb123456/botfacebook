# KHẮC PHỤC LỖI CÀI ĐẶT

## Lỗi: npm install không thành công

### Giải pháp 1: Làm sạch và cài lại
```cmd
npm cache clean --force
del package-lock.json
npm install
```

### Giải pháp 2: Sử dụng yarn thay vì npm
```cmd
npm install -g yarn
yarn install
yarn dev
```

### Giải pháp 3: Cài đặt từng package
```cmd
npm install tsx express wouter
npm install @tanstack/react-query react react-dom
npm install tailwindcss @tailwindcss/vite
npm install drizzle-orm zod
```

### Giải pháp 4: Sử dụng Node.js phiên bản khác
- Tải Node.js LTS (20.x) từ https://nodejs.org
- Gỡ cài đặt Node.js cũ trước khi cài mới

### Giải pháp 5: Chạy với quyền Administrator
- Nhấn chuột phải vào Command Prompt
- Chọn "Run as Administrator"
- Chạy lại các lệnh npm

### Giải pháp 6: Tắt Antivirus tạm thời
- Tắt Windows Defender hoặc antivirus
- Cài đặt lại dependencies
- Bật lại antivirus sau khi hoàn tất

## Chạy bot mà không cần cài đặt đầy đủ

### Tối thiểu cần thiết:
```cmd
npm install tsx express
set NODE_ENV=development && npx tsx server/index.ts
```

### Hoặc sử dụng Node.js thuần:
```cmd
# Chuyển tsx thành js và chạy
npx esbuild server/index.ts --bundle --platform=node --outfile=server.js
node server.js
```

## Kiểm tra lỗi chi tiết

### Xem log lỗi:
```cmd
npm install --verbose
```

### Kiểm tra Node.js version:
```cmd
node --version
npm --version
```

### Yêu cầu tối thiểu:
- Node.js: 18.x hoặc mới hơn
- npm: 8.x hoặc mới hơn
- Windows: 10 hoặc mới hơn