import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { IonInput, IonRange } from '@ionic/angular';
import { Constants } from '../util/constants';
import { AlertController, ToastController } from '@ionic/angular';
import { NetworkService } from '../services/network.service';
import { MusicTrackService } from '../services/music-track.service';
import { MusicTrack } from '../model/track';
import { Media } from '@ionic-native/media/ngx';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

import { Plugins } from '@capacitor/core';
import { Sounds } from '../util/sounds';
const { IonicPlugin,SplashScreen } = Plugins;

interface SearchData{
  title:string,
  videoId:string,
  thumbnail:string,
  duration:string
}

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage {
  public static TAG : string = "SearchPage";
  @ViewChild("searchInput",{static:false})searchInput:IonInput;
  @ViewChild('range', {static : false}) range : IonRange;
  bufferClipBoard:string=Constants.STRING_EMPTY_STRING;
  suggestionArray:string[]=[];
  searchResultArray:SearchData[]=[];
  downloadPercentage : number = 0;
  imgName : any;
  imgSrc : any;
  url : string="";
  progress = 0;
  isInitialLoad = false;
  shouldRedirectToHome = false;
  showProgressBar = false;
  isPreparingForDownload = false;

  constructor(
    private changeDetector:ChangeDetectorRef,
    private transfer: FileTransfer, 
    private file: File,
    private toast : ToastController,
    private alert : AlertController,
    private networkService : NetworkService,
    private musicTrackService : MusicTrackService,
    private media : Media,
    private router : Router,
    private speechRecognition: SpeechRecognition,
    private tts: TextToSpeech,
  ) {
    
  }

  async ionViewWillEnter(){
    if(this.router.url.indexOf("/web")!=-1){
      let searchKey=decodeURI(this.router.url.replace("/search/web/",""));
      this.shouldRedirectToHome=true;
      this.getSuggestion(searchKey);
    }
    if(this.router.url.indexOf("/download")!=-1){
      let videoId=this.router.url.replace("/search/download/","");
      this.shouldRedirectToHome=true;
      this.scrapY2Mate(videoId);
    }
    if(this.router.url.indexOf("/search/init") != -1){
      this.isInitialLoad = true;
      this.shouldRedirectToHome = true;
      
      new Audio(Sounds.SOUND_WELCOME).play();
      
      let currentYear = +new Date().getFullYear();
      this.getSearchResults(Constants.STRING_INITIAL_LOAD_SEARCH+currentYear);
    }
    
  }
  
  ionViewDidEnter(){
    this.searchInput.setFocus();
    SplashScreen.hide();
  }

  searchTerm(){
    let termString:string=(this.searchInput.value+Constants.STRING_EMPTY_STRING).trim();
    this.suggestionArray=[];
  
    if(termString.length>0 && termString!=this.bufferClipBoard){
      this.getSuggestion(termString);
    }
  }

  async getSuggestion(term:string){
    this.bufferClipBoard=Constants.STRING_EMPTY_STRING;
    let suggestionArray:any=[];
    try{
      suggestionArray=await this.networkService.getSuggestion(term);
    }catch(err){

    }
    this.suggestionArray=[...suggestionArray];
    if(this.suggestionArray.length>0 && this.isInitialLoad){
      new Audio(Sounds.SOUND_CHOOSE_ONE).play();
    }
    this.changeDetector.detectChanges();
  }

  async getSearchResults(term:string){
    this.suggestionArray=[];
    this.searchResultArray=[];
    this.bufferClipBoard=term;
    this.searchInput.value=term;
    let searchResultArray:any=[];
    this.isPreparingForDownload=true;
    try{
      searchResultArray=await this.networkService.getSearchResults(term);
    }catch(err){

    }
    this.searchResultArray=[...searchResultArray];
    this.isPreparingForDownload=false;
    this.changeDetector.detectChanges();
  }

  downloadVideo(videoId:string){
    this.searchResultArray=[];
    this.searchInput.value="";
    this.isPreparingForDownload=true;
    this.scrapY2Mate(videoId);
  }
  async verifyUrl(){
    let videoid = this.url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
    if(videoid != null){
      this.downloadPercentage=0.01;
      this.showProgressBar=true;
      this.scrapY2Mate(videoid[1].toString());
    }else{ 
      const alert = await this.alert.create({
        header: 'Ohh No...',
        message: 'Please Enter Valid YouTube URL.',
        buttons: ['OK']
      });
  
       alert.present();
    }
  }

  currentlyDownloading="";
  async scrapY2Mate(vid:string){
    if(this.currentlyDownloading!=vid){
      this.currentlyDownloading=vid;
      try{
        let {kid,fileName}=await this.getVideoKid(vid);
        this.isPreparingForDownload=false;
        if(this.isInitialLoad){
          new Audio(Sounds.SOUND_DOWNLOADING).play();
        }
        this.showProgressBar=true;
        if(this.downloadPercentage != 0){
          this.downloadPercentage+=0.04;
        }else{
          this.downloadPercentage+=0.05;
        }
        let downloadUrl:string=await this.networkService.getDownloadUrl(kid,vid);
        this.downloadPercentage+=0.05;
        this.downloadFromUrl(downloadUrl,fileName);
      }catch(err){
        console.error(err)
        this.currentlyDownloading="";
        this.scrapY2Mate(vid)
      }
    }
    
  }

  async getVideoKid(vid:string):Promise<{kid:string,fileName:string}>{
    let videoKidObj:any=await this.networkService.getVideoKid(vid);
    this.imgName=videoKidObj.fileName;
    this.imgSrc=videoKidObj.thumbnailUrl;
    return videoKidObj;
  }

  async showSuccessToast(){
    if(this.isInitialLoad){
      new Audio(Sounds.SOUND_DOWNLOAD_COMPLETE).play();
    }
    const toast = await this.toast.create({
      message: 'Downloaded Successfully',
      duration: 2000
    });
    toast.present();
    this.musicTrackService.musicTrackAddedBehaviourSubject.next(true);
    if(this.shouldRedirectToHome){
      setTimeout(()=>{
        this.router.navigateByUrl('home');
      },1000);
    }

  }

  lastUpdateValue=0;
  lastProgress=0;
  async downloadFromUrl(downloadUrl:string,fileName:string){
    const fileTransfer: FileTransferObject = this.transfer.create();
    if(fileName.length<1){
      fileName=+new Date()+".mp3";
    }

    fileTransfer.onProgress((event)=>{
      let progress = ((((event.loaded * 100)/event.total)*0.9)+10)/100;
      if(this.lastProgress<progress){
        this.lastProgress=progress;
      }
      if(this.lastUpdateValue<progress){
        this.lastUpdateValue=progress+0.2;
        this.downloadPercentage=this.lastProgress;
        this.changeDetector.detectChanges(); 
      }
       
    })
    await this.file.createDir(this.file.externalCacheDirectory, "Music", true);
    
    fileTransfer.download(
      encodeURI(downloadUrl), 
      this.file.externalCacheDirectory + '/Music/' + fileName
    ).then(async (entry) => {
        this.url="";
        this.currentlyDownloading="";
        this.downloadPercentage=0;
        this.showProgressBar=false;
        this.lastUpdateValue=0;
        this.lastProgress=0;
        
        let musicTrack : MusicTrack = {
          name : fileName.replace(/.mp3/g,"").replace(/-/g," "),
          duration : 0,
          path : entry.nativeURL,
          thumbnail : this.imgSrc,
          playlist : [],
          isFavourite : false,
          addedTimeStamp : +new Date()
        }
        let audio=this.media.create(musicTrack.path.replace(/^file:\/\//,''));
        audio.setVolume(0);
        audio.play();
        let _count=0;
        let _int=setInterval(()=>{
          _count++;
          if(_count>20){
            this.musicTrackService.saveTrack(musicTrack);
            audio.setVolume(1);
            audio.stop();
            this.showSuccessToast();
            clearInterval(_int);
          }else{
            musicTrack.duration=audio.getDuration();
            if(musicTrack.duration>0){
              this.musicTrackService.saveTrack(musicTrack);
              audio.setVolume(1);
              audio.stop();
              this.showSuccessToast();
              clearInterval(_int);
            }else{
              this.showError();
            }
          }
        },100);
        
        
    }, (error) => {
        console.error('error...', error);
      this.showError();

    }).catch((err)=>{
      console.error(err);
      this.showError();
    })
  }

  initListen(){
    console.log("initListen")
    this.speechRecognition.requestPermission()
    .then(
      () => {
        this.startListen();
      },
      () => {
        this.showError();
      }
    )
  }

  startListen(){
    this.speechRecognition.startListening({
      showPopup:true
    })
    .subscribe(
      (matches: string[]) => {
        this.getSuggestion(matches[0])
      },
      (onerror) => {
        this.showError();
      }
    )
  }

  async showError(){
    this.url="";
    this.currentlyDownloading="";
    this.downloadPercentage=0;
    this.showProgressBar=false;
    this.lastUpdateValue=0;
    this.lastProgress=0;
    const toast = await this.alert.create({
      message: 'Ohh no.. An error occured. Try again!',
      buttons: [
        {
          text:"OK",
          role:'cancel',
          handler:()=>{

          }
        }
      ]
    });
    toast.present();
  }
}
