function minAngleTo(from, to) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

function clamp(x, min, max) {
  return Math.min(max, Math.max(x, min));
}

export { minAngleTo, clamp };
