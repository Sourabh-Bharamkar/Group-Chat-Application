// Aunthenticate user  on dom content loaded 

window.addEventListener('DOMContentLoaded', userAuthentication)

function userAuthentication() {
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



//adding create group button functionality
const createGroupButton=document.getElementById('create-group-btn')
createGroupButton.addEventListener('click',showCreateGroupModal)

function showCreateGroupModal(){
    const createGroupModal=document.getElementById('create-group-modal')
    createGroupModal.style.display='block'
}


const addMemberButton=document.getElementById('add-member-btn')
addMemberButton.addEventListener('click',showAddMemberModal)

function showAddMemberModal(){
    const addMemberModal=document.getElementById('add-member-modal')
    addMemberModal.style.display='block'
}

// Get the modal

const createGroupModal=document.getElementById('create-group-modal')
const addMemberModal=document.getElementById('add-member-modal')



// Get the <span> element that closes the modal
let closeButton = document.getElementsByClassName("close");


// When the user clicks on close button (x), close the modal
Array.from(closeButton).forEach((element) => {
    element.addEventListener('click', closeModal)

})


function closeModal() {
   createGroupModal.style.display='none';
   addMemberModal.style.display='none'

    clearAllInputFields();

}


// When the user clicks anywhere outside of the modal, close it

window.addEventListener('click', modalDisplayOff)

function modalDisplayOff(e) {
    if (e.target.classList.contains('Modal')) {
        e.target.style.display = 'none';
        clearAllInputFields();
    }
}


function clearAllInputFields() {
  document.getElementById('add-member-input').value=''
  document.getElementById('create-group-input').value=''
  
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