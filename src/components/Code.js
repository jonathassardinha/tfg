import VertexCategory from './VertexCategory.js'

export default class Code extends VertexCategory {
  constructor(stage, name, color, type) {
    super(stage, name, color);
    this.type = type;
    this.quotations = [];
  }

  addQuotation(quotation) {

  }

  removeQuotation(quotation) {

  }
}