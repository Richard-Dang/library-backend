const subscription = (pubsub) => {
  return {
    bookAdded: { subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]) },
  };
};

module.exports = (pubsub) => subscription(pubsub);
