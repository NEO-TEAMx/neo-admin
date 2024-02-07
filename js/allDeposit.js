const baseUrl = 'https://neoprotocol.onrender.com/api/v1/admin';
// const baseUrl = 'http://localhost:4040/api/v1/admin';


function clearErrors(){
    const errMsg = document.getElementById("errorMsg");
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






async function allDeposit(){
    const tablebody = document.querySelector("#allTable");

    if(await isAuthenticated()){

        try {
            const accessToken = localStorage.getItem("accessToken")

            const response = await fetch(baseUrl+"/all-deposit",{
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
                    deposit
                } = data
                
                if(deposit.length < 1){
                    const emptyRow = document.createElement('tr')
                    const emptyCell = document.createElement('td')
                    emptyCell.setAttribute('colspan', 2)
                    emptyCell.textContent = "No deposit currently"
                    emptyRow.appendChild(emptyCell)
                    emptyCell.appendChild(emptyRow)
                }else{

                    deposit.forEach(data => {
                        const parsedDate = moment(data.date);
                        const formattedTime = parsedDate.format('DD/MM/YYYY')

                        const row = document.createElement("tr");
                        const display = ["date","amount", "email","transaction_id", "approved"]
                        display.forEach(column =>{
                            const cell = document.createElement("td");
                            cell.textContent = column === 'date' ? formattedTime : column === 'approved' ? (data[column] ? 'Approved' : 'Pending') : data[column];
                            row.appendChild(cell)
                        });
                        tablebody.appendChild(row)
                    });
                }

                
            }

        } catch (error) {
            console.log(error)
        }

    }else{
        redirectToLogin()
    }


}

window.onload = allDeposit;
