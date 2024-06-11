import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Iexpense } from '../../core/models/common.model';
import { ExpenseService } from '../../core/services/expense.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.scss'
})
export class ExpenseFormComponent implements OnInit {
  expenseForm!: FormGroup;
  expenseKey!: '';
  constructor(private fb: FormBuilder,
    private expenseService: ExpenseService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.expenseForm = this.fb.group({
      price: new FormControl("", [Validators.required, Validators.pattern('[0-9]+')]),
      title: new FormControl("", [Validators.required]),
      description: new FormControl(""),
    })
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.expenseKey = params['id'];
        this.getExpense(this.expenseKey);
      }
    })
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      if (this.expenseKey == undefined) {
        this.expenseService.addExpense(this.expenseForm.value);
      }
      else {
        this.expenseService.updateExpense(this.expenseKey, this.expenseForm.value);
      }
      this.router.navigate(['/']);

    } else {
      this.expenseForm.markAllAsTouched();
      // alert("Error")/
    }
  }

  getExpense(key: string) {
    this.expenseService.getExpense(key).snapshotChanges().subscribe({
      next: (data) => {
        let expense = data.payload.toJSON() as Iexpense;
        this.expenseForm.setValue(expense)
      }
    })
  }

  updateExpense(key: string, expense: Iexpense) {
    this.expenseService.updateExpense(key, expense);
  }
}
