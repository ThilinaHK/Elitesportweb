# Elite Sports Academy Mobile App

React Native mobile application for Elite Sports Academy members.

## Features

- **Member Login**: Secure authentication with member ID and password
- **Dashboard**: Overview of classes, payments, notifications, and events
- **Classes**: View assigned classes with details
- **Payments**: Payment history with verification requests
- **Notifications**: Class notifications and alerts
- **Profile**: Member profile management with edit functionality

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Expo CLI globally:
```bash
npm install -g expo-cli
```

3. Start the development server:
```bash
npm start
```

4. Use Expo Go app on your phone to scan the QR code, or run on simulator:
```bash
npm run android  # For Android
npm run ios      # For iOS
```

## API Configuration

Update the `API_BASE` constant in each screen file to point to your backend server:
```javascript
const API_BASE = 'http://your-server-ip:3000/api';
```

## Screens

- **LoginScreen**: Member authentication
- **DashboardScreen**: Main dashboard with stats and quick actions
- **ClassesScreen**: List of member's classes
- **PaymentsScreen**: Payment history and verification
- **NotificationsScreen**: Class notifications
- **ProfileScreen**: Member profile with edit functionality

## Navigation

The app uses React Navigation with:
- Stack Navigator for login flow
- Bottom Tab Navigator for main app screens

## Dependencies

- React Native
- Expo
- React Navigation
- Axios for API calls
- React Native Vector Icons