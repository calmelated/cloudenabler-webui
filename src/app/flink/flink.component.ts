import { Component, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Router } from '@angular/router';
import { ApiService, GlobalService } from 'app/service';
import { LocalStorageService } from 'app/service';
const utils = require('app/share/utils.ts');

@Component({
  selector: 'flink',
  styleUrls: [ 'flink.component.css' ],
  templateUrl: 'flink.component.html'
})
export class Flink {
  header: {[key: string]: any} = {collspse: false, title: 'file_link', flink: true};
  modalFlinkTitle: string;
  curIdx: number;
  flinkList: any[] = [];
  userAdmin: number;
  num: number = 50;
  from: number;
  total: number;
  MAX_FLINK: number = 30;

  //Flink object
  addFlink: {[key: string]: any} = {
    desc: {val: '', valid: {strlen: [1, 32]} , str: 'desc'},
    url:  {val: '', valid: {strlen: [1, 256]}, str: 'url' },
  };

  constructor(
    private api: ApiService,
    private global: GlobalService,
    private localStor: LocalStorageService
  ) {
    this.userAdmin = this.localStor.get('userAdmin');

    this.getFlink();
  }

  onFlink(data) {
    if(data.type === 'new') {
      //判別是否可以在新增
      if(this.total >= this.MAX_FLINK) {
        this.global.showErrMsg(this.header, 'err_msg_max_flink_exceeded');
        return;
      }

      this.curIdx = null;
      this.modalFlinkTitle = 'add';
      utils.formReset(this.addFlink);
      this.modalAddFlink.open();
    }
  }

  getFlink(loadMore: boolean = false) {
    this.from = (loadMore) ? this.flinkList.length : 0;

    if(!loadMore) {
      this.flinkList = [];
    }

    let filter: string = 'from=' + this.from + '&num=' + this.num;

    this.api.get("/api/flink?" + filter).then((data: {[key: string]: any}) => {

      if(data['resCode'] === 200) { //success
      } else if(data['resCode'] === 404) {
        return;
      } else {
        this.global.showErrMsg(this.header, 'err_get_data');
      }

      this.flinkList = [...this.flinkList, ...data['flinks']];
      this.total = data['total'];
    });
  }

  /*
   新增下載連結功能
  */
  @ViewChild('modalAddFlink')
  modalAddFlink: ModalComponent;

  openModalEdit(idx) {
    this.curIdx = idx;
    this.modalFlinkTitle = 'edit';
    this.addFlink['url'].val = this.flinkList[idx].url;
    this.addFlink['desc'].val = this.flinkList[idx].desc;
    this.modalAddFlink.open();
  }

  saveFlink(idx) {    
    if(utils.formValid(this.addFlink)){
      return;
    }

    let done = (data: {[key:string]: any}) => {
      if(data['resCode'] === 200) {
        this.getFlink();
      } else {
        this.global.showErrMsg(this.header, 'err_save');
      }
    };

    let formData: any = new FormData();
    formData.append('desc', this.addFlink['desc'].val);
    formData.append('url' , this.addFlink['url'].val);
    this.modalAddFlink.close();
    this.header['errorMessage'] = '';
    if(utils.has(idx)) {
      this.api.put(formData, '/api/flink/' + this.flinkList[idx].id, 'form').then(done);      
    } else {
      this.api.post(formData, '/api/flink', 'form').then(done);      
    }    
  }

  /*
    刪除
  */
  @ViewChild('modalRemove')
  modalRemove: ModalComponent;

  openModalRemove(idx) {
    this.curIdx = idx;
    this.addFlink['url'].val = this.flinkList[idx].url;
    this.addFlink['desc'].val = this.flinkList[idx].desc;
    this.modalRemove.open();
  }

  deleteFlink() {
    let id = this.flinkList[this.curIdx].id;
    this.header['errorMessage'] = '';    
    this.modalRemove.close();
    this.api.delete("/api/flink/" + id).then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.getFlink();
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
      if(this.flinkList.length < this.total && this.total) {
        this.getFlink(true);
      }
    }
  }

}