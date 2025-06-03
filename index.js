import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import { registerValidator, loginValidator, postCreateValidator } from './validations.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';
import { UserController, PostController } from './controllers/index.js';
import { cloudinary, storage } from './utils/cloudinary.js'; // Cloudinary utils

dotenv.config();

const app = express();

// Создаём папку uploads, если её нет
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Хранилище для файлов
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads');
//     },
//     filename: (req, file, cb) => {
//         const uniqueName = `${Date.now()}-${file.originalname}`;
//         cb(null, uniqueName);
//     },
// });
const upload = multer({ storage }); // Cloudinary storage

// const upload = multer({
//     storage,
//     fileFilter: (req, file, cb) => {
//         const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
//         if (!allowedTypes.includes(file.mimetype)) {
//             return cb(new Error('Only images are allowed'));
//         }
//         cb(null, true);
//     },
// });

// Middlewares
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.post('/auth/login', loginValidator, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidator, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.checkMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({ url: req.file.path });
});
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidator, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidator, handleValidationErrors, PostController.update);

app.get('/tags', PostController.getLastTags);
app.get('/posts/tags/:tag', PostController.getPostsByTag);
app.get('/posts/with-comments', PostController.getAllWithComments);

app.get('/comments', PostController.getAllComments);
app.get('/comments/last', PostController.getLast);
app.get('/comments/post/:postId', PostController.getByPost);
app.post('/comments', checkAuth, PostController.createComment);

// Запуск
async function start() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ DB connected');
        app.listen(4441, () => console.log('✅ Server running on port 4441'));
    } catch (err) {
        console.error('❌ DB connection error:', err);
        process.exit(1);
    }
}

start();

export default app;
