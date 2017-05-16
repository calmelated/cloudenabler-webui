import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Params } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ApiService } from 'app/service';
import { GlobalService } from 'app/service';
import { LocalStorageService } from 'app/service';

const IMG_DIR: string = '/assets/img/';
const utils = require('app/share/utils.ts');
const model = require('app/share/model.ts');
const register = require('app/share/register.ts');
const iotype = require('app/share/iotype.ts');
const DISPLAY_TYPE = register.DISPLAY_TYPE;
const EditReg = register.EditReg;

@Component({
  selector: 'register',
  styleUrls: [ 'register.component.css' ],
  templateUrl: 'register.component.html'
})
export class DeviceRegister {
  header: {[key: string]: any} = {collspse: false, title: 'register', register: true};
  editReg: {[key: string]: any} = register.EditReg;
  openModalDialog: any;
  registerList: any;
  curReg: any;
  curEditReg: any;
  sn: string;
  mo: string;
  id: string;
  userAdmin: string;
  userControl: number;
  lastUpdate: number;
  devStatus: number;
  enLog: number;
  enServLog: number;
  regPollingId: any;
  numUsedRegs;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private global: GlobalService,
    private localStor: LocalStorageService,
  ) {
    let params = this.route.params['value'];
    if(params['sn']) {
      this.sn = params['sn'];
      this.id = params['id'] ? params['id'] : '' ;
      this.userAdmin = localStor.get("userAdmin");
    } else {
      window.history.back();
      return; 
    }
    this.getDevInfo();
    this.getRegStatus();
  }

  onDialogClose(cbFunc) {
    eval(cbFunc);
  }

  onRegList(data) {
    if(data.type === 'new') {
      this.openModalAddReg();
    }
  }  

  ngOnInit() {
    this.regPollingId = setInterval(() => {
      this.getRegStatus();
    }, 2000);    
  }

  ngOnDestroy() {
    clearTimeout(this.regPollingId);
  }
  
  getDevInfo() {
    this.api.get('/api/device/' + this.sn).then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.mo = data['mo'];
      } else {
        window.history.back();
      }
    });    
  }

  //取得暫存器列表資訊
  getRegStatus() {
    let slvIdx = (this.id ? '?slvIdx=' + this.id : '' );
    this.api.get('/api/device/' + this.sn + '/status' + slvIdx).then((data: {[key: string]: any}) => {
      if(data['resCode'] !== 200) {
        return;
      }
      this.lastUpdate = data['lastUpdate'];
      this.header['subTitle'] = this.sn + (this.id ? ', ID: ' + this.id : '' ) + ', ' + (new Date(this.lastUpdate)).toLocaleString();
      this.userControl = data['userControl'];
      this.enServLog = data['enServLog'];
      this.enLog = data['enLog'];
      this.devStatus = data['status'];

      let numRegs = 0;
      data['iostats'].sort((a, b) => {return parseInt(a.haddr) - parseInt(b.haddr);});  //依照 haddr 大小排序
      data['iostats'].forEach((ioData: {[key: string]: any}) => {
        let type: number = parseInt(ioData['type']);
        if(iotype.is64bit(type)) {
          numRegs = numRegs + 4;
        } else if(iotype.is48bit(type)) {
          numRegs = numRegs + 3;
        } else if(iotype.is32bit(type)) {
          numRegs = numRegs + 2;
        } else {
          numRegs = numRegs + 1;
        }

        // Value column
        ioData['decimal'] = register.toDecVal(ioData);
        ioData['valType'] = 'normal';
        if(iotype.isBinary(type)) {
          let ret = register.hexToBinary(ioData);
          ioData['valType'] = 'binary';
          ioData['binaryArray'] = ret.binaryArray;
          ioData['binaryString'] = ret.binaryString;
        } else if(iotype.isCommAlarm(type) && ioData['decimal']) {
          ioData['valType'] = 'alarm';
          ioData['appIcon'] = 'alarm';
          ioData['image'] = IMG_DIR + 'ic_alarm.png';
        } else if(iotype.isMbusNumber(type) && ioData['dt']) {
          let dt: number = parseInt(ioData['dt']);
          let decVal: number = parseInt(ioData['decimal']);
          if(DISPLAY_TYPE[dt][decVal]) {
            if(dt < 10) { // led
              ioData['image'] = IMG_DIR + DISPLAY_TYPE[dt][decVal]
            } else { // customer's request string
              ioData['dtString'] = DISPLAY_TYPE[dt][decVal];
              ioData['valType'] = 'dtString';
              if(dt === 12 && decVal === 1) {
                ioData['redDTtext'] = 1;
              } 
            }            
          }
        } else if(iotype.isMbusNumber(type)) {
          ioData['appIcon'] = 'chart';
          ioData['image'] = IMG_DIR + 'ic_linechart.png';
        }

        // Icon column
        if(data['status'] === 0) {
          ioData['appIcon'] = 'offline';
          ioData['image'] = IMG_DIR + 'ic_warning.png';
        } else if(iotype.isIOSW(type)) {
          ioData['appIcon'] = 'iosw';
          ioData['image'] = IMG_DIR + 'ic_iosw.png';
        } else if(iotype.isAppWRable(type) && data['userControl'] === 1) {
          if(type === iotype.APP_SWITCH) {
            ioData['appIcon'] = 'switch';
            if(parseInt(ioData['on'], 16) === parseInt(ioData['hval'], 16)) {
              ioData['image'] = IMG_DIR + "ic_switch_on.png";
            } else {
              ioData['image'] = IMG_DIR + "ic_switch_off.png";
            }
          } else if(type === iotype.APP_BTN) {
            ioData['appIcon'] = 'btn';
            if(parseInt(ioData['on'], 16) === parseInt(ioData['hval'], 16)) {
              ioData['image'] = IMG_DIR + "ic_btn_push.png";
            } else {
              ioData['image'] = IMG_DIR + "ic_btn_release.png";
            }            
          } else if(type === iotype.APP_BINARY) {
            ioData['appIcon'] = 'binary';
            ioData['image'] = IMG_DIR + 'ic_binary.png';
          } else {
            ioData['appIcon'] = 'editor';
            ioData['image'] = IMG_DIR + 'ic_editor.png';
          }
        }

        // Show logging string
        if(parseInt(ioData['enlog']) === 1) {
          if(this.enServLog === 1 || this.enLog === 1) {
            ioData['loggingStr'] = 'logging_on';
          } else {
            ioData['loggingStr'] = 'logging_paused';
          }
        }
      });
      this.numUsedRegs = numRegs;
      this.registerList = data['iostats'];
    });
  }

  clickRegister(i) {
    this.curReg = this.registerList[i];

    let type = this.curReg['type'];
    if(type === iotype.APP_BTN || type === iotype.APP_SWITCH) {
      this.swBtnClick(i);
    } else if(iotype.isAppWRable(type)) {
      this.openModalEdit(i, false);
    } else {
      console.log('start line chart! ');
    }
  }

  //Button/Switch click
  swBtnClick(i) {
    this.curReg = this.registerList[i];
    let type = this.curReg['type'];
    this.curEditReg = this.editReg[type];
    if(this.userControl === 0) {
      return;
    } else if(this.curReg['image'] === (IMG_DIR + "ic_switch_on.png") || 
              this.curReg['image'] === (IMG_DIR + "ic_btn_push.png")) 
    {
      this.curEditReg.val = parseInt(this.curReg['off'], 16);
      this.setRegVal();
    } else if(this.curReg['image'] === (IMG_DIR + "ic_switch_off.png") || 
              this.curReg['image'] === (IMG_DIR + "ic_btn_release.png") ) 
    {
      this.curEditReg.val = parseInt(this.curReg['on'], 16);
      this.setRegVal();
    } else {
      console.log('unknown btn/switch status! ');
    }
  }

  /*
    開啟修改數值POP UP視窗
  */
  @ViewChild('modalEditBinary')
  modalEditBinary: ModalComponent;

  @ViewChild('modalEdit')
  modalEdit: ModalComponent;

  openModalEdit(i, wronce = false) {
    if(this.userControl === 0) {
      return;
    } else if(this.devStatus === 0) {
      return;
    }
    utils.formReset(this.editReg);
    this.curReg = this.registerList[i];

    let type = this.curReg['type'];
    this.curEditReg = this.editReg[this.curReg['type']];
    if(!this.curEditReg) {
      return; // unable to edit 
    } else {
      if(iotype.isBinary(type)) {
        this.curEditReg.val = this.curReg['binaryArray'];
      } else {
        this.curEditReg.val = this.curReg['decimal'];
      }
    }

    let range = register.getValidRange(type, this.curReg['decimal'], this.curReg['fpt']);
    if(iotype.isIEEE754(type) || iotype.isFixPoint(type)) {
      this.curEditReg.valid = {frange: [range.min, range.max]};
      this.curEditReg.hint = range.min + ' ~ ' + range.max;
    } else {
      this.curEditReg.valid = {range: [range.min, range.max]};
      this.curEditReg.hint = range.min + ' ~ ' + range.max;
    }

    if(iotype.isAppWRable(type) || wronce) {
      if(iotype.isBinary(type)) {
        this.modalEditBinary.open();
      } else {
        this.modalEdit.open();
      }
    }
  }
  
  setBinaryRegVal() {
    let val = '';
    for(let i = 0; i < this.curEditReg.val.length; i++) {
      val += (this.curEditReg.val[i]) ? '1' : '0';
    }
    val = val ? val : '0';
    this.curEditReg.val = '' + parseInt(val, 2);
    this.setRegVal();
  }


  //編輯暫存器數值
  setRegVal() {
    let newRegVal = this.curEditReg.val;
    let type = this.curReg['type'];
    if(this.curReg['decimal'] && newRegVal === this.curReg['decimal']) {
      this.modalEdit.close();
      this.modalEditBinary.close();      
      return;
    } else if(this.curEditReg['valid']) {
      let err = utils.validInput(this.curEditReg['valid'], newRegVal);
      if(err) {
          console.log(err);      
          this.curEditReg['err'] = err.str;
          this.curEditReg['errRange'] = err.range;
          return;
      }
    }

    let hexVals = register.toHexVal(this.curReg, newRegVal);
    let putData: {[key:string]: any} = { sn: this.sn };
    if(iotype.is64bit(type) && hexVals['haddr'] && hexVals['iaddr'] && hexVals['jaddr'] && hexVals['laddr']) {
      putData['addr']  = this.curReg['haddr']; putData['val']   = hexVals['haddr'];
      putData['iaddr'] = this.curReg['iaddr']; putData['ival']  = hexVals['iaddr'];
      putData['jaddr'] = this.curReg['jaddr']; putData['jval']  = hexVals['jaddr'];      
      putData['laddr'] = this.curReg['laddr']; putData['lval']  = hexVals['laddr'];
    } else if(iotype.is48bit(type) && hexVals['haddr'] && hexVals['iaddr'] && hexVals['laddr']) {
      putData['addr']  = this.curReg['haddr']; putData['val']   = hexVals['haddr'];
      putData['iaddr'] = this.curReg['iaddr']; putData['ival']  = hexVals['iaddr'];
      putData['laddr'] = this.curReg['laddr']; putData['lval']  = hexVals['laddr'];
    } else if(iotype.is32bit(type) && hexVals['haddr'] && hexVals['laddr']) {
      putData['addr']  = this.curReg['haddr']; putData['val']   = hexVals['haddr'];
      putData['laddr'] = this.curReg['laddr']; putData['lval']  = hexVals['laddr'];
    } else { // 16bits
      putData['addr']  = this.curReg['haddr']; putData['val']   = hexVals['haddr'];
    }

    this.modalEdit.close();
    this.modalEditBinary.close();
    this.header['errorMessage'] = '';
    this.api.put(putData, '/api/device/' + this.sn + '/status').then((data: {[key:string]: any}) => {
      if(data['resCode'] === 200) {
        this.getRegStatus();
      } else if(data['resCode'] === 400 && data['desc'].match(/Device is logging/i)) {
        this.global.showErrMsg(this.header, 'usb_logging');
      } else {
        this.global.showErrMsg(this.header, 'err_save');
      }
    });
  }

  /*
    Remove Register
  */
  openModalRemove(i) {
    if(this.enLog === 1) {
      this.openModalDialog = {action: 'open', str: 'usb_logging'};
      return;
    }
    let reg = this.registerList[i];
    let str = this.global.langStr('make_sure_delete') + ' (<strong>' + this.global.langStr('register') + ': ' + reg['desc'] + '</strong>)';
    let argv = '("' +  this.sn + '","' +  reg.id + '")';
    this.openModalDialog = {
      action: 'open', 
      str: str, 
      yesNoFunc: 'this.delRegister' + argv, 
      important: true
    };    
  }

  delRegister(sn, mbusId) {
    let formData: any = new FormData();
    formData.append('mbusAction', 'DELETE');
    formData.append('sn', sn);
    formData.append('mbusId', mbusId);
    this.header['errorMessage'] = '';
    this.api.put(formData, '/api/device/edit', 'form').then((data: {[key:string]: any}) => {
      if(data['resCode'] === 200) {
        this.getRegStatus();
      } else if(data['resCode'] === 400 && data['desc'].match(/Device is logging/i)) {
        this.global.showErrMsg(this.header, 'usb_logging');
      } else {
        this.global.showErrMsg(this.header, 'err_save');
      }
    });
  };


  /*
   新增暫存器功能
  */
  @ViewChild('modalAddReg')
  modalAddReg: ModalComponent;

  allRegTypes: any[];
  addrList: string[] = []; 
  addRegBits: number = 16;
  addIOSWReg: boolean = false;
  addFptReg: boolean = false;
  addSwBtnReg: boolean = false;
  addSlvReg: boolean = false;
  addMstReg: boolean = false;
  ioswDevList: any[] = [];  
  ioswRegList: any[] = []; 
  fcList: any[] = []; 

  addReg: {[key: string]: any} = {
    desc:    {str: 'register', val: '', valid: {type: 'required'}, err: null, hint: 'description_reg'},
    type:    {str: 'type'    , val: '', valid: {range: [0,100]}, err: null, hint: ''},
    fc:      {str: 'function_code', val: '', valid: null, err: null, hint: ''},
    haddr:   {str: '', val: '', valid: null, err: null, hint: ''},
    iaddr:   {str: '', val: '', valid: null, err: null, hint: ''},
    jaddr:   {str: '', val: '', valid: null, err: null, hint: ''},
    laddr:   {str: '', val: '', valid: null, err: null, hint: ''},
    fpt:     {str: '', val: '', valid: null, err: null, hint: ''},
    on:      {str: '', val: '', valid: null, err: null, hint: 'default_on_val' },
    off:     {str: '', val: '', valid: null, err: null, hint: 'default_off_val'},
    swSN:    {str: '', val: '', valid: null, err: null, hint: ''},
    swAddr:  {str: '', val: '', valid: null, err: null, hint: ''},
    enlog:   {str: '', val: '', valid: null, err: null, hint: ''},
  };

  openModalAddReg() { 
    if(this.enLog === 1 || this.enServLog === 1) {
      this.openModalDialog = {action: 'open', str: 'usb_logging'};
      return;
    }
    let maxRegs = model.getMaxReg(this.mo);
    if(this.numUsedRegs >= maxRegs) {
      this.openModalDialog = {action: 'open', str: 'reach_register_limit'};
      return;
    } else {
      this.allRegTypes = register.getRegTyps(maxRegs - this.numUsedRegs);
    }
    
    utils.formReset(this.addReg);
    this.addReg['type'].val = 0;
    this.checkRegType();
    
    if(this.id) { // Master CE - Slave
      this.addSlvReg = false;
      this.addMstReg = true;
      this.addReg['haddr'].hint = 'addr_40001';
      this.addReg['laddr'].hint = 'addr_40002';
      this.modalAddReg.open();
    } else { // Slave CE
      this.addSlvReg = true;
      this.addMstReg = false;
      this.api.get('/api/device/reg/used/' + this.sn, true).then((data: {[key:string]: any}) => {
        this.addrList = register.getAvailAddr(this.mo, data['resCode'] ? data['regs']: []);
        this.addReg['haddr'].val = this.addrList[0];
        this.addReg['laddr'].val = this.addrList[1];
        this.modalAddReg.open();
      });
    }
  }

  //確認暫存器類型
  checkRegType() {
    let type: number = parseInt(this.addReg['type'].val);
    if(iotype.is16bit(type)) {
      this.addRegBits = 16;
    } else if(iotype.is32bit(type)) {
      this.addRegBits = 32;
    } else if(iotype.is48bit(type)) {
      this.addRegBits = 48;
    } else if(iotype.is64bit(type)) {
      this.addRegBits = 64;
    }

    if(iotype.isAppWRable(type)) { // app-write, modbus-read
      if(iotype.is16bit(type)) {
        this.addReg['fc'].val = 6;
        this.fcList = [
          {value: 5, name: 'write_coils_status'},
          {value: 6, name: 'write_holding_reigsters'},
          {value: 7, name: 'write_multi_holding_reigsters'},
        ];
      } else {
        this.addReg['fc'].val = 7;
        this.fcList = [
          {value: 7, name: 'write_multi_holding_reigsters'},
        ];
      }
    } else { // modbus-write, app-read
      this.addReg['fc'].val = 4;
      this.fcList = [
        {value: 0, name: 'read_coils_status'},
        {value: 1, name: 'read_input_status'},
        {value: 4, name: 'read_holoding_registers'},
        {value: 3, name: 'read_input_registers'},
      ];      
    }

    if(iotype.isMbusNumber(type)) {
      this.addReg['enlog'].str = 'en_reg_logging';
    } else {
      this.addReg['enlog'].str = 'en_reg_usb_logging';
    }

    if(iotype.isFixPoint(type)) {
      this.addFptReg = true;
    } else {
      this.addFptReg = false;
    }
    
    if(type === iotype.APP_BTN) {
      this.addSwBtnReg = true;
      this.addReg['on'].str  = 'btn_press_hint';
      this.addReg['off'].str = 'btn_release_hint';
    } else if(type === iotype.APP_SWITCH) {
      this.addSwBtnReg = true;
      this.addReg['on'].str  = 'switch_on_hint';
      this.addReg['off'].str = 'switch_off_hint';      
    } else {
      this.addSwBtnReg = false;
    } 

    if(iotype.isIOSW(type)) {
      this.addIOSWReg = true;
      this.getDeviceList(type);
    } else {
      this.addIOSWReg = false;
    }    
  }

  //取得IO裝置列表
  getDeviceList(type) {
    this.ioswDevList = [];
    this.api.get('/api/device/').then((data: {[key:string]: any}) => {
      if(data['resCode'] !== 200 || !data['devices']) {
        return;
      }
      for(let i = 0; i < data['devices'].length; i++) {
        let devConf = data['devices'][i];
        if(model.isMbusMaster(devConf.mo) && devConf.mstConf) {
          let slvIds = Object.keys(devConf.mstConf); 
          for(let j = 0; j < slvIds.length; j++) {
            let slvId = slvIds[j];
            this.ioswDevList.push({sn: devConf.sn, slvId: slvId, name: devConf.name + ' (' + devConf.sn + ') - ' + devConf.mstConf[slvId].name});
          }
        } else {
          this.ioswDevList.push({sn: devConf.sn, slvId: 0, name: devConf.name + ' (' + devConf.sn + ')'});
        }
      }
      this.addReg['swSN'].val = '0'; 
      this.getRegisterList(0, type);
    });
  }

  //取得IO暫存器列表
  getRegisterList(idx, type) {
    let devConf = this.ioswDevList[idx];
    let slvIdx = ((devConf.slvId) ? '?slvIdx=' + devConf.slvId : '');
    this.ioswRegList = [];
    this.api.get('/api/device/' + devConf.sn + slvIdx).then((data: {[key:string]: any}) => {
      if(data['resCode'] !== 200) {        
        return;
      }
      let mbData = (slvIdx) ? data['modbus'] : data['device']['modbus'];
      for(let i = 0; i < mbData.length; i++) {
        let reg = mbData[i];
        if(!reg) {
          continue;
        }
        if(iotype.is16bit(type) && iotype.is16bit(reg.type)) {
          this.ioswRegList.push({desc: reg.desc, addr: reg.haddr});
        } else if(iotype.is32bit(type) && iotype.is32bit(reg.type)) {
          this.ioswRegList.push({desc: reg.desc, addr: reg.haddr + (reg.laddr ? '-' + reg.laddr : '')});
        } else if(iotype.is48bit(type) && iotype.is48bit(reg.type)) {
          this.ioswRegList.push({desc: reg.desc, addr: reg.haddr + (reg.laddr ? '-' + reg.laddr : '')});
        } else if(iotype.is64bit(type) && iotype.is64bit(reg.type)) {
          this.ioswRegList.push({desc: reg.desc, addr: reg.haddr + (reg.laddr ? '-' + reg.laddr : '')});
        }
      }
      if(this.ioswRegList.length > 0) {
        this.addReg['swAddr'].val = this.ioswRegList[0].addr;
      }
    });
  }

  //新增暫存器
  saveRegister() {
    let err;
    let type = this.addReg['type'].val;
    let formData: any = new FormData();
    formData.append('mbusAction', 'ADD');
    formData.append('sn', this.sn);
    formData.append("mbusDesc", this.addReg['desc'].val);
    formData.append("mbusType", type);
    formData.append("mbusEnlog", (this.addReg['enlog'].val) ? 1 : 0);

    // form reset and valid
    if(utils.formValid(this.addReg)) {
      return;
    }

    if(this.addFptReg) {
      let fptRange = iotype.is48bit(type) ? {range: [0,3]} : {range: [0,4]};
      err = utils.validInput(fptRange, this.addReg['fpt'].val);
      if(err) {
        return this.addReg['fpt'].err = err.str;
      } 
      formData.append("mbusFpt", this.addReg['fpt'].val);
    }

    if(this.addMstReg) {
      err = utils.validInput({range: [0,9]}, this.addReg['fc'].val);
      if(err) {
        return this.addReg['fc'].err = err.str;
      } 
    }

    let _haddr, _laddr;
    let maxRegs= model.getMaxReg(this.mo);
    if(this.addMstReg) { // Master CE
      err = utils.validInput({type: 'mbusAddr'}, this.addReg['haddr'].val);
      if(err) {
        return this.addReg['haddr'].err = err.str;
      }
      _haddr = this.addReg['haddr'].val;
      if(_haddr.match(/^0x/i) || _haddr.match(/h$/i)) {
        _haddr = parseInt(this.id + this.addReg['fc'].val + utils.padZero((parseInt(_haddr, 16) + 1), 5));
      } else {
        _haddr = parseInt(this.id + this.addReg['fc'].val + utils.padZero((parseInt(_haddr) + 1), 5));
      }
      formData.append("mbusHaddr", _haddr);
    } else if(this.addSlvReg) { // Slave CE
      _haddr = parseInt(this.addReg['haddr'].val);
      err = utils.validInput({range: [40001, (40000 + maxRegs)]}, this.addReg['haddr'].val);
      if(err) {
        return this.addReg['haddr'].err = err.str;
      }
      formData.append("mbusHaddr", this.addReg['haddr'].val);
    }
 
    // 32, 48, 64 bits
    if(this.addRegBits > 16) {
      if(this.addMstReg) { // Master CE
        _laddr = this.addReg['laddr'].val;
        if(_laddr.match(/^0x/i) || _laddr.match(/h$/i)) {
          _laddr = parseInt(this.id + this.addReg['fc'].val + utils.padZero((parseInt(_laddr, 16) + 1), 5));
        } else {
          _laddr = parseInt(this.id + this.addReg['fc'].val + utils.padZero((parseInt(_laddr) + 1), 5));
        }         
      } else { // Slave CE
        _laddr = parseInt(this.addReg['laddr'].val);
        err = utils.validInput({range: [40001, (40000 + maxRegs)]}, this.addReg['laddr'].val);
        if(err) {
          return this.addReg['laddr'].err = err.str;
        }       
      } 
      if(_haddr === _laddr) {
        return this.addReg['haddr'].err = 'err_same_addr';
      }

      if(this.addRegBits === 32) {
        if(!((_haddr - 1) === _laddr || (_laddr - 1) === _haddr)) {
          this.addReg['haddr'].err = 'need_2_continuous_addrs';
          return;
        } 
        formData.append("mbusLaddr", _laddr.toString());
      } else if(this.addRegBits === 48) {
        if(!((_haddr - 2) === _laddr || (_laddr - 2) === _haddr)) {  
          this.addReg['haddr'].err = 'need_3_continuous_addrs';
          return;
        }
        if(_haddr > _laddr) {
          formData.append("mbusIaddr", (_haddr - 1).toString());
          formData.append("mbusLaddr", this.addReg['laddr'].val);
        } else {
          formData.append("mbusIaddr", (_laddr - 1).toString());
          formData.append("mbusLaddr", _laddr.toString());
        }
      } else if(this.addRegBits === 64) {
        if(!((_haddr - 3) === _laddr || (_laddr - 3) === _haddr)) {  
          return this.addReg['haddr'].err = 'need_4_continuous_addrs';
        }        
        if(_haddr > _laddr) {
          formData.append("mbusIaddr", (_haddr - 1).toString());
          formData.append("mbusJaddr", (_haddr - 2).toString());
          formData.append("mbusLaddr", _laddr.toString());
        } else {
          formData.append("mbusIaddr", (_laddr - 2).toString());
          formData.append("mbusJaddr", (_laddr - 1).toString());
          formData.append("mbusLaddr", _laddr.toString());
        }     
      }
    }

    if(this.addSwBtnReg) {
      let onVal: number  = ((this.addReg['on'].val)  ? parseInt(this.addReg['on'].val)  : 1);
      err = utils.validInput({range: [0,65535]}, this.addReg['on'].val);
      if(err) {
        this.addReg['on'].err = err.str;
        return this.addReg['on'].errRange = err.errRange;
      } 
      
      let offVal: number = ((this.addReg['off'].val) ? parseInt(this.addReg['off'].val) : 0);
      err = utils.validInput({range: [0,65535]}, this.addReg['off'].val);
      if(err) {
        this.addReg['off'].err = err.str;
        return this.addReg['off'].errRange = err.errRange;
      } 

      if(onVal === offVal) {
        this.addReg['on'].err = 'err_msg_cant_same_value';
        return this.addReg['off'].err = 'err_msg_cant_same_value';
      }
      formData.append("mbusOnVal", utils.padZero(onVal.toString(16), 4));
      formData.append("mbusOffVal", utils.padZero(offVal.toString(16), 4));
    }

    if(this.addIOSWReg) {
      this.addReg['swSN'].val = this.ioswDevList[this.addReg['swSN'].val].sn;
      err = utils.validInput({type: 'mac'}, this.addReg['swSN'].val);
      if(err) {
        return this.addReg['swSN'].err = err.str;
      } else {
        formData.append("mbusSwSN", this.addReg['swSN'].val);
      }

      err = utils.validInput({type: 'required'}, this.addReg['swAddr'].val);
      if(err) {
        return this.addReg['swAddr'].err = err.str;
      } else {
        formData.append("mbusSwAddr", this.addReg['swAddr'].val);
      }
    }

    this.modalAddReg.close();        
    this.header['errorMessage'] = '';
    this.api.put(formData, '/api/device/edit', 'form').then((data: {[key:string]: any}) => {
      if(data['resCode'] === 200) {
        this.getRegStatus();
      } else if(data['resCode'] === 400) {
        if(data['desc'].match(/The register address has been used/i)) {
          this.openModalDialog = {action: 'open', str: 'err_msg_dup_register', cbFunc: 'this.modalAddReg.open();'};
        } else if(data['desc'].match(/Device is logging/i)) {
          this.global.showErrMsg(this.header, 'usb_logging');        
        } else if(data['desc'].match(/No more available registers/i)) {
          this.global.showErrMsg(this.header, 'reach_register_limit');        
        } else {
          this.openModalDialog = {action: 'open', str: 'err_msg_invalid_str', cbFunc: 'this.modalAddReg.open();'};
        }
      } else {
        this.global.showErrMsg(this.header, 'err_save');
      }
    });
  }
}