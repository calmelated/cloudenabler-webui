// Modbus write
var MODBUS_INT16            = 0;
var MODBUS_UINT16           = 1;
var MODBUS_INT32            = 2;
var MODBUS_UINT32           = 3;
var MODBUS_IEEE754          = 4;
var MODBUS_FIXPOINT         = 5;
var MODBUS_FIXPOINT16       = 6;
var MODBUS_BINARY           = 7;
var MODBUS_SWITCH           = 8;
var MODBUS_FIXPOINT64       = 9;
var MODBUS_UNFIXPT16        = 20;
var MODBUS_UNFIXPT32        = 21;
var MODBUS_UNFIXPT48        = 22;

// Modbus push notification
var ALARM_GCM               = 10;
var ALARM_EMAIL             = 11;
var ALARM_GE                = 12;
var ALARM_CRITCAL           = 13;
var M2M_IOSW                = 14;
var M2M_IOSW32              = 15;
var M2M_IOSW48              = 16;
var M2M_IOSW64              = 17;

// APP write
var APP_INT16               = 50;
var APP_UINT16              = 51;
var APP_INT32               = 52;
var APP_UINT32              = 53;
var APP_IEEE754             = 54;
var APP_FIXPOINT            = 55;
var APP_FIXPOINT16          = 56;
var APP_BINARY              = 57;
var APP_BTN                 = 58;
var APP_SWITCH              = 59;
var APP_FIXPOINT64          = 60;
var APP_UNFIXPT16           = 61;
var APP_UNFIXPT32           = 62;
var APP_UNFIXPT48           = 63;

// Error
var TYPE_ERROR              = 99;

var is64bit = function(type) {
    type = parseInt(type);
    if(type === MODBUS_FIXPOINT64 || type === APP_FIXPOINT64 || type === M2M_IOSW64) {
        return true;
    }
    return false;
};

var is48bit = function(type) {
    type = parseInt(type);
    if(type === MODBUS_UNFIXPT48 || type === APP_UNFIXPT48 || type == M2M_IOSW48) {
        return true;
    }
    return false;
};

var is32bit = function(type) {
    type = parseInt(type);
    if(type === MODBUS_INT32     || type === MODBUS_UINT32 || type === MODBUS_IEEE754  || 
       type === MODBUS_FIXPOINT  || type === APP_UINT32    || type === APP_INT32       || 
       type === APP_IEEE754      || type === APP_FIXPOINT  || type === M2M_IOSW32      || 
       type === MODBUS_UNFIXPT32 || type === APP_UNFIXPT32) {
        return true;
    }
    return false;
};

var is16bit  = function(type) {
    type = parseInt(type);
    return (is32bit(type) || is48bit(type) || is64bit(type)) ? false : true;
};


var isCommAlarm = function(type) {
    type = parseInt(type);
    return (type === ALARM_GE || type === ALARM_EMAIL || type === ALARM_GCM) ? true : false ;
};

var isAppWRable = function(type) {
    type = parseInt(type);
    return (type >= APP_INT16 && type <= APP_UNFIXPT48) ? true : false ;
};

var isModbusWRable = function(type) {
    type = parseInt(type);
    return (type >= MODBUS_INT16 && type <= MODBUS_UNFIXPT48) ? true : false ;
};

var isIOSW = function(type) {
    type = parseInt(type);
    return (type === M2M_IOSW || type === M2M_IOSW32 || type === M2M_IOSW48 || type === M2M_IOSW64) ? true : false ;
};

var isSigned = function(type) {
    type = parseInt(type);
    return isUnsigned(type) ? false : true ;
};

var isUnsigned = function(type) {
    type = parseInt(type);
    return (type === MODBUS_UINT16    || type === MODBUS_UINT32    || type === APP_UINT16       || 
            type === APP_UINT32       || type === APP_SWITCH       || type === APP_BTN          || 
            type === ALARM_GCM        || type === ALARM_CRITCAL    || type === ALARM_EMAIL      || 
            type === ALARM_GE         || type === APP_UNFIXPT48    || type === APP_UNFIXPT32    || 
            type === APP_UNFIXPT16    || type === MODBUS_UNFIXPT48 || type === MODBUS_UNFIXPT32 || 
            type === MODBUS_UNFIXPT16) ? true : false ;
};

var isIEEE754 = function(type) {
    type = parseInt(type);
    return (type === APP_IEEE754 || type === MODBUS_IEEE754) ? true : false ;
};

var isFixPoint = function(type) {
    type = parseInt(type);
    return (type === APP_FIXPOINT   || type === MODBUS_FIXPOINT   || 
            type === APP_FIXPOINT16 || type === MODBUS_FIXPOINT16 || 
            type === APP_FIXPOINT64 || type === MODBUS_FIXPOINT64 ||
            type === APP_UNFIXPT48  || type === MODBUS_UNFIXPT48  ||
            type === APP_UNFIXPT16  || type === MODBUS_UNFIXPT16  ||
            type === APP_UNFIXPT32  || type === MODBUS_UNFIXPT32  
            ) ? true : false ;
};

var isBinary = function(type) {
    type = parseInt(type);
    return (type === APP_BINARY || type === MODBUS_BINARY) ? true : false ;
};

var isEventData = function(type) {
    if(isCommAlarm(type) || type === MODBUS_SWITCH || type === APP_SWITCH || type === APP_BTN) {
        return true;
    }
    return false;
};

var isAppNumber = function(type) {
    type = parseInt(type);
    return (type === APP_FIXPOINT   || type === APP_UINT16    || type === APP_INT16     ||
            type === APP_FIXPOINT16 || type === APP_UINT32    || type === APP_INT32     || 
            type === APP_FIXPOINT64 || type === APP_UNFIXPT16 || type === APP_UNFIXPT32 ||
            type === APP_UNFIXPT48) ? true : false ;
};

var isMbusNumber = function(type) {
    type = parseInt(type);
    return (type === MODBUS_FIXPOINT   || type === MODBUS_UINT16    || type === MODBUS_INT16       ||
            type === MODBUS_FIXPOINT16 || type === MODBUS_UINT32    || type === MODBUS_INT32       || 
            type === MODBUS_SWITCH     || type === MODBUS_IEEE754   || type === MODBUS_FIXPOINT64  ||
            type === MODBUS_UNFIXPT48  || type === MODBUS_UNFIXPT32 || type === MODBUS_UNFIXPT16) ? true : false ;
};

var isNumber = function(type) {
    return (isAppNumber(type) || isMbusNumber(type) || type === MODBUS_IEEE754 || type === APP_IEEE754) ? true : false ;
};

var isMathEq = function(type) {
    return (isMbusNumber(type) || isCommAlarm(type)) ? true : false ;
};

var isDispaly = function(type) {
    if(type === MODBUS_INT16  || type === MODBUS_UINT16 || type === MODBUS_INT32 ||
       type === MODBUS_UINT32 || type === MODBUS_SWITCH) {
        return true;
    }
    return false;
};

var enCloudLogging = function(type) {
    return (isMbusNumber(type) || isCommAlarm(type)) ? true : false;  
};

module.exports.MODBUS_INT16      = MODBUS_INT16;
module.exports.MODBUS_UINT16     = MODBUS_UINT16;
module.exports.MODBUS_INT32      = MODBUS_INT32;
module.exports.MODBUS_UINT32     = MODBUS_UINT32;
module.exports.MODBUS_IEEE754    = MODBUS_IEEE754;
module.exports.MODBUS_FIXPOINT   = MODBUS_FIXPOINT;
module.exports.MODBUS_FIXPOINT16 = MODBUS_FIXPOINT16;
module.exports.MODBUS_BINARY     = MODBUS_BINARY;
module.exports.MODBUS_SWITCH     = MODBUS_SWITCH;
module.exports.MODBUS_FIXPOINT64 = MODBUS_FIXPOINT64;
module.exports.MODBUS_UNFIXPT16  = MODBUS_UNFIXPT16;
module.exports.MODBUS_UNFIXPT32  = MODBUS_UNFIXPT32;
module.exports.MODBUS_UNFIXPT48  = MODBUS_UNFIXPT48;
module.exports.ALARM_GCM         = ALARM_GCM;
module.exports.ALARM_EMAIL       = ALARM_EMAIL;
module.exports.ALARM_GE          = ALARM_GE;
module.exports.ALARM_CRITCAL     = ALARM_CRITCAL;
module.exports.M2M_IOSW          = M2M_IOSW;
module.exports.M2M_IOSW32        = M2M_IOSW32;
module.exports.M2M_IOSW48        = M2M_IOSW48;
module.exports.M2M_IOSW64        = M2M_IOSW64;
module.exports.APP_INT16         = APP_INT16;
module.exports.APP_UINT16        = APP_UINT16;
module.exports.APP_INT32         = APP_INT32;
module.exports.APP_UINT32        = APP_UINT32;
module.exports.APP_IEEE754       = APP_IEEE754;
module.exports.APP_FIXPOINT      = APP_FIXPOINT;
module.exports.APP_FIXPOINT16    = APP_FIXPOINT16;
module.exports.APP_BINARY        = APP_BINARY;
module.exports.APP_BTN           = APP_BTN;
module.exports.APP_SWITCH        = APP_SWITCH;
module.exports.APP_FIXPOINT64    = APP_FIXPOINT64;
module.exports.APP_UNFIXPT16     = APP_UNFIXPT16;
module.exports.APP_UNFIXPT32     = APP_UNFIXPT32;
module.exports.APP_UNFIXPT48     = APP_UNFIXPT48;

module.exports.isIOSW = isIOSW;
module.exports.is32bit = is32bit;
module.exports.is16bit = is16bit;
module.exports.is48bit = is48bit;
module.exports.is64bit = is64bit;
module.exports.isSigned = isSigned;
module.exports.isUnsigned = isUnsigned;
module.exports.isCommAlarm = isCommAlarm;
module.exports.isModbusWRable = isModbusWRable;
module.exports.isAppWRable = isAppWRable;
module.exports.isIEEE754 = isIEEE754;
module.exports.isFixPoint = isFixPoint;
module.exports.isBinary = isBinary;
module.exports.isNumber = isNumber;
module.exports.isAppNumber = isAppNumber;
module.exports.isMbusNumber = isMbusNumber;
module.exports.isEventData = isEventData;
module.exports.isDispaly = isDispaly;
module.exports.isMathEq = isMathEq;
module.exports.enCloudLogging = enCloudLogging;

