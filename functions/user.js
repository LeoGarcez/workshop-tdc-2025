const connectDB = require('../config/database');
const { User } = require('../models/User');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const create = async (event) => {
    try {
        await connectDB();
        const userData = JSON.parse(event.body);

        const user = new User(userData);
        await user.save();

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'User created successfully',
                userId: user._id
            })
        };
    } catch (error) {
        return {
            statusCode: error.name === 'ValidationError' ? 400 : 500,
            body: JSON.stringify({
                message: error.message
            })
        };
    }
};

const getAll = async (event) => {
    try {
        await connectDB();
        const users = await User.find({ deletedAt: null }).select('-password');

        return {
            statusCode: 200,
            body: JSON.stringify(users)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message
            })
        };
    }
};

const getOne = async (event) => {
    try {
        await connectDB();
        const userId = event.pathParameters.id;
        const user = await User.findOne({ _id: userId, deletedAt: null }).select('-password');

        if (!user) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'User not found' })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(user)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message })
        };
    }
};

const update = async (event) => {
    try {
        await connectDB();
        const userId = event.pathParameters.id;
        const updates = JSON.parse(event.body);

        const user = await User.findOneAndUpdate(
            { _id: userId, deletedAt: null },
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'User not found or already deleted' })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(user)
        };
    } catch (error) {
        return {
            statusCode: error.name === 'ValidationError' ? 400 : 500,
            body: JSON.stringify({ message: error.message })
        };
    }
};

const remove = async (event) => {
    try {
        await connectDB();
        const userId = event.pathParameters.id;

        const user = await User.findOneAndUpdate(
            { _id: userId, deletedAt: null },
            { deletedAt: new Date() },
            { new: true }
        );

        if (!user) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'User not found or already deleted' })
            };
        }

        return {
            statusCode: 204,
            body: ''
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message })
        };
    }
};

module.exports = {
    create,
    getAll,
    getOne,
    update,
    remove
};
