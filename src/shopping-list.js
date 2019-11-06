require('dotenv').config();
const knex = require('knex');
const ShoppingService = require('./shopping-list-service');

const db = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

// ShoppingService.getShoppingList(db)
//   .then(res => console.log(res));

// ShoppingService.getItemByID(db, 25)
//   .then(res => console.log(res))
//   .finally(() => db.destroy());

const newItem = {
  id: 31,
  name: 'yogurt',
  price: '1',
  checked: false,
  category: 'Lunch'
};

// ShoppingService.insertShoppingItem(db, newItem)
//   .then(res=> console.log(res));

const updatedItem = {
  price: 4,
  checked: false,
};

// ShoppingService.updateShoppingItem(db, '34', updatedItem)
//   .then(res=> console.log(res));

ShoppingService.deleteShoppingItem(db, '25')
  .then((database)=> ShoppingService.getShoppingList(database))
  .then(res => console.log(res))
  .then(() => db.destroy());