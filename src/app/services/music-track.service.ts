import { Injectable } from '@angular/core';
import { MusicTrack, MusicTrackUtil, SortByMusicTrack } from '../model/track';
import { Constants } from '../util/constants';
import { Utility } from '../util/utility';
import { Storage } from '@ionic/storage';
import { Playlist } from '../model/playlist';
import { BehaviorSubject } from 'rxjs';
import { MusicPlayer, MusicPlayerOrderPreference, MusicPlayerUtil } from '../model/musicPlayer';


@Injectable({
  providedIn: 'root'
})
export class MusicTrackService {
  //allMusicTrack = new BehaviorSubject<MusicTrack[]>();
  favCountBehaviorSubject = new BehaviorSubject(0);
  playListUpdated = new BehaviorSubject(0);
  playerDataBehaviorSubject = new BehaviorSubject<MusicPlayer>(null);
  musicTrackAddedBehaviourSubject = new BehaviorSubject<boolean>(false);
  isPlayerPlayingBehaviourSubject = new BehaviorSubject<boolean>(false);
  playListUpdatedBehaviourSubject = new BehaviorSubject<boolean>(false);
  playListUiUpdatedBehaviourSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private storage:Storage  
  ) {
      this.storage.create();
  }
    
  saveTrack(musicTrack : MusicTrack){
    this.getAllLocalTracks()
    .then(async (musicArray)=>{
      musicArray.push(musicTrack);
      musicArray = MusicTrackUtil.sort(SortByMusicTrack.RECENT_FIRST, musicArray);
      this.storage.set(Constants.DB.MODEL_MUSIC_TRACK,JSON.stringify(musicArray));
    })


  }

  async playTrack(currentMusictTrack:MusicTrack,musicTrackArray:MusicTrack[],toPlay:boolean){
    this.playerDataBehaviorSubject.next({
      currentMusictTrack,
      musicTrackArray,
      orderPreference : await this.getMusicOrderPreference(),
      toPlay
    });
  }

  async saveLastPlayedTrack(musicTrack:MusicTrack){
    this.storage.set(Constants.DB.MODEL_LAST_MUSIC_TRACK,musicTrack.path);
  }

  async getLastPlayedTrack(){
    return (await this.storage.get((Constants.DB.MODEL_LAST_MUSIC_TRACK))) || "";
  }

  async addToPlaylist(musicTrack: MusicTrack,playlistName:string){

    this.getAllLocalTracks()
    .then(async (musicArray)=>{
      for(let i=0;i<musicArray.length;i++){
        if(musicTrack.path == musicArray[i].path){
          musicArray[i].playlist.push(playlistName);
          this.setPlaylistMusicTracksCount(playlistName,true);
          break;
        }
      }
      this.storage.set(Constants.DB.MODEL_MUSIC_TRACK,JSON.stringify(musicArray));
    })

    
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

  async getFavCount(){
    return (await this.storage.get(Constants.DB.COUNT_FAVOURITE) || 0);
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

  async getAllLocalTracksCount(){
    let tracks:MusicTrack[]=[];
    tracks=await this.getAllLocalTracks();

    return tracks.length;
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

  async deleteMusicTrack(musicTrack : MusicTrack){
    let musicTrackDbArray:MusicTrack[]=[];
    try{
      musicTrackDbArray=JSON.parse(await this.storage.get(Constants.DB.MODEL_MUSIC_TRACK || Constants.STRING_EMPTY_ARRAY));
    }catch(err){

    }
    for(let i=0;i<musicTrackDbArray.length;i++){
      if(musicTrackDbArray[i].path==musicTrack.path){
        musicTrackDbArray.splice(i,1);
      }
    }

    await this.storage.set(Constants.DB.MODEL_MUSIC_TRACK, JSON.stringify(musicTrackDbArray));
    
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

  async setPlaylistMusicTracksCount(playlistName:string,toAdd:boolean=true){
    let incrementor=+1;
    if(!toAdd){
      incrementor=-1;
    }
    let playlistDbObj={};
    try{ 
      playlistDbObj=JSON.parse(await this.storage.get(Constants.DB.MODEL_PLAYLIST) || Constants.STRING_EMPTY_OBJECT);
    }catch(err){

    }
    if(!playlistDbObj[playlistName].count){
      playlistDbObj[playlistName].count=0;
    }
    playlistDbObj[playlistName].count+=incrementor;
    await this.storage.set(Constants.DB.MODEL_PLAYLIST, JSON.stringify(playlistDbObj));
    this.playListUpdatedBehaviourSubject.next(true);
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
    mockDataArray = MusicTrackUtil.sort(SortByMusicTrack.RECENT_FIRST, mockDataArray);
    await this.storage.set(Constants.DB.MODEL_MUSIC_TRACK,JSON.stringify(mockDataArray));
  }

  deleteMusictrackFromPlaylist( musicTrack: MusicTrack,playlistName:string){
    this.getAllLocalTracks()
    .then(async (musicArray)=>{
      for(let i=0;i<musicArray.length;i++){
        if(musicTrack.path == musicArray[i].path){
          musicArray[i].playlist.splice(musicArray[i].playlist.indexOf(playlistName),1);
          this.setPlaylistMusicTracksCount(playlistName,false);
          break;
        }
      }
      this.storage.set(Constants.DB.MODEL_MUSIC_TRACK,JSON.stringify(musicArray));
    })

  }

  setMusicOrderPreference(musicOrderPreference : MusicPlayerOrderPreference){
    this.storage.set(Constants.DB.MUSIC_PREFERENCE_ORDER, musicOrderPreference);
    return MusicPlayerUtil.setOrderPreference(musicOrderPreference);
  }
  
  async getMusicOrderPreference(){
    let musicPlayerOrderPrefernce : MusicPlayerOrderPreference;
    let _musicPlayerOrderPreferenceString = 
                                        await this.storage.get(
                                          Constants.DB.MUSIC_PREFERENCE_ORDER
                                        );
    switch(_musicPlayerOrderPreferenceString){
      case MusicPlayerOrderPreference.ALL_IN_LOOP : {
        musicPlayerOrderPrefernce = MusicPlayerOrderPreference.ALL_IN_LOOP;
        break;
      }
      case MusicPlayerOrderPreference.ONE_IN_LOOP : {
        musicPlayerOrderPrefernce = MusicPlayerOrderPreference.ONE_IN_LOOP;
        break;
      }
      case MusicPlayerOrderPreference.SHUFFLE : {
        musicPlayerOrderPrefernce = MusicPlayerOrderPreference.SHUFFLE;
        break;
      }
      default : {
        musicPlayerOrderPrefernce = MusicPlayerOrderPreference.ALL_IN_LOOP;
      }
     
    }

    return musicPlayerOrderPrefernce;
  }


}
