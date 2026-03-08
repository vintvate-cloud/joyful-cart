import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    // Clear existing data
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()

    // Seed Categories
    const toys = await prisma.category.create({
        data: { name: 'Toys', icon: '🧸', color: 'toy-orange' }
    })

    const clothes = await prisma.category.create({
        data: { name: 'Clothes', icon: '👕', color: 'toy-cyan' }
    })

    // Seed Products
    await prisma.product.create({
        data: {
            title: "Rainbow Stacking Rings",
            price: 14.99,
            originalPrice: 19.99,
            image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1",
            brand: "PlayTime",
            ageGroup: "0-2",
            rating: 4.8,
            categoryId: toys.id,
            stock: 50,
            description: "Colorful stacking rings for developing motor skills."
        }
    })

    await prisma.product.create({
        data: {
            title: "Kids Denim Jacket",
            price: 34.99,
            image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea",
            brand: "TinyFashion",
            ageGroup: "4-6",
            rating: 4.5,
            categoryId: clothes.id,
            stock: 30,
            description: "Stylish denim jacket for little ones."
        }
    })

    // Seed Admin User
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash('admin123', 10);

    await prisma.user.create({
        data: {
            email: 'admin@joyfulcart.com',
            password: hashedPassword,
            name: 'System Admin',
            role: 'ADMIN'
        }
    });

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        // @ts-ignore
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
