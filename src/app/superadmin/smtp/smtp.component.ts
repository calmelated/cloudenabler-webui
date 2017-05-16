import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ApiService, GlobalService } from 'app/service';
const utils = require('app/share/utils.ts');

@Component({
  selector: 'smtp',
  styleUrls: [ 'smtp.component.css' ],
  templateUrl: 'smtp.component.html'
})
export class SMTP {
  header: {[key: string]: any} = { title: 'smtp_config', collspse: false };
  curKey:   string;
  curInput: string;
  errInput: string = null;
  errRange: string = null;

  smtpConfigs: {[key: string]: any} = {
    SMTP_HOST: {val: null, valid: {type: 'require'}  , str: 'address' },
    SMTP_PORT: {val: null, valid: {range: [0, 65535]}, str: 'port'    },
    SMTP_USER: {val: null, valid: {strlen: [1, 32]}  , str: 'accounts'},
    SMTP_PSWD: {val: null, valid: {strlen: [1, 32]}  , str: 'password'},
  };

  constructor(
    private api: ApiService,
    private global: GlobalService
  ) {
    this.getSMTP();
  }

  //取得SMTP資訊
  getSMTP() {
    this.api.get('/api/csid/c?SMTP_HOST&SMTP_PORT&SMTP_USER&SMTP_PSWD').then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        for(let key in this.smtpConfigs) {
          this.smtpConfigs[key].val = data[key];
        }
      }
    });
  }

  //送出修改資料
  saveConfigs() {
    let smtpCfg = this.smtpConfigs[this.curKey]
    if(smtpCfg.valid) {
      let err = utils.validInput(smtpCfg.valid, this.curInput);
      if(err) {
        this.errInput = err.str;
        this.errRange = err.range;
        return;
      }
    }    
    let smtpData = {};
    smtpCfg.val = this.curInput;
    for(let key in this.smtpConfigs) {
      smtpData[key] = this.smtpConfigs[key].val;
    }
    this.modalEdit.close();
    this.header['errorMessage'] = '';
    this.api.put(smtpData ,"/api/csid/c").then((data: {[key: string]: any}) => {
      if(data['resCode'] !== 200) {
        this.global.showErrMsg(this.header, 'err_save');
      }      
    });
  }

  //Edit 
  @ViewChild('modalEdit')
  modalEdit: ModalComponent;

  openModalEdit(ftpKey) {
    this.curKey = ftpKey;
    this.errInput = null;
    this.errRange = null;
    this.curInput = this.smtpConfigs[this.curKey].val;
    this.modalEdit.open();
  }

}