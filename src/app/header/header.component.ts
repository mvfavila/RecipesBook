import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import { map } from "rxjs/operators";

import * as fromApp from "../store/app.reducer";
import * as AuthActions from "../auth/store/auth.actions";
import * as RecipeActions from "../recipes/store/recipe.actions";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html"
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  userSubscription: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  collapsed = false;

  ngOnInit() {
    this.store
      .select("auth")
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.isAuthenticated = !user ? false : true;
      });
  }

  onSaveData() {
    this.store.dispatch(RecipeActions.storeRecipes());
  }

  onFetchData() {
    this.store.dispatch(RecipeActions.fetchRecipes());
  }

  onLogout() {
    this.store.dispatch(AuthActions.logout());
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
