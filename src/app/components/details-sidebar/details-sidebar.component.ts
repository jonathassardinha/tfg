import { Component, EventEmitter, Input, Output} from '@angular/core';
import { Edge } from 'src/app/data/Canvas/Edge';

import VertexCategory from 'src/app/data/Canvas/VertexCategory';
import CanvasEdge from '../../data/Canvas/CanvasEdge';
import { NetworkService } from '../../services/network-service';

@Component({
  selector: 'app-details-sidebar',
  templateUrl: 'details-sidebar.component.html',
  styleUrls: ['details-sidebar.component.scss']
})
export class DetailsSidebar {

  @Input() inputVertex?: VertexCategory;
  @Input() inputEdge?: CanvasEdge;

  @Output() closeSidebarEvent = new EventEmitter();

  edgeTypes = Object.keys(Edge.EDGE_TYPES);
  selectedColor: string;

  edgeTypeTranslations = {
    STANDARD: 'Standard',
    DASHED: 'Dashed',
    DOTTED: 'Dotted',
    DOUBLE: 'Double'
  };

  constructor(
    public networkService: NetworkService
  ) {}

  closeSidebar() {
    this.closeSidebarEvent.emit();
  }
}