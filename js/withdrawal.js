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

async function fetchAllWithdrawal(){
    

    if(await isAuthenticated()){
        const accessToken = getCookie("accessToken")
        const refreshToken = getCookie("refreshToken")
        
        try {
            
            const response = await fetch(baseUrl+"/all-withdrawal",{
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
                    withdrawal
                } = data;

                // console.log(withdrawal)
                return withdrawal;

                
                
            }

        } catch (error) {
            console.log(error)
            return []
        }

    }else{
        redirectToLogin()
    }


}

function renderUserRow(withdrawal){
    const row = document.createElement("tr");
    const dateCell = document.createElement("td")
    const emailCell = document.createElement("td")
    const amountCell = document.createElement("td")
    const trxn_idCell = document.createElement("td")
    const walletCell = document.createElement("td")
    const statusCell = document.createElement("td")
    const btnCell = document.createElement("td")

    // const parsedDate = moment(data.date);
    // const formattedTime = parsedDate.format('DD/MM/YYYY')

    // cell.textContent = column === 'date' ? formattedTime : column === 'approved' ? (data[column] ? 'Approved' : 'Pending') : data[column];
    // row.appendChild(cell)


    dateCell.textContent = moment(withdrawal.date).format("DD/MM/YYYY")
    row.appendChild(dateCell)
    emailCell.textContent = withdrawal.email;
    row.appendChild(emailCell)
    amountCell.textContent = withdrawal.payable_amount;
    row.appendChild(amountCell)
    trxn_idCell.textContent = withdrawal.transaction_id;
    row.appendChild(trxn_idCell)
    walletCell.textContent = withdrawal.walletAddress;
    row.appendChild(walletCell)
    statusCell.textContent = withdrawal.approved;
    row.appendChild(statusCell)
    
    const btn = document.createElement("button")
    btn.textContent = "Update"
    btn.addEventListener('click', () => updateStatus(withdrawal._id));
    btnCell.appendChild(btn);
    row.appendChild(btnCell)

    return row;
}



async function updateStatus(withdrawalId){
    if(await isAuthenticated()){
        const accessToken = getCookie("accessToken")
        const refreshToken = getCookie("refreshToken")
        
        try {
         
            const data = {
                approved: true
            }

            const response = await fetch(baseUrl+`/approve-withdrawal/${withdrawalId}`,{
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
    const withdrawals = await fetchAllWithdrawal()
    // console.log(withdrawals)
    const withdrawalTableBody = document.querySelector("#upwTable")
    
    withdrawals.forEach(withdrawal => {
        const row = renderUserRow(withdrawal);
        // console.log(withdrawal)
        withdrawalTableBody.appendChild(row)
    });
};

window.onload = renderDeposits;