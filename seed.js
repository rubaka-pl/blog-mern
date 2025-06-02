import mongoose from 'mongoose';
import UserModel from './models/User.js';
import PostModel from './models/Post.js';
import argon2 from 'argon2';
import dotenv from 'dotenv';
dotenv.config();
async function seed() {
    if (process.env.NODE_ENV !== 'development') {
        throw new Error('Seeding is allowed only in development mode!');
    }
    try {
        await mongoose.connect(
            process.env.MONGODB_URI);
        console.log('MongoDB connected');

        await UserModel.deleteMany({});
        await PostModel.deleteMany({});

        const passwordHash = await argon2.hash('123456');

        const user = await UserModel.create({
            email: 'demo@example.com',
            fullName: 'Demo User',
            avatarUrl: '',
            passwordHash,
        });

        await PostModel.create([
            {
                title: 'Test Post 1',
                text: 'This is a seeded test post 1',
                tags: ['test', 'seed'],
                user: user._id,
                imageUrl: 'https://habrastorage.org/getpro/habr/upload_files/3ce/79e/e8d/3ce79ee8d6348f455b02acbdf28ba535.jpg',
            },
            {
                title: 'Test Post 2',
                text: 'Another seeded post 2',
                tags: ['init', 'mongodb'],
                user: user._id,
                imageUrl: 'https://habrastorage.org/getpro/habr/upload_files/b52/640/230/b52640230465131a203d911e32ee5120.jpg',
            },
            {
                title: 'Test Post 3',
                text: 'Another seeded post 3',
                tags: ['init', 'mongodb'],
                user: user._id,
                imageUrl: 'https://trendymen.ru/images/article1/133875/prev1133875.jpg',
            }
        ]);

        console.log('✅ Seeding complete');
        process.exit();
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seed();
