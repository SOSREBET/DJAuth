$(function ($) {
    $('#RForm').submit(function (e) {
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
                        for (let key in response.errors) {
                            let id = 'R' + key.charAt(0).toUpperCase() + key.slice(1)
                            if (id !== 'RCaptcha') {
                                $('#' + id).addClass('is-invalid')
                            }

                            let result = ''
                            for (let k in response.errors[key]) {
                                result += response.errors[key][k] + '<br/>'
                            }
                            $('#error_' + id).html(result)
                        }
                    }
                }
            },
        })
    })
})

$("#RUsername").focusout(function(e) {
    e.preventDefault()
    let form = $("#RForm")[0]
    let login = document.getElementById('RUsername').value
    $.ajax({
        type: form.method,
        url: form.action,
        data: {csrfmiddlewaretoken: getCookie('csrftoken'), username: login, field: 'username'},
        dataType: 'json',
        success: function(response) {
            if (response.status === 400) {
                $('#RUsername').addClass('is-invalid')
                $('#error_RUsername').text(response.error)
            } else {
                $('#RUsername').removeClass('is-invalid')
                $('#error_RUsername').text('')
            }
        },
    })
})
 
$("#REmail").focusout(function(e) {
    e.preventDefault()
    let form = $("#RForm")[0]
    let email = document.getElementById('REmail').value
    $.ajax({
        type: form.method,
        url: form.action,
        data: {csrfmiddlewaretoken: getCookie('csrftoken'), email: email, field: 'email'},
        dataType: 'json',
        success: function(response) {
            if (response.status === 400) {
                $('#REmail').addClass('is-invalid')
                $('#error_REmail').text(response.error)
            } else {
                $('#REmail').removeClass('is-invalid')
                $('#error_REmail').text('')
            }
        },
    })
})

function comparePasswords() {
    let pw1 = document.getElementById('RPassword1')
    let pw2 = document.getElementById('RPassword2')
    let pw1V = pw1.classList.contains('is-invalid')
    let pw2V = pw2.classList.contains('is-invalid')
    let form = $("#RForm")[0]
    if ((pw1.value && pw2.value) && (!pw1V && !pw2V)) {
        if (pw1.value !== pw2.value) {
            $.ajax({
                type: form.method,
                url: form.action,
                data: {csrfmiddlewaretoken: getCookie('csrftoken'), password1: pw1.value, password2: pw2.value, field: 'passwords'},
                dataType: 'json',
                success: function(response) {
                    $('#RPassword1').addClass('is-invalid')
                    $('#RPassword2').addClass('is-invalid')
                    $('#RPassword2').addClass('d-m')
                    $('#error_RPassword2').text(response.error2)
                }
            })
        }
    }
}

$("#RPassword1").focusout(function(e) {
    e.preventDefault()
    let form = $("#RForm")[0]
    let pw1 = document.getElementById('RPassword1').value
    $.ajax({
        type: form.method,
        url: form.action,
        data: {csrfmiddlewaretoken: getCookie('csrftoken'), password1: pw1, field: 'password1'},
        dataType: 'json',
        success: function(response) {
            if (response.status === 400) {
                $('#RPassword1').addClass('is-invalid')
                $('#error_RPassword1').text(response.error)
            } else {
                $('#RPassword1').removeClass('is-invalid')
                $('#error_RPassword1').text('')
                if (document.getElementById('RPassword2').classList.contains('d-m')) {
                    $('#RPassword2').removeClass('is-invalid')
                    $('#error_RPassword2').text('')
                }
                comparePasswords()
            }
        },
    })
})

$("#RPassword2").focusout(function(e) {
    e.preventDefault()
    let form = $("#RForm")[0]
    let pw2 = document.getElementById('RPassword2').value
    $.ajax({
        type: form.method,
        url: form.action,
        data: {csrfmiddlewaretoken: getCookie('csrftoken'), password2: pw2, field: 'password2'},
        dataType: 'json',
        success: function(response) {
            if (response.status === 400) {
                $('#RPassword2').addClass('is-invalid')
                $('#RPassword2').removeClass('d-m')
                $('#error_RPassword2').text(response.error)
            } else {
                $('#RPassword2').removeClass('is-invalid')
                $('#RPassword2').removeClass('d-m')
                $('#error_RPassword2').text('')
                if (document.getElementById('RPassword1').classList.contains('is-invalid') && !document.getElementById('error_RPassword1').textContent) {
                    $('#RPassword1').removeClass('is-invalid')
                }
                comparePasswords()
            }
        },
    })
})


$("#RPolicy").change(function(e) {
    e.preventDefault()
    let form = $("#RForm")[0]
    let accept_check = document.getElementById('RPolicy').checked
    $.ajax({
        type: form.method,
        url: form.action,
        data: {csrfmiddlewaretoken: getCookie('csrftoken'), accept_check: accept_check, field: 'accept_check'},
        dataType: 'json',
        success: function(response) {
            if (response.status === 400) {
                $('#RPolicy').addClass('is-invalid')
                $('#error_RPolicy').text(response.error)
            } else {
                $('#RPolicy').removeClass('is-invalid')
                $('#error_RPolicy').text('')
            }
        },
    })
})

$("#RSubmit").click(function(e) {
    e.preventDefault()
    let form = $('#RForm')
    let names = new Array('RUsername', 'REmail', 'RPassword1', 'RPassword2', 'RPolicy')
    let found = false
    if (!$('.is-invalid').length) {
        for (let i of names) {
            let text = $('#error_' + i).text()
            let val = $('#' + i).val()
            if (text || !val) {
                found = true
                break
            }
        }
        if (!found) {
            form.submit()
        }
    }
    }
)
