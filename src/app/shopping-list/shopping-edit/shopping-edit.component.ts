import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import { Ingredient } from "src/app/shared/ingredient.model";
import { ShoppingListService } from "../shopping-list.service";
import * as ShoppingListActions from "../store/shopping-list.actions";

@Component({
  selector: "app-shopping-edit",
  templateUrl: "./shopping-edit.component.html",
  styleUrls: ["./shopping-edit.component.css"]
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild("f", { static: false }) form: NgForm;
  private startedEditingSubscription: Subscription;
  editMode = false;
  editItemIndex: number;
  editedItem: Ingredient;

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>
  ) {}

  ngOnInit() {
    this.startedEditingSubscription = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editItemIndex = index;
        this.editedItem = this.shoppingListService.getIngredient(index);
        this.form.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    );
  }

  onAddItem(f: NgForm) {
    const value = f.value;
    const newIngredient = new Ingredient(value.name, value.amount);

    if (this.editMode) {
      // this.shoppingListService.updateIngredient(
      //   this.editItemIndex,
      //   newIngredient
      // );
      this.store.dispatch(
        new ShoppingListActions.UpdateIngredient({
          index: this.editItemIndex,
          ingredient: newIngredient
        })
      );
    } else {
      // this.shoppingListService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }

    this.editMode = false;
    this.form.reset();
  }

  onClear() {
    this.editMode = false;
    this.form.reset();
  }

  onDelete() {
    // this.shoppingListService.deleteIngredient(this.editItemIndex);
    this.store.dispatch(
      new ShoppingListActions.DeleteIngredient(this.editItemIndex)
    );
    this.onClear();
  }

  ngOnDestroy() {
    this.startedEditingSubscription.unsubscribe();
  }
}
