document.addEventListener('DOMContentLoaded', function() {
    
    const industryNavLinks = document.querySelectorAll('.sidebar-nav a[data-industry]');
    const dashboardContents = document.querySelectorAll('.dashboard-content');

    industryNavLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();

            const targetIndustry = this.getAttribute('data-industry');

            // 1. Update active state in sidebar
            industryNavLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');

            // 2. Hide all dashboard content panels
            dashboardContents.forEach(content => content.classList.add('hidden'));

            // 3. Show the target dashboard
            const targetDashboard = document.getElementById(`dashboard-${targetIndustry}`);
            if (targetDashboard) {
                targetDashboard.classList.remove('hidden');
            }

            // Optional: Update user profile/header based on industry
            updateHeaderForIndustry(targetIndustry);
        });
    });

    function updateHeaderForIndustry(industry) {
        const userNameEl = document.querySelector('.user-name');
        const searchBarInput = document.querySelector('.search-bar input');

        switch(industry) {
            case 'healthcare':
                userNameEl.textContent = 'Dr. Emily Carter';
                searchBarInput.placeholder = 'Search for patients, records, staff...';
                break;
            case 'retail':
                userNameEl.textContent = 'Alex Johnson';
                searchBarInput.placeholder = 'Search for products, orders, customers...';
                break;
            case 'finance':
                userNameEl.textContent = 'Maria Garcia';
                searchBarInput.placeholder = 'Search for transactions, clients, reports...';
                break;
            case 'logistics':
                userNameEl.textContent = 'David Chen';
                searchBarInput.placeholder = 'Search for shipments, drivers, routes...';
                break;
            default:
                userNameEl.textContent = 'Admin User';
                searchBarInput.placeholder = 'Search...';
        }
    }
});