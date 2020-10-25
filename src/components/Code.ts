import * as createjs from 'createjs-module';
import Quotation from './Quotation.js';
import VertexCategory from './VertexCategory'

export default class Code extends VertexCategory {
  type: any;
  quotations: Quotation[];

  constructor(stage: createjs.Stage, name: string, color: string, type: any) {
    super(stage, name, color);
    this.type = type;
    this.quotations = [];
  }

  addQuotation(quotation: Quotation) {

  }

  removeQuotation(quotation: Quotation) {

  }
}