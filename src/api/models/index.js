const connection = require('./connection');

const insertOne = async (collectionName, item) => (
  connection()
    .then((db) => db.collection(collectionName)
      .insertOne({ ...item, create: new Date(), update: new Date() }))
    .then(({ insertedId }) => ({ ...item, userId: insertedId }))
    .catch((err) => err)
);

const logIn = async (collectionName, { email, password }) => (
  connection()
    .then((db) => db.collection(collectionName).findOne({ email, password }))
    .then((res) => res)
    .catch((err) => err)
);

module.exports = {
  insertOne,
  logIn,
};
