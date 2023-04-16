
const resetPasswordForm = document.getElementById('reset-password-form')

resetPasswordForm.addEventListener('submit', resetPassword)

async function resetPassword(e) {
    try {

        e.preventDefault();
        const newPassword = document.getElementById('new-password').value
        const confirmNewPassword = document.getElementById('confirm-new-password').value

        if (newPassword.length < 8 || newPassword.length > 20) {
            document.getElementById('reset-password-error').textContent = "* Passwords must be between 8 and 20 characters long."

            setTimeout(() => {
                document.getElementById('reset-password-error').textContent = ""
            }, 5000)

            return;
        }

        if (newPassword != confirmNewPassword) {
            document.getElementById('reset-password-error').textContent = "* Passwords do not match."

            setTimeout(() => {
                document.getElementById('reset-password-error').textContent = ""
            }, 5000)

            return;
        }

        const url = new URL(
            `${window.location.href}`
        );
        const forgotPasswordRequestId = url.searchParams.get('forgotPasswordRequestId')

        const response = await axios.post('http://localhost:3000/user/password/reset-password', { password: newPassword, forgotPasswordRequestId: forgotPasswordRequestId })

        if(response.data.message=='password reset successfully')
        {
            clearInputFields();
            document.getElementById('reset-password-form-message').textContent='Password reset successfullly'
            setTimeout(()=>{
                document.getElementById('reset-password-form-message').textContent=''
                clearInputFields()
                window.location='http://localhost:3000/'
            },2000)
            
        }

    } catch (error) {

    }

}

function clearInputFields() {
    const newPassword = document.getElementById('new-password').value
    const confirmNewPassword = document.getElementById('confirm-new-password').value

    newPassword.value = "";
    confirmNewPassword.value = "";
}

