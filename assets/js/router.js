let page = window.location.hash.substr(1);
const sideNav = document.querySelector('.sidenav');

window.addEventListener("DOMContentLoaded", () => { 
    main();
});

function main(){
    if(page === "") page = "top-team"

    loadPage(page);
    
    M.Sidenav.init(sideNav);

    loadNavigator();
}

function loadNavigator(){
    const allNavbar = document.querySelectorAll("#dekstop-nav, #mobile-nav")

    utils.http("/layout/nav.html", {
        method: "GET"
    })
    .then(result => result.text())
    .then(response => {
        allNavbar.forEach(nav => nav.innerHTML = response);

        document.querySelectorAll("#dekstop-nav a, #mobile-nav a, .brand-logo")
        .forEach(menu => {
            menu.addEventListener("click", event => {
                event.preventDefault();
               
                M.Sidenav.getInstance(sideNav).close();
            
                page = event.target.getAttribute("href").substr(1);

                loadPage(page);
            })
        })
    })
    .catch(() => {
        M.toast({html: "Error!", classes: "rounded red lighten-1"})
    });
}

function loadPage(page){
    const content = document.getElementById("content");
    let contentPage;

    utils.http(`/pages/${page}.html`, {
        method: "GET"
    })
    .then(async result => {
        if(result.status === 200){
           result.text()
                 .then(result => {
                     content.innerHTML = result;

                     switch (page) {
                        case "top-team":
                        case "list-team":
                            const formSelect = document.querySelectorAll('select');
                            M.FormSelect.init(formSelect);
                            break;
                        case "favorite-team":
                            getFavoriteTeam();
                            break;
                        case "news":
                            getFootBallNews();
                            break;
                     }             
                 })
        }else if(result.status === 404){
            contentPage = await loadErrorPage("404");
        }else{
            contentPage = await loadErrorPage(result.status);
        }
        content.innerHTML = contentPage;
    })
    .catch(() => M.Toast({html: "Ops sepertinya ada sesuatu yang salah", classes: "rounded red"}));
}

function loadErrorPage(error){
    if(error === "404"){
        return utils.http("/pages/error/404.html", {
            method: "GET"
        })
        .then(result => result.text())
    }else{
        return utils.http("/pages/error/error.html", {
            method: "GET"
        })
        .then(result => result.text())
    }
}
