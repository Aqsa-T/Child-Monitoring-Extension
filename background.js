let explicitWords = []; // This array will hold your explicit words dataset

// Load the explicit words from dataset.json into the explicitWords array
fetch('dataset.json')
  .then(response => response.json())
  .then(data => {
    explicitWords = data.map(item => {
      if (item && item["Preprocessed Violent toxic words"]) {
        return item["Preprocessed Violent toxic words"].toLowerCase();
      }
      return ""; // Return an empty string if the key is not available
    }).filter(word => word); // Remove empty strings
  })
  .catch(error => {
    console.error("Failed to load or process the dataset:", error);
  });

// Function to check if a string contains any explicit word
function containsExplicitWord(text, explicitWords) {
  const textWords = text.toLowerCase().split(/\W+/); // Split on any non-word character
  return explicitWords.some(explicitWord =>
    textWords.includes(explicitWord)
  );
}

// WebNavigation logic to store visited URLs and block pages with URLs that contain explicit words
chrome.webNavigation.onCompleted.addListener(function(details) {
  if (details.frameId === 0) {
    let url = new URL(details.url);
    console.log('Navigated to:', url);

    // Add every URL to the search history
    chrome.storage.local.get({searchHistory: []}, function(data) {
      let history = data.searchHistory;
      history.push(url.href);
      // Ensure we only keep the last 100 entries
      if (history.length > 100) {
        history.shift();
      }
      chrome.storage.local.set({searchHistory: history});
    });

    // Redirect if explicit content is found in the URL
    if (containsExplicitWord(url.pathname + url.search, explicitWords)) {
      console.log('Explicit content found in URL, redirecting:', url);
      chrome.tabs.update(details.tabId, { url: "about:blank" });
    }
  }
});

// Listener for changes to the URL of any tab, specifically for YouTube search queries
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.url) {
    const url = new URL(changeInfo.url);
    if (url.hostname === 'www.youtube.com' && url.pathname === '/results') {
      const searchQuery = url.searchParams.get('search_query');
      if (searchQuery && containsExplicitWord(searchQuery, explicitWords)) {
        console.log('Explicit content found in YouTube search, redirecting:', searchQuery);
        chrome.tabs.update(tabId, { url: "about:blank" });
      }
    }
  }
});
