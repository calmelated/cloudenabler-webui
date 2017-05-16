import { Component, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Router } from '@angular/router';
import { ApiService, GlobalService } from 'app/service';
import { LocalStorageService } from 'app/service';
const utils = require('app/share/utils.ts');

@Component({
  selector: 'group',
  styleUrls: [ 'group.component.css' ],
  templateUrl: 'group.component.html'
})
export class Group {
  header: {[key: string]: any} = {collspse: false, title: 'group', group: true};
  modalGroupTitle: string;
  curIdx: number;
  groupList: any[] = [];
  userAdmin: number;
  num: number = 50;
  from: number;
  total: number;
  MAX_GROUP_NUM: number = 100;
  deviceList: any[] = [];
  registerList: any[] = [];

  //Group object
  addGroup: {[key: string]: any} = {
    name: {val: '', valid: {strlen: [1, 255]} , str: 'name'},
    sn: {val: '', valid: {strlen: [1, 255]} , str: 'device'},
    addr: {val: '', valid: {strlen: [1, 255]} , str: 'register'}
  };

  constructor(
    private api: ApiService,
    private global: GlobalService,
    private localStor: LocalStorageService
  ) {
    this.userAdmin = this.localStor.get('userAdmin');

    this.getGroup();
  } 

  onGroup(data) {
    if(data.type === 'new') {
      //判別是否可以在新增
      if(this.total >= this.MAX_GROUP_NUM) {
        this.global.showErrMsg(this.header, 'err_msg_max_flink_exceeded');
        return;
      }

      this.curIdx = null;
      this.modalGroupTitle = 'new_group';
      utils.formReset(this.addGroup);
      this.getDeviceList();
      this.modalAddGroup.open();
    }
  }

  getDeviceList() {
    this.api.get("/api/device").then((data: {[key: string]: any}) => {

      if(data['resCode'] === 200) { //success
      } else if(data['resCode'] === 404) {
        return;
      } else {
        this.global.showErrMsg(this.header, 'err_get_data');
      }

      this.deviceList = data['devices'];
      this.addGroup['sn'].val = data['devices'][0].sn;
      this.getRegister();
    });
  }

  getRegister() {
    this.api.get("/api/device/" + this.addGroup['sn'].val + "/status").then((data: {[key: string]: any}) => {

      if(data['resCode'] === 200) { //success
      } else if(data['resCode'] === 404) {
        return;
      } else {
        this.global.showErrMsg(this.header, 'err_get_data');
      }

      this.registerList = data['iostats'];
      this.addGroup['addr'].val = (data['iostats'][0])?data['iostats'][0].haddr:"";
    });
  }

  getGroup(loadMore: boolean = false) {
    this.from = (loadMore) ? this.groupList.length : 0;

    if(!loadMore) {
      this.groupList = [];
    }

    let filter: string = 'from=' + this.from + '&num=' + this.num;

    this.api.get("/api/group?" + filter).then((data: {[key: string]: any}) => {

      if(data['resCode'] === 200) { //success
      } else if(data['resCode'] === 404) {
        return;
      } else {
        this.global.showErrMsg(this.header, 'err_get_data');
      }

      this.groupList = [...this.groupList, ...data['groups']];
      this.total = data['total'];
    });
  }

  /*
   新增下載連結功能
  */
  @ViewChild('modalAddGroup')
  modalAddGroup: ModalComponent;

  openModalEdit(idx) {
    this.curIdx = idx;
    this.modalGroupTitle = 'edit';
    this.addGroup['name'].val = this.groupList[idx];
    this.modalAddGroup.open();
  }

  saveGroup(idx) {    
    //當編輯時不需要判別 sn, addr
    let saveDate: {[key: string]: any} = (!utils.has(idx))?this.addGroup:{name: this.addGroup['name']};
    if(utils.formValid(saveDate)){
      return;
    }

    let done = (data: {[key:string]: any}) => {
      if(data['resCode'] === 200) {
        this.getGroup();
      } else {
        if(data['desc'] === "The group member already exists") {
          this.global.showErrMsg(this.header, 'err_msg_group_existed');
        } else {
          this.global.showErrMsg(this.header, 'err_save');
        }
      }
    };

    let formData: any = new FormData();
    formData.append('name', this.addGroup['name'].val);
    this.modalAddGroup.close();
    this.header['errorMessage'] = '';
    if(utils.has(idx)) {
      formData.append('origName', this.groupList[idx]);

      this.api.put(formData, '/api/group/rename', 'form').then(done);      
    } else {
      formData.append('sn', this.addGroup['sn'].val);
      formData.append('addr', this.addGroup['addr'].val);

      this.api.post(formData, '/api/group/add', 'form').then(done);      
    }    
  }

  /*
    刪除
  */
  @ViewChild('modalRemove')
  modalRemove: ModalComponent;

  openModalRemove(idx) {
    this.curIdx = idx;
    this.addGroup['name'].val = this.groupList[idx];
    this.modalRemove.open();
  }

  deleteGroup() {
    let name = this.groupList[this.curIdx];
    this.header['errorMessage'] = '';    
    this.modalRemove.close();
    this.api.delete("/api/group/" + name).then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.getGroup();
      } else {
        this.global.showErrMsg(this.header, 'err_remove');
      }
    });
  }

  /*
    當紀錄頁面 scroll 到 bottom 時讀取後續資料
  */
  onScroll(event){
    let div: {[key:string]: any} = event.target
    let scrollTop: number = Math.floor(div['scrollTop']);
    let scrollHeight: number = div['scrollHeight'];
    let offsetHeight: number = div['offsetHeight'];

    if(scrollTop === (scrollHeight - offsetHeight)) {
      if(this.groupList.length < this.total && this.total) {
        this.getGroup(true);
      }
    }
  }

}