const connection = require('./connection');

const insertOne = async (collectionName, item) => (
  connection()
    .then((db) => db.collection(collectionName)
      .insertOne({ ...item, create: new Date(), update: new Date() }))
    .then(({ insertedId }) => ({ ...item, userId: insertedId }))
    .catch((err) => err)
);

const emailExists = async (collectionName, email) => (
  connection()
    .then((db) => db.collection(collectionName).findOne({ email }))
    .then((res) => res)
    .catch(() => false)
);

module.exports = {
  insertOne,
  emailExists,
};
