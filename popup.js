document.addEventListener('DOMContentLoaded', function () {
    var historyDiv = document.getElementById('history');

    
    function displaySearchHistory(searchHistory) {
        if (searchHistory && searchHistory.length > 0) {
            
            historyDiv.innerHTML = '';

            
            searchHistory.forEach(function (url) {
                const listItem = document.createElement('li');
                listItem.className = 'truncate';
                const cherryIcon = document.createElement('img');
                cherryIcon.src = 'search.png';
                cherryIcon.alt = 'Cherry';
                cherryIcon.className = 'inline mr-2';
                cherryIcon.style.height = '1em';
                listItem.appendChild(cherryIcon);
                const anchorTag = document.createElement('a');
                anchorTag.href = url;
                anchorTag.className = 'underline';
                anchorTag.textContent = url;
                listItem.appendChild(anchorTag);
                historyDiv.appendChild(listItem);
            });
        } else {
            historyDiv.textContent = 'No history found.';
        }
    }

    
    chrome.storage.local.get(['searchHistory'], function (result) {
    
        displaySearchHistory(result.searchHistory);

    
        var firebaseConfig = {
            apiKey: 'AIzaSyC-J2OdSIOBZLYiA-JavO5eaAVdqFHJgOQ',
            appId: '1:929837617513:web:333179ea490322ae88adf8',
            messagingSenderId: '929837617513',
            projectId: 'fyp-project-db-final',
            authDomain: 'fyp-project-db-final.firebaseapp.com',
            storageBucket: 'fyp-project-db-final.appspot.com',
        };
        firebase.initializeApp(firebaseConfig);

        
        var firestore = firebase.firestore();

        
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                
                var userId = user.uid;

                
                firestore.collection('history').doc(userId).set({
                    urls: result.searchHistory
                })
                .then(function() {
                    console.log("Search history successfully stored in Firestore!");
                })
                .catch(function(error) {
                    console.error("Error storing search history: ", error);
                });
            } else {
                console.log("User is not signed in.");
            }
        });
    });
});
