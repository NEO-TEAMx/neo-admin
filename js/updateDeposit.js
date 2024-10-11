// const baseUrl = 'https://neoprotocol.onrender.com/api/v1/admin';
// const baseUrl = 'http://localhost:4040/api/v1/admin';
const baseUrl = 'https://neo-protocol.com/api/v1/admin';

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

async function fetchAllDeposit(){
    

    if(await isAuthenticated()){
        const accessToken = getCookie("accessToken")
        const refreshToken = getCookie("refreshToken")
        
        try {
            
            const response = await fetch(baseUrl+"/all-deposit",{
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'AccessToken': accessToken,
                    'Refresh_Token': refreshToken,
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

            if(response.ok){
                const data = await response.json();

                const {
                    deposit
                } = data;

                // console.log(deposit)
                return deposit;

               
                
            }

        } catch (error) {
            console.log(error)
            return []
        }

    }else{
        redirectToLogin()
    }


}

function renderUserRow(deposit){
    const row = document.createElement("tr");
    const dateCell = document.createElement("td")
    const emailCell = document.createElement("td")
    const amountCell = document.createElement("td")
    const trxn_idCell = document.createElement("td")
    const statusCell = document.createElement("td")
    const btnCell = document.createElement("td")

    // const parsedDate = moment(data.date);
    // const formattedTime = parsedDate.format('DD/MM/YYYY')

    // cell.textContent = column === 'date' ? formattedTime : column === 'approved' ? (data[column] ? 'Approved' : 'Pending') : data[column];
    // row.appendChild(cell)


    dateCell.textContent = moment(deposit.date).format("DD/MM/YYYY")
    row.appendChild(dateCell)
    emailCell.textContent = deposit.email;
    row.appendChild(emailCell)
    amountCell.textContent = deposit.amount;
    row.appendChild(amountCell)
    trxn_idCell.textContent = deposit.transaction_id;
    row.appendChild(trxn_idCell)
    statusCell.textContent = deposit.approved;
    row.appendChild(statusCell)
    
    const btn = document.createElement("button")
    btn.textContent = "Update"
    btn.addEventListener('click', () => updateStatus(deposit._id));
    btnCell.appendChild(btn);
    row.appendChild(btnCell)

    return row;
}



async function updateStatus(depositId){
    if(await isAuthenticated()){
        const accessToken = getCookie("accessToken")
        const refreshToken = getCookie("refreshToken")
        
        try {
            

         
            const data = {
                approved: true
            }

            const response = await fetch(baseUrl+`/approve-deposit/${depositId}`,{
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'AccessToken': accessToken,
                    'Refresh_Token': refreshToken,
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

                // console.log("successfully")
                displaysuccess(resp.msg || "Deposit successfully approved")
                window.location.reload();
            }

        } catch (error) {
            console.log(error)
        }
    }else{
        redirectToLogin()
    }
}

async function renderDeposits(){
    const deposits = await fetchAllDeposit()
    // console.log(deposits)
    const depositTableBody = document.querySelector("#upTable")
    
    deposits.forEach(deposit => {
        const row = renderUserRow(deposit);
        // console.log(deposit)
        depositTableBody.appendChild(row)
    });
};

window.onload = renderDeposits;