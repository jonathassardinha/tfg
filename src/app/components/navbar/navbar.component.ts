import { Component, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service';
import { UserLoginDialog } from '../user-login/user-login.component';
import { MatSidenav } from '@angular/material/sidenav';
import { CanvasNetworkService } from 'src/app/services/canvas-network-service';
import { UserService } from 'src/app/services/user-service';

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
export class NavBarComponent implements OnInit {
  savingNetwork = false;
  routerSidenavOpen = true;
  projectId = '1'
  navItems: NavItem[] = [
    {
      text: 'Projetos',
      route: '/projects',
      icon: 'content_paste',
    },
    {
      text: 'Fontes',
      route: '/projects/'+ this.projectId +'/sources',
      icon: 'description',
    },
    {
      text: 'Categorias',
      route: '/projects/'+ this.projectId +'/categories',
      icon: 'format_list_bulleted',
    },
    {
      text: 'Rede',
      route: '/projects/'+ this.projectId +'/networks',
      icon: 'share',
    },
  ];

  @ViewChild('snav', { static: false }) snavRef: MatSidenav;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public authService: AuthService,
    public userService: UserService,
    private dialog: MatDialog,
    private canvasNetworkService: CanvasNetworkService
  ) {
    this.canvasNetworkService.savingNetworkEvent.subscribe((isSaving: boolean) => this.savingNetwork = isSaving);
  }

  async ngOnInit() {
    let loggedInUsername = localStorage.getItem('userUsername');
    if (loggedInUsername) {
      await this.userService.loginUserWithData(loggedInUsername, true);
    }
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
