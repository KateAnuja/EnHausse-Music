package io.enhausse.ytdownloder;

import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

@NativePlugin()
public class IonicPlugin extends Plugin {
  @PluginMethod()
  public void scrapY2Mate(PluginCall call){

    //receive data
    String videoId= call.getString("videoId");

    //send data
    JSObject jsObject=new JSObject();
    jsObject.put("boo","foo");
    jsObject.put("url", videoId);
    call.resolve(jsObject);
  }
}
