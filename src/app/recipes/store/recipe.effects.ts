import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { switchMap, map, withLatestFrom } from "rxjs/operators";
import { createEffect } from "@ngrx/effects";

import * as fromApp from "../../store/app.reducer";
import * as RecipeActions from "./recipe.actions";
import { Recipe } from "../recipe.model";

@Injectable()
export class RecipeEffects {
  private databasePath =
    "https://ng-recipe-book-92ac5.firebaseio.com/recipes.json";

  fetchRecipes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipeActions.fetchRecipes),
      switchMap(() => {
        return this.http.get<Recipe[]>(this.databasePath);
      }),
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }),
      map(recipes => RecipeActions.setRecipes({ recipes }))
    )
  );

  storeRecipes$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RecipeActions.storeRecipes),
        withLatestFrom(this.store.select("recipe")),
        switchMap(([_, recipesState]) => {
          return this.http.put(this.databasePath, recipesState.recipes);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
