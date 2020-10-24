export default class Edge {
  constructor(stage, color, fromVertex, toVertex) {
    this.stage = stage;
    this.color = color;
    this.fromVertexText = fromVertex.getChildAt(0).getChildByName('text');
    this.toVertexText = toVertex.getChildAt(0).getChildByName('text');
    this.dash = 0;
    this.bezierPoints = {
      "cp1x": 250,
      "cp1y": 150,
      "cp2x": 250,
      "cp2y": 150
    }
    this.arc = new createjs.Shape();
    this.arc.visible = false;
    this.arc.on('tick', () => {
      if (this.arc.visible) {
        this.dash = (this.dash+1)%20;
        const pt1 = this.fromVertexText.localToGlobal(this.fromVertexText.x, this.fromVertexText.y);
        const pt2 = this.toVertexText.localToGlobal(this.toVertexText.x, this.toVertexText.y);

        pt1.x -= this.fromVertexText.x;
        pt1.y -= this.fromVertexText.y;
        pt2.x -= this.toVertexText.x;
        pt2.y -= this.toVertexText.y;

        this.arc.graphics.clear().setStrokeStyle(4).setStrokeDash([15, 5], this.dash).beginStroke(this.color).moveTo(pt1.x, pt1.y).bezierCurveTo(this.bezierPoints['cp1x'], this.bezierPoints['cp1y'], this.bezierPoints['cp2x'], this.bezierPoints['cp2y'], pt2.x, pt2.y);
      }
    });
  }

  renderArc() {
    this.arc.visible = true;
    this.stage.addChild(this.arc);
  }

  makeArcInvisible() {
    this.arc.visible = false;
  }

  unrenderArc() {
    this.stage.removeChild(this.arc);
    this.arc.visible = false;
  }
}