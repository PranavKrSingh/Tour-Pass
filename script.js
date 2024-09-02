document.addEventListener('DOMContentLoaded', function() {
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var startCameraButton = document.getElementById('startCamera');
    var snapButton = document.getElementById('snap');
    var retakeButton = document.getElementById('retake');
    var finalPhoto = null; // To store the final photo
    var isSubmitting = false; // Flag to prevent multiple submissions

    // Elements for messages and loading indicator
    var loadingMessage = document.getElementById('loadingMessage');
    var gatepassMessage = document.getElementById('gatepassMessage');
    var loadingIndicator = document.getElementById('loadingIndicator');

    startCameraButton.addEventListener('click', function(e) {
        e.preventDefault();
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
                video.style.display = 'block';
                snapButton.style.display = 'block';
                startCameraButton.style.display = 'none';
                retakeButton.style.display = 'none'; // Hide retake button initially
            })
            .catch(function(err) {
                console.log("An error occurred: " + err);
            });
    });

    snapButton.addEventListener('click', function(e) {
        e.preventDefault();
        context.drawImage(video, 0, 0, 320, 240);
        finalPhoto = canvas.toDataURL('image/png');
        localStorage.setItem('visitorPhoto', finalPhoto);

        // Stop the video stream and hide the video element
        video.srcObject.getTracks().forEach(track => track.stop());
        video.style.display = 'none';

        // Display the captured image in the same box
        canvas.style.display = 'block';
        snapButton.style.display = 'none';
        retakeButton.style.display = 'block'; // Show retake button
    });

    retakeButton.addEventListener('click', function(e) {
        e.preventDefault();
        // Restart the camera and hide the captured image
        video.style.display = 'block';
        canvas.style.display = 'none';
        snapButton.style.display = 'block';
        retakeButton.style.display = 'none';
        
        // Restart the camera stream
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function(err) {
                console.log("An error occurred: " + err);
            });
    });

    var form = document.getElementById('Visitor');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (isSubmitting) {
            console.log('Form is already being submitted.');
            return;
        }
        isSubmitting = true;

        var formData = {
            companyName: document.getElementById('companyName').value,
            visitorName: document.getElementById('visitorName').value,
            visitorContact: document.getElementById('visitorContact').value,
            purpose: document.getElementById('purpose').value,
            date: document.getElementById('date').value,
            timeIn: document.getElementById('timeIn').value,
            timeOut: document.getElementById('timeOut').value,
            authorizedBy: document.getElementById('authorizedBy').value,
            department: document.getElementById('department').value,
            securityName: document.getElementById('securityName').value,
            comments: document.getElementById('comments').value
        };

        // Store data in localStorage
        localStorage.setItem('formData', JSON.stringify(formData));
        if (finalPhoto) {
            localStorage.setItem('visitorPhoto', finalPhoto); // Save the final photo
        }

        // Show loading and gate pass messages
        loadingMessage.style.display = 'block';
        gatepassMessage.style.display = 'block';
        loadingIndicator.style.display = 'block';

        // Parallelize gate pass generation and data storage
        Promise.all([generateGatePass(formData), storeInGoogleSheet(formData)])
            .then(([gatePassUrl]) => {
                console.log("Gate pass generated:", gatePassUrl);
                console.log("Data stored in Google Sheets successfully");
                window.location.href = 'display.html';
            })
            .catch(error => {
                console.error("An error occurred:", error);
            })
            .finally(() => {
                isSubmitting = false; // Reset the submitting flag
                // Hide loading and gate pass messages
                loadingMessage.style.display = 'none';
                gatepassMessage.style.display = 'none';
                loadingIndicator.style.display = 'none';
            });
    });

    function generateGatePass(formData) {
        return new Promise((resolve) => {
            // Generate a URL or string for the gate pass, for example:
            var gatePassUrl = `https://example.com/gatepass?visitorName=${encodeURIComponent(formData.visitorName)}&date=${encodeURIComponent(formData.date)}`;
            resolve(gatePassUrl);
        });
    }

    function storeInGoogleSheet(formData) {
        return new Promise((resolve, reject) => {
            // Prepare data for Google Sheets
            var formBody = new FormData();
            for (var key in formData) {
                formBody.append(key, formData[key]);
            }

            // Append visitor photo as a base64 string to the form data
            var visitorPhoto = localStorage.getItem('visitorPhoto');
            if (visitorPhoto) {
                formBody.append('visitorPhoto', visitorPhoto);
            }

            // Submit form data to Google Sheets using Fetch API
            fetch('https://script.google.com/macros/s/AKfycby6KAi9I1j5oKRQI9Xq3RyU8IDgPhXsnRNY3vqKNod07NLJnC_FI_liBX2AdixIfthwbw/exec', {
                method: 'POST',
                body: formBody
            }).then(response => {
                if (response.ok) {
                    resolve();
                } else {
                    reject("Failed to store data in Google Sheets");
                }
            }).catch(error => {
                reject(error);
            });
        });
    }
});
