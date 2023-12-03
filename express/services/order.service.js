const { MongoClient, ObjectId } = require("mongodb");

const dotenv = require("dotenv");

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URL);

class OrderService {
   getOrders = async (ordersId) => {
      try {
         await client.connect();

         console.log("connect to mongo");

         const dbo = await client.db("pokemonStore");

         const ordersCollection = await dbo.collection("orders");

         const orders = await ordersCollection.findOne({
            _id: ObjectId(ordersId),
         });

         return orders;
      } finally {
         client.close();

         console.log("disconnect to mongo");
      }
   };

   setOrder = async ({ customerId, totalPrice, itemsList }) => {
      try {
         await client.connect();

         console.log("connect to mongo");

         const dbo = await client.db("pokemonStore");

         const ordersCollection = await dbo.collection("orders");

         const order = await ordersCollection.findOneAndUpdate(
            { _id: ObjectId(customerId) },
            {
               $push: {
                  orders: { createdAt: new Date(), totalPrice, itemsList },
               },
            },
            { returnDocument: "after" }
         );

         return order.value;
      } finally {
         client.close();

         console.log("disconnect to mongo");
      }
   };
}

module.exports = new OrderService();
