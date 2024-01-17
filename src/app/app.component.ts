import { HttpClient, HttpClientXsrfModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { SessionService } from '../factory/session.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'lachola';

    public user: any;
    constructor(private http: HttpClient, private session: SessionService) {
        this.user = localStorage.getItem('user');
    }

    ngOnInit() {
        this.session.SDuserCookie$.subscribe((data) => {
            this.user = data;
        })
        setTimeout(() => {
            this.user = localStorage.getItem('user');
        }, 500)
    }
}
