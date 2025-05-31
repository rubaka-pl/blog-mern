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
            },
            {
                title: 'Test Post 2',
                text: 'Another seeded post 2',
                tags: ['init', 'mongodb'],
                user: user._id,
            },
            {
                title: 'Test Post 3',
                text: 'Another seeded post 3',
                tags: ['init', 'mongodb'],
                user: user._id,
            },
        ]);

        console.log('✅ Seeding complete');
        process.exit();
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seed();
