import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Params } from '@angular/router';
import { ApiService } from 'app/service';
import { GlobalService } from 'app/service';
import { LocalStorageService } from 'app/service';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
const utils = require('app/share/utils.ts');

@Component({
  selector: 'slaveEdit',
  styleUrls: [ 'slaveEdit.component.css' ],
  templateUrl: 'slaveEdit.component.html'
})
export class SlaveEdit {
  header: {[key: string]: any} = {collspse : false, title: 'edit_slave_device'};
  device: {[key: string]: any};
  slvIdList: number[] = [];
  selectList: any[];
  openModalDialog: any;
  userAdmin: string;
  curKey: string;
  sn: string = "";
  id: string = "";
  slvDev: any;

  editSlvDev: {[key: string]: any} = {
    name:      {val: '', valid: {type: 'required'}  , str: 'slave_dev_name'   , hint: ''},
    slvId:     {val: '', valid: {range: [1,255]}    , str: 'slave_id'         , hint: '1 ~ 254'},
    enable:    {val: '', valid: {range: [0,1]}      , str: 'activate'         , hint: ''},
    type:      {val: '', str: 'connect_type'                                  , hint: ''},
    ip:        {val: '', valid: {type: 'ip'}        , str: 'slave_ip_hinet'   , hint: ''},
    port:      {val: '', valid: {range: [1,65535]}  , str: 'slave_port_hint'  , hint: ''},
    comPort:   {val: '', valid: {within: ['COM0','COM1']} , str: 'serial_port', hint: ''},
    delayPoll: {val: '', valid: {range: [0,60000]  }, str: 'delay_poll'       , hint: '0 ~ 60000'},
    maxRetry:  {val: '', valid: {range: [1,1000]   }, str: 'max_retry'        , hint: '1 ~ 1000'},
    timeout:   {val: '', valid: {range: [100,60000]}, str: 'poll_timeout'     , hint: '100 ~ 60000'},
  };

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    public localStor: LocalStorageService,
    private global: GlobalService
  ) {
    let querys = this.route.params['value'];
    if(querys['sn'] && querys['id']) {
      this.sn = querys['sn'];
      this.id = querys['id'];
      this.header['subTitle'] = this.global.langStr('device') + ': ' +  this.sn + ', ID: ' + this.id;
    } else {
      window.history.back();
      return; 
    }
    this.slvIdList = utils.range(1, 254);
    this.userAdmin = this.localStor.get("userAdmin");
    this.getSlvDevice();
  }

  onDialogClose(cbFunc) {
    // console.dir(cbFunc);
    eval(cbFunc);
  }

  //取得裝置資訊
  getSlvDevice() {
    this.api.get('/api/slvdev/' + this.sn + '?id=' + this.id).then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.slvDev = data['slvDev'];
        if(!this.slvDev['delayPoll']) {
          this.slvDev['delayPoll'] = 100;
        }
        if(!this.slvDev['timeout']) {
          this.slvDev['timeout'] = 200;
        }
        if(!this.slvDev['maxRetry']) {
          this.slvDev['maxRetry'] = 10;
        }
      }
    });
  }

  /*
    編輯帳號資訊
  */
  @ViewChild('modalSelect')
  modalSelect: ModalComponent;

  openModalSelect(key: string) {
    this.editSlvDev[key].val = this.slvDev[key];
    this.curKey = key;       
    if(this.curKey === 'comPort') {
      this.selectList = ['COM0','COM1'];
    } else if(this.curKey === 'slvId') {
      this.selectList = this.slvIdList;
    } else {
      return console.log('No support key! ' + this.curKey);
    }    
    this.modalSelect.open();
  }

  sendSelection() {
    this.modalSelect.close();
    this.saveConfigs();
  }

  /*
    編輯帳號資訊
  */
  @ViewChild('modalEdit')
  modalEdit: ModalComponent;

  openModalEdit(key: string) {
    utils.formReset(this.editSlvDev);
    this.curKey = key;       
    this.editSlvDev[key].val = this.slvDev[key];
    this.modalEdit.open();
  }

  sendEdit(key: string) {
    this.curKey = key;
    this.editSlvDev[key].val = this.slvDev[key] ? '0' : '1';
    this.saveConfigs();
  }

  saveConfigs() {
    let slvDevConf = this.editSlvDev[this.curKey];
    if(slvDevConf.val === this.slvDev[this.curKey]) {
      return this.modalEdit.close();
    } else if(slvDevConf.valid) {
      let err = utils.validInput(slvDevConf.valid, slvDevConf.val);
      if(err) {
        slvDevConf.err = err.str;
        slvDevConf.errRange = err.range;
        return;
      }
    }
    let formData: any = new FormData();
    formData.append('sn', this.sn);
    formData.append('id', this.id);
    formData.append(this.curKey, slvDevConf.val);    
    this.modalEdit.close();
    this.header['errorMessage'] = '';
    this.api.post(formData, '/api/slvdev/update', 'form').then((data: {[key: string]: any}) => {
      if(data['resCode'] !== 200) {
        if(data['desc'].match(/Device is logging/i)){
          this.openModalDialog = {action: 'open', str: 'usb_logging'};
        } else if(data['desc'].match(/Invalid Data/i)){
          this.openModalDialog = {action: 'open', str: 'err_no_logging_register'};
        } else if(data['desc'].match(/The slave setting has been used/i)){
          this.openModalDialog = {action: 'open', str: 'err_msg_dup_slvid'};
        } else {
          this.global.showErrMsg(this.header, 'err_save');
        }
      }     
      this.getSlvDevice();
    });
  }
}