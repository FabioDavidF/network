document.addEventListener('DOMContentLoaded', async () => {
    var f_button = document.querySelector('#follow-button');
    var unf_button = document.querySelector('#unfollow-button');

    // Checking if the user follows the profile or not and displyaing the right button
    const is_following = await isFollowing()

    if (is_following === true) {
        toggleUnfollow();
    } else if (is_following === false) {
        toggleFollow();
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
        .then(() => {
            toggleUnfollow()
            followUpdate()
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
        .then(() => {
            toggleFollow()
            followUpdate()
        })
    }       
})

async function isFollowing() {
    const response = await fetch(`is-following/${profile_user}`);
    const state = await response.json();
    return state.state;
}

function toggleFollow () {
    const f_button = document.querySelector('#follow-button');
    const unf_button = document.querySelector('#unfollow-button');
    f_button.style.display = 'block'
    unf_button.style.display = 'none'
}

function toggleUnfollow() {
    const f_button = document.querySelector('#follow-button');
    const unf_button = document.querySelector('#unfollow-button');
    unf_button.style.display = 'block'
    f_button.style.display = 'none'
}

async function followUpdate() {
    var response = await fetch(`follow-info/${profile_user}`);
    var data = await response.json();
    console.log(data)
    var followers = data.followers
    var following = data.following
    
    document.querySelector('#followers-count').innerHTML = `${followers} Followers` 
    document.querySelector('#following-count').innerHTML = `${following} Following` 
}