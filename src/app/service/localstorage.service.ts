import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  constructor (
  ) {}

  get(key: string) {
    return window.localStorage[key];
  }

  put(key, val) {
    window.localStorage[key] = val;
  }

  delete(key) {
    delete window.localStorage[key];
  }

  deleteAll() {
    for(let key in window.localStorage) {
      delete window.localStorage[key];
    }
  }

}