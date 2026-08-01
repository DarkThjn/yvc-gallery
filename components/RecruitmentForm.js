"use client";

import { useState } from "react";
import { RECRUITMENT_DEPARTMENTS } from "@/lib/recruitmentDepartments";

export default function RecruitmentForm() {
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    studentInfo: "",
    birthDate: "",
    departments: [],
    reason: "",
  });

  function update(field) {
    return (event) =>
      setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  function toggleDepartment(department) {
    setForm((current) => ({
      ...current,
      departments: current.departments.includes(department)
        ? current.departments.filter((item) => item !== department)
        : [...current.departments, department],
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (form.departments.length === 0) {
      setError("Vui lòng chọn ít nhất một phòng ban.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/recruitment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Có lỗi xảy ra, vui lòng thử lại.");
      }

      setStatus("done");
    } catch (submitError) {
      setError(submitError.message);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="frame p-6">
        <p className="mb-1 font-display text-lg text-gold">Đã gửi đăng ký!</p>
        <p className="text-sm text-muted">
          Cảm ơn bạn đã quan tâm. Ban chủ nhiệm sẽ liên hệ lại sớm.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="frame space-y-5 p-6">
      <div>
        <label className="label">Họ và tên *</label>
        <input
          required
          className="input"
          value={form.fullName}
          onChange={update("fullName")}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label">Email *</label>
          <input
            required
            type="email"
            className="input"
            value={form.email}
            onChange={update("email")}
          />
        </div>
        <div>
          <label className="label">Số điện thoại</label>
          <input
            className="input"
            value={form.phone}
            onChange={update("phone")}
          />
        </div>
      </div>
      <div>
        <label className="label">Lớp / Trường / Khóa</label>
        <input
          className="input"
          value={form.studentInfo}
          onChange={update("studentInfo")}
        />
      </div>
      <div>
        <label className="label">Ngày sinh *</label>
        <input
          required
          type="date"
          className="input"
          value={form.birthDate}
          onChange={update("birthDate")}
        />
      </div>
      <fieldset aria-describedby="departments-help" aria-required="true">
        <legend className="label">Chọn phòng ban *</legend>
        <p id="departments-help" className="mb-3 text-xs text-muted">
          Bạn có thể chọn nhiều phòng ban.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {RECRUITMENT_DEPARTMENTS.map((department) => (
            <label
              key={department}
              className="flex cursor-pointer items-center gap-3 rounded-frame border border-border bg-surfaceLight px-3.5 py-3 text-sm transition-colors hover:border-gold"
            >
              <input
                type="checkbox"
                name="departments"
                value={department}
                checked={form.departments.includes(department)}
                onChange={() => toggleDepartment(department)}
                className="h-4 w-4 accent-gold"
              />
              <span>{department}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label className="label">Vì sao bạn muốn tham gia câu lạc bộ? *</label>
        <textarea
          required
          rows={4}
          className="input"
          value={form.reason}
          onChange={update("reason")}
        />
      </div>

      {status === "error" && <p className="text-sm text-rose">{error}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-gold w-full"
      >
        {status === "sending" ? "Đang gửi..." : "Gửi đăng ký"}
      </button>
    </form>
  );
}
