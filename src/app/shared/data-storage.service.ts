import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, tap } from "rxjs/operators";
import { Store } from "@ngrx/store";

import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import * as fromApp from "../store/app.reducer";
import * as RecipeActions from "../recipes/store/recipe.actions";

@Injectable({
  providedIn: "root"
})
export class DataStorageService {
  private databasePath =
    "https://ng-recipe-book-92ac5.firebaseio.com/recipes.json";

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>
  ) {}

  fetchRecipes() {
    return this.http.get<Recipe[]>(this.databasePath).pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }),
      tap(recipes => {
        this.store.dispatch(new RecipeActions.SetRecipes(recipes));
      })
    );
  }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(this.databasePath, recipes)
      .subscribe(response => console.log(response));
  }
}
