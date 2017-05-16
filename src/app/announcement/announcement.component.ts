import { Component, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Router } from '@angular/router';
import { ApiService, GlobalService } from 'app/service';
import { LocalStorageService } from 'app/service';
const utils = require('app/share/utils.ts');

@Component({
  selector: 'announcement',
  styleUrls: [ 'announcement.component.css' ],
  templateUrl: 'announcement.component.html'
})
export class Announcement {
  header: {[key: string]: any} = {collspse: false, title: 'announcement', announcement: true};
  modalAnnouncementTitle: string;
  curIdx: number;
  announceList: any[] = [];
  userAdmin: number;
  num: number = 50;
  from: number = 0;
  total: number;
  MAX_ANNOUNCE: number = 1000;

  //Announce object
  addAnnounce: {[key: string]: any} = {
    message: {val: '', valid: {strlen: [1, 256]} , str: 'message'}
  };

  constructor(
    private api: ApiService,
    private global: GlobalService,
    private localStor: LocalStorageService
  ) {
    this.userAdmin = this.localStor.get('userAdmin');

    this.getAnnounce();
  }

  onAnnouncement(data) {
    if(data.type === 'new') {
      //判別是否可以在新增
      if(this.total >= this.MAX_ANNOUNCE) {
        this.global.showErrMsg(this.header, 'err_msg_max_announce_exceeded');
        return;
      }

      this.curIdx = null;
      this.modalAnnouncementTitle = 'new_announce';
      utils.formReset(this.addAnnounce);
      this.modalAddAnnouncement.open();
    }
  }

  addZero(i: number) {
    return (i < 10)?"0" + i:i.toString();
  }

  //取得公佈欄列表
  getAnnounce(loadMore: boolean = false) {
    this.from = (loadMore) ? this.announceList.length : 0;

    if(!loadMore) {
      this.announceList = [];
    }

    let filter: string = 'from=' + this.from + '&num=' + this.num;

    this.api.get("/api/announce?" + filter).then((data: {[key: string]: any}) => {

      if(data['resCode'] === 200) { //success
      } else if(data['resCode'] === 404) {
        return;
      } else {
        this.global.showErrMsg(this.header, 'err_get_data');
      }

      data['announces'].forEach((data) => {
        let today = new Date(data.time * 1000);
        let year: string = today.getFullYear().toString();
        let month: string = this.addZero(today.getMonth() + 1);
        let day: string = this.addZero(today.getDate());
        let hour: string = this.addZero(today.getHours());
        let minutes: string = this.addZero(today.getMinutes());

        data.showTime = year + "-" + month + "-" + day + " " + hour + ":" + minutes;
      });

      this.total = data['total'];
      this.announceList = [...this.announceList, ...data['announces']];
    });
  }

  /*
   新增下載連結功能
  */
  @ViewChild('modalAddAnnouncement')
  modalAddAnnouncement: ModalComponent;

  openModalEdit(idx) {
    this.curIdx = idx;
    this.modalAnnouncementTitle = 'edit_announce';
    this.addAnnounce['message'].val = this.announceList[idx].message;
    this.modalAddAnnouncement.open();
  }

  saveAnnounce(idx) {    
    if(utils.formValid(this.addAnnounce)){
      return;
    }

    let done = (data: {[key:string]: any}) => {
      if(data['resCode'] === 200) {
        this.getAnnounce();
      } else {
        this.global.showErrMsg(this.header, 'err_save');
      }
    };

    let formData: any = new FormData();
    formData.append('message', this.addAnnounce['message'].val);
    this.modalAddAnnouncement.close();
    this.header['errorMessage'] = '';

    if(utils.has(idx)) {
      let time: any = this.announceList[idx].time;
      this.api.put(formData, '/api/announce/' + time, 'form').then(done);      
    } else {
      this.api.post(formData, '/api/announce', 'form').then(done);      
    }
  }

  /*
    刪除
  */
  @ViewChild('modalRemove')
  modalRemove: ModalComponent;

  openModalRemove(idx) {
    this.curIdx = idx;
    this.addAnnounce['message'].val = this.announceList[idx].message;
    this.modalRemove.open();
  }

  deleteAnnounce() {
    let time: any = this.announceList[this.curIdx].time;
    this.header['errorMessage'] = '';    
    this.modalRemove.close();
    this.api.delete("/api/announce/" + time).then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.getAnnounce();
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
      if(this.announceList.length < this.total && this.total) {
        this.getAnnounce(true);
      }
    }
  }

}