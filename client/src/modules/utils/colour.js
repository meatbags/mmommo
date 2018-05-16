// maybe useful one day

toColourString = function(c) {
  
}

HueToRGB(p, q, t) {
  // convert hue to RGB
  t += (t < 0) ? 1 : (t > 1) ? -1 : 0;

  if (t < 1/6) {
    return p + (q - p) * 6 * t;
  } else if (t < 0.5) {
    return q;
  } else if (t < 2/3) {
    return p + (q - p) * (2/3 - t) * 6;
  } else {
    return p;
  }
};

randomiseColour(c) {
  const S = 0;
  const L = Math.random();
  const H = 0;
  var r, b, g;

  if (S == 0){
    r = g = b = L;
  } else {
    const Q = (L < 0.5) ? L * (1 + S) : L + S - L * S;
    const P = 2 * L - Q;
    r = this.HueToRGB(P, Q, H + 1/3);
    g = this.HueToRGB(P, Q, H);
    b = this.HueToRGB(P, Q, H - 1/3);
  }

  c.setRGB(r, g, b);
}
