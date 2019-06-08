import { Component, OnInit, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html"
})
export class HeaderComponent implements OnInit {
  @Output() featureSelected = new EventEmitter<string>();
  collapsed = true;

  constructor() {}

  ngOnInit() {}

  onSelect(feature: string) {
    switch (feature) {
      case "recipe":
      case "shopping-list":
        this.featureSelected.emit(feature);
        break;
      default:
        throw new Error("Invalid feature");
        break;
    }
  }
}
