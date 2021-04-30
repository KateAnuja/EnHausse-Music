import { Injectable } from '@angular/core';
import { MusicTrack, MusicTrackUtil, SortByMusicTrack } from '../model/track';
import { Constants } from '../util/constants';
import { Utility } from '../util/utility';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class MusicTrackService {
  constructor(
    private storage:Storage  
  ) {
      this.storage.create();
  }
    
  saveTrack(youTubeVideoId : string){

  }

  playTrack(path : string){

  }

  addToPlaylist(path : string){

  }

  toggleFavourite(path : string){

  }

  get20LocalTracks(){

  }

  async getAllLocalTracks(){
    let tracks:MusicTrack[]=[];
    try{ 
      tracks=JSON.parse(await this.storage.get("tracks"));
    }catch(err){

    }
    return tracks;
  }

  getTracksByPlaylist(playlistName : string){

  }

  addNewPlaylist(playlistName : string){

  }

  deletePlaylist(playlistName : string){

  }

  removeFromPlaylist(playlistName : string, path : string){

  }

  async createMockData(){
    let mockDataArray : MusicTrack[]=[];
    for(let i=0;i<1000;i++){
      let name = Utility.generateRandomSongName();
      mockDataArray.push({
        name : name,
        path : name.replace(/ /gi,'_')+i,
        duration : Utility.randomNumber(3*60*1000,8*60*1000),
        thumbnail : Constants.TUMBNAIL_ARRAY[Utility.randomNumber(0,Constants.TUMBNAIL_ARRAY.length)],
        playlist : [],
        isFavourite : false,
        addedTimeStamp : Utility.randomNumber(1612117800000,1619721000000)
      })
    }
    mockDataArray = MusicTrackUtil.sort(SortByMusicTrack.A_TO_Z, mockDataArray);
    await this.storage.set("tracks",JSON.stringify(mockDataArray));
  }
}
