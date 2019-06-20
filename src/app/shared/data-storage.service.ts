import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map, tap, take, exhaustMap } from "rxjs/operators";

import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root"
})
export class DataStorageService {
  private databasePath =
    "https://ng-recipe-book-92ac5.firebaseio.com/recipes.json";

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
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
        this.recipeService.setRecipes(recipes);
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
