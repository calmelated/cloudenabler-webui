import { Component, ViewChild  } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { LocalStorageService } from 'app/service';
import { ApiService, md5 } from 'app/service';
const utils = require('app/share/utils.ts');

@Component({
  selector: 'login',
  styleUrls: [ './login.component.css' ],
  templateUrl: './login.component.html'
})
export class Login {
  doneChkStatus: boolean = false;
  openModalDialog: any; 
  errorMessage: string = '';
  userLang: string;
  path: string;
  showCompanyId: string;

  //登入變數
  login: any = {
    company:  {val: "", valid: {type: 'required'}, err: null},
    account:  {val: "", valid: {type: 'required'}, err: null},
    password: {val: "", valid: {type: 'required'}, err: null},
    companyId:{val: "", err: null},
    dbIndex:  {val:  0, err: null},
  };

  //註冊變數
  register: any = {
    company:  {val: "", valid: {type: 'required'}, err: null},
    account:  {val: "", valid: {type: 'email'}, err: null},
    password: {val: "", valid: {type: 'password', strlen: [6, 32]}, err: null},
    confirm:  {val: "", err: null},
  };

  //重設密碼變數
  reset: any = {
    company:  {val: "", valid: {type: 'required'}, err: null},
    account:  {val: "", valid: {type: 'email'   }, err: null},
  };
  
  //帳號啟用變數
  activate: any = {
    password: {val: "", valid: {type: 'password', strlen: [6, 32]}, err: null},
    confirm:  {val: "", err: null},    
  };

  //Trial Login
  trial: any = {
    company:  {val: "", valid: {type: 'required'}, err: null},
  };

  constructor(
    public api: ApiService,
    public router: Router,
    public localStor: LocalStorageService,
    public translate: TranslateService,
    public location: LocationStrategy,
  ) {
    this.checkLogin();
    this.userLang = localStor.get("userLang");
    this.setStorageData();

    this.path = this.location.path();
    if(this.path.match(/login\/superadmin/i)) {
      this.showCompanyId = "1";
    }
  }

  //確認登入狀態
  checkLogin() {
    this.api.get('/api/login/status').then((data) => {
      if(data['desc'] === 'OK') {
        this.router.navigate(['/devices']);
      } else {
        this.doneChkStatus = true;
      }
    });
  }

  signIn() {
    if(utils.formValid(this.login)) {
      return;
    }    
    let company = this.login['company'].val;
    let account = this.login['account'].val    
    this.localStor.put("userCompany", company);
    this.localStor.put("userAccount", account);        
    return this.onSignIn(company, account, md5(this.login['password'].val + account));
  }

  onSignIn(company, account, password) { 
    let postData: any = {company, account, password, force: 'on'};
    
    // langeuage
    let lang = this.localStor.get("userLang");
    postData['lang'] = lang ? lang : 'en_US';
    
    // superadmin
    if(this.path.match(/login\/superadmin/i)) {
      if(utils.has(this.login['companyId'].val)) {
        postData['companyId'] = this.login['companyId'].val;
      }
      if(utils.has(this.login['dbsIdx'].val)) {
        postData['dbsIdx'] = this.login['dbsIdx'].val;
      }
    }

    //清除錯誤訊息
    this.errorMessage = '';
    this.api.post(postData, '/api/login').then((data) => {
      if(data['desc'].match(/account activaction/i)) {
        return this.openActivate();
      } else if(data['desc'].match(/already login/i)) {
        return this.router.navigate(['/devices']);
      } else if(data['desc'] !== 'OK'){
        return this.showMsg('err_user_sign_in');
      }
      this.localStor.put("userCompanyId", data['companyId']);
      this.localStor.put("userName"     , account);
      this.localStor.put("userTrial"    , '0');      
      this.localStor.put("subCompId"    , '0'); 
      this.localStor.delete("subCompName"); 
      if(data['admin']) {
          this.localStor.put("userAdmin", data['admin']);
      } else {
          this.localStor.put("userAdmin", 0);
      }
      if(data['parentId']) {
          this.localStor.put("parentId", data['parentId']);
      } else {
          this.localStor.put("parentId", 0);
      }
      this.api.get('/api/user/' + account).then((data) => {
        if(data['resCode'] !== 200) {
          return this.showMsg('err_user_sign_in');
        } 
        this.localStor.put("userAdmin", data['user'].admin);
        this.localStor.put("userName",  (data['user'].name  ? data['user'].name  : data['user'].account));
        this.localStor.put("userTrial", (data['user'].trial ? '1' : '0'));
        
        //設定多國語系版本
        if(data['user'].lang) {
          this.localStor.put("userLang", data['user'].lang);
        }
        this.translate.use(this.localStor.get("userLang"));

        //Show device list
        this.router.navigate(['/devices']);
      });
    });
  }

  //使用者登入過時自動帶入公司名稱和帳號
  setStorageData() {
    this.login['company'].val = this.localStor.get("userCompany");
    this.login['account'].val = this.localStor.get("userAccount");
  }

  /*
    註冊功能
  */
  @ViewChild('modalRegist')
  modalRegist: ModalComponent;

  openSignUp() {
    //清除欄位錯誤訊息
    utils.formReset(this.register);
    this.modalRegist.open();
  }

  //送出註冊資訊
  signUpCompany() {
    let invalidForm = utils.formValid(this.register);
    if(this.register['confirm'].val !== this.register['password'].val) {
      this.register['confirm'].err = 'errorConfirmPassword';
      invalidForm = true;
    }
    if(invalidForm) {
      return;
    }
    let formData: any = new FormData();
    formData.append('company', this.register['company'].val);
    formData.append('account', this.register['account'].val);
    formData.append("password", this.register['password'].val);
    this.modalRegist.close();
    this.errorMessage = '';  //清除錯誤訊息
    this.api.post(formData, '/api/company/add','form').then((data) => {
      if(data['resCode'] === 200) {
        this.localStor.put("userCompany", this.register['company'].val);
        this.localStor.put("userAccount", this.register['account'].val);
        this.setStorageData();
        this.showMsg('success_sign_up');
      } else if(data['resCode'] === 400) {
        this.openModalDialog = {action: 'open', str: 'invalid_val'};
      } else if(data['desc'].match(/company already exists/i)) {
        this.openModalDialog = {action: 'open', str: 'err_dup_sign_up'};
      } else {
        this.openModalDialog = {action: 'open', str: 'err_auth_sign_up'};
      }
    });
  }

  /*
    顯示錯誤訊息
  */
  showMsg(key: string) {
    this.translate.get(key).subscribe((message: string) => {
      this.errorMessage = message;
    });
  }

  /*
    重設密碼功能
  */
  @ViewChild('modalResetPassword')
  modalResetPassword: ModalComponent;

  //POPUP開啟視窗
  openForgetPassword() {
    utils.formReset(this.reset);
    this.reset['company'].val = this.login['company'].val;
    this.reset['account'].val = this.login['account'].val;
    this.modalResetPassword.open();
  }

  //傳送密碼
  sendPassword() {
    if(utils.formValid(this.reset)){
      return;
    }
    let postData: any = {
      company : this.reset['company'].val,
      account : this.reset['account'].val,
    };
    this.modalResetPassword.close();
    this.errorMessage = ''; //清除錯誤訊息
    this.api.post(postData, '/api/password/reset').then((data) => {
      if(data['resCode'] === 200) {
        this.openModalDialog = {action: 'open', str: 'success_reset_password'};
      } else if(data['resCode'] === 401) {
        this.openModalDialog = {action: 'open', str: 'err_msg_reset_pass_disallow'};
      } else {
        this.openModalDialog = {action: 'open', str: 'err_msg_no_admin'};
      }  
    })
  }

 /*
    重設密碼功能
  */
  @ViewChild('modalTrialLogin')
  modalTrialLogin: ModalComponent;

  openTrialLogin() {
    utils.formReset(this.trial);
    this.trial['company'].val = this.login['company'].val;
    this.modalTrialLogin.open();
  }

  trialLogin() {
    if(utils.formValid(this.trial)){
      return;
    }
    let company = this.trial['company'].val;
    this.modalTrialLogin.close();
    this.errorMessage = ''; //清除錯誤訊息
    this.api.get("/api/trials/" + company).then((data) => {
      if(data['resCode'] === 200) {
        this.localStor.put('userCompany', company);
        this.localStor.put('userAccount', data['account']);
        this.onSignIn(company, data['account'], data['password']);
      } else if(data['resCode'] === 404) {
        if(data['desc'].match(/No any record/i)) {
          this.openModalDialog = {action: 'open', str: 'err_noany_trials'};
        } else if(data['desc'].match(/No such company/i)) {
          this.openModalDialog = {action: 'open', str: 'err_msg_no_such_company'};
        } else if(data['desc'].match(/No available accounts/i)) {
          this.openModalDialog = {action: 'open', str: 'err_nomore_trials'};
        } else {
          this.openModalDialog = {action: 'open', str: 'err_get_data'};
        }
      } else {
        this.openModalDialog = {action: 'open', str: 'err_get_data'};
      } 
    })
  }  

  /*
    啟用帳戶功能(如果登入時帳號尚未啟動)
  */
  @ViewChild('modalActive')
  modalActive: ModalComponent;

  openActivate() {
    utils.formReset(this.activate);
    this.modalActive.open();
  }

  //啟用帳號
  sendActivate() {
    let invalidForm = utils.formValid(this.activate);
    if(this.activate['confirm'].val !== this.activate['password'].val) {
      this.activate['confirm'].err = 'errorConfirmPassword';
      invalidForm = true;
    }
    if(invalidForm) {
      return;
    }

    let postData: any = {
      account : this.login['account'].val,
      origPswd: md5(this.login['password'].val + this.login['account'].val),
      newPswd : this.activate['password'].val
    }
    this.errorMessage = '';
    this.modalActive.close();
    this.api.post(postData, '/api/user/activate').then((data) => {
      if(data['resCode'] === 200) {
        this.openModalDialog = {action: 'open', str: 'new_pswd_login'};
      } else {
        this.api.post(postData, '/api/logout').then((data) => {
          this.openModalDialog = {action: 'open', str: 'err_save'};
        });
      }
    });
  }

  //開啟雲端狀態頁面
  openCloud() {
    window.open('/assets/status.html','_blank');
  }

}