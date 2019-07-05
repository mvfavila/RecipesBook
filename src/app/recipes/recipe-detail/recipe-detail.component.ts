import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import { Recipe } from "../recipe.model";
import { Ingredient } from "src/app/shared/ingredient.model";
import { RecipeService } from "../recipe.service";
import { ShoppingListService } from "src/app/shopping-list/shopping-list.service";
import * as ShoppingListActions from "src/app/shopping-list/store/shopping-list.actions";

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
    private shoppingListService: ShoppingListService,
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>
  ) {}

  ngOnInit() {
    this.recipeIdSubscription = this.route.params.subscribe(
      (params: Params) => {
        this.selectedId = +params.id;
        this.recipe = this.recipeService.getRecipe(this.selectedId);
      }
    );
  }

  onSendToShoppingList() {
    // this.shoppingListService.addToShoppingList(this.recipe.ingredients);
    this.store.dispatch(
      new ShoppingListActions.AddIngredients(this.recipe.ingredients)
    );
  }

  onDelete() {
    this.recipeService.deleteRecipe(this.selectedId);
    this.router.navigate(["/recipes"]);
  }

  ngOnDestroy() {
    this.recipeIdSubscription.unsubscribe();
  }
}
