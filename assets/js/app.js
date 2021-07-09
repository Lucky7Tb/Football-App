const BASE_URL = {
    football: {
        api: "https://api.football-data.org/v2",
        key: "c6caaad59ba24c929c988a620dc8a761"
    },
    news: {
        api: "https://newsapi.org/v2",
        key: "0f1c27606fd34cecbb18d41af46b7d08"
    }
}

function searchTeamByLeague(form) {
    const leagueId = form.value;
    const loading =  document.querySelector(".progress");
    const table = document.querySelector("#top-team-table");

    loading.style.display = "";

    if("caches" in window){
        caches.match(`${BASE_URL.football.api}/competitions/${leagueId}/standings`)
              .then(response => {
                    if (response) {
                        response.json()
                                .then(response => {
                                    let topTeamContent = renderTopTeam(response);

                                    document.getElementById("top-team-data").innerHTML = topTeamContent;
                                    
                                    table.style.display = "";
                  
                                    const materialBox = document.querySelectorAll('.materialboxed');
                                    M.Materialbox.init(materialBox);
                                })
                    }
              });
    }
    
    utils.http(`${BASE_URL.football.api}/competitions/${leagueId}/standings`, {
            method: "GET",
            headers: {
                "X-Auth-Token": BASE_URL.football.key
            }
        })
        .then(response => response.json())
        .then(response => {
            let topTeamContent = renderTopTeam(response);

            document.getElementById("top-team-data").innerHTML = topTeamContent;

            table.style.display = "";

            const materialBox = document.querySelectorAll('.materialboxed');
            M.Materialbox.init(materialBox);
        })
        .catch(error => {
            utils.alert.error("Oops! Telah terjadi kesalahan");
            console.error(error.message);
        })
        .finally(() => { 
            loading.style.display = "none";
        });
}

function searchTeamsByLeague(form) {
    const leagueId = form.value;
    const loading =  document.querySelector(".progress");

    loading.style.display = "";

    if ("caches" in window) {
        caches.match(`${BASE_URL.football.api}/competitions/${leagueId}/teams`)
              .then(response => {
                    if (response) {
                        response.json()
                                .then(response => {
                                    let teamContent = renderTeam(response);

                                    document.getElementById("team-content").innerHTML = teamContent;

                                    const materialBox = document.querySelectorAll('.materialboxed');
                                    const likeButton = document.querySelectorAll('.like-button');

                                    M.Materialbox.init(materialBox);

                                    likeButton.forEach(button => button.onclick = () => likeTeam(button.dataset))
                                });
                    }
                });
    }
    
    utils.http(`${BASE_URL.football.api}/competitions/${leagueId}/teams`, {
            method: "GET",
            headers: {
                "X-Auth-Token": BASE_URL.football.key
            }
        })
        .then(response => response.json())
        .then(response => {
            let teamContent = renderTeam(response);

            document.getElementById("team-content").innerHTML = teamContent;
            
            const materialBox = document.querySelectorAll('.materialboxed');
            const likeButton = document.querySelectorAll('.like-button');

            M.Materialbox.init(materialBox);

            likeButton.forEach(button => button.onclick = () => likeTeam(button.dataset))
        })
        .catch(() => utils.alert.error("Oops! Telah terjadi kesalahan"))
        .finally(() => loading.style.display = "none");
}

function getFootBallNews() {
    if ("caches" in window) {
        caches.match(`${BASE_URL.news.api}/everything?q=fifa&sources=bbc-news&language=en&sortBy=publishedAt&pageSize=10`)
              .then(response => {
                    if (response) {
                        response.json()
                                .then(response => {
                                    let newsContent = renderNews(response);

                                    document.getElementById("news-content").innerHTML = newsContent;

                                    const materialBox = document.querySelectorAll('.materialboxed');

                                    M.Materialbox.init(materialBox);

                                });
                    }
                });
    }
    
    utils.http(`${BASE_URL.news.api}/everything?q=fifa&sources=bbc-news&language=en&sortBy=publishedAt&pageSize=10`, {
            method: "GET",
            headers: {
                "X-Api-Key": BASE_URL.news.key
            }
        })
        .then(response => response.json())
        .then(response => {
            let newsContent = renderNews(response);

            document.getElementById("news-content").innerHTML = newsContent;
            
            const materialBox = document.querySelectorAll('.materialboxed');

            M.Materialbox.init(materialBox);

        })
        .catch((error) => utils.alert.error("Oops! Telah terjadi kesalahan"))
}

function getFavoriteTeam() {
    getFavoriteTeams()
                .then(teams => {
                    if(teams.length > 0){
                        document.getElementById("favorite-team-content").innerHTML = renderFavoriteTeam(teams);

                        const materialBox = document.querySelectorAll('.materialboxed');
                        const deleteButton = document.querySelectorAll('.delete-button');
                        M.Materialbox.init(materialBox);
                    
                        deleteButton.forEach(button => button.onclick = () => deleteTeam(button.dataset.teamId));
                    }else{
                        document.getElementById("favorite-team-content").innerHTML = `
                        <div>
                            <h3 class="center-align">Belum ada team favorit</h3>
                        </div>
                    `
                    }
                })
                .catch(() => utils.alert.error("Oops! Telah terjadi kesalahan"));
}

function renderTopTeam(data) {
    let content = "";
   
    for(i = 0; i < 10; ++i){
        content += `
        <tr>
            <td>${data.standings[0].table[i].position}</td>
            <td>${data.standings[0].table[i].team.name}</td>
            <td>
                <img width="10%" src="${data.standings[0].table[i].team.crestUrl.replace(
                    /^http:\/\//i,
                    "https://"
                )}" alt="${data.standings[0].table[i].team.name} Logo" class="responsive-img materialboxed center-image">
            </td>
            <td>${data.standings[0].table[i].playedGames}</td>
            <td>${data.standings[0].table[i].won}</td>
            <td>${data.standings[0].table[i].draw}</td>
            <td>${data.standings[0].table[i].lost}</td>
            <td>${data.standings[0].table[i].points}</td>
        </tr>
        `;
    }

    return content;
}

function renderTeam(data) {
    let content = "";

    data.teams.forEach(team =>{

        content += `
        <div class="col s12">
            <div class="card">
                <div class="card-image">
                    <img src="${team.crestUrl.replace(
                        /^http:\/\//i,
                        "https://"
                    )}" class="responsive-img materialboxed center-image" style="width: 50%;">
                    <a 
                        class="btn-floating halfway-fab btn-large waves-effect waves-light light-green accent-3 like-button"
                        data-team-id="${team.id}"
                        data-team-url="${team.crestUrl.replace(/^http:\/\//i, "https://")}"
                        data-team-name="${team.shortName}"
                        data-team-email="${team.email}"
                        data-team-founded="${team.founded}"
                        data-team-colors="${team.clubColors}"
                        data-team-venue="${team.venue}"
                        data-team-website="${team.website}">
                        <i class="material-icons">add</i>
                    </a>
                </div>
                <div class="card-content row">
                    <span class="card-title black-text">${team.shortName}</span>
                    <table class="highlight centered responsive-table s12">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Tahun</th>
                                <th>Warna</th>
                                <th>Stadion</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>${team.email != null ? team.email : "-"}</td>
                                <td>${team.founded}</td>
                                <td>${team.clubColors}</td>
                                <td>${team.venue}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="card-footer">
                    <a href="${team.website}" target="_blank" class="center-align btn-large btn-block light-green accent-3">Lihat Web</a>
                </div>
            </div>
        </div>
        `;

    });

    return content;
}

function renderNews(data) {
    let content = "";

    data.articles.forEach(news => {
        content += `
        <div class="col s12">
            <div class="card">
                <div class="card-image">
                    <img src="${news.urlToImage}" class="responsive-img materialboxed center-image">
                </div>
                <div class="card-stacked">
                    <div class="card-content">
                        <span class="card-title black-text truncate">${news.title}</span>
                        <p class="flow-text truncate">${news.description}</p>
                    </div>
                        <div class="card-action">
                            <p class="flow-text truncate center-align">Source: ${news.source.name}</p>
                        </div>
                    </div>
                    <div class="card-footer">
                        <a href="${news.url}" target="_blank" class="center-align btn-large btn-block light-green accent-3">Baca lebih</a>
                    </div>
                </div>
            </div>
        </div> 
        `
    });

    return content;
}

function renderFavoriteTeam(data) {
    let content = "<h3 class='center-align'>Favorit Team</h3>";

    data.forEach(team =>{

        content += `
        <div class="col s12">
            <div class="card">
                <div class="card-image">
                    <img src="${team.teamLogo.replace(
                        /^http:\/\//i,
                        "https://"
                    )}" class="responsive-img materialboxed center-image" style="width: 50%;">
                    <a 
                        class="btn-floating halfway-fab btn-large waves-effect waves-light red delete-button" data-team-id="${team.id}">
                        <i class="material-icons">delete</i>
                    </a>
                </div>
                <div class="card-content row">
                    <span class="card-title black-text">${team.name}</span>
                    <table class="highlight centered responsive-table s12">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Tahun</th>
                                <th>Warna</th>
                                <th>Stadion</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>${team.email != null ? team.email : "-"}</td>
                                <td>${team.founded}</td>
                                <td>${team.colors}</td>
                                <td>${team.venue}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="card-footer">
                    <a href="${team.website}" target="_blank" class="center-align btn-large btn-block light-green accent-3">Lihat Web</a>
                </div>
            </div>
        </div>
        `;

    });

    return content;
}

function likeTeam(data) {
    const likedTeamData = {
        id: data.teamId,
        teamLogo: data.teamUrl,
        name: data.teamName,
        email: data.teamEmail,
        founded: data.teamFounded,
        colors: data.teamColors,
        venue: data.teamVenue,
        website: data.teamWebsite
    };

    checkFavoriteTeam(data.teamId)
                    .then(team => {
                        if(team){
                            utils.alert.error("Team sudah ada di list favorite");
                        }else{
                            storeFavoriteTeam(likedTeamData)
                                            .then(response => utils.alert.success(response))
                                            .catch(err => utils.alert.error(err));
                        }
                    })
                    .catch(err => utils.alert.error(err));
}

function deleteTeam(id) {
    deleteFavoriteTeam(id)
                    .then(response => {
                        utils.alert.success(response);
                        getFavoriteTeam();
                    })
                    .catch(error => utils.alert.error(error));
}

function backToTop() {
    utils.goToTop();
}