import { Component  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Params } from '@angular/router';
import { ViewChild  } from '@angular/core';
import { GlobalService } from 'app/service';
import { ApiService } from 'app/service';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
const IMG_DIR = '/assets/img/';
const register = require('app/share/register.ts');

enum AdtCode {
  USER_LOGIN         = 0,
  USER_LOGOUT        = 1,
  NEW_USER           = 2,
  EDIT_USER          = 3,
  DELETE_USER        = 4,
  USER_ACTIVATE      = 5,
  CHG_LANG           = 6,
  NEW_ANNOUNCE       = 7,
  EDIT_ANNOUNCE      = 8,
  DELETE_ANNOUNCE    = 9,
  NEW_DEV            = 10,
  EDIT_DEV           = 11,
  DELETE_DEV         = 12,
  DEV_IMPORT         = 13,
  SND_FTP_LOG        = 14,
  NEW_FLINK          = 15,
  EDIT_FLINK         = 16,
  DELETE_FLINK       = 17,
  SND_FWUPG          = 18,
  DEV_REBOOT         = 19,
  NEW_REG            = 20,
  DUP_REG            = 21,
  EDIT_REG           = 22,
  SET_REG            = 23,
  DELETE_REG         = 24,
  NEW_GROUP          = 30,
  EDIT_GROUP         = 31,
  DELETE_GROUP       = 32,
  CLEAR_EVTLOG       = 40,
  CLEAR_ALARM        = 41,
  CLEAR_AUDIT        = 42,
  CLEAR_IOSTLOG      = 43,
  ANNOUNCE_SUB_CMP   = 44,
  ANNOUNCE_ALL_CMP   = 45,
  SWITCH_MAC         = 46,
  SWITCH_BACK        = 47
};

const Audit: {[key: string]: any} = {};
Audit[AdtCode.USER_LOGIN      ] = {key: 'signin'             , image: IMG_DIR + 'ic_login.png'       };
Audit[AdtCode.USER_LOGOUT     ] = {key: 'logout'             , image: IMG_DIR + 'ic_login.png'       };
Audit[AdtCode.NEW_USER        ] = {key: 'new_account'        , image: IMG_DIR + 'ic_new_user.png'    };
Audit[AdtCode.EDIT_USER       ] = {key: 'edit_account'       , image: IMG_DIR + 'ic_editor.png'      };
Audit[AdtCode.DELETE_USER     ] = {key: 'remove'             , image: IMG_DIR + 'ic_delete.png'      };
Audit[AdtCode.USER_ACTIVATE   ] = {key: 'account_activate'   , image: IMG_DIR + 'ic_user.png'        };
Audit[AdtCode.CHG_LANG        ] = {key: 'change_lang'        , image: IMG_DIR + 'ic_editor.png'      };
Audit[AdtCode.NEW_ANNOUNCE    ] = {key: 'new_announce'       , image: IMG_DIR + 'ic_file_add.png'    };
Audit[AdtCode.EDIT_ANNOUNCE   ] = {key: 'edit_announce'      , image: IMG_DIR + 'ic_editor.png'      };
Audit[AdtCode.DELETE_ANNOUNCE ] = {key: 'delete_announce'    , image: IMG_DIR + 'ic_delete.png'      };
Audit[AdtCode.NEW_DEV         ] = {key: 'new_device'         , image: IMG_DIR + 'ic_new_device.png'  };
Audit[AdtCode.EDIT_DEV        ] = {key: 'edit_device'        , image: IMG_DIR + 'ic_editor.png'      };
Audit[AdtCode.DELETE_DEV      ] = {key: 'remove'             , image: IMG_DIR + 'ic_delete.png'      };
Audit[AdtCode.DEV_IMPORT      ] = {key: 'import_profile'     , image: IMG_DIR + 'ic_editor.png'     };
Audit[AdtCode.SND_FTP_LOG     ] = {key: 'ftp_cli_send_log'   , image: IMG_DIR + 'ic_editor.png'      };
Audit[AdtCode.NEW_FLINK       ] = {key: 'new_flink'          , image: IMG_DIR + 'ic_file_add.png'    };
Audit[AdtCode.EDIT_FLINK      ] = {key: 'edit_flink'         , image: IMG_DIR + 'ic_editor.png'      };
Audit[AdtCode.DELETE_FLINK    ] = {key: 'delete_flink'       , image: IMG_DIR + 'ic_delete.png'      };
Audit[AdtCode.SND_FWUPG       ] = {key: 'device_fw_upgrade'  , image: IMG_DIR + 'ic_editor.png'      };
Audit[AdtCode.DEV_REBOOT      ] = {key: 'reboot'             , image: IMG_DIR + 'ic_warning.png'      };
Audit[AdtCode.NEW_REG         ] = {key: 'new_register'       , image: IMG_DIR + 'ic_new_register.png'};
Audit[AdtCode.DUP_REG         ] = {key: 'copy'               , image: IMG_DIR + 'ic_editor.png'      };
Audit[AdtCode.EDIT_REG        ] = {key: 'edit_register'      , image: IMG_DIR + 'ic_editor.png'      };
Audit[AdtCode.SET_REG         ] = {key: 'set_reg_val'        , image: IMG_DIR + 'ic_warning.png'     };
Audit[AdtCode.DELETE_REG      ] = {key: 'remove'             , image: IMG_DIR + 'ic_delete.png'      };
Audit[AdtCode.NEW_GROUP       ] = {key: 'new_group_member'   , image: IMG_DIR + 'ic_new_group.png'   };
Audit[AdtCode.EDIT_GROUP      ] = {key: 'edit'               , image: IMG_DIR + 'ic_editor.png'      };
Audit[AdtCode.DELETE_GROUP    ] = {key: 'remove'             , image: IMG_DIR + 'ic_delete.png'      };
Audit[AdtCode.CLEAR_EVTLOG    ] = {key: 'clear_log'          , image: IMG_DIR + 'ic_clear_1.png'      };
Audit[AdtCode.CLEAR_ALARM     ] = {key: 'clear_log'          , image: IMG_DIR + 'ic_clear_1.png'      };
Audit[AdtCode.CLEAR_AUDIT     ] = {key: 'clear_log'          , image: IMG_DIR + 'ic_clear_1.png'      };
Audit[AdtCode.CLEAR_IOSTLOG   ] = {key: 'clear_log'          , image: IMG_DIR + 'ic_clear_1.png'      };
Audit[AdtCode.ANNOUNCE_SUB_CMP] = {key: 'new_announce'       , image: IMG_DIR + 'ic_file_add.png'    };
Audit[AdtCode.ANNOUNCE_ALL_CMP] = {key: 'new_announce_all'   , image: IMG_DIR + 'ic_file_add.png'    };
Audit[AdtCode.SWITCH_MAC      ] = {key: 'switch_device'      , image: IMG_DIR + 'ic_warning.png'    };
Audit[AdtCode.SWITCH_BACK     ] = {key: 'switch_back_device' , image: IMG_DIR + 'ic_warning.png'    };

const DevString: {[key: string]: string} = {
  'logFreq': 'logging_freq',
  'storCapacity': 'storage_capacity',
  'ftpPswd': 'ftp_cli_password',
  'ftpCliHost': 'ftp_cli_host',
  'ftpCliPort': 'ftp_cli_port',
  'ftpCliAccount': 'ftp_cli_account',
  'ftpCliPswd': 'ftp_cli_password',
  'ip': 'slave_ip',
  'port': 'slave_port',
  'slvId': 'slave_id',
  'comPort': 'serial_port',
  'type': 'type',
  'timeout': 'poll_timeout',
  'delayPoll': 'delay_poll',
  'maxRetry': 'max_retry',
  'enLog': 'enable_usb_loggoing',
  'enFtpCli': 'ftp_cli_enable',
  'origName': 'new_name',
  'newDevName': 'device_name',
  'pollTime': 'device_polling'
}

@Component({
  selector: 'audit',
  styleUrls: [ 'audit.component.css' ],
  templateUrl: 'audit.component.html'
})
export class AuditLog {
  header: {[key: string]: any} = {collspse: false, title: 'audit_log', auditlog: true};
  showRefresh: number;
  total: number;
  num: number = 1000;
  from: number = 0;
  searchDate: string;
  queryCompany: string = '';
  moreData: boolean = true;
  auditLogs: any[];

  constructor(
    private route: ActivatedRoute,
    private global: GlobalService,
    private api: ApiService,
  ) {
    let querys = this.route.queryParams['value'];

    if(querys['dbsIdx'] && querys['companyId']) {
      this.queryCompany = '&dbsIdx=' + querys['dbsIdx'] + '&companyId=' + querys['companyId'];
    }     
    this.getAuditLog(false); 
  }

  /*
    當紀錄頁面 scroll 到 bottom 時讀取後續資料
  */
  onScroll(event) {
    let div: {[key:string]: any} = event.target
    let scrollTop: number = div['scrollTop'];
    let scrollHeight: number = div['scrollHeight'];
    let offsetHeight: number = div['offsetHeight'];

    if(scrollTop === (scrollHeight - offsetHeight)) {
      if(this.auditLogs.length < this.total && this.total) {
        this.getAuditLog(true);
      }
    }
  }

  /* 搜尋功能 */
  @ViewChild('modalSearch')
  modalSearch: ModalComponent;

  onAuditLog(data) {
    if(data.type === 'search') {
      if(!this.header['startDate']) {
        let d = new Date();
        this.searchDate = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
        this.header['startDate'] = this.searchDate;
      }
      this.modalSearch.open();      
    }
  }

  //取得裝置操作 詳細訊息
  parseDevInfo(auditLog: {[key:string]:any}): any{
    let info: string = "";
    let name: string = this.global.langStr('edit_device');
    let slvDev: string = "";
    let devName: string = auditLog['message'].devName ;

    if(auditLog['message'].slvDevName) {
      slvDev = auditLog['message'].slvDevName;
      name = (info === '') ? this.global.langStr('new_slave_device') : this.global.langStr('edit_slave_device');
      name = name + " - " + slvDev;
      devName = "";
    }
    for(let key in auditLog['message']) {
      if(key === 'devName' || key === 'slvDevName') {
        continue;
      }
      if(key === 'enLog' || key === 'enFtpCli') {
        let enLog: string = (auditLog['message'][key] === '1') ? this.global.langStr('enable') : this.global.langStr('disable'); 
        info = " (" + this.global.langStr(DevString[key]) + ": " + enLog+ ")";
      } else if(key === 'origName') {
        info = " (" + this.global.langStr('new_name') + ": " + slvDev + ")";
      } else {
        info = " (" + this.global.langStr(DevString[key]) + ": " + auditLog['message'][key] + ")";
      }
    }
    return  name + " " + devName + " " + info;
  }

  //搜尋操做紀錄 依照日期
  getAuditLog(loadMore: boolean) {
    this.from = (loadMore) ? this.auditLogs.length : 0;
    if(loadMore) {
      this.from = this.auditLogs.length;
    } else { // Start to get Data
      this.auditLogs = [];
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

    this.api.get('/api/audit?' + filter).then((data: {[key: string]: any}) => {
      this.showRefresh = 0; //關閉 Loading 圖片
      if(data['desc'] !== 'OK') {
        return;
      } else if(data['auditLogs'].length === 0) {
        this.moreData = false;
        return; // nore more data
      }
      this.total = data['total'];

      data['auditLogs'].forEach((auditLog: {[key: string]: any}) => {
        let date = new Date(0);
        date.setSeconds(auditLog['time']);
        auditLog['time'] = date.toLocaleString();
        let msgCode: number = auditLog['msgCode'];
        let image: string; 
        let message: string;
        if(Audit[msgCode]) {
          auditLog['image'] = Audit[msgCode].image;
          message = this.global.langStr(Audit[msgCode].key);
        } else {
          auditLog['image'] = IMG_DIR + 'ic_warning.png';;
          auditLog['message'] = this.global.langStr('unknown');
          return this.auditLogs.push(auditLog);
        }

        if(msgCode === AdtCode.USER_LOGIN || msgCode === AdtCode.USER_LOGOUT) {
          auditLog['message'] = message + " (" + this.global.langStr('user') + ": " + auditLog['account'] + ")";
        } else if(msgCode === AdtCode.DELETE_USER) {
          auditLog['message'] = message + this.global.langStr('account')  + " - " + auditLog['message']['userName'];
        } else if(msgCode === AdtCode.USER_ACTIVATE) {
          auditLog['message'] = message + " - " + auditLog['account'];
        } else if(msgCode === AdtCode.EDIT_DEV) {
          auditLog['message'] = this.parseDevInfo(auditLog);
        } else if(msgCode === AdtCode.DELETE_DEV) {
          auditLog['message'] = message + this.global.langStr('device')  + " - " + auditLog['message']['devName'];
        } else if(msgCode === AdtCode.DEV_IMPORT) {
          let devId: string = "";
          if(auditLog['message']['slvIdx']) {
              devId = " (" + this.global.langStr('device_id') + ": " + auditLog['message']['slvIdx'] + ")";
          }
          auditLog['message'] = message + devId + " (" + this.global.langStr('device') + ": " + auditLog['message']['devName'] + ")";
        } else if(msgCode === AdtCode.SND_FTP_LOG) {
          auditLog['message'] = message + " (" + this.global.langStr('device') + ": " + auditLog['message']['devName'] + ")";
        }else if(msgCode === AdtCode.SND_FWUPG) {
          message = message + " (" + this.global.langStr('device') + ": " + auditLog['message']['devName'];
          //是否有 韌體版本
          let fwVer = (auditLog['message']['fwVer']) ? ", " + this.global.langStr('device_version') + ": " + auditLog['message']['fwVer'] : "";
          auditLog['message'] = message + fwVer + ")";
        }else if(msgCode === AdtCode.DEV_REBOOT) {
          auditLog['message'] = message + " (" + this.global.langStr('device') + ": " + auditLog['message']['devName'] + ")";
        } else if(msgCode === AdtCode.NEW_REG) {
          auditLog['message'] = message + " " + auditLog['message']['regName'] + " (" + this.global.langStr('device') + ": " + auditLog['message']['devName'] + ")";
        } else if(msgCode === AdtCode.DUP_REG || msgCode === AdtCode.DELETE_REG) {
          auditLog['message'] = message + this.global.langStr('register') + " - " +  auditLog['message']['regName'] + " (" + this.global.langStr('device') + ": " + auditLog['message']['devName'] + ")";
        } else if(msgCode === AdtCode.EDIT_REG) {
          auditLog['message'] = message + ": " + auditLog['message']['regName'] + " (" + this.global.langStr('device') + ": " + auditLog['message']['devName'] + ")";
        } else if(msgCode === AdtCode.SET_REG) {
          // let hval: string = this.iotype.hexToDecimal(auditLog['message']);
          let auditMessage: {[key: string]: any} = auditLog['message'];
          let type: number = parseInt(auditMessage['type']);
          let hval: string = register.toDecVal(auditMessage);
          let ival: string = (auditMessage["ival"]) ? auditMessage["ival"]: "";
          let jval: string = (auditMessage["jval"]) ? auditMessage["jval"]: "";
          let lval: string = (auditMessage["lval"]) ? auditMessage["lval"]: "";

          if(type < 0) { // unknown type
            message = this.global.langStr('set_reg_val') + " - " + auditMessage["regName"] + " (" + this.global.langStr('device') + ": " + auditMessage["devName"] + ", " + this.global.langStr('value') + ": 0x" + hval + ival + jval + lval + ") ";
          } else {
            message = this.global.langStr('set_reg_val') + " - " + auditMessage["regName"] + " (" + this.global.langStr('device') + ": " + auditMessage["devName"] + ", " + this.global.langStr('value') + ": " + hval + ") ";
          }

          auditLog['message'] = message;
        } else if(msgCode === AdtCode.NEW_GROUP  || 
                  msgCode === AdtCode.EDIT_GROUP || 
                  msgCode === AdtCode.DELETE_GROUP) 
        {
          let devList: string = "";
          let group: string = (msgCode === AdtCode.NEW_GROUP) ? "" : this.global.langStr('group');
          if(auditLog['message']['groupMember']){
            let data: any[] = auditLog['message']['groupMember'];
            let sn: string = data[0].sn;
            let addr: string = data[0].addr;
            devList = '('+ sn + ':' + addr + ')';
          }
          auditLog['message'] = message + group + " - " + auditLog['message']['groupName'] + devList;
        } else if(msgCode === AdtCode.CLEAR_EVTLOG) { 
          auditLog['message'] = message + " - " + this.global.langStr('event_log');
        } else if(msgCode === AdtCode.CLEAR_ALARM) { 
          auditLog['message'] = message + " - " + this.global.langStr('notification');
        } else if(msgCode === AdtCode.CLEAR_AUDIT) { 
          auditLog['message'] = message + " - " + this.global.langStr('audit_log');
        } else if(msgCode === AdtCode.CLEAR_IOSTLOG) { 
          auditLog['message'] = message + " - " + this.global.langStr('iostlog');
        } else if(msgCode === AdtCode.ANNOUNCE_SUB_CMP || msgCode === AdtCode.ANNOUNCE_ALL_CMP) { 
          let companyName: string = (auditLog['message']["companyName"]) ? " (" + this.global.langStr('company') + ": " + auditLog['message']["companyName"] + ")" : "";
          auditLog['message'] = message + " - " + auditLog['message']["title"] + companyName;
        } else if(msgCode === AdtCode.SWITCH_MAC || msgCode === AdtCode.SWITCH_BACK) { 
          auditLog['message'] = message + " - " +
                                this.global.langStr('device') + ": "  + auditLog['message']["srcSN"] + ", " +
                                this.global.langStr('device') + ": " + auditLog['message']["dstSN"];
        } else {
          for(let key in auditLog['message']) {
            auditLog['message'] = message + " - " + auditLog['message'][key];
          }
        }
        this.auditLogs.push(auditLog);
      });
    });
  }

}