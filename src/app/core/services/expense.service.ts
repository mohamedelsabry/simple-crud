import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database'
import { Iexpense } from '../models/common.model';
@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private dbPath = "/expenses";
  expensesRef: AngularFireList<any>
  constructor(private db: AngularFireDatabase) {
    this.expensesRef = db.list(this.dbPath)
    console.log(this.expensesRef);
  }

  getAllExpenses() {
    return this.expensesRef;
  }

  getExpense(key: string) {
    return this.db.object(`${this.dbPath}/${key}`);
  }

  addExpense(expense: Iexpense) {
    return this.expensesRef.push(expense);
  }

  updateExpense(key: string, expense: Iexpense) {
    return this.expensesRef.update(key, expense);
  }

  deleteExpense(key: string) {
    return this.expensesRef.remove(key);
  }
}
