import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CustomerService} from "../services/customer.service";
import {catchError, map, Observable, throwError} from "rxjs";
import {Customer} from "../module/customer.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit{
  customers!:Observable<Array<Customer>>;
  errorMessage! :string;
  searchformGroup : FormGroup | undefined ;
  constructor(private customersService:CustomerService,private fb: FormBuilder,private router:Router) {
  }
  ngOnInit():void{
    // this.customersService.getCustomers().subscribe({
    //   next : (data)=>{
    //     this.customers=data;
    //   },
    //   error:(err)=>{
    //     this.errorMessage=err.message;
    //   }
    // })
    this.searchformGroup=this.fb.group({
      keyword : this.fb.control("")
    });
    // this.customers=this.customersService.getCustomers().pipe(
    //   catchError(err => {
    //     this.errorMessage=err.message;
    //     return throwError(err);
    //   })
    // );
    this.handleSearchCustomers();

  }
  handleSearchCustomers() {
    let kw=this.searchformGroup?.value.keyword;
    this.customers=this.customersService.searchCustomers(kw).pipe(
      catchError(err=>{
        this.errorMessage=err.message;
        return throwError(err);
      })
    );
  }

  handleDeleteCustomer(c: Customer) {
    let conf =confirm("Are you sure?")
    if(!conf)return;
    this.customersService.deleteCustomer(c.id).subscribe({
      next :(resp) => {
        this.customers=this.customers.pipe(
          map(data=>{
            let index=data.indexOf(c);
            data.slice(index,1)
            return data;
          })
        );
      },
      error:err => {
        console.log(err);
      }
    })
  }

  handleCustomerAccounts(customer: Customer) {
    this.router.navigateByUrl("/customer-accounts/"+customer.id,{state:customer});
  }
}
