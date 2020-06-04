const { ApolloServer, AuthenticationError } = require("apollo-server");
const mongoose = require("mongoose");
const resolvers = require("./resolvers");
const typeDefs = require("./typedefs");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB: ", err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      try {
        const { id } = jwt.verify(auth.substring(7), process.env.JWT_SECRET);
        const currentUser = await User.findById(id);
        return { currentUser };
      } catch (error) {
        throw new AuthenticationError("bad token");
      }
    }
  },
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`);
  console.log(`Subscriptions ready ready at ${subscriptionsUrl}`);
});
