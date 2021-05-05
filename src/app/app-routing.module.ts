import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => 
      import('./home/home.module').then( 
        m => m.HomePageModule
      )
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'search',
    loadChildren: () => 
      import('./search/search.module').then( 
        m => m.SearchPageModule
      )
  },
  {
    path: 'music-player',
    loadChildren: () => 
      import('./music-player/music-player.module').then( 
        m => m.MusicPlayerPageModule
      )
  },
  {
    path: 'local-music',
    loadChildren: () => 
      import('./local-music/local-music.module').then( 
        m => m.LocalMusicPageModule
      )
  },
  {
    path: 'playlist',
    loadChildren: () => 
      import('./playlist/playlist.module').then( 
        m => m.PlaylistPageModule
      )
  },
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
