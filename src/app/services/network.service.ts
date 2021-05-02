import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor(
    private http : HTTP
  ) { }

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

  
  

}
