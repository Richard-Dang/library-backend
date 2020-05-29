const Book = require("../models/book");
const Author = require("../models/author");
const Query = require("../resolvers/queries");
const Mutation = require("../resolvers/mutations");

const resolvers = {
  Query,
  Mutation,
  Author: {
    numBooks: async (root) => {
      const author = await Author.find({ name: root.name });
      return await Book.countDocuments({ author });
    },
  },
};

module.exports = resolvers;
