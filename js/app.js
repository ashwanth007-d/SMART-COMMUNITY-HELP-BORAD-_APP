// js/app.js
class App {
  constructor() {
    this.appEl = document.getElementById('app');
    this.topNav = document.getElementById('top-nav');
    this.bottomNav = document.getElementById('bottom-nav');
    this.currentView = 'login';
    this.currentTaskId = null;
    this.tasksActiveTab = 'active';
    this.history = [];

    this.init();
  }

  init() {
    store.init();
    this.setupGlobalListeners();
    this.startNotificationSimulation();
    this.initVoiceChat();
    
    // Check auth
    if (store.getCurrentUser()) {
      this.navigate('home');
    } else {
      this.navigate('login');
    }
  }

  startNotificationSimulation() {
    if (this.notificationTimer) clearInterval(this.notificationTimer);
    
    const messages = [
      "New urgent request nearby 📍",
      "Priya just completed a task! 🎉",
      "Someone offered to help you.",
      "A new neighbor joined ICOMHELP.",
      "Your rating is in the top 1% 🌟"
    ];

    this.notificationTimer = setInterval(() => {
      if (!store.getCurrentUser() || this.currentView === 'login' || this.currentView === 'signup') return;
      
      const msg = messages[Math.floor(Math.random() * messages.length)];
      this.showToast(msg, 'info');

      const badge = document.getElementById('bell-badge');
      if (badge) {
        badge.classList.remove('hidden');
        badge.innerText = (parseInt(badge.innerText) || 0) + 1;
      }
    }, 8000);
  }

  setupGlobalListeners() {
    // Bottom Navigation
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const target = item.getAttribute('data-target');
        if (target) this.navigate(target);
      });
    });

    // Bell mock notification
    document.getElementById('notification-bell').addEventListener('click', () => {
      const badge = document.getElementById('bell-badge');
      if (badge && !badge.classList.contains('hidden')) {
        badge.classList.add('hidden');
        badge.innerText = '0';
        this.showToast('You are caught up on all notifications!', 'success');
      } else {
        this.showToast('You have no new notifications.', 'info');
      }
    });

    // Global back button
    document.getElementById('nav-back').addEventListener('click', () => {
      if (this.history.length > 0) {
        const last = this.history.pop();
        this.navigate(last.view, last.data, true);
      }
    });

    // Top Right Profile Icon
    document.getElementById('nav-profile').addEventListener('click', () => {
      this.navigate('profile');
    });
  }

  updateNavUI(view) {
    if (view === 'login' || view === 'signup') {
      this.topNav.classList.add('hidden');
      this.bottomNav.classList.add('hidden');
    } else {
      this.topNav.classList.remove('hidden');
      this.bottomNav.classList.remove('hidden');
      
      const user = store.getCurrentUser();
      if (user) {
        document.getElementById('nav-avatar').src = `https://ui-avatars.com/api/?name=${user.name}&background=2563EB&color=fff`;
      }
      
      // Update active state in bottom nav
      const navItems = document.querySelectorAll('.bottom-nav .nav-item');
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-target') === view) {
          item.classList.add('active');
        }
      });

      const btnBack = document.getElementById('nav-back');
      const logoIcon = document.getElementById('nav-logo-icon');
      if (this.history.length > 0 && view !== 'home') {
        btnBack.classList.remove('hidden');
        logoIcon.classList.add('hidden');
      } else {
        btnBack.classList.add('hidden');
        logoIcon.classList.remove('hidden');
        if (view === 'home' || view === 'explore' || view === 'tasks' || view === 'profile') {
          this.history = []; // Clear history on main tabs
        }
      }
    }
  }

  navigate(view, data = null, isBack = false) {
    if (!isBack && this.currentView && this.currentView !== 'login' && this.currentView !== 'signup') {
      if (this.currentView !== view) {
        this.history.push({ view: this.currentView, data: this.currentTaskId });
      }
    }
    
    this.currentView = view;
    this.updateNavUI(view);

    // Render View
    if (view === 'login') this.appEl.innerHTML = views.login();
    else if (view === 'signup') this.appEl.innerHTML = views.signup();
    else if (view === 'home') this.appEl.innerHTML = views.home();
    else if (view === 'explore') this.appEl.innerHTML = views.explore();
    else if (view === 'post') this.appEl.innerHTML = views.post();
    else if (view === 'tasks') this.appEl.innerHTML = views.tasks(this.tasksActiveTab);
    else if (view === 'profile') this.appEl.innerHTML = views.profile();
    else if (view === 'editProfile') this.appEl.innerHTML = views.editProfile();
    else if (view === 'taskDetails') {
      this.currentTaskId = data;
      this.appEl.innerHTML = views.taskDetails(data);
    }
    
    // Attach listeners for newly rendered view
    this.attachViewListeners(view);
    window.scrollTo(0, 0);
  }

  attachViewListeners(view) {
    if (view === 'login') {
      document.getElementById('go-to-signup').addEventListener('click', (e) => {
        e.preventDefault();
        this.navigate('signup');
      });
      document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pwd = document.getElementById('login-password').value;
        if (store.login(email, pwd)) {
          this.showToast('Logged in successfully', 'success');
          this.navigate('home');
        } else {
          this.showToast('Invalid credentials. Try example@gmail.com / clay', 'error');
        }
      });
      
      // Allow enter key to submit login when focused on password
      document.getElementById('login-password').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const email = document.getElementById('login-email').value;
          const pwd = document.getElementById('login-password').value;
          if (store.login(email, pwd)) {
             this.showToast('Logged in successfully', 'success');
             this.navigate('home');
          } else {
             this.showToast('Invalid credentials. Try example@gmail.com / clay', 'error');
          }
        }
      });
    }

    if (view === 'signup') {
      document.getElementById('go-to-login').addEventListener('click', (e) => {
        e.preventDefault();
        this.navigate('login');
      });
      document.getElementById('signup-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const pwd = document.getElementById('signup-password').value;
        if (store.signup(name, email, pwd)) {
          this.showToast('Account created successfully', 'success');
          this.navigate('home');
        } else {
          this.showToast('Email already exists', 'error');
        }
      });
    }

    if (view === 'home') {
      document.getElementById('btn-request-help').addEventListener('click', () => {
        this.navigate('post');
      });
      document.getElementById('btn-offer-help').addEventListener('click', () => {
        this.navigate('explore');
      });
      document.getElementById('btn-view-all').addEventListener('click', (e) => {
        e.preventDefault();
        this.navigate('explore');
      });

      const btnMyLocation = document.getElementById('btn-my-location');
      if (btnMyLocation) {
        btnMyLocation.addEventListener('click', () => {
          if (navigator.geolocation) {
            this.showToast('Fetching location...', 'info');
            navigator.geolocation.getCurrentPosition(async (pos) => {
              const lat = pos.coords.latitude;
              const lon = pos.coords.longitude;
              try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                const data = await res.json();
                
                let addressStr = '';
                if (data && data.address) {
                  const parts = [
                    data.address.road || data.address.pedestrian,
                    data.address.suburb || data.address.neighbourhood || data.address.village,
                    data.address.city || data.address.town || data.address.county,
                    data.address.state
                  ].filter(Boolean);
                  addressStr = parts.join(', ');
                }
                
                if (addressStr) {
                  alert(`Your Location:\n${addressStr}\n\n(Lat: ${lat.toFixed(4)}, Lng: ${lon.toFixed(4)})`);
                } else {
                  alert(`Your Location:\nLat: ${lat}\nLng: ${lon}`);
                }
                this.showToast('Location fetched successfully!', 'success');
              } catch (e) {
                alert(`Your Location:\nLat: ${lat}\nLng: ${lon}`);
                this.showToast('Failed to fetch address details.', 'error');
              }
            }, () => {
              this.showToast('Location access denied or failed.', 'error');
            });
          } else {
            alert("Location not supported");
          }
        });
      }

      this.attachTaskCardListeners();
    }

    if (view === 'explore') {
      this.attachTaskCardListeners();
      
      // Simple Search Mock
      const searchInput = document.getElementById('task-search');
      searchInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.task-card');
        cards.forEach(card => {
          const txt = card.innerText.toLowerCase();
          card.style.display = txt.includes(val) ? 'block' : 'none';
        });
      });

      // Voice Search Support
      const btnMicSearch = document.getElementById('btn-mic-search');
      if (btnMicSearch) {
        btnMicSearch.addEventListener('click', () => {
          this.startSpeechRecognition('task-search');
        });
      }
    }

    if (view === 'post') {
      const btnGetLoc = document.getElementById('btn-get-location');
      if (btnGetLoc) {
        btnGetLoc.addEventListener('click', () => {
          const input = document.getElementById('post-location');
          input.value = "Locating...";
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
              try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
                const data = await res.json();
                input.value = data.address.city || data.address.county || data.address.state || "Current Location";
              } catch (e) {
                input.value = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
              }
            }, () => {
              input.value = "Location Access Denied";
            });
          } else {
            input.value = "Not Supported";
          }
        });
      }

      // Voice Description Support
      const btnMicDesc = document.getElementById('btn-mic-desc');
      if (btnMicDesc) {
        btnMicDesc.addEventListener('click', () => {
          this.startSpeechRecognition('post-desc');
        });
      }

      document.getElementById('post-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const taskData = {
          title: document.getElementById('post-title').value,
          category: document.getElementById('post-category').value,
          location: document.getElementById('post-location').value,
          urgency: document.getElementById('post-urgency').value,
          description: document.getElementById('post-desc').value
        };
        store.addTask(taskData);
        this.showToast('Request posted successfully!', 'success');
        this.navigate('tasks');
      });
    }

    if (view === 'tasks') {
      const tabs = document.querySelectorAll('.tabs .tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
          this.tasksActiveTab = e.target.getAttribute('data-tab');
          this.navigate('tasks');
        });
      });
      this.attachTaskCardListeners();
    }

    if (view === 'profile') {
      const btnEditProfile = document.getElementById('btn-edit-profile');
      if (btnEditProfile) {
        btnEditProfile.addEventListener('click', () => {
          this.navigate('editProfile');
        });
      }

      document.getElementById('btn-logout').addEventListener('click', () => {
        store.logout();
        this.navigate('login');
      });
    }

    if (view === 'editProfile') {
      const btnBackProfile = document.getElementById('btn-back-profile');
      if (btnBackProfile) {
        btnBackProfile.addEventListener('click', (e) => {
          e.preventDefault();
          this.navigate('profile');
        });
      }

      const form = document.getElementById('edit-profile-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = document.getElementById('edit-name').value;
          const email = document.getElementById('edit-email').value;
          const user = store.getCurrentUser();
          
          if (store.updateUser(user.id, name, email)) {
            this.showToast('Profile updated successfully!', 'success');
            this.updateNavUI('profile'); // Refresh avatar
            this.navigate('profile');
          } else {
            this.showToast('Failed to update profile. Email might be in use.', 'error');
          }
        });
      }
    }

    if (view === 'taskDetails') {
      const btnBack = document.getElementById('btn-back');
      if (btnBack) {
        btnBack.addEventListener('click', (e) => {
          e.preventDefault();
          this.navigate('explore'); 
        });
      }

      const btnAccept = document.getElementById('btn-accept-task');
      if (btnAccept) {
        btnAccept.addEventListener('click', () => {
          const taskId = btnAccept.getAttribute('data-id');
          const user = store.getCurrentUser();
          store.updateTaskStatus(taskId, 'in-progress', user.id);
          this.showToast('Task Accepted. Good luck!', 'success');
          this.navigate('taskDetails', taskId);
        });
      }

      const btnComplete = document.getElementById('btn-complete-task');
      if (btnComplete) {
        btnComplete.addEventListener('click', () => {
          const taskId = btnComplete.getAttribute('data-id');
          store.updateTaskStatus(taskId, 'completed');
          this.showToast('Task Marked as Completed!', 'success');
          this.navigate('taskDetails', taskId);
        });
      }
    }
  }

  attachTaskCardListeners() {
    const cards = document.querySelectorAll('.task-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        this.navigate('taskDetails', id);
      });
    });
  }

  startSpeechRecognition(targetInputId) {
    if (!('webkitSpeechRecognition' in window)) {
      this.showToast('Speech Recognition is not supported in this browser.', 'error');
      return;
    }
    
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "ta-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      this.showToast('Listening for Tamil speech...', 'info');
      // Visual feedback
      const micBtns = document.querySelectorAll('.fa-microphone');
      micBtns.forEach(icon => {
        icon.classList.add('fa-beat-fade');
        icon.style.color = 'var(--primary-blue)';
      });
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const targetInput = document.getElementById(targetInputId);
      if (targetInput) {
        if(targetInput.tagName === 'TEXTAREA') {
          targetInput.value = targetInput.value + (targetInput.value ? ' ' : '') + transcript;
        } else {
          targetInput.value = transcript;
          targetInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
      this.showToast('Speech recognized!', 'success');
    };
    
    recognition.onerror = (event) => {
      this.showToast('Error listening: ' + event.error, 'error');
    };

    recognition.onend = () => {
      const micBtns = document.querySelectorAll('.fa-microphone');
      micBtns.forEach(icon => {
        icon.classList.remove('fa-beat-fade');
        icon.style.color = '';
      });
    };
    
    recognition.start();
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let icon = '<i class="fa-solid fa-info-circle"></i>';
    if (type === 'success') icon = '<i class="fa-solid fa-check-circle" style="color:var(--primary-green)"></i>';
    else if (type === 'error') icon = '<i class="fa-solid fa-triangle-exclamation" style="color:#EF4444"></i>';

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'fadeIn 0.3s ease reverse forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  initVoiceChat() {
    const fab = document.getElementById('chatbot-fab');
    const panel = document.getElementById('chatbot-panel');
    const closeBtn = document.getElementById('close-chat');
    const micBtn = document.getElementById('chat-mic-btn');
    const sendBtn = document.getElementById('chat-send-btn');
    const textInput = document.getElementById('chat-text-input');
    const langSelect = document.getElementById('chat-lang');

    if (!fab || !panel) return;

    fab.addEventListener('click', () => {
      panel.classList.toggle('hidden');
    });

    closeBtn.addEventListener('click', () => {
      panel.classList.add('hidden');
      window.speechSynthesis.cancel();
    });

    if (micBtn) {
      micBtn.addEventListener('click', () => {
        this.startChatSpeechRecognition();
      });
    }

    if (textInput && sendBtn) {
      textInput.addEventListener('input', () => {
        if (textInput.value.trim().length > 0) {
          micBtn.classList.add('hidden');
          sendBtn.classList.remove('hidden');
        } else {
          micBtn.classList.remove('hidden');
          sendBtn.classList.add('hidden');
        }
      });

      const handleSend = () => {
        const text = textInput.value.trim();
        if (text) {
          this.addChatMessage(text, 'user');
          const lang = langSelect ? langSelect.value : 'en-US';
          this.processChatInput(text, lang);
          textInput.value = '';
          micBtn.classList.remove('hidden');
          sendBtn.classList.add('hidden');
        }
      };

      sendBtn.addEventListener('click', handleSend);
      textInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
      });
    }
  }

  startChatSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
      this.showToast('Speech Recognition is not supported in this browser.', 'error');
      return;
    }

    const langSelect = document.getElementById('chat-lang');
    const lang = langSelect ? langSelect.value : 'en-US';

    const recognition = new webkitSpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;

    const micBtn = document.getElementById('chat-mic-btn');

    recognition.onstart = () => {
      micBtn.classList.add('listening');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      this.addChatMessage(transcript, 'user');
      this.processChatInput(transcript, lang);
    };

    recognition.onerror = (event) => {
      this.showToast('Voice error: ' + event.error, 'error');
      micBtn.classList.remove('listening');
    };

    recognition.onend = () => {
      micBtn.classList.remove('listening');
    };

    recognition.start();
  }

  processChatInput(text, lang) {
    let responseText = '';
    const lowerText = text.toLowerCase();

    if (lang === 'en-US') {
      if (lowerText.includes('post') || lowerText.includes('request')) {
        responseText = "To post a request for help, tap the 'Request Help' button on the Home screen or use the plus icon in the bottom menu.";
      } else if (lowerText.includes('nearby') || lowerText.includes('offer')) {
        responseText = "To see who needs help nearby, go to the Explore tab by tapping the compass icon.";
      } else if (lowerText.includes('location')) {
        responseText = "You can view your location by tapping the 'View Current Location' button on the home dashboard.";
      } else if (lowerText.includes('hello') || lowerText.includes('hi ')) {
        responseText = "Hello! I am your ICOMHELP AI. How can I support you today?";
      } else {
        responseText = "I'm not quite sure. You can ask me how to post a request, offer help, or find your location.";
      }
    } else {
      if (lowerText.includes('உதவி') || lowerText.includes('கேட்க')) {
        responseText = "உதவி கேட்க, முகப்புத் திரையில் உள்ள Request Help பட்டனை அழுத்தவும்.";
      } else if (lowerText.includes('பக்கம்') || lowerText.includes('கொடுக்க')) {
        responseText = "அருகில் யாருக்கு உதவி தேவை என்பதைப் பார்க்க, Explore பகுதிக்குச் செல்லவும்.";
      } else {
        responseText = "உங்களுக்கு எப்படி உதவுவது என்று எனக்குத் தெரியவில்லை. உதவி கேட்பது பற்றி மீண்டும் கேட்கவும்.";
      }
    }

    setTimeout(() => {
      this.addChatMessage(responseText, 'bot');
      this.speakText(responseText, lang);
    }, 600);
  }

  addChatMessage(text, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.textContent = text;
    messagesContainer.appendChild(bubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  speakText(text, lang) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); 

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    
    // Ensure voices are loaded
    let voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const preferredVoice = voices.find(v => v.lang.startsWith(lang) && (v.name.includes('Google') || v.name.includes('Natural')));
      if (preferredVoice) utterance.voice = preferredVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  }
}

// Initialize the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
