import CanvasStage from './CanvasStage';
import Code from './Code';
import VertexCategory from './VertexCategory'

export default class Category extends VertexCategory {
  codes: Code[];

  constructor(stage: CanvasStage, name: string, color: string) {
    super(stage.stage, name, 'Category', color);
    this.codes = [];
  }

  addCode(code: Code) {

  }

  removeCode(code: Code) {

  }
}