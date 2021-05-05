export class Constants{

  public static STRING_EMPTY_OBJECT="{}";
  public static STRING_EMPTY_ARRAY="[]";
  public static STRING_EMPTY_STRING="";
  public static STRING_PLAYLIST_FAV="__favourite";
  public static STRING_WORD_ALL="All Music";
  public static STRING_WORD_FAVOURITE="Favourites";
  public static USER_AGENT="Mozilla/5.0 (Linux; Android 6.0.1; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Mobile Safari/537.36";
  public static STRING_INITIAL_LOAD_SEARCH = "hindi t series songs ";

  public static DB = {
    DB_NAME:"v1/__enh_music_app",
    MODEL_PLAYLIST:"playlist",
    MODEL_MUSIC_TRACK:"music_track",
    MODEL_LAST_MUSIC_TRACK:"last_music_track",
    COUNT_FAVOURITE:"count_favourite",
    MUSIC_PREFERENCE_ORDER:"__music_order_preference"
  }

  public static SONG_WORD_ARRAY = [
    "tere", "naina", "rab", "dil", 
    "tu", "jaane", "kyu", "log" , 
    "aankhien", "pyaar", "mere", 
    "aap", "hum", "tum", "muzse",
    "pahle", "naach", "jaan",
    "maula", "de", "sanam",
    "dhokebaaz", "dard", "dukh",
    "dhoka", "roya", "aassu",
    "bewafa", "layak", "nahi",
    "bhool", "mayus", "massom",
    "noor", "channd", "intezaar",
    "fizzaye"
  ];

  public static TUMBNAIL_ARRAY = [
    "https://i.ytimg.com/vi/T-g39o0rDos/hq720.jpg?sqp=-oaymwEcCK4FEIIDSEbyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLC35NwIuxuwu-qT_x1QtInPE1e-0A",
    "https://i.ytimg.com/vi/s3H6PmB4SZ4/hq720.jpg?sqp=-oaymwEcCK4FEIIDSEbyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBzJX0iVdLr316Jx_j1CgsRPcJkbg",
    "https://i.ytimg.com/vi/KF5gdofOO2k/hq720.jpg?sqp=-oaymwEcCK4FEIIDSEbyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCIOUTm-KT0Jvr5ksP8wjaMiroh7A",
    "https://i.ytimg.com/vi/5RluSnRPRbI/hq720.jpg?sqp=-oaymwEcCK4FEIIDSEbyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDSGo4A6nR64bMS4_GgrEYWmBWuZQ",
    "https://i.ytimg.com/vi/D6K8uxeUAAM/hq720.jpg?sqp=-oaymwEcCK4FEIIDSEbyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBPjCZK4jDtquicOpE3R4GqJS_KBA",
    "https://i.ytimg.com/vi/epH4QvLUXlY/hq720.jpg?sqp=-oaymwEcCK4FEIIDSEbyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLB8KY6av63t282-mIoy3Y0VGsYiAw",
    "https://i.ytimg.com/vi/ZPqzea9bU1c/hq720.jpg?sqp=-oaymwEcCK4FEIIDSEbyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCv9Nslkcvk7spXgoncAqKdNaBfcQ",
    "https://i.ytimg.com/vi/qkxuFKqJXWY/hq720.jpg?sqp=-oaymwEcCK4FEIIDSEbyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAqRwQH2SBBU2ZWKx_KvalkmLPnxQ",
    "https://i.ytimg.com/vi/30tnmyzgRSI/hq720.jpg?sqp=-oaymwEcCK4FEIIDSEbyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDn2Y7ao8sVCQi25VO8T4fP-Z1SNg",
    "https://i.ytimg.com/vi/0Kl1ucZuSZ8/hq720.jpg?sqp=-oaymwEcCK4FEIIDSEbyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBH5CoLSD42s-m6zAhDW-Pcm9LTzQ",
    "https://i.ytimg.com/vi/0ZiSjFj8tMI/hq720.jpg?sqp=-oaymwEcCK4FEIIDSEbyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCup46-qcvlup-YP9MTkPi12uxEOA",
    "https://i.ytimg.com/vi/DK_UsATwoxI/hq720.jpg?sqp=-oaymwEcCK4FEIIDSEbyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCvQeW96UALbch3P8QKVgNJBmidxw",
    "https://i.ytimg.com/vi/-ZGIN1wLux4/hq720.jpg?sqp=-oaymwEcCK4FEIIDSEbyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAn-G2cq5nUypaOtxiAcWA5ySalAg",
    "https://i.ytimg.com/vi/CEkbq13Sk3w/hq720.jpg?sqp=-oaymwEcCK4FEIIDSEbyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBDrwOcO03LKLHVBDZity6-hT_CNA",
    "https://i.ytimg.com/vi/2228O5t62VQ/hq720.jpg?sqp=-oaymwEcCK4FEIIDSEbyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBDq1f_yhzMrtouizD8xMSJlXmAcg",
    "https://i.ytimg.com/vi/Xn7KWR9EOGQ/hq720.jpg?sqp=-oaymwEcCK4FEIIDSEbyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAXDR_UCOsbdGA7RcMNvJ53Y8Kzkg"
  ];
}