// Referencing code from Module 21
const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

// Create the functions that fulfill the queries defined in `typeDefs.js`
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      // Get and return one document from the me collection, and populate the savedBreweries subdocument for the user instance
      // If a user key can be found in the auth context, find the user using their id
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password').populate('savedBreweries');
        return userData;
      }
      throw new AuthenticationError('You are not logged in');
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      // Look up the user by the provided email address. Since the `email` field is unique, we know that only one person will exist with that email
      const user = await User.findOne({ email });

      // If there is no user with that email address, return an Authentication error stating so
      if (!user) {
        throw new AuthenticationError('username/password is incorrect');
      }

      // If there is a user found, execute the `isCorrectPassword` instance method and check if the correct password was provided
      const correctPw = await user.isCorrectPassword(password);

      // If the password is incorrect, return an Authentication error stating so
      if (!correctPw) {
        throw new AuthenticationError('username/password is incorrect');
      }

      // If email and password are correct, sign user into the application with a JWT
      const token = signToken(user);

      // Return an `Auth` object that consists of the signed token and user's information
      return { token, user };
    },
    addUser: async (parent, { username, email, password }) => {
      // First we create the user
      const user = await User.create({ username, email, password });
      // To reduce friction for the user, we immediately sign a JSON Web Token and log the user in after they are created
      const token = signToken(user);
      // Return an `Auth` object that consists of the signed token and user's information
      return { token, user };
    },
    saveBrewery: async (parent, { input }, context) => {
      // Find and update the matching user using the destructured input arg
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBreweries: input } },
          // Return the newly updated object instead of the original
          { new: true }
        ).populate('savedBreweries');

        return updatedUser;
      }
      throw new AuthenticationError('You must be logged in!');
    },
    removeBrewery: async (parent, { breweryId }, context) => {
      // Find and update the matching user using the destructured breweryId arg
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBreweries: { breweryId: breweryId } } },
          // Return the newly updated object instead of the original
          { new: true }
        ).populate('savedBreweries');

        return updatedUser;
      }
      throw new AuthenticationError('You must be logged in!');
    },
  },
};

module.exports = resolvers;
