import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Ingredient } from "../shared/ingredient.model";

@Injectable({ providedIn: "root" })
export class ShoppingListService {
  ingredientsListChanged = new Subject<Ingredient[]>();
  private ingredients: Ingredient[] = [
    new Ingredient("Onion", 5),
    new Ingredient("Tomato", 10)
  ];

  getIngredients() {
    return this.ingredients.slice();
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsListChanged.next(this.getIngredients());
  }

  addToShoppingList(newIngredients: Ingredient[]) {
    this.ingredients.push(...newIngredients);
    this.ingredientsListChanged.next(this.getIngredients());
  }
}
