"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = exports.getProductById = exports.getProducts = void 0;
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const getProducts = async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, featured } = req.query;
        const where = {};
        if (category) {
            where.category = { name: category };
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice)
                where.price.gte = parseFloat(minPrice);
            if (maxPrice)
                where.price.lte = parseFloat(maxPrice);
        }
        if (featured === 'true') {
            where.featured = true;
        }
        const products = await prisma_1.default.product.findMany({
            where,
            include: { category: true },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma_1.default.product.findUnique({
            where: { id },
            include: { category: true, reviews: { include: { user: { select: { name: true } } } } },
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProductById = getProductById;
const getCategories = async (req, res) => {
    try {
        const categories = await prisma_1.default.category.findMany();
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCategories = getCategories;
//# sourceMappingURL=product.controller.js.map