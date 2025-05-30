import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import UserModel from '../models/User.js';

export const register = async (req, res) => {
    try {


        const password = req.body.password;
        const hash = await argon2.hash(password); // Без соли — она автоматически внутри argon2

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user.id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '30d',
            }
        );

        const { passwordHash, createdAt, updatedAt, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to register',
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        const isValidPass = await argon2.verify(user._doc.passwordHash, req.body.password);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Invalid login or password',
            });
        }

        const token = jwt.sign(
            {
                _id: user.id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '30d',
            }
        );

        const { passwordHash, createdAt, updatedAt, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to authorize',
        });
    }
};

export const checkMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const { passwordHash, createdAt, updatedAt, ...userData } = user._doc;

        res.json(userData);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Access denied'
        });
    }
};
