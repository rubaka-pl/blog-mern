import PostModel from '../models/Post.js'
import mongoose from 'mongoose';

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user', '-passwordHash -__v').exec();

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to fetch posts'
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
                message: 'Post not found',
            });
        }

        res.json(doc);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to fetch the post',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const doc = await PostModel.findById(postId);

        if (!doc) {
            return res.status(404).json({ message: 'Post not found' });
        }

        console.log('req.userId:', req.userId);
        console.log('doc.user:', doc.user);

        // getting an author id
        const authorId = typeof doc.user === 'object' && doc.user._id
            ? doc.user._id.toString()
            : doc.user.toString();

        if (authorId !== req.userId) {
            return res.status(403).json({ message: 'You do not have permission to delete this post' });
        }

        await PostModel.findByIdAndDelete(postId);

        res.json({ success: true });
    } catch (error) {
        console.log('Delete error:', error);
        res.status(500).json({ message: 'Failed to delete the post' });
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
            message: 'Failed to create the post',
        });
    }
};


export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const updatedDoc = await PostModel.findByIdAndUpdate(
            postId,
            { $set: req.body },
            { new: true }       // Вернуть обновлённую версию
        );

        if (!updatedDoc) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(updatedDoc);
    } catch (error) {
        console.log('Update error:', error);
        res.status(500).json({ message: 'Failed to update the post' });
    }
};

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();
        const tags = posts
            .map(obj => obj.tags)
            .flat()
            .slice(0, 5);
        res.json(tags);
    } catch (error) {
        console.log('Update error:', error);
        res.status(500).json({ message: 'Failed to update the post' });
    }
}
