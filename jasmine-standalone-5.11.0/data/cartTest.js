import { cart, addToCart } from "../../data/cart.js";

describe("test suite: addToCart", () => {
  it("adds an existing product to the cart", () => {});

  it("adds a new product to the cart", () => {
    addToCart("3ebe75dc-64d2-4137-8860-1f5a963e534b");
    expect(cart.length).toEqual(1);
  });
});
