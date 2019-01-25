
var teamDetails = [];
var memberNumber = 0;

var submitForm = jQuery('input[name=Register]');
submitForm.css('display', 'none');

jQuery('#saveDetails').on('click', function () {
    var memberInput = takeInputValues(memberNumber++);
    jQuery('#memberNumber')[0].innerHTML = `Enter Member ${memberNumber + 1}'s details:`;
    clearInputValues();
    console.log(teamDetails);
    teamDetails.push(memberInput);
    if(memberNumber === 3) {
        submitForm.css('display', 'block');
        jQuery('#saveDetails').css('display', 'none');
    } 
});

submitForm.on('click', function () {
    validateForm();             // TODO: Function to be made
    jQuery.post('/team/student', teamDetails, function (data, e) {
        if(e) {
            alert('Some error has occurred');
        } else {
            alert('Congratulations, you have registered!');
        }

    })
});

function takeInputValues(memberNumber) {
    return {
        memberNumber: memberNumber,
        name: jQuery('input[name=name]').val(),
        rollNumber: jQuery('input[name=rollNumber]').val(),
        email: jQuery('input[name=email]').val(),
        phone: jQuery('input[name=phone]').val(),
        year: jQuery('select.form-control').val(),
        skill0: jQuery('input[name=skills0]').val(),
        skill1: jQuery('input[name=skills1]').val(),
        skill2: jQuery('input[name=skills2]').val(),
        skill3: jQuery('input[name=skills3]').val()
    }        
}

function clearInputValues() {
    jQuery('input[name=name]').val('');
    jQuery('input[name=rollNumber]').val('');
    jQuery('input[name=email]').val('');
    jQuery('input[name=phone]').val('');
    jQuery('select.form-control').val('');
    jQuery('input[name=skills0]').val('');
    jQuery('input[name=skills1]').val('');
    jQuery('input[name=skills2]').val('');
    jQuery('input[name=skills3]').val('');
}