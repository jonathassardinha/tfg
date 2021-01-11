import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ease, Stage, Ticker, Touch, Tween } from 'createjs-module';
import { Subscription } from 'rxjs';
import CanvasCategory from 'src/app/data/Canvas/CanvasCategory';
import CanvasCode from 'src/app/data/Canvas/CanvasCode';
import CanvasEdge from 'src/app/data/Canvas/CanvasEdge';
import CanvasStage from 'src/app/data/Canvas/CanvasStage';
import Vertex from 'src/app/data/Canvas/Vertex';
import Project from 'src/app/data/Project';
import { AppError } from 'src/app/errors/app-error';
import { ProjectService } from 'src/app/services/project-service';
import { UserService } from 'src/app/services/user-service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {

  @ViewChild('projectCanvas', {static: true}) canvasRef: ElementRef<HTMLCanvasElement>;

  emailControl = new FormControl('', [Validators.required, Validators.email]);

  projectSubscription: Subscription;
  projects: Project[] = [];

  canvas: HTMLCanvasElement;
  canvasStage: CanvasStage;
  stage: Stage;
  devicePixelRatio: number;
  vertices: Vertex[] = [];

  loadingUser = false;
  loadingProjects = false;

  constructor(
    public userService: UserService,
    public projectService: ProjectService,
    public snackbar: MatSnackBar
  ) {
    this.projectSubscription = this.userService.loadingUserProjects.subscribe((isLoading: boolean) => {
      this.loadingProjects = isLoading;
      if (!isLoading) this.projects = this.userService.projects;
    });
  }

  async ngOnInit() {
    this.setupCanvas();
    this.createAnimation();
    if (this.userService.user && this.userService.projects) {
      this.projects = this.userService.projects;
    }
  }

  ngOnDestroy() {
    this.projectSubscription.unsubscribe();
  }

  @HostListener('window:resize')
  onResize() {
    this.canvasStage.redraw();
  }

  async loginUser() {
    if (this.emailControl.valid) {
      this.loadingUser = true;
      try {
        await this.userService.loginUser(this.emailControl.value, true);
      } catch (error) {
        if (error instanceof AppError) {
          this.snackbar.open(error.description, 'Close', {panelClass: 'error-snackbar', duration: 3000});
        }
      }
      this.loadingUser = false;

      try {
        this.loadingProjects = true;
        await this.userService.loadUserProjects();
        this.projects = this.userService.projects;
      } catch (error) {
        if (error instanceof AppError) {
          this.snackbar.open(error.description, 'Close', {panelClass: 'error-snackbar', duration: 3000});
        }
      }
      this.loadingProjects = false;
    } else {
      this.emailControl.markAsDirty();
    }
  }

  async logoutUser() {
    this.projects = [];
    await this.userService.logoutUser();
  }

  private setupCanvas() {
    this.canvas = this.canvasRef.nativeElement;
    this.canvasStage = new CanvasStage(this.canvas);
    this.stage = this.canvasStage.stage;

    Ticker.timingMode = Ticker.RAF_SYNCHED;
    Ticker.framerate = 60;

    Touch.enable(this.stage);

    this.onResize();
  }

  private createAnimation() {
    let code1 = new CanvasCode(this.canvasStage, '0', '', {color: '#FFA4A4'}, () => {}, () => {});
    let code2 = new CanvasCode(this.canvasStage, '0', '', {color: '#99A4FF'}, () => {}, () => {});
    let code3 = new CanvasCode(this.canvasStage, '0', '', {color: '#93BB8F'}, () => {}, () => {});
    let category = new CanvasCategory(this.canvasStage, '0', '', '#93BB8F', () => {}, () => {});

    code1.renderVertex(550, 300);
    code2.renderVertex(900, 500);
    code3.renderVertex(700, 750);
    category.renderVertex(300, 550);

    let edge1 = new CanvasEdge(this.canvasStage, 'gray', category, code1, () => {});
    edge1.renderArcAtBeggining();
    edge1.title = '';

    let edge2 = new CanvasEdge(this.canvasStage, 'gray', category, code2, () => {});
    edge2.renderArcAtBeggining();
    edge2.title = '';

    let edge3 = new CanvasEdge(this.canvasStage, 'gray', category, code3, () => {});
    edge3.renderArcAtBeggining();
    edge3.title = '';

    let edge4 = new CanvasEdge(this.canvasStage, 'gray', code1, code3, () => {});
    edge4.renderArcAtBeggining();
    edge4.title = '';

    Tween.get(code1.vertex, {loop: true})
    .to({x: 600, y: 250}, 4000, Ease.quadInOut)
    .to({x: 550, y: 300}, 4000, Ease.backInOut);

    Tween.get(category.vertex, { loop: 1, bounce: true })
    .to({x: 250, y: 500}, 4000, Ease.getPowInOut(2))
    .to({x: 200, y: 600}, 4000, Ease.sineIn)
    .to({x: 300, y: 550}, 4000, Ease.backInOut);

    Ticker.framerate = 60;
    Ticker.addEventListener("tick", this.stage);
  }

}
