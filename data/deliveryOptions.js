import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { isWeekend } from "../scripts/utils/isWeekend.js";

const deliveryOptions = [
  {
    id: "1",
    deliveryDays: 7,
    priceCents: 0,
  },
  {
    id: "2",
    deliveryDays: 3,
    priceCents: 499,
  },
  {
    id: "3",
    deliveryDays: 1,
    priceCents: 999,
  },
];

function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;

  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });

  return deliveryOption || deliveryOption[0];
}

function calculateDeliveryDate(deliveryOption) {
  const today = dayjs();
  let deliveryDate = today.add(deliveryOption.deliveryDays, "days");

  function daysToAdd(day) {
    let num = 0;
    let newDay = day;

    while (isWeekend(newDay)) {
      newDay = newDay.add(num, "days");
      num += 1;
    }

    return newDay;
  }

  deliveryDate = daysToAdd(deliveryDate);

  const dateString = deliveryDate.format("dddd, MMMM D");

  return dateString;
}

export { deliveryOptions, getDeliveryOption, calculateDeliveryDate };
