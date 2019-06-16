import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Ingredient } from "../shared/ingredient.model";

@Injectable({ providedIn: "root" })
export class ShoppingListService {
  ingredientsListChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient("Onion", 5),
    new Ingredient("Tomato", 10)
  ];

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsListChanged.next(this.getIngredients());
  }

  addToShoppingList(newIngredients: Ingredient[]) {
    this.ingredients.push(...newIngredients);
    this.ingredientsListChanged.next(this.getIngredients());
  }

  updateIngredient(editItemIndex: number, newIngredient: Ingredient) {
    this.ingredients[editItemIndex] = newIngredient;
    this.ingredientsListChanged.next(this.getIngredients());
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsListChanged.next(this.getIngredients());
  }
}
