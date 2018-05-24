import { div } from './div';
import { getRandomColour, toColourString } from '../../utils/colour';

class ColourPicker {
  constructor(client) {
    // hook colour picker to client
    this.client = client;
    this.target = document.querySelector('#colour-target');

    // make some colours
    for (var i=0; i<5; i++) {
      const c = getRandomColour();
      const elem = div({classList: 'colour'});
      const str = toColourString(c);
      elem.style.background = str;
      this.target.appendChild(elem);
    }
  }

  select(index) {
    this.colours[index].click();
  }

  onSelect() {

  }

  random() {
    this.colour = getRandomColour();
    this.client.setColour(this.colour);
  }
}

export { ColourPicker };
