const Book = require("../models/book");
const Author = require("../models/author");
const User = require("../models/user");
const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");

const addBook = async (root, args, { currentUser }) => {
  if (!currentUser) {
    throw new AuthenticationError("not authenticated");
  }

  const authors = await Author.find({});
  let author = null;

  if (authors.find((a) => a.name === args.author)) {
    author = await Author.findOne({ name: args.author });
  } else {
    const newAuthor = {
      name: args.author,
      born: null,
    };
    author = new Author(newAuthor);
  }

  const book = new Book({ ...args, author });

  try {
    await book.save();
    await author.save();
  } catch (error) {
    throw new UserInputError(error.message, {
      invalidArgs: args,
    });
  }
  return book;
};

const editAuthor = async (root, args, { currentUser }) => {
  if (!currentUser) {
    throw new AuthenticationError("not authenticated");
  }
  const { name, setBornTo: born } = args;
  const author = await Author.findOneAndUpdate(
    { name },
    { name, born },
    {
      new: true,
    }
  );

  return author;
};

const createUser = async (root, { username, favoriteGenre }) => {
  const user = new User({ username, favoriteGenre });

  console.log("user", user);

  try {
    await user.save();
  } catch (error) {
    throw new UserInputError(error.message);
  }

  return user;
};

const login = async (root, { username, password }) => {
  const user = await User.findOne({ username });

  if (!user || password !== "password") {
    throw new UserInputError("Wrong credentials");
  }

  return {
    value: jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWT_SECRET
    ),
  };
};

module.exports = {
  addBook,
  editAuthor,
  createUser,
  login,
};
