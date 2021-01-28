import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import Code from 'src/app/data/Code';
import Fragment from 'src/app/data/Fragment';

@Component({
  selector: 'app-tag-element',
  templateUrl: './tag-element.component.html',
  styleUrls: ['./tag-element.component.scss']
})

export class TagElementComponent {

  @Input() codes: Code[]
  @Input() fragment: Fragment
  @Input() divStyle

  @Output() mouseover = new EventEmitter<any>()
  @Output() mouseout = new EventEmitter<any>()

  @ViewChild ('indicator') public indicator: ElementRef<HTMLDivElement>

  constructor( ) {
  }

}
