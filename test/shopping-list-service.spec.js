const ShoppingService = require('../src/shopping-list-service');
const knex = require('knex');

describe('ShoppingService methods', () => {
  const db = knex({
    client: 'pg',
    connection: process.env.TEST_DB_URL
  });

  const testItems = [
    { id: 1, name: 'Fish tricks', price: 13.10.toFixed(2), category: 'Main', checked: false, date_added: new Date('2029-01-22T16:28:32.615Z') },
    { id: 2, name: 'Not Dogs', price: 4.99.toFixed(2), category: 'Snack', checked: true, date_added: new Date('2029-01-22T16:28:32.615Z') },
    { id: 3, name: 'Bluffalo Wings', price: 5.50.toFixed(2), category: 'Snack', checked: false, date_added: new Date('2029-01-22T16:28:32.615Z') },
  ];
  before(() => db('shopping_list').truncate());
  afterEach(() => db('shopping_list').truncate());
  after(() => db.destroy());

  context('with data', () => {
    beforeEach(() => {
      return db('shopping_list')
        .insert(testItems);
    });

    it('returns an array of three items', () => {
      return ShoppingService.getShoppingList(db)
        .then(res => {
          expect(res).to.be.an('array');
          expect(res).to.have.lengthOf(3);
        });
    });

    it('returns item by id', () => {
      return ShoppingService.getItemByID(db, 2)
        .then(actual => {
          expect(actual).to.be.an('object');
          expect(actual).to.eql({
            id: 2, 
            name: 'Not Dogs', 
            price: 4.99.toFixed(2), 
            category: 'Snack', 
            checked: true, 
            date_added: new Date('2029-01-22T16:28:32.615Z')
          });
        });
    });

    it('adds a new item to the list', () => {

      const newItem = {
        id: 4,
        name: 'pizza',
        price: 9.00,
        checked: false,
        category: 'Main'
      };

      return ShoppingService.insertShoppingItem(db, newItem)
        .then(actual => {
          expect(actual).to.be.an('object');
          expect(actual).to.include.all.keys(
            'name', 'price', 'checked', 'category', 'date_added', 'id'
          );
        });

    });

    it('updates an existing item', () => {
      const updatedItem = {
        name: 'Fish sticks',
        checked: true
      };

      return ShoppingService.updateShoppingItem(db, '1', updatedItem)
        .then(actual => {
          expect(actual).to.be.an('object');
          expect(actual).to.include.all.keys(
            'name', 'price', 'checked', 'category', 'date_added', 'id'
          );
          expect(actual.name).to.eql('Fish sticks');
          expect(actual.price).to.eql('13.10');
          expect(actual.checked).to.eql(true);
        });
    });

    it('deletes an item by id', () => {
      const itemId = 2;
      return ShoppingService.deleteShoppingItem(db, itemId)
        .then(() => ShoppingService.getShoppingList(db))
        .then(allItems => {
          const expected = testItems.filter(items => items.id !== itemId);
          expect(allItems).to.eql(expected);
        });
    });
  });

  context('without data', () => {
    it('returns an empty array when no data is present', () => {
      return ShoppingService.getShoppingList(db)
        .then(actual => {
          expect(actual).to.be.an('array');
          expect(actual).to.have.lengthOf(0);
        });
    });

    it('creates a new item and provides it with an id of 1', () => {
      const newItem = {
        name: 'pizza',
        price: 9.00.toFixed(2),
        checked: false,
        category: 'Main',
        date_added: new Date('2029-01-22T16:28:32.615Z')
      };
      return ShoppingService.insertShoppingItem(db, newItem)
        .then(actual => {
          expect(actual).to.be.an('object');
          expect(actual).to.eql({
            id: 1,
            name: newItem.name,
            price: newItem.price,
            checked: newItem.checked,
            category: newItem.category,
            date_added: newItem.date_added
          });
        });
    });



  });
});