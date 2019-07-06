import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import { map, switchMap } from "rxjs/operators";

import { Recipe } from "../recipe.model";
import { RecipeService } from "../recipe.service";
import * as ShoppingListActions from "src/app/shopping-list/store/shopping-list.actions";
import * as fromApp from "src/app/store/app.reducer";
import * as RecipeActions from "../store/recipe.actions";

@Component({
  selector: "app-recipe-detail",
  templateUrl: "./recipe-detail.component.html",
  styleUrls: ["./recipe-detail.component.css"]
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  recipe: Recipe;
  selectedId: number;
  recipeIdSubscription: Subscription;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.recipeIdSubscription = this.route.params
      .pipe(
        map(params => {
          return +params.id;
        }),
        switchMap(id => {
          this.selectedId = id;
          return this.store.select("recipe");
        }),
        map(recipesState => {
          return recipesState.recipes.find((_, index) => {
            return index === this.selectedId;
          });
        })
      )
      .subscribe(recipe => {
        this.recipe = recipe;
      });
  }

  onSendToShoppingList() {
    this.store.dispatch(
      new ShoppingListActions.AddIngredients(this.recipe.ingredients)
    );
  }

  onDelete() {
    // this.recipeService.deleteRecipe(this.selectedId);
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.selectedId));
    this.router.navigate(["/recipes"]);
  }

  ngOnDestroy() {
    this.recipeIdSubscription.unsubscribe();
  }
}
