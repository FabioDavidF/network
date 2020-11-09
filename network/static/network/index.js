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

