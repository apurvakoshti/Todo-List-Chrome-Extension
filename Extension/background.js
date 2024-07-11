chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'getTasks') {
        chrome.storage.sync.get('tasks', function(data) {
            sendResponse(data.tasks || []);
        });
    } else if (request.action === 'saveTasks') {
        chrome.storage.sync.set({ 'tasks': request.tasks }, function() {
            sendResponse();
        });
    }
});