import { Component, OnInit } from '@angular/core';
import Project from 'src/app/data/Project';
import Source from 'src/app/data/Source';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.scss']
})
export class SourcesComponent implements OnInit {

  currentProject: Project;
  projectSubscription: Subscription;

  sources: Source[] = [];
  sourceSubscription: Subscription;

  loadingSources = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  async ngOnInit() {
    if (!this.userService.currentProject) {
      this.router.navigate(['projects']);
      return;
    }
    
    this.currentProject = this.userService.currentProject;
    if (!this.userService.sources || this.userService.sources.length === 0) {
      this.loadingSources = true;
      await this.userService.loadUserSources();
      this.loadingSources = false;
    }
    this.sources = this.userService.sources;
  }
}
