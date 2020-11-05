document.addEventListener('DOMContentLoaded', () => {
    var f_button = document.querySelector('#follow-button');
    var unf_button = document.querySelector('#unfollow-button');

    

    // By default, both buttons will be disabled
    f_button.style.display = 'none'
    unf_button.style.display = 'none'
 
    var isFollowing = isFollowing()

    if (isFollowing === true) {
        unf_button.style.display = 'block'
        f_button.style.display = 'none'
    } else if (isFollowing === false) {
        f_button.style.display = 'block'
        unf_button.style.display = 'none'
    }

    f_button.onclick = () => {
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
    }
   
    unf_button.onclick = () => {
        //API view to unfollow
        fetch(`/user/${profile_user}/follow`, {
            method: 'PUT',
            mode: 'same-origin',
            headers: {
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                follow: false
            })
        })
    }       
})

function isFollowing() {
    fetch(`is-following/${profile_user}`)
    .then(response => response.json())
    .then(state => {
        if (state.state === false) {
            return false
        } else if (state.state === true) {
            return true
        }
    })
}