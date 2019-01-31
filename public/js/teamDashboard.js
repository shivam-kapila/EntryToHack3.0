$(document).ready( function() {

    // $('#studentTable').text();
});

$('#studentTable').on('click', function() {
    console.log("Check");
    $.get("/team/student")
    .done(function(data) {
        $("#studentTable").text(data);
        console.log(data);
    }) ;
});