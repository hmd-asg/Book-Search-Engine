const { User } = require('../models');
const { AuthenticationError, signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        me: async (_, __, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('savedBooks');
            }
            throw AuthenticationError;
        }
    },
    Mutation: {
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw AuthenticationError;
            }
            const checkPassword = await user.isCorrectPassword(password);
            if (!checkPassword) {
                throw AuthenticationError;
            }
            const token = signToken(user);
            return { token, user };
        },
        addUser: async (_, { username, email, password }) => {
            const user = await User.findOne({
                $or: [{ username: username }, { email: email }]
            });

            if (user) {
                throw AuthenticationError;
            }
            const newUser = await User.create({ username, email, password });
            const token = signToken(newUser);
            return { token, newUser };
        },
        saveBook: async (_, { input }, context) => {
            if (!context.user) {
                throw AuthenticationError;
            }
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: input } },
                { new: true, runValidators: true }
            );

            if (!updatedUser) {
                throw new Error('User not found');
            }
            return updatedUser;
        },
        removeBook: async (_, { bookId }, context) => {
            if (!context.user) {
                throw AuthenticationError;
            }
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: bookId } } },
                { new: true }
            );

            if (!updatedUser) {
                throw new Error('User not found');
            }
            return updatedUser;
        }
    }
}

module.exports = resolvers;