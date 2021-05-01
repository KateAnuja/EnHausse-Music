import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { HomePageRoutingModule } from './home-routing.module';
import { LocalMusicPageModule } from '../local-music/local-music.module';
import { PlaylistPageModule } from '../playlist/playlist.module';
import { SearchPageModule } from '../search/search.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SuperTabsModule,
    LocalMusicPageModule,
    PlaylistPageModule,
    SearchPageModule,
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
