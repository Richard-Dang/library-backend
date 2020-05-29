const Book = require("../models/book");
const Author = require("../models/author");

const addBook = async (root, args) => {
  const authors = await Author.find({});
  let author = null;

  if (authors.find((a) => a.name === args.author)) {
    author = Author.find({ name: args.author });
  } else {
    const newAuthor = {
      name: args.author,
      born: null,
    };
    author = new Author(newAuthor);
    await author.save();
  }

  const book = new Book({ ...args, author });

  try {
    await book.save();
  } catch (error) {
    console.log("err", err);
  }
  return book;
};

const editAuthor = async (root, args) => {
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

module.exports = {
  addBook,
  editAuthor,
};
