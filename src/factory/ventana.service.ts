import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VentanaService {

  constructor() {

   }

  public setTemplate(v : string) {
    this.template = v;
    this.promise= new Promise<void|any>((resolve, reject) => {
      this.resolve=resolve;
      this.reject=reject;
    });
    return this.promise;
  }
  public callB=()=>{
    console.log('Sin CallBack');

  };
  public resolve:any;
  private reject:any;
  private promise:any;
  public template:string|undefined=undefined;
}
