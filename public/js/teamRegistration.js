
var teamDetails = [];
var memberNumber = 0;

var submitForm = jQuery('input[name=Register]');
var fourMember = jQuery('input[type=checkbox]');
var label4member = jQuery('#label4member').css('display', 'none');
fourMember.css('display', 'none');
submitForm.css('display', 'none');

var checkboxToggler = true;
fourMember.on('click', function () {
    if (checkboxToggler) {
        submitForm.css('display', 'block');
        jQuery('#saveDetails').css('display', 'none');
        checkboxToggler = false;
    } else {
        submitForm.css('display', 'none');
        jQuery('#saveDetails').css('display', 'block');
        checkboxToggler = true;
    }
});

jQuery('#saveDetails').on('click', function () {
    var memberInput = takeInputValues(memberNumber);
    memberNumber++;
    if (validateData()) {
        if (validateMemberYear(memberInput)) {
            jQuery('#memberNumber')[0].innerHTML = `Enter Member ${memberNumber + 1}'s details:`;
            clearInputValues();
            console.log(memberInput);
            teamDetails.push(memberInput);
            if (memberNumber === 4) {
                submitForm.css('display', 'block');
                jQuery('#saveDetails').css('display', 'none');
            }
            if (memberNumber === 3) {
                fourMember.css('display', 'block');
                label4member.css('display', 'block');
            }
        } else {
            memberNumber--;
            alert("Roll Number and Year do not match! Enter member details again.");
        }
    }
});

submitForm.on('click', function (e) {
    console.log('fourMember: ', fourMember);
    console.log(fourMember.prop('checked'));
    if (fourMember.prop('checked')) {
        console.log("Entered in checkbox attribute");
        var memberInput = takeInputValues(memberNumber);
        teamDetails.push(memberInput);      // Otherwise it will make the POST request just with the 3 members
    }
    // console.log(memberInput.skill0+ "qwwqwqwqqw");

    console.log('Team Details in submitForm: ', teamDetails);
    console.log(validateForm());
    e.preventDefault();

    if (validateForm()) {

        $.ajax({
            url: '/team/student',
            type: 'POST',
            data: JSON.stringify({ members: teamDetails }),
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
    if (memberNumber < 3) {                                  // Just in case anyone tries to change style properties in inspect element and enables submit button
        console.log("Member Number: ", memberNumber);
        return false;
    }
    console.log('Entered function validating form');
    var second = 0, third = 0, first = 0, fourth = 0, fifth = 0;
    teamDetails.forEach(function (member) {
        switch (member.year) {
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
    if (second > 1) {        // If there are three second years
        if (third > 0 || fourth > 0 || fifth > 0 || second > 3) {
            console.log('Caught at first if');
            return false;
        } else {
            return true;
        }
    }
    if (third > 0) {         // If there are two third years
        if (second > 1 || fourth > 0 || fifth > 0 || third > 2) {
            console.log('Caught at second if');
            return false;
        } else {
            return true;
        }
    }
    if (fourth > 0) {
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

function validateData() {
    if ($('input[name=name]').val().trim() === '') {
        alert('Enter name');
        return false;
    }
    var re = /\S+@\S+\.\S+/;
    if (!re.test($('input[name=email]').val().trim())) {
        alert('Enter valid email');
        return false;
    }
    re = /[1-9]{1}[0-9]{9}/;
    if (!re.test($('input[name=phone]').val().trim())) {
        alert("Enter valid number");
        return false;
    }
    if (($('input[name=skills0]').val().trim() + $('input[name=skills1]').val().trim()
        + $('input[name=skills3]').val().trim() + $('input[name=skills2]').val().trim()) === '') {
        alert('Enter at least one skill');
        return false;
    }

    return true;
}

function takeInputValues(memberNumber) {
    var skill0 = jQuery('input[name=skills0]').val(),
        skill1 = jQuery('input[name=skills1]').val(),
        skill2 = jQuery('input[name=skills2]').val(),
        skill3 = jQuery('input[name=skills3]').val();
    return {
        memberNumber: memberNumber,
        name: jQuery('input[name=name]').val(),
        rollNumber: jQuery('input[name=rollNumber]').val(),
        email: jQuery('input[name=email]').val(),
        phone: jQuery('input[name=phone]').val(),
        year: jQuery('select.form-control').val(),
        skills: [skill0, skill1, skill2, skill3],
        isLeader: false,
        // skills[]: [skill0, skill1, skill2, skill3]
    };
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
    if (memberRollNumber.search(/IIITU/i) !== -1) {
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

function updateYear() {
    console.log('Hello');
    var roll = $('#roll').val();
    if (roll.toLowerCase().search('iiitu') !== -1) {
        $('#year').val(19 - parseInt(roll.split('')[5] + roll.split('')[6]));
    } else if (roll.length === 5 || (roll.length === 7 && roll.toLowerCase().search('mi') !== -1)) {
        $('#year').val(19 - parseInt(roll.split('')[0] + roll.split('')[1]));
    } else {
        $('#year').val('');
    }
}