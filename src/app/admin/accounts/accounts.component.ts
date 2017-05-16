import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'app/service';
import { GlobalService } from 'app/service';
import { LocalStorageService } from 'app/service';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
const utils = require('app/share/utils.ts');

@Component({
  selector: 'accounts',
  styleUrls: [ 'accounts.component.css' ],
  templateUrl: 'accounts.component.html'
})
export class Accounts {
  header: {[key: string]: any} = {title: 'accounts', collspse: false, account: true };
  openModalDialog: any;
  selUser: any;
  userTotal: number;
  users: [any];  
  userAdmin: string; //0: 一般user 1: Admin, 2: KSMT 
  userName: string;
  userCompany: string;
  userAccount: string;
  userType: string; 
  userTypes: [string]; // [trial_user, admin, user]

  user: {[key: string]: any} = {
    account:  {val: ''   , valid: {type: 'email'}   , err: null},
    name:     {val: ''   , valid: {type: 'required'}, err: null},
    password: {val: ''   , valid: {type: 'password'}, err: null},
    confirm:  {val: ''   , err: null},
    admin:    {val: '0'  , err: null},
    activate: {val: '0'  , err: null},
    trial:    {val: '0'  , err: null},
  };

  alarm: {[key: string]: any} = {
    message: {val: '', valid: {type: 'required'}, err: null},
  };  

  constructor(
    private api: ApiService,
    private global: GlobalService,
    private localStor: LocalStorageService,
    private router: Router
  ) {
    this.userCompany = this.localStor.get('userCompnay');
    this.userAdmin = this.localStor.get('userAdmin');
    this.userName = this.localStor.get('userName');    
    this.userAccount = this.localStor.get('userAccount');    
    this.getUserList();
  }

  onAccount(data) {
    if(data.type === 'new') {
      this.openModalAddUser();
    }
  }

  onDialogClose(cbFunc) {
    // console.log('cbFunc=' + cbFunc);
    eval(cbFunc);
  }  

  //取得使用者資訊
  getUserList() {
    this.api.get('/api/user').then((data: {[key: string]: any}) => {
      if(data['desc'] !== 'OK') {
        return;
      }
      this.userTotal = data['total'];
      this.users = data['users'];
      for(let i = 0; i < this.users.length; i++) {
        let user: any = this.users[i];
        for(let prop of ['enEdit','enName','enActivate','enPermission','enApply','enPswd','enAdmin','enSndAlarm','enRemove']) {
            user[prop] = false;
        }
        if(this.userAdmin === '2' ||   // current is superadmin
          (this.userAdmin === '1' && this.userCompany === 'KSMT Microtech')) {
          if((user.admin === 1 || user.admin === 2) && user.name === 'Admin') { // Admin
            user.icon = 'ic_admin_user.png';
            user.enEdit = true;
            user.enPswd = true;
            user.enSndAlarm = true;
          } else if(user.admin === 1) { // admin
            user.icon = 'ic_admin_user.png';
            user.enEdit = true;
            user.enName = true;
            user.enPswd = true;
            user.enAdmin = true;
            user.enSndAlarm = true;
            user.enRemove = true;              
          } else if(user.trial === 1){ // trial user
            user.icon = 'ic_trial_user.png';
            user.enEdit = true;
            user.enName = true;
            user.enPermission = true;
            user.enApply = true;
            user.enPswd = true;
            user.enRemove = true;            
          } else { //user
            user.icon = 'ic_user.png';
            user.enEdit = true;
            user.enName = true;
            user.enActivate = true;
            user.enPermission = true;
            user.enApply = true;
            user.enPswd = true;
            user.enAdmin = true;
            user.enSndAlarm = true;
            user.enRemove = true;
          }          
        } else if(this.userAdmin === '1') {  //current is small admin
          if((user.admin === 1 || user.admin === 2) && user.name === 'Admin') { // Admin
            user.icon = 'ic_admin_user.png';
            if(this.userName === 'Admin') { // I'm also Admin
              user.enEdit = true;
              user.enPswd = true;
            } else { // this user is smller admin
              user.enEdit = false;
            }
          } else if(user.admin === 1) { // admin
            user.icon = 'ic_admin_user.png';
            if(this.userName === 'Admin' ||  // Admin or myself 
              user.name === this.userName) {
              user.enEdit = true;
              user.enPswd = true;
              user.enName = true;
            } else {
              user.enEdit = false;
              user.enPswd = false;              
            }
          } else if(user.trial === 1){ // trial user
            user.icon = 'ic_trial_user.png';
            user.enEdit = true;
            user.enName = true;
            user.enPermission = true;
            user.enApply = true;
            user.enPswd = true;
            user.enRemove = true;            
          } else { //user
            user.icon = 'ic_user.png';
            user.enEdit = true;
            user.enName = true;
            user.enActivate = true;
            user.enPermission = true;
            user.enApply = true;
            user.enPswd = true;
            user.enAdmin = true;
            user.enRemove = true;
          } 
        } else { // should not happen
          this.users = null;
          this.userTotal = 0;
        }
      }
    });
  }
  
  /*
    編輯帳號資訊
  */
  @ViewChild('modalEditName')
  modalEditName: ModalComponent;

  openModalEditName(user:any) {
    utils.formReset(this.user);
    this.selUser = user;        
    this.user['name'].val = user['name'];
    this.modalEditName.open();
  }

  sendEditName() {
    let userConf = this.user['name'];
    if(userConf.val === this.selUser.name) {
      return this.modalEditName.close(); // no changes
    } else if(userConf.valid) {
      let err = utils.validInput(userConf.valid, userConf.val);
      if(err) {
        userConf.err = err.str;
        return;
      }
    } 
    if(userConf.val && userConf.val.match(/admin/i)) {
      userConf.err = 'err_msg_name_reserved';
      return;
    }
    let newName = userConf.val;
    let formData: any = new FormData();
    formData.append('account', this.selUser.account);
    formData.append('name', newName);
    this.modalEditName.close();
    this.header['errorMessage'] = '';
    this.api.put(formData,'/api/user/edit', 'form').then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        if(this.selUser['account'] === this.userAccount) { //當管理員編輯自己名稱時候要變更localStor
          this.userName = newName;
          this.localStor.put("userName", newName);
        } 
      } else { // reload name list again
        this.global.showErrMsg(this.header, 'err_save');
      }
      this.getUserList();
    });
  }

  /*
    Edit Password
  */
  @ViewChild('modalEditPswd')
  modalEditPswd: ModalComponent;

  openModalEditPswd(user:any) {
    utils.formReset(this.user);
    this.selUser = user;        
    this.modalEditPswd.open();
  }

  sendEditPswd() {
    let pswdConf = this.user['password'];
    let confirmConf = this.user['confirm'];
    if(pswdConf.valid) {
      let err = utils.validInput(pswdConf.valid, pswdConf.val);
      if(err) {
        pswdConf.err = err.str;
        return;
      }
    } 
    if(pswdConf.val !== confirmConf.val) {
      confirmConf.err = 'err_msg_pwd_mismatch';
      return;
    }
    let formData: any = new FormData();
    formData.append('account', this.selUser['account']);
    formData.append('password', pswdConf.val);
    this.modalEditPswd.close();
    this.header['errorMessage'] = '';
    this.api.put(formData,'/api/user/edit', 'form').then((data: {[key: string]: any}) => {
      if(data['resCode'] !== 200) {
        this.global.showErrMsg(this.header, 'err_save');
        return; // no need to reload
      }
      this.getUserList();
    });
  }

  /*
    編輯 管理者 與 啟用 功能
  */ 
  sendEdit(user: any, type: string) {
    this.selUser = user;        
    let formData: any = new FormData();
    formData.append('account', this.selUser['account']);
    formData.append('name', this.selUser['name']);
    formData.append(type, (this.selUser[type]) ? 0 : 1);
    
    this.header['errorMessage'] = '';
    this.api.put(formData,'/api/user/edit', 'form').then((data: {[key: string]: any}) => {
      if(data['resCode'] !== 200) { // reload list if failed
        this.global.showErrMsg(this.header, 'err_save');
      }
      this.getUserList();
    });
  }

  /*
    刪除帳號 提示視窗
  */
  @ViewChild('modalRemove')
  modalRemove: ModalComponent;

  openModalRemove(user: any) {
    this.selUser = user;        
    this.modalRemove.open();
  }

  /*
    移除使用者帳號
  */
  removeUser() {
    this.modalRemove.close();
    this.header['errorMessage'] = '';
    this.api.delete('/api/user/' + this.selUser['account']).then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.getUserList();
      } else {
        this.global.showErrMsg(this.header, 'err_save');
      }
    });
  }

  /*
    傳送告警訊息給User KSMT管理者功能
  */
  @ViewChild('modalSendAlarm')
  modalSendAlarm: ModalComponent;

  openModalAlarm(user: any) {
    this.selUser = user;    
    utils.formReset(this.alarm);
    this.modalSendAlarm.open();
  }

  sendAlarm() {
    let almConf = this.alarm['message'];
    if(almConf.valid) {
      let err = utils.validInput(almConf.valid, almConf.val);
      if(err) {
        almConf.err = err.str;
        return;
      }
    }
    let data: {[key: string]: string} = {
      account: this.selUser['account'],
      message: almConf.val,
    };
    this.modalSendAlarm.close();
    this.header['errorMessage'] = '';
    this.api.post(data, '/api/gcm/send').then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) { //success
      } else if(data['resCode'] === 404) {
        this.global.showErrMsg(this.header, 'been_signout');
      } else {
        this.global.showErrMsg(this.header, 'err_save');
      }
    });
  }

  /*
    套用權限
  */
  @ViewChild('modalApplyPermission')
  modalApplyPermission: ModalComponent;
  normalUsers: any[] = []; //一般使用者

  openModalApply(user: any) {
    this.selUser = user;    
    this.normalUsers = [];
    this.users.forEach((data: any) => {
      if(data['admin'] === 0 && this.selUser['account'] !== data['account']) {
        this.normalUsers.push({
          name: data['name'], 
          account: data['account']
        });
      }
    });
    this.modalApplyPermission.open();
  }

  applyPermission(user: any) {
    let fromAccount = user.account;
    this.header['errorMessage'] = '';
    this.modalApplyPermission.close();
    this.api.get('/api/user/auth/' + fromAccount).then((data: {[key: string]: any}) => {
      if(data['resCode'] !== 200 || !data['devices']) {
        this.global.showErrMsg(this.header, 'err_save');
        return;
      }      
      let putData: any = {
        account: this.selUser['account'],
        devices: data['devices'],
      };
      this.api.put(putData,'/api/user/auth').then((data: {[key: string]: any}) => {
        if(data['resCode'] !== 200) {
          this.global.showErrMsg(this.header, 'err_save');
        }
      });        
    });
  }

  /*
    帳戶 新增使用者功能
  */
  @ViewChild('modalAddUser')
  modalAddUser: ModalComponent;

  openModalAddUser() {
    if(this.userTotal < 50) {
      utils.formReset(this.user);
      if((this.userName === 'Admin' && this.userAdmin === '1') || this.userAdmin === '2') {
        this.userTypes = ['trial_account', 'user', 'admin'];
        this.userType = this.userTypes[0];
      } else {
        this.userTypes = ['trial_account', 'user'];
        this.userType = this.userTypes[0];
      }
      this.modalAddUser.open();
    } else{
      this.openModalDialog = {action: 'open', str: 'user_max_account'};
    }
  }

  addUser() {
    if(utils.formValid(this.user)) {
      return;
    } else if(this.user['confirm'].val !== this.user['password'].val) {
      return this.user['confirm'].err = 'errorConfirmPassword';
    } else if(this.user['name'].val && this.user['name'].val.match(/admin/i)) {
      return this.user['name'].err = 'err_msg_name_reserved';
    }

    if(this.userType === 'trial_account') {
      this.user['trial'].val = '1';
      this.user['activate'].val = '1'; 
      this.user['admin'].val = '0';
    } else if(this.userType === 'user') {
      this.user['trial'].val = '0';
      this.user['activate'].val = '0'; 
      this.user['admin'].val = '0';      
    } else if(this.userType === 'admin') {
      this.user['trial'].val = '0';
      this.user['activate'].val = '0'; 
      this.user['admin'].val = '1'; 
    }

    let formData: any = new FormData();
    formData.append('account', this.user['account'].val);
    formData.append('name', this.user['name'].val);
    formData.append('password', this.user['password'].val);
    formData.append('admin', this.user['admin'].val);
    formData.append('activate', this.user['activate'].val);
    formData.append('trial', this.user['trial'].val);
    formData.append('allowDown', true);
    formData.append('allowUp', true);
    
    this.header['errorMessage'] = '';
    this.modalAddUser.close();
    this.api.post(formData,'/api/user/add','form').then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.getUserList()
      } else if(data['desc'].match(/already exists/i)){
         this.openModalDialog = {action: 'open', str: 'err_msg_dup_user', cbFunc: 'this.modalAddUser.open();'};
      } else if(data['desc'].match(/Invalid/i)){
         this.openModalDialog = {action: 'open', str: 'err_msg_invalid_str', cbFunc: 'this.modalAddUser.open();'};
      } else if(data['desc'].match(/operation is not allowed/i)){
        this.global.showErrMsg(this.header, 'not_allow');
      } else if(data['desc'].match(/maximum number of/i)){
        this.global.showErrMsg(this.header, 'err_msg_max_account_exceeded');
      } else {
        this.global.showErrMsg(this.header, 'err_save');
      }
    });
  }
}