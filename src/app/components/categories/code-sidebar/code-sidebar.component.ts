import { Component, Input, OnInit } from '@angular/core';
import Code from 'src/app/data/Code';

@Component({
  selector: 'app-code-sidebar',
  templateUrl: './code-sidebar.component.html',
  styleUrls: ['./code-sidebar.component.scss']
})
export class CodeSidebarComponent implements OnInit {

  @Input() public selectedCode: Code

  constructor() { }

  ngOnInit(): void {
  }

}
