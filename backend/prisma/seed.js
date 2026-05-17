"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    // Clean existing data
    await prisma.review.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    // Create Categories
    const categories = await Promise.all([
        prisma.category.create({ data: { name: 'Chairs' } }),
        prisma.category.create({ data: { name: 'Sofas' } }),
        prisma.category.create({ data: { name: 'Tables' } }),
        prisma.category.create({ data: { name: 'Beds' } }),
        prisma.category.create({ data: { name: 'Storage' } }),
    ]);
    const [chairs, sofas, tables, beds, storage] = categories;
    // Create Products
    await prisma.product.createMany({
        data: [
            {
                name: 'Eames Lounge Chair',
                description: 'Iconic mid-century modern design with premium leather and walnut veneer.',
                price: 375000,
                images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop'],
                stock: 5,
                categoryId: chairs.id,
                featured: true,
                material: 'Leather, Walnut Wood',
                dimensions: '32.75" H 32.75" W 32.75" D',
                status: 'PUBLISHED',
            },
            {
                name: 'Nordic Velvet Sofa',
                description: 'Deep-seated comfort with plush emerald velvet upholstery and gold-tipped legs.',
                price: 185000,
                images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop'],
                stock: 10,
                categoryId: sofas.id,
                featured: true,
                material: 'Velvet, Pine Wood',
                dimensions: '34" H 88" W 40" D',
                status: 'PUBLISHED',
            },
            {
                name: 'Minimalist Oak Desk',
                description: 'Clean lines and solid oak construction for the perfect modern home office.',
                price: 65000,
                images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba62d?q=80&w=1000&auto=format&fit=crop'],
                stock: 15,
                categoryId: tables.id,
                featured: false,
                material: 'Solid Oak',
                dimensions: '29" H 60" W 30" D',
                status: 'PUBLISHED',
            },
            {
                name: 'Floating Platform Bed',
                description: 'Architectural design that creates a weightless feel in your bedroom.',
                price: 145000,
                images: ['https://images.unsplash.com/photo-1505693419173-42b9258a6347?q=80&w=1000&auto=format&fit=crop'],
                stock: 8,
                categoryId: beds.id,
                featured: true,
                material: 'Walnut, Metal',
                dimensions: '12" H 80" W 84" D (King)',
                status: 'PUBLISHED',
            },
            {
                name: 'Geometric Bookshelf',
                description: 'Asymmetric shelving that doubles as a sculptural focal point.',
                price: 95000,
                images: ['https://images.unsplash.com/photo-1594620302200-9a762244a156?q=80&w=1000&auto=format&fit=crop'],
                stock: 12,
                categoryId: storage.id,
                featured: false,
                material: 'Powder-coated Steel',
                dimensions: '72" H 48" W 14" D',
                status: 'PUBLISHED',
            },
        ],
    });
    console.log('Database seeded successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
