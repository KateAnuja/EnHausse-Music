import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Media } from '@ionic-native/media/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { FirebaseCrashlytics } from '@ionic-native/firebase-crashlytics/ngx';
import { FCM } from '@capacitor-community/fcm';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { 
  FloatingMusicPlayerComponent 
} from './floating-music-player/floating-music-player.component';
import { Constants } from './util/constants';


@NgModule({
  declarations: [AppComponent, FloatingMusicPlayerComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    AppRoutingModule,
    IonicModule.forRoot(), 
    IonicStorageModule.forRoot({
      name: Constants.DB.DB_NAME,
      driverOrder:[Drivers.IndexedDB, Drivers.LocalStorage]
    }),
    SuperTabsModule.forRoot(),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SplashScreen,
    HTTP,
    FileTransfer,
    File,
    Media,
    ScreenOrientation,
    FirebaseCrashlytics,
    FCM,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
