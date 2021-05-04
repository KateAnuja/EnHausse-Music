import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { IonInput, IonRange } from '@ionic/angular';
import { Constants } from '../util/constants';
import { AlertController, ToastController } from '@ionic/angular';
import { NetworkService } from '../services/network.service';
import { MusicTrackService } from '../services/music-track.service';
import { MusicTrack } from '../model/track';
import { Media } from '@ionic-native/media/ngx';


const { IonicPlugin } = Plugins;

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
export class SearchPage implements OnInit {
  public static TAG : string = "SearchPage";
  @ViewChild("searchInput",{static:false})searchInput:IonInput;
  bufferClipBoard:string=Constants.STRING_EMPTY_STRING;
  suggestionArray:string[]=[];
  searchResultArray:SearchData[]=[];
  downloadPercentage : number = 0;
  imgName : any;
  imgSrc : any;
  url : string="";
  progress = 0;
  isInitialLoad = false;
  showProgressBar = false;
  @ViewChild('range', {static : false}) range : IonRange;

  constructor(
    private http: HTTP,
    private changeDetector:ChangeDetectorRef,
    private transfer: FileTransfer, 
    private file: File,
    private toast : ToastController,
    private alert : AlertController,
    private networkService : NetworkService,
    private musicTrackService : MusicTrackService,
    private media : Media,
    private activatedRoute : ActivatedRoute,
    private router : Router

  ) { }

  ngOnInit() {
  }
  async ionViewWillEnter(){
    if(this.router.url.indexOf("/search/init") != -1){
      this.isInitialLoad = true;
      let currentYear = +new Date().getFullYear();
      this.getSearchResults(Constants.STRING_INITIAL_LOAD_SEARCH+currentYear);
    }
    let pluginResponse=await IonicPlugin.getSharedLink();
    if(pluginResponse.sharedLink && pluginResponse.sharedLink.length>20){
      this.url=pluginResponse.sharedLink;
      this.verifyUrl();
    }
  }
  
  ionViewDidEnter(){
    this.searchInput.setFocus();
  }

  searchTerm(){
    let termString:string=(this.searchInput.value+Constants.STRING_EMPTY_STRING).trim();
    this.suggestionArray=[];
  
    if(termString.length>0 && termString!=this.bufferClipBoard){
      this.getSuggestion(termString);
    }
  }

  getSuggestion(term:string){
    this.bufferClipBoard=Constants.STRING_EMPTY_STRING;
    this.http.get(
      "https://suggestqueries-clients6.youtube.com/complete/search",
      {
        client:"youtube-reduced",
        q:`song ${term}`
      },
      {

      }
    )
    .then((res)=>{
      try{
        let data=res.data+"";
        if(data.length>0 && data.indexOf("window.google.ac.h")!=-1){
          data=data.replace(
            /window.google.ac.h\(/gi,
            Constants.STRING_EMPTY_STRING
          ).replace(/\)/gi,'');
          let sugArr=JSON.parse(data)[1];
          sugArr.forEach(sugEl => {
            this.suggestionArray.push(
              sugEl[0]
              .replace(
                /song /g,
                Constants.STRING_EMPTY_STRING
              )
            )
          });
          this.changeDetector.detectChanges();
          
        }else{
          console.error("wrong res");
        }
      }catch(err){
        console.error(err)
      }
      
    })
  }

  getSearchResults(term:string){
    this.suggestionArray=[];
    this.searchResultArray=[];
    this.bufferClipBoard=term;
    this.searchInput.value=term;
    let clienVersion=Constants.STRING_EMPTY_STRING;
    let currentDate=new Date();
    clienVersion+=currentDate.getFullYear()
    let month=currentDate.getMonth()+1;
    if(month<10){
      clienVersion+="0"+month;
    }else{
      clienVersion+=month;
    }
    let date=currentDate.getDate();
    if(date<10){
      clienVersion+="0"+date;
    }else{
      clienVersion+=date;
    }

    this.http.get(
      "https://m.youtube.com/results",
      {
        search_query:`song ${term}`,
        pbj:'1'
      },
      {
        "x-youtube-client-name":"2",
        "x-youtube-client-version":`2.${clienVersion}`,
        "user-agent":Constants.USER_AGENT
      }
    ).then((res)=>{
      try{
        let data=JSON.parse(res.data);
        let videoArr=data.response
        .contents.sectionListRenderer
        .contents[0].itemSectionRenderer.contents;
        videoArr.forEach(videoEl => {
          let title=Constants.STRING_EMPTY_STRING,
          thumbnail=Constants.STRING_EMPTY_STRING,
          videoId=Constants.STRING_EMPTY_STRING,
          duration=Constants.STRING_EMPTY_STRING;
          try{
            title=videoEl.compactVideoRenderer.title.runs[0].text;
            thumbnail=videoEl.compactVideoRenderer.thumbnail.thumbnails[0].url;
            videoId=videoEl.compactVideoRenderer.videoId;
            duration=videoEl.compactVideoRenderer.lengthText
            .accessibility.accessibilityData.label;
          }catch(err){}
          if(title.length>0 && videoId!=Constants.STRING_EMPTY_STRING){
            this.searchResultArray.push({
              title,
              thumbnail,
              videoId,
              duration
            })
          }
        });
        this.changeDetector.detectChanges();
      }catch(err){

      }
    }).catch((err)=>{
      console.error(err)
    });
  }

  downloadVideo(videoId:string){
    this.searchResultArray=[];
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
  
      }
    }
    
  }

  getVideoKid(vid:string):Promise<{kid:string,fileName:string}>{
    return new Promise((resolve,reject)=>{
      this.http.sendRequest(
        'https://www.y2mate.com/mates/analyze/ajax',
        {
         method:"post",
         data:{
           url:`https://www.youtube.com/watch?v=${vid}`,
           q_auto:"1",
           ajax:"1"
          },
         serializer:"urlencoded",
         responseType:"json",
         headers:{
          "content-type":"application/x-www-form-urlencoded; charset=UTF-8"
        }
      }).then(d=>{
        if(d.data && d.data.result){
          let kid="";
          let fileName="";
          d.data.result.subs
          let responseString=d.data.result;
          kid=responseString.substring(
            responseString.indexOf('k__id = "')+9,
            responseString.indexOf('"; var video_service')
          );
          fileName=responseString.substring(
            responseString.indexOf('<div class="caption text-left"> <b>')+35,
            responseString.length
          );
          fileName=fileName.substring(
            0,
            fileName.indexOf('</b>')
          );
          fileName=fileName.replace(/\s+/g,'_').replace(/[^a-z0-9]/gi,'-').replace(/--/gi,'')+".mp3";
          this.imgName=fileName;
          let thumbnailUrl="";
          thumbnailUrl=responseString.substring(
            responseString.indexOf('<img src="')+10,
            responseString.indexOf('" alt="')
          );
          this.imgSrc=thumbnailUrl;
          console.log("thumbnailUrl...", thumbnailUrl);
          
          if(kid.length>0){
            resolve({kid,fileName});
          }else{
            reject("Video id not found");
          }
        }
      }).catch(e=>{
        reject(e);
      })
    });
  }

  async showSuccessToast(){
    const toast = await this.toast.create({
      message: 'Downloaded Successfully',
      duration: 2000
    });
    toast.present();
    this.musicTrackService.musicTrackAddedBehaviourSubject.next(true);
    if(this.isInitialLoad){
      this.router.navigateByUrl('home');
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
        
        IonicPlugin.download({fileName});
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
            }
          }
        },100);
        
        
    }, (error) => {
        console.error('error...', error);
    });
  }
}
