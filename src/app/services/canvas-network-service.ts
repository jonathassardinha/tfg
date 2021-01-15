import { EventEmitter, Injectable } from "@angular/core";
import { Ticker } from "createjs-module";

import CanvasStage from '../data/Canvas/CanvasStage';
import Network from "../data/Network";
import CanvasCategory from "../data/Canvas/CanvasCategory";
import VertexCategory from "../data/Canvas/VertexCategory";
import Category from "../data/Category";
import Code from "../data/Code";
import Relationship from "../data/Relationship";
import CanvasEdge from "../data/Canvas/CanvasEdge";
import { NetworkService } from "./network-service";
import { CategoryService } from "./category-service";
import { CodeService } from "./code-service";
import CanvasCode from "../data/Canvas/CanvasCode";
import { UserService } from "./user-service";
import Vertex from "../data/Canvas/Vertex";
import { Edge } from "../data/Canvas/Edge";

interface ConnectionOptions {
  title?: string;
  comment?: string;
  color?: string;
  edgeType?: string;
  arrowFrom?: boolean;
  arrowTo?: boolean;
}

@Injectable({ providedIn: 'root' })
export class CanvasNetworkService {

  private canvasStage: CanvasStage;
  private detailsCallback: (event: MouseEvent, vertex: VertexCategory) => void;
  private edgeCallback: (event: MouseEvent, edge: Edge) => void;
  private codes: Map<string, Code> = new Map();
  private categories: Map<string, Category> = new Map();
  private vertexMap: Map<string, VertexCategory> = new Map();

  public structuresUpdated: EventEmitter<boolean> = new EventEmitter();
  public savingNetworkEvent = new EventEmitter<boolean>();
  public network: Network;
  public scale: number = 1;

  public offset = {
    x: 0,
    y: 0
  };
  public canvasCategories: CanvasCategory[] = [];
  public canvasCodes: CanvasCode[] = [];
  public quotations: string[];
  public visibleRelationships: Map<string, CanvasEdge[]> = new Map();
  public visibleVertices: VertexCategory[] = [];
  public areStructuresSetup = false;

  constructor(
    private networkService: NetworkService,
    private categoryService: CategoryService,
    private codeService: CodeService,
    private userService: UserService
  ) {
    this.userService.userLogEvent.subscribe((eventType: string) => {
      if (eventType === 'logout') {
        this.logoutUser();
      }
    });
    this.userService.userFullyLoaded.subscribe(() => {
      if (this.canvasStage)
        this.setupStructures();
    });
    this.userService.networkSelected.subscribe(() => {
      if (this.canvasStage)
        this.setupStructures();
    })
  }

  async setupCanvasStage(canvasRef: HTMLCanvasElement, detailCallback: (event: MouseEvent, vertex: VertexCategory) => void, edgeCallback: (event: MouseEvent, edge: Edge) => void) {
    this.detailsCallback = detailCallback;
    this.edgeCallback = edgeCallback;
    this.canvasStage = new CanvasStage(canvasRef);

    Ticker.timingMode = Ticker.RAF_SYNCHED;
    Ticker.framerate = 60;

    Ticker.on("tick", () => {
      this.canvasStage?.stage.update();
    });

    if (this.userService.user && this.userService.currentNetwork && !this.areStructuresSetup) {
      this.network = this.userService.currentNetwork;
      this.setupStructures();
    }
  }

  async saveChanges() {
    this.savingNetworkEvent.emit(true);
    let updateCategories: Partial<Category>[] = [];
    let updateCodes: Partial<Code>[] = [];
    let updateRelationships: Relationship[] = [];
    let updatePositions: {[key: string]: {x: number, y: number}} = {};

    let uniqueRelationships: CanvasEdge[] = [];
    this.visibleVertices.forEach(vertex => {
      let updateData = {
        id: vertex.id,
        name: vertex.name,
        color: vertex.color,
        textColor: vertex.textColor
      };
      if (vertex instanceof CanvasCategory) {
        updateCategories.push(updateData);
      } else {
        updateCodes.push(updateData);
      }
      updatePositions[vertex.id] = {x: vertex.vertex.x + this.offset.x, y: vertex.vertex.y + this.offset.y};
    });
    [...this.visibleRelationships].forEach(([vertexId, relationships]) => {
      uniqueRelationships.push(...relationships.filter(relationship => relationship.fromVertex.id === vertexId));
    });
    updateRelationships = uniqueRelationships.map(relationship => ({
      title: relationship.edge.title,
      comment: relationship.edge.comment ? relationship.edge.comment : '',
      color: relationship.edge.color,
      from: relationship.fromVertex.id,
      to: relationship.toVertex.id,
      arrowFrom: relationship.edge.arrowFrom,
      arrowTo: relationship.edge.arrowTo,
      edgeType: relationship.edge.edgeType
    }));

    let networkData: Partial<Network> = {relationships: updateRelationships, positions: updatePositions, description: this.network.description};
    await this.userService.updateNetwork(networkData, updateCategories, updateCodes);

    this.savingNetworkEvent.emit(false);
  }

  redraw() {
    this.canvasStage.redraw();
  }

  getVertexById(id: string) {
    return this.vertexMap.get(id);
  }

  renderVertex(id: string, x: number, y: number) {
    let vertex = this.vertexMap.get(id);
    if (vertex && !vertex.isVertexRendered) {
      vertex.renderVertex(x, y, this.scale);
      this.visibleVertices.push(vertex);
      this.visibleRelationships.set(id, []);
    }
  }

  unrenderVertex(vertex: VertexCategory) {
    let edges = this.visibleRelationships.get(vertex.id);
    if (edges) {
      edges.forEach(relationship => {
        let differentId = relationship.fromVertex.id === vertex.id ? relationship.toVertex.id : relationship.fromVertex.id;
        this.visibleRelationships.set(differentId,
          this.visibleRelationships.get(differentId)
            .filter(rel => rel.fromVertex.id !== vertex.id && rel.toVertex.id !== vertex.id)
        );
      });
      this.visibleRelationships.delete(vertex.id);
      edges.forEach(edge => edge.unrenderArc());
    }
    this.visibleVertices = this.visibleVertices.filter(visibleVertex => visibleVertex.id !== vertex.id);
    vertex.unrenderVertex();
  }

  connectVertices(origin: VertexCategory, destination: VertexCategory, options?: ConnectionOptions) {
    let edge = new CanvasEdge(this.canvasStage, options && options.color ? options.color : 'gray', origin, destination, this.edgeCallback);
    if (options) {
      edge.edge.comment = options.comment;
      edge.edge.title = options.title != null ? options.title : edge.edge.title;
      edge.edge.edgeType = options.edgeType != null ? options.edgeType : edge.edge.edgeType;
      edge.edge.arrowFrom = options.arrowFrom != null ? options.arrowFrom : edge.edge.arrowFrom;
      edge.edge.arrowTo = options.arrowTo != null ? options.arrowTo : edge.edge.arrowTo;
    }
    let originRelationships = this.visibleRelationships.get(origin.id);
    let destRelationships = this.visibleRelationships.get(destination.id);
    originRelationships.push(edge);
    destRelationships.push(edge);
    edge.renderArcAtBeggining();
  }

  setupStructures() {
    if (!this.userService.currentNetwork) return;
    this.visibleVertices.slice().forEach(vertex => this.unrenderVertex(vertex));
    this.visibleVertices = [];
    this.visibleRelationships = new Map();
    this.network = this.userService.currentNetwork;
    this.changeOffsetFromVertex = this.changeOffsetFromVertex.bind(this);
    this.canvasCategories = this.userService.categories.map(category => {
      let canvasCategory = new CanvasCategory(this.canvasStage, category.id, category.name, category.color, this.scale, this.detailsCallback, this.changeOffsetFromVertex);
      canvasCategory.categories = category.categories;
      canvasCategory.codes = category.codes;
      this.vertexMap.set(category.id, canvasCategory);
      this.categories.set(category.id, category);
      this.visibleRelationships.set(category.id, []);
      let categoryPosition = this.network.positions[category.id];
      if (categoryPosition) {
        canvasCategory.renderVertex(categoryPosition.x - this.offset.x, categoryPosition.y - this.offset.y, this.scale);
        this.visibleVertices.push(canvasCategory);
      }
      return canvasCategory;
    });
    this.canvasCodes = this.userService.codes.map(code => {
      let canvasCode = new CanvasCode(this.canvasStage, code.id, code.name, this.scale, this.detailsCallback, this.changeOffsetFromVertex, { color: code.color });
      this.vertexMap.set(code.id, canvasCode);
      this.codes.set(code.id, code);
      this.visibleRelationships.set(code.id, []);
      let codePosition = this.network.positions[code.id];
      if (codePosition) {
        canvasCode.renderVertex(codePosition.x - this.offset.y, codePosition.y - this.offset.y, this.scale);
        this.visibleVertices.push(canvasCode);
      }
      return canvasCode;
    });
    this.network.relationships.forEach(relationship => {
      let fromVertex = this.vertexMap.get(relationship.from);
      let toVertex = this.vertexMap.get(relationship.to);
      if (!fromVertex || !toVertex) return;
      this.connectVertices(fromVertex, toVertex, {
        title: relationship.title,
        comment: relationship.comment,
        color: relationship.color,
        edgeType: relationship.edgeType,
        arrowFrom: relationship.arrowFrom,
        arrowTo: relationship.arrowTo
      });
    });
    this.areStructuresSetup = true;
    this.structuresUpdated.emit(true);
  }

  changeOffset(x: number, y: number) {
    this.offset.x += x;
    this.offset.y += y;
    this.visibleVertices.forEach(vertex => {
      vertex.vertex.x += x;
      vertex.vertex.y += y;
    });
  }

  changeOffsetFromVertex(x: number, y: number, inputVertex: Vertex) {
    this.offset.x += x;
    this.offset.y += y;
    this.visibleVertices.forEach(vertex => {
      if (vertex.vertex !== inputVertex && !this.canvasStage.selectedVertices.get(vertex.vertex.id)) {
        vertex.vertex.x += x;
        vertex.vertex.y += y;
      }
    })
  }

  changeScaleByAmount(amount: number) {
    this.scale += amount;
    this.canvasStage.changeScaleByAmount(amount);
  }

  private logoutUser() {
    this.network = null;
    this.categories = new Map();
    this.codes = new Map();
    this.vertexMap = new Map();
    this.canvasCategories = [];
    this.canvasCodes = [];
    this.quotations = [];
    this.visibleRelationships = new Map();
    this.visibleVertices = [];
    this.areStructuresSetup = false;
  }

}