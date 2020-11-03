document.addEventListener('DOMContentLoaded', () => {
    // by default load all posts page

    // adding onsubmit to new post
    document.querySelector('#new-post-form').onsubmit = function () {
        
        let content = document.querySelector('#content').value;

        fetch('/create', {
            method: 'POST',
            mode: 'same-origin',
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
    fetch(`posts/${kind}`)
    .then(response => response.json())
    .then(posts => {
        posts.forEach(renderPost)
    })
}

function renderPost(post) {
    var div = document.createElement('div')
    div.className = 'container border rounded'
    div.style = 'margin-top: 1rem;'
    div.innerHTML = `
    <h3 class='row' style='margin-left: 0.5rem; margin-right: 0.5rem;'>${post.author}</h3>
    <p class='row' style='margin-left: 0.5rem; margin-right: 0.5rem;'>${post.body}</p>
    <div class='row' style='margin-left: 0.5rem; margin-right: 0.5rem;'>
    <h5>${post.likes}</h5>
    <p class='justify-content-end'>${post.time}</p>
    </div>
    `
    var doc_div = document.querySelector('#posts-view')
    doc_div.appendChild(div)
}