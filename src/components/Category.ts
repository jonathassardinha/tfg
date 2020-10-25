import * as createjs from 'createjs-module';
import Code from './Code';
import VertexCategory from './VertexCategory'

export default class Category extends VertexCategory {
  codes: Code[];

  constructor(stage: createjs.Stage, name: string, color: string) {
    super(stage, name, color);
    this.codes = [];
  }

  addCode(code: Code) {

  }

  removeCode(code: Code) {

  }
}