// js/components.js
const views = {
  login() {
    return `
      <div class="auth-container">
        <div class="auth-card card">
          <div class="auth-logo">
            <i class="fa-solid fa-hands-holding-circle"></i>
          </div>
          <h2 class="auth-title">Welcome to <span style="color: black;">ICOMHELP</span></h2>
          <p class="auth-subtitle">Log in to offer or request help</p>
          
          <form id="login-form">
            <div class="form-group">
              <label class="floating">Email</label>
              <div class="input-with-icon">
                <i class="fa-regular fa-envelope"></i>
                <input type="email" id="login-email" class="form-control" placeholder="example@gmail.com" required>
              </div>
            </div>
            
            <div class="form-group">
              <label class="floating">Password</label>
              <div class="input-with-icon">
                <i class="fa-solid fa-lock"></i>
                <input type="password" id="login-password" class="form-control" placeholder="••••••••" required>
              </div>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block">Login</button>
          </form>
          
          <div class="auth-switch">
            Don't have an account? <a href="#" id="go-to-signup">Sign up</a>
          </div>
        </div>
      </div>
    `;
  },

  signup() {
    return `
      <div class="auth-container">
        <div class="auth-card card">
          <div class="auth-logo">
            <i class="fa-solid fa-hands-holding-circle"></i>
          </div>
          <h2 class="auth-title">Join <span style="color: black;">ICOMHELP</span></h2>
          <p class="auth-subtitle">Create an account to start helping</p>
          
          <form id="signup-form">
            <div class="form-group">
              <label class="floating">Full Name</label>
              <div class="input-with-icon">
                <i class="fa-regular fa-user"></i>
                <input type="text" id="signup-name" class="form-control" placeholder="John Doe" required>
              </div>
            </div>

            <div class="form-group">
              <label class="floating">Email</label>
              <div class="input-with-icon">
                <i class="fa-regular fa-envelope"></i>
                <input type="email" id="signup-email" class="form-control" placeholder="example@mail.com" required>
              </div>
            </div>
            
            <div class="form-group">
              <label class="floating">Password</label>
              <div class="input-with-icon">
                <i class="fa-solid fa-lock"></i>
                <input type="password" id="signup-password" class="form-control" placeholder="••••••••" required>
              </div>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block">Sign Up</button>
          </form>
          
          <div class="auth-switch">
            Already have an account? <a href="#" id="go-to-login">Login</a>
          </div>
        </div>
      </div>
    `;
  },

  home() {
    const user = store.getCurrentUser();
    // Sort tasks to show nearby/recent ones. Mock implementation logic.
    const allTasks = store.getTasks().filter(t => t.status === 'pending');
    // For demo prioritize high urgency
    allTasks.sort((a,b) => (a.urgency==='high'? -1 : 1));
    const recentTasksHtml = allTasks.slice(0, 3).map(this.renderTaskCard).join('');

    return `
      <div class="view home-view">
        <div class="stats-container">
          <div class="stat-card">
            <div class="stat-icon stat-blue"><i class="fa-solid fa-check"></i></div>
            <div class="stat-info">
              <h4>${user.tasksCompleted}</h4>
              <p>Tasks Done</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon stat-green"><i class="fa-solid fa-users"></i></div>
            <div class="stat-info">
              <h4>${user.peopleHelped}</h4>
              <p>People Helped</p>
            </div>
          </div>
        </div>

        <div class="action-cards">
          <div class="action-card request" id="btn-request-help">
            <i class="fa-solid fa-hand-holding-hand"></i>
            <span>Request Help</span>
          </div>
          <div class="action-card offer" id="btn-offer-help">
            <i class="fa-solid fa-handshake-angle"></i>
            <span>Offer Help</span>
          </div>
        </div>

        <div class="action-card" id="btn-my-location" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); margin-bottom: 24px; padding: 16px 24px; flex-direction: row; gap: 16px; justify-content: center;">
          <i class="fa-solid fa-location-crosshairs" style="font-size: 1.5rem;"></i>
          <span>View Current Location</span>
        </div>

        <!-- Ad Banner -->
        <div class="ad-banner" style="background: linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%); margin-bottom: 24px; padding: 20px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-md); color: #333; text-align: center; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; font-size: 5rem;"><i class="fa-solid fa-bullhorn"></i></div>
          <span style="background: rgba(255,255,255,0.8); padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; color: #E91E63; margin-bottom: 12px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">Events & Offers</span>
          <h3 style="margin-bottom: 8px; font-size: 1.3rem; color: #880E4F;"><i class="fa-solid fa-microphone-lines"></i> Pongal Speech Competition</h3>
          <p style="font-size: 0.95rem; margin-bottom: 16px; font-weight: 500; color: #5D4037;">Celebrate the spirit of Pongal! Organized by Shibiskisha Apartments.</p>
          <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 16px;">
            <div style="background: rgba(255,255,255,0.6); padding: 8px 12px; border-radius: 8px; font-size: 0.85rem;"><i class="fa-solid fa-calendar-day"></i> Jan 14th</div>
            <div style="background: rgba(255,255,255,0.6); padding: 8px 12px; border-radius: 8px; font-size: 0.85rem;"><i class="fa-solid fa-location-dot"></i> Clubhouse</div>
          </div>
          <button class="btn" style="background: #E91E63; color: white; border: none; padding: 8px 24px; border-radius: var(--border-radius-sm); font-weight: 600; box-shadow: 0 4px 10px rgba(233, 30, 99, 0.3); transition: transform 0.2s;">Register Now</button>
        </div>

        <div class="section-head">
          <h3>Nearby Requests</h3>
          <a href="#" class="view-all" id="btn-view-all">View All</a>
        </div>
        
        <div class="feed-container">
          ${recentTasksHtml || '<p>No nearby requests at the moment.</p>'}
        </div>
      </div>
    `;
  },

  explore() {
    const allTasks = store.getTasks().filter(t => t.status === 'pending');
    const tasksHtml = allTasks.map(this.renderTaskCard).join('');
    
    return `
      <div class="view explore-view">
        <div class="search-wrapper">
          <div style="display: flex; gap: 8px;">
            <div class="input-with-icon" style="flex: 1;">
              <i class="fa-solid fa-search"></i>
              <input type="text" class="search-input" id="task-search" placeholder="Search by location or category...">
            </div>
            <button type="button" id="btn-mic-search" class="btn btn-outline" style="padding: 14px; border-radius: var(--border-radius-lg); background: var(--card-bg);" title="Voice Search (Tamil)">
              <i class="fa-solid fa-microphone"></i>
            </button>
          </div>
        </div>
        
        <div class="feed-container" id="explore-feed">
          ${tasksHtml || '<p>No active requests found.</p>'}
        </div>
      </div>
    `;
  },

  post() {
    return `
      <div class="view post-view">
        <h2 style="margin-bottom: 20px;">Request Help</h2>
        <div class="card">
          <form id="post-form">
            <div class="form-group">
              <label class="floating">Task Title</label>
              <div class="input-with-icon">
                <i class="fa-solid fa-heading"></i>
                <input type="text" id="post-title" class="form-control" placeholder="e.g. Need couch moved" required>
              </div>
            </div>

            <div class="form-group">
              <label class="floating">Category</label>
              <div class="input-with-icon">
                <i class="fa-solid fa-list"></i>
                <select id="post-category" class="form-control" required style="appearance: none;">
                  <option value="Delivery">Delivery</option>
                  <option value="Labor">Labor/Moving</option>
                  <option value="Education">Education</option>
                  <option value="Food">Food/Grocery</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="floating">Location 📍</label>
              <div style="display: flex; gap: 8px;">
                <div class="input-with-icon" style="flex: 1;">
                  <i class="fa-solid fa-location-dot"></i>
                  <input type="text" id="post-location" class="form-control" placeholder="e.g. Downtown" required>
                </div>
                <button type="button" id="btn-get-location" class="btn btn-outline" style="padding: 14px; border-radius: var(--border-radius-sm);" title="Get Current Location">
                  <i class="fa-solid fa-crosshairs"></i>
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <label class="floating">Urgency</label>
              <div class="input-with-icon">
                <i class="fa-solid fa-clock"></i>
                <select id="post-urgency" class="form-control" required style="appearance: none;">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="floating" style="z-index: 10;">Description</label>
              <div style="display: flex; gap: 8px; position: relative;">
                <textarea id="post-desc" class="form-control" placeholder="Provide more details..." required style="flex: 1;"></textarea>
                <button type="button" id="btn-mic-desc" class="btn btn-outline" style="padding: 14px; border-radius: var(--border-radius-sm); align-self: flex-start; height: 50px; margin-top: 16px;" title="Voice Input (Tamil)">
                  <i class="fa-solid fa-microphone"></i>
                </button>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-block">Post Request</button>
          </form>
        </div>
      </div>
    `;
  },

  tasks(subTab = 'active') {
    const user = store.getCurrentUser();
    const tasks = store.getTasks();
    
    // My Tasks includes tasks I requested or tasks I am helping with
    let myTasksHtml = '';
    
    if (subTab === 'active') {
      const activeTasks = tasks.filter(t => 
        (t.requesterId === user.id || t.helperId === user.id) && 
        (t.status === 'pending' || t.status === 'in-progress')
      );
      myTasksHtml = activeTasks.length ? activeTasks.map(this.renderTaskCard).join('') : '<p>No active tasks.</p>';
    } else {
      const completedTasks = tasks.filter(t => 
        (t.requesterId === user.id || t.helperId === user.id) && t.status === 'completed'
      );
      myTasksHtml = completedTasks.length ? completedTasks.map(this.renderTaskCard).join('') : '<p>No completed tasks yet.</p>';
    }

    return `
      <div class="view tasks-view">
        <h2 style="margin-bottom: 20px;">My Tasks</h2>
        
        <div class="tabs">
          <div class="tab ${subTab === 'active' ? 'active' : ''}" data-tab="active">Active</div>
          <div class="tab ${subTab === 'completed' ? 'active' : ''}" data-tab="completed">Completed</div>
        </div>

        <div class="feed-container">
          ${myTasksHtml}
        </div>
      </div>
    `;
  },

  profile() {
    const user = store.getCurrentUser();
    return `
      <div class="view profile-view">
        <div class="card profile-header">
          <img src="https://ui-avatars.com/api/?name=${user.name}&background=2563EB&color=fff&size=128" alt="Profile" class="profile-avatar">
          <h2 class="profile-name">${user.name}</h2>
          <div class="profile-rating">
            ${this.renderStars(user.rating)}
            <span style="color:var(--text-main); font-size: 0.9rem; font-weight: 600; margin-left: 8px;">${user.rating} / 5.0</span>
          </div>
          <p>${user.email}</p>
        </div>

        <div class="stats-container">
          <div class="stat-card">
            <div class="stat-icon stat-blue"><i class="fa-solid fa-check"></i></div>
            <div class="stat-info">
              <h4>${user.tasksCompleted}</h4>
              <p>Tasks Completed</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon stat-green"><i class="fa-solid fa-heart"></i></div>
            <div class="stat-info">
              <h4>${user.peopleHelped}</h4>
              <p>Helped</p>
            </div>
          </div>
        </div>

        <div class="card">
          <button class="btn btn-outline btn-block" id="btn-edit-profile" style="margin-bottom: 12px;">Edit Profile</button>
          <button class="btn btn-outline btn-block" id="btn-logout" style="color: #EF4444; border-color: #FCA5A5;">Logout</button>
        </div>
      </div>
    `;
  },

  editProfile() {
    const user = store.getCurrentUser();
    return `
      <div class="view edit-profile-view">
        <div style="margin-bottom: 16px;">
          <a href="#" id="btn-back-profile" style="color: var(--text-muted); text-decoration: none;"><i class="fa-solid fa-arrow-left"></i> Back</a>
        </div>
        <h2 style="margin-bottom: 20px;">Edit Profile</h2>
        <div class="card">
          <form id="edit-profile-form">
            <div class="form-group">
              <label class="floating">Full Name</label>
              <div class="input-with-icon">
                <i class="fa-regular fa-user"></i>
                <input type="text" id="edit-name" class="form-control" value="${user.name}" required>
              </div>
            </div>
            <div class="form-group">
              <label class="floating">Email</label>
              <div class="input-with-icon">
                <i class="fa-regular fa-envelope"></i>
                <input type="email" id="edit-email" class="form-control" value="${user.email}" required>
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Save Changes</button>
          </form>
        </div>
      </div>
    `;
  },

  taskDetails(taskId) {
    const task = store.getTask(taskId);
    if (!task) return `<p>Task not found.</p>`;
    const user = store.getCurrentUser();
    const isOwner = task.requesterId === user.id;
    const isHelper = task.helperId === user.id;

    let actionsHtml = '';
    if (task.status === 'pending' && !isOwner) {
      actionsHtml = `<button class="btn btn-primary btn-block" id="btn-accept-task" data-id="${task.id}">Accept Task</button>`;
    } else if (task.status === 'in-progress' && (isOwner || isHelper)) {
      actionsHtml = `<button class="btn btn-success btn-block" id="btn-complete-task" data-id="${task.id}">Mark Completed</button>`;
    } else if (task.status === 'completed') {
      actionsHtml = `<div style="text-align:center; color: var(--primary-green); font-weight: bold;"><i class="fa-solid fa-circle-check"></i> Task Completed</div>`;
    }

    return `
      <div class="view details-view">
        <div style="margin-bottom: 16px;">
          <a href="#" id="btn-back" style="color: var(--text-muted); text-decoration: none;"><i class="fa-solid fa-arrow-left"></i> Back</a>
        </div>
        
        <div class="card">
          <div class="req-header">
            <h2 class="req-title" style="font-size: 1.4rem;">${task.title}</h2>
            <span class="badge-urgency ${task.urgency}">${task.urgency.toUpperCase()}</span>
          </div>
          
          <div class="req-meta" style="margin-bottom: 20px;">
            <div class="req-category"><i class="fa-solid ${task.icon}"></i> ${task.category}</div>
            <div class="req-location"><i class="fa-solid fa-location-dot"></i> ${task.location}</div>
          </div>

          <div class="map-container" style="margin-bottom: 20px; border-radius: var(--border-radius-sm); overflow: hidden; height: 180px; box-shadow: var(--shadow-sm);">
            <iframe 
              width="100%" 
              height="100%" 
              frameborder="0" 
              style="border:0;" 
              allowfullscreen="" 
              aria-hidden="false" 
              tabindex="0" 
              src="https://maps.google.com/maps?q=${encodeURIComponent(task.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed">
            </iframe>
          </div>

          <div class="progress-container">
            <div class="progress-labels">
              <span class="${task.status === 'pending' ? 'active' : ''}">Pending</span>
              <span class="${task.status === 'in-progress' ? 'active' : ''}">In Progress</span>
              <span class="${task.status === 'completed' ? 'active' : ''}">Completed</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${task.status === 'pending' ? '33%' : task.status === 'in-progress' ? '66%' : '100%'}"></div>
            </div>
          </div>

          <div style="margin-top: 24px; margin-bottom: 24px;">
            <h4 style="margin-bottom: 8px;">Description</h4>
            <p>${task.description}</p>
          </div>

          <div class="req-footer" style="flex-direction: column; gap: 12px; border:none; padding:0;">
            ${actionsHtml}
          </div>
        </div>
      </div>
    `;
  },

  // Helper Methods
  renderTaskCard(task) {
    return `
      <div class="card task-card" data-id="${task.id}" style="cursor: pointer;">
        <div class="req-header">
          <div class="req-title">${task.title}</div>
          <span class="badge-urgency ${task.urgency}">${task.urgency.charAt(0).toUpperCase() + task.urgency.slice(1)}</span>
        </div>
        <p style="font-size: 0.9rem; margin-bottom: 16px;">${task.description.length > 60 ? task.description.substring(0, 60) + '...' : task.description}</p>
        <div class="req-meta">
          <div class="req-category"><i class="fa-solid ${task.icon}"></i> ${task.category}</div>
          <div class="req-location"><i class="fa-solid fa-location-dot"></i> ${task.location}</div>
        </div>
      </div>
    `;
  },

  renderStars(rating) {
    let stars = '';
    for(let i=1; i<=5; i++) {
      if (rating >= i) stars += '<i class="fa-solid fa-star"></i>';
      else if (rating >= i - 0.5) stars += '<i class="fa-solid fa-star-half-stroke"></i>';
      else stars += '<i class="fa-regular fa-star"></i>';
    }
    return stars;
  }
};
