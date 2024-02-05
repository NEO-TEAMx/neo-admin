async function isAuthenticated() {
    const accessToken = localStorage.getItem('accessToken');
    if(accessToken){
        const expiraionTime = localStorage.getItem('expires')
        if(expiraionTime && Date.now() > parseInt(expiraionTime, 10)){
            const newToken = await response.headers.get('Authorization')
            if(newToken){
                setToken(newToken, calcExpTime())
                return true
            }else{
                clearToken();
                redirectToLogin();
                return false;
            }
        }
        return true;
    }
    redirectToLogin();
    return false;
}

function redirectToLogin(){
    window.location.href = '../../index.html'
};


function clearToken(){
    localStorage.removeItem('accessToken')
    localStorage.removeItem('expires')
}

function calcExpTime(){
    const expiraionTime = Date.now() + 2 * 24 *60 * 60 * 1000;
    return expiraionTime;
}

document.addEventListener('DOMContentLoaded', isAuthenticated());
