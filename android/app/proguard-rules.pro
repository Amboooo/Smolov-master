# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If you keep the line below, uncomment the following line to apply the
# same rules to your test APK.
#-dontobfuscate
#-dontoptimize

# Add any project specific keep options here:

# If your project uses WebView with JS, uncomment the following
# and specify KEEPER_CLASS_NAME accordingly:
#-keepclassmembers class com.example.YourPackageName.YourActivity$MyJavaScriptInterface {
#    @android.webkit.JavascriptInterface <methods>;
#}

# Keep GMS and Firebase stuff
-keep class com.google.android.gms.** { *; }
-keep class com.google.firebase.** { *; }

# Keep application classes that are referenced in the manifest
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Application
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider
-keep public class * extends android.app.backup.BackupAgentHelper
-keep public class * extends android.preference.Preference
-keep public class com.android.vending.licensing.ILicensingService

# Keep any public static final fields that are used by ProGuard.
-keepclassmembers class ** {
    public static final <fields>;
}

# Keep R class and its members
-keep class **.R$* {
    *;
}
