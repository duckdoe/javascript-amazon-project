import {
  cart,
  deleteFromCart,
  calculateCartQuantity,
  updateQuantity,
  updateDeliveryOption,
} from "../../data/cart.js";

import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";

function renderOrderSummary() {
  let cartSummaryHtml = "";

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);
    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    cartSummaryHtml += `
    <div class="cart-item-container js-cart-item-container-${
      matchingProduct.id
    }">
      <div class="delivery-date">Delivery date: ${dateString}</div>

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
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
  `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
      const dateString = deliveryDate.format("dddd, MMMM D");

      const priceString =
        deliveryOption.priceCents == 0
          ? "FREE SHIPPING"
          : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id == cartItem.deliveryOptionId;

      html += `
      <div class="delivery-option js-delivery-option" data-product-id="${
        matchingProduct.id
      }" data-delivery-option="${deliveryOption.id}">
        <input
          type="radio"
          ${isChecked ? "checked" : ""}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}"
        />
        <div>
          <div class="delivery-option-date">${dateString}</div>
          <div class="delivery-option-price">${priceString}</div>
        </div>
      </div>`;
    });

    return html;
  }

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
      ``;
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

  document.querySelectorAll(".js-delivery-option").forEach((el) => {
    el.addEventListener("click", () => {
      const { productId, deliveryOption } = el.dataset;
      updateDeliveryOption(productId, deliveryOption);
      renderOrderSummary();
    });
  });
}

export { renderOrderSummary };
