document.addEventListener('DOMContentLoaded', () => {
    // by default load all posts page
    getPosts('all')

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
    return false;
    }
})


function getPosts(kind) {
    // Clearing out the posts
    document.querySelector('#posts-view').innerHTML = ''

    fetch(`posts/${kind}`)
    .then(response => response.json())
    .then(posts => {
        posts.forEach(renderPost)
    })
}

function renderPost(post) {

    // First of all we need to get an url for the author's profile
    // I did this through a fetch request so maintainability is better
    
    fetch(`get-url/${post.author}`)
    .then(response => response.json())
    .then(object => { var url = object['url']
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
        var doc_div = document.querySelector('#posts-view')
        doc_div.appendChild(div)
    }) 
}

