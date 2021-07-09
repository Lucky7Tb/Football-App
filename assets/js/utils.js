const utils = {
    http: (endPoint, options) => {
        return fetch(`${endPoint}`, options);
    },
    alert: {
        error: message =>  M.toast({html: message, classes: "rounded red accent-2"}),
        success: message => M.toast({html: message, classes: "rounded light-green accent-2"})
    },
    urlBase64ToUint8Array: base64String => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    },
    goToTop: () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }
}