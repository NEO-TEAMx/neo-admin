const baseUrl = 'https://neoprotocol.onrender.com/api/v1/admin';
// const baseUrl = 'http://localhost:4040/api/v1/admin';


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



async function fetchUserData(){
    if (await isAuthenticated()) {
        try {
            const accessToken = localStorage.getItem("accessToken")
            
            const response = await fetch(baseUrl+"/get-all-users",{
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
                displayError("Error Occurred")
                return;
                
            }
            if(response){
                const data = await response.json();
                // console.log(data.users)
                return data.users
            }
        } catch (error) {
            console.log(error)
            return []
        }
    } else {
        redirectToLogin()
    }
}

function renderUserRow(user){
    const row = document.createElement("tr");
    const emailCell = document.createElement("td")
    const usernameCell = document.createElement("td")
    const balanceCell = document.createElement("td")
    const creditCell = document.createElement("td")
    const btnCell = document.createElement("td")

    emailCell.textContent = user.email;
    row.appendChild(emailCell)
    usernameCell.textContent = user.username;
    row.appendChild(usernameCell)
    balanceCell.textContent = user.total_balance;
    row.appendChild(balanceCell)
    
    const creditInput = document.createElement("input")
    creditInput.type = "number";
    creditCell.appendChild(creditInput)
    row.appendChild(creditCell)

    const btn = document.createElement("button")
    btn.textContent = "Credit"
    btn.addEventListener('click', () => creditUser(user._id, creditInput.value));
    btnCell.appendChild(btn);
    row.appendChild(btnCell)

    return row;
}

async function creditUser(userId, creditAmount){
    if(await isAuthenticated()){
        try {
            const accessToken = localStorage.getItem("accessToken")

            if(!creditAmount){
                displayError("Provide amount")
                return;
            }

            const data = {
                amount: parseInt(creditAmount)
            }

            const response = await fetch(baseUrl+`/add-deposit/${userId}`,{
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken
                },
                credentials: 'include',
                body: JSON.stringify(data)
            });

            if(!response.ok){
                const resp = await response.json(); 
                if(resp.msg === "No user with such id"){
                    
                    redirectToLogin()
                }
                if(resp.statusCode === 404){
                
                    redirectToLogin()
                }
                displayError(resp.msg || "Error Occurred")
                return;
            }

            if(response.ok){
                const resp = await response.json(); 

                console.log("successfully")
                displaysuccess(resp.msg || "Credited successfully")
                window.location.reload()
            }

        } catch (error) {
            console.log(error)
        }
    }else{
        redirectToLogin()
    }
}

async function renderUser(){
    const users = await fetchUserData()
    // console.log(users)
    const userTableBody = document.querySelector("#tables")
    
    users.forEach(user => {
        const row = renderUserRow(user);
        // console.log(user.total_balance)
        userTableBody.appendChild(row)
    });
};


window.onload = renderUser