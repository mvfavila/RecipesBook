import {
  ElementRef,
  Directive,
  OnInit,
  Renderer2,
  HostListener,
  HostBinding,
  Input
} from "@angular/core";
import { NgModuleResolver } from "@angular/compiler";

@Directive({
  selector: "[appBasicHighlight]"
})
export class BasicHighlightDirective implements OnInit {
  @Input() defaultColor = "transparent";
  @Input() highlightColor = "blue";
  @HostBinding("style.backgroundColor") backgroundColor: string;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    // this.renderer.setStyle(
    //   this.elementRef.nativeElement,
    //   "background-color",
    //   "green"
    // );
    this.backgroundColor = this.defaultColor;
  }

  @HostListener("mouseenter") mouseover(eventData: Event) {
    // this.renderer.setStyle(
    //   this.elementRef.nativeElement,
    //   "background-color",
    //   "green"
    // );
    this.backgroundColor = this.highlightColor;
  }

  @HostListener("mouseleave") mouseleave(eventData: Event) {
    // this.renderer.setStyle(
    //   this.elementRef.nativeElement,
    //   "background-color",
    //   "transparent"
    // );
    this.backgroundColor = this.defaultColor;
  }
}
