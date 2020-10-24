import VertexCategory from "./VertexCategory";

import VertexCategory from './VertexCategory'

export default class Quotation extends VertexCategory {
  constructor(stage, name, color, text) {
    super(stage, name, color);
    this.text = text;
  }
}