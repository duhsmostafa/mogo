
function toggleMenu(x) {
    var menu = document.querySelector('.side-menu');
    var overlay = document.querySelector('.overlay');

    menu.classList.toggle('show');
    overlay.classList.toggle('show'); 

    // Check if the menu is now visible
    if (menu.classList.contains('show')) {
        x.classList.add("change");  // Add change class to indicate the menu is open
    } else {
        x.classList.remove("change");  // Remove change class if the menu is closed
    }
}

// Close the menu and overlay when clicking outside of the menu
document.addEventListener('click', function (event) {
    var menu = document.querySelector('.side-menu');
    var hamburger = document.querySelector('.contaner'); // Assuming this is the hamburger button
    var overlay = document.querySelector('.overlay');

    // Check if the click was outside the menu and hamburger
    if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
        menu.classList.remove('show');
        overlay.classList.remove('show');  // Hide the overlay

        // Reset the hamburger menu back to bars
        hamburger.classList.remove('change');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const subscriptionForm = document.getElementById('subscription-form');
    const subscriptionEmailInput = document.getElementById('subscription-email');

    if (subscriptionForm && subscriptionEmailInput) {
        subscriptionForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent default form submission

            const email = subscriptionEmailInput.value;

            // Send a POST request to the API using Axios
            axios.post('https://web-agent.ultratech-plus.com/notifications/subscribe', {
                email: email
            })
                .then(function (response) {
                    // Create the success message
                    const successMessage = document.createElement('div');
                    successMessage.textContent = 'Thank you for subscribing!';
                    successMessage.classList.add('success-message');

                    // Append the success message to the body or a specific container
                    document.body.appendChild(successMessage);

                    // Set a timeout to remove the message after 3 seconds
                    setTimeout(() => {
                        successMessage.remove();
                    }, 3000);

                    subscriptionEmailInput.value = ''; // Clear the input field after submission
                })
                .catch(function (error) {
                    console.error(error);
                    const errorMessage = document.createElement('div');
                    errorMessage.textContent = 'There was an error with your subscription. Please try again.';
                    errorMessage.classList.add('error-message');

                    document.body.appendChild(errorMessage);

                    setTimeout(() => {
                        errorMessage.remove();
                    }, 3000);
                });
        });
    }
});

const searchInput = document.getElementById("searchInput");
let careersData = [];
fetch('https://web-agent.ultratech-plus.com/departments')
    .then((response) => response.json())
    .then((data) => {
        const departmentsList = document.getElementById('departmentsList');
        data.forEach((department) => {
            const listItem = document.createElement('li');
            const linkItem = document.createElement('a');
            linkItem.className = 'dropdown-item';
            linkItem.textContent = department.name;
            linkItem.href = '#'; // Avoid refreshing the page
            linkItem.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default link behavior
                document.getElementById('departmentsDropdown').innerHTML = department.name;
                searchInput.value = '';
                console.log(event, department.name);
                let filteredCareers = careersData?.filter(item => item?.category?.department?.name === department.name);
                displayCareers(filteredCareers);
            });
            listItem.appendChild(linkItem);
            departmentsList.appendChild(listItem);
        });
    })
    .catch((error) => {
        console.error('Error fetching departments:', error);
        document.getElementById('departmentsList').innerHTML =
            '<li><a class="dropdown-item text-danger">Error loading departments</a></li>';
    });

fetch("https://web-agent.ultratech-plus.com/careers")
    .then((response) => response.json())
    .then((data) => {
        // Ensure that the data is an array
        if (Array.isArray(data)) {
            careersData = data;
            displayCareers(careersData);
        } else {
            console.error("Fetched data is not an array:", data);
        }
    })
    .catch((err) => console.error("Error fetching careers:", err));

function displayCareers(careers) {
    const container = document.querySelector(".careerrs-inner-container");
    container.innerHTML = "";
    // Check if careers is an array
    if (Array.isArray(careers)) {
        careers.forEach((job) => {
            const jobDiv = document.createElement("div");
            jobDiv.className = "careerrs-inner";
            jobDiv.style.cssText = `
                background-color: #151515;
                padding: 100px 50px;
                width: 30%;
                border-radius: 20px;
                margin: 10px;
                text-align: center;
                cursor: pointer;
                transition: background-color 0.3s, color 0.3s;
                font-family:'Nebulica';
                font-weight: 700;
                font-size:16px;
                text-align:center;
            `;

            jobDiv.innerHTML = `<h2 style="color: white;">${job.title}</h2>`;

            jobDiv.addEventListener("click", () => {
                window.location.href = `innerPage.html?id=${job.id}`;
            });

            jobDiv.addEventListener('mouseover', () => {
                jobDiv.style.backgroundColor = '#1d74ff';
                jobDiv.querySelector('h2').style.color = 'black';
            });

            jobDiv.addEventListener('mouseout', () => {
                jobDiv.style.backgroundColor = '#151515';
                jobDiv.querySelector('h2').style.color = 'white';
            });

            container.appendChild(jobDiv);
        });
    } else {
        console.error("Careers data is not an array:", careers);
    }
}

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();

    if (query === "") {
        document.getElementById('departmentsDropdown').innerHTML = 'Teams';
        displayCareers(careersData);
    } else {
        const filteredCareers = careersData.filter((career) => {
            return career.title.toLowerCase().includes(query);
        });

        displayCareers(filteredCareers);
    }
});

function reloadData(name = undefined) {
    searchInput.value = '';
    if (name) {
        document.getElementById('departmentsDropdown').innerHTML = name;
    }
    displayCareers(careersData);
}
