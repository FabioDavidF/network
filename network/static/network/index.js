document.addEventListener('DOMContentLoaded', () => {
    // by default load all posts page
    getPosts('all', 1)

    // Adding the onclick to the following button
    document.querySelector('#following-button').onclick = function () {getPosts('following', 1)}

    // adding onsubmit to new post
    document.querySelector('#new-post-form').onsubmit = function () {
        
        let content = document.querySelector('#content').value;

        fetch('/create', {
            method: 'POST',
            mode: 'same-origin',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrftoken
              },
            body: JSON.stringify({
                post_content: content
            })
        })
        .then(result => console.log(result))
        .then(function () {getPosts('all', 1)})
    return false;
    }
})


async function getPosts(kind, page) {
    // Clearing out the posts
    document.querySelector('#posts-view').innerHTML = ''

    fetch(`posts/${kind}/${page}`)
    .then(response => response.json())
    .then(post => {
        console.log(post)
        post.forEach(renderPost)
    })

    async function hasNext(kind, page)  {
        var next_page = page+1;
        const response = await fetch(`posts/${kind}/${next_page}`);
        const result = await response.json()
        console.log(result)
        if (result === false) {
            return false;
        } else {
            return true;
        }
    }

    has_next = await hasNext(kind, page);
    if (has_next === false) {
        document.querySelector('#next-button').style.display = 'none'
    } else {
        document.querySelector('#next-button').style.display = 'block'
        document.querySelector('#next-button').onclick = () => {
            next_page = page+1
            getPosts(kind, next_page)
        }
    }

    if (page === 1) {
        document.querySelector('#previous-button').style.display = 'none'
    } else {
        document.querySelector('#previous-button').style.display = 'block'
        document.querySelector('#previous-button').onclick = () => {
            previous_page = page-1
            getPosts(kind, previous_page)
        }
    }
}

async function renderPost(post) {

    // First of all we need to get an url for the author's profile
    // I did this through a fetch request so maintainability is better
    
    fetch(`get-url/${post.author}`)
    .then(response => response.json())
    .then(async object => { var url = object['url']

    // Then we need to check if the post author is the current user
    async function getUsername() {  
        var response = await fetch('get-user')
        const json = await response.json()
        var username = json.username
        return username
    }

    var username = await getUsername();

        // Then we create the post div like this

        var div = document.createElement('div')
        div.className = 'container border rounded'
        div.style = 'margin-top: 1rem;'
        div.innerHTML = `
        <a href="${url}" style='text-decoration: none; color: inherit;'>

        <h3 class='row' style='margin-left: 0.5rem; margin-right: 0.5rem; margin-top: 0.5rem;'>${post.author}</h3>

        </a>

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

        if (username == post.author) {
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
                .then(function () {getPosts('all', 1)})
            return false;
            }
        }
        div.appendChild(edit)
    }
    var doc_div = document.querySelector('#posts-view')
    doc_div.appendChild(div)
    }) 
}

function like (post_id) {
    fetch(`like/${post_id}`, {
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
    .then(response => response.json())
    .then(status => console.log(status))
}