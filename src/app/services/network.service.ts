import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Constants } from '../util/constants';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor(
    private http : HTTP
  ) { }

  getSuggestion(term:string){
    return new Promise((resolve,reject)=>{
      let suggestionArray=[];
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
              suggestionArray.push(
                sugEl[0]
                .replace(
                  /song /g,
                  Constants.STRING_EMPTY_STRING
                )
              )
            });
            
            resolve(suggestionArray);
          }else{
            reject();
          }
        }catch(err){
          reject(err)
        }
        
      })
    })
  }
  getSearchResults(term:string){
    return new Promise((resolve,reject)=>{
    
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
    let searchResultArray=[];
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
              searchResultArray.push({
                title,
                thumbnail,
                videoId,
                duration
              })
            }
          });
          
        }catch(err){
          
        }
        resolve(searchResultArray);
      }).catch((err)=>{
        console.error(err);
        reject(err);
      });

    })
  }

  getVideoKid(vid:string){
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
          let thumbnailUrl="";
          thumbnailUrl=responseString.substring(
            responseString.indexOf('<img src="')+10,
            responseString.indexOf('" alt="')
          );
          
          if(kid.length>0){
            resolve({kid,fileName,thumbnailUrl});
          }else{
            reject("Video id not found");
          }
        }else{
          reject();
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

  
  

}
