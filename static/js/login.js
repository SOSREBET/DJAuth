$(function ($) {
    $('#LForm').submit(function (e) {
        e.preventDefault()
        $.ajax({
            type: this.method,
            url: this.action,
            data: $(this).serialize(),
            dataType: 'json',
            success: function (response) {
                if (response.status === 201) {
                    window.location.replace(response.url) 
                } else {
                    if (response.errors) {
                        $('#error_L').removeClass('d-none')
                        if (response.status === 401 || response.status === 429) {
                            $('#error_L').text(response.errors)
                            $('#LSubmit').prop('disabled', true)
                            setTimeout(() => { $('#LSubmit').prop('disabled', false) }, 60000)
                            var timer = 61;
                            var ct = $('#error_L').text()
                            var interval = setInterval(function() {
                                $('#error_L').html(ct + '<br/>' + response.text + + (timer -= 1))
                                if (timer == 1) {
                                    clearInterval(interval)
                                    $('#error_L').text(ct)
                                }
                            }, 1000);
                        } else {
                            let result = ''
                            for (let e in response.errors) {
                                result += (response.errors[e] + '<br/>')
                                $('#error_L').html(result)
                            }
                            $('#LUsername').addClass('is-invalid')
                            $('#LPassword').addClass('is-invalid')
                        }
                    }
                }
            }
        })
    })
})

$("#LUsername").focusout(function(e) {
    e.preventDefault()
    let val = document.getElementById('LUsername').value
    if (val.length < 6 || val.length > 60) {
        $('#LUsername').addClass('is-invalid')
    } else {
        $('#LUsername').removeClass('is-invalid')
    }
})

$("#LPassword").focusout(function(e) {
    e.preventDefault()
    let val = document.getElementById('LPassword').value
    if (val.length < 8 || val.length > 128) {
        $('#LPassword').addClass('is-invalid')
    } else {
        $('#LPassword').removeClass('is-invalid')
    }
})

$('#LSubmit').click(function(e) {
    e.preventDefault()
    let form = $('#LForm')
    let username = document.getElementById('LUsername')
    let password = document.getElementById('LPassword')
    let found = false
    if (document.querySelector('#LForm .is-invalid')) {
        found = true
    } else {
        if (username.value.length < 6) {
            found = true
            $('#LUsername').addClass('is-invalid')
        }
        if (password.value.length < 8) {
            found = true
            $('#LPassword').addClass('is-invalid')
        }    
    }
    if (!found) {
        form.submit()
    }
})
