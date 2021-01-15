import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
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
import { UserService, LOCAL_STORAGE_KEYS } from 'src/app/services/user-service';
import { CreationDialog, CreationDialogData } from './creation-dialog/creation-dialog.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {

  @ViewChild('projectCanvas', { static: true }) canvasRef: ElementRef<HTMLCanvasElement>;

  usernameControl = new FormControl('', [Validators.required]);

  snackbarRef: MatSnackBarRef<TextOnlySnackBar>;
  projectSubscription: Subscription;
  loginSubscription: Subscription;
  projects: Project[] = [];

  canvas: HTMLCanvasElement;
  canvasStage: CanvasStage;
  stage: Stage;
  devicePixelRatio: number;
  vertices: Vertex[] = [];

  verticesSetup = false;

  code1: CanvasCode;
  code2: CanvasCode;
  code3: CanvasCode;
  category: CanvasCategory;

  loadingUser = false;
  loadingProjects = false;

  constructor(
    public userService: UserService,
    public projectService: ProjectService,
    public snackbar: MatSnackBar,
    public matDialog: MatDialog
  ) {
    this.loginSubscription = this.userService.loggingInUser.subscribe(isLoggingIn => {
      this.loadingUser = isLoggingIn;
    })
    this.projectSubscription = this.userService.loadingUserProjects.subscribe((isLoading: boolean) => {
      this.loadingProjects = isLoading;
      if (!isLoading) this.projects = this.userService.projects;
    });
  }

  async ngOnInit() {
    this.setupCanvas();
    this.createAnimation();
    if (!this.userService.user && !this.userService.isAppConnected && localStorage.getItem(LOCAL_STORAGE_KEYS.username)) {
      this.loadingUser = true;
    }
    if (this.userService.user && this.userService.projects) {
      this.projects = this.userService.projects;
    }
  }

  ngOnDestroy() {
    this.projectSubscription.unsubscribe();
    this.loginSubscription.unsubscribe();
  }

  openCreationDialog(typeOfCreation: 'user' | 'project') {
    this.matDialog.open<CreationDialog, CreationDialogData>(CreationDialog, {
      data: {
        typeOfCreation: typeOfCreation
      }
    });
  }

  async loginUser() {
    if (this.usernameControl.valid) {
      this.loadingUser = true;
      try {
        await this.userService.loginUser(this.usernameControl.value, true);
      } catch (error) {
        if (error instanceof AppError) {
          this.snackbar.open(error.description, 'Close', { panelClass: 'error-snackbar', duration: 3000 });
        }
      }

      if (!this.userService.user) {
        this.snackbar.open('User not found', 'Close', {duration: 2000});
        this.loadingUser = false;
        return;
      }

      this.loadingProjects = true;
      try {
        await this.userService.loadUserProjects();
        this.projects = this.userService.projects;
      } catch (error) {
        if (error instanceof AppError) {
          this.snackbar.open(error.description, 'Close', { panelClass: 'error-snackbar', duration: 3000 });
        }
      }
      this.loadingProjects = false;
      this.loadingUser = false;
    } else {
      this.usernameControl.markAsDirty();
    }
  }

  async logoutUser() {
    this.projects = [];
    await this.userService.logoutUser();
  }

  @HostListener('window:resize')
  onResize() {
    this.canvasStage.redraw();

    if (this.verticesSetup) {
      let width = window.innerWidth;
      let height = window.innerHeight;

      this.code1.vertex.x = width * 0.4;
      this.code1.vertex.y = height * 0.3;

      this.code2.vertex.x = width * 0.6;
      this.code2.vertex.y = height * 0.5;

      this.code3.vertex.x = width * 0.4;
      this.code3.vertex.y = height * 0.7;

      this.category.vertex.x = width * 0.2;
      this.category.vertex.y = height * 0.5;

      Tween.get(this.code1.vertex, { loop: true })
        .to({ x: width * 0.45, y: height * 0.25 }, 4000, Ease.quadInOut)
        .to({ x: width * 0.4, y: height * 0.3 }, 4000, Ease.backInOut);

      Tween.get(this.code2.vertex, { loop: true })
        .to({ x: width * 0.65, y: height * 0.45 }, 4000, Ease.quadInOut)
        .to({ x: width * 0.62, y: height * 0.55 }, 4000, Ease.quadInOut)
        .to({ x: width * 0.6, y: height * 0.5 }, 4000, Ease.quadInOut);

      Tween.get(this.category.vertex, { loop: 1, bounce: true })
        .to({ x: width * 0.15, y: height * 0.45 }, 4000, Ease.getPowInOut(2))
        .to({ x: width * 0.1, y: height * 0.55 }, 4000, Ease.sineIn)
        .to({ x: width * 0.2, y: height * 0.5 }, 4000, Ease.backInOut);
    }
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
    this.code1 = new CanvasCode(this.canvasStage, '0', '', 1, () => { }, () => { }, { color: '#FFA4A4' });
    this.code2 = new CanvasCode(this.canvasStage, '0', '', 1, () => { }, () => { }, { color: '#99A4FF' });
    this.code3 = new CanvasCode(this.canvasStage, '0', '', 1, () => { }, () => { }, { color: '#93BB8F' });
    this.category = new CanvasCategory(this.canvasStage, '0', '', '#93BB8F', 1, () => { }, () => { });

    // code1.renderVertex(width*0.4, height*0.3, 1);
    this.code1.renderVertex(0, 0, 1);
    this.code2.renderVertex(0, 0, 1);
    this.code3.renderVertex(0, 0, 1);
    this.category.renderVertex(0, 0, 1);

    let edge1 = new CanvasEdge(this.canvasStage, 'gray', this.category, this.code1, () => { });
    edge1.renderArcAtBeggining();
    edge1.edge.title = '';
    let edge2 = new CanvasEdge(this.canvasStage, 'gray', this.category, this.code2, () => { });
    edge2.renderArcAtBeggining();
    edge2.edge.title = '';
    let edge3 = new CanvasEdge(this.canvasStage, 'gray', this.category, this.code3, () => { });
    edge3.renderArcAtBeggining();
    edge3.edge.title = '';
    let edge4 = new CanvasEdge(this.canvasStage, 'gray', this.code1, this.code3, () => { });
    edge4.renderArcAtBeggining();
    edge4.edge.title = '';

    Ticker.framerate = 60;
    Ticker.addEventListener("tick", this.stage);

    this.verticesSetup = true;
    this.onResize();
  }

}
