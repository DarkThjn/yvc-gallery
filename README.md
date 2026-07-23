# CLB Gallery — Website câu lạc bộ

Website "phòng trưng bày" cho câu lạc bộ: banner sinh nhật tự động, gallery ảnh,
quản lý thành viên/sự kiện/bài viết/tuyển thành viên qua trang admin riêng.

Hướng dẫn này giả định bạn **chưa quen dùng terminal** — làm theo đúng thứ tự,
copy nguyên dòng lệnh là chạy được.

---

## 0. Chuẩn bị công cụ (chỉ làm 1 lần)

1. Cài **Node.js** (bản LTS, khuyên dùng 20.x): https://nodejs.org — tải về, cài như phần mềm bình thường.
2. Cài **Git**: https://git-scm.com/downloads
3. Cài **VS Code** (trình soạn thảo code): https://code.visualstudio.com
4. Tạo tài khoản (nếu chưa có, đều miễn phí):
   - GitHub: https://github.com/signup
   - Vercel: https://vercel.com/signup (nên chọn "Continue with GitHub" để 2 tài khoản liên kết sẵn)

Kiểm tra cài đặt thành công: mở terminal (Windows: gõ "cmd" hoặc "PowerShell" trong Start Menu;
Mac: mở app "Terminal"), gõ:

```bash
node -v
git --version
```

Nếu hiện ra số phiên bản (vd `v20.11.0`) là đã cài đúng.

---

## 1. Mở project trong VS Code

Giải nén file zip mình gửi, mở thư mục `club-gallery` bằng VS Code
(File > Open Folder...). Mở Terminal trong VS Code: menu **Terminal > New Terminal**.

Từ giờ, mọi lệnh bên dưới đều gõ vào ô terminal này.

---

## 2. Cài các thư viện cần thiết

```bash
npm install
```

Chờ 1-2 phút để tải xong. Nếu có dòng màu đỏ "error" (không phải "warning") thì
chụp màn hình gửi lại để được hỗ trợ.

---

## 3. Tạo database (Postgres miễn phí)

Bạn có thể dùng **Neon** (khuyên dùng, dễ setup độc lập) hoặc **Vercel Postgres**
(tích hợp sẵn trong Vercel). Hướng dẫn dùng Neon:

1. Vào https://neon.tech, đăng ký (có thể dùng tài khoản GitHub).
2. Tạo project mới, đặt tên tuỳ ý (vd `clb-gallery`).
3. Sau khi tạo xong, vào **Dashboard > Connection Details**:
   - Copy connection string dạng **Pooled connection** → đây sẽ là `DATABASE_URL`
   - Bật toggle "Show password" nếu cần thấy đủ chuỗi
   - Copy thêm **Direct connection** (không pooled) → đây sẽ là `DIRECT_URL`

*(Nếu dùng Vercel Postgres thay vì Neon: trong Vercel Dashboard > Storage > Create
Database > Postgres, sau khi tạo xong vào tab `.env.local` để copy 2 giá trị tương ứng.)*

---

## 4. Tạo kho lưu ảnh (Vercel Blob)

1. Vào https://vercel.com/dashboard > **Storage** > **Create Database** > chọn **Blob**.
2. Đặt tên, tạo xong bấm vào database vừa tạo > tab **.env.local** > copy giá trị
   `BLOB_READ_WRITE_TOKEN`.

*(Bạn cần đã có 1 project trên Vercel để tạo Blob — nếu chưa có, cứ tạo tạm 1 project
trống, hoặc quay lại bước này sau khi làm xong bước 6.)*

---

## 5. Cấu hình biến môi trường

Trong VS Code, copy file `.env.example` thành file mới tên `.env` (cùng thư mục gốc).
Điền các giá trị đã lấy ở bước 3, 4:

```env
DATABASE_URL="..."      # từ bước 3
DIRECT_URL="..."        # từ bước 3
NEXTAUTH_SECRET="..."   # xem cách tạo bên dưới
NEXTAUTH_URL="http://localhost:3000"
BLOB_READ_WRITE_TOKEN="..."  # từ bước 4
SEED_ADMIN_EMAIL="admin@club.local"
SEED_ADMIN_PASSWORD="chon-mat-khau-manh-o-day"
SEED_ADMIN_NAME="Tên bạn"
```

Để tạo `NEXTAUTH_SECRET`, chạy lệnh sau trong terminal và dán kết quả vào:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 6. Khởi tạo database và tài khoản admin

```bash
npx prisma migrate dev --name init
npm run seed
```

Lệnh đầu tạo các bảng dữ liệu trong Postgres. Lệnh sau tạo tài khoản admin đầu tiên
(email/mật khẩu lấy từ `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` trong `.env`).

---

## 7. Chạy thử trên máy

```bash
npm run dev
```

Mở trình duyệt vào http://localhost:3000 — trang chủ hiện ra là thành công.
Vào http://localhost:3000/admin đăng nhập bằng email/mật khẩu ở bước 6, thêm vài
thành viên (nhớ điền đúng ngày sinh) để thấy banner sinh nhật hoạt động.

Dừng server bằng tổ hợp phím `Ctrl + C` trong terminal khi cần.

---

## 8. Đưa code lên GitHub

Tạo repo mới tại https://github.com/new (đặt tên vd `club-gallery`, để **Private**
nếu muốn, **không** tick "Add README" vì mình đã có sẵn).

Trong terminal (thư mục project):

```bash
git init
git add .
git commit -m "Khởi tạo website câu lạc bộ"
git branch -M main
git remote add origin https://github.com/TEN-TAI-KHOAN-CUA-BAN/club-gallery.git
git push -u origin main
```

Thay `TEN-TAI-KHOAN-CUA-BAN` bằng username GitHub thật của bạn (Git sẽ hỏi đăng
nhập ở lần push đầu — làm theo hướng dẫn trên màn hình, thường là mở trình duyệt xác nhận).

> File `.env` đã được `.gitignore` loại trừ sẵn — mật khẩu của bạn **sẽ không** bị đưa lên GitHub.

---

## 9. Deploy lên Vercel

1. Vào https://vercel.com/new, chọn **Import** repo `club-gallery` vừa tạo.
2. Ở bước cấu hình, mở phần **Environment Variables**, thêm đủ các biến giống hệt
   file `.env` của bạn (`DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_SECRET`,
   `NEXTAUTH_URL`, `BLOB_READ_WRITE_TOKEN`).
   - Riêng `NEXTAUTH_URL`: tạm thời điền `https://ten-project-cua-ban.vercel.app`
     (Vercel cho xem trước tên miền ở màn hình này).
3. Bấm **Deploy**, chờ 2-3 phút.
4. Sau khi deploy xong, vào project > **Settings > Environment Variables**, sửa lại
   `NEXTAUTH_URL` cho khớp đúng domain thật (hoặc domain riêng nếu đã gắn ở bước 10),
   rồi vào tab **Deployments**, bấm **Redeploy** ở bản mới nhất để áp dụng.

Từ giờ, mỗi lần bạn `git push` code mới lên GitHub, Vercel sẽ **tự động deploy lại**.

---

## 10. Gắn tên miền riêng đã mua

1. Trong project trên Vercel > **Settings > Domains** > nhập tên miền của bạn > **Add**.
2. Vercel sẽ hiện ra 1-2 bản ghi DNS cần thêm (thường là `A` record hoặc `CNAME`).
3. Vào trang quản lý tên miền (nơi bạn mua — Namecheap, GoDaddy, PA Vietnam...), vào
   phần **DNS Management**, thêm đúng bản ghi Vercel yêu cầu.
4. Chờ 5 phút - vài giờ để DNS cập nhật. Vercel tự cấp HTTPS miễn phí.
5. Nhớ cập nhật lại `NEXTAUTH_URL` trong Environment Variables thành domain mới, rồi Redeploy.

---

## Sử dụng hằng ngày

- Trang quản trị: `https://domain-cua-ban.com/admin`
- Thêm thành viên mới: **Thành viên > + Thêm thành viên**, nhớ điền đúng ngày sinh —
  banner trang chủ sẽ tự nhận diện, không cần chỉnh gì thêm.
- Banner sinh nhật **không cần cron job hay thao tác thủ công**: mỗi lần có người
  vào trang chủ, hệ thống tự tính lại "hôm nay là sinh nhật ai" dựa trên dữ liệu
  thành viên hiện có.
- Thêm ảnh: **Gallery > + Thêm album** → vào album vừa tạo để upload ảnh.

## Xử lý sự cố thường gặp

| Lỗi | Cách xử lý |
|---|---|
| `npm install` báo lỗi đỏ | Kiểm tra đã cài đúng Node.js bản 18+ chưa (`node -v`) |
| Trang admin không đăng nhập được | Kiểm tra lại đã chạy `npm run seed` chưa, và `.env` đúng `SEED_ADMIN_EMAIL/PASSWORD` |
| Deploy Vercel lỗi build | Vào tab **Deployments > (bản lỗi) > View Function Logs** đọc dòng lỗi, thường do thiếu Environment Variable |
| Upload ảnh báo lỗi | Kiểm tra `BLOB_READ_WRITE_TOKEN` đã điền đúng trong cả `.env` (local) và Vercel Environment Variables (production) |
| Banner sinh nhật không đổi | Kiểm tra ngày sinh nhập trong trang admin đúng ngày/tháng chưa (năm không ảnh hưởng) |

Gặp lỗi khác cứ chụp màn hình + copy nội dung lỗi, quay lại hỏi mình.
