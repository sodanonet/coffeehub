import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeToggle],
  templateUrl: './navbar.html',
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly currentUser = this.authService.currentUser;

  protected logout(): void {
    this.authService.logout();
  }
}
