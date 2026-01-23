

import { Component, HostListener } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  currentUrl: string = '';
  showLogoutPopup = false;

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

  /* ============================= */
  /* STICKY NAVBAR SCROLL EFFECT */
  /* ============================= */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const navbar = document.querySelector('.custom-navbar');

    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }

  // 🔹 Login state
  get isLoggedIn(): boolean {
    return this.authService.getLoginStatus;
  }

  // 🔹 Role
  get role(): string | null {
    return this.authService.getRole;
  }

  // 🔹 Brand click logic
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

    this.showLogoutPopup = true;

  }
 
  

confirmLogout() {

    this.showLogoutPopup = false;

    this.authService.logout();

    this.router.navigate(['/']);

  }
 
  cancelLogout() {

    this.showLogoutPopup = false;

  }
  
  isChatPage(): boolean {
  return this.currentUrl === '/chat';
}
 
// 🤖 Navigate to chat page
openChat(): void {
  this.router.navigate(['/chat']);
}
 
}

