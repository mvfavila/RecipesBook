import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  feature = "recipe";

  onNavigate(feauture: string) {
    this.feature = feauture;
  }
}
