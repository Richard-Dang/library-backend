const Book = require("../models/book");
const Author = require("../models/author");
const { PubSub } = require("apollo-server");
const pubsub = new PubSub();
const Query = require("../resolvers/queries");
const Mutation = require("../resolvers/mutations")(pubsub);
const Subscription = require("../resolvers/subscriptions")(pubsub);

const resolvers = {
  Query,
  Mutation,
  Subscription,
};

module.exports = resolvers;
