// Firebase Configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDlJBP3le1ea-aPYaVesc8uvmO_Bxbn5_4",
    authDomain: "checklist-tracker-1d185.firebaseapp.com",
    projectId: "checklist-tracker-1d185",
    storageBucket: "checklist-tracker-1d185.firebasestorage.app",
    messagingSenderId: "75344195188",
    appId: "1:75344195188:web:b7c34cd8956b036774eb21",
    measurementId: "G-T7YTWF56XV"
  };

  // Initialize Firebase - Wait for it to be available
  let db, auth;
  let firebaseReady = false;

  function initFirebase() {
      if (typeof firebase === 'undefined') {
          console.log('Waiting for Firebase SDK...');
          setTimeout(initFirebase, 100); // Wait 100ms and try again
          return;
      }

      try {
          firebase.initializeApp(firebaseConfig);
          auth = firebase.auth();
          db = firebase.firestore();
          firebaseReady = true;
          console.log('✓ Firebase initialized successfully');
      } catch (error) {
          console.error('Firebase initialization error:', error);
      }
  }

  // Start initialization
  initFirebase();

  // Helper: Show/hide loading spinner
  function showLoading(show = true) {
      const spinner = document.getElementById('loadingSpinner');
      if (show) {
          spinner.classList.add('active');
      } else {
          spinner.classList.remove('active');
      }
  }

  // Helper: Show error message
  function showAuthError(message) {
      const errorDiv = document.getElementById('authError');
      if (errorDiv) {
          errorDiv.textContent = message;
      }
  }

  // Helper: Clear error message
  function clearAuthError() {
      const errorDiv = document.getElementById('authError');
      if (errorDiv) {
          errorDiv.textContent = '';
      }
  }