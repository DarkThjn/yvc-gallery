const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || "admin@club.local";
  const password = process.env.SEED_ADMIN_PASSWORD || "changeme123";
  const name = process.env.SEED_ADMIN_NAME || "Quản trị viên";

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, name },
    create: { email, passwordHash, name }
  });

  await prisma.recruitmentSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" }
  });

  console.log("Đã tạo/cập nhật tài khoản admin:");
  console.log("  Email:   ", user.email);
  console.log("  Mật khẩu:", password, "(đổi lại sau khi đăng nhập lần đầu)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
