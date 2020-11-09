document.addEventListener('DOMContentLoaded', async () => {
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

function renderPost(post) {

    var username = user

    // Then we create the post div like this

    var div = document.createElement('div')
    div.className = 'container border rounded'
    div.style = 'margin-top: 1rem;'
    div.innerHTML = `
    <h3 class='row' style='margin-left: 0.5rem; margin-right: 0.5rem; margin-top: 0.5rem;'>${post.author}</h3>

    <p class='row' style='margin-left: 0.5rem; margin-right: 0.5rem;'>${post.body}</p>

    <div class='row' style='margin-left: 0.5rem; margin-right: 0.5rem;'>
        <div class='col'>
            <h5 class='row justify-content-start'>${post.likes}</h5>
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
}