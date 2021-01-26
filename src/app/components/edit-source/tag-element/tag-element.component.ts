import { Component, ElementRef, EventEmitter, Inject, Injectable, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import Code from 'src/app/data/Code';
import Fragment from 'src/app/data/Fragment';
import { FragmentService } from 'src/app/services/fragment-service';

@Component({
  selector: 'app-tag-element',
  templateUrl: './tag-element.component.html',
  styleUrls: ['./tag-element.component.scss']
})

export class TagElementComponent implements OnInit {

  @Input() codes: Code[]
  @Input() fragment: Fragment
  @Input() divStyle

  @Output() mouseover = new EventEmitter<any>()
  @Output() mouseout = new EventEmitter<any>()

  @ViewChild ('indicator') public indicator: ElementRef<HTMLDivElement>

  constructor( ) {
  }

  ngOnInit(): void {
    console.log("Here")
  }

}
