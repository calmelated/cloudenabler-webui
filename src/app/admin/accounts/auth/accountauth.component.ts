import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Params } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'app/service';
import { ApiService } from 'app/service';

@Component({
  selector: 'accounts',
  styleUrls: [ 'accountauth.component.css' ],
  templateUrl: 'accountauth.component.html'
})
export class AccountAuth {
  header: {[key: string]: any} = {title: 'edit_account', collspse: false};
  devices: any[];
  userAccount: string;
  selType: string = 'enControl';

  constructor(
    private api: ApiService,
    private global: GlobalService,
    private route: ActivatedRoute,
    public router: Router,
  ) {
    let querys = this.route.params['value'];
    if(querys['account']) {
      this.userAccount = querys['account'];
      this.header['subTitle'] = querys['account'];
    } else {
      this.router.navigate(['/admin/accounts']);
      return; 
    }
    this.getAccount();
  }

  //取得該帳號權限
  getAccount() {
    this.api.get('/api/user/auth/' + this.userAccount).then((data: {[key: string]: any}) => {
      if(data['resCode'] === 200) {
        this.devices = data['devices'];
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/accounts']);
  }

  editAuth(device: any, type: string, val: number) {
    let putData = 'account=' + this.userAccount + 
      '&deviceId=' + device['deviceId'] + 
      '&enable='   + val + 
      '&type='     + type ;

    // console.log('put data ' + putData);
    return this.api.put(putData, '/api/user/auth', 'urlencoded').then((data: {[key: string]: any}) => {
      if(data['resCode'] !== 200) {
        this.global.showErrMsg(this.header, 'err_save');
        this.getAccount();
      }
    });
  }

  selectAll(type, val) {
    if(!this.devices){
      return;
    }    
    
    let done = (curIdx) => {
      if(curIdx !== (this.devices.length - 1)) {
        sendAsync(curIdx + 1);
      } else {
        this.getAccount();
      }
    };

    let sendAsync = (curIdx: number) => {
      let device = this.devices[curIdx];
      if(device[type] === val) {
        return done(curIdx);
      } else {
        device[type] = (device[type]) ? 0 : 1;
      }
      // console.log('[' + Date.now() + '] done1  all -> ' + device.deviceId + ', curIdx = ' + curIdx);
      this.editAuth(device, type, device[type]).then(() => {
        // console.log('[' + Date.now() + '] done2 all -> ' + device.deviceId);
        return done(curIdx);
      }); 
    }
    sendAsync(0);
  }
}