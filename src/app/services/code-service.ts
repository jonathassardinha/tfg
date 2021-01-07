import { EventEmitter, Injectable } from "@angular/core";
import { CodeRepository } from '../storage/firestore/CodeRepository';
import Code from "../data/Code";
import { AuthService } from "./auth-service";
import { ProjectService } from "./project-service";

@Injectable({
  providedIn: 'root'
})
export class CodeService {

  public loadingCodes = new EventEmitter<boolean>();
  public codes: Code[] = [];
  public areCodesLoaded = false;

  constructor (
    private codeRepository: CodeRepository,
    private authService: AuthService,
    private projectService: ProjectService
  ) {
    this.authService.userLogEvent.subscribe(eventType => {
      if (eventType === 'logout') {
        this.logoutUser();
      }
    });
  }

  async loadUserCodes() {
    this.loadingCodes.emit(true);
    if (this.authService.user && !this.areCodesLoaded) {
      this.codes = await this.getCodesByIds(this.projectService.currentProject.codes);
      this.areCodesLoaded = true;
    }
    this.loadingCodes.emit(true);
  }

  async getCodesByIds(ids: string[]) {
    return await this.codeRepository.getByIds(ids);
  }

  async saveCode(code: Code, catIds: string[]) {
    await this.codeRepository.saveToCategories(code, catIds);
  }

  async updateCodes(updateData: Partial<Code>[]) {
    for (let data of updateData) {
      await this.codeRepository.updateById(data.id, data);
    }
  }

  private logoutUser() {
    this.areCodesLoaded = false;
    this.codes = [];
  }

}
