import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import { Ingredient } from "src/app/shared/ingredient.model";
import * as fromApp from "src/app/store/app.reducer";
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
  editedItem: Ingredient;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.startedEditingSubscription = this.store
      .select("shoppingList")
      .subscribe(stateData => {
        const index = stateData.editIndex;
        if (index > -1) {
          this.editMode = true;
          this.editedItem = stateData.ingredients[index];
          this.form.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount
          });
        } else {
          this.editMode = false;
        }
      });
  }

  onAddItem(f: NgForm) {
    const value = f.value;
    const newIngredient = new Ingredient(value.name, value.amount);

    if (this.editMode) {
      this.store.dispatch(
        ShoppingListActions.updateIngredient({ ingredient: newIngredient })
      );
    } else {
      this.store.dispatch(
        ShoppingListActions.addIngredient({ ingredient: newIngredient })
      );
    }

    this.editMode = false;
    this.form.reset();
  }

  onClear() {
    this.store.dispatch(ShoppingListActions.stopEdit());
    this.form.reset();
  }

  onDelete() {
    this.store.dispatch(ShoppingListActions.deleteIngredient());
    this.onClear();
  }

  ngOnDestroy() {
    this.startedEditingSubscription.unsubscribe();
    this.store.dispatch(ShoppingListActions.stopEdit());
  }
}
