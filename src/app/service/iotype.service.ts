import { Injectable } from '@angular/core';
import { GlobalService, ApiService } from '../service';

// // Dev -> APP
// const MODBUS_INT16       = 0;
// const MODBUS_UINT16      = 1;
// const MODBUS_INT32       = 2;
// const MODBUS_UINT32      = 3;
// const MODBUS_IEEE754     = 4;
// const MODBUS_FIXPOINT    = 5;
// const MODBUS_FIXPOINT16  = 6;
// const MODBUS_BINARY      = 7;
// const MODBUS_SWITCH      = 8;
// const MODBUS_FIXPOINT64  = 9;
// const MODBUS_UNFIXPT16   = 20;
// const MODBUS_UNFIXPT32   = 21;
// const MODBUS_UNFIXPT48   = 22;
// // Alarm
// const ALARM_GCM          = 10;
// const ALARM_EMAIL        = 11;
// const ALARM_GE           = 12;
// const ALARM_CRITCAL      = 13;
// // M2M
// const M2M_IOSW           = 14;
// const M2M_IOSW32         = 15;
// const M2M_IOSW48         = 16;
// const M2M_IOSW64         = 17;
// // APP -> DEV
// const APP_INT16          = 50;
// const APP_UINT16         = 51;
// const APP_INT32          = 52;
// const APP_UINT32         = 53;
// const APP_IEEE754        = 54;
// const APP_FIXPOINT       = 55;
// const APP_FIXPOINT16     = 56;
// const APP_BINARY         = 57;
// const APP_BTN            = 58;
// const APP_SWITCH         = 59;
// const APP_FIXPOINT64     = 60;
// const APP_UNFIXPT16      = 61;
// const APP_UNFIXPT32      = 62;
// const APP_UNFIXPT48      = 63;
// // TYPE Error
// const TYPE_ERROR         = 99;

/* 所有暫存器的名稱與數值 */
// const IO_TYPE: any[] = [
//   {value: MODBUS_INT16,       name: 'modbus_16_bit_int'},
//   {value: MODBUS_UINT16,      name: 'modbus_16_bit_uint'},
//   {value: MODBUS_INT32,       name: 'modbus_32_bit_int'},
//   {value: MODBUS_UINT32,      name: 'modbus_32_bit_uint'},
//   {value: MODBUS_IEEE754,     name: 'modbus_ieee_754'},
//   {value: MODBUS_FIXPOINT,    name: 'modbus_fix_point'},
//   {value: MODBUS_FIXPOINT16,  name: 'modbus_fix_point_16'},
//   {value: MODBUS_BINARY,      name: 'modbus_binary'},
//   {value: MODBUS_SWITCH,      name: 'modbus_switch'},
//   {value: MODBUS_FIXPOINT64,  name: 'modbus_fix_point_64'},
//   {value: MODBUS_UNFIXPT16,   name: 'modbus_unfpt_16'},
//   {value: MODBUS_UNFIXPT32,   name: 'modbus_unfpt_32'},
//   {value: MODBUS_UNFIXPT48,   name: 'modbus_unfpt_48'},  
//   {value: ALARM_GCM,          name: 'modbus_gcm'},
//   {value: ALARM_EMAIL,        name: 'modbus_email'},
//   {value: ALARM_GE,           name: 'modbus_gcm_email'},
//   {value: ALARM_CRITCAL,      name: 'modbus_critical'},
//   {value: M2M_IOSW,           name: 'modbus_iosw16'},
//   {value: M2M_IOSW32,         name: 'modbus_iosw32'},
//   {value: M2M_IOSW48,         name: 'modbus_iosw48'},
//   {value: M2M_IOSW64,         name: 'modbus_iosw64'},
//   {value: APP_INT16,          name: 'app_16_bit_int'},
//   {value: APP_UINT16,         name: 'app_16_bit_uint'},
//   {value: APP_INT32,          name: 'app_32_bit_int'},
//   {value: APP_UINT32,         name: 'app_32_bit_uint'},
//   {value: APP_IEEE754,        name: 'app_ieee_754'},
//   {value: APP_FIXPOINT,       name: 'app_fix_point'},
//   {value: APP_FIXPOINT16,     name: 'app_fix_point_16'},
//   {value: APP_BINARY,         name: 'app_binary'},
//   {value: APP_BTN,            name: 'app_btn'},
//   {value: APP_SWITCH,         name: 'app_switch'},
//   {value: APP_FIXPOINT64,     name: 'app_fix_point_64'},
//   {value: APP_UNFIXPT16,      name: 'app_unfpt_16'},
//   {value: APP_UNFIXPT32,      name: 'app_unfpt_32'},
//   {value: APP_UNFIXPT48,      name: 'app_unfpt_48'},
// ];

// //顯示狀態對應圖片與名稱
// const DISPLAY_TYPE: {[key: string]: any} = {
//   1  : {0 : 'ic_led_green.png'},
//   2  : {1 : 'ic_led_red.png'},
//   3  : {2 : 'ic_led_orange.png'},
//   4  : {3 : 'ic_led_yellow.png'},
//   5  : {4 : 'ic_led_blue.png'},
//   6  : {5 : 'ic_led_white.png'},
//   7  : {6 : 'ic_led_black.png'},
//   8  : {0 : 'ic_led_green.png', 1 : 'ic_led_red.png'},
//   9  : {0 : 'ic_led_red.png',   1 : 'ic_led_green.png'},
//   10 : {0 : 'local',  1 : 'remote'},
//   11 : {0 : 'off',    1 : 'on', 2 : 'trip'},
//   12 : {0 : 'normal', 1 : 'fault'},
//   13 : {82: 'resistance', 76 : 'inductance', 67 : 'capacitance'},
//   14 : {0 : 'putoff', 1 : 'puton'},
//   15 : {0 : 'puton',  1 : 'putoff'},
//   16 : {0 : 'onsite', 1 : 'remote'},
//   17 : {0 : 'remote', 1 : 'onsite'}
// };

// const REG_RANGE: {[key: number]: any} = {};
// REG_RANGE[MODBUS_INT16]      = [-32768, 32767];
// REG_RANGE[MODBUS_UINT16]     = [0, 65535];
// REG_RANGE[MODBUS_INT32]      = [-2147483648, 2147483647];
// REG_RANGE[MODBUS_UINT32]     = [0, 4294967295];
// REG_RANGE[MODBUS_IEEE754]    = [-3.4028235E38, 3.4028235E38];
// REG_RANGE[MODBUS_FIXPOINT]   = [-2147483648, 2147483647];
// REG_RANGE[MODBUS_FIXPOINT16] = [-32768, 32767];
// REG_RANGE[APP_INT16]         = [-32768, 32767];
// REG_RANGE[APP_UINT16]        = [0, 65535];
// REG_RANGE[APP_INT32]         = [-2147483648, 2147483647];
// REG_RANGE[APP_UINT32]        = [0, 4294967295];
// REG_RANGE[APP_IEEE754]       = [-3.4028235E38, 3.4028235E38];
// REG_RANGE[APP_FIXPOINT]      = [-2147483648, 2147483647];
// REG_RANGE[APP_FIXPOINT16]    = [-32768, 32767];
// REG_RANGE[APP_BTN]           = [0, 65535];
// REG_RANGE[APP_SWITCH]        = [0, 65535];

@Injectable()
export class IotypeService {
  constructor (
    public global: GlobalService,
    public api: ApiService
  ) { }

  // static is64bit(type: number) {
  //   if(type === MODBUS_FIXPOINT64 || 
  //      type === APP_FIXPOINT64    || 
  //      type === M2M_IOSW64) {
  //       return true;
  //   }
  //   return false;
  // };

  // static is48bit(type: number) {
  //   if(type === MODBUS_UNFIXPT48 || 
  //      type === APP_UNFIXPT48    || 
  //      type === M2M_IOSW48) {
  //       return true;
  //   }
  //   return false;
  // };

  // static is32bit(type: number) {
  //   if(type === MODBUS_INT32     || type === MODBUS_UINT32 || type === MODBUS_IEEE754  || 
  //      type === MODBUS_FIXPOINT  || type === APP_UINT32    || type === APP_INT32       || 
  //      type === APP_IEEE754      || type === APP_FIXPOINT  || type === M2M_IOSW32      || 
  //      type === MODBUS_UNFIXPT32 || type === APP_UNFIXPT32) {
  //       return true;
  //   }
  //   return false;
  // };

  // static is16bit(type: number) {
  //   return (
  //     IotypeService.is32bit(type) || 
  //     IotypeService.is48bit(type) || 
  //     IotypeService.is64bit(type)
  //   ) ? false : true;
  // };

  // static isCommAlarm(type: number) {
  //   return (
  //     type === ALARM_GE    || 
  //     type === ALARM_EMAIL || 
  //     type === ALARM_GCM
  //   ) ? true : false ;
  // };

  // static isAppWRable(type: number) {
  //   return (type >= APP_INT16 && type <= APP_UNFIXPT48) ? true : false ;
  // };

  // static isModbusWRable(type: number) {
  //   return (type >= MODBUS_INT16 && type <= MODBUS_UNFIXPT48) ? true : false ;
  // };

  // static isIOSW(type: number) {
  //   return (
  //     type === M2M_IOSW   || 
  //     type === M2M_IOSW32 || 
  //     type === M2M_IOSW48 || 
  //     type === M2M_IOSW64
  //   ) ? true : false ;
  // };

  // static isSigned(type: number) {
  //   return IotypeService.isUnsigned(type) ? false : true ;
  // };

  // static isUnsigned(type: number) {
  //   return (
  //     type === MODBUS_UINT16    || type === MODBUS_UINT32    || type === APP_UINT16       || 
  //     type === APP_UINT32       || type === APP_SWITCH       || type === APP_BTN          || 
  //     type === ALARM_GCM        || type === ALARM_CRITCAL    || type === ALARM_EMAIL      || 
  //     type === ALARM_GE         || type === APP_UNFIXPT48    || type === APP_UNFIXPT32    || 
  //     type === APP_UNFIXPT16    || type === MODBUS_UNFIXPT48 || type === MODBUS_UNFIXPT32 || 
  //     type === MODBUS_UNFIXPT16
  //   ) ? true : false ;
  // };

  // static isIEEE754(type: number) {
  //   return (type === APP_IEEE754 || type === MODBUS_IEEE754) ? true : false ;
  // };

  // static isFixPoint(type: number) {
  //   return (
  //     type === APP_FIXPOINT   || type === MODBUS_FIXPOINT   || 
  //     type === APP_FIXPOINT16 || type === MODBUS_FIXPOINT16 || 
  //     type === APP_FIXPOINT64 || type === MODBUS_FIXPOINT64 ||
  //     type === APP_UNFIXPT48  || type === MODBUS_UNFIXPT48  ||
  //     type === APP_UNFIXPT16  || type === MODBUS_UNFIXPT16  ||
  //     type === APP_UNFIXPT32  || type === MODBUS_UNFIXPT32  
  //   ) ? true : false ;
  // };

  // static isBinary(type: number) {
  //   return (type === APP_BINARY || type === MODBUS_BINARY) ? true : false ;
  // };

  // static isEventData(type: number) {
  //   if(IotypeService.isCommAlarm(type) || 
  //      type === MODBUS_SWITCH          ||
  //      type === APP_SWITCH             || 
  //      type === APP_BTN) {
  //       return true;
  //   }
  //   return false;
  // };

  // static isAppNumber(type: number) {
  //   return (
  //     type === APP_FIXPOINT   || type === APP_UINT16    || type === APP_INT16     ||
  //     type === APP_FIXPOINT16 || type === APP_UINT32    || type === APP_INT32     || 
  //     type === APP_FIXPOINT64 || type === APP_UNFIXPT16 || type === APP_UNFIXPT32 ||
  //     type === APP_UNFIXPT48
  //   ) ? true : false ;
  // };

  // static isMbusNumber(type: number) {
  //   return (
  //     type === MODBUS_FIXPOINT   || type === MODBUS_UINT16    || type === MODBUS_INT16       ||
  //     type === MODBUS_FIXPOINT16 || type === MODBUS_UINT32    || type === MODBUS_INT32       || 
  //     type === MODBUS_SWITCH     || type === MODBUS_IEEE754   || type === MODBUS_FIXPOINT64  ||
  //     type === MODBUS_UNFIXPT48  || type === MODBUS_UNFIXPT32 || type === MODBUS_UNFIXPT16
  //   ) ? true : false ;
  // };

  // static isNumber(type: number) {
  //   return (
  //     IotypeService.isAppNumber(type)   || 
  //     IotypeService.isMbusNumber(type)  || 
  //     type === MODBUS_IEEE754           || 
  //     type === APP_IEEE754
  //   ) ? true : false ;
  // };

  // static isMathEq(type: number) {
  //   return (
  //     IotypeService.isMbusNumber(type) || 
  //     IotypeService.isCommAlarm(type)
  //   ) ? true : false ;
  // };

  // static isDispaly(type: number) {
  //   if(type === MODBUS_INT16  || type === MODBUS_UINT16 || 
  //      type === MODBUS_INT32  || type === MODBUS_UINT32 || 
  //      type === MODBUS_SWITCH) {
  //       return true;
  //   }
  //   return false;
  // };

  // static enCloudLogging(type: number) {
  //   return (
  //     IotypeService.isMbusNumber(type) || 
  //     IotypeService.isCommAlarm(type)
  //   ) ? true : false;  
  // };

  //取得暫存器列表
  // getRegistrType() {
    // return IO_TYPE;
  // }  

  // //取得暫存器列表資訊
  // getRegister(header: {[key: string]: any}) {
  //   this.api.get('/api/device/' + header['sn'] + '/status').then((data: {[key: string]: any}) => {
  //     if(data['desc'] !== 'OK') {
  //       return;
  //     }
  //     const imageUrl: string = '/assets/img/';
  //     data['iostats'].forEach((ioData: {[key: string]: any}) => {
  //       let type: number = parseInt(ioData['type']);
  //       ioData['decimal'] = this.hexToDecimal(ioData);

  //       // Value column
  //       ioData['valType'] = 'normal';
  //       if(IotypeService.isBinary(type)) {
  //         let ret = this.hexToBinary(ioData);
  //         ioData['valType'] = 'binary';
  //         ioData['binaryArray'] = ret.binaryArray;
  //         ioData['binaryString'] = ret.binaryString;
  //       } else if(IotypeService.isCommAlarm(type) && ioData['decimal']) {
  //         ioData['valType'] = 'alarm';
  //         ioData['image'] = imageUrl + 'ic_alarm.png';
  //       } else if(IotypeService.isMbusNumber(type) && ioData['dt']) {
  //         let dt: number = parseInt(ioData['dt']);
  //         let decVal: number = parseInt(ioData['decimal']);
  //         if(DISPLAY_TYPE[dt][decVal]) {
  //           if(dt < 10) { // led
  //             ioData['image'] = imageUrl + DISPLAY_TYPE[dt][decVal]
  //             ioData['valType'] = 'dtLed';
  //           } else { // customer's request string
  //             ioData['dtString'] = DISPLAY_TYPE[dt][decVal];
  //             ioData['valType'] = 'dtString';
  //             if(dt === 12 && decVal === 1) {
  //               ioData['redDTtext'] = 1;
  //             } 
  //           }            
  //         }
  //       }

  //       // Icon column
  //       if(data['status'] === 0) {
  //         ioData['appIcon'] = 'dev_offline';
  //         ioData['image'] = imageUrl + 'ic_dev_offline.png';
  //       } else if(IotypeService.isIOSW(type)) {
  //         ioData['appIcon'] = 'iosw';
  //         ioData['image'] = imageUrl + 'ic_iosw.png';
  //       } else if(IotypeService.isAppWRable(type) && data['userControl'] === 1) {
  //         if(type === APP_SWITCH) {
  //           ioData['appIcon'] = 'switch';
  //           ioData['image'] = imageUrl + (ioData['on'] === ioData['hval']) ? "ic_switch_on.png" : "ic_switch_off.png";
  //         } else if(type === APP_BTN) {
  //           ioData['appIcon'] = 'btn';
  //           ioData['image'] = imageUrl + (ioData['on'] === ioData['hval']) ? "ic_btn_push.png" : "ic_btn_release.png";
  //         } else if(type === APP_BINARY) {
  //           ioData['appIcon'] = 'binary';
  //           ioData['image'] = imageUrl + 'ic_binary.png';
  //         } else {
  //           ioData['appIcon'] = 'editor';
  //           ioData['image'] = imageUrl + 'ic_editor.png';
  //         }
  //       }
  //     });

  //     //依照 haddr 大小排序
  //     data['iostats'].sort((a, b) => {return parseInt(a.haddr) - parseInt(b.haddr);});
  //     header['registerList'] = data['iostats'];
  //     header['userControl'] = data['userControl'];
  //     header['enLog'] = data['enLog'];
  //   });
  // }

  // //取得 Slave 暫存器列表資訊
  // getSlaveRegister(header: {[key: string]: any}) {
  //   this.api.get('/api/device/' + header['sn'] + '/status?slvIdx=' + header['slvIdx']).then((data: {[key: string]: any}) => {
  //     if(data['desc'] !== 'OK') {
  //       return;
  //     }
  //     data['iostats'].forEach((ioData: {[key: string]: any}) => {
  //       let intArray: number[] = [4,5,6,50,51,52,53,54,55,56];
  //       let statusArray: number[] = [0,1,2,3,8];
  //       let type: number = ioData['type'];
  //       let imageUrl: string = "/assets/img/";
  //       let imageName: string;

  //       ioData['int'] = (intArray.indexOf(type) !== -1) ? 1 : 0;
  //       ioData['io'] = ([14,15].indexOf(type) !== -1) ? 1 : 0;
  //       ioData['status'] = (statusArray.indexOf(type) !== -1) ? 1 : 0;
  //       ioData['binary'] = ([7,57].indexOf(type) !== -1) ? 1 : 0;
  //       ioData['button'] = (type === 58) ? 1 : 0;
  //       ioData['alarm'] = ([10,11,12].indexOf(type) !== -1) ? 1 : 0;

  //       if(ioData['binary'] === 1) {
  //         //猜分 十六進制 用來轉換 二進制 
  //         let binaryArray: string[] = [];
  //         let hval: string = (ioData['hval'] === '') ? "0000":ioData['hval'];
  //         let numberArray: number[] = [];

  //         while(hval.length < 4) {
  //           hval = "0" + hval;
  //         }

  //         binaryArray = hval.split("");

  //         //轉 十六進制 到 二進制 
  //         binaryArray.forEach((data: string, index: number) => {
  //           data = parseInt(data, 16).toString(2);
  //           while(data.length < 4) {
  //             data = "0" + data;
  //           }

  //           binaryArray[index] = data;
  //         });

  //         ioData['binaryString'] = binaryArray[0] + " " + binaryArray[1] + "<br>" 
  //                                  + binaryArray[2] + " " + binaryArray[3];

  //         binaryArray.join("").split("").forEach((data: string, index: number) => {
  //           numberArray.push(parseInt(data));
  //         });

  //         ioData['binaryArray'] = numberArray;

  //       } 

  //       if(ioData['button'] === 1) {
  //         imageName = (ioData['on'] === ioData['hval']) ? "ic_btn_push.png" : "ic_btn_release.png";
  //         ioData['image'] = imageUrl + imageName;
  //       }

  //       if(type === 59) {
  //         imageName = (ioData['on'] === ioData['hval']) ? "ic_switch_on.png" : "ic_switch_off.png";
  //         ioData['image'] = imageUrl + imageName;
  //       }

  //      //裝置 16bits int, 16bits unint, 32 bits int, 32bits unint 和 switch 需要判別顯示狀態
  //       if(ioData['status'] === 1 && ioData['dt']) {
  //         let dt: number = parseInt(ioData['dt']);
  //         let v: number = parseInt(ioData['hval'], 16);
  //         let dtData: {[key:string]: any} = DISPLAY_TYPE[dt];
  //         ioData['dtString'] = '';
  //         ioData['image'] = ''
  //         ioData['red'] = '';

  //         if(dt < 10 && dtData[v]) {
  //           ioData['image'] = imageUrl + dtData[v];
  //         }

  //         if(dt >= 10 && dtData[v]) {
  //           ioData['dtString'] = dtData[v];
  //           ioData['red'] = (dt === 12 && v === 1) ? "1" : '';
  //         }
  //       }

  //       if(ioData['alarm'] === 1) {
  //         imageName = 'ic_alarm.png';
  //         ioData['image'] = imageUrl + imageName;
  //       }

  //       ioData['decimal'] = this.hexToDecimal(ioData);

  //       //slave 顯示位址方式不太一樣
  //       let slaveTypeData: {[key: string]: string} = {
  //         0 : "FC-01",
  //         1 : "FC-02",
  //         3 : "FC-04",
  //         4 : "FC-03",
  //         5 : "FC-05",
  //         6 : "FC-06",
  //         7 : "FC-16",
  //       };
  //       let haddr: string =  ioData['haddr'];
  //       let slaveType: string = haddr.slice(1, 2);
  //       //假設 1500011 第二位數 5 為 type, 00011 為二進制需轉為十六進制顯示
  //       let slaveHaddr: string = "0x" + (parseInt(haddr.slice(2, 7))-1).toString(16).toUpperCase();
  //       let laddr: string =  ioData['laddr'];

  //       ioData['slaveHaddr'] = slaveTypeData[slaveType] + "," + slaveHaddr;
  //       ioData['slaveLaddr'] = (ioData['laddr']) ? "0x" + (parseInt(laddr.slice(2, 7))-1).toString(16).toUpperCase() : '';
  //     });

  //     header['slaveRegisterList'] = data['iostats'];
  //     header['userControl'] = data['userControl'];
  //   });
  // }

  //取得目前可用位址
  // getAddr(usedAddr = []) {
  //   let addrList: string[] = [];
  //   let a: number;

  //   //存放 40001 ~ 40128 字串到陣列裡面
  //   for(a = 1; a <= 128; a++) {
  //     let addr: string = (40000 + a).toString()
  //     addrList.push(addr); 
  //   }

  //   //把使用過的位址從陣列移除
  //   usedAddr.forEach((addr: string) => {
  //     let index: number = addrList.indexOf(addr);
  //     addrList.splice(index, 1);
  //   });

  //   return addrList;
  // }

  // //十進制 轉換成 固定點小數
  // getFixPoint(number, fpt) {
  //   let x: string = (number / Math.pow(10, fpt)).toString();
  //   let point: number = x.indexOf(".");
  //   let s_length: number = x.length -1;
  //   if(point === -1) {
  //     x = x + ".";
  //     for(let a = 0 ; a < fpt; a++) {
  //       x = x + "0";
  //     }
  //   } else {
  //     let p_length: number = s_length - point;
  //     if(fpt > p_length ) {
  //       for(let a = 0; a < fpt - p_length ; a++) {
  //         x = x + "0";
  //       }
  //     }
  //   }
  //   return x;
  // }

  /*
    取得 各類型數字可填寫範圍
    5,6,55,56 為固定小數點整數 需要依照 FPT 調整小數點
  */
  // getPlaceholder(type, fpt = 0) {
    // if(!REG_RANGE[type]) {
    //   return [0, 0];
    // } else if(IotypeService.isFixPoint(type)) {
    //   return [REG_RANGE[type][0] / Math.pow(10, fpt), REG_RANGE[type][1] / Math.pow(10, fpt)];
    // } 
    // return REG_RANGE[type];
  // }

  // hexToBinary(ioData) {
  //   let binaryArray: string[] = [];
  //   let hval: string = (ioData['hval'] === '') ? "0000" : ioData['hval'];
  //   while(hval.length < 4) {
  //     hval = "0" + hval;
  //   }
    
  //   //轉 十六進制 到 二進制 
  //   binaryArray = hval.split("");
  //   binaryArray.forEach((data: string, index: number) => {
  //     data = parseInt(data, 16).toString(2);
  //     while(data.length < 4) {
  //       data = "0" + data;
  //     }
  //     binaryArray[index] = data;
  //   });

  //   let numberArray: number[] = [];
  //   binaryArray.join("").split("").forEach((data: string, index: number) => {
  //     numberArray.push(parseInt(data));
  //   });

  //   return {
  //     binaryArray: numberArray,
  //     binaryString: binaryArray[0] + " " + binaryArray[1] + "<br>" + binaryArray[2] + " " + binaryArray[3],
  //   }
  // }

  // /*
  //   十進制 轉 十六進制
  // */
  // decimalToHex(data) {
  //   let number: string = data['decimal'];
  //   let type: number = data['type'];
  //   let fpt: number = data['fpt'];
  //   let hex: string = "";
  //   let hvar: string = "";
  //   let lvar: string = "";
  //   let a: number;
  //   let length: number;
  //   let p_length: number;
  //   let dec: number = parseFloat(number);


  //   //32 bits 和 16 bits 暫存器是否為負值 與 小數點計算
  //   if([50,52,55,56].indexOf(type) !== -1) {
  //     //取固定小數點再轉換成整數做計算
  //     if([55,56].indexOf(type) !== -1) {
  //       number = dec.toFixed(fpt);
  //       number = number.replace(".", "");
  //     }
      
  //     dec = parseInt(number);

  //     //使用2補數 轉換 小於0的數值
  //     if(dec < 0) {
  //       //16 bits 整數
  //       if([50,56].indexOf(type) !== -1) {
  //         dec = 65535 + dec + 1;
  //       }
  //       //32 bits 整數
  //       if([52,55].indexOf(type) !== -1) {
  //         dec = 4294967295 + dec + 1;
  //       }
  //     }
  //   }

  //   if(type === 54) {
  //     dec = this.toIEEE754(number);
  //   }

  //   if(type === 57) {
  //     let bin: string = "";
  //     let binArray: any[] = data['binaryArray'];

  //     binArray.forEach((data: any) => {
  //       let checked: string = (data) ? "1":"0";
  //       bin = bin + checked;
  //     });

  //     dec = parseInt(bin, 2);
  //   }

  //   if(type === 58) {
  //     dec = parseInt(data['on'], 16);
  //   }

  //   if(type === 59) {
  //     let on: string = parseInt(data['on'], 16).toString();
  //     let off: string = parseInt(data['off'], 16).toString();

  //     dec = (number === on) ? parseInt(off):parseInt(on);
  //   }

  //   //十進制 轉 十六進制
  //   hex = dec.toString(16);

  //   //32bits 暫存器 資料存在 2個位址數值為 hval + lval
  //   if([52,53,54,55].indexOf(type) !== -1) {
  //     hex = this.global.addZero(hex, 8);
      
  //     hvar = hex.substr(0, 4);
  //     lvar = hex.substr(4, 4);
  //   }
  //   else {
  //     hvar = this.global.addZero(hex, 4);
  //   }

  //   return [hvar, lvar];
  // }

  // /*
  //   十六進制 轉 十進制 
  // */
  // hexToDecimal(data) {
  //   let hval: string = data['hval'];
  //   let lval: string = data['lval'];
  //   let type: number = data['type'];
  //   let swType: number = data['swType'];
  //   let fpt: number = parseInt(data['fpt']);
  //   let hex: string = hval;
  //   let on: string;
  //   let off: string;
  //   let decimal: string;
  //   let num: number;

  //   //判別是否是 IO 如果是IO 計算方式使用 swType
  //   if([14,15].indexOf(type) !== -1) {
  //     type = swType;
  //   }

  //   if(lval) {
  //     lval = this.global.addZero(lval, 4);
  //   }

  //   //32bits 暫存器 資料存在 2個位址數值為 hval + lval
  //   if([2,3,4,5,52,53,54,55].indexOf(type) !== -1) {
  //     hex = hex + lval;
  //   }

  //   // 使用 parseInt function 把 16進制轉成十進制
  //   num = parseInt(hex, 16);

  //   //判斷16bits 是否為負數 超過 32767 都為負數
  //   if([0,6,50,56].indexOf(type) !== -1) {
  //     if(num > 32767) {
  //       num = num - 65536;
  //     }
  //   }

  //   //判斷32bits 是否為負數 超過 32767 都為負數
  //   if([2,5,52,55].indexOf(type) !== -1) {
  //     if(num > 2147483647) {
  //       num = num - 4294967296;
  //     }
  //   }

  //   //ieee 754
  //   if([4,54].indexOf(type) !== -1) {
  //     num = this.fromIEEE754(hex);
  //   }

  //   decimal = (isNaN(num)) ? '' : num.toString();

  //   //如果是固定小數點 使用 getFixPoint 把整數轉換成 固定小數點整數
  //   if(fpt > 0 && hval !== '') {
  //     decimal = this.getFixPoint(decimal, fpt);
  //   }
  //   return decimal;
  // }

  // // 十進制 轉換成 ieee754 二進制 再轉成 十進制輸出 
  // toIEEE754(v, ebits = 8, fbits = 23) {
  //   //計算基準值 2^7 -1 
  //   let bias: number = (1 << (ebits - 1)) - 1;

  //   // s：符號 e：指數 f：小數
  //   let s: any;
  //   let e: number;
  //   let f: number;
  //   if (isNaN(v)) {
  //       e = (1 << bias) - 1; f = 1; s = 0;
  //   } else if (v === Infinity || v === -Infinity) {
  //       e = (1 << bias) - 1; f = 0; s = (v < 0) ? 1 : 0;
  //   } else if (v === 0) {
  //       e = 0; f = 0; s = (1 / v === -Infinity) ? 1 : 0;
  //   } else {
  //     s = v < 0;
  //     v = Math.abs(v);

  //     //主要程式
  //     if (v >= Math.pow(2, 1 - bias)) {
  //         var ln = Math.min(Math.floor(Math.log(v) / Math.LN2), bias);
  //         e = ln + bias;
  //         f = v * Math.pow(2, fbits - ln) - Math.pow(2, fbits);
  //     }
  //     else {
  //         e = 0;
  //         f = v / Math.pow(2, 1 - bias - fbits);
  //     }
  //   }
  //   let i: number;
  //   let bits: number[] = [];
  //   for (i = fbits; i; i -= 1) { 
  //     bits.push(f % 2 ? 1 : 0); f = Math.floor(f / 2); 
  //   }
  //   for (i = ebits; i; i -= 1) { 
  //     bits.push(e % 2 ? 1 : 0); 
  //     e = Math.floor(e / 2); 
  //   }

  //   //如果為負數 s = true 
  //   bits.push(s ? 1 : 0);
  //   bits.reverse(); ///陣列反轉 才會為正確2進制

  //   // 二進制 轉十進制
  //   var str = bits.join('');
  //   return parseInt(str,2);
  // }

  // //十六進制 轉換成 ieee754 二進制 再轉成十進制
  // fromIEEE754(hex, ebits = 8, fbits = 23) {
  //   if(parseInt(hex) === 0) { 
  //     return 0;
  //   }
  //   //取得第一個 hex 用來判別是否需要補0
  //   //假設 4444 使用 toString(2) 轉換為 二進制後 會為 100010001000100 第一個0會不見
  //   let first: string = parseInt(hex.substr(0,1), 16).toString(2);
  //   let h: string = "";
  //   for(let a: number = 0; a < 4 - first.length; a ++) {
  //     h = h + "0";
  //   }

  //   let binary = h + parseInt(hex, 16).toString(2);
  //   let bias: number = (1 << (ebits - 1)) - 1;
  //   let s: number = parseInt(binary.substring(0, 1), 2) ? -1 : 1;
  //   let e: number = parseInt(binary.substring(1, 1 + ebits), 2);
  //   let f: number = parseInt(binary.substring(1 + ebits), 2);
  //   let dec: number = 0;
    
  //   // Produce number
  //   if (e === (1 << ebits) - 1) {
  //     dec = f !== 0 ? NaN : s * Infinity;
  //   } else if (e > 0) {
  //     dec = s * Math.pow(2, e - bias) * (1 + f / Math.pow(2, fbits));
  //   } else if (f !== 0) {
  //     dec = s * Math.pow(2, -(bias-1)) * (f / Math.pow(2, fbits));
  //   } else {
  //     dec = (s * 0);
  //   }
  //   return parseFloat(dec.toFixed(4));
  // }
}