import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Announcement } from 'app/announcement';

const routes: Routes = [
  { path: '', component: Announcement }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnnouncementRoutingModule { }