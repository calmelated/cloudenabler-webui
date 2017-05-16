import { Component, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ApiService, GlobalService, LocalStorageService } from 'app/service';
const utils = require('app/share/utils.ts');

@Component({
  selector: 'company',
  styleUrls: [ 'company.component.css' ],
  templateUrl: 'company.component.html'
})
export class Company {
  header: {[key: string]: any} = {collspse : false, title: 'company'};
  company: {[key: string]: any};
  userAdmin: string;
  userCompanyId: string;
  curKey: string;
  curInput: string;
  errInput: string = null;
  errRange: string = null;
  contacts: {[key: string]: any} = {
    ct_company: {val: '', valid: {strlen: [0, 32]}, str: 'company'},
    ct_name:    {val: '', valid: {strlen: [0, 32]}, str: 'contact_person'},
    ct_phone:   {val: '', valid: {strlen: [0, 32]}, str: 'contact_phone'},
    ct_email:   {val: '', valid: {strlen: [0, 32]}, str: 'contact_email'},
  };

  constructor(
    private api: ApiService,
    private localStor: LocalStorageService,
    private router: Router,
    private global: GlobalService
  ) {
    let subCompId = this.localStor.get('subCompId');
    this.userCompanyId = (subCompId === '0') ? this.localStor.get("userCompanyId") : subCompId;
    this.userAdmin = this.localStor.get("userAdmin");
    this.getCompany();
  }

  //取得公司資訊
  getCompany() {
    this.api.get("/api/company/id/" + this.userCompanyId).then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.company = data['company'];
        if(data['company'].extra) {
          this.contacts['ct_company'].val = data['company'].extra['ct_company'];
          this.contacts['ct_name'].val    = data['company'].extra['ct_name'];
          this.contacts['ct_phone'].val   = data['company'].extra['ct_phone'];
          this.contacts['ct_email'].val   = data['company'].extra['ct_email'];
        }
      }
    });
  }

  //Edit 
  @ViewChild('modalEdit')
  modalEdit: ModalComponent;

  openModalEdit(key) {
    this.curKey = key;
    this.errInput = null;
    this.errRange = null;
    this.curInput = this.contacts[this.curKey].val;
    this.modalEdit.open();
  }

  //編輯公司聯絡人 只有YATEC需要
  saveContact() {
    let contact = this.contacts[this.curKey];
    if(contact.val === this.curInput) {
      return this.modalEdit.close(); 
    } else if(contact.valid) {
      let err = utils.validInput(contact.valid, this.curInput);
      if(err) {
        this.errInput = err.str;
        this.errRange = err.range;
        return;
      }
    }
    this.contacts[this.curKey].val = this.curInput;
    let formData: any = new FormData();
    formData.append("companyId" , this.company['id']);
    formData.append("ct_company", this.contacts['ct_company'].val);
    formData.append("ct_name"   , this.contacts['ct_name'].val);
    formData.append("ct_phone"  , this.contacts['ct_phone'].val);
    formData.append("ct_email"  , this.contacts['ct_email'].val);

    this.modalEdit.close();
    this.header['errorMessage'] = '';
    this.api.put(formData ,"/api/company/edit/", 'form').then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.getCompany();
      } else {
        this.global.showErrMsg(this.header, 'err_save');
      }
    });
  }

  /* 移除公司 */
  @ViewChild('modalRemove')
  modalRemove: ModalComponent;

  openModalRemove() {
    this.modalRemove.open();
  }

  removeCompany() {
    this.header['errorMessage'] = '';    
    this.api.delete('/api/company/id/' + this.company['id']).then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.api.get('/api/logout').then((data: any) => {
          this.router.navigate(['/login']);
        });        
      } else {        
        this.global.showErrMsg(this.header, 'err_save');
      }
    });
  }
}