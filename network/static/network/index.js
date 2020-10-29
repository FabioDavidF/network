document.addEventListener('DOMContentLoaded', () => {
    // by default load all posts page

    // adding onsubmit to new post
    document.querySelector('#new-post-form').onsubmit = function () {

        // Getting the csrf cookie
        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
        const csrftoken = getCookie('csrftoken');

        // Doing the request as the django docs say, to inclyde the csrf
        const request = new Request(
            '/create', {headers: {'X-CSRFToken': csrftoken}}
        );

        let content = document.querySelector('#content');

        fetch('/create', {
            method: 'POST',
            mode: 'same-origin',
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