
// adding an event listener to login button 
const headerLoginBtn = document.getElementById('header-login-btn')

headerLoginBtn.addEventListener('click', openLoginFormModal)

async function openLoginFormModal(e) {

    try {
        if (e.target.classList.contains('login-btn')) {

            console.log(' inside openLoginFormModal function')

            const loginModal = document.getElementById('login-modal')

            loginModal.style.display = 'block';
        }

    } catch (error) {
        console.log(error)
    }

}


// adding an event listener to signup button 
const headerSignupBtn = document.getElementById('header-signup-btn')

headerSignupBtn.addEventListener('click', openSignupFormModal)

async function openSignupFormModal(e) {

    try {
        if (e.target.classList.contains('signup-btn')) {

            console.log(' inside openSignupFormModal function')

            const signupModal = document.getElementById('signup-modal')
            
            signupModal.style.display = 'block';
        }

    } catch (error) {
        console.log(error)
    }

}


// Get the modal

let loginModal = document.getElementById("login-modal");
let signupModal = document.getElementById("signup-modal");
let forgotPasswordModal = document.getElementById('forgot-password-modal')


// Get the <span> element that closes the modal
let closeButton = document.getElementsByClassName("close");


// When the user clicks on close button (x), close the modal
Array.from(closeButton).forEach((element) => {
    element.addEventListener('click', closeModal)

})


function closeModal() {
    loginModal.style.display = "none";
    signupModal.style.display = 'none';
    forgotPasswordModal.style.display = 'none'

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
    document.getElementById('login-email').value = '';
    document.getElementById('name').value = '';
    document.getElementById('mobile-number').value = '';
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-password').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('forgot-password-email').value = '';
}