import PostModel from '../models/Post.js'
import mongoose from 'mongoose';
import CommentModel from '../models/Comment.js';

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
        ).populate({ path: 'user', select: ['fullName', 'avatarUrl'] })


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
            .map((obj) => obj.tags)
            .flat()
            .slice(0, 5);
        res.json(tags);

    } catch (err) {
        console.log(err);
        res.status(500).json
            ({ message: 'Failed to update the post' });
    }
};
export const getPostsByTag = async (req, res) => {
    try {
        const tag = req.params.tag;

        const posts = await PostModel.find({ tags: tag })
            .populate('user') // если нужно
            .exec();

        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch posts by tag' });
    }
};


export const getLast = async (req, res) => {
    try {
        const comments = await CommentModel.find()
            .sort({ createdAt: -1 })
            .limit(3)
            .populate('user', 'fullName avatarUrl'); // тянем юзера

        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Failed to get comments' });
    }
};

export const getByPost = async (req, res) => {
    try {
        const comments = await CommentModel.find({ post: req.params.postId })
            .sort({ createdAt: -1 })
            .populate({ path: 'user', select: 'fullName avatarUrl' })

        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Failed to get comments' });
    }
};


export const createComment = async (req, res) => {
    try {
        const { postId, text } = req.body;

        const comment = new CommentModel({
            post: postId,
            user: req.userId,
            text,
        });

        const savedComment = await comment.save();

        // Подтягиваем пользователя
        const populatedComment = await savedComment.populate('user', 'fullName avatarUrl');

        res.status(201).json(populatedComment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create comment' });
    }
};


export const getAllWithComments = async (req, res) => {
    try {
        const posts = await PostModel.find()
            .populate('user', '-passwordHash -__v')
            .lean(); // чтобы можно было добавить новое поле вручную

        const comments = await CommentModel.find();

        const postsWithCommentsCount = posts.map(post => {
            const count = comments.filter(c => c.post.toString() === post._id.toString()).length;
            return { ...post, commentsCount: count };
        });

        res.json(postsWithCommentsCount);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch posts with comments count' });
    }
};


export const getAllComments = async (req, res) => {
    try {
        const comments = await CommentModel.find()
            .sort({ createdAt: -1 })
            .populate('user', 'fullName avatarUrl')
            .populate('post', 'title');

        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch all comments' });
    }
};