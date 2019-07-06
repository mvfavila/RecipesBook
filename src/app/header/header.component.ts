import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import { map } from "rxjs/operators";

import { DataStorageService } from "../shared/data-storage.service";
import { AuthService } from "../auth/auth.service";
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

  constructor(
    private dataStorage: DataStorageService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

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
    this.dataStorage.storeRecipes();
  }

  onFetchData() {
    // this.dataStorage.fetchRecipes().subscribe();
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
