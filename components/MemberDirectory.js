"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function MemberDirectory({ currentMembers, alumniMembers }) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");

  const roles = useMemo(() => {
    const values = [...currentMembers, ...alumniMembers]
      .map((member) => member.role)
      .filter(Boolean);

    return [
      "all",
      ...Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "vi")),
    ];
  }, [alumniMembers, currentMembers]);

  const filteredCurrent = filterMembers(currentMembers, query, role);
  const filteredAlumni = filterMembers(alumniMembers, query, role);
  const total = filteredCurrent.length + filteredAlumni.length;

  return (
    <div>
      <div className="frame mb-10 grid gap-4 p-4 md:grid-cols-[minmax(16rem,1fr)_minmax(0,2fr)] md:items-start">
        <label className="min-w-0">
          <span className="label">Tìm thành viên</span>
          <input
            className="input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nhập tên hoặc vai trò..."
          />
        </label>

        <div className="min-w-0">
          <p className="label">Lọc theo vai trò</p>
          <div className="flex flex-wrap gap-2">
            {roles.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setRole(item)}
                className={`rounded-frame border px-3 py-2 text-sm transition ${
                  role === item
                    ? "border-gold bg-surfaceLight text-gold"
                    : "border-border text-muted hover:border-gold hover:text-gold"
                }`}
              >
                {item === "all" ? "Tất cả" : item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <MemberSection title="Thành viên hiện tại" members={filteredCurrent} />

      {filteredAlumni.length > 0 && (
        <div className="mt-14">
          <MemberSection
            title="Cựu thành viên"
            members={filteredAlumni}
            alumni
          />
        </div>
      )}

      {total === 0 && (
        <p className="frame p-6 text-muted">
          Không tìm thấy thành viên phù hợp.
        </p>
      )}
    </div>
  );
}

function filterMembers(members, query, role) {
  const normalizedQuery = query.trim().toLowerCase();

  return members.filter((member) => {
    const matchesQuery =
      !normalizedQuery ||
      [member.fullName, member.role]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery));
    const matchesRole = role === "all" || member.role === role;
    return matchesQuery && matchesRole;
  });
}

function MemberSection({ title, members, alumni = false }) {
  if (members.length === 0) return null;

  return (
    <section>
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="text-2xl">{title}</h2>
        <p className="plaque-label">{members.length} hồ sơ</p>
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} alumni={alumni} />
        ))}
      </div>
    </section>
  );
}

function MemberCard({ member, alumni }) {
  const joinedAt = new Date(member.joinedAt);

  return (
    <Link
      href={`/members/${member.id}`}
      className="frame p-3 text-center transition hover:border-gold"
      data-reveal
    >
      <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-frame bg-surfaceLight">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={member.fullName}
            fill
            className="object-cover"
            sizes="200px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-3xl text-gold/60">
              {member.fullName?.[0]?.toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <p className="font-display">{member.fullName}</p>
      {member.role && <p className="mt-1 text-xs text-muted">{member.role}</p>}
      <p className="mt-1 text-xs text-muted">
        Gia nhập {joinedAt.toLocaleDateString("vi-VN")}
      </p>
      {alumni && (
        <p className="plaque-label mt-2 !text-[10px]">Cựu thành viên</p>
      )}
    </Link>
  );
}
