@echo off
echo Building Elite Sports Academy APK...
echo.

REM Check if Android SDK is available
if not exist "%ANDROID_HOME%\build-tools" (
    echo Android SDK not found. Please install Android Studio first.
    echo Download from: https://developer.android.com/studio
    pause
    exit /b 1
)

REM Build the APK
echo Building APK...
call gradlew assembleRelease

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ APK built successfully!
    echo Location: app\build\outputs\apk\release\app-release.apk
    echo.
    echo You can now install this APK on your Android device.
) else (
    echo.
    echo ❌ Build failed. Please check the error messages above.
)

pause