import { EventEmitter, Injectable } from "@angular/core";
import { CodeRepository } from '../storage/firestore/CodeRepository';
import Code from "../data/Code";
import { AuthService } from "./auth-service";
import { ProjectService } from "./project-service";

@Injectable({
  providedIn: 'root'
})
export class CodeService {

  constructor (
    private codeRepository: CodeRepository
  ) {}

  async getCodesByIds(ids: string[]) {
    let codes: Code[] = [];
    for (let i = 0; i < ids.length; i+=10) {
      let queryArray = ids.slice(i, i+10);
      codes.push(...await this.codeRepository.getByIds(queryArray));
    }

    return codes;
  }

  async saveCode(code: Code, catIds: string[]) {
    await this.codeRepository.saveToCategories(code, catIds);
  }

  async updateCodes(updateData: Partial<Code>[]) {
    for (let data of updateData) {
      await this.codeRepository.updateById(data.id, data);
    }
  }
}
