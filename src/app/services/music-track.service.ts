import { Injectable } from '@angular/core';
import { MusicTrack, MusicTrackUtil, SortByMusicTrack } from '../model/track';
import { Constants } from '../util/constants';
import { Utility } from '../util/utility';
import { Storage } from '@ionic/storage';
import { Playlist } from '../model/playlist';


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

  async toggleFavourite(path : string){
    this.getAllLocalTracks()
    .then(async (musicArray)=>{
      for(let i=0;i<musicArray.length;i++){
        if(path == musicArray[i].path){
          musicArray[i].isFavourite = !musicArray[i].isFavourite;
          let favCount:number = (await this.storage.get(Constants.DB.COUNT_FAVOURITE) || 0);
          if(musicArray[i].isFavourite){favCount++}
          else{favCount--}
          this.storage.set(Constants.DB.COUNT_FAVOURITE,favCount);
          break;
        }
      }
      this.storage.set(Constants.DB.MODEL_MUSIC_TRACK,JSON.stringify(musicArray));
    })
  }

  get20LocalTracks(){

  }

  async getAllLocalTracks(){
    let tracks:MusicTrack[]=[];
    try{ 
      tracks=JSON.parse(await this.storage.get(Constants.DB.MODEL_MUSIC_TRACK) || Constants.STRING_EMPTY_ARRAY);
    }catch(err){

    }
    return tracks;
  }

  getTracksByPlaylist(playlistName : string){

  }

  async addNewPlaylist(playlistName : string){
    let playlistDbObj={};
    try{
      playlistDbObj=JSON.parse(await this.storage.get(Constants.DB.MODEL_PLAYLIST) || Constants.STRING_EMPTY_OBJECT);
    }catch(err){

    }
    if(!playlistDbObj){playlistDbObj={};}
    if(!playlistDbObj[playlistName] && playlistName && playlistName.length>0){
      playlistDbObj[playlistName]={
        count:0,
        createdTimeStamp:+new Date()
      }
    }  
    await this.storage.set(Constants.DB.MODEL_PLAYLIST,JSON.stringify(playlistDbObj));
  }

  async deletePlaylist(playlistObj : Playlist){
    let playlistDbObj={};
    try{ 
      playlistDbObj=JSON.parse(await this.storage.get(Constants.DB.MODEL_PLAYLIST) || Constants.STRING_EMPTY_OBJECT);
    }catch(err){

    } 
    delete playlistDbObj[playlistObj.name];
    await this.storage.set(Constants.DB.MODEL_PLAYLIST, JSON.stringify(playlistDbObj));
    
  }

  removeFromPlaylist(playlistName : string, path : string){

  }

  async getPlaylist(){
    let playlistDbObj={};
    let playlistArr:Playlist[]=[];
    try{ 
      playlistDbObj=JSON.parse(await this.storage.get(Constants.DB.MODEL_PLAYLIST) || Constants.STRING_EMPTY_OBJECT);
    }catch(err){

    }
    for(let k in playlistDbObj){
      playlistArr.push({
        name:k,
        count:playlistDbObj[k].count
      })
    }
    return playlistArr;
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
    await this.storage.set(Constants.DB.MODEL_MUSIC_TRACK,JSON.stringify(mockDataArray));
  }


}
