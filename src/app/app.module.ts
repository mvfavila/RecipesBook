import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { AuthInterceptorService } from "./auth/auth-interceptor.service";
import { HeaderComponent } from "./header/header.component";
import { BasicHighlightDirective } from "./shared/basic-highlight.directive";
import { UnlessDirective } from "./shared/unless.directive";
import { SharedModule } from "./shared/shared.module";
import { RecipeService } from "./recipes/recipe.service";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BasicHighlightDirective,
    UnlessDirective
  ],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, SharedModule],
  providers: [
    RecipeService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
