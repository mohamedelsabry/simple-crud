import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ExpenseService } from '../../core/services/expense.service';
import { Iexpense } from '../../core/models/common.model';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.scss'
})
export class ExpenseComponent implements OnInit, OnChanges {
  expenses: Iexpense[] = []
  totalExpense: number = 0;
  expenseKey: string = "";
  constructor(private expenseService: ExpenseService, private router: Router) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getAllExpenses();
    console.log(changes);
  }
  ngOnInit(): void {
    this.getAllExpenses();
  }

  getAllExpenses() {
    this.expenseService.getAllExpenses().snapshotChanges().subscribe({
      next: (data) => {
        data.forEach((item) => {
          let expense = item.payload.toJSON() as Iexpense;
          this.totalExpense += parseInt(expense.price);
          this.expenses.push({
            key: item.key || "",
            title: expense.title,
            price: expense.price,
            description: expense.description
          })
        })
      }
    });
  }


  editExpense(key: string) {
    this.router.navigate(['/expense-form', key]);
  }
  removeExpense(key: string) {
    if (window.confirm('Are you sure?')) {
      this.expenseService.deleteExpense(key).then(() => {
        // Remove the expense from the expenses array
        const index = this.expenses.findIndex(expense => expense.key === key);
        if (index > -1) {
          this.totalExpense -= parseInt(this.expenses[index].price);
          this.expenses.splice(index, 1);
        }
      }).catch((error) => {
        console.error('Error removing expense:', error);
      });
    }
  }
}
