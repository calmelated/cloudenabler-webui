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
  selector: 'deviceEdit',
  styleUrls: [ 'deviceEdit.component.css' ],
  templateUrl: 'deviceEdit.component.html'
})
export class DeviceEdit {
  header: {[key: string]: any} = {collspse : false, title: 'device'};
  device: {[key: string]: any};
  openModalDialog: any;
  userAdmin: string;
  curKey: string;
  sn: string = "";
  fwType: string;

  devConfigs: {[key: string]: any} = {
    sn:            {val: '',   str: 'device_sn'    },
    mo:            {val: '',   str: 'device_model' },
    pollTime:      {val: '50', valid: {range: [10,6000]}, str: 'device_polling'        , hint: '10s ~ 6000s'},
    name:          {val: '',   valid: {type: 'required'}, str: 'device_name'           , hint: ''},
    fwVer:         {val: '0',  valid: null              , str: 'device_version'        , hint: ''},
    mbusTimeout:   {val: '30', valid: {range: [10,3600]}, str: 'mbus_timeout'          , hint: '10s ~ 3600s'},
    enLog:         {val: '0',  valid: {range: [0,1]    }, str: 'enable_usb_loggoing'   , hint: ''},
    enServLog:     {val: '0',  valid: {range: [0,1]    }, str: 'enable_server_loggoing', hint: ''},
    logFreq:       {val: '10', valid: {range: [1,3600] }, str: 'logging_freq'          , hint: '1s ~ 3600s'},
    storCapacity:  {val: '80', valid: {range: [80,100] }, str: 'storage_capacity'      , hint: '80% ~ 100%'},
    ftpPswd:       {val: '',   valid: {type: 'password'}, str: 'ftp_srv_password'      , hint: ''},
    enFtpCli:      {val: '0',  valid: {range: [0,1]    }, str: 'ftp_cli_enable'        , hint: ''},
    ftpCliHost:    {val: '',   valid: {type: 'required'}, str: 'ftp_cli_host'          , hint: ''},
    ftpCliPort:    {val: '',   valid: {range: [1,65535]}, str: 'ftp_cli_port'          , hint: '1 ~ 65535'},
    ftpCliAccount: {val: '',   valid: {type: 'required'}, str: 'ftp_cli_account'       , hint: ''},
    ftpCliPswd:    {val: '',   valid: {type: 'required'}, str: 'ftp_cli_password'      , hint: ''},
    password:      {val: '',   err: null },
    confirm:       {val: '',   err: null },    
  };

  modelName: {[key: string]: any} = {
    '63511':  'device_kt_63511',
    '63511W': 'device_kt_63511w',
    '63512':  'device_kt_63512',
    '63512W': 'device_kt_63512w',
    '63513':  'device_kt_63513',
    '63513W': 'device_kt_63513w',
    '63514':  'device_kt_63514',
    '63514W': 'device_kt_63514w',
    '63515':  'device_kt_63515',
    '63515W': 'device_kt_63515w',
    '63516':  'device_kt_63516',
    '63516W': 'device_kt_63516w'
  };

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    public localStor: LocalStorageService,
    private global: GlobalService
  ) {
    let querys = this.route.params['value'];
    if(querys['sn']) {
      this.sn = querys['sn'];
      this.header['subTitle'] = this.global.langStr('device') + ': ' +  this.sn;
    } else {
      this.router.navigate(['/devices']);
      return; 
    }
    this.header['title'] = 'edit_device';
    this.userAdmin = this.localStor.get("userAdmin");
    this.getDevice();
  }

  //取得裝置資訊
  getDevice() {
    this.api.get('/api/device/' + this.sn).then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.device = data['device'];
        if(this.modelName[this.device['mo']]) {
          this.device['mo'] = this.modelName[this.device['mo']];
        }
      }      
    });
  }


  /*
    編輯帳號資訊
  */
  @ViewChild('modalEditPswd')
  modalEditPswd: ModalComponent;

  openModalEditPswd(key: string) {
    utils.formReset(this.devConfigs);
    this.curKey = key;       
    this.modalEditPswd.open();
  }

  sendEditPswd() {
    let pswdConf = this.devConfigs['password'];
    let confirmConf = this.devConfigs['confirm'];
    if(this.curKey === 'ftpPswd') {
      let err = utils.validInput({type: 'password'}, pswdConf.val);
      if(err) {
        pswdConf.err = err.str;
        pswdConf.errRange = err.range;
        return;
      }
    } 
    if(pswdConf.val !== confirmConf.val) {
      confirmConf.err = 'err_msg_pwd_mismatch';
      return;
    }
    let formData: any = new FormData();
    formData.append('sn', this.sn);
    formData.append(this.curKey, pswdConf.val ? pswdConf.val : '');    
    this.modalEditPswd.close();
    this.header['errorMessage'] = '';
    this.api.put(formData, '/api/device/edit', 'form').then((data: {[key: string]: any}) => {
      if(data['resCode'] !== 200) {
        this.global.showErrMsg(this.header, 'err_save');
      } else {
        this.getDevice();
      }
    });
  }

  /*
    編輯帳號資訊
  */
  @ViewChild('modalEdit')
  modalEdit: ModalComponent;

  openModalEdit(key: string) {
    utils.formReset(this.devConfigs);
    this.curKey = key;       
    this.devConfigs[key].val = this.device[key];
    this.modalEdit.open();
  }

  sendEdit(key: string) {
    this.curKey = key;
    this.devConfigs[key].val = this.device[key] ? '0' : '1';
    this.saveConfigs();
  }

  saveConfigs() {
    let devConf = this.devConfigs[this.curKey];
    if(devConf.val === this.device[this.curKey]) {
      return this.modalEdit.close();
    } else if(devConf.valid) {
      let err = utils.validInput(devConf.valid, devConf.val);
      if(err) {
        devConf.err = err.str;
        devConf.errRange = err.range;
        return;
      }
    }
    let formData: any = new FormData();
    formData.append('sn', this.sn);
    formData.append(this.curKey, devConf.val);    
    this.modalEdit.close();
    this.header['errorMessage'] = '';
    this.api.put(formData, '/api/device/edit', 'form').then((data: {[key: string]: any}) => {
      if(data['resCode'] !== 200) {
        if(data['desc'].match(/Device is logging/i)){
          this.openModalDialog = {action: 'open', str: 'usb_logging'};
        } else if(data['desc'].match(/No any logging register/i)){
          this.openModalDialog = {action: 'open', str: 'err_no_logging_register'};
        } else {
          this.global.showErrMsg(this.header, 'err_save');
        }
      }     
      this.getDevice();
    });
  }

  /*
    立即傳送紀錄
  */
  sendLogCheck() {
    this.openModalDialog = {
      action: 'open', 
      str: 'make_sure_send_log', 
      yesNoFunc: 'this.sendLog()'
    };
  }

  sendLog(){
    this.header['errorMessage'] = '';
    this.api.put({}, '/api/device/ftplog/' + this.sn).then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.openModalDialog = {action: 'open', str: 'received_ftp_req'};
      } else if(data['resCode'] === 408) {
        this.openModalDialog = {action: 'open', str: 'no_received_ftp_req'};
      } else {
        this.global.showErrMsg(this.header, 'err_save');
      }   
    });
  }

 /*
     Device reboot 
  */
  openModalDevRboot() {
    this.openModalDialog = {
      action: 'open', 
      str: 'make_sure_dev_reboot', 
      yesNoFunc: 'this.sendDevRoot()', 
      important: true
    };
  }

  sendDevRoot(){
    this.header['errorMessage'] = '';
    this.api.put({}, '/api/device/reboot/' + this.sn).then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.openModalDialog = {action: 'open', str: 'dev_received_reboot_req'};
      } else if(data['resCode'] === 408) {
        this.openModalDialog = {action: 'open', str: 'dev_no_received_reboot_req'};
      } else {
        this.global.showErrMsg(this.header, 'err_save');
      }   
    });
  }  

 /*
     Device reboot 
  */
  openModalFwUpg(fwType) {
    this.fwType = fwType;
    this.openModalDialog = {
      action: 'open', 
      str: 'make_sure_fwupg', 
      yesNoFunc: 'this.sendFwUpg()', 
      important: true
    };
  }

  sendFwUpg() {
    this.header['errorMessage'] = '';
    this.api.put({}, '/api/device/fwupg/' + this.sn + '?type=' + this.fwType).then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.openModalDialog = {action: 'open', str: 'received_fwupg_req'};
      } else if(data['resCode'] === 400) {
        if(data['desc'].match(/Already the latest version/i)) {
          this.openModalDialog = {action: 'open', str: 'err_msg_lastest_version'};
        } else {
          this.openModalDialog = {action: 'open', str: 'err_save'};
        }
      } else if(data['resCode'] === 408) {
        this.openModalDialog = {action: 'open', str: 'no_received_fwupg_req'};
      } else {
        this.global.showErrMsg(this.header, 'err_save');
      }   
    });
  } 

  onDialogClose(cbFunc) {
    // console.dir(cbFunc);
    eval(cbFunc);
  }

}