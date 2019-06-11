import { Ingredient } from "../shared/ingredient.model";
import { EventEmitter } from "@angular/core";

export class ShoppingListService {
  ingredientsListChanged = new EventEmitter<Ingredient[]>();
  private ingredients: Ingredient[] = [
    new Ingredient("Onion", 5),
    new Ingredient("Tomato", 10)
  ];

  getIngredients() {
    return this.ingredients.slice();
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsListChanged.emit(this.getIngredients());
  }

  addToShoppingList(newIngredients: Ingredient[]) {
    this.ingredients.push(...newIngredients);
    this.ingredientsListChanged.emit(this.getIngredients());
  }
}
