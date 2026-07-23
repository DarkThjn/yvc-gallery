import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-5 py-28 text-center">
      <p className="plaque-label mb-3">Không tìm thấy</p>
      <h1 className="text-3xl mb-4">Bức tranh này không có ở đây</h1>
      <p className="text-muted mb-8">Trang bạn tìm không tồn tại hoặc đã được gỡ khỏi phòng trưng bày.</p>
      <Link href="/" className="btn-gold">Về trang chủ</Link>
    </div>
  );
}
