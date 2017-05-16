import { Component  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Params } from '@angular/router';
import { ViewChild  } from '@angular/core';
import { GlobalService } from 'app/service';
import { ApiService } from 'app/service';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { LocalStorageService } from 'app/service';
const IMG_DIR = '/assets/img/';

enum AlmCode {
  DEFAULT             = 0,
  OFFLINE             = 1,
  RESET_PASSWORD      = 2,
  ONLINE              = 3,
  LOG_FAILED          = 4,
  FEW_ALARM           = 5,
  NO_ALARM            = 6,
  UPPER_ALARM         = 7,
  LOWER_ALARM         = 8,
  NEW_ANNOUNCE        = 9,
  SLVDEV_OFFLINE      = 10,
  SLVDEV_ONLINE       = 11,
  BACK_NORMAL_ALARM   = 12,
  MBUS_MST_ONLINE     = 13,
  MBUS_MST_OFFLINE    = 14,
  DEV_REBOOT          = 15,
};

const Alarm: {[key: number]: any} = {};
Alarm[AlmCode.DEFAULT          ] = {key: ''                     };
Alarm[AlmCode.OFFLINE          ] = {key: 'offline'              }; 
Alarm[AlmCode.RESET_PASSWORD   ] = {key: 'reset_password'       }; 
Alarm[AlmCode.ONLINE           ] = {key: 'online'               };  
Alarm[AlmCode.LOG_FAILED       ] = {key: 'logging_falied'       };  
Alarm[AlmCode.FEW_ALARM        ] = {key: 'few_alarm_left'       };  
Alarm[AlmCode.NO_ALARM         ] = {key: 'no_avaliable_alarm'   }; 
Alarm[AlmCode.UPPER_ALARM      ] = {key: 'upper_limit_alarm'    };  
Alarm[AlmCode.LOWER_ALARM      ] = {key: 'lower_limit_alarm'    }; 
Alarm[AlmCode.NEW_ANNOUNCE     ] = {key: 'received_new_announce'};
Alarm[AlmCode.SLVDEV_OFFLINE   ] = {key: 'offline'              };  
Alarm[AlmCode.SLVDEV_ONLINE    ] = {key: 'online'               };  
Alarm[AlmCode.BACK_NORMAL_ALARM] = {key: 'evtlog_back_normal'   };  
Alarm[AlmCode.MBUS_MST_ONLINE  ] = {key: 'mbus_mst_online'     };  
Alarm[AlmCode.MBUS_MST_OFFLINE ] = {key: 'mbus_mst_offline'     };  
Alarm[AlmCode.DEV_REBOOT       ] = {key: 'reboot'               };  

const AlmPri: {[key:string]: string} = {
  0 : IMG_DIR + 'ic_alarm_low_green.png',
  1 : IMG_DIR + 'ic_alarm_medium_yellow.png',
  2 : IMG_DIR + 'ic_alarm_high_red.png',
};

@Component({
  selector: 'alarm',
  styleUrls: [ 'alarm.component.css' ],
  templateUrl: 'alarm.component.html'
})
export class AlarmLog {
  header: {[key: string]: any} = {collspse: false, title: 'alarm', alarmlog: true};
  showRefresh: number;
  total: number;
  num: number = 1000;
  from: number = 0;
  searchDate: string;
  queryCompany: string = '';
  moreData: boolean = true;
  alarmLogs: any[];
  searchText: string;
  openSearch: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private global: GlobalService,
    private api: ApiService,
    private localStor: LocalStorageService,
  ) {
    let querys = this.route.queryParams['value'];
    this.checkAuth();

    if(querys['dbsIdx'] && querys['companyId']) {
      this.queryCompany = '/api/alarm?dbsIdx=' + querys['dbsIdx'] + '&companyId=' + querys['companyId'];
    }   
    this.getAlarmLog(false); 
  }

  /*
    1. superadmin 時開啟搜尋功能
    2. 更新告警時間 當lilu 登入子公司看告警時

    Keyword Search (僅SuperAdmin可用，一次最多一萬筆資料)
    /api/alarm?key=LILU-Device1
    PUT /api/lilu/unread/[:time] -> 更新檢查時間
  */
  checkAuth() {
    let userAdmin: string = this.localStor.get('userAdmin');
    let customer: string = this.localStor.get("odm");
    let subCompId: string = this.localStor.get("subCompId");
    //測試用
    customer = "Lilu";

    if(userAdmin === "2") {
      this.openSearch = true
    }

    //更新告警時間
    if(customer === "Lilu" && subCompId != "0") {
      //linux 主機使用時間為 second js 使用 millisecond 所以要多除以1000
      let time: any = Math.round(Date.now()/1000);
      
      this.api.put({}, '/api/lilu/unread/' + subCompId + '/' + time).then((data: {[key: string]: any}) => {
      });
    }
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
      if(this.alarmLogs.length < this.total && this.total) {
        this.getAlarmLog(true);
      }
    }
  }

  /* 搜尋功能 */
  @ViewChild('modalSearch')
  modalSearch: ModalComponent;

  onAlarmLog(data) {
    if(data.type === 'search') {
      if(!this.header['startDate']) {
        let d = new Date();
        this.searchDate = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
        this.header['startDate'] = this.searchDate;
      }
      this.modalSearch.open();      
    }
  }

  parseAlarm(alarmLog){
    let date = new Date(0);
    date.setSeconds(alarmLog['time']);
    alarmLog['time'] = date.toLocaleString();

    let msgCode: number = alarmLog['msgCode'];
    if(!Alarm[msgCode] || !alarmLog['account']) {
      alarmLog['image'] = AlmPri[0];
      alarmLog['message'] = this.global.langStr('unknown');
      return;
    }
    let account: string = alarmLog['account'];
    let extra: {[key: string]: any} = (alarmLog['extra']) ? alarmLog['extra'] : {};
    let mainString: string = this.global.langStr(Alarm[msgCode].key);
    let priority: number = alarmLog['priority'] ? alarmLog['priority'] : 0;

    let message: string = "";
    if(msgCode === AlmCode.OFFLINE || msgCode === AlmCode.LOG_FAILED) {
      message = this.global.langStr('device') + " " + account + " - " + mainString;
    } else if (msgCode === AlmCode.DEFAULT) {
      let extra: {[key: string]: any} = alarmLog['extra'];
      let refReg: string = "";
      if(extra) {
        refReg = ' - (' + this.global.langStr('register') + ' : ' + extra['refReg'] + ' , ' + this.global.langStr('value') + ' : ' + extra['value'] + ')';
      }
      message = alarmLog['message'] + refReg;
    } else if (msgCode === AlmCode.ONLINE) {
      if(alarmLog['message']) {
        let durs: string[] = alarmLog['message'].split("duration:");
        if (durs.length > 1) {
            message = this.global.langStr('device') + " " + account + " - " + mainString + "  (" + this.global.langStr('offline_time') + ": " + durs[1] + ")";
        } else {
            message = this.global.langStr('device') + " " + account + " - " + mainString;
        }
      } else {
        message = this.global.langStr('device') + " " + account + " - " + mainString;
      }
    } else if (msgCode === AlmCode.UPPER_ALARM || msgCode === AlmCode.LOWER_ALARM || msgCode === AlmCode.BACK_NORMAL_ALARM) {   
      message = extra['desc'] + " " + mainString;
      let unit: string = (extra['unit']) ? extra['unit'] : "";
      if(extra['value']) {
        message = message + " " + this.global.langStr("value") + ": "  + extra['value'] + ' ' + unit;
      }
    } else if(msgCode === AlmCode.SLVDEV_OFFLINE || msgCode === AlmCode.SLVDEV_ONLINE) {
      message = this.global.langStr('slave_device') + " " + extra['slvName'] + " - " + mainString;
    } else if(msgCode === AlmCode.MBUS_MST_ONLINE || msgCode === AlmCode.MBUS_MST_OFFLINE) {
      message = this.global.langStr('device') + " " + alarmLog['account'] + " - " + this.global.langStr(Alarm[msgCode].key);
    } else if(msgCode === AlmCode.DEV_REBOOT) {
      let duration: string = (extra["duration"]) ? extra["duration"] : "";
      let offline_time: string = (duration)? "  (" + this.global.langStr('offline_time') + ": " + duration + ")":"";
      message = this.global.langStr('device') + " " + alarmLog['account'] + " - " + this.global.langStr('reboot') + offline_time;
    } else {
      message = mainString;
    } 
    alarmLog['message'] = message;
    alarmLog['image'] = AlmPri[priority];
  }

  //搜尋操做紀錄 依照日期
  getAlarmLog(loadMore: boolean) {
    this.from = (loadMore) ? this.alarmLogs.length : 0;
    if(loadMore) {
      this.from = this.alarmLogs.length;
    } else { // Start to get Data
      this.alarmLogs = [];
      this.from = 0;
      this.moreData = true;
    }
    if(!this.moreData) {
      return;
    }

    let filter: string = 'from=' + this.from + '&num=' + this.num;
    //判別 openSearch   true => 文字搜尋, false => 日期搜尋
    if(this.searchDate && !this.openSearch) {
      this.header['subTitle'] = this.header['startDate'];
      let st: number = (new Date(this.searchDate + " 00:00:00")).getTime() / 1000;
      let et: number = (new Date(this.searchDate + " 00:00:00")).getTime() / 1000 + (86400 - 1);
      filter += "&st=" + st + "&et=" + et;
    } else {
      this.header['subTitle'] = this.searchText;
      filter += (this.searchText) ? "&key=" + this.searchText : "";
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
    this.api.get('/api/alarm?' + filter).then((data: {[key: string]: any}) => {
      this.showRefresh = 0; //關閉 Loading 圖片
      if(data['desc'] !== 'OK' || !data['almlogs']) {
        return;
      } else if(data['almlogs'].length === 0) {
        this.moreData = false;
        return; // nore more data
      }
      this.total = data['total'];
      data['almlogs'].forEach((alarmLog: {[key: string]: any}) => {
        this.parseAlarm(alarmLog);
        this.alarmLogs.push(alarmLog);
      });
    });
  }

  //測試輸出CSV程式
  exportCSV() {
    let data = [["name1", "city1", "some other info"], ["name2", "city2", "more info"]];
    let csvContent = "data:text/csv;charset=utf-8,";
    data.forEach(function(infoArray, index){
      let dataString = infoArray.join(",");
      csvContent += index < data.length ? dataString + "\n" : dataString;
    }); 

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "my_data.csv".
    
  }

}