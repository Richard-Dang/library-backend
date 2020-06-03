const Book = require("../models/book");
const Author = require("../models/author");

const allAuthors = async () => await Author.find({});

const authorCount = async () => await Author.countDocuments({});

const bookCount = async () => await Book.countDocuments({});

const allBooks = async (root, args) => {
  const filteredQuery = {};

  if (args.genre) {
    filteredQuery.genres = args.genre;
  }
  if (args.author) {
    const author = await Author.find({ name: args.author });
    filteredQuery.author = author;
  }

  return await Book.find(filteredQuery).populate("author");
};

const allGenres = async (root, args) => await Book.distinct("genres");

const me = (root, args, { currentUser }) => currentUser;

module.exports = {
  allAuthors,
  authorCount,
  bookCount,
  allBooks,
  me,
  allGenres,
};
