const ShoppingService = {

  getShoppingList(db) {
    return db('shopping_list')
      .select('*');
  },

  getItemByID(db, id) {
    return db('shopping_list')
      .select('*')
      .where({ id })
      .first();
  },

  insertShoppingItem(db, newItem) {
    return db('shopping_list')
      .insert(newItem)
      .returning('*')
      .then(newRows => newRows[0]);
  },

  updateShoppingItem(db, id, updatedItemFields) {
    return db('shopping_list')
      .where({ id })
      .update(updatedItemFields)
      .returning('*')
      .then(newRows => newRows[0]);
  },

  deleteShoppingItem(db, id) {
    return db('shopping_list')
      .where({ id })
      .delete()
      .then(() => {
        return db;
      }
      );
    //.finally(() => db.destroy());
  },

};

module.exports = ShoppingService; 