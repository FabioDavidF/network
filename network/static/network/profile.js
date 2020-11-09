document.addEventListener('DOMContentLoaded', async () => {
    document.querySelector('#following-button').onclick = () => {
        window.location.replace('http://localhost:8000')
        
        return false;
    }

    getPosts(1)

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

async function getPosts(page) {
    // Clearing out the posts
    document.querySelector('#posts-view').innerHTML = ''

    fetch(`${profile_user}/posts/${page}`)
    .then(response => response.json())
    .then(post => {
        console.log(post)
        post.forEach(renderPost)
    })

    async function hasNext(page)  {
        var next_page = page+1;
        console.log(next_page)
        const response = await fetch(`${profile_user}/posts/${next_page}`);
        const result = await response.json()
        console.log(result)
        console.log(result)
        if (result === false) {
            return false;
        } else {
            return true;
        }
    }

    has_next = await hasNext(page);
    if (has_next === false) {
        document.querySelector('#next-button').style.display = 'none'
    } else {
        document.querySelector('#next-button').style.display = 'block'
        document.querySelector('#next-button').onclick = () => {
            next_page = page+1
            getPosts(next_page)
        }
    }

    if (page === 1) {
        document.querySelector('#previous-button').style.display = 'none'
    } else {
        document.querySelector('#previous-button').style.display = 'block'
        document.querySelector('#previous-button').onclick = () => {
            previous_page = page-1
            getPosts(previous_page)
        }
    }
}

async function renderPost(post) {

    var username = user

    // Now checking if the user has already like the post
    // So we can display the right picture and make the right
    // Method available for they
    var has_liked = await hasLiked(post.id)
    console.log(`${has_liked} ${post.id}`)

    // Then we create the post div like this

    var div = document.createElement('div')
    div.className = 'container border rounded'
    div.style = 'margin-top: 1rem;'
    div.innerHTML = `
    <h3 class='row' style='margin-left: 0.5rem; margin-right: 0.5rem; margin-top: 0.5rem;'>${post.author}</h3>

    <p class='row' style='margin-left: 0.5rem; margin-right: 0.5rem;'>${post.body}</p>

    <div class='row' style='margin-right: 0.5rem;'>
        <div class='col'>
        <div class='row' style='margin-left: 0.5rem;'>
        <div id='like-img-${post.id}'>
        <img src='https://cdn.onlinewebfonts.com/svg/img_56552.png' style='max-width: 2rem; max-height: 2rem;'>
        </div>
        <div id='unlike-img-${post.id}'>
        <img src='https://cdn2.iconfinder.com/data/icons/pittogrammi/142/80-512.png' style='max-width: 2rem; max-height: 2rem;' >
        </div>
        <h5 class='row justify-content-start' style='margin-left: 1rem;' id='like-count-${post.id}'>${post.likes}</h5>
        </div>
    </div>

        <div class='col'>
            <p class='row justify-content-end'>${post.time}</p>
        </div>
    </div>
    `

    if (username === post.author) {
        console.log('entered')
        var edit = document.createElement('div')
        edit.innerHTML = `
        <button class='btn btn-outline-primary' style='margin-bottom: 0.5rem;'>
        <a href='#' style='text-decoration: none; color: inherit;'>Edit Post</a>
        </button>
        `
        edit.onclick = () => {
            div.innerHTML = `

            <form id='edit-form-${post.id}'>
                <div class='form-group'>
                <textarea class='row form-control' id='edit-area' name='edit-input' style='margin-left: 0.5rem; margin-right: 0.5rem;'>${post.body}</textarea>
                </div>

                <button type='submit' class='btn btn-outline-primary'>Edit</button>
            </form>

            `
            document.querySelector(`#edit-form-${post.id}`).onsubmit = () => {
                var new_content = document.querySelector('#edit-area').value
                fetch(`edit/${post.id}`, {
                    method: 'POST',
                    mode: 'same-origin',
                    credentials: 'include',
                    headers: {
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify({
                        post_content: new_content
                    })
                })
                .then(result => console.log(result))
                .then(function () {getPosts(1)})
                return false;
            }
        }
        div.appendChild(edit)
    }
    var doc_div = document.querySelector('#posts-view')
    doc_div.appendChild(div)

    var like_button = document.querySelector(`#like-img-${post.id}`)
    var unlike_button = document.querySelector(`#unlike-img-${post.id}`)

    unlike_button.onclick = async () => {
        await unlike(post.id)
        unlike_button.style.display = 'none'
        like_button.style.display = 'block'
        document.querySelector(`#like-count-${post.id}`).innerHTML = await likeInfo(post.id);
    }

    like_button.onclick = async () => {
        await like(post.id);
        like_button.style.display = 'none'
        unlike_button.style.display = 'block'
        document.querySelector(`#like-count-${post.id}`).innerHTML = await likeInfo(post.id);
    }

    if (has_liked === true) {
        unlike_button.style.display = 'block'
        like_button.style.display = 'none'
        
    } else if (has_liked === false) {
        like_button.style.display = 'block';
        unlike_button.style.display = 'none';
        
    }
}

async function like(post_id) {
    const response = await fetch(`like/${post_id}`, {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'include',
        headers: {
            'X-CSRFToken': csrftoken
            },
        body: JSON.stringify({
            like: true
        })
    })
    console.log(response)
}

async function unlike(post_id) {
    const response = await fetch(`like/${post_id}`, {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'include',
        headers: {
            'X-CSRFToken': csrftoken
            },
        body: JSON.stringify({
            like: false
        })
    })
    console.log(response)
}

async function hasLiked(post_id) {
    const response = await fetch(`has-liked/${post_id}`);
    const json = await response.json();
    const state = json.status;
    return state;
}

async function likeInfo(post_id) {
    const response = await fetch(`like-info/${post_id}`);
    const json = await response.json();
    return json.likes;
}