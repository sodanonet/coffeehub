import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'coffeehub-theme';

  private themeSignal = signal<Theme>(this.getStoredTheme());
  readonly currentTheme = this.themeSignal.asReadonly();

  private effectiveThemeSignal = signal<'light' | 'dark'>('light');
  readonly effectiveTheme = this.effectiveThemeSignal.asReadonly();

  constructor() {
    // Apply initial theme
    this.applyTheme();

    // Watch for theme changes
    effect(() => {
      const theme = this.currentTheme();
      this.applyTheme();
      this.saveTheme(theme);
    });

    // Watch for system theme changes when in auto mode
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (_e) => {
        if (this.currentTheme() === 'auto') {
          this.applyTheme();
        }
      });
    }
  }

  setTheme(theme: Theme): void {
    this.themeSignal.set(theme);
  }

  toggleTheme(): void {
    const current = this.currentTheme();
    const next: Theme = current === 'light' ? 'dark' : current === 'dark' ? 'auto' : 'light';
    this.setTheme(next);
  }

  private applyTheme(): void {
    const theme = this.currentTheme();
    const effectiveTheme = this.resolveEffectiveTheme(theme);

    this.effectiveThemeSignal.set(effectiveTheme);

    // Apply to document
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(effectiveTheme);
  }

  private resolveEffectiveTheme(theme: Theme): 'light' | 'dark' {
    if (theme === 'auto') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return theme;
  }

  private getStoredTheme(): Theme {
    const stored = localStorage.getItem(this.THEME_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'auto') {
      return stored;
    }
    return 'auto';
  }

  private saveTheme(theme: Theme): void {
    localStorage.setItem(this.THEME_KEY, theme);
  }
}
