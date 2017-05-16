import { Injectable } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { LocalStorageService } from '../service/localstorage.service';

@Injectable()
export class GlobalService {
  constructor (
    public translate: TranslateService,
    public localStor: LocalStorageService,
  ) {}

  showMsg(obj, key): void {
    obj.message = this.langStr(key);
    obj.errorMessage = '';
    let wrapper = document.getElementById("wrapper");
    wrapper.scrollTop = 0;
  }

  showErrMsg(obj, key): void {
    obj.message = '';
    obj.errorMessage = this.langStr(key);
    let wrapper = document.getElementById("wrapper");
    wrapper.scrollTop = 0;
  }

  //取得多國文字
  langStr(key: string) {
    let result = key;
    try {
      result = this.translate.instant(key);
    } catch(e) {      
      result = key;
    }
    return result;
  }

  //設定目前語系
  setlang(lang: string) {
    this.translate.use(lang);
  }
}