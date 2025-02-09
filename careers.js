function toggleMenu(x) {
    var menu = document.querySelector('.side-menu');
    var overlay = document.querySelector('.overlay');
    menu.classList.toggle('show');
    overlay.classList.toggle('show');  

    if (menu.classList.contains('show')) {
        x.classList.add("change");  
    } else {
        x.classList.remove("change");
    }
}

document.addEventListener('click', function (event) {
    var menu = document.querySelector('.side-menu');
    var hamburger = document.querySelector('.contaner'); 
    var overlay = document.querySelector('.overlay');

    if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
        menu.classList.remove('show');
        overlay.classList.remove('show');  

        hamburger.classList.remove('change');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const subscriptionForm = document.getElementById('subscription-form');
    const subscriptionEmailInput = document.getElementById('subscription-email');

    if (subscriptionForm && subscriptionEmailInput) {
        subscriptionForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const email = subscriptionEmailInput.value;
            axios.post('https://web-agent.ultratech-plus.com/notifications/subscribe', {
                email: email
            })
                .then(function (response) {
                    const successMessage = document.createElement('div');
                    successMessage.textContent = 'Thank you for subscribing!';
                    successMessage.classList.add('success-message');

                    document.body.appendChild(successMessage);
                    setTimeout(() => {
                        successMessage.remove();
                    }, 3000);

                    subscriptionEmailInput.value = ''; 
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
            linkItem.href = '#'; 
            linkItem.addEventListener('click', (event) => {
                event.preventDefault();
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
    if (Array.isArray(careers)) {
        careers.forEach((job) => {
            const jobDiv = document.createElement("div");
            jobDiv.className = "careerrs-inner";
            jobDiv.style.cssText = `
                padding: 100px 50px;
                width: 30%;
                border-radius: 20px;
                margin: 10px;
                text-align: center;
                cursor: pointer;
                font-weight: 700;
                font-size:16px;
                text-align:center;
            `;

            jobDiv.innerHTML = `<h2 style="color: white;">${job.title}</h2>`;

            jobDiv.addEventListener("click", () => {
                window.location.href = `innerPage.html?id=${job.id}`;
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

