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

    this.user=localStorage.getItem('user');
  }
}
