import { Component  } from '@angular/core';
import { ViewChild  } from '@angular/core';
import { GlobalService } from 'app/service';
import { ApiService } from 'app/service';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

const IMG_DIR = '/assets/img/';
const IoStatLog: {[key: string]: any} = {
  0  : {key: 'unknown',      image: IMG_DIR + 'ic_event_log.png'},
  1  : {key: 'unknown',      image: IMG_DIR + 'ic_event_log.png'},
  2  : {key: 'local',        image: IMG_DIR + 'ic_event_log.png'},
  3  : {key: 'remote',       image: IMG_DIR + 'ic_event_log.png'},
  4  : {key: 'on',           image: IMG_DIR + 'ic_event_log.png'},
  5  : {key: 'off',          image: IMG_DIR + 'ic_event_log.png'},
  6  : {key: 'trip',         image: IMG_DIR + 'ic_event_log.png'},
  7  : {key: 'normal',       image: IMG_DIR + 'ic_event_log.png'},
  8  : {key: 'failure',      image: IMG_DIR + 'ic_event_log.png'},
  9  : {key: 'putoff',       image: IMG_DIR + 'ic_event_log.png'},
  10 : {key: 'puton',        image: IMG_DIR + 'ic_event_log.png'},
  11 : {key: 'onsite',       image: IMG_DIR + 'ic_event_log.png'},
  12 : {key: 'resistance',   image: IMG_DIR + 'ic_event_log.png'},
  13 : {key: 'inductance',   image: IMG_DIR + 'ic_event_log.png'},
  14 : {key: 'capacitance',  image: IMG_DIR + 'ic_event_log.png'},
  15 : {key: 'remote',       image: IMG_DIR + 'ic_event_log.png'},
};

@Component({
  selector: 'iostlog',
  styleUrls: [ 'iostlog.component.css' ],
  templateUrl: 'iostlog.component.html'
})
export class Iostlog {
  header: {[key: string]: any} = {collspse: false, title: 'iostlog', iostlog: true};
  showRefresh: number;
  total: number;
  num: number = 1000;
  from: number = 0;
  searchDate: string;
  moreData: boolean = true;
  iostLogs: any[];

  constructor(
    private global: GlobalService,
    private api: ApiService,
  ) {
    this.getIostLog(false);
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
      if(this.iostLogs.length < this.total && this.total) {
        this.getIostLog(true);
      }
    }
  }

  /* 搜尋功能 */
  @ViewChild('modalSearch')
  modalSearch: ModalComponent;

  onIostLog(data) {
    if(data.type === 'search') {
      if(!this.header['startDate']) {
        let d = new Date();
        this.searchDate = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
        this.header['startDate'] = this.searchDate;
      }
      this.modalSearch.open();      
    }
  }

  //搜尋操做紀錄 依照日期
  getIostLog(loadMore: boolean) {
    this.from = (loadMore) ? this.iostLogs.length : 0;
    if(loadMore) {
      this.from = this.iostLogs.length;
    } else {
      this.iostLogs = [];
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
    if(this.modalSearch) {
      this.modalSearch.close();
    }

    if(this.showRefresh === 1) {
      return; // duplicated request
    } else {
      this.showRefresh = 1; //顯示 Loading 圖片
    }
    this.api.get('/api/iostlog?' + filter).then((data: {[key: string]: any}) => {
      this.showRefresh = 0; //關閉 Loading 圖片
      if(data['desc'] !== 'OK') {
        return;
      } else if(data['iostLogs'].length === 0) {
        this.moreData = false; 
        return;
      }
      this.total = data['total'];
      data['iostLogs'].forEach((iostLog: {[key: string]: any}) => {
        let date = new Date(0);
        date.setSeconds(iostLog['time']);
        iostLog['time'] = date.toLocaleString();

        let msgCode: number = iostLog['msgCode'];
        msgCode = IoStatLog[msgCode] ? msgCode : 0 ;
        iostLog['message'] = iostLog['regName'] + " " + IoStatLog[msgCode].key;
        iostLog['image'] = IoStatLog[msgCode].image;
        this.iostLogs.push(iostLog);
      });
    });
  }
}