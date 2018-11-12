import { Injectable, Inject } from '@angular/core'
import { DOCUMENT } from '@angular/common'

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private currentTheme = ''

  constructor(@Inject(DOCUMENT) private document: Document) {}

  setPrimaryColor(color: string) {
    this.setVariable('--ion-color-primary', color)
  }

  setVariable(name: string, value: string) {
    this.currentTheme = `${name}: ${value};`
    this.document.documentElement.style.setProperty(name, value)
  }

  enableDarkMode(enableDarkMode: boolean) {
    let theme = this.getLightTheme()
    if (enableDarkMode) theme = this.getDarkTheme()
    this.document.documentElement.style.cssText = theme
  }

  getDarkTheme() {
    return `
      ${this.currentTheme}
      --ion-background-color: #293145;
      --ion-item-background-color: #293145;
      --ion-text-color: #fff;
      --ion-text-color-step-400: #fff;
      --ion-text-color-step-600: #fff;
    `
  }

  getLightTheme() {
    return `
      ${this.currentTheme}
      --ion-background-color: #fff;
      --ion-item-background-color: #fff;
      --ion-text-color: #222;
      --ion-text-color-step-400: #222;
      --ion-text-color-step-600: #222;
    `
  }
}