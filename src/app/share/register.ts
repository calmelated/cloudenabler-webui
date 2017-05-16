const iotype = require('./iotype');
const utils = require('./utils');
const model = require('./model.ts');

//顯示狀態對應圖片與名稱
const DISPLAY_TYPE: {[key: string]: any} = {
  1  : {0 : 'ic_led_green.png'},
  2  : {1 : 'ic_led_red.png'},
  3  : {2 : 'ic_led_orange.png'},
  4  : {3 : 'ic_led_yellow.png'},
  5  : {4 : 'ic_led_blue.png'},
  6  : {5 : 'ic_led_white.png'},
  7  : {6 : 'ic_led_black.png'},
  8  : {0 : 'ic_led_green.png', 1 : 'ic_led_red.png'},
  9  : {0 : 'ic_led_red.png',   1 : 'ic_led_green.png'},
  10 : {0 : 'local',  1 : 'remote'},
  11 : {0 : 'off',    1 : 'on', 2 : 'trip'},
  12 : {0 : 'normal', 1 : 'fault'},
  13 : {82: 'resistance', 76 : 'inductance', 67 : 'capacitance'},
  14 : {0 : 'putoff', 1 : 'puton'},
  15 : {0 : 'puton',  1 : 'putoff'},
  16 : {0 : 'onsite', 1 : 'remote'},
  17 : {0 : 'remote', 1 : 'onsite'}
};
module.exports.DISPLAY_TYPE = DISPLAY_TYPE;

const EditReg: {[key: string]: any} = {};
EditReg[iotype.MODBUS_INT16]      = {val: '', valid: null, str: 'modbus_16_bit_int' ,  hint: ''};   
EditReg[iotype.MODBUS_UINT16]     = {val: '', valid: null, str: 'modbus_16_bit_uint' , hint: ''};   
EditReg[iotype.MODBUS_FIXPOINT16] = {val: '', valid: null, str: 'modbus_fix_point_16', hint: ''};   
EditReg[iotype.MODBUS_UNFIXPT16]  = {val: '', valid: null, str: 'modbus_unfpt_16',     hint: ''};   
EditReg[iotype.MODBUS_INT32]      = {val: '', valid: null, str: 'modbus_32_bit_int' ,  hint: ''};   
EditReg[iotype.MODBUS_IEEE754]    = {val: '', valid: null, str: 'modbus_ieee_754' ,    hint: ''};   
EditReg[iotype.MODBUS_UINT32]     = {val: '', valid: null, str: 'modbus_32_bit_uint' , hint: ''};   
EditReg[iotype.MODBUS_UNFIXPT32]  = {val: '', valid: null, str: 'modbus_unfpt_32',     hint: ''};   
EditReg[iotype.MODBUS_FIXPOINT]   = {val: '', valid: null, str: 'modbus_fix_point' ,   hint: ''};   
EditReg[iotype.MODBUS_UNFIXPT48]  = {val: '', valid: null, str: 'modbus_unfpt_48',     hint: ''};   
EditReg[iotype.MODBUS_FIXPOINT64] = {val: '', valid: null, str: 'modbus_fix_point_64', hint: ''};   
EditReg[iotype.MODBUS_BINARY]     = {val: '', valid: null, str: 'modbus_binary',       hint: ''};   
EditReg[iotype.MODBUS_SWITCH]     = {val: '', valid: null, str: 'modbus_switch',       hint: ''};   
EditReg[iotype.ALARM_GCM]         = {val: '', valid: null, str: 'modbus_gcm',          hint: ''};   
EditReg[iotype.ALARM_EMAIL]       = {val: '', valid: null, str: 'modbus_email',        hint: ''};   
EditReg[iotype.ALARM_GE]          = {val: '', valid: null, str: 'modbus_gcm_email',    hint: ''};      
// EditReg[iotype.ALARM_CRITCAL]     = {val: '', valid: null, str: 'modbus_critical',     hint: ''};   
EditReg[iotype.APP_INT16]         = {val: '', valid: null, str: 'app_16_bit_int' ,     hint: ''};   
EditReg[iotype.APP_UINT16]        = {val: '', valid: null, str: 'app_16_bit_uint' ,    hint: ''};   
EditReg[iotype.APP_FIXPOINT16]    = {val: '', valid: null, str: 'app_fix_point_16' ,   hint: ''};   
EditReg[iotype.APP_UNFIXPT16]     = {val: '', valid: null, str: 'app_unfpt_16',        hint: ''};   
EditReg[iotype.APP_INT32]         = {val: '', valid: null, str: 'app_32_bit_int' ,     hint: ''};   
EditReg[iotype.APP_UINT32]        = {val: '', valid: null, str: 'app_32_bit_uint' ,    hint: ''};   
EditReg[iotype.APP_IEEE754]       = {val: '', valid: null, str: 'app_ieee_754' ,       hint: ''};   
EditReg[iotype.APP_FIXPOINT]      = {val: '', valid: null, str: 'app_fix_point' ,      hint: ''};   
EditReg[iotype.APP_UNFIXPT32]     = {val: '', valid: null, str: 'app_unfpt_32',        hint: ''};   
EditReg[iotype.APP_UNFIXPT48]     = {val: '', valid: null, str: 'app_unfpt_48',        hint: ''};   
EditReg[iotype.APP_FIXPOINT64]    = {val: '', valid: null, str: 'app_fix_point_64',    hint: ''};   
EditReg[iotype.APP_BTN]           = {val: '', valid: null, str: 'app_btn',             hint: ''};   
EditReg[iotype.APP_SWITCH]        = {val: '', valid: null, str: 'app_switch',          hint: ''};   
EditReg[iotype.APP_BINARY]        = {val: '', valid: null, str: 'app_binary',          hint: ''};   
EditReg[iotype.M2M_IOSW]          = {val: '', valid: null, str: 'modbus_iosw16',       hint: ''};   
EditReg[iotype.M2M_IOSW32]        = {val: '', valid: null, str: 'modbus_iosw32',       hint: ''};   
// EditReg[iotype.M2M_IOSW48]        = {val: '', valid: null, str: 'modbus_iosw48',       hint: ''};   
// EditReg[iotype.M2M_IOSW64]        = {val: '', valid: null, str: 'modbus_iosw64',       hint: ''};
module.exports.EditReg = EditReg;

const getRegTyps = (availRegs = 128) => {
  let result = [];
  let types = Object.keys(EditReg);
  for(let i = 0; i < types.length; i++) {
    let type = types[i];
    if(iotype.is64bit(type) && availRegs < 4) {
      continue;
    } else if(iotype.is48bit(type) && availRegs < 3) {
      continue;
    } else if(iotype.is32bit(type) && availRegs < 2) {
      continue;
    }
    result.push({name: EditReg[type].str, value: type});
  }
  return result;
}
module.exports.getRegTyps = getRegTyps;

const getValidRange = (type, val, fpt) => {
  let max, min;
  if(iotype.is64bit(type)) {
    if(iotype.isSigned(type)) {
      max = 4503599627370495;
      min = -4503599627370496;
    } else { // no support yet
      max = 9007199254740991;
      min = 0;
    }
  } else if(iotype.is48bit(type)) {
    if(iotype.isSigned(type)) {  // no support yet
      max = 999999;
      min = 0;        
    } else {
      max = 999999;
      min = 0;        
    }    
  } else if(iotype.isIEEE754(type)) {
    max = 3.4028235E38;      
    min = -3.4028235E38;
  } else if(iotype.is32bit(type)) {
    if(iotype.isSigned(type)) {
      max = 2147483647;
      min = -2147483648;
    } else {
      max = 4294967295;
      min = 0;        
    }
  } else { // 16bits
    if(iotype.isBinary(type) || type === iotype.APP_BTN || type === iotype.APP_SWITCH) {
      max = 65535;
      min = 0;           
    } else if(iotype.isSigned(type)) {
      max = 32767;
      min = -32768;   
    } else {
      max = 65535;
      min = 0;   
    }
  }

  if(iotype.isFixPoint(type) && utils.has(fpt)) {
    fpt = parseInt(fpt);
    if(fpt > 0) {
      if(iotype.is48bit(type)) {
        max = max + ((fpt > 0 ? 1 : 0) * 0.9) + ((fpt > 1 ? 1 : 0) * 0.09) + ((fpt > 2 ? 1 : 0) * 0.009)
      } else {
        let fptNum = Math.pow(10, fpt);
        min = min / fptNum;
        max = max / fptNum;
      }
    }
  }
  return {max, min};
}
module.exports.getValidRange = getValidRange;

const hexToDec = (hexString, charLoc) => {
  return "0123456789ABCDEF".indexOf(hexString.charAt(charLoc));
};
module.exports.hexToDec = hexToDec;

// padF(123, 5)  -> ff + 123 -> ff123
const padF = (num, size) => {
    let s = num + '';
    while (s.length < size) {
      s = 'f' + s;
    }
    return s;
};
module.exports.padF = padF;

// padZero(123, 5)  -> 00 + 123 -> 00123
const padZero = (num, size) => {
  let s = num + '';
  while (s.length < size) {
    s = ('0' + s);
  }
  return s;
};
module.exports.padZero = padZero;

const ieee754Decode = (hex, ebits = 8, fbits = 23) => {
  if(parseInt(hex) === 0) { 
    return 0;
  }
  //取得第一個 hex 用來判別是否需要補0
  //假設 4444 使用 toString(2) 轉換為 二進制後 會為 100010001000100 第一個0會不見
  let first: string = parseInt(hex.substr(0,1), 16).toString(2);
  let h: string = "";
  for(let a: number = 0; a < 4 - first.length; a ++) {
    h = h + "0";
  }

  let binary = h + parseInt(hex, 16).toString(2);
  let bias: number = (1 << (ebits - 1)) - 1;
  let s: number = parseInt(binary.substring(0, 1), 2) ? -1 : 1;
  let e: number = parseInt(binary.substring(1, 1 + ebits), 2);
  let f: number = parseInt(binary.substring(1 + ebits), 2);
  let dec: number = 0;
  
  // Produce number
  if (e === (1 << ebits) - 1) {
    dec = f !== 0 ? NaN : s * Infinity;
  } else if (e > 0) {
    dec = s * Math.pow(2, e - bias) * (1 + f / Math.pow(2, fbits));
  } else if (f !== 0) {
    dec = s * Math.pow(2, -(bias-1)) * (f / Math.pow(2, fbits));
  } else {
    dec = (s * 0);
  }
  return parseFloat(dec.toFixed(4));
};
module.exports.ieee754Decode = ieee754Decode;

const ieee754Encode = (decVal) => {
  decVal = new Uint8Array((new Float32Array([decVal])).buffer);
  let littleEndian = !!(new Uint8Array((new Uint32Array([1])).buffer))[0];
  let array = [];
  for (let i = 0; i < decVal.length; i++) {
    array[littleEndian ? "unshift" : "push"](decVal[i]); // couldn't resist writing this.
  }
  return array.map((byte) => {
    let hex = byte.toString(16);
    return hex.length === 1 ? "0" + hex : "" + hex;
  }).join("");
};
module.exports.ieee754Encode = ieee754Encode;

// conf { type: ,hval: ,fpt: ,doShift: }
const toDec16Val = (conf) => {
  if(typeof conf.hval === 'undefined') {
    return;
  }
  try {
    let val;
    let type = conf.type;
    if(iotype.isBinary(type)) { // binary
      val = padZero(parseInt(conf.hval, 16).toString(2), 16);
    } else if(iotype.isSigned(type)) {
      val = parseInt(conf.hval, 16);
      if(padZero(val.toString(2), 16)[0] === '1') {
        val = 0xffff0000 | val;
        val = (~val + 1) * -1;
      }
    } else { // 16bits unsigned int, Alarm, Btn, Switch
      val = parseInt(conf.hval, 16);
    }
    // Handle fix points if have
    if(iotype.isFixPoint(type) && conf.fpt > 0) { // fix Point
      val = (conf.noShift) ? val : (val / Math.pow(10, conf.fpt)).toFixed(conf.fpt);
    }        
    return val;
  } catch(e) {
    console.log(e.stack);
  }
};
module.exports.toDec16Val = toDec16Val;

// conf { type: ,hval: ,lval: ,fpt: ,doShift: }
const toDec32Val = (conf) => {
  if(typeof conf.hval === 'undefined' ||
     typeof conf.lval === 'undefined') {
      return;
  }
  try {
    let val;
    let type = conf.type;
    let hval = padZero(conf.hval, 4);
    let lval = padZero(conf.lval, 4);
    if(iotype.isIEEE754(type)) {
      val = ieee754Decode(hval + lval);
      // val = (fpt > 0) ? Math.round((val * Math.pow(10, fpt))) / Math.pow(10, fpt) : val ;
    } else if(iotype.isSigned(type)) {
      val = utils.hexToInt(hval + lval);            
    } else { // 32bits unsigned int
      val = parseInt(hval + lval, 16);
    }
    // Handle fix points if have
    if(iotype.isFixPoint(type) && conf.fpt > 0) { // fix Point
      val = (conf.noShift) ? val : (val / Math.pow(10, conf.fpt)).toFixed(conf.fpt);
    }        
    return val;
  } catch(e) {
    console.log(e.stack);
  }
};
module.exports.toDec32Val = toDec32Val;

// conf { type: ,hval: ,ival:, lval: ,fpt: ,doShift: }
const toDec48Val = (conf) => {
  if(typeof conf.hval === 'undefined' ||
     typeof conf.ival === 'undefined' ||
     typeof conf.lval === 'undefined') {
    return;
  }
  try {
    let type = conf.type;
    let val = parseInt(conf.hval, 16) * 1000 + parseInt(conf.ival, 16) + parseInt(conf.lval, 16) / 1000;
    if(iotype.isFixPoint(type) && conf.fpt > 0) { // fix Point
      let _shift = Math.pow(10, conf.fpt);
      val = Math.floor(val * _shift) / _shift;
    }
    if(conf.noShift) {
      val = val * 1000;
    }
    return val;
  } catch(e) {
    console.log(e.stack);
  }
};
module.exports.toDec48Val = toDec48Val;

// conf { type: ,hval: ,lval: ,fpt: ,doShift: }
const toDec64Val = (conf) => {
  if(typeof conf.hval === 'undefined' ||
     typeof conf.ival === 'undefined' ||
     typeof conf.jval === 'undefined' ||
     typeof conf.lval === 'undefined') {
    return;
  }
  try {
    let val;
    let type = conf.type;
    let val1 = padZero(conf.hval, 2);
    let val2 = padZero(conf.ival, 4);
    let val3 = padZero(conf.jval, 4);
    let val4 = padZero(conf.lval, 4);
    if(iotype.isSigned(type)) {
      val = utils.hexToInt64(val1 + val2 + val3 + val4);
    } else { // 64bits unsigned int
      val = parseInt(val1 + val2 + val3 + val4, 16);            
    }
    if(iotype.isFixPoint(type) && conf.fpt > 0) { // fix Point
      val = (conf.noShift) ? val : (val / Math.pow(10, conf.fpt)).toFixed(conf.fpt);
    }        
    return val;
  } catch(e) {
    console.log(e.stack);
  }
};
module.exports.toDec64Val = toDec64Val;

const hexToBinary = (ioData) => {
  let binaryArray: string[] = [];
  let hval: string = (ioData['hval'] === '') ? "0000" : ioData['hval'];
  while(hval.length < 4) {
    hval = "0" + hval;
  }

  //轉 十六進制 到 二進制 
  binaryArray = hval.split("");
  binaryArray.forEach((data: string, index: number) => {
    data = parseInt(data, 16).toString(2);
    while(data.length < 4) {
      data = "0" + data;
    }
    binaryArray[index] = data;
  });

  let numberArray: number[] = [];
  binaryArray.join("").split("").forEach((data: string, index: number) => {
    numberArray.push(parseInt(data));
  });

  return {
    binaryArray: numberArray,
    binaryString: binaryArray[0] + " " + binaryArray[1] + "<br>" + binaryArray[2] + " " + binaryArray[3],
  }
};
module.exports.hexToBinary = hexToBinary;

const toDecVal = (ioData) => {
  if(utils.isNone(ioData['hval'])) {
    return '';
  }

  let conf = {};    
  let type = parseInt(ioData['type']);
  if(iotype.isIOSW(type)) {
    conf['type'] = parseInt(ioData['swType']);
  } else {
    conf['type'] = type; 
  }
  if(utils.has(ioData['fpt'])) {
    conf['fpt'] = ioData['fpt'];
  }

  if(iotype.is64bit(conf['type']) && utils.has(ioData['ival']) && utils.has(ioData['jval']) && utils.has(ioData['lval'])) {
    conf['hval'] = ioData['hval'];
    conf['ival'] = ioData['ival'];
    conf['jval'] = ioData['jval'];
    conf['lval'] = ioData['lval'];
    return toDec64Val(conf);            
  } else if(iotype.is48bit(type) && utils.has(ioData['ival']) && utils.has(ioData['lval'])) {
    conf['hval'] = ioData['hval'];
    conf['ival'] = ioData['ival'];
    conf['lval'] = ioData['lval'];
    return toDec48Val(conf);        
  } else if(iotype.is32bit(type) && utils.has(ioData['lval'])) {
    conf['hval'] = ioData['hval'];
    conf['lval'] = ioData['lval'];
    return toDec32Val(conf);        
  } else { // 16 bits
    conf['hval'] = ioData['hval'];
    return toDec16Val(conf);
  }
};
module.exports.toDecVal = toDecVal;

const toHexVal = (curReg, decVal) => {
  let hex  = '';
  let hval = null;
  let ival = null; 
  let jval = null; 
  let lval = null;    
  try {
    let type = curReg['type'];
    if(iotype.is48bit(type)) {
      // nothing
    } else if(iotype.isIEEE754(type)) {
      hex = ieee754Encode(decVal);
    } else if(type === iotype.APP_BTN) {
      hex = decVal.toString(16);
    } else if(type === iotype.APP_SWITCH) {
      hex = decVal.toString(16);
    } else { // 64,32,16bits, remaining types
      let newVal = (decVal.indexOf('.') < 0) ? parseInt(decVal) : parseFloat(decVal);
      if(iotype.isFixPoint(type)) {
        let fpt = curReg['fpt'];
        newVal = parseInt('' + newVal * Math.pow(10, fpt));
      }
      if(decVal < 0 && iotype.isSigned(type)) {
        if (iotype.is64bit(type)) {
          hex = 'fff' + padZero((0xfffffffffffff + newVal + 1).toString(16), 13);
        } else if(iotype.is32bit(type)) {
          hex = (0xffffffff + newVal + 1).toString(16);
        } else { // 16bits
          hex = (0xffff + newVal + 1).toString(16);
        }          
      } else {
        hex = newVal.toString(16);       
      }
    }

    if (iotype.is64bit(type)) {
      hex = padZero(hex, 16);
      hval = hex.substring(0, 4);
      ival = hex.substring(4, 8);
      jval = hex.substring(8, 12);
      lval = hex.substring(12, 16);
    } else if(iotype.is48bit(type)) {
      let tmpVal = (decVal.indexOf('.') < 0) ? parseInt(decVal) : parseFloat(decVal);
      hval = parseInt('' + (tmpVal / 1000 % 1000)).toString(16);
      ival = parseInt('' + (tmpVal % 1000)).toString(16);
      lval = parseInt('' + (tmpVal * 1000 % 1000)).toString(16);
    } else {
      hex = padZero(hex, 8);
      if (iotype.is32bit(type)) {
        hval = hex.substring(0, 4);
        lval = hex.substring(4, 8);
      } else {
        hval = hex.substring(4, 8);
        lval = null;
      }
    }
  } catch (e) {
    console.dir(e);
  } finally {
    return {
      haddr: hval, 
      iaddr: ival, 
      jaddr: jval,
      laddr: lval,
    };
  }
}
module.exports.toHexVal = toHexVal;

const getAvailAddr = (mo = '63511', usedAddr = []) => {
  let total = model.getMaxReg(mo);
  let addrList: string[] = [];
  for(let a = 1; a <= total; a++) {
    let addr: string = (40000 + a).toString()
    if(usedAddr.indexOf(addr) < 0) {
      addrList.push(addr); 
    }
  }
  return addrList;
};
module.exports.getAvailAddr = getAvailAddr;

