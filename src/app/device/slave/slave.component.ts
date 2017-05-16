import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { LocalStorageService } from 'app/service';
import { GlobalService } from 'app/service';
import { ApiService } from 'app/service';
const utils = require('app/share/utils.ts');
const IMG_DIR = '/assets/img/';

@Component({
  selector: 'slave',
  styleUrls: [ 'slave.component.css' ],
  templateUrl: 'slave.component.html'
})
export class Slave {
  header: {[key: string]: any} = {collspse: false, title: 'slave_device', slvdev: true};
  openModalDialog: any;
  slvdevList: any[];
  sn: string;

  slave: {[key: string]: any} = {
    name:     {val: '', valid: {type: 'required'}, err: null},
    type:     {val: '', err: null},
    comPort:  {val: '', err: null},
    ip:       {val: '', valid: {type: 'ip'}, err: null},
    port:     {val: '', valid: {range: [1,65535]}, err: null},
    slvId:    {val: '', err: null},
    enable:   {val: '', err: null},
  };  

  constructor(
    private api: ApiService,
    private global: GlobalService,
    private localStor: LocalStorageService,    
    private route: ActivatedRoute,
    private router: Router,    
  ) {
    let querys = this.route.params['value'];
    if(querys['sn']) {
      this.sn = querys['sn'];
      this.header['subTitle'] = this.global.langStr('device') + ': ' +  this.sn;
    } else {
      window.history.back();
      return; 
    }
    this.slvIdList = utils.range(1, 254);
    this.getSlvDevice();
  }

  onSlvDevList(data) {
    if(data.type === 'new') {
      this.openAddSlvDev();
    }
  }

  onDialogClose(cbFunc) {
    // console.log('cbFunc=' + cbFunc);
    eval(cbFunc);
  }

  changeType(type: string) {
    if(type === 'TCP') {
      this.slave['slvId'].val = '255'; //set to None
    } else { // Serial
      this.slave['slvId'].val = '1'; 
    }
  }

  /*
    取得裝置列表
  */
  getSlvDevice() {
    this.api.get("/api/slvdev/" + this.sn).then((data: {[key: string]: any}) => {
      if(data['resCode'] !== 200) {
        return;
      }
      this.slvdevList = [];
      let ids = Object.keys(data['slvDevs']);
      for(let i = 0; i < ids.length; i++) {
        let id = ids[i];
        let slvDev = data['slvDevs'][id];
        slvDev['id'] = id;
        slvDev['icon'] = IMG_DIR + 'ic_cloud_server.png';
        slvDev['editUrl'] = '/slave/edit/' + this.sn + '/' + id;
        if(slvDev.type === 'Serial') {
          slvDev['info'] = slvDev.comPort + ', ID: ' + slvDev.slvId;
        } else {
          slvDev['info'] = 'TCP/IP: ' + slvDev.ip + ':' + slvDev.port;
          if(slvDev.slvId < 255) {
            slvDev['info'] += ', ID: ' + slvDev.slvId;
          }
        }
        this.slvdevList.push(slvDev);
      }
    });
  }

  /*
    Remove Device
  */
  openModalRemove(dev: any) {
    let str = this.global.langStr('make_sure_delete') + ' (<strong>' + this.global.langStr('device') + ': ' + dev['name'] + '</strong>)';
    this.openModalDialog = {
      action: 'open', 
      str: str, 
      yesNoFunc: 'this.delDevice("' + this.sn + '",' + dev['id'] + ')' , 
      important: true
    };    
  }

  delDevice(sn, id) {
    this.header['errorMessage'] = '';
    this.api.delete('/api/slvdev/' + sn + '/' + id).then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.getSlvDevice();
      } else if(data['resCode'] === 400 && data['desc'].match(/Device is logging/i)) {
        this.global.showErrMsg(this.header, 'usb_logging');
      } else {
        this.global.showErrMsg(this.header, 'err_save');
      }
    });
  };

  /*
    新增 Salve
  */
  @ViewChild('modalAddSlave')
  modalAddSlave: ModalComponent;
  slvIdList: number[] = [];


  //開啟新增 Slave 視窗
  openAddSlvDev() {
    utils.formReset(this.slave);
    this.slave['type'].val = 'Serial';
    this.slave['comPort'].val = 'COM0';
    this.slave['port'].val = 502;
    this.slave['slvId'].val = 1;
    this.slave['enable'].val = true;
    this.modalAddSlave.open();
  }

  addNewSalve() {
    let err = utils.validInput(this.slave['name'].valid, this.slave['name'].val);
    if(err) {
      return this.slave['name'].err = err.str;
    }
    let formData: any = new FormData();
    formData.append("sn", this.sn);
    formData.append("addNewDev", true);
    formData.append("name", this.slave['name'].val);
    formData.append("type", this.slave['type'].val);
    formData.append("enable", (this.slave['enable'].val) ? 1 : 0);

    if(this.slave['type'].val === 'TCP') {
      let ipErr = utils.validInput(this.slave['ip'].valid, this.slave['ip'].val);
      let portErr = utils.validInput(this.slave['port'].valid, this.slave['port'].val);
      this.slave['ip'].err = (ipErr) ? ipErr.str : null;
      this.slave['port'].err = (portErr) ? portErr.str : null;
      this.slave['port'].errRange = (portErr) ? portErr.range : null;
      if(ipErr || portErr) {
        return;
      }      
      if(!this.slave['slvId'].val) {
        formData.append("slvId", 255);
      } else {
        formData.append("slvId", this.slave['slvId'].val);
      }      
      formData.append("ip", this.slave['ip'].val);
      formData.append("port", this.slave['port'].val);
    } else { // Serial
      formData.append("comPort", this.slave['comPort'].val);
      formData.append("slvId", this.slave['slvId'].val);
    }

    this.modalAddSlave.close();
    this.api.post(formData, "/api/slvdev/update", 'form').then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.getSlvDevice();
      } else if(data['resCode'] === 400 && data['desc'].match(/"maximum number/i)) {
        this.openModalDialog = {action: 'open', str: 'err_msg_max_device_exceeded'};
      } else if(data['resCode'] === 400 && data['desc'].match(/Invalid Data/i)) {
        this.openModalDialog = {action: 'open', str: 'err_msg_invalid_str'};
      } else if(data['resCode'] === 400 && data['desc'].match(/Device is logging/i)) {
        this.openModalDialog = {action: 'open', str: 'usb_logging'};
      } else if(data['resCode'] === 400 && data['desc'].match(/setting has been used/i)) {
        this.openModalDialog = {action: 'open', str: 'err_msg_dup_slvid', cbFunc: 'this.modalAddSlave.open();'};
      } else {
        this.openModalDialog = {action: 'open', str: 'err_save'};
      }
    });
  }
}