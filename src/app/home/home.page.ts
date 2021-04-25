import { Component, ViewChild } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { HTTP } from '@ionic-native/http/ngx';


import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { IonRange } from '@ionic/angular';

export interface Track{
  name : string;
  path : string;
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  playlist : Track[]=[];
  url : string="";
  activeTrack : Track = null;
  
  isPlaying = false;
  progress = 0;
  @ViewChild('range', {static : false}) range : IonRange;
  constructor(
    private http: HTTP,
    private transfer: FileTransfer, 
    private file: File,
    private toast : ToastController,
  ) {}


  ionViewDidEnter(){
    //this.getFileList();

    for(let i=0;i<10;i++){
      this.playlist.push({
        name:"Song "+(i+1),
        path:""
      });
    }
  }

  async getFileList(){
    let dirs=await this.file.listDir(this.file.externalRootDirectory,"Download");
    dirs.forEach((dir)=>{
      if(dir.isFile && dir.fullPath.indexOf(".mp3")!=-1){
        this.playlist.push({
          name:dir.fullPath.substring(
            dir.fullPath.lastIndexOf("/")+1,
            dir.fullPath.lastIndexOf(".mp3")
          ).replace(/-/gi,' '),
          path:dir.nativeURL
        });
      }
    })
  }

  verifyUrl(){
    let videoid = this.url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
    if(videoid != null){
      this.scrapY2Mate(videoid[1].toString());
    }else{ 
      //TODO: add alert for non youtube url 
      alert("The youtube url is not valid.");
    }
  }

  async scrapY2Mate(vid:string){
    try{
      let {kid,fileName}=await this.getVideoKid(vid);
      let downloadUrl:string=await this.getDownloadUrl(kid,vid);
      this.downloadFromUrl(downloadUrl,fileName);
    }catch(err){

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

  downloadFromUrl(downloadUrl:string,fileName:string){
    const fileTransfer: FileTransferObject = this.transfer.create();
    if(fileName.length<1){
      fileName=+new Date()+".mp3";
    }
    fileTransfer.download(encodeURI(downloadUrl), this.file.externalRootDirectory + '/Download/' + fileName).then(async (entry) => {
      const toast = await this.toast.create({
        message: 'Downloaded Successfully',
        duration: 2000
      });
      toast.present();
      this.url="";
    }, (error) => {
      console.error('error...', error);
    });

  }

  start(track : Track){
    // if(this.player){
    //   this.player.stop();
    // }
    // this.player = new Howl({
    //   src : [track.path],
    //   html5 : true,
    //   onplay: () => {
    //     this.isPlaying = true;
        this.activeTrack = track; 
    //     this.updateProgress();
    //   },
    //   onend: () => {
    //     console.log("onend");
    //   }
    // });
    // this.player.play();
  }

  togglePlayer(pause){
    this.isPlaying = !pause;
    if(pause){
      //this.player.pause();
      this.isPlaying = false;
    }else{
      //this.player.play(); 
      this.isPlaying = true;
    }

  }

  next(){
    let index= this.playlist.indexOf(this.activeTrack);
    if(index != this.playlist.length-1){
      this.start(this.playlist[index+1])
    }else{
      this.start(this.playlist[0]);
    }
  }

  prev(){
    let index= this.playlist.indexOf(this.activeTrack);
    if(index>0){
      this.start(this.playlist[index-1])
    }else{
      this.start(this.playlist[this.playlist.length-1]);
    }

  }

  seek(){
    let newValue= +this.range.value;
    //let duration= this.player.duration();
    //this.player.seek(duration * (newValue/100));
  }

  updateProgress(){
    //let seek= this.player.seek();
    //this.progress= (seek/this.player.duration())*100 || 0;
    setTimeout(()=>{
      this.updateProgress()
    }, 1000);
  }


}
