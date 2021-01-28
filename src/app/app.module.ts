import { BrowserModule } from '@angular/platform-browser';
import { NgModule, OnInit } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { ImportsModule } from 'src/app/common/imports.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ComposeComponent } from './components/compose/compose.component';
import { NavBarComponent } from './components/navbar/navbar.component';
import { NetworkComponent } from './components/network/network.component';
import { RelationshipDialog } from "./components/network/relationship-dialog/relationship-dialog.component";
import { DetailsSidebar } from "./components/details-sidebar/details-sidebar.component";
import { TreeView } from "./components/tree-view/tree-view.component";
import { UserLoginDialog } from './components/user-login/user-login.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { CreationDialog } from './components/projects/creation-dialog/creation-dialog.component';
import { CodeSidebarComponent } from './components/categories/code-sidebar/code-sidebar.component';

import { NetworkService } from './services/network-service';;
import { ProjectService } from './services/project-service';
import { CategoryService } from './services/category-service';
import { CodeService } from './services/code-service';
import { AuthService } from './services/auth-service';
import { CanvasNetworkService } from './services/canvas-network-service'
import { UserService } from './services/user-service'
import { SourceService } from './services/source-service';

import { environment } from 'src/environments/environment';
import { SourcesComponent } from './components/sources/sources.component';
import { EditSourceComponent } from './components/edit-source/edit-source.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { NewCategoryDialogComponent } from './components/categories/new-category-dialog/new-category-dialog.component';
import { TaggingDialogComponent } from './components/edit-source/tagging-dialog/tagging-dialog.component';
import { NetworkDialog } from './components/network/network-dialog/network-dialog.component';
import { NewCodeDialogComponent } from './components/edit-source/new-code-dialog/new-code-dialog.component';
import { TagElementComponent } from './components/edit-source/tag-element/tag-element.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    AppComponent,
    ComposeComponent,
    NavBarComponent,
    NetworkComponent,
    RelationshipDialog,
    NetworkDialog,
    DetailsSidebar,
    TreeView,
    UserLoginDialog,
    ProjectsComponent,
    SourcesComponent,
    EditSourceComponent,
    CategoriesComponent,
    NewCategoryDialogComponent,
    TaggingDialogComponent,
    NewCodeDialogComponent,
    TagElementComponent,
    CreationDialog,
    CodeSidebarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    EditorModule,
    ImportsModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    ColorPickerModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule
  ],
  providers: [
    {provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js'},
    NetworkService,
    ProjectService,
    CategoryService,
    CodeService,
    AuthService,
    CanvasNetworkService,
    UserService,
    SourceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
