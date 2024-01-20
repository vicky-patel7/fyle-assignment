let currentPage = 1;
let reposPerPage = 10; // Default value
let repoUrl = '';
let totalRepos = 0;

function searchUserDetails() {
    document.querySelector('.loader').classList.remove('invisible');
    const username = document.querySelector('#username').value;
    if (username) {
        fetch(`https://api.github.com/users/${username}`)
            .then((response) => response.json())
            .then((response) =>
                showUserDetails(response)
            )
            .catch(err => console.log(err));
    }
}

function showUserDetails(data) {
    const existingProfile = document.querySelector('.profile-details');
    if (existingProfile) {
        existingProfile.innerHTML = '';
    }
    const profile = document.createElement('div');
    profile.classList.add('row');
    repoUrl = data.repos_url;
    let html = `
        <div class="row">
            <div class="col-md-4">
                <img src= ${data.avatar_url} alt="Profile Image" class="img-fluid rounded-circle mb-3">
            </div>
            <div class="col-md-8">
                <h2 class="mb-3">${data.name}</h2>
                <p><strong>Bio:</strong> ${data.bio && data.bio}</p>
                <p><strong>Followers :</strong> ${data.followers}  <strong>Following : </strong> ${data.following}</p>
                <hr>
                <div class="mb-3">
                    <a href= ${data.html_url} class="btn btn-outline-primary mr-2">GitHub</a>
                    <button onclick="showRepository('${data.repos_url}?page=${currentPage}&per_page=${reposPerPage}')" class="btn btn-outline-info mr-2">See All Repos</button>
                </div>
            </div>
        </div>
    `
    profile.innerHTML = html;
    document.querySelector('.profile-details').appendChild(profile);
    document.querySelector('.loader').classList.add('invisible');
}


async function listRepositories(data) {
    const existingRepos = document.querySelector('.repository');
    if (existingRepos) {
        existingRepos.innerHTML = '';
    }
    const reposList = document.createElement('div');
    reposList.classList.add('row');
    reposList.classList.add('my-2');
    reposList.classList.add('repo-list');
    totalRepos = data.length;
    for (const repo of data) {
        const repoItem = document.createElement('div');
        repoItem.classList.add('col-md-4');
        repoItem.classList.add('my-2');
        const desiredHeight = '300px';
        repoItem.style.maxHeight = desiredHeight;
        let html = `
            <div class="card">
                <div class="card-header">
                <strong>Title : </strong> <br>
                    ${repo.name}
                </div>
                <div class="card-body">
                    <strong>Description : </strong> <br>
                    ${repo.description}
                </div>
                <div class="card-footer">
                    <strong>Languages : </strong> <br>
                    ${repo.language}
                </div>
            </div>
        `
        repoItem.innerHTML = html;
        reposList.appendChild(repoItem);
    }
    document.querySelector('.repository').appendChild(reposList);
}


// Fetch all repositories from the user and then list all the repos using the helper function
function showRepository(repos_url) {
    if (repos_url) {
        fetch(repos_url)
            .then((response) => response.json())
            .then((response) => listRepositories(response))
            .catch((err) => { console.log(err) });
    }
}


// updating the repository list on the page on the change of the per page repo count
document.getElementById('perPageSelect').addEventListener('change', function () {
    reposPerPage = parseInt(this.value, 10);
    currentPage = 1;
    showRepository(`${repoUrl}?page=${currentPage}&per_page=${reposPerPage}`);
});


// changing the repositories list on the change of the pagination button
function updatePage(pageNumber) {

    console.log(pageNumber);
    showRepository(`${repoUrl}?page=${pageNumber}&per_page=${reposPerPage}`);
    // Update the pagination buttons
    if (currentPage > 3) {
        document.querySelectorAll('.page-link')[1].innerHTML = currentPage - 1;
        document.querySelectorAll('.page-link')[2].innerHTML = currentPage;
        document.querySelectorAll('.page-link')[3].innerHTML = currentPage + 1;
    } else {
        document.querySelectorAll('.page-link')[1].innerHTML = 1;
        document.querySelectorAll('.page-link')[2].innerHTML = 2;
        document.querySelectorAll('.page-link')[3].innerHTML = 3;
    }
}

// Call updatePage whenever the page changes
document.querySelectorAll('.page-link').forEach(link => {
    link.addEventListener('click', (e) => {
        if (repoUrl) {
            e.preventDefault();
            let pagePressed = e.target.innerHTML;
            if (pagePressed === 'Previous') {
                if (currentPage > 1) {
                    currentPage -= 1;
                    updatePage(currentPage);
                }
            } else if (pagePressed === 'Next') {
                currentPage = currentPage + 1;
                updatePage(currentPage);
            } else {
                currentPage = parseInt(e.target.innerHTML);
                updatePage(currentPage);
            }
        }
    });
});