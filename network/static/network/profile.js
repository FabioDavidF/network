document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('#follow-button') != null) {
        var button = document.querySelector('#follow-button')
        button.onclick = () => {
            //API view to follow
            fetch(`/user/${profile_user}/follow`, {
                method: 'PUT',
                mode: 'same-origin',
                headers: {
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify({
                    follow: true
                })
            })
            .then(console.log(response))
        }

    } else if (document.querySelector('#unfollow-button') != null) {
        var button = document.querySelector('#unfollow-button')
        button.onclick = () => {
            //API view to unfollow
        }
    }
        
})

