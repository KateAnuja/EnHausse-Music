package in.enhausse.music_app;

import android.app.Application;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.getcapacitor.community.fcm.FCMPlugin;
import com.google.firebase.FirebaseApp;


import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  public static BridgeActivity _mainActivity;
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    _mainActivity=this;
    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
      add(IonicPlugin.class);
      add(FCMPlugin.class);

    }});
  }
}
