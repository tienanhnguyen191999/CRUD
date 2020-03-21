$(document).ready(function() {
    CSRF_token = $('input[name="csrfmiddlewaretoken"]').val()

    // paginate tables
    $('#main-table').DataTable()

    handleDelete()
    handleUpdate()
    handleCreate()
})

// type message = 'danger' or 'primary'
function showAlert(message, type_message) {
    str = '<div class="alert alert-' + type_message + ' alert-dismissible fade show" role="alert">'
    str += message
    str += '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
    str += '<span aria-hidden="true">&times;</span>'
    str += '</button>'
    str += '</div>'
    return str;
}

function addUserToTable(user) {
    str = ' <tr>'
    str += '<th scope="row">' + user.id + '</th>'
    str += ' <td> ' + user.username + '</td>'
    str += '<td> ' + user.email + ' </td>'
    str += ' <td>' + user.password + '</td>'
    str += ' <td><button class="btn btn-primary update-btn" ><input type="hidden" value=' + user.id + '>Update</button></td>'
    str += '<td><button class="btn btn-danger" class="delete-btn"><input type="hidden" value=' + user.id + '>Delete</button></td>'
    str += ' </tr>'
    return str
}

function updateUser(user) {
    str = '<th scope="row">' + user.id + '</th>'
    str += ' <td> ' + user.username + '</td>'
    str += '<td> ' + user.email + ' </td>'
    str += ' <td>' + user.password + '</td>'
    str += ' <td><button class="btn btn-primary update-btn"><input type="hidden" value=' + user.id + '>Update</button></td>'
    str += '<td><button class="btn btn-danger" class="delete-btn"><input type="hidden" value=' + user.id + '>Delete</button></td>'
    $('input:hidden[value=' + user.id + ']').parent().parent().parent().html(str)
}

function delUser(id) {
    console.log($('input:hidden[value=' + id + ']').parent().parent().parent().html(""))
}

function handleUpdate() {
    //update handle
    $('.update-btn').click(function() {
        $('#update-modal').modal('show')
        let id = $(this).find('input').val()

        // show current value
        // #op1: call ajax to get user info
        // #op2: parse HTML to get info
        // use #op1
        $.ajax({
            headers: { "X-CSRFToken": CSRF_token },
            url: 'getUser',
            type: "POST",
            data: { 'id': id },
            success: function(data) {
                user = JSON.parse(data.user)
                $('#upd-username').val(user.username)
                $('#upd-email').val(user.email)
                $('#upd-password').val(user.password)
            }
        })

        $('#updateForm').submit(function(e) {
            e.preventDefault()

            formData = {
                'id': id,
                'username': $('#upd-username').val(),
                'password': $('#upd-password').val(),
                'email': $('#upd-email').val(),
            }

            // Made Changes
            $.ajax({
                headers: { "X-CSRFToken": CSRF_token },
                url: 'updateUser',
                type: "POST",
                data: formData,
                success: function(data) {
                    $('#update-modal').modal('hide')
                    if (!data.error) {
                        $('#alert').html(showAlert(data.message, 'success'))

                        // Update user to table ( find row by id )
                        updateUser(JSON.parse(data.users))

                        // apply event to new btn
                        handleUpdate()
                        handleDelete()
                    } else {
                        $('#alert').html(showAlert(data.message, 'success'))
                    }
                    $('#alert').html(showAlert(data.message, 'success'))
                }
            })

        })

    })
}

function handleDelete() {
    $('.delete-btn').click(function() {
        let id = $(this).find('input').val()
        $.ajax({
            headers: { "X-CSRFToken": CSRF_token },
            url: 'delUser',
            type: "POST",
            data: { 'id': id },
            success: function(data) {
                console.log(data)
                if (!data.error) {
                    delUser(id)

                    // apply event to new btn
                    handleDelete()
                    handleUpdate()
                }
            }
        })
    })
}

function handleCreate() {
    $('#createForm').submit(function(e) {
        e.preventDefault()

        formData = {
            'username': $('#username').val(),
            'password': $('#password').val(),
            'email': $('#email').val(),
        }


        // call ajax
        $.ajax({
            headers: { "X-CSRFToken": CSRF_token },
            url: 'create',
            type: "POST",
            data: formData,
            success: function(data) {
                str = ''
                console.log(data)
                if (!data.error) {
                    $('#alert').html(showAlert(data.message, 'success'))

                    // Add user to table
                    addUserToTable(JSON.parse(data.users))
                    $('#main-table').append(str)

                    // Apply event to new btn
                    handleUpdate()
                    handleDelete()
                } else {
                    $('#alert').html(showAlert(data.message, 'danger'))
                }
                dismissAlert()
            }
        })
    })
}

function dismissAlert(j) {
    $('.close').click(function() {
        $(this).parent().hide()
    })
}