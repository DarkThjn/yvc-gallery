# Pre-Deploy Checklist

## Domain

- Mua domain và bật WHOIS Protect nếu miễn phí hoặc giá hợp lý.
- Không cần mua hosting riêng từ nhà bán domain.
- Sau khi deploy, trỏ DNS domain về Vercel theo hướng dẫn trong mục Domains của Vercel.

## Environment Variables

Thiết lập các biến này trong Vercel Project Settings > Environment Variables:

```env
DATABASE_URL="..."
DIRECT_URL="..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://domain-that-cua-ban"
NEXT_PUBLIC_SITE_URL="https://domain-that-cua-ban"
BLOB_READ_WRITE_TOKEN="..."
RECRUITMENT_NOTIFY_WEBHOOK_URL=""
```

Gợi ý tạo `NEXTAUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Database

- Chạy `npx prisma db push` ở local sau khi đổi schema.
- Khi deploy production lần đầu, bảo đảm database production đã có schema mới.
- Sau khi có dữ liệu thật, nên export/backup database định kỳ.

## Content

- Cập nhật email, Facebook và địa điểm sinh hoạt trong `lib/siteConfig.js`.
- Thay `public/home-background.jpg` bằng ảnh nền chính thức nếu muốn.
- Kiểm tra lại trang Giới thiệu và Liên hệ trước khi public rộng rãi.

## Final Checks

- Chạy `npm run build`.
- Test trang chủ, gallery album, members, recruitment form và admin login.
- Mở `/robots.txt`, `/sitemap.xml`, `/og.png` để kiểm tra SEO/share preview hoạt động.
- Sau khi gắn domain, cập nhật `NEXTAUTH_URL` và `NEXT_PUBLIC_SITE_URL`, rồi redeploy.
