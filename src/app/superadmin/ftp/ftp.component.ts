import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ApiService, GlobalService } from 'app/service';
const utils = require('app/share/utils.ts');

@Component({
  selector: 'ftp',
  styleUrls: [ 'ftp.component.css' ],
  templateUrl: 'ftp.component.html'
})
export class FTP {
  header: {[key: string]: any} = {collspse: false, title: 'ftp_client'};
  curKey: string;
  curInput: string;
  errInput: string = null;
  errRange: string = null;

  ftpConfigs: {[key: string]: any} = {
    FTP_CLI_HOST: {val: null, valid: {type: 'require'}  , str: 'address' },
    FTP_CLI_PORT: {val: null, valid: {range: [0, 65535]}, str: 'port'    },
    FTP_CLI_USER: {val: null, valid: {strlen: [1, 32]}  , str: 'accounts'},
    FTP_CLI_PSWD: {val: null, valid: {strlen: [1, 32]}  , str: 'password'},
  };

  constructor(
    private api: ApiService,
    private global: GlobalService
  ) {
    this.getFTP();
  }

  //取得SMTP資訊
  getFTP() {
    this.api.get('/api/csid/c?FTP_CLI_HOST&FTP_CLI_PORT&FTP_CLI_USER&FTP_CLI_PSWD').then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        for(let key in this.ftpConfigs) {
          this.ftpConfigs[key].val = data[key];
        }
      }
    });
  }

  //送出修改資料
  saveConfigs() {
    let ftpCfg = this.ftpConfigs[this.curKey]
    if(ftpCfg.valid) {
      let err = utils.validInput(ftpCfg.valid, this.curInput);
      if(err) {
        this.errInput = err.str;
        this.errRange = err.range;
        return;
      }
    }    
    let ftpData = {};
    ftpCfg.val = this.curInput;
    for(let key in this.ftpConfigs) {
      ftpData[key] = this.ftpConfigs[key].val;
    }
    this.modalEdit.close();
    this.header['errorMessage'] = '';    
    this.api.put(ftpData ,"/api/csid/c").then((data: {[key: string]: any}) => {
      if(data['resCode'] !== 200) {
        this.global.showErrMsg(this.header, 'err_save');
      }      
    });
  }

  //Edit FTP Client
  @ViewChild('modalEdit')
  modalEdit: ModalComponent;

  openModalEdit(ftpKey) {
    this.curKey = ftpKey;
    this.errInput = null;
    this.errRange = null;
    this.curInput = this.ftpConfigs[this.curKey].val;
    this.modalEdit.open();
  }
}