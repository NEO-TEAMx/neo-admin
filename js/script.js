const sidebarToggle = document.querySelector("#sidebar-toggle");
sidebarToggle.addEventListener("click",function(){
    document.querySelector("#sidebar").classList.toggle("collapsed");
});

document.querySelector(".theme-toggle").addEventListener("click",() => {
    toggleLocalStorage();
    toggleRootClass();
});

function toggleRootClass(){
    const current = document.documentElement.getAttribute('data-bs-theme');
    const inverted = current == 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme',inverted);
}

function toggleLocalStorage(){
    if(isLight()){
        localStorage.removeItem("light");
    }else{
        localStorage.setItem("light","set");
    }
}

function isLight(){
    return localStorage.getItem("light");
}

if(isLight()){
    toggleRootClass();
}

document.getElementById('viewAllBtn').addEventListener('click', function() {
  window.location.href = '../html/total-users.html';
});

document.getElementById('viewAllBtn1').addEventListener('click', function() {
  window.location.href = '../html/active-users.html';
});

document.getElementById('viewAllBtn2').addEventListener('click', function() {
  window.location.href = '';
});

document.getElementById('viewAllBtn3').addEventListener('click', function() {
  window.location.href = '../html/deposits/all-deposits.html';
});

document.getElementById('viewAllBtn4').addEventListener('click', function() {
  window.location.href = '../html/deposits/pending-deposits.html';
});

document.getElementById('viewAllBtn5').addEventListener('click', function() {
  window.location.href = '../html/withdraw/all-withdrawals.html';
});

document.getElementById('viewAllBtn6').addEventListener('click', function() {
  window.location.href = '../html/withdraw/pending-withdrawals.html';
});

document.getElementById('viewAllBtn7').addEventListener('click', function() {
  window.location.href = '';
});

    // Trigger glowing effect for notification icon (you can modify this as needed)
    function triggerGlowEffect() {
      $(".notification-badge").addClass("glow");
      setTimeout(function () {
        $(".notification-badge").removeClass("glow");
      }, 3000); // Adjust the duration of the glowing effect as needed (in milliseconds)
    }

    // Example: Trigger the glowing effect on page load
    // You can trigger this based on new messages or events in your website
    $(document).ready(function () {
      triggerGlowEffect(); // This is just an example; you can call this function as needed
    });


// Retrieve the canvas element
var ctx = document.getElementById('depositChart').getContext('2d');

// Sample data (replace with your actual data)
var depositData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'july', 'August', 'September', 'October', 'November', 'December',],
  datasets: [{
    label: 'User Deposits',
    data: [500, 800, 1000, 700, 1200, 900, 1300, 1500, 800],
    backgroundColor: 'rgba(54, 162, 235, 0.2)', 
    borderColor: '#00d664',
    borderWidth: 2,
    pointBackgroundColor: 'red',
    pointRadius: 5,
    pointHoverRadius: 7,
    tension: 0.4,
  }]
};

// Create a new line chart instance
var depositChart = new Chart(ctx, {
  type: 'line',
  data: depositData,
  options: {
    scales: {
      y: {
        beginAtZero: true,           
        ticks: {
          color: '#00d664' 
        }
      },
      x: {
        ticks: {
          color: '#00d664' 
        }
      }
    },
    
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            var label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += '$' + context.parsed.y.toFixed(2);
            }
            return label;
          }
        }
      },
      title: {
        display: true,
        text: 'User Deposits', // Set the chart title
        color: '#00d664' // Change the color of the chart title
      }
    },
    elements: {
      line: {
        tension: 0.4, 
        backgroundColor: 'red', 
        borderColor: 'green',
        borderWidth: 2 
      }
    },
    // Other chart customization options can be added here
  }
});




