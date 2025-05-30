import PostModel from '../models/Post.js'
import mongoose from 'mongoose';

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user', '-passwordHash -__v').exec();

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось отобразить статьи'
        })
    }
}


export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { returnDocument: 'after' }
        ).populate('user', '-passwordHash');

        if (!doc) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        res.json(doc);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось отобразить статью',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Неверный формат ID' });
        }

        const doc = await PostModel.findById(postId);

        if (!doc) {
            return res.status(404).json({ message: 'Статья не найдена' });
        }

        console.log('req.userId:', req.userId);
        console.log('doc.user:', doc.user);

        // getting an author id
        const authorId = typeof doc.user === 'object' && doc.user._id
            ? doc.user._id.toString()
            : doc.user.toString();

        if (authorId !== req.userId) {
            return res.status(403).json({ message: 'Нет прав на удаление этой статьи' });
        }

        await PostModel.findByIdAndDelete(postId);

        res.json({ success: true });
    } catch (error) {
        console.log('Ошибка удаления:', error);
        res.status(500).json({ message: 'Не удалось удалить статью' });
    }
};


export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save()

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью',
        });
    }
};


export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Неверный формат ID' });
        }

        const updatedDoc = await PostModel.findByIdAndUpdate(
            postId,
            { $set: req.body },
            { new: true }       // Вернуть обновлённую версию
        );

        if (!updatedDoc) {
            return res.status(404).json({ message: 'Статья не найдена' });
        }

        res.json(updatedDoc);
    } catch (error) {
        console.log('Ошибка обновления:', error);
        res.status(500).json({ message: 'Не удалось обновить статью' });
    }
};

