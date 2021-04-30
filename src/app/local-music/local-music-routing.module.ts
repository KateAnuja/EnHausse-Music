import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocalMusicPage } from './local-music.page';

const routes: Routes = [
  {
    path: '',
    component: LocalMusicPage
  },{
    path:':playlistName',
    component: LocalMusicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocalMusicPageRoutingModule {}
