import { Component, OnInit, OnDestroy } from "@angular/core";
import { Recipe } from "../recipe.model";
import { ShoppingListService } from "src/app/shopping-list/shopping-list.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { RecipeService } from "../recipe.service";

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
    private route: ActivatedRoute
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
    this.shoppingListService.addToShoppingList(this.recipe.ingredients);
  }

  onDelete() {
    this.recipeService.deleteRecipe(this.selectedId);
    this.router.navigate(["/recipes"]);
  }

  ngOnDestroy() {
    this.recipeIdSubscription.unsubscribe();
  }
}
