package in.enhausse.music_app;

import android.app.DownloadManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;
import android.util.Log;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import java.io.File;

import static android.content.Context.DOWNLOAD_SERVICE;

@NativePlugin()
public class IonicPlugin extends Plugin {

  SharedPreferences sharedpreferences;

  @PluginMethod()
  public void sampleFunction(PluginCall call){

    //receive data
    String videoId= call.getString("videoId");

    //send data
    JSObject jsObject=new JSObject();
    jsObject.put("boo","foo");
    jsObject.put("url", videoId);
    call.resolve(jsObject);
  }

  @PluginMethod()
  public void getSharedLink(PluginCall call){
    sharedpreferences = getContext().getSharedPreferences(IntentActivity.SHARED_PREFERENCE_COLLECTION, Context.MODE_PRIVATE);
    String sharedLink=sharedpreferences.getString(IntentActivity.SP_SHARED_TEXT,"");
    SharedPreferences.Editor editor = sharedpreferences.edit();

    editor.putString(IntentActivity.SP_SHARED_TEXT, "");
    editor.apply();
    //send data
    JSObject jsObject=new JSObject();
    jsObject.put("sharedLink",sharedLink);
    call.resolve(jsObject);
  }

  @PluginMethod()
  public void download(PluginCall call){

    String fileName = call.getString("fileName");
    File outputFile = new File(getContext().getExternalCacheDir() + "/Music/", fileName);

    Uri uri = FileProvider.getUriForFile(getContext(), "in.enhausse.music_app.fileprovider", outputFile);

    DownloadManager downloadManager = (DownloadManager) getContext().getSystemService(DOWNLOAD_SERVICE);
    downloadManager.addCompletedDownload(outputFile.getName(), outputFile.getName(), true, "audio/mpeg", outputFile.getAbsolutePath(), outputFile.length(), true);
  }
}
