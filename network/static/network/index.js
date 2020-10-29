document.addEventListener('DOMContentLoaded', () => {
    // by default load all posts page

    //adding ondubmit to new post
    document.querySelector('#new-post-form').onsubmit(function () {
        let content = document.querySelector('#content');
        fetch('/create', {
            method: 'POST',
            body: JSON.stringify({
                body: content
            })
        })
    return false;
    })

})


function allPosts() {
    fetch()
}
