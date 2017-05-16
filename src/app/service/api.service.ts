import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
const utils = require('app/share/utils.ts');

@Injectable()
export class ApiService {
  constructor (
    public http: Http
  ) { }

  get(api, loading = false): Promise<any> {
    let headers = new Headers();
    let options = new RequestOptions({headers: headers, withCredentials: true});    

    if(api.match(/\/api\/login\/status/i) ||
       api.match(/\/api\/iostlog/i)       ||
       api.match(/\/api\/audit/i)         ||
       api.match(/\/api\/alarm/i)         ||
       api.match(/\/api\/device/i)        ||
       api.match(/\/api\/group/i)         ||
       api.match(/\/api\/odm/i)) {
      if(loading) {
        utils.loadingSpinner(true);    
      } else { // do nothing
        api = api;
      }
    } else {
      utils.loadingSpinner(true);    
    }
    return this.http.get(api, options)
      .toPromise()
      .then(res => {
        let ret = res.json();
        ret['resCode'] = res.status;
        utils.loadingSpinner(false);
        return ret;
      })
      .catch(this.handleError);
  }

  /*
    使用POST 方式取的API 資訊
    data : 要回傳給SERVER的資料
  */
  post(data, api, type = 'json'): Promise<any> {
    let body = data;
    if(type === 'json') {
      body = JSON.stringify(data);
      type = 'application/json';
    } else if(type === 'form') {
      type = undefined;
    } else if(type === 'urlencoded') {
      type = 'application/x-www-form-urlencoded';
    } 
    let headers = new Headers();
    let options = new RequestOptions({headers: headers, withCredentials: true});  

    //修正firefox 無法送出 multipart-data 問題
    if(type) {
      headers.append('Content-Type', type);
    }

    utils.loadingSpinner(true);    
    return this.http.post(api, body, options)
      .toPromise()
      .then(res => {
        let ret = res.json();
        ret['resCode'] = res.status;
        utils.loadingSpinner(false);
        return ret;
      })      
      .catch(this.handleError);
  }

  /*
    使用PUT 方式取的API 資訊
    data : 要回傳給SERVER的資料
  */
  put(data, api, type = 'json'): Promise<any> {
    let body = data;
    if(type === 'json') {
      body = JSON.stringify(data);
      type = 'application/json';
    } else if(type === 'form') {
      type = undefined;
    } else if(type === 'urlencoded') {
      type = 'application/x-www-form-urlencoded';
    } 
    let headers = new Headers();
    let options = new RequestOptions({headers: headers, withCredentials: true});  

    //修正firefox 無法送出 multipart-data 問題
    if(type) {
      headers.append('Content-Type', type);
    }

    utils.loadingSpinner(true);    
    return this.http.put(api, body, options)
      .toPromise()
      .then(res => {
        let ret = res.json();
        ret['resCode'] = res.status;
        utils.loadingSpinner(false);
        return ret;
      })
      .catch(this.handleError);
  }

  /*
    使用delete 方式刪除資料
  */
  delete(api): Promise<any> {
    let headers = new Headers();
    let options = new RequestOptions({headers: headers, withCredentials: true});  

    utils.loadingSpinner(true);    
    return this.http.delete(api, options)
      .toPromise()
      .then(res => {
        let ret = res.json();
        ret['resCode'] = res.status;
        utils.loadingSpinner(false);
        return ret;
      })      
      .catch(this.handleError);
  }

  //錯誤訊息回傳
  handleError(error: any) {
    utils.loadingSpinner(false);
    console.log('Error reponse:', error);
    let ret = error.json();
    ret['resCode'] = error.status;
    return ret;
  }
}

