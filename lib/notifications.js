export async function notifyRecruitmentSubmission(submission) {
  const webhookUrl = process.env.RECRUITMENT_NOTIFY_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "recruitment_submission.created",
        title: "Đơn ứng tuyển mới",
        submission: {
          id: submission.id,
          fullName: submission.fullName,
          email: submission.email,
          phone: submission.phone,
          socialUrl: submission.socialUrl,
          studentInfo: submission.studentInfo,
          departments: submission.departments,
          createdAt: submission.createdAt,
        },
      }),
    });
  } catch (error) {
    console.error("Failed to send recruitment notification", error);
  }
}
