import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { ViewChild } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { LocalStorageService } from 'app/service';
import { GlobalService } from 'app/service';
import { ApiService } from 'app/service';

/*
collspse : 是否顯示左方選單 true:顯示 false:關閉
adminAct : 顯示管理者功能選單
path : 取得當前路徑
*/
@Component({
  selector: 'layout-header',
  templateUrl: './layout-header.component.html',
  styleUrls: ['./layout-header.component.css'],
})
export class LayoutHeaderComponent {
  @Input() header: {[key: string]: any};

  adminAct: boolean = false;
  superAct: boolean = false;
  userAdmin: string;
  path: string;
  userCompany: string;
  userAccount: string;
  userName: string;
  userLang: string;
  subCompId: string;
  parentId: string;
  customer: string;

  //左方 menu 內容 
  leftMenu: {[key:number]: {[ket:string]: string}} = [
    {path:'/devices', class:'fa fa-hdd-o', name:'device'},
    {path:'/group', class:'fa fa-group', name:'group'},
    {path:'/alarm', class:'fa fa-warning', name:'notification'},
    {path:'/iostlog', class:'fa fa-file-text-o', name:'iostlog'},
    {path:'/flink', class:'fa fa-file-text-o', name:'file_link'},
    {path:'/announcement', class:'glyphicon glyphicon-blackboard', name:'announcement'},
  ];

  //管理者功能選單
  adminMenu: {[key:number]: {[ket:string]: string}} = [
    {path:'/admin/accounts', class:'fa fa-user', name:'accounts', show: '1'},
    {path:'/admin/audit', class:'fa fa-file-text', name:'audit_log', show: '1'},
    {path:'/admin/company', class:'fa fa-file-text-o', name:'company_info', show: '1'},
    {path:'/admin/subcompany', class:'fa fa-file-text-o', name:'subsidiary', show: '0'},
    {path:'/admin/lilu/subcompany', class:'fa fa-file-text-o', name:'subsidiary', show: '0'},
  ];

  //超級管理者功能選單
  superAdminMenu: {[key:number]: {[ket:string]: string}} = [
    {path:'/superadmin/companys', class:'fa fa-circle-o', name:'company', show: '1'},
    {path:'/superadmin/csid', class:'fa  fa-circle-o', name:'csid', show: '1'},
    {path:'/superadmin/smtp', class:'fa fa-circle-o', name:'smtp_config', show: '1'},
    {path:'/superadmin/ftp', class:'fa fa-circle-o', name:'ftp_client', show: '1'},
    {path:'/superadmin/sessions', class:'fa fa-circle-o', name:'sessions', show: '1'},
  ];
 
  constructor(
    private Location: LocationStrategy,
    private api: ApiService, 
    private global: GlobalService,
    private localStor: LocalStorageService,
    private router: Router,
  ) {
    this.customer    = localStor.get("odm");
    this.subCompId   = localStor.get("subCompId");
    this.parentId    = localStor.get("parentId");
    this.userCompany = (this.subCompId === '0') ? localStor.get("userCompany") : localStor.get("subCompName");
    this.userAccount = localStor.get("userAccount");
    this.userAccount = decodeURIComponent(this.userAccount);
    this.userName    = localStor.get("userName");
    this.userAdmin   = localStor.get("userAdmin");
    this.userLang    = localStor.get("userLang");
    this.path        = decodeURIComponent(this.Location.path()).match(/(\/\w*)/ig).join('');
    this.adminAct    = (this.path.match(/\/admin\/.*/i)) ? true : false;
    this.superAct    = (this.path.match(/\/superadmin\/.*/i)) ? true : false;

    //Customize UI
    this.setCustomerUI();

    //每30s判別是否有權限
    this.checkLogin();
  }

  ngOnInit(){
  }

  chkLoginId: any;
  ngOnDestroy() {
    clearTimeout(this.chkLoginId);
  }

  /*
    取得客戶名稱 目前有 
    YATEC 多 IO操作，公司編輯多聯絡人資訊
    HYEC 多 IO操作，下載連結
  */
  setCustomerUI() {
    // if(this.customer === 'KSMT-Test-All') {
    // } else if(this.customer === 'KSMT-Log') {
    // } else if(this.customer === 'YATEC') {
    // } else if(this.customer === 'HYEC') {
    // } else { // KSMT, minimal
    // }

    if(this.subCompId === '0' && this.parentId === '0') {
      // In parent copmay
      this.adminMenu[3]['show'] = '1';
    } else { // In subcompany
      this.adminMenu[3]['show'] = '0';
    }
    
    //當 ODM=LILU 和權限為 superadmin 時使用LILU公司管理
    if(this.userCompany === "123" && this.userAdmin === "2") {
      this.adminMenu[3]['show'] = '0';
      this.adminMenu[4]['show'] = '1';
    }
  }

  //確認登入狀態
  checkLogin() {
    this.api.get('/api/login/status').then((data: {[key: string]: any}) => {
      if(data['desc'] !== 'OK') {
        let pathArray: string[] = this.Location.path().split('/');
        //判別如果已經在login 畫面就不用導畫面
        if(pathArray[1] !== 'login') {
          this.router.navigate(['/login']);
        }
      } else {
        this.chkLoginId = setTimeout(() => { this.checkLogin(); }, 30000);
      }
    });
  }

  //開啟左方選單功能
  toggle() {
    this.header['collspse'] = !this.header['collspse'];
  }

  //改變多國語系 en_US zh_TW
  changeLanguage(type: string) {
    let formData: any = new FormData();
    formData.append('account', this.userAccount);
    formData.append('lang', type);

    this.api.put(formData,'/api/user/lang', 'form').then((data: any) => {
      if(data['desc'] === 'OK') {
        this.localStor.put("userLang", type);
        this.global.setlang(type);
        window.location.reload();
      }
    });
  }

  //登出
  signOut() {
    this.api.get('/api/logout').then((data: any) => {
      this.localStor.delete('userName');
      this.localStor.delete('userAdmin');
      this.localStor.delete('userTrial');
      this.localStor.delete('userCompanyId');
      this.localStor.delete('subCompId');
      this.localStor.delete('parentId');
      this.localStor.delete('subCompName');
      this.router.navigate(['/login']);
    });
  }

  //Sign Out SubCompany
  logoutSubCompany() {
    this.api.put({}, "/api/company/logout").then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.localStor.put('subCompId', '0');
        this.localStor.delete('subCompName');
        this.router.navigate(['/']);
      } else {
        console.log('Failed to signout subcompany!');
        this.signOut();
      }
    });
  }    

  @Output() regList: EventEmitter<any> = new EventEmitter<any>();
  onRegList(type) { this.regList.emit({type}); }  

  @Output() devList: EventEmitter<any> = new EventEmitter<any>();
  onDevList(type) { this.devList.emit({type}); }

  @Output() slvdevList: EventEmitter<any> = new EventEmitter<any>();
  onSlvDevList(type) { this.slvdevList.emit({type}); }  

  @Output() evtlog: EventEmitter<any> = new EventEmitter<any>();
  onEvtLog(type) { this.evtlog.emit({type}); }

  @Output() alarmlog: EventEmitter<any> = new EventEmitter<any>();
  onAlarmLog(type) { this.alarmlog.emit({type}); }

  @Output() auditlog: EventEmitter<any> = new EventEmitter<any>();
  onAuditLog(type) { this.auditlog.emit({type}); }

  @Output() iostlog: EventEmitter<any> = new EventEmitter<any>();
  onIostLog(type) { this.iostlog.emit({type}); }

  @Output() flink: EventEmitter<any> = new EventEmitter<any>();
  onFlink(type) { this.flink.emit({type}); }

  @Output() account: EventEmitter<any> = new EventEmitter<any>();
  onAccount(type) { this.account.emit({type}); }

  @Output() subCompany: EventEmitter<any> = new EventEmitter<any>();
  onSubCompany(type) { this.subCompany.emit({type}); }  

  @Output() announcement: EventEmitter<any> = new EventEmitter<any>();
  onAnnouncement(type) { this.announcement.emit({type}); }

  @Output() group: EventEmitter<any> = new EventEmitter<any>();
  onGroup(type) { this.group.emit({type}); }
}
