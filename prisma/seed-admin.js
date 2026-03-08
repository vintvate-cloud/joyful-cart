import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@joyfulcart.com';
    const password = 'admin123';

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email }
    });

    if (existingAdmin) {
        console.log('Admin user already exists.');
        return;
    }

    await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name: 'System Admin',
            role: 'ADMIN' // Role from schema.prisma
        }
    });

    console.log('Admin user seeded successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
