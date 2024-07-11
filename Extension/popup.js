document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    let editingTaskId = null;
    let tasks = [];
  
    // Load tasks from storage when popup opens
    chrome.storage.sync.get('tasks', function(data) {
      tasks = data.tasks || [];
      renderTasks(tasks);
    });
  
    // Add task event listener
    addTaskBtn.addEventListener('click', function() {
      const taskText = taskInput.value.trim();
  
      if (taskText === '') {
        console.error('Task text is empty.');
        return;
      }
  
      if (editingTaskId !== null) {
        // Editing existing task
        editTask(editingTaskId, taskText);
        editingTaskId = null;
      } else {
        // Create new task object
        const newTask = {
          text: taskText,
          completed: false,
          id: Date.now()
        };
  
        // Save task to storage and update tasks array
        tasks.push(newTask);
        chrome.storage.sync.set({ 'tasks': tasks }, function() {
          console.log('Task added:', newTask);
          renderTasks(tasks);
        });
      }
  
      // Clear input field
      taskInput.value = '';
      taskInput.focus();
    });
  
    // Render tasks
    function renderTasks(tasks) {
      taskList.innerHTML = '';
      tasks.forEach(task => {
        const li = createTaskElement(task);
        taskList.appendChild(li);
      });
    }
  
    // Create task element
    function createTaskElement(task) {
      const li = document.createElement('li');
      li.textContent = task.text;
      li.classList.add('task-item');
      li.classList.toggle('completed', task.completed);
  
      // Create edit icon
      const editIcon = document.createElement('i');
      editIcon.classList.add('fas', 'fa-edit', 'edit-icon');
      editIcon.addEventListener('click', function(event) {
        event.stopPropagation();
        editTaskStart(task);
      });
      li.appendChild(editIcon);
  
      // Create delete icon
      const deleteIcon = document.createElement('i');
      deleteIcon.classList.add('fas', 'fa-trash', 'delete-icon');
      deleteIcon.addEventListener('click', function(event) {
        event.stopPropagation();
        deleteTask(task.id);
      });
      li.appendChild(deleteIcon);
  
      // Task click event to toggle completion
      li.addEventListener('click', function() {
        task.completed = !task.completed;
        chrome.storage.sync.set({ 'tasks': tasks }, function() {
          renderTasks(tasks);
        });
      });
  
      return li;
    }
  
    // Edit task start
    function editTaskStart(task) {
      taskInput.value = task.text;
      editingTaskId = task.id;
    }
  
    // Edit task
    function editTask(taskId, newText) {
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        tasks[taskIndex].text = newText;
        chrome.storage.sync.set({ 'tasks': tasks }, function() {
          console.log('Task edited:', tasks[taskIndex]);
          renderTasks(tasks);
        });
      } else {
        console.error('Task not found for editing:', taskId);
      }
    }
  
    // Delete task function
    function deleteTask(taskId) {
      tasks = tasks.filter(task => task.id !== taskId);
      chrome.storage.sync.set({ 'tasks': tasks }, function() {
        console.log('Task deleted:', taskId);
        renderTasks(tasks);
      });
    }
  
    // Fetch a random quote from an API or a local database
    
  });