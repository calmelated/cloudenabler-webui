import { Directive, ElementRef, Input, OnChanges, HostListener } from '@angular/core';

//開啟 LIST "btn-group open" => "btn-group" 當有 class open 時 打開選單
export function drop(el:　ElementRef) {
  let parent = el.nativeElement.parentNode;
  let className: string = el.nativeElement.parentNode.className;
  el.nativeElement.parentNode.className = (className === "btn-group") ? "btn-group open" : "btn-group";
}

@Directive({selector: '[dropdown]'})
export class DropdownDirective implements HostListener {
  constructor(private el: ElementRef) {
  }

  @HostListener('click', ['$event'])
  onClick(e) {
    drop(this.el);
  }

}