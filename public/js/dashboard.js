// adding user profile in the header on dom content loaded 

window.addEventListener('DOMContentLoaded', addUserProfile)

function addUserProfile() {
    //send request for getting user details by sending token
}



//search box functionality

const searchBox = document.getElementById('search-box')

searchBox.addEventListener('keyup', searchUsers)

function searchUsers() {
    console.log('Inside searchUsers function')
    const searchInput = document.getElementById('search-box').value.toLowerCase();
    const usersList = document.getElementsByClassName('user')
    Array.from(usersList).forEach((element) => {
        if (!element.textContent.toLowerCase().includes(searchInput)) {
            console.log(element)
            element.style.display = 'none'
        }
        else {
            element.style.display = 'block'
        }

    })

}



//when user clicks on any user show his name in heading and make that user highlighted

const usersList = document.getElementsByClassName('user')
Array.from(usersList).forEach((element) => {
    element.addEventListener('click', showUserNameAtHeading)


    function showUserNameAtHeading() {

        //also remove background color of previous active chat user
        const userList = Array.from(document.getElementsByClassName('user'))
        userList.forEach((element) => {
            if (element.classList.contains('active-user')) {
                element.classList.remove('active-user')
            }

        })

        // add background color to active chat user 
        element.classList.add('active-user')

        //adding users name at heading
        const userName = element.textContent;
        console.log(userName)
        const chatHeading = document.getElementById('message-heading')
        chatHeading.textContent = userName;

    }

})



//adding logout functionality
const logoutBtn=document.getElementById('logout-btn')

logoutBtn.addEventListener('click',logout)

function logout(){
    localStorage.clear();
    sessionStorage.clear();
    window.location='http://localhost:3000/'
}