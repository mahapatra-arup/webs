
$(document).ready(function () {
    let currentTotalSearches = 0;
    let intervalId = null;
    let countdownId = null;
    let previousTab = null; // Store the reference to the last opened tab
    let wordsArray = []; // Array to store words from words.txt


    //========================================Random Word Search===================================================
    // Load words from words.txt file
    $.get('words.txt', function (data) {
        wordsArray = data.split(/\r?\n/);
        console.log('Loaded words:', wordsArray); // Log the loaded words array
    });

    function getRandomWord() {
        if (wordsArray.length == 0) {
            //Words array is empty. Random Srring Search Continue
            let randomStr = generateRandomString(6);
            return randomStr;
        }
        const randomIndex = Math.floor(Math.random() * wordsArray.length);
        return wordsArray[randomIndex];
    }

    //========================================Random String===================================================
    function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
    //========================================Random String===================================================


    function generateUniqueCode() {
        // Generate a random string of 7 characters
        // let randomStr = generateRandomString(7);
        let randomStr = getRandomWord();
        return randomStr;
    }

    function performSearch() {
        const randomSearchTerm = generateUniqueCode();
        const randomForm = Math.random().toString(36).substring(2, 7).toUpperCase(); // Simplified random form generation
        const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(randomSearchTerm)}&form=${randomForm}`;

        console.log(`Searching for: ${randomSearchTerm} with FORM=${randomForm}`);

        // Close the previous tab if it exists
        if (previousTab) {
            previousTab.close();
        }

        previousTab = window.open(searchUrl, '_blank'); // Open the new search tab

        // Bring focus back to the main page
        window.focus();

        // Close the search page after 5 seconds
        setTimeout(() => {
            if (previousTab) {
                previousTab.close();
            }
        }, 6000); // Wait 6 seconds before closing the tab

        currentTotalSearches++;
        $('#span-progress').text(`Total searches performed: ${currentTotalSearches}`);
    }

    function startSearchCycle() {
        const limit = parseInt($('#slc-limit').val(), 10);
        const interval = parseInt($('#slc-interval').val(), 10); // Get interval from the dropdown

        const searchHandler = () => {
            if (currentTotalSearches < limit) {
                performSearch();
                $('#span-countdown').text(`Next search in: ${interval / 1000} seconds`);

                clearInterval(countdownId);
                let countdown = interval / 1000;

                countdownId = setInterval(() => {
                    countdown--;
                    $('#span-countdown').text(`Next search in: ${countdown} seconds`);
                    if (countdown <= 0) {
                        clearInterval(countdownId);
                    }
                }, 1000);

                intervalId = setTimeout(searchHandler, interval); // Schedule the next search after the interval
            } else {
                $('#toast-message .toast-body').text("Total search limit reached. Stopping the process.");
                const toastEl = $('#toast-message');
                const toast = new bootstrap.Toast(toastEl);
                toast.show();
                stopSearch();
            }
        };

        searchHandler();
    }

    function stopSearch() {
        clearTimeout(intervalId);
        clearInterval(countdownId);
        $('#btn-start').prop('disabled', false);
        $('#btn-stop').prop('disabled', true);
        // Close the last opened tab if it's still open
        if (previousTab) {
            previousTab.close();
        }
        // Open Points page------------
        window.open('https://rewards.bing.com/pointsbreakdown', '_blank');
    }

    $('#btn-start').click(function () {
        currentTotalSearches = 0; // Reset search count
        $('#btn-start').prop('disabled', true);
        $('#btn-stop').prop('disabled', false);
        startSearchCycle();
    });

    $('#btn-stop').click(stopSearch);
});
