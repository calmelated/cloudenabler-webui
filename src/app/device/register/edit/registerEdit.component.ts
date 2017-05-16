import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ApiService, GlobalService, IotypeService } from 'app/service';

@Component({
  selector: 'registerEdit',
  styleUrls: [ 'registerEdit.component.css' ],
  templateUrl: 'registerEdit.component.html'
})
export class RegisterEdit {
  header: {[key: string]: any} = {collspse: false, title: 'edit_register'};
  register: {[key: string]: any};
  registerList: any[];
  sn: string;
  id: string;

  ioType: {[key: number]: string} = {
    0 : 'modbus_16_bit_int',
    1 : 'modbus_16_bit_uint',
    2 : 'modbus_32_bit_int',
    3 : 'modbus_32_bit_uint',
    4 : 'modbus_ieee_754',
    5 : 'modbus_fix_point',
    6 : 'modbus_fix_point_16',
    7 : 'modbus_binary',
    8 : 'modbus_switch',
    10 : 'modbus_gcm',
    11 : 'modbus_email',
    12 : 'modbus_gcm_email',
    14 : 'modbus_iosw16',
    15 : 'modbus_iosw32',
    50 : 'app_16_bit_int',
    51 : 'app_16_bit_uint',
    52 : 'app_32_bit_int',
    53 : 'app_32_bit_uint',
    54 : 'app_ieee_754',
    55 : 'app_fix_point',
    56 : 'app_fix_point_16',
    57 : 'app_binary',
    58 : 'app_btn',
    59 : 'app_switch',
    99 : 'Type Error'
  };

  unitArray: string[] = [
    '℃',
    '%',
    'V',
    'A',
    'KV',
    'KA',
    'KW',
    'KVA',
    'KVAR',
    'KWH',
    'HZ'
  ];

  dtArray: any = [
    {'value': '', 'name': 'display_default'},
    {'value': 1, 'name': 'display_0_as_green'},
    {'value': 2, 'name': 'display_1_as_red'},
    {'value': 3, 'name': 'display_2_as_orange'},
    {'value': 4, 'name': 'display_3_as_yellow'},
    {'value': 5, 'name': 'display_4_as_blue'},
    {'value': 6, 'name': 'display_5_as_white'},
    {'value': 7, 'name': 'display_6_as_black'},
    {'value': 8, 'name': 'display_01_as_green_red'},
    {'value': 9, 'name': 'display_10_as_green_red'},
    {'value': 10, 'name': 'display_01_as_local_and_remote'},
    {'value': 11, 'name': 'display_012_as_off_on_and_trip'},
    {'value': 12, 'name': 'display_01_as_ok_and_err'},
    {'value': 13, 'name': 'display_82_76_67_as_rlc'},
    {'value': 14, 'name': 'display_01_as_putoff_on'},
    {'value': 15, 'name': 'display_01_as_puton_off'},
    {'value': 16, 'name': 'display_01_as_onsite_remote'},
    {'value': 17, 'name': 'display_01_as_remote_onsite'},
  ];

  selectUnit: string;
  userList: any[] = [];
  limitList: any[] = [];
  point: number = 0;
  button: number = 0;
  unit: number = 0;
  alarm: number = 0;
  switch: number = 0;
  io: number = 0;
  deviceInt: number = 0;
  placeholder: string = "";
  placeholderStart: number;
  placeholderEnd: number;
  onError: string = "";
  offError: string = "";
  time: string = "";
  timeStart: number;
  timeEnd: number;
  timeError: string = "";
  enLog: number = 0;
  logFreq: number = 0;

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private global: GlobalService,
    private iotype: IotypeService
  ) {
    this.route.params.forEach((params: Params) => {
      this.sn = params['sn'];
      this.id = params['id'];
    });

    this.getRegister();
    this.getRegisterList();
  }

  //取的暫存器資訊
  getRegister(type: string = "") {
    this.api.get('/api/device/' + this.sn + '?mbusId=' + this.id).then((data: {[key: string]: any}) => {
      if(data['resCode'] !== 200) {
        return;
      }
      this.register = data['modbus'];
      this.selectUnit = (this.register['unit']) ? this.register['unit'] : '';
      this.limitList = (this.register['limitId']) ? this.register['limitId']:[];
      this.register['enlog'] = parseInt(this.register['enlog']);
      this.register['on'] = parseInt(this.register['on'], 16);
      this.register['off'] = parseInt(this.register['off'], 16);
      this.register['dt'] = (this.register['dt']) ? this.register['dt'] : '';
      this.register['refReg'] = (this.register['refReg']) ? this.register['refReg'] : '';
      this.enLog = data['enLog'];
      this.logFreq = data['logFreq'] + 2;

      let type: number = this.register['type'];
      if([58,59].indexOf(type) !== -1) { //取得 按鈕 跟 開關 可輸入的數值範圍
        // let list: number[] = this.iotype.getPlaceholder(type, 0);
        // this.placeholderStart = list[0];
        // this.placeholderEnd = list[1];
        // this.placeholder = this.placeholderStart + " ~ " + this.placeholderEnd;
      }

      if(type === 58) {
        this.timeStart = 1;
        this.timeEnd = 60;
        this.time = this.timeStart + " ~ " + this.timeEnd;
      }

      this.getUser();
      this.checkType();
    });
  }

  //取的暫存器列表
  getRegisterList() {
    this.api.get('/api/device/' + this.sn + '/status').then((data: {[key: string]: any}) => {
      if(data['resCode'] !== 200) {
        return;
      }      
      this.registerList = data['iostats'];

      //32 bits 暫存器 需顯示laddr 資訊
      this.registerList.forEach((data: {[key: string]: any}) => {
        let type: number = data['type'];
        data['addr'] = ([2,3,4,5,15,52,53,54,55].indexOf(type) !== -1) ?  data['haddr'] + "-" + data['laddr']:data['haddr'];
      });
    });
  }

  //取得使用者對該暫存器的操作權限 一般user沒有該權限
  getUser() {
    this.api.get('/api/user').then((data: {[key: string]: any}) => {
      if(data['resCode'] !== 200) {
        return;
      }
      //移除 Admin 資訊 Admin 無法修改 
      data['users'].shift();
      data['users'].forEach((data: any) => {
        data['value'] = (data['admin'] === 0) ? 0:1;
        data['disabled'] = (data['admin'] === 0) ? 1 : 0;
        for(let a = 0; a < this.limitList.length; a++) {
          if(this.limitList[a] === data['id']) {
            data['value'] = 0;
          }
        };
      });
      this.userList = data['users'];
    });
  }

  //設定 單位顯示
  changeUnit() {
    this.register['unit'] = this.selectUnit;
  }

  //判別暫存器 種類
  checkType() {
    let type: number = parseInt(this.register['type']);
    let pointArray: number[] = [5,6,55,56];
    let unitArray: number[] = [0,1,2,3,4,5,6,8,50,51,52,53,54,55,56];
    let deviceIntArray: number[] = [0,1,2,3,8];
    let alarmArray: number[] = [10,11,12];

    this.point = (pointArray.indexOf(type) !==-1) ? 1 : 0;
    this.button = (type === 58) ? 1 : 0;
    this.switch = (type === 59) ? 1 : 0;
    this.unit = (unitArray.indexOf(type) !==-1) ? 1 : 0;
    this.alarm = (alarmArray.indexOf(type) !==-1) ? 1 : 0;
    this.deviceInt = (deviceIntArray.indexOf(type) !==-1) ? 1 : 0;
    this.io = ([14,15].indexOf(type) !==-1) ? 1 : 0;

    if(this.io === 1) {
      this.getIODeviceList();
    }
  }

  /*
    USB開啟紀錄 提示視窗
  */
  @ViewChild('modalAlarm')
  modalAlarm: ModalComponent;

  //儲存暫存器修改
  save() {
    var formData: any = new FormData();
    let mbusLimitId: string[] = [];
    let type: number = parseInt(this.register['type']);
    this.onError = "";
    this.offError = "";

    //當有開啟USB紀錄時無法做修改
    if(this.enLog === 1) {
      this.modalAlarm.open();
      return false;
    }

    this.userList.forEach((data: {[key: string]: any}) => {
      if(!data['value'] && data['admin'] === 1) {
        mbusLimitId.push(data['id']);
      }
    });

    formData.append('mbusAction', 'EDIT');
    formData.append('sn', this.sn);
    formData.append("mbusId", this.id);
    formData.append("mbusDesc", this.register['desc']);
    formData.append("mbusType", this.register['type']);
    formData.append("mbusHaddr", this.register['haddr']);
    formData.append("mbusLaddr", this.register['laddr']);
    formData.append("mbusUnit", (this.register['unit']) ? this.register['unit'] : '');
    //mbusLimitId 需要使用文字字串回傳 以陣列形式
    formData.append("mbusLimitId", '[' + mbusLimitId.toString() + ']');
    formData.append("mbusEnlog", (this.register['enlog']) ? 1 : 0);

    if(this.point === 1) {
      formData.append("mbusFpt", this.register['fpt']);
    }

    if(this.alarm === 1) {
      formData.append("mbusRefReg", this.register['refReg']);
    }

    if(this.io === 1) {
      formData.append("mbusSwSN", this.register['swSN']);
      formData.append("mbusSwAddr", this.register['swAddr']);
    }

    //裝置->APP 16 和 32 bits 整數, 正整數和開關 才有顯示狀態選項
    if([0,1,2,3,8].indexOf(type) !== -1) {
      formData.append("mbusDt", this.register['dt']);
    }

    //app 按鈕
    if(type === 58) {
      let btnTime: number = parseInt(this.register['btnTime']); 
      formData.append("mbusBtnTime", this.register['btnTime']);

      //判別輸入時間是否正確
      if(this.timeStart > btnTime || this.timeEnd < btnTime) {
        this.timeError = this.time;
        return false;
      }
    }

    //app 按鈕 和 開關
    if([58,59].indexOf(type) !== -1) {
      let on: number = parseInt(this.register['on']);
      let off: number = parseInt(this.register['off']);
      let hexOn: string = on.toString(16);
      let hexOff: string = off.toString(16);

      if(on === off) {
        this.global.showErrMsg(this.header, 'err_msg_cant_same_value');
        return false;
      }

      while(hexOn.length < 4) {
        hexOn = "0" + hexOn;
      }

      while(hexOff.length < 4) {
        hexOff = "0" + hexOff;
      }

      formData.append("mbusOnVal", hexOn);
      formData.append("mbusOffVal", hexOff);
    }

    this.api.put(formData, '/api/device/edit', 'form').then((data: {[key:string]: any}) => {
      if(data['resCode'] !== 200) {
        this.global.showErrMsg(this.header, 'err_save');
      }
    });
  }

  back() {
    let link = ['/devices/register/' + this.sn];
    this.router.navigate(link);
  }

  //暫存器IO 裝置列表
  ioDeviceList: any[] = [];

  //暫存器IO 暫存器列表
  ioRegisterList: any[] = [];

  //取得IO裝置列表
  getIODeviceList() {
    this.api.get('/api/device/').then((data: {[key:string]: any}) => {
      if(data['desc'] === 'OK') {
        this.ioDeviceList = data['devices'];
        this.getIORegisterList();
      }
    });
  }

  //取得IO暫存器列表
  getIORegisterList() {
    this.api.get('/api/device/' + this.register['swSN'] + '/status/').then((data: {[key:string]: any}) => {
      if(data['desc'] === 'OK') {
        let type: number = parseInt(this.register['type']);
        let iostats: any[] = data['iostats'];
        let bits16Array: number[] = [0,1,6,7,8,10,11,12,50,51,56,57,58,59];
        let bits32Array: number[] = [2,3,4,5,52,53,54,55];
        let checkList: number[] = (type === 14) ? bits16Array:bits32Array;

        this.ioRegisterList = [];
        iostats.forEach((data) => {
          if(checkList.indexOf(data['type']) !== -1) {
            data['addr'] = (data['laddr']) ? data['haddr'] + "-" + data['laddr']:data['haddr'];
            this.ioRegisterList.push(data);
          }
        });
      }
    });
  }

}