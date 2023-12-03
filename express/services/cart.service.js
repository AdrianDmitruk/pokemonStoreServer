const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URL);

class CartService {
   getCart = async (cartId) => {
      try {
         await client.connect();

         console.log("connect to mongo");

         const dbo = await client.db("pokemonStore");

         const cartsCollection = await dbo.collection("carts");

         const cart = await cartsCollection.findOne({ _id: ObjectId(cartId) });

         return cart;
      } finally {
         client.close();

         console.log("disconnect to mongo");
      }
   };

   setCartItem = async (product, cartId) => {
      try {
         await client.connect();

         console.log("connect to mongo");

         const dbo = await client.db("pokemonStore");

         const cartsCollection = await dbo.collection("carts");

         const update = await cartsCollection.findOneAndUpdate(
            { _id: ObjectId(cartId) },
            {
               $push: { itemsList: product },
            },
            { returnDocument: "after" }
         );

         return update.value;
      } finally {
         client.close();

         console.log("disconnect to mongo");
      }
   };

   updateCartItem = async (product, cartId) => {
      try {
         await client.connect();

         console.log("connect to mongo");

         const dbo = await client.db("pokemonStore");

         const cartsCollection = await dbo.collection("carts");

         const update = await cartsCollection.findOneAndUpdate(
            { _id: ObjectId(cartId) },
            {
               $set: { "itemsList.$[element].quantity": product.quantity },
            },
            {
               arrayFilters: [{ "element.id": product.id }],
               returnDocument: "after",
            }
         );

         return update.value;
      } finally {
         client.close();

         console.log("disconnect to mongo");
      }
   };

   deleteCartItem = async (productId, cartId) => {
      try {
         await client.connect();

         console.log("connect to mongo");

         const dbo = await client.db("pokemonStore");

         const cartsCollection = await dbo.collection("carts");

         const update = await cartsCollection.findOneAndUpdate(
            {
               _id: ObjectId(cartId),
            },
            {
               $pull: { itemsList: { id: productId } },
            },
            {
               returnDocument: "after",
            }
         );

         return update.value;
      } finally {
         client.close();

         console.log("disconnect to mongo");
      }
   };

   clearCart = async (cartId) => {
      try {
         await client.connect();

         console.log("connect to mongo");

         const dbo = await client.db("pokemonStore");

         const cartsCollection = await dbo.collection("carts");

         const update = await cartsCollection.updateOne(
            {
               _id: ObjectId(cartId),
            },
            {
               $set: { itemsList: [] },
            },
            {
               returnDocument: "after",
            }
         );

         return update.value;
      } finally {
         client.close();

         console.log("disconnect to mongo");
      }
   };
}

module.exports = new CartService();
