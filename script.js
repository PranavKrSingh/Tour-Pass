document.addEventListener('DOMContentLoaded', function() {
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var startCameraButton = document.getElementById('startCamera');
    var snapButton = document.getElementById('snap');

    startCameraButton.addEventListener('click', function(e) {
        e.preventDefault();
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
                video.style.display = 'block';
                snapButton.style.display = 'block';
                startCameraButton.style.display = 'none';
            })
            .catch(function(err) {
                console.log("An error occurred: " + err);
            });
    });

    snapButton.addEventListener('click', function(e) {
        e.preventDefault();
        context.drawImage(video, 0, 0, 320, 240);
        var dataURL = canvas.toDataURL('image/png');
        localStorage.setItem('visitorPhoto', dataURL);
        canvas.style.display = 'block';
    });

    document.getElementById('gatePassForm').addEventListener('submit', function(e) {
        e.preventDefault();
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
        
        localStorage.setItem('formData', JSON.stringify(formData));
        window.location.href = 'display.html';
    });
});
