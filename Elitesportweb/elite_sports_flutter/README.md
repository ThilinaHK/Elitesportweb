# Elite Sports Academy - Flutter Mobile App

A comprehensive Flutter mobile application for Elite Sports Academy members to manage their fitness journey.

## Features

### 🏠 Dashboard
- Welcome screen with member information
- Quick stats overview (classes, payments, notifications)
- Quick access to diet and exercise plans
- Modern gradient UI design

### 👤 Profile Management
- View and edit personal information
- Profile picture support
- Medical conditions tracking
- Emergency contact management

### 🏋️ Classes
- View enrolled classes
- Class schedules and timings
- Instructor information
- Class type categorization (CrossFit, Karate, Zumba)

### 💳 Payments
- Payment history tracking
- Payment verification requests
- Status indicators (verified, pending, disputed)
- Monthly payment tracking

### 🔔 Notifications
- Class notifications
- Recent notification highlighting
- Chronological sorting
- Read/unread status

### 🍎 Diet Plans
- Personalized nutrition plans
- Meal-wise food recommendations
- Calorie tracking
- Special dietary instructions

### 💪 Exercise Plans
- Custom workout routines
- Exercise details (sets, reps, weight, duration)
- Exercise instructions
- Progress tracking

## Technical Stack

- **Framework**: Flutter 3.0+
- **Language**: Dart
- **State Management**: StatefulWidget
- **HTTP Client**: http package
- **Local Storage**: shared_preferences
- **Date Formatting**: intl package
- **Image Caching**: cached_network_image

## Project Structure

```
lib/
├── main.dart                 # App entry point
├── models/                   # Data models
│   ├── member.dart
│   ├── class_model.dart
│   ├── payment.dart
│   ├── notification.dart
│   ├── diet_plan.dart
│   └── exercise_plan.dart
├── screens/                  # UI screens
│   ├── login_screen.dart
│   ├── dashboard_screen.dart
│   ├── profile_screen.dart
│   ├── classes_screen.dart
│   ├── payments_screen.dart
│   ├── notifications_screen.dart
│   ├── diet_plan_screen.dart
│   └── exercise_plan_screen.dart
├── services/                 # Business logic
│   ├── auth_service.dart
│   └── api_service.dart
└── widgets/                  # Reusable components
```

## API Integration

The app integrates with the Elite Sports Academy backend API:

- **Base URL**: `http://localhost:3000/api`
- **Authentication**: Session-based with member ID storage
- **Endpoints**:
  - `/auth/login` - Member authentication
  - `/members/{id}` - Member profile data
  - `/member-classes/{id}` - Member's enrolled classes
  - `/member-payments/{id}` - Payment history
  - `/member-notifications/{id}` - Notifications
  - `/member-diet/{id}` - Diet plans
  - `/member-exercises/{id}` - Exercise plans

## Getting Started

### Prerequisites
- Flutter SDK 3.0 or higher
- Dart SDK 3.0 or higher
- Android Studio / VS Code
- Elite Sports Academy backend server running

### Installation

1. **Clone the repository**
   ```bash
   cd elite_sports_flutter
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Configure API endpoint**
   Update the `baseUrl` in `lib/services/api_service.dart` if needed:
   ```dart
   static const String baseUrl = 'http://your-server:3000/api';
   ```

4. **Run the app**
   ```bash
   flutter run
   ```

## Build Instructions

### Android APK
```bash
flutter build apk --release
```

### iOS IPA (requires macOS and Xcode)
```bash
flutter build ios --release
```

## Features in Detail

### Authentication
- Secure login with email/password
- Session persistence using SharedPreferences
- Automatic logout on session expiry

### Responsive Design
- Optimized for various screen sizes
- Material Design 3 components
- Gradient backgrounds and modern UI elements

### Offline Support
- Local data caching
- Graceful error handling
- Retry mechanisms for failed requests

### Performance
- Lazy loading of images
- Efficient list rendering
- Minimal API calls with data caching

## Configuration

### Environment Variables
Create a `.env` file in the root directory:
```
API_BASE_URL=http://localhost:3000/api
```

### App Icons and Splash Screen
- Place app icons in `android/app/src/main/res/` directories
- Configure splash screen in `android/app/src/main/res/drawable/`

## Testing

Run unit tests:
```bash
flutter test
```

Run integration tests:
```bash
flutter drive --target=test_driver/app.dart
```

## Deployment

### Android Play Store
1. Build release APK
2. Sign with release keystore
3. Upload to Play Console

### iOS App Store
1. Build release IPA
2. Archive in Xcode
3. Upload to App Store Connect

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Email: support@elitesportsacademy.com
- Phone: +94 XX XXX XXXX

## Version History

- **v1.0.0** - Initial release with core features
  - Member authentication
  - Dashboard with stats
  - Profile management
  - Classes, payments, notifications
  - Diet and exercise plans