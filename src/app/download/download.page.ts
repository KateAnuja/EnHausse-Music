import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { HTTP } from '@ionic-native/http/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { IonRange } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

const { IonicPlugin } = Plugins;


@Component({
  selector: 'app-downlaod',
  templateUrl: 'download.page.html',
  styleUrls: ['download.page.scss'],
})
export class DownloadPage {
  url : string="";
  downloadPercentage : number = 0;
  imgSrc : any;
  imgName : any;
  progress = 0;
  @ViewChild('range', {static : false}) range : IonRange;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HTTP,
    private transfer: FileTransfer, 
    private file: File,
    private toast : ToastController,
    private alert : AlertController,
    private changeDetector : ChangeDetectorRef,
    private platform: Platform,
  ) {
    
  }



  async ionViewWillEnter(){
    let pluginResponse=await IonicPlugin.getSharedLink();
    if(pluginResponse.sharedLink && pluginResponse.sharedLink.length>20){
      this.url=pluginResponse.sharedLink;
      this.verifyUrl();
    }

    this.route.queryParams.subscribe(params => { 
      if(params.videoId && params.videoId.length>0){
        this.scrapY2Mate(params.videoId);
      }
    });
  }

  ionViewDidEnter(){
    
  }

  async verifyUrl(){
    let videoid = this.url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
    if(videoid != null){
      this.downloadPercentage=0.01;
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
        this.downloadPercentage+=0.04;
        let downloadUrl:string=await this.getDownloadUrl(kid,vid);
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
  getDownloadUrl(kid:string,vid:string):Promise<string>{
    return new Promise((resolve,reject)=>{
      this.http.sendRequest(
        'https://www.y2mate.com/mates/convert',
         {
           method:"post",
           data:{
             type:'youtube',
             _id:kid,
             v_id:vid,
             token:"",
             ftype:"mp3",
             fquality:"128",
             ajax:"1"
          },
         serializer:"urlencoded",
         responseType:"json",
         headers:{
           "content-type":"application/x-www-form-urlencoded; charset=UTF-8"
          }
      }).then(d=>{
        if(d.data && d.data.result){
          let downloadUrl="";
          d.data.result.subs
          let responseString=d.data.result;
          downloadUrl=responseString.substring(
            responseString.indexOf('<a href="')+9,
            responseString.indexOf('" rel="nofollow"')
          );
          if(downloadUrl.length>0){
            resolve(downloadUrl);
          }else{
            reject("Download URL not found");
          }
        }
      }).catch(e=>{
        reject(e);
      })
    });
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
      const toast = await this.toast.create({
        message: 'Downloaded Successfully',
        duration: 2000
      });
      toast.present();
      IonicPlugin.download({fileName});
      this.url="";
      this.currentlyDownloading="";
      this.downloadPercentage=0;
      this.lastUpdateValue=0;
      this.lastProgress=0;
      this.router.navigate(['download']);
    }, (error) => {
      console.error('error...', error);
    });

  }

  openSearch(){
    this.router.navigate(['search']);
  }

}
