/**
 ** Change the players in-game status based on number of cells filled.
 **/

const status = [
  "Nobody", "Finger Painter", "Doodler", "Scribbler", "Egg Painter", "Bit Wrangler", "Pixel Pusher", "Connoisseur", "Baller",
  "L'Artiste", "Patron of The Pixels", "Recluse", "Pica$$o", "Server Crasher", "Pretty Fly", "Inseminator", "Pencil Jesus", "Pencil Satan", "Pencil Buddha",
  "The One Ring", "Pulitzer Prize In Pixels", "Nobel Prize In Pixels", "GOAT", "Palme d'Or", "Ballon d'Or", "No Lifer", "Absolute Madman", "1337 H4X0R"
];

function getStatus(n) {
  var stat = '';

  for (var i=0, len=status.length; i<len; ++i) {
    const j = i + 1;
    const lower = i * 100; //(i < 4) ? i * 25 : (i - 3) * 100;
    const upper = j * 100; //(j < 4) ? j * 25 : (j - 3) * 100;

    if (n >= lower && n < upper || i == status.length - 1) {
      stat = status[i];
      break;wa
    }
  }

  return stat;
}

export { getStatus };
