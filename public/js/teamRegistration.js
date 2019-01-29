
var teamDetails = [];
var memberNumber = 0;

var submitForm = jQuery('input[name=Register]');
submitForm.css('display', 'none');

jQuery('#saveDetails').on('click', function () {
    var memberInput = takeInputValues(memberNumber);
    memberNumber++;
    if(validateMemberYear(memberInput))
    {
        jQuery('#memberNumber')[0].innerHTML = `Enter Member ${memberNumber + 1}'s details:`;
        clearInputValues();
        console.log(teamDetails);
        teamDetails.push(memberInput);
        if (memberNumber === 4) {
            submitForm.css('display', 'block');
            jQuery('#saveDetails').css('display', 'none');
        }
        if (memberNumber === 3) {
            submitForm.css('display', 'block');
        }
    } else {
        memberNumber--;
        alert("Roll Number and Year do not match! Enter member details again.")
    }        
});

submitForm.on('click', function (e) {
    var memberInput = takeInputValues(memberNumber);
    console.log(memberInput.skill0);
         // Use only for 4 member bug.
    teamDetails.push(memberInput);
    console.log('Team Details in submitForm: ', teamDetails);
    console.log(validateForm());
    e.preventDefault();
    
    if(validateForm()) {

        $.ajax({
            url: '/team/student',
            type: 'POST',
            data: JSON.stringify({members: teamDetails}),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: false,
            success: function (msg) {
                alert(msg);

            }
        });
    } else {
        alert("This team formation is not allowed. Please refer to the rules again! http://csec.nith.ac.in/hack/");
    }
});

function validateForm() {  
    console.log('Entered function validating form');                                       
    var second = 0, third = 0, first = 0, fourth = 0, fifth = 0;
    teamDetails.forEach(function (member) {
        switch(member.year) {
            case "2": second++;
                break;
            case "3": third++;
                break;
            case "4": fourth++;
                break;
            case "5": fifth++;
                break;
            case "1": first++;
                break;
            default: break;     // No use        
        }
    });
    console.log(`Second: ${second}\nThird: ${third}\nFourth: ${fourth}\nFirst: ${first}`);
    console.log('Team Details in Validate Form: ', teamDetails);
        if(second > 1) {        // If there are three second years
            if(third > 0 || fourth > 0 || fifth > 0 || second > 3) {
                console.log('Caught at first if');
                return false;
            } else {
                return true;
            }
        }
        if(third > 0) {         // If there are two third years
            if (second > 1 || fourth > 0 || fifth > 0 || third > 2) {
                console.log('Caught at second if');
                return false;
            } else {
                return true;
            }
        }
        if(fourth > 0) {
            if (third > 0 || second > 0 || fifth > 0 || fourth > 1) {
                return false;
            } else {
                return true;
            }
        }
        if (fifth > 0) {
            if (third > 0 || second > 0 || fourth > 0 || fifth > 1) {
                return false;
            } else {
                return true;
            }
        }
        return true;
}

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
        skill3: jQuery('input[name=skills3]').val(),
        isLeader: false,
        // skills[]: [skill0, skill1, skill2, skill3]
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

function validateMemberYear(member) {
    var currentYear = 19;
    var memberYear = currentYear - member.year;            // Will return 18, 17, 16, etc
    var memberRollNumber = member.rollNumber;
    if(memberRollNumber.search(/IIITU/i) !== -1) {
        if (memberRollNumber.search(memberYear) === 5) {        // MemberYear wasn't found in MemberRollNumber
            return true;
        } else {
            return false;
        }
    } else {
        if (memberRollNumber.search(memberYear) === 0) {        // MemberYear wasn't found in MemberRollNumber
            return true;
        } else {
            return false;
        }
    }
    
}
