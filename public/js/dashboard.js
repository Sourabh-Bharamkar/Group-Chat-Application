
//setting header common to all requests
axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')

// Authenticate and get profile of the user on dom content loaded 

window.addEventListener('DOMContentLoaded', getUserProfile)

async function getUserProfile() {
    try {
        const response = await axios.get('http://localhost:3000/chat/profile')
        const userDetails = response.data;
        document.getElementById('user-profile').textContent = userDetails.name;


    } catch (error) {
        console.log(error)
        console.log(error.response.data.message)
        //if user is not logged in redirect to home page
        if (error.response.data.message == 'you are not currently logged in') {
            window.location = '/'
            window.alert('You are not currently logged in')
        }
        if (error.response.data.message == 'authentication error') {
            window.location = '/'
            window.alert('Authentication Error.Please try logging in again.')
        }
    }

}



//search box functionality

const searchBox = document.getElementById('search-box')

searchBox.addEventListener('keyup', searchUsers)

function searchUsers() {
    console.log('Inside searchUsers function')
    const searchInput = document.getElementById('search-box').value.toLowerCase();
    const usersList = document.getElementsByClassName('group')
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

const createGroupButton = document.getElementById('create-group-btn')
createGroupButton.addEventListener('click', showCreateGroupModal)

function showCreateGroupModal() {
    const createGroupModal = document.getElementById('create-group-modal')
    createGroupModal.style.display = 'block'
}


const addMemberButton = document.getElementById('add-member-btn')
addMemberButton.addEventListener('click', showAddMemberModal)

function showAddMemberModal() {
    const addMemberModal = document.getElementById('add-member-modal')
    addMemberModal.style.display = 'block'
}

// Get the modal

const createGroupModal = document.getElementById('create-group-modal')
const addMemberModal = document.getElementById('add-member-modal')



// Get the <span> element that closes the modal
let closeButton = document.getElementsByClassName("close");


// When the user clicks on close button (x), close the modal
Array.from(closeButton).forEach((element) => {
    element.addEventListener('click', closeModal)

})


function closeModal() {
    createGroupModal.style.display = 'none';
    addMemberModal.style.display = 'none'

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
    document.getElementById('add-member-mobile-input').value = ''
    document.getElementById('create-group-input').value = ''

}



//adding logout functionality
const logoutBtn = document.getElementById('logout-btn')

logoutBtn.addEventListener('click', logout)

function logout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location = 'http://localhost:3000/'
}



//create group functionality

const createGroupform = document.getElementById('create-group-form')
createGroupform.addEventListener('submit', createGroup)

async function createGroup(e) {
    try {
        e.preventDefault();
        const groupName = document.getElementById('create-group-input').value;
        const response = await axios.post('http://localhost:3000/chat/create-group', { groupName: groupName })
        const group = response.data.groupDetails;
        document.getElementById('group-list').insertAdjacentHTML('afterbegin', `<div class="group"><span hidden> ${group.id}</span>${group.name}</div>`)
        clearAllInputFields();
        closeModal();

        highlightGroupOnClick()


    } catch (error) {
        console.log(error)
    }

}



//adding chat groups on dom content loaded 

window.addEventListener('DOMContentLoaded', showJoinedChatGroups)

async function showJoinedChatGroups() {
    try {
        const response = await axios.get('http://localhost:3000/chat/groups')
        const chatGroups = response.data.chatGroups;

        chatGroups.forEach((chatGroup) => {
            document.getElementById('group-list').insertAdjacentHTML('beforeend', `<div class="group"><span hidden> ${chatGroup.id}</span>${chatGroup.name}</div>`)

        })

        highlightGroupOnClick();
        getMessagesOfGroupOnClick();


    } catch (error) {
        console.log(error)
    }
}


//add member to group
const addMemberform = document.getElementById('add-member-form')
addMemberform.addEventListener('submit', addMemberToGroup)

async function addMemberToGroup(e) {
    try {
        e.preventDefault();
        const mobileNumber = document.getElementById('add-member-mobile-input').value
        const groupId = document.getElementById('message-heading').children[0].textContent;
        const response = await axios.post('http://localhost:3000/chat/group/add-member', { mobileNumber: mobileNumber, groupId: groupId })
        closeModal();

    } catch (error) {
        console.log(error.response.data.message)

        if (error.response.data.message == 'already member of the group') {
            showError('already member of the group')
        }

        if (error.response.data.message == 'user not found') {
            showError('user does not have an account')
        }

        function showError(err) {
            const formError = document.getElementById('add-member-form-error')
            formError.style.display = 'block'
            formError.textContent = `* ${err}`;
            setTimeout(() => {
                formError.textContent = ''
                formError.style.display = 'none'
            }, 3000)
            clearAllInputFields();

        }
    }
}



//send message form functionality
const sendMessageForm = document.getElementById('send-message-form')
sendMessageForm.addEventListener('submit', sendMessage)

async function sendMessage(e) {
    try {
        e.preventDefault();
        const message = document.getElementById('message-input').value;
        const groupId = document.getElementById('message-heading').children[0].textContent;
        const response = await axios.post('http://localhost:3000/chat/send-message', { message: message, groupId: groupId })
        document.getElementById('message-input').value = '';

        const Message = response.data.messageDetails;

        document.getElementById('messages-list').insertAdjacentHTML('beforeend',
            `<div class="message outgoing">
        <h3 class="sender">${Message.sender}</h3>
        <p>${Message.text}</p>
        </div>`)

        //scroll down
        const messagesList = document.getElementById('messages-list')
        messagesList.scrollTop = messagesList.scrollHeight;


    } catch (error) {
        console.log(error)
    }
}


//get messages on click on any group
function getMessagesOfGroupOnClick() {

    const groupList = Array.from(document.getElementsByClassName('group'))

    groupList.forEach((chatGroup) => {
        chatGroup.addEventListener('click', getGroupMessages)

        async function getGroupMessages(e) {

            try {
                console.log('ssssss')
                //also show messages-list div
                document.getElementById('messages-coloumn-guide').style.display = 'none'
                document.getElementById('messages-coloumn').style.display = 'block'

                document.getElementById('messages-list').innerHTML = '';

                //getting mobile number of user
                const response1 = await axios.get('http://localhost:3000/chat/profile')
                const mobileNumber = response1.data.mobileNumber;

                //getting group id of current group
                console.log(e.target.children[0].textContent)
                const groupId = e.target.children[0].textContent;

                //getting messages from local storage 
                const localStorageMessages = JSON.parse(localStorage.getItem('messages'))
                const lastMessageId = localStorageMessages[localStorageMessages.length - 1].id;

                insertMessagesIntoMessagesList(localStorageMessages);

                const response = await axios.post('http://localhost:3000/chat/group/messages', { groupId: groupId, lastMessageId: lastMessageId })

                const messages = Array.from(response.data.messages);
                console.log(messages);


                insertMessagesIntoMessagesList(messages);

                function insertMessagesIntoMessagesList(messages) {

                    messages.forEach((message) => {
                        if (message.sender == mobileNumber) {
                            document.getElementById('messages-list').insertAdjacentHTML('beforeend', `<div id=${message.id} class="message outgoing">
                            <h3 class="sender">${message.sender}</h3>
                            <p>${message.text}</p>
                            </div>`)
                        } else {
                            document.getElementById('messages-list').insertAdjacentHTML('beforeend', `<div id=${message.id} class="message incoming">
                            <h3 class="sender">${message.sender}</h3>
                            <p>${message.text}</p>
                            </div>`)
                        }

                    })
                }


                //scroll down
                const messagesList = document.getElementById('messages-list')
                messagesList.scrollTop = messagesList.scrollHeight;


            } catch (error) {
                console.log(error)
            }


        }
    })
}





function highlightGroupOnClick() {

    //when user clicks on any group, show group name in heading and make that group highlighted

    const groups = document.getElementsByClassName('group')

    Array.from(groups).forEach((group) => {
        group.addEventListener('click', showGroupNameAtHeading)


        function showGroupNameAtHeading() {

            //also remove background color of previous active chatgroup
            const groups = Array.from(document.getElementsByClassName('group'))
            groups.forEach((group) => {
                if (group.classList.contains('active-group')) {
                    group.classList.remove('active-group')
                }

            })

            // add background color to active group 
            group.classList.add('active-group')

            //adding group name at heading
            const groupName = group.innerHTML;
            const chatHeading = document.getElementById('message-heading')
            chatHeading.innerHTML = groupName;

        }

    })
}


//sending a request for every seconds for getting new messages

setInterval(async () => {

    try {
        if (document.getElementById('messages-coloumn-guide').style.display == 'none') {

            const groupId = document.getElementById('message-heading').children[0].textContent;

            //getting last message id from local storage 
            const lastMessage = document.getElementById('messages-list').lastElementChild
            const lastMessageId=lastMessage.id;

            const response = await axios.post('http://localhost:3000/chat/group/messages', { groupId: groupId, lastMessageId: lastMessageId })

            const messages = Array.from(response.data.messages);
           
            //if there are new messsages

            if (messages.length) {
                const response1 = await axios.get('http://localhost:3000/chat/profile')
                const mobileNumber = response1.data.mobileNumber;

                messages.forEach((message) => {
                    if (message.sender == mobileNumber) {
                        document.getElementById('messages-list').insertAdjacentHTML('beforeend', `<div id=${message.id} class="message outgoing" >
                            <h3 class="sender">${message.sender}</h3>
                            <p>${message.text}</p>
                            </div>`)
                    } else {
                        document.getElementById('messages-list').insertAdjacentHTML('beforeend', `<div id=${message.id} class="message incoming">
                            <h3 class="sender">${message.sender}</h3>
                            <p>${message.text}</p>
                            </div>`)
                    }

                })


                //scroll down
                const messagesList = document.getElementById('messages-list')
                messagesList.scrollTop = messagesList.scrollHeight;

            }

        }

    } catch (error) {
        console.log(error)
    }

}, 1000)



//On DOMContentLoaded, make a request for user's message if localstorage is empty and store them into local storage

window.addEventListener('DOMContentLoaded', getmessages)

async function getmessages() {
    try {
        if (!localStorage.getItem('messages')) {
            const response = await axios.get('http://localhost:3000/chat/messages?id=0')
            const messages = response.data.messages;
            localStorage.setItem('messages', JSON.stringify(messages))

        }


    } catch (error) {
        console.log(error)
    }
}