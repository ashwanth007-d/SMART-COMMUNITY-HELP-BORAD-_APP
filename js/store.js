// js/store.js

const USERS_KEY = 'schb_users';
const TASKS_KEY = 'schb_tasks';
const CURRENT_USER_KEY = 'schb_current_user';

const store = {
  init() {
    if (localStorage.getItem('schb_version') !== '4.3') {
      localStorage.removeItem(USERS_KEY);
      localStorage.removeItem(TASKS_KEY);
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.setItem('schb_version', '4.3');
      localStorage.setItem(CURRENT_USER_KEY, '1'); // Auto-login user 1
    }

    if (!localStorage.getItem(USERS_KEY)) {
      const defaultUsers = [
        { id: '1', name: 'TEAM CC', email: 'example@gmail.com', password: 'clay', rating: 5.0, tasksCompleted: 142, peopleHelped: 185 },
        { id: '2', name: 'Priya', email: 'priya@example.com', password: 'password', rating: 4.9, tasksCompleted: 8, peopleHelped: 10 },
        { id: '3', name: 'Rahul', email: 'rahul@example.com', password: 'password', rating: 4.5, tasksCompleted: 3, peopleHelped: 4 }
      ];
      localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    }
    
    if (!localStorage.getItem(TASKS_KEY)) {
      const defaultTasks = [
        {
          id: 't1',
          title: 'Need help moving a couch',
          description: 'I need an extra pair of hands to move a couch from the 1st floor to the 2nd floor.',
          category: 'Labor',
          icon: 'fa-box',
          location: 'Downtown, NY',
          urgency: 'medium', // low, medium, high
          requesterId: '2',
          helperId: null,
          status: 'pending', // pending, in-progress, completed
          createdAt: new Date().toISOString()
        },
        {
          id: 't2',
          title: 'Emergency Medical Delivery',
          description: 'Need insulin picked up from the main street pharmacy. Very urgent!',
          category: 'Delivery',
          icon: 'fa-truck-medical',
          location: 'Westside Pharmacy, NY',
          urgency: 'high',
          requesterId: '2',
          helperId: null,
          status: 'pending',
          createdAt: new Date().toISOString()
        },
        {
          id: 't3',
          title: 'Math Tutoring for 10th Grader',
          description: 'Looking for someone to help my son with Algebra 2 for a couple of hours.',
          category: 'Education',
          icon: 'fa-book',
          location: 'North Hills Library',
          urgency: 'low',
          requesterId: '2',
          helperId: '1',
          status: 'in-progress',
          createdAt: new Date().toISOString()
        },
        {
          id: 't4',
          title: 'Grocery delivery for elderly',
          description: 'My grandmother cannot leave the house. Looking for someone to pick up standard groceries from Whole Foods.',
          category: 'Food',
          icon: 'fa-utensils',
          location: 'Upper East Side, NY',
          urgency: 'high',
          requesterId: '3',
          helperId: null,
          status: 'pending',
          createdAt: new Date().toISOString()
        },
        {
          id: 't5',
          title: 'Fix leaky kitchen sink',
          description: 'The pipe under the sink is leaking. Not an expert, just need someone handy.',
          category: 'Other',
          icon: 'fa-wrench',
          location: 'Brooklyn Heights, NY',
          urgency: 'medium',
          requesterId: '3',
          helperId: null,
          status: 'pending',
          createdAt: new Date().toISOString()
        },
        {
          id: 't6',
          title: 'Walk my golden retriever',
          description: 'Twisted my ankle, need someone to walk Charlie in Central Park for 30 mins.',
          category: 'Other',
          icon: 'fa-dog',
          location: 'Central Park West, NY',
          urgency: 'low',
          requesterId: '2',
          helperId: null,
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      ];

      // Add 50+ nearby requests programmatically
      const catOpts = ['Labor', 'Delivery', 'Education', 'Food', 'Other'];
      const iconOpts = {'Labor': 'fa-box', 'Delivery': 'fa-truck', 'Education': 'fa-book', 'Food': 'fa-utensils', 'Other': 'fa-hands-helping'};
      const locOpts = ['Downtown', 'Upper East Side', 'Brooklyn Heights', 'Queens', 'Staten Island', 'Central Park', 'Harlem', 'Chelsea', 'Tribeca', 'West Village', 'SoHo', 'East Village', 'Williamsburg', 'Astoria', 'DUMBO'];
      const adjOpts = ['Urgent', 'Quick', 'Help with', 'Looking for', 'Need immediate', 'Seeking someone for', 'Assistance needed with'];
      const nounOpts = ['furniture moving', 'document delivery', 'math tutoring', 'grocery pickup', 'yard cleanup', 'dog walking', 'plumbing repair', 'meal prep', 'painting room', 'tech support', 'translating documents', 'lifting heavy boxes'];

      for (let i = 0; i < 55; i++) {
        const cat = catOpts[Math.floor(Math.random() * catOpts.length)];
        const adj = adjOpts[Math.floor(Math.random() * adjOpts.length)];
        const noun = nounOpts[Math.floor(Math.random() * nounOpts.length)];
        
        defaultTasks.push({
          id: 't_extra_' + i,
          title: `${adj} ${noun}`,
          description: `Hello neighbors! I'm ${adj.toLowerCase()} ${noun}. I'm located nearby and would really appreciate any assistance anyone could offer. Thank you!`,
          category: cat,
          icon: iconOpts[cat],
          location: `${locOpts[Math.floor(Math.random() * locOpts.length)]}, NY`,
          urgency: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          requesterId: (i % 2 === 0) ? '2' : '3',
          helperId: null,
          status: 'pending',
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString()
        });
      }

      localStorage.setItem(TASKS_KEY, JSON.stringify(defaultTasks));
    }
  },

  getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  },

  getCurrentUser() {
    const id = localStorage.getItem(CURRENT_USER_KEY);
    if (!id) return null;
    return this.getUsers().find(u => u.id === id) || null;
  },

  login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, user.id);
      return true;
    }
    return false;
  },

  signup(name, email, password) {
    const users = this.getUsers();
    if (users.find(u => u.email === email)) return false; // Email exists
    
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      rating: 5.0,
      tasksCompleted: 0,
      peopleHelped: 0
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, newUser.id);
    return true;
  },

  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  updateUser(id, name, email) {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) return false;

    // Check if new email is already used by someone else
    if (email !== users[userIndex].email && users.find(u => u.email === email)) {
      return false; // Email is already in use
    }

    users[userIndex].name = name;
    users[userIndex].email = email;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  },

  getTasks() {
    return JSON.parse(localStorage.getItem(TASKS_KEY) || '[]');
  },

  getTask(id) {
    return this.getTasks().find(t => t.id === id);
  },

  addTask(taskData) {
    const tasks = this.getTasks();
    const user = this.getCurrentUser();
    
    const iconMap = {
      'Delivery': 'fa-truck',
      'Labor': 'fa-box',
      'Education': 'fa-book',
      'Food': 'fa-utensils',
      'Other': 'fa-hands-helping'
    };

    const newTask = {
      id: 't' + Date.now(),
      title: taskData.title,
      description: taskData.description,
      category: taskData.category,
      icon: iconMap[taskData.category] || 'fa-hands-helping',
      location: taskData.location,
      urgency: taskData.urgency,
      requesterId: user.id,
      helperId: null,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return newTask;
  },

  updateTaskStatus(taskId, status, helperId = null) {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].status = status;
      if (helperId) tasks[taskIndex].helperId = helperId;
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
      
      // Update user stats if completed
      if (status === 'completed' && tasks[taskIndex].helperId) {
          const users = this.getUsers();
          const hId = tasks[taskIndex].helperId;
          const userIdx = users.findIndex(u => u.id === hId);
          if (userIdx !== -1) {
              users[userIdx].tasksCompleted += 1;
              users[userIdx].peopleHelped += 1; // Simplified stat
              localStorage.setItem(USERS_KEY, JSON.stringify(users));
          }
      }
      return true;
    }
    return false;
  }
};
