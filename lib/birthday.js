import { prisma } from "./prisma";

/**
 * Trả về dữ liệu cho banner sinh nhật trang chủ.
 *
 * Logic:
 * 1. Lấy ngày hôm nay (theo giờ Việt Nam, UTC+7) -> so khớp tháng + ngày (bỏ qua năm)
 *    với birthDate của từng member.
 * 2. Nếu có member trùng ngày hôm nay -> mode "today", trả về danh sách member đó
 *    (banner cá nhân hoá, có thể nhiều người cùng ngày).
 * 3. Nếu không có ai -> mode "month", trả về toàn bộ member có sinh nhật trong
 *    tháng hiện tại, sắp xếp theo ngày tăng dần.
 */
export async function getBirthdayBannerData() {
  const now = getVietnamNow();
  const todayMonth = now.getMonth() + 1;
  const todayDate = now.getDate();

  const activeMembers = await prisma.member.findMany({
    where: { isActive: true },
    select: {
      id: true,
      fullName: true,
      role: true,
      photoUrl: true,
      birthDate: true
    }
  });

  const withParts = activeMembers.map((m) => {
    const d = new Date(m.birthDate);
    return { ...m, _month: d.getUTCMonth() + 1, _day: d.getUTCDate() };
  });

  const todayMembers = withParts.filter(
    (m) => m._month === todayMonth && m._day === todayDate
  );

  if (todayMembers.length > 0) {
    return {
      mode: "today",
      date: now.toISOString(),
      members: todayMembers.map(stripParts)
    };
  }

  const monthMembers = withParts
    .filter((m) => m._month === todayMonth)
    .sort((a, b) => a._day - b._day)
    .map((m) => ({ ...stripParts(m), day: m._day }));

  return {
    mode: "month",
    date: now.toISOString(),
    monthLabel: todayMonth,
    members: monthMembers
  };
}

function stripParts({ _month, _day, ...rest }) {
  return rest;
}

// Vercel chạy server ở UTC theo mặc định; quy đổi sang giờ VN (UTC+7)
// để "hôm nay" luôn đúng theo giờ địa phương của CLB.
function getVietnamNow() {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcMs + 7 * 60 * 60 * 1000);
}
