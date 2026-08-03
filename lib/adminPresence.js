import { prisma } from "./prisma";

export const ADMIN_PRESENCE_TIMEOUT_MS = 45_000;

export async function startAdminPresence(userId, sessionId) {
  return prisma.adminUser.update({
    where: { id: userId },
    data: {
      activeSessionId: sessionId,
      activeSessionSeenAt: new Date()
    }
  });
}

export async function refreshAdminPresence(userId, sessionId) {
  const staleBefore = new Date(Date.now() - ADMIN_PRESENCE_TIMEOUT_MS);

  const updated = await prisma.adminUser.updateMany({
    where: {
      id: userId,
      OR: [
        { activeSessionId: null },
        { activeSessionId: sessionId },
        { activeSessionSeenAt: null },
        { activeSessionSeenAt: { lt: staleBefore } }
      ]
    },
    data: {
      activeSessionId: sessionId,
      activeSessionSeenAt: new Date()
    }
  });

  return updated.count === 1;
}
