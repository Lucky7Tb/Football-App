const DB = idb.open("footbal-app", 1, upgradeDb => {
    const teamsObjectStore = upgradeDb.createObjectStore("liked_teams", {
        keyPath: "id"
    });
    teamsObjectStore.createIndex("id", "id", { unique: true });
});

function getFavoriteTeams() {
    return new Promise((resolve, reject) => {
        DB.then(db => {
          const tx = db.transaction("liked_teams", "readonly");
          const store = tx.objectStore("liked_teams");
          return store.getAll();
        })
        .then(teams => resolve(teams))
        .catch(error => { 
            reject("Oops! Telah terjadi kesalahan");
            console.error(error.message)
        }); 
    });
}

function storeFavoriteTeam(data) {
    return new Promise((resolve, reject) => {
        DB.then(db => {
            const tx = db.transaction("liked_teams", "readwrite");
            const store = tx.objectStore("liked_teams");
            store.put(data);
            return tx.complete;
        })
        .then(() => {
            resolve("Berhasil menabahkan ke favorite");
        })
        .catch(error => {
            reject("Gagal menambahkan ke favorite");
            console.error(error.message);
        });
    });
}

function checkFavoriteTeam(id) {
    return new Promise((resolve, reject) => {
        DB
        .then(db => {
            const tx = db.transaction("liked_teams", "readonly");
            const store = tx.objectStore("liked_teams");
            return store.get(id);
        })
        .then(team => {
            resolve(team);
        })
        .catch(error => {
            reject("Oops! Telah terjadi kesalahan");
            console.error(error.message);
        })
    });
}

function deleteFavoriteTeam(id) {
    return new Promise((resolve, reject) => {
        DB.then(db => {
            const tx = db.transaction('liked_teams', 'readwrite');
            const store = tx.objectStore('liked_teams');
            store.delete(id);
            return tx.complete;
        }).then(() => {
            resolve("Berhasil menghapus dari favorit")
        })
        .catch(error => {
            reject("Oops! Telah terjadi kesalahan");
            console.error(error.message);
        })
    });
}