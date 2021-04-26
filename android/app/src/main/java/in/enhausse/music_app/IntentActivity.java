package in.enhausse.music_app;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;

public class IntentActivity extends AppCompatActivity {
  public static String SHARED_PREFERENCE_COLLECTION="__YT-Download";
  public static String SP_SHARED_TEXT="_sharedText";

  SharedPreferences sharedpreferences;
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_intent);
    sharedpreferences = getSharedPreferences(IntentActivity.SHARED_PREFERENCE_COLLECTION, Context.MODE_PRIVATE);

    Intent intent = getIntent();
    String action = intent.getAction();
    String type = intent.getType();
    if (Intent.ACTION_SEND.equals(action) && type != null) {
      if ("text/plain".equals(type)) {
        String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
        if (sharedText != null) {
          SharedPreferences.Editor editor = sharedpreferences.edit();
          editor.putString(IntentActivity.SP_SHARED_TEXT, sharedText);
          editor.apply();
        }
      }
    }
    Intent _mainActivityIntent=new Intent(this,MainActivity.class);
    startActivity(_mainActivityIntent);
    finish();
  }
}
