document.addEventListener('DOMContentLoaded', () => {
    // by default load all posts page

    // adding onsubmit to new post
    document.querySelector('#new-post-form').onsubmit = function () {
        
        let content = document.querySelector('#content');

        fetch('/create', {
            method: 'POST',
            mode: 'same-origin',
            headers: {
                'X-CSRFToken': csrftoken
              },
            body: JSON.stringify({
                body: content
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
    div.className = 'row border rounded'
    div.innerHTML = `
    <a href='#' style='text-decoration'> 
    `
}