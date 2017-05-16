import { Component  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Params } from '@angular/router';
import { ViewChild  } from '@angular/core';
import { GlobalService } from 'app/service';
import { ApiService } from 'app/service';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
const IMG_DIR = '/assets/img/';

@Component({
  selector: 'evtlog',
  styleUrls: [ 'evtlog.component.css' ],
  templateUrl: 'evtlog.component.html'
})
export class DeviceEvtlog {
  header: {[key: string]: any} = {collspse: false, title: 'event_log', evtlog: true};
  showRefresh: number;
  total: number;
  num: number = 1000;
  from: number = 0;
  searchDate: string;
  url: string = '';
  queryCompany: string = '';
  moreData: boolean = true;
  evtLogs: any[];

  constructor(
    private route: ActivatedRoute,
    private global: GlobalService,
    private api: ApiService,
  ) {
    let params = this.route.params['value'];
    let querys = this.route.queryParams['value'];
    this.url = '/api/device/' + params['sn'] +'/evtlog';
    if(querys['dbsIdx'] && querys['companyId']) {
      this.queryCompany = 'dbsIdx=' + querys['dbsIdx'] + '&companyId=' + querys['companyId'];
    }    
    this.header['subTitle'] = this.global.langStr('device') + ': ' +  params['sn'];
    this.getEvtLog(false); 
  }

  /*
    當紀錄頁面 scroll 到 bottom 時讀取後續資料
  */
  onScroll(event){
    let div: {[key:string]: any} = event.target
    let scrollTop: number = div['scrollTop'];
    let scrollHeight: number = div['scrollHeight'];
    let offsetHeight: number = div['offsetHeight'];

    if(scrollTop === (scrollHeight - offsetHeight)) {
      if(this.evtLogs.length < this.total && this.total) {
        this.getEvtLog(true);
      }
    }
  }

  /* 搜尋功能 */
  @ViewChild('modalSearch')
  modalSearch: ModalComponent;

  onEvtLog(data) {
    if(data.type === 'search') {
      if(!this.header['startDate']) {
        let d = new Date();
        this.searchDate = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
        this.header['startDate'] = this.searchDate;
      }
      this.modalSearch.open();      
    }
  }

  /*
    裝置操作紀錄
  */
  parseEvtlog(evtlog){
    let date = new Date(0);
    date.setSeconds(evtlog['time']);
    evtlog['time'] = date.toLocaleString();

    let img: string = 'ic_enable.png';
    let evtId: string = evtlog['type'];
    let extraMsg: any = evtlog['extraMsg'];
    let message: string = this.global.langStr("evtlog_" + evtId);

    if     (evtId === '00') {}
    else if(evtId === '01') { img = 'ic_disable.png'; }
    else if(evtId === '02') {}
    else if(evtId === '03') { img = 'ic_disable.png'; }
    else if(evtId === '04') {}
    else if(evtId === '05') {}
    else if(evtId === '06') {}
    else if(evtId === '07') {}
    else if(evtId === '08') {}
    else if(evtId === '09') {}
    else if(evtId === '0A') {}
    else if(evtId === '0B') {}
    else if(evtId === '0C') {}
    else if(evtId === '0D') {}
    else if(evtId === '0E') {}
    else if(evtId === '0F') {}
    else if(evtId === '10') {}
    else if(evtId === '11') {}
    else if(evtId === '12') {}
    else if(evtId === '13') {}
    else if(evtId === '14') {}
    else if(evtId === '15') {}
    else if(evtId === '16') {}
    else if(evtId === '17') {}
    else if(evtId === '18') {}
    else if(evtId === '19') {}
    else if(evtId === '1A') {}
    else if(evtId === '1B') {}
    else if(evtId === '1C') {}
    else if(evtId === '1D') {}
    else if(evtId === '1E') {}
    else if(evtId === '1F') {}
    else if(evtId === '20') {}
    else if(evtId === '21') { img = 'ic_warning.png'; }
    else if(evtId === '22') {}
    else if(evtId === '23') {}
    else if(evtId === '24') {}
    else if(evtId === '25') { img = 'ic_warning.png'; }
    else if(evtId === '26') {}
    else if(evtId === '27') { img = 'ic_disable.png'; }
    else if(evtId === '28') {}
    else if(evtId === '29') { img = 'ic_warning.png'; }
    else if(evtId === '2A') { img = 'ic_warning.png'; }
    else if(evtId === '2B') { img = 'ic_warning.png'; }
    else if(evtId === '2C') { img = 'ic_warning.png'; }
    else if(evtId === '2D') { img = 'ic_warning.png'; }
    else if(evtId === '2E') {}
    else if(evtId === '2F') { img = 'ic_warning.png'; }
    else if(evtId === '30') { img = 'ic_warning.png'; }
    else if(evtId === '31') {}
    else if(evtId === '32') {}
    else if(evtId === '33') { img = 'ic_warning.png'; }
    else if(evtId === '34') { img = 'ic_warning.png'; }
    else if(evtId === '35') {}
    else if(evtId === '36') { img = 'ic_disable.png'; }
    else if(evtId === '37') {}
    else if(evtId === '38') {}
    else if(evtId === '39') { img = 'ic_disable.png'; }
    else if(evtId === '3A') {}
    else if(evtId === '3B') { img = 'ic_disable.png'; }
    else if(evtId === '3C' || evtId === '3D' || evtId === '3E') { // tx/rx err packets
      if(extraMsg) {
        message = message + " " + this.global.langStr('success') + ": " + extraMsg['successCnt'] + ", " + this.global.langStr('failed') + ": " + extraMsg['failCnt'];
      }
    } 
    else if(evtId === '3F') { img = 'ic_warning.png'; } 
    else if(evtId === '40') {} 
    else if(evtId === '41') { img = 'ic_disable.png'; }
    else if(evtId === '42') {} 
    else if(evtId === '43') { // usb error 
      if(extraMsg['normal']) {
        message = message + " " + this.global.langStr('evtlog_back_normal');
      } else if(extraMsg['writeErr']) {
        message = message + " " + this.global.langStr('evtlog_write_error');
      } else if(extraMsg['profErr']) {
        message = message + " " + this.global.langStr('evtlog_profile_error');
      } else if(extraMsg['noUsbErr']) {
        message = message + " " + this.global.langStr('evtlog_nousb_error');
        img = 'ic_disable.png';
      }
    } else if(evtId === '44' || evtId === '45') {
      let success: any = (extraMsg['success']) ? extraMsg['success'] : false;
      let logName: any = (extraMsg['log']) ? extraMsg['log'] : "";
      let status: string; 
      if(success) {
        status =  this.global.langStr('success');
      } else {
        status =  this.global.langStr('failed');
        img = 'ic_disable.png';
      }
      message = this.global.langStr('evtlog_44') + " " + logName + " - " + status;
    } else if(evtId === '47') {
      let offline: boolean = (extraMsg['offline']) ? extraMsg['offline'] : false;

      if(offline) {
        img = 'ic_disable.png';
        message = this.global.langStr('mbus_mst_offline');
      } else {
        message = this.global.langStr('mbus_mst_online');
      }
    } else if(message === undefined) {
      img = 'ic_warning.png';
      message = this.global.langStr('evtlog_unknown_type') + " 0x" + evtId;
    }
    evtlog['message'] = message;
    evtlog['image'] = IMG_DIR + img;
  }

  //搜尋操做紀錄 依照日期
  getEvtLog(loadMore: boolean) {
    this.from = (loadMore) ? this.evtLogs.length : 0;
    if(loadMore) {
      this.from = this.evtLogs.length;
    } else { // Start to get Data
      this.evtLogs = [];
      this.from = 0;
      this.moreData = true;
    }
    if(!this.moreData) {
      return;
    }

    let filter: string = 'from=' + this.from + '&num=' + this.num;
    if(this.searchDate) {
      this.header['subTitle'] = this.header['startDate'];
      let st: number = (new Date(this.searchDate + " 00:00:00")).getTime() / 1000;
      let et: number = (new Date(this.searchDate + " 00:00:00")).getTime() / 1000 + (86400 - 1);
      filter += "&st=" + st + "&et=" + et;
    }    
    if(this.queryCompany) {
      filter += this.queryCompany;
    }    
    if(this.modalSearch) {
      this.modalSearch.close();
    }

    if(this.showRefresh === 1) {
      return; // duplicated request
    } else {
      this.showRefresh = 1; //顯示 Loading 圖片
    }
    this.api.get(this.url + '?' + filter).then((data: {[key: string]: any}) => {
      this.showRefresh = 0; //關閉 Loading 圖片
      if(data['desc'] !== 'OK' || !data['evtlogs']) {
        return;
      } else if(data['evtlogs'].length === 0) {
        this.moreData = false;
        return; // nore more data
      }
      this.total = data['total'];
      data['evtlogs'].forEach((evtlog: {[key: string]: any}) => {
        this.parseEvtlog(evtlog);
        this.evtLogs.push(evtlog);
      });
    });
  }
}