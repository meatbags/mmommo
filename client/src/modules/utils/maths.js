function minAngleTo(a, b) {
  return Math.atan2(Math.sin(a - b), Math.cos(a - b));
}

export { minAngleTo };
