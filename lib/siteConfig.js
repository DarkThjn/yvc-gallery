const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

const siteUrl = rawSiteUrl.replace(/\/$/, "");

export const siteConfig = {
  name: "YVC Gallery",
  fullName: "Câu lạc bộ Văn nghệ Yên Phong số 1",
  shortName: "YVC",
  url: siteUrl,
  since: "2018",
  description:
    "Phòng trưng bày album, sự kiện, tin tức và những dấu mốc đáng nhớ của Câu lạc bộ Văn nghệ Yên Phong số 1.",
  keywords: [
    "YVC",
    "Câu lạc bộ Văn nghệ Yên Phong số 1",
    "CLB Văn nghệ",
    "Yên Phong",
    "gallery câu lạc bộ",
    "album hoạt động",
  ],
  contact: {
    email: "clbvannghethptyp1@gmail.com",
    facebookUrl: "https://www.facebook.com/clbvannghethptyp1",
    facebookLabel: "Facebook YVC",
    meetingAddress: "Yên Phong, Bắc Ninh",
    note: "CLB ưu tiên phản hồi qua email và fanpage chính thức. Các thông tin sinh hoạt cụ thể sẽ được cập nhật theo từng đợt hoạt động.",
  },
  navigation: [
    { href: "/gallery", label: "Phòng trưng bày" },
    { href: "/members", label: "Thành viên" },
    { href: "/events", label: "Sự kiện" },
    { href: "/blog", label: "Tin tức" },
    { href: "/recruitment", label: "Tuyển thành viên" },
    { href: "/about", label: "Giới thiệu" },
    { href: "/contact", label: "Liên hệ" },
  ],
};

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
