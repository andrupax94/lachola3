import { HttpClient } from '@angular/common/http';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

export class authGuard{
    static router: Router;
    static http: HttpClient;
    constructor(private router:Router,private http:HttpClient){
        router=this.router;
        http=this.http;
    }
    public static session: CanActivateFn = (route, state) => {

        // Aquí, verifica la existencia de tu variable de sesión o cualquier otra lógica de autenticación.
        const isLoggedIn = localStorage.getItem('user');
        if (isLoggedIn) {
          let http:HttpClient;
          this.http.post<any>(environment.back+'dameSesion',{

          }).subscribe((data)=>{
              console.log(data);
          });
          return true;
        } else {
          // Redirige a la página de inicio de sesión u otra página según tus necesidades.
          this.router.navigate(['/logIn']);
          return false;
        }
  };
}

