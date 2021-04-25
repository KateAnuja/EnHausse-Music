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
  // downloadUrl = "http://dl173.y2mate.com/?file=M3R4SUNiN3JsOHJ6WWQ2a3NQS1Y5ZGlxVlZIOCtyZ0NqZGsyakNZcUJhNUQ3Yms2MnErVEpvSm5KK3hFNTR1Z1d1bFJ2aFBkWlp2QUd3NmJzNTBvUXppcTlzWXl0aTJFd0lZaFVjQjFIVDM1aSttc2hIbzlwQWo5ZDh5R05yQlhlSDk2clFzbzR6U2EyUERaOXhqbzREdXJya0dHVXpRTHBqTldlS2YyNkpCZHdYekphcksyOVowVi9tUE54SndNaU5hRTVnejMxN2R3dTlONEZRay9aNFZRNW9udzRQakZta0VNakpVanlVS3FydDJzQjV3S0M2Q2hkREprQVRFQjZPZm1XQ1FWempVUjkzNkIrN3Q4OW1kWmZLMWh1anI2OU9LNklEaWRjWi9mWWRlQk12aTB0TUR0Ni9SazRoQ1g5N3FVeU1nWHpsemhXOEhsUTR4YzRCaDA4L1BTbzk4Z24wV3ZpUT09";
  downloadUrl = "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3";
  constructor(
    private http: HTTP,
    private transfer: FileTransfer, 
    private file: File,
  ) {}


  ionViewDidEnter(){
    // this.verifyUrl();
    this.downloadFromUrl();
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
      // this.downloadFromUrl(downloadUrl);
      console.log("downloadUrl..", downloadUrl);
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

  downloadFromUrl(){
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.download(encodeURI(this.downloadUrl), this.file.dataDirectory + 'file.mp3').then((entry) => {
      console.log('download complete: ' + entry.toURL());
    }, (error) => {
      console.log('error...', error);
    });

  }

}
