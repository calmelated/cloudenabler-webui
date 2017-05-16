import { Component, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ApiService, GlobalService, LocalStorageService } from 'app/service';

@Component({
  selector: 'companys',
  styleUrls: [ 'companys.component.css' ],
  templateUrl: 'companys.component.html'
})
export class Companys {
  header: {[key: string]: any} = {collspse: false, title: 'company'};
  companyList: {[key: string]: any};
  userCompany: string;
  userName: string;
  curCompId: string;
  curCompany: string;

  constructor(
    private api: ApiService,
    private localStor: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private global: GlobalService
  ) {
    this.userCompany = this.localStor.get("userCompany");
    this.userName = this.localStor.get("userName");
    this.getCompany();
  }

  //取得公司列表
  getCompany() {
    this.api.get("/api/company/").then((data: {[key: string]: any}) => {
      if(data['desc'] === 'OK') {
        this.companyList = data['companies'];
      }
    });
  }

  /* SuperAdmin -> Any company */
  @ViewChild('ModalCompanyLogin')
  ModalCompanyLogin: ModalComponent;

  openModalCompanyLogin(company, id) {
    this.curCompId = id;
    this.curCompany = company;
    this.ModalCompanyLogin.open();
  }

  loginCompany() {
    this.header['errorMessage'] = '';
    this.api.put({}, "/api/company/login/" + this.curCompId).then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.localStor.put('subCompId', this.curCompId);
        this.localStor.put('subCompName', this.curCompany);        
        this.router.navigate(['/devices']);
      } else {
        this.global.showErrMsg(this.header, 'err_save');
      }
    });
  }

  /* 移除公司 */
  @ViewChild('ModalRemove')
  ModalRemove: ModalComponent;

  openModalRemove(company, id) {
    this.curCompId = id;
    this.curCompany = company;
    this.ModalRemove.open();
  }

  removeCompany() {
    this.header['errorMessage'] = '';    
    this.ModalRemove.close();
    this.api.delete('/api/company/id/' + this.curCompId).then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
          this.getCompany();
      } else {
        this.global.showErrMsg(this.header, 'err_save');
      }
    });
  }

}