import { Routes, RouterModule } from '@angular/router';
import { Login } from './login';

export const ROUTES: Routes = [
  { path: '',      component: Login },
  { path: 'login', component: Login },
  { path: 'login/superadmin', component: Login },
  { path: 'devices', loadChildren: './device/device.module#DeviceModule' },
  { path: 'slave', loadChildren: './device/slave/slave.module#SlaveModule' },
  { path: 'group', loadChildren: './group/group.module#GroupModule' },  
  { path: 'iostlog', loadChildren: './iostlog/iostlog.module#IostlogModule' },
  { path: 'flink', loadChildren: './flink/flink.module#FlinkModule' },
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
  { path: 'alarm', loadChildren: './alarm/alarm.module#AlarmModule' },
  { path: 'superadmin', loadChildren: './superadmin/superadmin.module#SuperadminModule' },
  { path: 'chart', loadChildren: './chart/chart.module#ChartModule' },
  { path: 'announcement', loadChildren: './announcement/announcement.module#AnnouncementModule' },
  { path: '**',    redirectTo: 'devices'},
];
