document.addEventListener('DOMContentLoaded', function() {
    var formData = JSON.parse(localStorage.getItem('formData'));
    var photoData = localStorage.getItem('visitorPhoto');

    // Populate data
    document.getElementById('companyName').textContent = formData.companyName;
    document.getElementById('visitorName').textContent = formData.visitorName;
    document.getElementById('visitorContact').textContent = formData.visitorContact;
    document.getElementById('purpose').textContent = formData.purpose;
    document.getElementById('date').textContent = formData.date;
    document.getElementById('timeIn').textContent = formData.timeIn;
    document.getElementById('timeOut').textContent = formData.timeOut;
    document.getElementById('authorizedBy').textContent = formData.authorizedBy;
    document.getElementById('department').textContent = formData.department;
    document.getElementById('securityName').textContent = formData.securityName;
    document.getElementById('comments').textContent = formData.comments;

    if (photoData) {
        document.getElementById('displayPhoto').src = photoData;
    }

    document.getElementById('printButton').addEventListener('click', function() {
        window.print(); // Triggers the print dialog
    });
});
