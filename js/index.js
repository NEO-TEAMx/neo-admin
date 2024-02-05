// const baseUrl = 'https://neoprotocol.onrender.com/api/v1/';
const baseUrl = 'http://localhost:4040/api/v1/admin';


function clearErrors(){
    const errMsg = document.getElementById('errorMsg');
    const successMsg = document.getElementById('successMsg')
    errMsg.textContent = '',
    successMsg.textContent =  ''
}

function displayError(msg){
    const errMsg = document.getElementById("errorMsg");
    errMsg.innerHTML += `<p class="text-center lead mb-4" >${msg}</p>`
    setTimeout(clearErrors, 5500)
    
}
function displaysuccess(msg){
    const errMsg = document.getElementById("successMsg");
    errMsg.innerHTML += `<p class="text-center lead mb-4" >${msg}</p>`
    setTimeout(clearErrors, 5500)
    
}

function setToken(val, expDur){
    localStorage.setItem('accessToken', val)
    localStorage.setItem('expires', expDur)
}


async function signup(){
    const usernameInput = document.querySelector("#username");
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");
    const confirmPasswordInput = document.querySelector("#confirmPassword");
    const formp = document.querySelector(".form");
    const btn = document.querySelector("#signup-btn");

    let usernameVal = usernameInput.value;
    let emailVal = emailInput.value;
    let passwordVal = passwordInput.value;
    let confirmPasswordVal = confirmPasswordInput.value

    clearErrors();

    // validate inputs
    if(!usernameVal || !emailVal || !passwordVal || !confirmPasswordVal){
        displayError('Please provide the needed value(s)')
        return;
        // throw new Error("Please provide the needed value")
    }

    if(passwordVal.length < 8){
        displayError('Password should be at least 8 characters')
        return;
        // throw new Error("Password should be at least 8 character")
    }

    if(passwordVal !== confirmPasswordVal){
        displayError("Passwiord and confirm password does not match!")
        // throw new Error("Password and confirm password does not match!")
        return;
    }

    //req payload
    const data = {
        username: usernameVal,
        email: emailVal,
        password: passwordVal,
        confirmPassword: confirmPasswordVal,
    }

    btn.textContent = 'Please wait.....';
    btn.disabled = true;
    formp.disabled = true;

    try {
        const response = await fetch(baseUrl+'/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });
        if(!response.ok){
            const resp = await response.json(); 
            displayError(resp.msg || 'Something went wrong!');
            
            btn.textContent = 'Sign up';
            btn.disabled = false;
            formp.disabled = false;
            return;
        }
        if (response.status === 200) {
            usernameVal = '',
            emailVal = '',
            passwordVal = '',
            confirmPasswordVal = ''
        }
        if(response.ok){
            const resp = await response.json();
            
            const accessToken = response.headers.get('Authorization')
            
            const expiraionTime = Date.now() + 2 * 24 *60 * 60 * 1000;
            
            setToken(accessToken, expiraionTime)
            displaysuccess("Registration successful")
            window.location.href = "../dashboard.html"
            
            usernameVal = '',
            emailVal = '',
            passwordVal = '',
            confirmPasswordVal = ''

            btn.textContent = 'Sign up';
            btn.disabled = false;
            formp.disabled = false;
           
            return  true;
        }else{
            return false;
        }
        
    } catch (error) {
        console.log(error)    
        btn.textContent = 'Sign up';
        btn.disabled = false;
        formp.disabled = false;
        // return;
        displayError('Error Occurred')
    }
}


async function login(){
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");
    const formp = document.querySelector(".form");
    const btn = document.querySelector("#loginBtn");

    let emailVal = emailInput.value;
    let passwordVal = passwordInput.value;
    
    clearErrors();

    // validate inputs
    if(!emailVal || !passwordVal){
        displayError('Please provide the needed value(s)')
        return;
    }

    //req payload
    const data = {
        email: emailVal,
        password: passwordVal,
    }

    btn.textContent = 'Please wait.....';
    btn.disabled = true;
    formp.disabled = true;

    
    try {
       const response = await fetch(baseUrl+'/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials:'include'
        });
        
        if(!response.ok){
            const resp = await response.json(); 
            displayError("Something Went Wrong");
            btn.textContent = 'Sign in';
            btn.disabled = false;
            formp.disabled = false;
            return;
        }
       
        if(response.ok){
            const resp = await response.json();
            
            const accessToken = response.headers.get('Authorization')
        
            
            const expiraionTime = Date.now() + 2 * 24 *60 * 60 * 1000;
            setToken(accessToken, expiraionTime)
            btn.textContent = 'Sign in';
            btn.disabled = false;
            formp.disabled = false;
            // displayError("")   
            displaysuccess("Logged in successfully")
            window.location.href = "../html/dashboard.html"
            
            emailVal = '',
            passwordVal = ''
            
            return;
        }
    } catch (error) {
        console.log(error)       
        btn.textContent = 'Sign in';
        btn.disabled = false;
        formp.disabled = false;
        displayError("Something went wrong. Try again")
        return;
    }
}


async function resetPassword(){
    const oldPassword = document.querySelector("#Opassword").value
    const newPassword = document.querySelector("#Npassword").value
    const confirmPassword = document.querySelector("#Cpassword").value
    const btn = document.querySelector("#resetBtn")


    if(!oldPassword||!newPassword||!confirmPassword){
        displayError("Please provide the needed value(s)")
        return;
    }
    if(await isAuthenticated()){
        const accessToken = localStorage.getItem("accessToken")

    const data = {
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
    }

    btn.textContent = 'Please wait.....';
    btn.disabled = true;

    try {
        const response = await fetch(baseUrl+'/update-password', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            },
            body: JSON.stringify(data),
            credentials:'include'
        });

        if(!response.ok){
            const resp = await response.json(); 
            if(resp.msg === "No user with such id"){
                    
                redirectToLogin()
            }
            if(resp.statusCode === 404){
                
                redirectToLogin()
            }
            displayError(resp.msg||"Something Went Wrong");
            btn.textContent = 'Change Password';
            btn.disabled = false;
            return;
        }

        if(response.ok){
            const resp = await response.json();

            btn.textContent = 'Change Password';
            btn.disabled = false;
            displaysuccess(resp.msg)
            window.location.href = "../dashboard.html"

            oldPassword = "",
            newPassword = "",
            confirmPassword = ""

            return;
        }


    } catch (error) {
        console.log(error)
        // displayError("Error Occurred")
        return;
    }
    }else{
        redirectToLogin()
    }
}


async function ShowMe(){
    
    if(await isAuthenticated()){
        const accessToken = localStorage.getItem("accessToken")
        
        try {
            
            const response = await fetch(baseUrl+"/show-me",{
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken
                },
                credentials: 'include'
            });
            
            if(!response.ok){
                const resp = await response.json(); 
                if(resp.msg === "No user with such id"){
                    
                    redirectToLogin()
                }
                if(resp.statusCode === 404){
                
                    redirectToLogin()
                }
                return;
            }

            if(response.ok){
                const data = await response.json();

                

                const {
                    username,
                    email,
                    adminType,
                    role
                } = data.admin

                // console.log(adminType)
                document.querySelector("#Ademail").value = email,
                document.querySelector("#Adusername").value = username,
                document.querySelector("#AdadminType").value = adminType,
                document.querySelector("#Adrole").value = role

                return;
            }



        } catch (error) {
            console.log(error)
        }
    }else{
        redirectToLogin();
    }
}


window.onload = ShowMe;