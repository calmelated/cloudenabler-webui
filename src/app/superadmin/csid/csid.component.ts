import { Component, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ApiService, GlobalService } from 'app/service';

@Component({
  selector: 'csid',
  styleUrls: [ 'csid.component.css' ],
  templateUrl: 'csid.component.html'
})
export class CSID {
  header: {[key: string]: any} = {collspse: false, title: 'csid'};
  configList: {[key: string]: any};
  configKeys: {[key: string]: any};
  editKey: string;
  editValue: string;
  statusList: {[key: string]: any};
  statusKeys: {[key: string]: any};
  curType: string;

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private global: GlobalService
  ) {
    this.getConfig();
    this.getStatus();
  }

  //取得CSID 列表
  getConfig() {    
    this.api.get("/api/csid/c/dump").then((data: {[key: string]: any}) => {
      if(data['resCode'] !== 200) {
        return;
      } else {
        delete data['resCode'];
      }
      this.configList = data;
      this.configKeys = Object.keys(data);
    });
  }

  //取得Status 列表
  getStatus() {
    this.api.get("/api/csid/s/dump").then((data: {[key: string]: any}) => {
      if(data['resCode'] !== 200) {
        return;
      } else {
        delete data['resCode'];
      }      
      this.statusList = data;
      this.statusKeys = Object.keys(data);
    });
  }


  /*
    編輯CSID 數值
  */
  @ViewChild('ModalEdit')
  ModalEdit: ModalComponent;

  editCSID(type, key) {
    this.curType = type;
    this.editKey = key;
    this.editValue = (type === 'config') ? this.configList[key] : this.statusList[key];
    this.ModalEdit.open();
  }

  sendCSID() {
    let data = {};
    data[this.editKey] = this.editValue;
    let api = (this.curType === 'config') ? '/api/csid/c' : '/api/csid/s' ;
    this.ModalEdit.close();
    this.header['errorMessage'] = '';
    this.api.put(data, "/api/csid/c").then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.getConfig();
      } else {
        this.global.showErrMsg(this.header, 'err_save');
      }
    });
  }

  /*
    reset config 和 status
  */
  @ViewChild('resetModal')
  resetModal: ModalComponent;

  openResetModal(type) {
    this.curType = type;
    this.resetModal.open();
  }

  resetAll() {
    let url: string = (this.curType === 'config') ? "/api/csid/c/reset" : "/api/csid/s/reset";
    this.header['errorMessage'] = '';    
    this.resetModal.close();
    this.api.get(url).then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.getConfig();
        this.getStatus();        
      } else {
        this.global.showErrMsg(this.header, 'err_save');
      }
    });
  }

}