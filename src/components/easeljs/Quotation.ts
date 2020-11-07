import * as createjs from 'createjs-module';
import VertexCategory from './VertexCategory';

export default class Quotation extends VertexCategory {
  text: string;

  constructor(stage: createjs.Stage, name: string, color: string, text: string) {
    super(stage, name, 'Quotation');
    this.text = text;
  }
}