/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'body',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.css'],
  template: `
    <router-outlet></router-outlet>
    <loading-spinner id='loadingSpinner'></loading-spinner>
  `
})

export class App {
  constructor() {} 
}
