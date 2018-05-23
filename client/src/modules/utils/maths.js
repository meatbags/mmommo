function minAngleTo(from, to) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

export { minAngleTo };
