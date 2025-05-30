import request from 'supertest';
import app from '../index.js';
import mongoose from 'mongoose';
import UserModel from '../models/User.js';
import PostModel from '../models/Post.js';

let token;
let postId;

beforeAll(async () => {
    // Clear test   DB
    await UserModel.deleteMany({});
    await PostModel.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Auth endpoints', () => {
    it('should register a user', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                email: 'test@example.com',
                fullName: 'Test User',
                password: '123456',
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    it('should login the user', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'test@example.com',
                password: '123456',
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
        token = res.body.token;
    });

    it('should get current user info', async () => {
        const res = await request(app)
            .get('/auth/me')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.email).toBe('test@example.com');
    });
});

describe('Post endpoints', () => {
    it('should create a post', async () => {
        const res = await request(app)
            .post('/posts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Post',
                text: 'This is a test post',
                tags: ['test'],
                imageUrl: ''
            });
        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBeDefined();
        postId = res.body._id;
    });

    it('should get all posts', async () => {
        const res = await request(app).get('/posts');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should get a post by ID', async () => {
        const res = await request(app).get(`/posts/${postId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBe(postId);
    });

    it('should update a post', async () => {
        const res = await request(app)
            .patch(`/posts/${postId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Updated title',
                text: 'Updated content',
                tags: ['updated'],
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Updated title');
    });

    it('should delete a post', async () => {
        const res = await request(app)
            .delete(`/posts/${postId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });
});
