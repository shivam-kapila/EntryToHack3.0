$(document).on('ready', function() {
    $.get("/team/student", function(data, err) {
        console.log(data);
    });

    // $('#studentTable').text();
}); 