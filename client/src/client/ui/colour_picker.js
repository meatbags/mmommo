/*
 * ColourPicker
 * -- colour picker UI element
 */

import { div } from './div';
import { getRandomColour, toColourString } from '../../utils/colour';

class ColourPicker {
  constructor(client) {
    this.client = client;
    this.target = document.querySelector('#colour-target');
    document.querySelector('#colour-reroll').onclick = () => { this.makeNewColours(); };

    // make some colours
    this.makeNewColours();
  }

  makeNewColours() {
    // remove elements
    document.querySelectorAll('.colour').forEach(e => e.parentNode.removeChild(e));

    // make new
    this.colours = [];
    for (var i=0; i<5; i++) {
      const c = getRandomColour();
      const elem = div({classList: 'colour'});
      elem.style.background = toColourString(c);
      elem.onclick = (e) => { this.onClick(e.currentTarget); };
      this.target.appendChild(elem);
      this.colours.push(c);
    }

    // reference
    this.elements = document.querySelectorAll('.colour');
  }

  onClick(e) {
    document.querySelectorAll('.colour.active').forEach(el => { el.classList.remove('active') });
    e.classList.add('active');
    for (var i=0, len=this.elements.length; i<len; ++i) {
      if (this.elements[i] == e) {
        this.client.setColour(this.colours[i]);
        break;
      }
    }
  }

  setInitial() {
    this.client.setColour(this.colours[0]);
    document.querySelector('.colour').classList.add('active');
  }
}

export { ColourPicker };
