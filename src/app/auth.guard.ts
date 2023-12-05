import { CanActivateFn, Router } from '@angular/router';
export const authGuard: CanActivateFn = (route, state) => {

      // Aquí, verifica la existencia de tu variable de sesión o cualquier otra lógica de autenticación.
      const isLoggedIn = localStorage.getItem('user');
        var router= new Router();
      if (isLoggedIn) {
        return true;
      } else {
        // Redirige a la página de inicio de sesión u otra página según tus necesidades.
        router.navigate(['/logIn']);
        return false;
      }
};
