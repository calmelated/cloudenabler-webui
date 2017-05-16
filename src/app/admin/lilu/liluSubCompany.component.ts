import { Component, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Router } from '@angular/router';
import { ApiService } from 'app/service';
import { GlobalService } from 'app/service';
import { LocalStorageService } from 'app/service';
const utils = require('app/share/utils.ts');
const IMG_DIR = '/assets/img/';

@Component({
  selector: 'liluSubCompany',
  styleUrls: [ 'liluSubCompany.component.css' ],
  templateUrl: 'liluSubCompany.component.html'
})
export class LiluSubCompany {
  header: {[key: string]: any} = {collspse: false, title: 'subsidiary', subCompany: true};
  openModalDialog: any;
  companies: {[key: string]: any};
  userAdmin: number;
  curIdx: string;
  curCompany: string;
  cmpIcon: string;
  unread: {[key: string]: any} = {};

  constructor(
    private api: ApiService,
    private localStor: LocalStorageService,
    private router: Router,
    private global: GlobalService
  ) {
    if(this.localStor.get("subCompId") !== '0' || 
       this.localStor.get("parentId")  !== '0') {
      window.history.back(); //In SubCompany
      return;
    }
    this.cmpIcon = IMG_DIR + 'ic_company.png';
    this.userAdmin = parseInt(this.localStor.get("userAdmin"));
    this.getCompany();
  }

  onSubCompany(data) {
    if(data.type === 'new') {
      utils.formReset(this.subCompany);
      this.modalAddSubCompany.open();
    }
  }

  onDialogClose(cbFunc) {
    eval(cbFunc);
  }

  /*
    取得子公司資訊
    GET /api/lilu -> 從總公司取得二層公司的列表（北，中，南）
    GET /api/lilu/unread -> 取得各個分公司，未讀的告警數量 (目前時間 - 上次檢查時間)
    PUT /api/lilu/unread/[:time] -> 更新檢查時間
  */
  getCompany() {
    this.api.get("/api/lilu").then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.companies = data['companies'];
      }      
    });

    this.api.get("/api/lilu/unread").then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        data['unread'].forEach((data, index) => {
          this.unread[data['id']] = data['num'];
        });
      }
    });
  }

  /*
    新增子公司
  */
  @ViewChild('modalAddSubCompany')
  modalAddSubCompany: ModalComponent;

  subCompany: any = {
    company:  {val: "", valid: {type: 'required'}, err: null},
    account:  {val: "", valid: {type: 'email'}, err: null},
    password: {val: "", valid: {type: 'password', strlen: [6, 32]}, err: null},
    confirm:  {val: "", err: null},
  };  

  saveSubCompany() {
    let invalidForm = utils.formValid(this.subCompany);
    if(this.subCompany['confirm'].val !== this.subCompany['password'].val) {
      this.subCompany['confirm'].err = 'errorConfirmPassword';
      invalidForm = true;
    }
    if(invalidForm) {
      return;
    }    
    let companyId: string = this.localStor.get("userCompanyId");
    let formData: any = new FormData();
    formData.append('company', this.subCompany['company'].val);
    formData.append('account', this.subCompany['account'].val);
    formData.append("password", this.subCompany['password'].val);
    formData.append("parentId", companyId);

    this.header['errorMessage'] = ''; 
    this.modalAddSubCompany.close();
    this.api.post(formData, '/api/company/add','form').then((data) => {
      if(data['resCode'] === 200) {
        this.getCompany();
      } else if(data['resCode'] === 400) {
        this.openModalDialog = {action: 'open', str: 'err_msg_invalid_str', cbFunc: 'this.modalAddSubCompany.open();'};
      } else if(data['desc'].match(/company already exists/i)) {
        this.openModalDialog = {action: 'open', str: 'err_dup_sign_up', cbFunc: 'this.modalAddSubCompany.open();'};
      } else {
        this.global.showErrMsg(this.header, 'err_auth_sign_up');
      }
    });
  }

  /* 登入子公司 */
  @ViewChild('modalSubCompLogin')
  modalSubCompLogin: ModalComponent;

  openModalLogin(idx) {
    this.curIdx = idx;
    this.curCompany = this.companies[idx].company;
    this.modalSubCompLogin.open();
  }

  loginSubCompany() {
    let subCompId = this.companies[this.curIdx].id;
    let subCompName = this.companies[this.curIdx].company;
    this.header['errorMessage'] = ''; 
    this.modalSubCompLogin.close();
    this.api.put({}, "/api/company/login/" + subCompId).then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.localStor.put('subCompId', subCompId);
        this.localStor.put('subCompName', subCompName);
        this.router.navigate(['/devices']);
      } else {
        this.global.showErrMsg(this.header, 'err_save');
      }
    });
  }

  /* 移除子公司 */
  @ViewChild('modalRemove')
  modalRemove: ModalComponent;

  openModalRemove(idx) {
    this.curIdx = idx;    
    this.curCompany = this.companies[idx].company;
    this.modalRemove.open();
  }

  removeCompany() {    
    let subCompId = this.companies[this.curIdx].id;    
    this.header['errorMessage'] = ''; 
    this.modalRemove.close();
    this.api.delete('/api/company/id/' + subCompId).then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.getCompany();
      } else {
        this.global.showErrMsg(this.header, 'err_save');      
      }
    });
  }

}