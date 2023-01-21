import { Component } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    myForm!: FormGroup;
    myForm1!: FormGroup;

    filteredProducts = [];
    loading = false;
    currentUser: User;
    userFromApi: User;
    PriceFilter = [
        {
          
          "DisplayText": "10",
        },
        {
          
          "DisplayText": "50",
        },
        {
          
          "DisplayText": "100",
        }]
    product:any=[{
        name:'Tomato',
        img:'https://www.collinsdictionary.com/images/full/tomato_281240360.jpg',
        category:'Veg',
        price: 20,
        rating: 5
    },{
        name:'Potato',
        img:'https://www.lima-europe.eu/wp-content/uploads/2017/03/Potato.jpg',
        category:'Veg',
        price: 40,
        rating: 3
    },{
        name:'Onion',
        img:'https://rukminim1.flixcart.com/image/416/416/keuagsw0/plant-seed/q/g/r/20-a1-464-paudha-original-imafvfwzk3czkerg.jpeg?q=70',
        category:'Veg',
        price: 70,
        rating: 3.5
    },
    {
        name:'Ladyfinger',
        img:'https://5.imimg.com/data5/EP/YS/MY-3966004/lady-fingers-500x500.jpg',
        category:'Veg',
        price: 90,
        rating: 2.5
    }
]
    constructor(
        private userService: UserService,
        private authenticationService: AuthenticationService,
        private fb:FormBuilder
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
        this.myForm = this.fb.group({
            filterProduct: ['']
          })
    }

    ngOnInit() {
        this.loading = true;
        this.userService.getById(this.currentUser.id).pipe(first()).subscribe(user => {
            this.loading = false;
            this.userFromApi = user;
        });
        this.filteredProducts = this.product;

        this.myForm.get('filterProduct').valueChanges.subscribe(
            value => {
              console.log(value);
              this.filteredProducts = [...this.product.filter(product => product.price >= value.lower && product.price <= value.upper )]
            }
          )

        this.myForm1 = new FormGroup({
          "img": new FormControl(),
          "name": new FormControl(),
          "price": new FormControl(),
          "category": new FormControl(),

        })
    }
    getValue(index) {
        if(index === 0)
          return { 
            lower: 0, 
            displayText: this.PriceFilter[index].DisplayText, 
            upper: this.PriceFilter[index].DisplayText 
          };
        else {
          return { 
            lower: this.PriceFilter[index - 1].DisplayText, 
            upper: this.PriceFilter[index].DisplayText,
            displayText: `${this.PriceFilter[index - 1].DisplayText} - ${this.PriceFilter[index].DisplayText}`
          };
        }
      }
      delete(item:any){
        this.product.splice(item,1)
      }

      
      onSubmit(){
        this.product.push(this.myForm1.value)
      }
}