import { Component, ViewEncapsulation, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service';
import { UserLoginDialog } from '../user-login/user-login.component';
import { MatSidenav } from '@angular/material/sidenav';
import { CanvasNetworkService } from 'src/app/services/canvas-network-service';
import { UserService } from 'src/app/services/user-service';
import { Subscription } from 'rxjs';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

interface NavItem {
  text: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavBarComponent implements OnInit, OnDestroy {
  connectionSubscription: Subscription;
  savingNetworkSubscription: Subscription;
  loadingProjectsSubscription: Subscription;

  snackbarRef: MatSnackBarRef<TextOnlySnackBar>;

  savingNetwork = false;
  routerSidenavOpen = true;
  projectId: string;
  navItems: NavItem[] = [];

  @ViewChild('snav', { static: false }) snavRef: MatSidenav;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public authService: AuthService,
    public userService: UserService,
    private dialog: MatDialog,
    private canvasNetworkService: CanvasNetworkService,
    private snackbar: MatSnackBar
  ) {
    this.canvasNetworkService.savingNetworkEvent.subscribe((isSaving: boolean) => this.savingNetwork = isSaving);
    this.connectionSubscription = this.userService.connectionEvent.subscribe(isConnected => {
      if (!isConnected) {
        this.snackbarRef = this.snackbar.open('You are offline', '', { panelClass: 'error-snackbar', duration: 0 });
      } else {
        if (this.snackbarRef) this.snackbarRef.dismiss();
      }
    })
    this.userService.loadingUserProjects.subscribe((isLoading: boolean) => {
      if (!isLoading && this.userService.currentProject) {
        this.projectId = this.userService.currentProject.id;
        this.navItems = [
          {
            text: 'Projects',
            route: '/projects',
            icon: 'content_paste',
          },
          {
            text: 'Sources',
            route: '/projects/'+ this.projectId +'/sources',
            icon: 'description',
          },
          {
            text: 'Codebook',
            route: '/projects/'+ this.projectId +'/categories',
            icon: 'format_list_bulleted',
          },
          {
            text: 'Networks',
            route: '/projects/'+ this.projectId +'/networks',
            icon: 'share',
          },
        ];
      }
    })
  }

  async ngOnInit() {
    let loggedInUsername = localStorage.getItem('userUsername');
    if (loggedInUsername) {
      await this.userService.loginUserWithData(loggedInUsername, true);
    }
  }

  ngOnDestroy() {
    this.connectionSubscription.unsubscribe();
    this.loadingProjectsSubscription.unsubscribe();
    this.savingNetworkSubscription.unsubscribe();
  }

  loginUser() {
    this.dialog.open(UserLoginDialog, {
      width: '300px'
    });
  }

  logoutUser() {
    this.userService.logoutUser();
    this.router.navigate(['/projects']);
  }

  async saveChanges() {
    await this.canvasNetworkService.saveChanges();
  }

}
