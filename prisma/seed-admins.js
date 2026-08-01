const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

function readAdmins() {
  const rawAdmins = process.env.SEED_ADMINS_JSON;
  if (!rawAdmins) {
    throw new Error("Thiếu biến môi trường SEED_ADMINS_JSON.");
  }

  const admins = JSON.parse(rawAdmins);
  if (!Array.isArray(admins) || admins.length === 0) {
    throw new Error("SEED_ADMINS_JSON phải là mảng tài khoản không rỗng.");
  }

  return admins.map((admin) => {
    const username = admin.username?.toLowerCase().trim();
    if (!username || !admin.password || !admin.name) {
      throw new Error("Mỗi tài khoản cần có username, password và name.");
    }

    return { ...admin, username };
  });
}

async function main() {
  const admins = readAdmins();

  for (const admin of admins) {
    const passwordHash = await bcrypt.hash(admin.password, 10);
    await prisma.adminUser.upsert({
      where: { email: admin.username },
      update: { passwordHash, name: admin.name },
      create: {
        email: admin.username,
        passwordHash,
        name: admin.name
      }
    });
  }

  console.log(`Đã tạo/cập nhật ${admins.length} tài khoản quản trị.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
