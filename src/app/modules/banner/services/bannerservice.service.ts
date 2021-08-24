import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { bannerState } from 'src/assets/config/interfaces';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class BannerserviceService {

  
  
  // define the subjects
 state: bannerState = {
  banners : []
};


stateSubject: BehaviorSubject<bannerState> = new BehaviorSubject(this.state);
readonly stateObservable = this.stateSubject.asObservable();

constructor(
  private http: HttpClient,
  private snack: MatSnackBar
) { }

  async init () {

    const result: any = await this.http.get(environment.url + 'banner/get')
    .toPromise();
    
    const today = new Date().getTime();
    if (result.data) {

      result.data.forEach(slider => {
        
        if(Number(slider.end) < today) {
          slider.state = 0
        }
      });
      
      
      this.state.banners = result.data;
      this.stateSubject.next(this.state);
    }else {
      this.state.banners = [];
      this.stateSubject.next(this.state);
    }

  
}


// New Banner

async saveBanner(banner): Promise<boolean>  {

  
  let headers= new HttpHeaders({
    'Content-Type': 'application/json; charset=UTF-8'
  });

  let options = {
    headers : headers
  }

  const body = banner
  
  return this.http.post(environment.url + 'banner/register', 
  JSON.stringify(body), 
  options)
  .toPromise()
  .then(async (res: any) => {
    if(res.status) {
      this.init();
      this.successMessage ("Bannière enregistrée avec succès !");
      return true;
    }
    else
    this.errorMessage('Une erreur est survenue, veuillez réessayer.')
      return false;
      
  }).catch(err => {
    this.errorMessage('Une erreur est survenue, veuillez réessayer.')
    return false;
    
  });

}

// Delete banner

async editBanner(banner): Promise<boolean>  {

  
  let headers= new HttpHeaders({
    'Content-Type': 'application/json; charset=UTF-8'
  });

  let options = {
    headers : headers
  }

  const body = banner

  
  return this.http.put(environment.url + 'banner/update', 
  JSON.stringify(body), 
  options)
  .toPromise()
  .then(async (res: any) => {
    if(res.status) {
      this.successMessage ("Bannière modifiée avec succès !");
      this.init();
      return true;
    }
    else
    this.errorMessage('Une erreur est survenue, veuillez réessayer.')
      return false;
  }).catch(err => {
    this.errorMessage('Une erreur est survenue, veuillez réessayer.')
    return false;
  });

}


// Delete banner

async deleteBanner(banner): Promise<boolean>  {

  
  let headers= new HttpHeaders({
    'Content-Type': 'application/json; charset=UTF-8'
  });

  let options = {
    headers : headers
  }

  const body = banner

  
  return this.http.put(environment.url + 'banner/delete', 
  JSON.stringify(body), 
  options)
  .toPromise()
  .then(async (res: any) => {
    if(res.status) {
      this.successMessage ("Bannière supprimée avec succès !");
      this.init();
      return true;
    }
    else
    this.errorMessage('Une erreur est survenue, veuillez réessayer.')
      return false;
  }).catch(err => {
    this.errorMessage('Une erreur est survenue, veuillez réessayer.')
    return false;
  });

}

//ALERTS

errorMessage(a): void {
  this.snack.open(a, '',

  {
    duration: 5000,
    verticalPosition: 'bottom',
    panelClass: 'danger-alert'
  }

  ) ;
}

successMessage(a): void{
  this.snack.open(a, '',

  {
    duration: 3000,
    verticalPosition: 'top',
    panelClass: 'success-alert'
  }

  );
}
}

