import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { environment } from '../environments/environment'
import * as Parse from 'parse';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    Parse.initialize(environment.appId);
    (Parse as any).serverURL = environment.serverUrl;
    Parse.enableLocalDatastore();

    await this.platform.ready();

    if (this.platform.is('hybrid')) {
      if (this.platform.is('android')) {
        this.statusBar.styleLightContent();
      } else {
        this.statusBar.styleDefault();
      }

      this.splashScreen.hide();
    }
  }
}
