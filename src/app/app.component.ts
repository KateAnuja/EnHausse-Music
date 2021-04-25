import { Component } from '@angular/core';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private splashScreen: SplashScreen
  ) {}

  ionViewDidEnter(){
    this.splashScreen.hide();
  }
}
