import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ImageCroppedEvent } from 'ngx-image-cropper';


import { productState, categoryState} from 'src/assets/config/interfaces';
import { ProductserviceService } from '../services/productservice.service';
 
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryserviceService } from '../../category/services/categoryservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createproduct',
  templateUrl: './createproduct.component.html',
  styleUrls: ['./createproduct.component.scss']
})
export class CreateproductComponent implements OnInit {

  title = new FormControl('', Validators.required);
  description = new FormControl('', Validators.required);
  category = new FormControl('', Validators.required);
  subcategory = new FormControl('', Validators.required);
  price = new FormControl('', Validators.required);
  promo = new FormControl('', Validators.required);
  
  subcategories : any[] =  [];
  subcategoriesDatas: any[];

  public images  = [];

  isChecked = false;
  
  imageChangedEvent: any;
  croppedImage: any;


  today = new Date();
  date = new Date();
  tommorow = new Date (this.date.setDate(this.date.getDate() + 3));
  minStartDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()); 
  minEndDate = new Date(this.tommorow.getFullYear(), this.tommorow.getMonth(), this.tommorow.getDate()); 
  start = new FormControl('', Validators.required);
  end = new FormControl('', Validators.required);

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
  }

  imageLoaded () {

  }
  cropperReady () {

  }
  loadImageFailed () {

  }

  pushImage = () =>{
    this.images.push(this.croppedImage);
    this.imageChangedEvent = null;
  }

  removeImage = (ev)=> {
    for(let [index,v] of this.images.entries()){
      if(v===ev){
        this.images.splice(index,1);
      }
    }
  }

  uploadFile = () =>{
    let element: HTMLElement = document.getElementById('imageInput') as HTMLElement;
    element.click();
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    minHeight: '150px',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    defaultFontSize: '3',
    uploadWithCredentials: true,
    sanitize: true,
    uploadUrl: 'https://api.mlmlongrichci.com/upload', // if needed
    toolbarHiddenButtons:   [
      [],
      [
        'removeFormat',
        'toggleEditorMode',
        'insertImage',
        'insertVideo'
      ]
    ]
  };

  errMessage : string = null;
  moduleState : productState;
  categoryModuleState: categoryState;

  productsData : any[] = [];
   
  categoriesData : any[] = [];
  

  constructor(
    private moduleService : ProductserviceService,
    private categoryModuleService : CategoryserviceService,
    private snack: MatSnackBar,
    private router: Router
  ) { }

  

  ngOnInit(): void {

    this.moduleService.stateObservable.subscribe(state => {
      this.moduleState = state;

      if(this.moduleState.products && this.moduleState.products.length > 0) {
        this.productsData = this.moduleState.products
      }
    })


    this.categoryModuleService.init()
    this.categoryModuleService.stateObservable.subscribe(state => {
      this.categoryModuleState = state;

      if(this.categoryModuleState.subacetgories && this.categoryModuleState.subacetgories.length > 0) {
        this.subcategories = this.categoryModuleState.subacetgories
        
        if(this.categoryModuleState.categories && this.categoryModuleState.categories.length > 0) {
          this.subcategory.reset(this.categoryModuleState.categories[0].reference)
          this.checkSubcategory(this.categoryModuleState.categories[0].reference)
        }
      }
    })
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }


  checkSubcategory (event) {

    this.subcategoriesDatas =  this.isObject(event) ? this.subcategories.filter(cat => cat.category === event.value): this.subcategories.filter(cat => cat.category === event);
    this.subcategory.reset(this.subcategoriesDatas[0].id)
  }
  

  isObject = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Object]';
  };

  errorMessage(a): void {
    this.snack.open(a, '',
  
    {
      duration: 5000,
      verticalPosition: 'bottom',
      panelClass: 'danger-alert'
    }
  
    ) ;
  }

  createCountry () {
    if(this.title.invalid ||
      this.price.invalid ||
      this.subcategory.invalid
      ) {
        this.title.markAsTouched();
        this.price.markAsTouched();
        this.subcategory.markAsTouched();
        this.category.markAsTouched();
        return;
      }

      if(
        this.description.invalid
      ) {
        this.errorMessage("Veuillez ajouter la description de l\'article");
  
        return;
      }

      if (this.images.length === 0) {
        this.errorMessage('Veuillez ajouter une image !');
        return;
      }

      const countryData = {
        title: this.title.value,
        price: this.price.value,
        description: this.description.value,
        state: 1,
        views: 0,
        category: this.subcategory.value,
        date: new Date().getTime(),
      }
      
      const promoData = {
        
        start : new Date(this.start.value).getTime(),
        end : new Date(this.end.value).getTime(),
        price: this.promo.value
      }

      const exist = this.productsData.filter(product => product.title.toLowerCase() === countryData.title.toLowerCase()).length > 0 ? true : false
      
      if (!exist) {
        
        if (this.isChecked) {

          if(this.start.invalid || this.end.invalid || this.promo.invalid) {
            this.start.markAsTouched();
            this.end.markAsTouched();
            this.promo.markAsTouched();

            return;
          }


          if (Number(promoData.price) < Number(countryData.price)) {


              if (Number(promoData.start) > Number(promoData.end)) {
                this.errorMessage('La date de fin promotion doit être supérieure à celle du début !');
                return;
              }

              this.moduleService.saveProduct(countryData)
              .then((res: any) => {
                if(res.status) {

                  this.moduleService.savePromos({...promoData, product: res.data.insertId})
                  .then(result => {
                    if(result) {
                      this.images.forEach(img => {
                        const imageData = {
                          link : img,
                          product : res.data.insertId
                        }
                        this.moduleService.saveImages(imageData)
                        .then(resData => {
                          this.moduleService.init()
                          if(resData)
                          this.router.navigateByUrl('products');
                        })
                      })
                    }
                  })

                }
              })

          }else {
            this.errorMessage ('Le coût de la promotion ne doit pas être supérieur au coût normal du produit.');
          }
          

        }else {

          this.moduleService.saveProduct(countryData)
          .then((res: any) => {
            if(res.status) {

              this.images.forEach(img => {
                const imageData = {
                  link : img,
                  product : res.data.insertId
                }
                this.moduleService.saveImages(imageData)
                .then(resData => {
                  this.moduleService.init()
                  if(resData)
                  this.router.navigateByUrl('products');
                })
              })
              
            }
          })
          
        }

        
      }else {
        this.errorMessage ('Un produit avec ce titre existe déjà !');
        return;
      }

      

      
  }
}


