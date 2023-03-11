$(function ($) {
    $('#PRForm').submit(function (e) {
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
                    $('#error_PR').removeClass('d-none')
                    if (response.errors) {
                        let result = ''
                        for (let e in response.errors) {
                            result += (response.errors[e] + '<br/>')
                            $('#error_PR').html(result)
                        }
                    }
                }
            },
        })
    })
})

$("#PREmail").focusout(function(e) {
    e.preventDefault()
    let form = $("#PRForm")[0]
    let email = document.getElementById('PREmail').value
    $.ajax({
        type: form.method,
        url: form.action,
        data: {csrfmiddlewaretoken: getCookie('csrftoken'), email: email, field: 'email'},
        dataType: 'json',
        success: function(response) {
            if (response.status === 400) {
                $('#error_PR').removeClass('d-none')
                $('#PREmail').addClass('is-invalid')
                $('#error_PR').text(response.error)
            } else {
                $('#error_PR').addClass('d-none')
                $('#PREmail').removeClass('is-invalid')
                $('#error_PR').text('')
            }
        },
    })
})

$('#PRSubmit').click(function(e) {
    e.preventDefault()
    let form = $('#PRForm')
    let found = false
    if (document.querySelector('.is-invalid')) {
        found = true
    } else {
        if (document.getElementById('PREmail').value.length < 10) {
            found = true
        }
        if (document.getElementById('error_PR').textContent.length > 0) {
            found = true
        }
    }
    if (!found) {
        form.submit()
    } else {
        $('#PREmail').addClass('is-invalid')
    }
})
