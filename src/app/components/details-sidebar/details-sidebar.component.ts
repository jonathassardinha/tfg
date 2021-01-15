import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { Subscription } from 'rxjs';
import { Edge } from 'src/app/data/Canvas/Edge';

import VertexCategory from 'src/app/data/Canvas/VertexCategory';
import { UserService } from 'src/app/services/user-service';

@Component({
  selector: 'app-details-sidebar',
  templateUrl: 'details-sidebar.component.html',
  styleUrls: ['details-sidebar.component.scss']
})
export class DetailsSidebar implements AfterViewInit, OnChanges, OnDestroy, OnInit {

  @ViewChildren('networkDescription')
  networkDescriptionQuery: QueryList<HTMLTextAreaElement>;

  networkDescription: HTMLTextAreaElement;

  @Input() inputVertex?: VertexCategory;
  @Input() inputEdge?: Edge;
  @Input() opened: boolean;

  @Output() closeSidebarEvent = new EventEmitter();

  edgeTypes = Object.keys(Edge.EDGE_TYPES);
  selectedColor: string;
  resizeSubscription: Subscription;

  edgeTypeTranslations = {
    STANDARD: 'Standard',
    DASHED: 'Dashed',
    DOTTED: 'Dotted',
    DOUBLE: 'Double'
  };

  constructor(
    public userService: UserService
  ) {}

  ngOnInit() {
    this.resizeSubscription = this.userService.networkSelected.subscribe(() => this.resizeTextArea());
  }

  ngAfterViewInit() {
    this.networkDescriptionQuery.changes.subscribe((elements: QueryList<ElementRef<HTMLTextAreaElement>>) => {
      if (elements.first) {
        this.networkDescription = elements.first.nativeElement;
        this.networkDescription.style.height = this.networkDescription.scrollHeight + 'px';
      }
    });
  }

  ngOnChanges() {
    if (this.networkDescription) {
      this.networkDescription.value = this.networkDescription.value + '';
      this.networkDescription.style.height = this.networkDescription.scrollHeight + 'px';
    }
  }

  ngOnDestroy() {
    this.resizeSubscription.unsubscribe();
  }

  closeSidebar() {
    this.closeSidebarEvent.emit();
  }

  resizeTextArea() {
    if (this.networkDescription) {
      this.networkDescription.value = this.networkDescription.value + '';
      this.networkDescription.style.height = '1px';
      this.networkDescription.style.height = this.networkDescription.scrollHeight + 'px';
    }
  }
}