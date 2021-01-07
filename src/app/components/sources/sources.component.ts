import { Component, OnInit } from '@angular/core';
import Project from 'src/app/data/Project';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database-service';
import Source from 'src/app/data/Source';
import { Subscription } from 'rxjs';
import { ProjectService } from 'src/app/services/project-service';

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.scss']
})
export class SourcesComponent implements OnInit {

  currentProject: Project;
  projectSubscription: Subscription;

  sources: Source[]
  sourceSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private databaseService: DatabaseService,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    let projId = this.route.snapshot.paramMap.get('projId')
    this.projectSubscription = this.projectService.getProject(projId).subscribe(
      project => this.currentProject = project
    )
    this.sourceSubscription = this.databaseService.getAllSources().subscribe(
      sources => this.sources = sources.filter(source => this.currentProject.sources.includes(source.id))
    )
  }

  // async getSources(){
  //   // const projId = this.route.snapshot.paramMap.get('projId');
  //   const projId = '1';
  //   let project = await this.databaseService.getProjectById(projId);
  //   return await this.databaseService.getSourcesByIds(project.sources);
  // }
}
