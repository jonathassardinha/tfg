import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, ViewChild, ElementRef, ViewEncapsulation, HostListener, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import VertexCategory from 'src/app/data/Canvas/VertexCategory';
import CanvasEdge from 'src/app/data/Canvas/CanvasEdge';
import { RelationshipDialog } from './relationship-dialog/relationship-dialog.component';
import { CanvasNetworkService } from 'src/app/services/canvas-network-service';
import { NetworkService } from 'src/app/services/network-service';
import { UserService } from 'src/app/services/user-service';
import { ActivatedRoute } from '@angular/router';

interface VertexNode {
  id: number;
  name: string;
  color: string;
  textColor: string;
  type: string;
  children?: VertexNode[];
}

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NetworkComponent implements OnInit, OnDestroy {

  @ViewChild('canvas', {static: true}) canvasRef: ElementRef<HTMLCanvasElement>;
  @ViewChild('sidenav') sidenavRef: MatSidenav;
  @ViewChild('details') detailsRef: MatSidenav;
  @ViewChild('dragger') draggerRef: ElementRef<HTMLDivElement>;
  @ViewChild('trigger') trigger: ElementRef<HTMLDivElement>;
  @ViewChild('matTrigger') matTrigger: MatMenuTrigger;

  treeControl = new NestedTreeControl<VertexNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<VertexNode>();

  canvas: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;
  focusedDetailsNode: VertexCategory;
  selectedDetailsNode: VertexCategory;
  focusedEdge: CanvasEdge;
  selectedEdge: CanvasEdge;

  sidenavHover = false;
  isOpeningMenu = false;

  private onContextMenu;

  constructor(
    private route: ActivatedRoute,
    public canvasNetworkService: CanvasNetworkService,
    public networkService: NetworkService,
    public userService: UserService,
    public relationshipDialog: MatDialog,
  ) {}

  async ngOnInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.onContextMenu = (event: MouseEvent) => {
      if (!this.isOpeningMenu) {
        (event.target as HTMLDivElement).click();
      }
      this.isOpeningMenu = false;
      event.preventDefault();
    }
    document.addEventListener("contextmenu", this.onContextMenu, false);

    if (!this.userService.currentNetwork) {
      await this.userService.loadUserNetworksData();
    }

    this.canvasNetworkService.setupCanvasStage(this.canvas,
      (event: MouseEvent, vertex: VertexCategory) => this.openDetailsMenu(event, vertex),
      (event: MouseEvent, edge: CanvasEdge) => this.openEdgeMenu(event, edge));
  }

  ngOnDestroy(): void {
    document.removeEventListener("contextmenu", this.onContextMenu, false);
    this.canvasNetworkService.areStructuresSetup = false;
  }

  openDetailsMenu(event: MouseEvent, vertex: VertexCategory) {
    this.isOpeningMenu = true;
    this.focusedDetailsNode = vertex;
    this.focusedEdge = null;
    this.trigger.nativeElement.style.left = event.clientX + 5 + 'px';
    this.trigger.nativeElement.style.top = event.clientY + 5 + 'px';
    this.matTrigger.openMenu();
  }

  openEdgeMenu(event: MouseEvent, edge: CanvasEdge) {
    this.isOpeningMenu = true;
    this.focusedDetailsNode = null;
    this.focusedEdge = edge;
    this.trigger.nativeElement.style.left = event.clientX + 5 + 'px';
    this.trigger.nativeElement.style.top = event.clientY + 5 + 'px';
    this.matTrigger.openMenu();
  }

  openDetailsSidenav() {
    this.selectedDetailsNode = this.focusedDetailsNode;
    this.selectedEdge = this.focusedEdge;
    this.detailsRef.open();
  }

  openRelationshipDialog() {
    this.relationshipDialog.open(RelationshipDialog, {
      data: {
        vertex: this.focusedDetailsNode
      }
    })
  }

  removeVertex() {
    this.canvasNetworkService.unrenderVertex(this.focusedDetailsNode);
  }

  filteredVertices(currentVertex: VertexCategory) {
    return this.canvasNetworkService.visibleVertices.filter(vertex => vertex.id !== currentVertex.id);
  }

  @HostListener('window:resize')
  onResize() {
    this.canvasNetworkService.redraw();
  }

}
