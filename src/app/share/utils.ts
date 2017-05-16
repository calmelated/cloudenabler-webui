module.exports.range = (start, end) => {
  var array = [];
  for (var i = start; i <= end; i++) {
      array.push(i);
  }
  return array;
};

module.exports.formReset = (form) => {
  for(let key in form) {
    form[key].val = null;
    form[key].err = null;
  }
};

module.exports.formValid = (form) => {
  let failedForm = false;
  for(let key in form) {
    form[key].err = null;
    if(!form[key].valid) {
      continue;
    }
    let result = module.exports.validInput(form[key].valid, form[key].val);
    if(!result)  {
      continue;
    }
    failedForm = true;
    form[key].err = result.str;
    if(result.range) {
      form[key].errRange = result.range;
    }
  }
  return failedForm;
};

// valid = {type: 'password', strlen:[6,32]} or valid = {range: [0,65535]}
// return 
//   -> null if no any error
//   -> error string 
module.exports.validInput = (valid, input) => {
  if(valid.type === 'required') {
    if(!input) {
      return {str:'errorRequired'};
    }    
  } else if(valid.type === 'password') {
    if(!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/).test(input)) {
      return {str:'err_msg_strong_password'};
    }
  } else if(valid.type === 'email') {
    if(!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(input)) {
      return {str:'Invalid Email'};
    }      
  } else if(valid.type === 'mac') {
    if(!(/^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/i).test(input)) {
      return {str:'Invalid MAC address'};
    }         
  } else if(valid.type === 'ip') {
    if(!(/^(([01]?\d\d?|2[0-4]\d|25[0-5])\.){3}([01]?\d\d?|2[0-4]\d|25[0-5])/).test(input)) {
      return {str:'Invalid IP address'};
    }         
  } else if(valid.type === 'mbusAddr') {
    let _input;
    if((/^0x[0-9abcdefABCDEF]{1,4}/).test(input)) {        
      _input = parseInt(input.substr(2, input.length), 16);
    } else if((/[0-9abcdefABCDEF]{1,4}[hH]$/).test(input)) {        
      _input = parseInt(input.substr(0, input.length - 1), 16);
    } else if((/[0-9]{1,5}/).test(input)) {        
      _input = parseInt(input, 16);
    } else {
      return {str:'Invalid Modbus address'};
    }
    if(_input < 0 || _input > 65534) {
      return {str:'Invalid Modbus address'};
    }
  }
  if(valid.strlen) { // strlen = [6, 32]
    if(this.isNone(input)) {
      return {str:'errorRequired'};
    }    
    let minlen = valid.strlen[0];
    if(input.length < minlen) {
      return {str:'Input length is out of range', range: valid.strlen[0] + ' ~ ' + valid.strlen[1]};
    }
    let maxlen = valid.strlen[1];
    if(input.length > maxlen) {
      return {str:'Input length is out of range', range: valid.strlen[0] + ' ~ ' + valid.strlen[1]};
    }      
  } 
  if(valid.frange) { // floating number range = [10, 65535]
    if(this.isNone(input)) {
      return {str:'errorRequired'};
    }  
    input = input.trim();
    if(!input.match(/^(?:[+-])?(?:[1-9]\d*|0)?(?:\.\d+)?$/gm)) {
      return {str:'Input is not a floating number'};
    } 
    let _input = parseFloat(input);
    let min = parseFloat(valid.frange[0]);
    if(_input < min) {
      return {str:'Input number is out of range', range: valid.frange[0] + ' ~ ' + valid.frange[1]};
    }
    let max = parseFloat(valid.frange[1]);
    if(_input > max) {
      return {str:'Input number is out of range', range: valid.frange[0] + ' ~ ' + valid.frange[1]};
    }       
  }    
  if(valid.range) { // number range = [10, 65535]
    if(this.isNone(input)) {
      return {str:'errorRequired'};
    }     
    input = (input + '').trim();
    if(!input.match(/^(?:[+-])?(?:[1-9]\d*|0)?$/gm)) {
      return {str:'Input is not a number'};
    } 
    let _input = parseInt(input);
    let min = parseInt(valid.range[0]);
    if(_input < min) {
      return {str:'Input number is out of range', range: valid.range[0] + ' ~ ' + valid.range[1]};
    }
    let max = parseInt(valid.range[1]);
    if(_input > max) {
      return {str:'Input number is out of range', range: valid.range[0] + ' ~ ' + valid.range[1]};
    }       
  }
  if(valid.within) { // value in array ['abc','cde']
    if(!input || !Array.isArray(valid.within)) {
      return {str:'errorRequired'};
    } else {
      input = (input + '').trim();
    }
    if(!valid.within.indexOf(input)) {
      return {str:'err_msg_invalid_str'};
    }   
  }  
  return null;
}

module.exports.loadingSpinner = (show: boolean) => {
  let spinner = document.getElementById('loadingSpinner');
  if(spinner) {
    spinner.style.display = show ? 'block' : 'none';
  }
};

/*
true cases:
has(undefined);     //undefined
has(null);          //null
has(NaN);           //not a number
has('');            //empty string

false cases:
has(false);         //boolean
has(true);          //boolean
has(0);             //number
has(5);             //number
has('aa');          //string
has({});            //object
has([]);            //array
has(() => {});      //function
*/
module.exports.has = (input) => {
  if(typeof input === 'undefined' || input === null || input === '') { 
     return false;
  } else if((input + '') === 'NaN') {
     return false;
  }
  return true;
};

module.exports.isNone = (input) => {
   return !module.exports.has(input);
};

module.exports.padZero = (num, size) => {
  let s = num + '';
  if(s.length > size) {
      s = s.substr(0, size);
  } else {
    while (s.length < size) {
        s = '0' + s;
    }    
  }
  return s;
};

module.exports.hexToInt64 = (hex) => {
  hex = hex.replace(/^0x/i, '');
  let neg = parseInt(hex.substr(hex.length - 14, 1), 16);    
  let sign = (isNaN(neg) || (neg & 0x1) === 0) ? 1 : -1;

  const maxVal = 4503599627370495; 
  hex = (hex.length > 12) ?  hex.substr(hex.length - 13, 13) : hex ;
  let num = parseInt(hex, 16);
  if (sign < 0) { // negative value
    num = num - maxVal - 1;
  }
  return num;
};

module.exports.hexToInt = (hex) => {
  hex = hex.replace(/^0x/i, '');
  if (hex.length % 2 !== 0) {
    hex = "0" + hex;
  }
  let num = parseInt(hex, 16);
  let maxVal = Math.pow(2, hex.length / 2 * 8);
  if (num > maxVal / 2 - 1) {
    num = num - maxVal;
  }
  return num;
};

// (40001, 40004) -> [40001, 40002, 40003, 40004]
// (40004, 40001) -> [40004, 40003, 40002, 40001]
module.exports.getContiAddrs = (haddr, laddr) => {
  let _haddr = parseInt(haddr);
  let _laddr = parseInt(laddr);                    
  let ret = [];
  if(_haddr < _laddr) { // big endian
    for(let addr = _haddr; addr <= _laddr; addr++) {
        ret.push(addr);
    } 
  } else {
    for(let addr = _haddr; addr >= _laddr; addr--) {
        ret.push(addr);
    } 
  } 
  return ret;
};

module.exports.calChkSum = (pktAction, pktLen, pktId, size) => {
  let sum = 0;
  let buf = Buffer.concat([pktAction, pktLen, pktId]);
  for (let i = 0; i < buf.length; i++) {
    //console.log(buf.readUInt8(i));
    sum += buf.readUInt8(i);
  }
  return module.exports.toBytes(sum, size);
};

module.exports.mac2hex = (mac) => {
  if(mac && mac.length === 17) { // 11:22:33:44:55:66 or 11-22-33-44-55-66
    mac = mac.toLowerCase();
    let macs = mac.split(':');
    macs = (macs.length === 1) ? mac.split('-') : macs;
    if(macs.length === 1) {
      console.log('invalid mac address! ' + mac);
      return mac; // error
    }
    return macs[0] + macs[1] + macs[2] + macs[3] + macs[4] + macs[5];
  } else {
    console.log('invalid mac address! ' + mac);
    return mac; // error
  }
};

// aabbccddeeff -> aa:bb:cc:dd:ee:ff
module.exports.hex2mac = (mac) => {
  if(mac && mac.length === 12) {
    return (mac[0] + mac[1] + ':' + mac[2] + mac[3] + ':' + mac[4] + mac[5]+ ':' + mac[6] + mac[7]+ ':' + mac[8] + mac[9]+ ':' + mac[10] + mac[11]).toLowerCase();
  } else {
    console.log('invalid mac address! ' + mac);
    return mac; // error
  }
};

// 1400001 - > 1, 400001
module.exports.getSlvId = (addr) => {
    return parseInt((addr / 1000000).toString());
};

// 1400001 - > 400001
module.exports.getRealAddr = (addr) => {
    return addr.toString().substr(1, addr.length);
};

// fc-4, addr: 65536 -> fc-4, addr: 0xff
module.exports.getMbusAddr = (addr) => {
    return (parseInt(((addr % 100000) - 1).toString()).toString(16));
};

module.exports.getFCode = (addr) => {
    let fcIdx = parseInt(((addr / 100000) % 10).toString());
    if(fcIdx === 0) {
      return '01';
    } else if(fcIdx === 1) {
      return '02';
    } else if(fcIdx === 3) {
      return '04';
    } else if(fcIdx === 4) {
      return '03';
    } else if(fcIdx === 5) { // write coil
      return '05';
    } else if(fcIdx ===6) { // write holding
      return '06';
    } else if(fcIdx === 7) { // write multi-holding
      return '16';
    } else if(fcIdx === 8) { // write multi-coils
      return '15';
    } else {
      return '';
    }
};

module.exports.clone = (obj, dbg) => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    console.log(e.stack);
  }
  return;
};

module.exports.toJson = (jStr) => {
  if(!jStr) { 
    return; 
  } else if(jStr === '{}') {
    return {};
  } else if(typeof jStr === 'object') {
    return jStr;
  }
  try {
    return JSON.parse(jStr);
  } catch (e) {
    console.log('Invalid json string:');
    console.log(jStr);
  }
  return;
};

module.exports.toJsonStr = (json) => {
  if(!json) {
      return;
  }
  try {        
    return JSON.stringify(json);
  } catch (e) {
    console.log('Invalid json object:');
    console.log(json);
  }
  return;
};

module.exports.isJsonStr = (jStr) => {
  try {
      return JSON.parse(jStr);
  } catch (e) {
  }
  return;
};

module.exports.randPass = (length) => {
  let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP1234567890";
  let pass = "";
  for (let x = 0; x < length; x++) {
    let i = Math.floor(Math.random() * chars.length);
    pass += chars.charAt(i);
  }
  return pass;
};

// epoch time to "[n]d hh:mm:ss"
module.exports.toTimeString = (msec) => {
  let result = '';
  let sec = parseInt((msec / 1000).toString());
  let d = new Date(null);
  let nday = 0;
  if(sec >= 86400) {
    nday = parseInt((sec / 86400).toString());
    d.setSeconds((sec - nday * 86400));
    result = nday + 'd ' + d.toISOString().substr(11, 8);
  } else {
    d.setSeconds(sec);
    result = d.toISOString().substr(11, 8);
  }
  return result;
};
