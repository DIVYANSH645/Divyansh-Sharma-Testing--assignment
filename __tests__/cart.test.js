// __tests__/cart.test.js
const request = require('supertest');
const { app, server } = require('../server');

afterAll(() => {
  server.close();
});

describe('POST /add-to-cart', () => {
  it('add an item to the cart and update the total', async () => {
    const item = { itemId: 2, price: 30, quantity: 2 };

    const response = await request(app)
      .post('/add-to-cart')
      .send(item)
      .expect(200);

    expect(response.body.message).toBe('Item added to cart');
    expect(response.body.cart.total).toBe(60);
    expect(response.body.cart.items).toHaveLength(1);
    expect(response.body.cart.items[0]).toMatchObject({
      itemId: 2,
      price: 30,
      quantity: 2,
      totalPrice: 60,
    });
  });

  it('return an error if item details are  not valid ', async () => {
    const response = await request(app)
      .post('/add-to-cart')
      .send({}) // Missing item details
      .expect(400);

    expect(response.body.error).toBe('Invalid item details');
  });

  it('should update the quantity of an existing item in the cart', async () => {
    const item1 = { itemId: 2, price: 30, quantity: 2 };
    const item2 = { itemId: 2, price: 30, quantity: 1 };
  
    await request(app)
     .post('/add-to-cart')
     .send(item1)
     .expect(200);
  
    const response = await request(app)
     .post('/add-to-cart')
     .send(item2)
     .expect(200);
  
    expect(response.body.message).toBe('Item added to cart');
    expect(response.body.cart.total).toBe(150); 
    expect(response.body.cart.items).toHaveLength(1);
    expect(response.body.cart.items[0]).toMatchObject({
      itemId: 2,
      price: 30,
      quantity: 5,
      totalPrice: 150,
    });
  });

  it('should return an error if price or quantity is not a number', async () => {
    const item = { itemId: 2, price: 'thirty', quantity: 2 };

    const response = await request(app)
      .post('/add-to-cart')
      .send(item)
      .expect(400);

    expect(response.body.error).toBe('Invalid item details');
  });

  it('should return an error if price or quantity is less than or equal to zero', async () => {
    const item = { itemId: 2, price: 0, quantity: 2 };

    const response = await request(app)
      .post('/add-to-cart')
      .send(item)
      .expect(400);

    expect(response.body.error).toBe('Invalid item details');
  });
});