import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, ViewChild, ElementRef, ViewEncapsulation, HostListener, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import CanvasCategory from '../../data/Canvas/CanvasCategory';
import { NetworkService } from "../../services/network-service";
import CanvasCode from 'src/app/data/Canvas/CanvasCode';
import { CanvasNetworkService } from 'src/app/services/canvas-network-service';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category-service';
import { CodeService } from 'src/app/services/code-service';

interface VertexNode {
  id: string;
  name: string;
  color: string;
  textColor: string;
  children?: VertexNode[];
}

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TreeView implements OnInit, OnDestroy {

  @ViewChild('dragger') draggerRef: ElementRef<HTMLDivElement>;

  @Input() sidenav: MatSidenav;
  @Input() showHandle: boolean;

  treeControl = new NestedTreeControl<VertexNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<VertexNode>();
  updateStructuresSubscription: Subscription;
  loadingCategoriesSubscription: Subscription;
  loadingCodesSubscription: Subscription;

  sidebarVertexTree: VertexNode[] = [];
  dragImg: HTMLImageElement;
  mousePosition = {
    x: 0,
    y: 0
  };

  isNetworkLoading = false;

  constructor(
    public networkService: NetworkService,
    public canvasNetworkService: CanvasNetworkService,
    public categoryService: CategoryService,
    public codeService: CodeService
  ) {}

  ngOnInit(): void {
    this.updateStructuresSubscription = this.canvasNetworkService.structuresUpdated.subscribe(() => {
      this.isNetworkLoading = true;
      this.setupTree();
      this.isNetworkLoading = false;
    });
    this.loadingCategoriesSubscription = this.categoryService.loadingCategories.subscribe(isLoading => {
      this.isNetworkLoading = true;
      if (!isLoading) {
        this.setupTree();
        this.isNetworkLoading = false;
      }
    });
    this.loadingCodesSubscription = this.codeService.loadingCodes.subscribe(isLoading => {
      this.isNetworkLoading = true;
      if (!isLoading) {
        this.setupTree();
        this.isNetworkLoading = false;
      }
    });
    this.dragImg = new Image(0,0);
    this.dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  }

  ngOnDestroy() {
    this.loadingCategoriesSubscription.unsubscribe();
    this.loadingCodesSubscription.unsubscribe();
    this.updateStructuresSubscription.unsubscribe();
  }

  hasChildren(_: any, node: VertexNode) {return !!node.children && node.children.length > 0}

  hideGhost(event: DragEvent, node: VertexNode) {
    event.dataTransfer.setDragImage(this.dragImg, 0, 0);
    this.draggerRef.nativeElement.style.background = node.color;
    this.draggerRef.nativeElement.style.color = node.textColor;
    this.draggerRef.nativeElement.innerHTML = node.name;
  }

  changeDragElement(event: DragEvent) {
    event.preventDefault();
    if (event.x < this.sidenav._getWidth()) {
      this.draggerRef.nativeElement.style.filter = "brightness(70%)";
      this.draggerRef.nativeElement.style.opacity = "0.6";
    } else {
      this.draggerRef.nativeElement.style.opacity = "1";
      this.draggerRef.nativeElement.style.filter = "brightness(100%)";
    }
    if (event.y !== 0) this.draggerRef.nativeElement.style.top = event.y - 60 - this.draggerRef.nativeElement.clientHeight/2 + 'px';
    if (event.x !== 0) this.draggerRef.nativeElement.style.left = event.x - this.draggerRef.nativeElement.clientWidth/2 + 'px';

    this.draggerRef.nativeElement.style.display = 'block';
  }

  hideDragElement(event: DragEvent, node: VertexNode) {
    this.draggerRef.nativeElement.style.display = 'none';

    if (event.x > this.sidenav._getWidth()) this.canvasNetworkService.renderVertex(node.id, event.x, event.y - 60);
  }

  private setupTree() {
    this.sidebarVertexTree = [];
    let remainingCodes: Map<string, CanvasCode> = new Map();
    this.canvasNetworkService.canvasCodes.slice().forEach(code => remainingCodes.set(code.id, code));

    let builtCategories = new Map<string, {node: VertexNode, parent?: string}>();

    this.canvasNetworkService.canvasCategories.forEach(canvasCategory => {
      if (!builtCategories.get(canvasCategory.id))
       this.sidebarVertexTree.push(this.getCategoryTree(canvasCategory, remainingCodes, builtCategories));
    });
    this.sidebarVertexTree = this.sidebarVertexTree.filter(node => !builtCategories.get(node.id).parent);
    [...remainingCodes.values()].forEach(canvasCode => {
      this.sidebarVertexTree.push({
        id: canvasCode.id,
        name: canvasCode.name,
        color: canvasCode.color,
        textColor: canvasCode.vertex.textColor
      });
    });

    this.dataSource.data = this.sidebarVertexTree;
  }

  private getCategoryTree(canvasCategory: CanvasCategory, remainingCodes: Map<string, CanvasCode>, builtCategories: Map<string, {node: VertexNode, parent?: string}>): VertexNode {
    let children = canvasCategory.categories.map(subCategoryId => {
      let existingChild = builtCategories.get(subCategoryId);
      if (existingChild) {
        existingChild.parent = canvasCategory.id;
        return builtCategories.get(subCategoryId).node;
      }
      return this.getCategoryTree(
        this.canvasNetworkService.getVertexById(subCategoryId) as CanvasCategory,
        remainingCodes,
        builtCategories
      );
    });
    canvasCategory.codes.forEach(canvasCodeId => {
      let canvasCode = this.canvasNetworkService.getVertexById(canvasCodeId);
      remainingCodes.delete(canvasCode.id);
      children.push({
        id: canvasCodeId,
        name: canvasCode.name,
        color: canvasCode.color,
        textColor: canvasCode.vertex.textColor
      });
    });
    let category = {
      id: canvasCategory.id,
      name: canvasCategory.name,
      color: canvasCategory.color,
      textColor: canvasCategory.vertex.textColor,
      children: children
    };
    builtCategories.set(canvasCategory.id, {node: category});
    return category;
  }

}
