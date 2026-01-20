import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  currentUrl: string = '';

  constructor(
    public authService: AuthService,
    public router: Router
  ) {
    // ✅ Track current route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.urlAfterRedirects;
      });
  }

  // 🔹 Login state
  get isLoggedIn(): boolean {
    return this.authService.getLoginStatus;
  }

  // 🔹 Role
  get role(): string | null {
    return this.authService.getRole;
  }

  // 🔹 MediService click logic
  onBrandClick() {
    if (this.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }

  // 🔹 Footer visibility
  get showFooter(): boolean {
    return !(
      this.currentUrl === '/login' ||
      this.currentUrl === '/registration'
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}