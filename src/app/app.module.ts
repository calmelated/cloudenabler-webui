import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from 'ng2-translate/ng2-translate';

/*
 * Platform and Environment providers/directives/pipes
 * App is our top level component
 */
import { ROUTES } from './app.routes';
import { App } from './app.component';
import { Login } from './login';
import { SharedModule } from './share/share.module';
import { ApiService, GlobalService, LocalStorageService } from './service';


/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ App ],
  declarations: [
    App,
    Login
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    TranslateModule.forRoot(),
    SharedModule
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ApiService,
    LocalStorageService,
    GlobalService,
  ]
})
export class AppModule {
  constructor(
    public translate: TranslateService, 
    public localStor: LocalStorageService,
    public title: Title,
    public api: ApiService,
  ) {
    //取得瀏覽器語系 做處理 safari => zh-tw, chrome => zh-TW 統一轉換成大寫 
    let langList: string[] = navigator.language.split("-");
    let browerLang: string = langList[0] + "_" + langList[1].toUpperCase();
    translate.setDefaultLang(browerLang);

    let userLang = localStor.get('userLang');
    if(userLang) {
      translate.use(userLang);
    } else {
      localStor.put('userLang', browerLang);
      translate.use(browerLang);
    }

    //Get customer 
    let odm = localStor.get('odm');
    if(odm) {
      title.setTitle(odm + ' Cloud');
    } else {
      api.get('/api/odm').then((data: {[key: string]: any}) => {
        if(data['resCode'] === 200) {
          localStor.put('odm', data['odm']);
          title.setTitle(data['odm'] + ' Cloud');
        }
      });      
    }
  }
}

