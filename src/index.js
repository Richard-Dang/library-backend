const { ApolloServer, gql } = require("apollo-server");
const { v1: uuid } = require("uuid");
const mongoose = require("mongoose");
const Book = require("./models/book");
const Author = require("./models/author");

const MONGO_URI =
  "mongodb+srv://RichardDang:danggiahoa@cluster0-izq2r.mongodb.net/library?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB: ", err));

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }
  type Author {
    name: String!
    born: Int
    numBooks: Int!
    id: ID!
  }
  type Query {
    authorCount: Int!
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`;

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

const allAuthors = async () => await Author.find({});

const numBooks = async (root) => {
  const author = await Author.find({ name: root.name });
  return await Book.countDocuments({ author });
};

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

const resolvers = {
  Query: {
    authorCount,
    bookCount,
    allBooks,
    allAuthors,
  },
  Author: {
    numBooks,
  },
  Mutation: {
    addBook,
    editAuthor,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
