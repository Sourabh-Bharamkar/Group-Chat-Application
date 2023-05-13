const socket = io()

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


//adding chat groups on dom content loaded 

window.addEventListener('DOMContentLoaded', showJoinedChatGroups)

async function showJoinedChatGroups() {
    try {
        const response = await axios.get('http://localhost:3000/chat/groups')
        const chatGroups = response.data.chatGroups;

        chatGroups.forEach((chatGroup) => {

            document.getElementById('group-list').insertAdjacentHTML('beforeend',
                `<div class="group" id=group-${chatGroup.id}> 
                <div> 
                    <img src="/images/group-icon.png"
                    alt="" class="group-icon">
                </div> 
                <div class="group-details">
                    <span class="group-id" hidden> ${chatGroup.id}</span> 
                    <span class="group-name">${chatGroup.name}</span>
                </div>
                <span class="message-count"></span>
                 
            </div>`)

        })

        highlightGroupOnClick();
        getMessagesOfGroupOnClick();


    } catch (error) {
        console.log(error)
    }
}



//On DOMContentLoaded, make a request for user's message if localstorage and store them into local storage

window.addEventListener('DOMContentLoaded', getmessages)

async function getmessages() {
    try {

        const response = await axios.get('http://localhost:3000/chat/messages')
        const messages = response.data.messages;
        localStorage.setItem('messages', JSON.stringify(messages))

        
        messages.forEach((message)=>{
            //increase new messages count of the corresponding group
            const group = document.getElementById(`group-${message.chatGroupId}`)
            console.log(group)

            if (group) {
                let messageCountElement = group.children[2];
                let messageCount=messageCountElement.innerText;
                messageCountElement.style.display='block';
                console.log(group.children[2])
                console.log(group.children[2].innerText)

                if (!messageCount) {
                    group.children[2].innerText = 1;
                } else {
                    group.children[2].innerText = Number(messageCount) + 1;
                }
            }
        })

    } catch (error) {
        console.log(error)
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



//modals functionality 

//when user clicks on create group button, show create group modal

const createGroupButton = document.getElementById('create-group-btn')
createGroupButton.addEventListener('click', showCreateGroupModal)

function showCreateGroupModal() {
    const createGroupModal = document.getElementById('create-group-modal')
    createGroupModal.style.display = 'block'
}

//when user clicks on add member button, show addMemberModal 

const addMemberButton = document.getElementById('add-member-btn')
addMemberButton.addEventListener('click', showAddMemberModal)

function showAddMemberModal() {
    const addMemberModal = document.getElementById('add-member-modal')
    addMemberModal.style.display = 'block'
}


//open file share modal when user clicks on paper clip button 

const paperClipBtn = document.getElementById('paper-clip-btn')

paperClipBtn.addEventListener('click', showFileShareModal)

function showFileShareModal() {
    document.getElementById('file-share-modal').style.display = 'block';

}


// Get the modal

const createGroupModal = document.getElementById('create-group-modal')
const addMemberModal = document.getElementById('add-member-modal')
const groupMembersModal = document.getElementById('group-members-modal')
const fileShareModal = document.getElementById('file-share-modal')


// Get the <span> element that closes the modal
let closeButton = document.getElementsByClassName("close");


// When the user clicks on close button (x), close the modal
Array.from(closeButton).forEach((element) => {
    element.addEventListener('click', closeModal)

})


function closeModal() {
    createGroupModal.style.display = 'none';
    addMemberModal.style.display = 'none'
    groupMembersModal.style.display = 'none'
    fileShareModal.style.display = 'none'

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
        const chatGroup = response.data.groupDetails;
        document.getElementById('group-list').insertAdjacentHTML('afterbegin',
            `<div class="group"> 
        <div> 
            <img src="/images/group-icon.png"
            alt="" class="group-icon">
        </div> 
        <div class="group-details">
            <span class="group-id" hidden> ${chatGroup.id}</span> 
            <span class="group-name">${chatGroup.name}</span>
        </div> 
        <span class="message-count"></span>
    </div>`)
        clearAllInputFields();
        closeModal();

        highlightGroupOnClick()
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

        //show success message
        document.getElementById('add-member-mobile-input').value='';
        document.getElementById('add-member-success-message').innerText='user added successfully...';

        setTimeout(() => {
            document.getElementById('add-member-success-message').innerText='';
        },2000);
        

    } catch (error) {
        console.log(error.response.data.message)

        if (error.response.data.message == 'already member of the group') {
            showError('already member of the group')
        }

        if (error.response.data.message == 'user not found') {
            showError('User does not have an account. Invite him/her on Chat App.')
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



//send message functionality
const sendMessageForm = document.getElementById('send-message-form')
sendMessageForm.addEventListener('submit', sendMessage)

async function sendMessage(e) {
    try {
        e.preventDefault();
        const message = document.getElementById('message-input').value;
        const groupId = document.getElementById('message-heading').children[0].textContent;
        const response = await axios.post('http://localhost:3000/chat/group/send-message', { message: message, groupId: groupId })
        document.getElementById('message-input').value = '';

        //add socket event send message 
        socket.emit('sendMessage', () => {
            console.log('send message socket event is fired')
        })

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
                console.log(e.target)

                //show messages-list div
                document.getElementById('messages-coloumn-guide').style.display = 'none'
                document.getElementById('messages-coloumn').style.display = 'block'

                document.getElementById('messages-list').innerHTML = '';

                //getting mobile number of user
                const response1 = await axios.get('http://localhost:3000/chat/profile')
                const mobileNumber = response1.data.mobileNumber;

                //getting group id of current group

                let groupId;
                const activeGroup = Array.from(document.getElementsByClassName('active-group'))[0];
                groupId = activeGroup.children[1].children[0].textContent;


                //if user is admin of group, show add member button 

                const isAdminResponse = await axios.get(`http://localhost:3000/chat/group/is_admin?groupId=${groupId}`)

                const user = isAdminResponse.data.user;
                const isUserAdmin = user.admin;

                if (!isUserAdmin) {

                    document.getElementById('add-member-btn').style.display = 'none'
                } else {
                    document.getElementById('add-member-btn').style.display = 'block'
                }


                //getting messages from local storage 
                const localStorageMessages = JSON.parse(localStorage.getItem('messages'))
                let lastMessageId;


                if (localStorageMessages.length == 0) {
                    lastMessageId = 0;
                }
                else {
                    lastMessageId = localStorageMessages[localStorageMessages.length - 1].id;
                }

                insertMessagesIntoMessagesList(localStorageMessages);

                // const response = await axios.post('http://localhost:3000/chat/group/messages', { groupId: groupId, lastMessageId: lastMessageId })

                // const messages = Array.from(response.data.messages);

                // insertMessagesIntoMessagesList(messages);

                function insertMessagesIntoMessagesList(messages) {

                    messages.forEach((message) => {

                        if (message.chatGroupId == groupId) {
                            console.log(message)

                            if (!message.fileURL) {

                                if (message.sender == mobileNumber) {
                                    document.getElementById('messages-list').insertAdjacentHTML('beforeend', `<div id=${message.id} class="message outgoing" >
                                            <h3 class="sender">You</h3>
                                            <p>${message.text}</p>
                                            </div>`)
                                } else {
                                    document.getElementById('messages-list').insertAdjacentHTML('beforeend', `<div id=${message.id} class="message incoming">
                                            <h3 class="sender">${message.sender}</h3>
                                            <p>${message.text}</p>
                                            </div>`)
                                }

                            }
                            else {
                                let mediaHTML;
                                if (message.type.includes('image')) {
                                    mediaHTML = `<img src=${message.fileURL} alt="image" width="250" height="250">`
                                }
                                else if (message.type.includes('video')) {
                                    mediaHTML = `<video width="320" height="240" controls>
                                    <source src=${message.fileURL} type="video/mp4">
                                    <source src=${message.fileURL} type="video/ogg">
                                  </video>`
                                }
                                else if (message.type.includes('audio')) {
                                    mediaHTML = `<audio controls>
                                    <source src=${message.fileURL} type="audio/ogg">
                                    <source src=${message.fileURL} type="audio/mpeg">
                                  </audio>`
                                } else if(message.type.includes('application')){
                                    const filename = message.fileURL.substring(message.fileURL.lastIndexOf('/')+1);
                                    mediaHTML=`<a href=${message.fileURL}><img class="document-file-icon" src="/images/doc.png" alt="Document"/> ${filename} </a>`
                                }


                                if (message.sender == mobileNumber) {
                                    document.getElementById('messages-list').insertAdjacentHTML('beforeend', `<div id=${message.id} class="message outgoing" >
                                            <h3 class="sender">You</h3>
                                            ${mediaHTML}
                                            </div>`)
                                } else {
                                    document.getElementById('messages-list').insertAdjacentHTML('beforeend', `<div id=${message.id} class="message incoming">
                                            <h3 class="sender">${message.sender}</h3>
                                            ${mediaHTML}
                                            </div>`)
                                }
                            }

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
            const groupDetails = group.children[1].innerHTML;
            console.log(groupDetails)
            const chatHeading = document.getElementById('message-heading')
            chatHeading.innerHTML = ''
            chatHeading.insertAdjacentHTML('afterbegin', groupDetails);

            //hide message count element 
            const messageCountElement=group.children[2];
            messageCountElement.style.display='none';
            messageCountElement.innerText='';

        }

    })
}



//group members button functionality

const groupMembersButton = document.getElementById('group-members-btn')

groupMembersButton.addEventListener('click', openGroupMembersModal)

async function openGroupMembersModal() {
    try {
        const groupMembersModal = document.getElementById('group-members-modal')
        groupMembersModal.style.display = 'block';

        //taking group id
        const groupId = document.getElementById('message-heading').children[0].textContent;

        //check whether user is group admin or not
        const isAdminResponse = await axios.get(`http://localhost:3000/chat/group/is_admin?groupId=${groupId}`)

        const user = isAdminResponse.data.user;
        const isUserAdmin = user.admin;


        //request for list of all group members

        const response = await axios.get(`http://localhost:3000/chat/group/members?groupId=${groupId}`)
        const groupMembers = response.data.groupMembers;
        document.getElementById('group-members-list').innerHTML = '';

        //if user is itself admin
        if (isUserAdmin) {

            groupMembers.forEach((member) => {

                //if member is itself user
                if (member.user_chatGroup.admin && member.id == user.userId) {
                    console.log('ppppppp')
                    document.getElementById('group-members-list').insertAdjacentHTML('afterbegin',
                        `<div class="group-member">
            <div><img src="/images/group-member.png" class="group-member-icon" alt="">
            </div>
            <div class="group-member-details">
            <span hidden>${member.id}</span>
            <span>You</span><br>
            <span>${member.mobileNumber}</span>
            </div>
            <div class="group-member-labels">
            <span class="admin"> Admin </span>
            </div>
            
            </div>`)
                }
                //if member is not itself user
                else if (member.user_chatGroup.admin && member.id != user.userId) {
                    console.log('sssssssss')
                    document.getElementById('group-members-list').insertAdjacentHTML('afterbegin',
                        `<div class="group-member">
                        <div><img src="/images/group-member.png" class="group-member-icon" alt="">
                        </div>
                        <div class="group-member-details">
                        <span hidden>${member.id}</span>
                        <span>${member.name}</span><br>
                        <span>${member.mobileNumber}</span>
                        </div>
                        <div class="group-member-labels">
                        <span class="admin"> Admin </span>
                        <span class="admin-action"> Action </span>
                        </div>
        
                        </div>`)
                }
                else {
                    document.getElementById('group-members-list').insertAdjacentHTML('beforeend',
                        `<div class="group-member">
                        <div><img src="/images/group-member.png" class="group-member-icon" alt=""></div>
                        <div class="group-member-details">
                        <span hidden>${member.id}</span>
                        <span>${member.name}</span><br>
                        <span>${member.mobileNumber}</span>
                        </div>
                        <div class="group-member-labels">
                        <span class="admin-action"> Action </span>
                        </div>
                        </div>`)

                }


            })

        }
        else {
            groupMembers.forEach((member) => {

                if (member.user_chatGroup.admin) {
                    document.getElementById('group-members-list').insertAdjacentHTML('afterbegin',
                        `<div class="group-member">
            <div><img src="/images/group-member.png" class="group-member-icon" alt=""></div>
            <div class="group-member-details">
            <span hidden>${member.id}</span>
            <span>${member.name}</span><br>
            <span>${member.mobileNumber}</span>
            </div>
            <div class="group-member-labels">
            <span class="admin"> Admin </span>
            </div>
            
            </div>`)
                }
                else {
                    document.getElementById('group-members-list').insertAdjacentHTML('beforeend',
                        `<div class="group-member">
            <div><img src="/images/group-member.png" class="group-member-icon" alt=""></div>
            <div class="group-member-details">
            <span hidden>${member.id}</span>
            <span>${member.name}</span><br>
            <span>${member.mobileNumber}</span>
            </div>
            <div class="group-member-labels">

            </div>
            </div>`)
                }


            })
        }


    } catch (error) {
        console.log(error)
    }

}



//adding functionality for three vertical dots button

window.addEventListener('click', threeDotsDropdown)

function threeDotsDropdown(e) {

    const threeDotDropdown = document.getElementById('three-dots-dropdown');

    if (e.target.classList.contains('dropdown-btn') || e.target.classList.contains('dropdown-btn-image')) {
        if (threeDotDropdown.style.display == 'block') {
            return threeDotDropdown.style.display = 'none';
        }
        threeDotDropdown.style.display = 'block'

    } else {
        threeDotDropdown.style.display = 'none'

    }

}



//adding event listener for admin's action button 

window.addEventListener('click', showAdminActions)


function showAdminActions(e) {

    const adminActionsListA = document.getElementById('admin-actions-list-A');
    const adminActionsListB = document.getElementById('admin-actions-list-B');

    if (e.target.classList.contains('admin-action') && e.target.parentElement.children[0].classList.contains('admin')) {

        if (adminActionsListA.style.display == 'block') {

            return adminActionsListA.style.display = 'none';
        }
        else {
            adminActionsListA.style.display = 'block'
            adminActionsListB.style.display = 'none'
        }

    }

    else if (e.target.classList.contains('admin-action') && e.target.parentElement.children[0].classList.contains('admin-action')) {

        if (adminActionsListB.style.display == 'block') {

            return adminActionsListB.style.display = 'none';
        }
        else {
            adminActionsListB.style.display = 'block'
            adminActionsListA.style.display = 'none'

        }

    }

    else {

        adminActionsListA.style.display = 'none';
        adminActionsListB.style.display = 'none';

        const activeMembers = Array.from(document.getElementsByClassName('active-member'))
        if (activeMembers.length) {
            document.getElementsByClassName('active-member')[0].classList.remove('active-member')

        }


    }
}



//when group admin clicks on action button, make corresponding member as acitive member

window.addEventListener('click', highlightGroupMember)

function highlightGroupMember(e) {

    if (e.target.classList.contains('admin-action')) {


        const groupMembers = Array.from(document.getElementsByClassName('group-member'))
        groupMembers.forEach((groupMember) => {
            if (groupMember.classList.contains('active-member')) {
                groupMember.classList.remove('active-member')
            }
        })

        //make that group member highlighted
        e.target.parentElement.parentElement.classList.add('active-member')

    }

}



//remove member from group

const removeMemberBtns = Array.from(document.getElementsByClassName('remove-member'))

removeMemberBtns.forEach((removeMemberBtn) => {

    removeMemberBtn.addEventListener('click', removeMember)

    async function removeMember(e) {

        try {
            e.preventDefault();

            const member = document.getElementsByClassName('active-member')[0];
            const memberId = member.children[1].children[0].textContent;
            const groupId = document.getElementById('message-heading').children[0].textContent;

            const response = await axios.post('http://localhost:3000/chat/group/member/remove', { groupId: groupId, memberId: memberId })

            //remove the member from the group members list
            member.remove()



        } catch (error) {
            console.log(error)
        }

    }
})


//dismiss as a group admin 
const dismissGroupAdminBtn = document.getElementById('dismiss-group-admin')

dismissGroupAdminBtn.addEventListener('click', dismissAsGroupAdmin)

async function dismissAsGroupAdmin(e) {
    try {
        e.preventDefault();
        const member = document.getElementsByClassName('active-member')[0];
        const memberId = member.children[1].children[0].textContent;
        const groupId = document.getElementById('message-heading').children[0].textContent;

        await axios.post('http://localhost:3000/chat/group/member/dismiss-as-a-group-admin', { memberId, groupId })

        //remove admin tag from member
        const adminTagOfMember = member.children[2].children[0];
        adminTagOfMember.remove();

        console.log('dissmissed as a group admin')



    } catch (error) {
        console.log(error)
    }
}



//make group admin to member of group
const makeGroupAdminBtn = document.getElementById('make-group-admin')

makeGroupAdminBtn.addEventListener('click', makeGroupAdmin)

async function makeGroupAdmin(e) {
    try {
        e.preventDefault();
        const member = document.getElementsByClassName('active-member')[0];
        const memberId = member.children[1].children[0].textContent;
        const groupId = document.getElementById('message-heading').children[0].textContent;

        await axios.post('http://localhost:3000/chat/group/member/make-group-admin', { memberId, groupId })

        //remove admin tag from member
        const groupMembersLabels = member.children[2];

        groupMembersLabels.insertAdjacentHTML('afterbegin', '<span class="admin"> Admin </span>')

        console.log('made member as a group admin')

    } catch (error) {
        console.log(error)
    }
}



//leave group functionality

const leaveGroupBtn = document.getElementById('leave-group')

leaveGroupBtn.addEventListener('click', leaveGroup)

async function leaveGroup(e) {
    try {
        console.log('leave group request is made')
        e.preventDefault();

        const groupId = document.getElementById('message-heading').children[0].textContent;
        const response = await axios.post('http://localhost:3000/chat/group/leave', { groupId: groupId })

        //remove the group from ui
        const activeGroup = Array.from(document.getElementsByClassName('active-group'))
        activeGroup[0].remove();

        document.getElementById('messages-coloumn').style.display = 'none'
        document.getElementById('messages-coloumn-guide').style.display = 'block'


    } catch (error) {
        console.log(error)
    }

}



//socket event on receiving message
socket.on('receiveMessage', async () => {

    try {

        console.log('receiveMessage socket event happened')

        let currentGroupId;
        if (document.getElementById('messages-coloumn-guide').style.display == 'none') {
            currentGroupId = document.getElementById('message-heading').children[0].textContent;
        }

        //getting last message id from messages stored in localstorage 

        const localStorageMessages = JSON.parse(localStorage.getItem('messages'))
        const lastMessage = localStorageMessages[localStorageMessages.length - 1]
        let lastMessageId;


        if (lastMessage == null) {
            lastMessageId = 0;

        }
        else {
            lastMessageId = lastMessage.id;
        }


        const response = await axios.get(`http://localhost:3000/chat/new-messages?lastMessageId=${lastMessageId}`)

        // const response = await axios.post('http://localhost:3000/chat/group/messages', { groupId: groupId, lastMessageId: lastMessageId })

        const messages = Array.from(response.data.messages);
        console.log(messages.length)

        //if there are new messsages

        if (messages.length) {

            const response1 = await axios.get('http://localhost:3000/chat/profile')
            const mobileNumber = response1.data.mobileNumber;

            messages.forEach((message) => {

                //store message into local storage
                let localStorageMessages = JSON.parse(localStorage.getItem('messages'))
               
                if (localStorageMessages.length >= 100) {
                 
                    localStorageMessages.shift();
                    localStorageMessages.push(message)
                    localStorage.setItem('messages',JSON.stringify(localStorageMessages) )
                }
                else {
                    localStorageMessages.push(message)
                    localStorage.setItem('messages',JSON.stringify(localStorageMessages))
                }


                //if message is from current opened group
                if (message.chatGroupId == currentGroupId) {
                    if (!message.fileURL) {
                        if (message.sender == mobileNumber) {
                            document.getElementById('messages-list').insertAdjacentHTML('beforeend', `<div id=${message.id} class="message outgoing" >
                                        <h3 class="sender">You</h3>
                                        <p>${message.text}</p>
                                        </div>`)
                        } else {
                            document.getElementById('messages-list').insertAdjacentHTML('beforeend', `<div id=${message.id} class="message incoming">
                                        <h3 class="sender">${message.sender}</h3>
                                        <p>${message.text}</p>
                                        </div>`)
                        }

                    }
                    else {

                        let mediaHTML;
                        if (message.type.includes('image')) {
                            mediaHTML = `<img src=${message.fileURL} alt="image" width="250" height="250">`
                        }
                        else if (message.type.includes('video')) {
                            mediaHTML = `<video width="320" height="240" controls>
                                        <source src=${message.fileURL} type="video/mp4">
                                        <source src=${message.fileURL} type="video/ogg">
                                      </video>`
                        }
                        else if (message.type.includes('audio')) {
                            mediaHTML = `<audio controls>
                                        <source src=${message.fileURL} type="audio/ogg">
                                        <source src=${message.fileURL} type="audio/mpeg">
                                      </audio>`
                        }
                        else if(message.type.includes('application')){
                            const filename = message.fileURL.substring(message.fileURL.lastIndexOf('/')+1);
                            mediaHTML=`<a href=${message.fileURL}><img class="document-file-icon" src="/images/doc.png" alt="Document"/> ${filename} </a>`
                        }

                        if (message.sender == mobileNumber) {
                            document.getElementById('messages-list').insertAdjacentHTML('beforeend', `<div id=${message.id} class="message outgoing" >
                                        <h3 class="sender">You</h3>
                                        ${mediaHTML}
                                        </div>`)
                        } else {
                            document.getElementById('messages-list').insertAdjacentHTML('beforeend', `<div id=${message.id} class="message incoming">
                                        <h3 class="sender">${message.sender}</h3>
                                        ${mediaHTML}
                                        </div>`)
                        }
                    }
                }

                else {
                  
                    //increase new messages count of the corresponding group
                    const group = document.getElementById(`group-${message.chatGroupId}`)
                    console.log(group)

                    if (group) {
                        let messageCountElement = group.children[2];
                        let messageCount=messageCountElement.innerText;
                        messageCountElement.style.display='block';
                        console.log(group.children[2])
                        console.log(group.children[2].innerText)

                        if (!messageCount) {
                            group.children[2].innerText = 1;
                        } else {
                            group.children[2].innerText = Number(messageCount) + 1;
                        }
                    }
                }


            })


            //scroll down
            const messagesList = document.getElementById('messages-list')
            messagesList.scrollTop = messagesList.scrollHeight;

        }



    } catch (error) {
        console.log(error)
    }

})


// file share functionality
const fileSharefrom = document.getElementById('file-share-form')

fileSharefrom.addEventListener('submit', sendFile)

async function sendFile(e) {

    try {

        e.preventDefault();
        const groupId = document.getElementById('message-heading').children[0].textContent;
        const file = document.getElementById('myFile').files[0]
        console.log(file)
        let formData = new FormData();
        formData.set('file', file);
        document.getElementById('file-share-message').textContent = 'Sending....'
        const response = await axios.post(`http://localhost:3000/chat/group/upload-file?groupId=${groupId}`, formData)
        const messageDetails = response.data.messageDetails;
        const fileURL = messageDetails.fileURL;

        //add socket event send message 
        socket.emit('sendMessage', () => {
            console.log('send message socket event is fired')
        })

        //showing file share success message
        document.getElementById('file-share-message').textContent = 'sent successfully'
        document.getElementById('myFile').value = '';
        setTimeout(() => {
            document.getElementById('file-share-message').textContent = ''
        }, 3000);

        console.log(fileURL)

    } catch (error) {
        console.log(error)
        //showing error message 
        document.getElementById('file-share-message').textContent = ''
        document.getElementById('file-share-error-message').textContent = '*something went wrong...'
        document.getElementById('myFile').value = ''
        setTimeout(() => {
            document.getElementById('file-share-error-message').textContent = ''
        }, 3000);
    }
}

