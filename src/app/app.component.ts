import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'lachola';

  public user:string|null;
  constructor(){
    console.log('====================================');
    console.log(localStorage.getItem('user'));
    console.log('====================================');
    this.user=localStorage.getItem('user');
  }
}
