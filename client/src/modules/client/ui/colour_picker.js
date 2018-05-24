import { div } from './div';
import { getRandomColour, toColourString } from '../../utils/colour';

class ColourPicker {
  constructor(client) {
    // hook colour picker to client
    this.client = client;
    this.target = document.querySelector('#colour-target');
  }

  random() {
    this.colour = getRandomColour();
    this.client.setColour(this.colour);

    // add to ui
    const elem = div({classList: 'colour'});
    const str = toColourString(this.colour);
    elem.style.background = str;
    console.log(str);
    this.target.appendChild(elem);
  }
}

export { ColourPicker };
