import { siteConfig } from "@/lib/siteConfig";

export const metadata = {
  title: "Liên hệ",
  description: `Kết nối với ${siteConfig.fullName}.`,
};

export default function ContactPage() {
  const { contact } = siteConfig;

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="plaque-label mb-3">Liên hệ</p>
      <h1 className="mb-5 text-3xl">Kết nối với {siteConfig.shortName}</h1>
      <p className="mb-10 max-w-2xl text-muted">
        Bạn có thể theo dõi hoạt động, gửi lời nhắn hoặc liên hệ về tuyển thành
        viên qua các kênh chính thức của câu lạc bộ.
      </p>

      <div className="grid gap-4">
        <ContactRow label="Email" value={contact.email || "Đang cập nhật"} />
        <ContactRow
          label="Facebook"
          value={
            contact.facebookUrl ? (
              <a
                href={contact.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="text-gold underline"
              >
                {contact.facebookLabel}
              </a>
            ) : (
              "Đang cập nhật"
            )
          }
        />
        <ContactRow label="Địa điểm sinh hoạt" value={contact.meetingAddress} />
      </div>

      <div className="frame mt-8 p-6">
        <p className="plaque-label mb-2">Ghi chú</p>
        <p className="text-sm leading-6 text-muted">{contact.note}</p>
      </div>
    </div>
  );
}

function ContactRow({ label, value }) {
  return (
    <div className="frame flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
      <span className="plaque-label">{label}</span>
      <span className="text-cream">{value}</span>
    </div>
  );
}
