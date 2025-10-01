function isWeekend(dayObject) {
  const weekends = ["Saturday", "Sunday"];
  const day = dayObject.format("dddd");

  for (let i = 0; i < weekends.length; i++) {
    if (weekends[i] === day) {
      return true;
    }
  }

  return false;
}

export { isWeekend };
