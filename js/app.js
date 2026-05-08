// Main App Logic - Orchestrates everything

let dataManager;
let uiManager;

// ========== INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', () => {
    setupAuthListeners();
    monitorAuthState();
});

function monitorAuthState() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is logged in
            initializeApp(user);
            showMainScreen();
        } else {
            // User is logged out
            showAuthScreen();
        }
    });
}

async function initializeApp(user) {
    console.log('Initializing app for user:', user.email);

    // Initialize managers
    dataManager = new DataManager(user.uid);
    uiManager = new UIManager(dataManager);

    // Ensure user document exists in Firestore
    await dataManager.ensureUserDoc();

    // Setup UI
    setupUIListeners();
    uiManager.setupTabButtons();
    uiManager.updateUserEmail(user.email);

    // Load initial data
    await uiManager.renderCurrentTask();
}

// ========== AUTH LISTENERS ==========

function setupAuthListeners() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutBtnModal = document.getElementById('logoutBtnModal');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => handleLogin());
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', () => handleSignup());
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => openSettingsModal());
    }

    if (logoutBtnModal) {
        logoutBtnModal.addEventListener('click', () => handleLogout());
    }

    // Enter key on password field
    const authPassword = document.getElementById('authPassword');
    if (authPassword) {
        authPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
    }
}

async function handleLogin() {
      // Wait for Firebase to be ready
      if (!firebaseReady || !auth) {
          showAuthError('Firebase is initializing... please wait a moment and try again');
          return;
      }

      const email = document.getElementById('authEmail').value.trim();
      const password = document.getElementById('authPassword').value;

      if (!email || !password) {
          showAuthError('Please enter email and password');
          return;
      }

      showLoading(true);
      clearAuthError();

      try {
          await auth.signInWithEmailAndPassword(email, password);
      } catch (error) {
          console.error('Login error:', error);
          showAuthError(error.message);
      } finally {
          showLoading(false);
      }
  }

async function handleSignup() {
      // Wait for Firebase to be ready
      if (!firebaseReady || !auth) {
          showAuthError('Firebase is initializing... please wait a moment and try again');
          return;
      }

      const email = document.getElementById('authEmail').value.trim();
      const password = document.getElementById('authPassword').value;

      if (!email || !password) {
          showAuthError('Please enter email and password');
          return;
      }

      if (password.length < 6) {
          showAuthError('Password must be at least 6 characters');
          return;
      }

      showLoading(true);
      clearAuthError();

      try {
          await auth.createUserWithEmailAndPassword(email, password);
      } catch (error) {
          console.error('Signup error:', error);
          showAuthError(error.message);
      } finally {
          showLoading(false);
      }
  }

async function handleLogout() {
    if (confirm('Are you sure you want to sign out?')) {
        showLoading(true);
        try {
            await auth.signOut();
            closeSettingsModal();
        } catch (error) {
            alert('Error signing out: ' + error.message);
        } finally {
            showLoading(false);
        }
    }
}

// ========== UI LISTENERS ==========

function setupUIListeners() {
    // Checklist tab
    document.getElementById('newTaskBtn').addEventListener('click', () => uiManager.onNewTask());
    document.getElementById('renameTaskBtn').addEventListener('click', () => uiManager.onRenameTask());
    document.getElementById('deleteTaskBtn').addEventListener('click', () => uiManager.onDeleteTask());
    document.getElementById('prevTaskBtn').addEventListener('click', () => uiManager.onPreviousTask());
    document.getElementById('nextTaskBtn').addEventListener('click', () => uiManager.onNextTask());
    document.getElementById('clearAllBtn').addEventListener('click', () => uiManager.onClearAll());

    // Template tab
    document.getElementById('addGroupBtn').addEventListener('click', () => uiManager.onAddGroup());
    document.getElementById('addItemBtn').addEventListener('click', () => uiManager.onAddItem());

    // Enter key on new item input
    document.getElementById('newItemInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            uiManager.onAddItem();
        }
    });

    // Real-time listeners for data updates
    setupRealtimeListeners();
}

function setupRealtimeListeners() {
    if (!dataManager) return;

    // Listen for task changes
    dataManager.userDocRef.collection('tasks').orderBy('timestamp', 'desc').limit(1).onSnapshot(() => {
        // Refresh current task display
        uiManager.renderCurrentTask();
    });

    // Listen for template changes
    dataManager.userDocRef.collection('template_groups').onSnapshot(() => {
        // If on template tab, refresh it
        if (document.getElementById('templateTab').classList.contains('active')) {
            uiManager.renderTemplate();
        }
    });
}

// ========== SCREEN MANAGEMENT ==========

function showAuthScreen() {
    document.getElementById('authScreen').classList.add('active');
    document.getElementById('mainScreen').classList.remove('active');

    // Clear form
    document.getElementById('authEmail').value = '';
    document.getElementById('authPassword').value = '';
    clearAuthError();
}

function showMainScreen() {
    document.getElementById('authScreen').classList.remove('active');
    document.getElementById('mainScreen').classList.add('active');
}

// ========== SETTINGS MODAL ==========

function openSettingsModal() {
    document.getElementById('settingsModal').classList.add('active');
}

function closeSettingsModal() {
    document.getElementById('settingsModal').classList.remove('active');
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('settingsModal');
    if (e.target === modal) {
        closeSettingsModal();
    }
});

// ========== DYNAMIC TASK NAME COUNTER ==========

// Update task number counter based on today's tasks
async function updateTaskNumberCounter() {
    if (!dataManager) return;

    const tasks = await dataManager.getTasks();
    const today = new Date().toISOString().split('T')[0];

    const todayCount = tasks.filter(t => t.date === today).length;

    // This would be used when creating new tasks
    return todayCount + 1;
}

// Call this when rendering current task to ensure proper naming
(async () => {
    // Periodically check for updates
    setInterval(async () => {
        if (dataManager && uiManager.currentTaskId) {
            // Keep checking for real-time updates
        }
    }, 30000); // Every 30 seconds
})();
