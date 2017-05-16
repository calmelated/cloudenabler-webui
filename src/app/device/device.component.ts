import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { LocalStorageService } from 'app/service';
import { GlobalService } from 'app/service';
import { ApiService } from 'app/service';
const model = require('app/share/model.ts');
const utils = require('app/share/utils.ts');
const IMG_DIR = '/assets/img/';

@Component({
  selector: 'device',
  styleUrls: [ 'device.component.css' ],
  templateUrl: 'device.component.html'
})
export class Device {
  header: {[key: string]: any} = {collspse: false, title: 'device'};
  openModalDialog: any;
  devList: any[];
  importFile: any;
  curDev: any;
  devPollingId: any;
  userAdmin: string;
  modelList: any[];

  dev: {[key: string]: any} = {
    sn:       {val: '', valid: {type: 'mac'}     , err: null},
    name:     {val: '', valid: {type: 'required'}, err: null},
    pollTime: {val: '', valid: {range: [10,3600]}, err: null},
    mo:       {val: '', valid: {type: 'required'}, err: null},
  };

  constructor(
    private api: ApiService,
    private global: GlobalService,
    private localStor: LocalStorageService,    
  ) {
    this.getDevice();
    this.modelList = Object.keys(model.MODEL_NAME);
    this.userAdmin = localStor.get('userAdmin');
    if(this.userAdmin === '2') {
      this.header['device'] = true;
    }
  }

  onDevList(data) {
    if(data.type === 'new') {
      utils.formReset(this.dev);
      this.dev['sn'].val = '28:65:6b:00:00:00';
      this.dev['mo'].val = this.modelList[0];
      this.dev['pollTime'].val = '50';
      this.modalAddDev.open();
    }
  }

  onDialogClose(cbFunc) {
    // console.log('cbFunc=' + cbFunc);
    eval(cbFunc);
  }

  ngOnInit() {
    this.devPollingId = setInterval(() => {
      this.getDevice();      
    }, 30000);    
  }

  ngOnDestroy() {
    clearTimeout(this.devPollingId);
  }

  /*
    取得裝置列表
  */
  getDevice() {
    this.api.get("/api/device").then((data: {[key: string]: any}) => {
      if(data['resCode'] !== 200) {
        return;
      }
      this.devList = [];
      for(let i = 0; i < data['devices'].length; i++) {
        let device = data['devices'][i];
        device['mstDev'] = (model.isMbusMaster(device['mo']) ? true : false);
        device['icon'] = IMG_DIR + ((device.status === 1) ? 'ic_device_sync.png' : 'ic_device_nosync.png');
        device['devInfo'] = device['sn'];
        device['editUrl'] = '/devices/edit/' + device['sn'];
        device['evtlogUrl'] = '/devices/evtlog/' + device['sn'];
        device['regUrl'] = '/devices/register/' + device['sn'];
        device['exportUrl'] = '/api/device/profile/' + device['sn'];
        this.devList.push(device);

        if(device['mstConf']) {
          Object.keys(device['mstConf']).forEach((sid) => {
            let slvDev = device['mstConf'][sid];
            if(slvDev['enable'] < 1) {
              return;
            }
            slvDev['icon'] = IMG_DIR + 'ic_plug.png';
            slvDev['sn'] = device['sn'];
            slvDev['sid'] = sid;
            if(slvDev.type === 'Serial') {
              slvDev['devInfo'] = slvDev.comPort + ', ID: ' + slvDev.slvId;
            } else {
              slvDev['devInfo'] = 'TCP/IP: ' + slvDev.ip + ':' + slvDev.port;
              if(slvDev.slvId < 255) {
                slvDev['devInfo'] += ', ID: ' + slvDev.slvId;
              }
            }
            slvDev['editUrl'] = '/slave/edit/' + device['sn'] + '/' + slvDev['sid'];
            slvDev['regUrl'] = '/devices/register/' + device['sn'] + '/' + slvDev['sid'];
            slvDev['exportUrl'] = '/api/device/profile/' + device['sn'] + '?slvIdx=' + slvDev['sid'];
            this.devList.push(slvDev);
          });
        }
      }
    });
  }

  /*
    匯入檔案
  */
  @ViewChild('modalImport')
  modalImport: ModalComponent;

  fileChangeEvent(fileInput: any){
    this.importFile = fileInput.target.files;
  }

  openModalImport(dev: any){
    this.importFile = null;
    if(dev['enLog'] === 1 || dev['enServLog'] === 1) {
      this.openModalDialog = {action: 'open', str: 'usb_logging'};
      return;
    }
    this.curDev = dev;
    this.modalImport.open();
  }

  importProfile() {
    let formData: any = new FormData();
    formData.append("sn", this.curDev.sn);

    if(this.curDev.sid > 0) {
      formData.append("slvIdx", this.curDev.sid);
    }

    let len = this.importFile.length;
    for(var i = 0; i < len; i++) {
      formData.append("profile", this.importFile[i], this.importFile[i].name);
    }

    this.modalImport.close();        
    this.header['errorMessage'] = '';    
    this.api.post(formData, '/api/device/import', 'form').then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.getDevice();
      } else {
        this.global.showErrMsg(this.header, 'err_save');
      }
    });
  };

  /*
    Remove Device
  */
  openModalRemove(dev: any) {
    if(dev['enLog'] === 1 || dev['enServLog'] === 1) {
      this.openModalDialog = {action: 'open', str: 'usb_logging'};
      return;
    }
    let str = this.global.langStr('make_sure_delete') + ' (<strong>' + this.global.langStr('device') + ': ' + dev.name + '</strong>)';
    let argv = dev['sid'] ? '("' +  dev['sn'] + '","' +  dev['sid'] + '")' : '("' +  dev['sn'] + '")' ;
    this.openModalDialog = {
      action: 'open', 
      str: str, 
      yesNoFunc: 'this.delDevice' + argv, 
      important: true
    };    
  }

  delDevice(sn, sid) {
    let url: string; 
    if(sid) {  
      url = "/api/slvdev/" + sn + "/" + sid
    } else {
      url = "/api/device/" + sn;
    }
    this.header['errorMessage'] = '';
    this.api.delete(url).then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.getDevice();
      } else if(data['resCode'] === 400 && data['desc'].match(/Device is logging/i)) {
        this.global.showErrMsg(this.header, 'usb_logging');
      } else {
        this.global.showErrMsg(this.header, 'err_save');
      }
    });
  };

  /*
    Add Device
  */
  @ViewChild('modalAddDev')
  modalAddDev: ModalComponent;

  addDev() {
    if(utils.formValid(this.dev)) {
      return;
    }
    let formData: any = new FormData();
    formData.append('sn', this.dev['sn'].val);
    formData.append('mo', this.dev['mo'].val);
    formData.append('name', this.dev['name'].val);
    formData.append('pollTime', this.dev['pollTime'].val);
    this.header['errorMessage'] = '';
    this.modalAddDev.close();
    this.api.post(formData,'/api/device/add','form').then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.getDevice();
      } else if(data['resCode'] === 400){
        if(data['desc'].match(/Invalid Data/i)) {
          if(data['desc'].match(/unacceptable model/i)) {
            this.openModalDialog = {action: 'open', str: 'err_msg_unacceptable_model', cbFunc: 'this.modalAddDev.open();'};
          } else {
            this.openModalDialog = {action: 'open', str: 'invalid_val', cbFunc: 'this.modalAddDev.open();'};
          } 
        } else if(data['desc'].match(/device already exists/i)) {
          this.openModalDialog = {action: 'open', str: 'err_msg_dup_device', cbFunc: 'this.modalAddDev.open();'};
        } else if(data['desc'].match(/maximum number/i)) {
          this.global.showErrMsg(this.header, 'err_msg_max_device_exceeded');
        } else {
          this.global.showErrMsg(this.header, 'err_save');
        }
      } else {
        this.global.showErrMsg(this.header, 'err_save');
      }
    });
  }
}