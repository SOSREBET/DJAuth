$(function ($) {
    $('#NPForm').submit(function (e) {
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
                    console.log(response.errors)
                    if (response.errors) {

                        if (response.errors.old_password) {
                            $('#NP0').addClass('is-invalid')
                            $('#error_NP0').text(response.errors.old_password)
                        }
                        
                        if (response.errors.new_password1) {
                            $('#NP1').addClass('is-invalid')
                            $('#error_NP1').text(response.errors.new_password1)
                        }
                        
                        if (response.errors.new_password2) {
                            $('#NP2').addClass('is-invalid')
                            $('#error_NP2').text(response.errors.new_password2)
                        }
                        
                    }
                }
            },
        })
    })
})

$("#NP0").focusout(function(e) {
    e.preventDefault()
    checkOld()
})

function checkOld() {
    let form = $("#NPForm")[0]
    let pw = document.getElementById('NP0').value
    let pw2 = document.getElementById('NP2').value
    $.ajax({
        type: form.method,
        url: form.action,
        data: {csrfmiddlewaretoken: getCookie('csrftoken'), old_password: pw, new_password2 :pw2, field: 'old_password'},
        dataType: 'json',
        success: function(response) {
            if (response.status === 400) {
                $('#NP0').addClass('is-invalid')
                $('#error_NP0').text(response.error)
            } else if (response.status === 401) {
                 $('#NP1').addClass('is-invalid')
                 $('#NP2').addClass('is-invalid')
                 $('#error_NP2').text(response.error)
            } else {
                $('#NP0').removeClass('is-invalid')
                $('#error_NP0').text('')
            }
        },
    })
}

function comparePasswords() {
    let pw1 = document.getElementById('NP1')
    let pw2 = document.getElementById('NP2')
    let pw1V = pw1.classList.contains('is-invalid')
    let pw2V = pw2.classList.contains('is-invalid')
    let form = $("#NPForm")[0]
    if ((pw1.value && pw2.value) && (!pw1V && !pw2V)) {
        if (pw1.value !== pw2.value) {
            $.ajax({
                type: form.method,
                url: form.action,
                data: {csrfmiddlewaretoken: getCookie('csrftoken'), new_password1: pw1.value, new_password2: pw2.value, field: 'passwords'},
                dataType: 'json',
                success: function(response) {
                    $('#NP1').addClass('is-invalid')
                    $('#NP2').addClass('is-invalid')
                    $('#NP2').addClass('d-m')
                    $('#error_NP2').text(response.error2)
                }
            })
        } else {
            checkOld()
        }
    }
}

$("#NP1").focusout(function(e) {
    e.preventDefault()
    let form = $("#NPForm")[0]
    let pw1 = document.getElementById('NP1').value
    $.ajax({
        type: form.method,
        url: form.action,
        data: {csrfmiddlewaretoken: getCookie('csrftoken'), new_password1: pw1, field: 'password1'},
        dataType: 'json',
        success: function(response) {
            if (response.status === 400) {
                $('#NP1').addClass('is-invalid')
                $('#error_NP1').text(response.error)
            } else {
                $('#NP1').removeClass('is-invalid')
                $('#error_NP1').text('')
                if (document.getElementById('NP2').classList.contains('d-m')) {
                    $('#NP2').removeClass('is-invalid')
                    $('#error_NP2').text('')
                }
                comparePasswords()
            }
        },
    })
})

$("#NP2").focusout(function(e) {
    e.preventDefault()
    let form = $("#NPForm")[0]
    let pw2 = document.getElementById('NP2').value
    $.ajax({
        type: form.method,
        url: form.action,
        data: {csrfmiddlewaretoken: getCookie('csrftoken'), new_password2: pw2, field: 'password2'},
        dataType: 'json',
        success: function(response) {
            if (response.status === 400) {
                $('#NP2').addClass('is-invalid')
                $('#NP2').removeClass('d-m')
                $('#error_NP2').text(response.error)
            } else {
                $('#NP2').removeClass('is-invalid')
                $('#NP2').removeClass('d-m')
                $('#error_NP2').text('')
                if (document.getElementById('NP1').classList.contains('is-invalid') && !document.getElementById('error_NP1').textContent) {
                    $('#NP1').removeClass('is-invalid')
                }
                comparePasswords()
            }
        },
    })
})

$("#NPSubmit").click(function(e) {
    e.preventDefault()
    let form = $('#NPForm')
    let found = false
    if (document.querySelector('.is-invalid')) {
        found = true
    } else {
        let p1 = document.getElementById('NP1')
        let p2 = document.getElementById('NP2')
        if (!p1.value || !p2.value) {
            found = true
        }
    }
    if (!found) {
        form.submit()
    }
})
