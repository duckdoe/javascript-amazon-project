import {
  cart,
  deleteFromCart,
  calculateCartQuantity,
  updateQuantity,
} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

let cartSummaryHtml = "";

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if (productId == product.id) {
      matchingProduct = product;
    }
  });

  cartSummaryHtml += `
    <div class="cart-item-container js-cart-item-container-${
      matchingProduct.id
    }">
      <div class="delivery-date">Delivery date: Tuesday, June 21</div>

      <div class="cart-item-details-grid">
        <img
          class="product-image"
          src="${matchingProduct.image}"
        />

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity" data-product-id="${matchingProduct.id}">
            <span> Quantity: <span class="quantity-label js-quantity-label" data-product-id="${
              matchingProduct.id
            }">
              ${cartItem.quantity}
            </span> </span>
            <span class="update-quantity-link link-primary js-update-link" data-product-id=${
              matchingProduct.id
            }>
              Update
            </span>
            <input class="quantity-input js-quantity-input" data-product-id="${
              matchingProduct.id
            }"/>
            <span class="save-quantity-link link-primary js-save-link" data-product-id="${
              matchingProduct.id
            }">Save</span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${
              matchingProduct.id
            }">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          <div class="delivery-option">
            <input
              type="radio"
              checked
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}"
            />
            <div>
              <div class="delivery-option-date">Tuesday, June 21</div>
              <div class="delivery-option-price">FREE Shipping</div>
            </div>
          </div>
          <div class="delivery-option">
            <input
              type="radio"
              class="delivery-option-input"
              name="delivery-option-1"
            />
            <div>
              <div class="delivery-option-date">Wednesday, June 15</div>
              <div class="delivery-option-price">$4.99 - Shipping</div>
            </div>
          </div>
          <div class="delivery-option">
            <input
              type="radio"
              class="delivery-option-input"
              name="delivery-option-${productId}"
            />
            <div>
              <div class="delivery-option-date">Monday, June 13</div>
              <div class="delivery-option-price">$9.99 - Shipping</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
});

document.querySelector(".js-order-summary").innerHTML = cartSummaryHtml;

document.querySelectorAll(".js-delete-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    deleteFromCart(productId);

    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );

    container.remove();
    updateCheckoutQuantity();
  });
});

function updateCheckoutQuantity() {
  document.querySelector(
    ".js-return-to-home-link"
  ).innerHTML = `${calculateCartQuantity()} items`;
}

updateCheckoutQuantity();

const productQuantity = document.querySelectorAll(".product-quantity");

document.querySelectorAll(".js-update-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;

    productQuantity.forEach((product) => {
      const productQuantityId = product.dataset.productId;

      if (productQuantityId === productId) {
        product.classList.add("is-editing");
      }
    });
  });
});

function getInputValue(productId) {
  let newQuantity = 0;
  document.querySelectorAll(".js-quantity-input").forEach((quantityInput) => {
    const quantityInputId = quantityInput.dataset.productId;

    if (quantityInputId === productId) {
      newQuantity = Number(quantityInput.value);
    }
  });

  return newQuantity;
}

function updateQuantityLabel(productId) {
  document.querySelectorAll(".js-quantity-label").forEach((label) => {
    const productLabelId = label.dataset.productId;

    if (productLabelId === productId) {
      label.innerHTML = getInputValue(productId);
    }
  });
}

function removeSaveLink(productId) {
  productQuantity.forEach((product) => {
    const productQuantityId = product.dataset.productId;

    if (productQuantityId === productId) {
      product.classList.remove("is-editing");
    }
  });
}

document.querySelectorAll(".js-save-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    const inputValue = getInputValue(productId);
    if (inputValue >= 0 && inputValue <= 1000) {
      removeSaveLink(productId);
      updateQuantity(productId, inputValue);
      updateCheckoutQuantity();
    }
  });
});

function allowEnterKey(e) {
  const inputProductId = e.target.dataset.productId;
  const inputValue = getInputValue(inputProductId);
  document.querySelectorAll(".js-save-link").forEach((link) => {
    const productId = link.dataset.productId;
    if (
      e.key === "Enter" &&
      inputProductId === productId &&
      inputValue >= 0 &&
      inputValue <= 1000
    ) {
      updateQuantityLabel(productId);
      removeSaveLink(productId);
      updateQuantity(productId, inputValue);
      updateCheckoutQuantity();
    }
  });
}

window.addEventListener("keypress", (e) => {
  allowEnterKey(e);
});
