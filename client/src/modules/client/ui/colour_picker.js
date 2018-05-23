import { getRandomColour } from '../../utils/colour';

class ColourPicker {
  constructor(client) {
    // hook colour picker to client
    this.client = client;
  }

  random() {
    this.colour = getRandomColour();
    this.client.setColour(this.colour);
  }
}

export { ColourPicker };
