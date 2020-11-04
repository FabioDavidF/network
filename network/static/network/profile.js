document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('#follow-button') != null) {
        var button = document.querySelector('#follow-button')
        button.onclick = () => {
            //API view to follow
        }

    } else if (document.querySelector('#unfollow-button') != null) {
        var button = document.querySelector('#unfollow-button')
        button.onclick = () => {
            //API view to unfollow
        }
    }
        
})