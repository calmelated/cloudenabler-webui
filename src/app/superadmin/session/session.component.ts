import { Component, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ApiService, GlobalService } from 'app/service';

@Component({
  selector: 'session',
  styleUrls: [ 'session.component.css' ],
  templateUrl: 'session.component.html'
})
export class Session {
  header: {[key: string]: any} = {collspse: false, title: 'sessions'};
  sessionList: any[];
  deleteId: string;

  constructor(
    private api: ApiService,
    private global: GlobalService,
    private router: Router
  ) {
    this.getSession();
  }

  //取得Session列表
  getSession() {
    this.api.get("/api/session").then((data: any[]) => {
      if(data['resCode'] === 200) { 
        this.sessionList = data;
        this.sessionList.forEach((session: any) => {
          session.time = new Date(session.expires * 1000).toLocaleString();
        });
      }
    });
  }

  //移除公司
  @ViewChild('ModalRemove')
  ModalRemove: ModalComponent;

  openModalRemove(session) {
    this.deleteId = session;
    this.ModalRemove.open();
  }

  //sessionId 為空白時刪除全部
  removeSession() {
    let sessionId: string = (this.deleteId !== 'all') ? this.deleteId : '';
    this.ModalRemove.close();
    this.header['errorMessage'] = '';    
    this.api.delete('/api/session/' + sessionId).then((data: {[key: string]: any}) => {
      if(data['resCode'] !== 200) { 
        this.global.showErrMsg(this.header, 'err_save');
      } else {
        if(this.deleteId === 'all') {
          this.router.navigate(['/login']);
        } else {
          this.getSession();
        } 
      }
    });
  }

}