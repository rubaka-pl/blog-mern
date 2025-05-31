import dotenv from 'dotenv';
import express from 'express'
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors'
import { registerValidator, loginValidator, postCreateValidator } from './validations.js'
import { checkAuth, handleValidationErrors } from './utils/index.js'
import { UserController, PostController } from './controllers/index.js';

dotenv.config();


const app = express();
app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });



app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidator, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidator, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.checkMe);


app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/posts', PostController.getAll);
app.post('/posts', checkAuth, postCreateValidator, handleValidationErrors, PostController.create);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove); // don`t forget to add check id ! ! !
app.patch('/posts/:id', checkAuth, postCreateValidator, handleValidationErrors, PostController.update);


async function start() {
    try {
        await mongoose.connect((process.env.MONGODB_URI));
        console.log("DB connect success");

        app.listen(4441, (err) => {
            if (err) {
                return console.log(err);
            }
            console.log('Server ok');
        });

    } catch (err) {
        console.error('DB connection error:', err);
        process.exit(1);
    }
}

start();

export default app;