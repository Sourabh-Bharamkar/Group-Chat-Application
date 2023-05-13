
const loginForm = document.getElementById('login-form')

//adding event listener to login form on submit
loginForm.addEventListener('submit', login)


async function login(e) {

    try {

        e.preventDefault();
        // get the form input values
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const userDetails = {
            email: email,
            password: password
        }

        // verify the email id and password

        const response = await axios.post('http://3.91.209.187:3000/user/login/verify', userDetails)

        console.log(response.data)
        console.log(response.data.message)

        if (response.data.message == 'user not found') {
            window.alert(`User not found!`)
            clearInputFields();

            return;
        }

        window.alert('Login successful!!')
        localStorage.setItem('token', response.data.token)
        // localStorage.serItem('mobileNumber',response.data.mobileNumber)
        clearInputFields();
        window.location='/chats'

    }
    catch (error) {

        if (error.response.data.message == 'password is incorrect') {
            document.getElementById('login-password-error').textContent = "* Password is incorrect"

            setTimeout(() => {
                document.getElementById('login-password-error').textContent = ""
            }, 5000)
            document.getElementById('login-password').value = "";
            return;
        }

    }

}

//function to cleat input fields
function clearInputFields() {

    document.getElementById('login-email').value = ""
    document.getElementById('login-password').value = ""

}


//after clicking on signup here link,open signup modal
document.getElementById('signup-here-link').addEventListener('click', (e) => {
    e.preventDefault()
    //close the login modal and open signup modal
    const loginModal = document.getElementById('login-modal')
    const signupModal = document.getElementById('signup-modal')
    loginModal.style.display = 'none'
    signupModal.style.display = 'block';
})


// after clicking on forgot password link,open forgot-password modal

const forgotPasswordLink = document.getElementById('forgot-password');

forgotPasswordLink.addEventListener('click', openForgotPasswordModal)

async function openForgotPasswordModal(e) {
    try {
        e.preventDefault();
        //open modal for forget password and close the login modal

        const loginModal = document.getElementById('login-modal')
        const forgotPassworddModal = document.getElementById('forgot-password-modal')
        loginModal.style.display = 'none';
        forgotPassworddModal.style.display = 'block';

    } catch (error) {
        console.log(error)
    }

}


// adding event listener to forgot password form on submit 

const forgotPasswordForm = document.getElementById('forgot-password-form')

forgotPasswordForm.addEventListener('submit', recoverPassword)

async function recoverPassword(e) {

    try {
        e.preventDefault();
        const email = document.getElementById('forgot-password-email').value;
        const response = await axios.post('http://3.91.209.187:3000/user/password/forgot-password', { email: email })
        const forgotPassworddModal = document.getElementById('forgot-password-modal')
        document.getElementById('forgot-password-email').value = '';
        forgotPassworddModal.style.display = 'none';

    } catch (error) {
        console.log(error)
    }

}