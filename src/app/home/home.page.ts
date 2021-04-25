import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { HTTP } from '@ionic-native/http/ngx';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  url : string="https://www.youtube.com/watch?v=mt9xg0mmt28";
  constructor(
    private http: HTTP,
    private transfer: FileTransfer, 
    private file: File,
  ) {}


  ionViewDidEnter(){
    this.verifyUrl();
  }

  async verifyUrl(){
    let videoid = this.url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
    if(videoid != null){
      console.log("video id = ",videoid[1]);
      let downloadUrl=await this.scrapY2Mate(videoid[1].toString());
      console.log("downloadUrl",downloadUrl);
    }else{ 
      //TODO: add alert for non youtube url 
      console.log("The youtube url is not valid.");
    }
  }

  async scrapY2Mate(vid:string){
    try{
      let kid:string=await this.getVideoKid(vid);
      let downloadUrl:string=await this.getDownloadUrl(kid,vid);
      console.log("downloadUrl..", downloadUrl);
      this.downloadFromUrl(downloadUrl);
    }catch(err){

    }
  }

  getVideoKid(vid:string):Promise<string>{
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
          d.data.result.subs
          let responseString=d.data.result;
          kid=responseString.substring(
            responseString.indexOf('k__id = "')+9,
            responseString.indexOf('"; var video_service')
          );
          if(kid.length>0){
            resolve(kid);
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

  downloadFromUrl(downloadUrl){
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.download(encodeURI(downloadUrl), this.file.externalDataDirectory + 'file.mp3').then((entry) => {
      console.log('download complete: ' + entry.toURL());
    }, (error) => {
      console.log('error...', error);
    });

  }

}
