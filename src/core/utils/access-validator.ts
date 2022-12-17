import CryptoJS from "crypto-js";

export class AccessValidator {
    public static async validate() {
        let fromServer: object = await chrome.storage.session.get(["version", "state", "whitelist"]);
        let currentVersion = chrome.runtime.getManifest().version;
        let currentUser = await this.getCurrentUserId();

        // for optimization, we immediately check match
        if (fromServer["version"] === currentVersion && fromServer["state"] === "active" &&
            (fromServer["whitelist"] as Array<string>).includes(currentUser)) {
            return;
        }
        // Starting point of problems, we clarify and, if possible, solve them
        if (fromServer["version"] === undefined || fromServer["state"] === undefined) {
            console.log("[AccessValidator] undefined detected");
            await this.syncServer();
            return await this.validate();
        }

        // Whitelist
        if (!(fromServer["whitelist"] as Array<string>).includes(currentUser)) {
            throw new Error("[Anti-Leak] 👋");
        }

        // If the Internet is not available, and the test is available, in any case we give the opportunity to use the extension
        if (fromServer["version"] === "NO" && fromServer["state"] === "INTERNET") {
            return;
        }

        if (fromServer["version"] !== currentVersion) {
            throw new Error("You are using an outdated version of the extension, install the latest version");
        }

        if (fromServer["state"] !== "active") {
            throw new Error("The extension was deactivated by the developer. For details, contact the developer.");
        }
    }

    public static async syncServer() {
        console.log("[AccessValidator] syncServer");
        let serverResponse = await fetch("https://my-json-server.typicode.com/GlobalAnswers/Extension-Authentication/db");

        if (serverResponse.ok) {
            let serverText = await serverResponse.text();
            let serverJson = JSON.parse(serverText);

            if (!serverJson.extension.version || !serverJson.extension.state) {
                throw new Error("No data about necessary version or state");
            }

            let version = CryptoJS.AES.decrypt(serverJson.extension.version, "daenerys").toString(CryptoJS.enc.Utf8);
            let state = CryptoJS.AES.decrypt(serverJson.extension.state, "daenerys").toString(CryptoJS.enc.Utf8);

            await chrome.storage.session.set({ version: version, state: state });

            // Whitelist
            console.log("Whitelist");
            if (typeof serverJson.whitelist === "object") {
                console.log("Whitelist enter");
                let whitelist = new Array<string>();
                (serverJson.whitelist as Array<string>).forEach((encrypted) => {
                    let user = CryptoJS.AES.decrypt(encrypted, "daenerys").toString(CryptoJS.enc.Utf8);
                    whitelist.push(user);
                });

                await chrome.storage.session.set({ whitelist: whitelist });
            }
        } else {
            let yandexResponse = await fetch("https://ya.ru/", { method: "GET" });
            if (!yandexResponse.ok) {
                await chrome.storage.session.set({ version: "NO", state: "INTERNET" });
            } else {
                throw new Error("The server is not responding");
            }
        }
    }

    private static async getCurrentUserId(): Promise<string> {
        let sdoResponse = await fetch("https://newsdo.vsu.by/user/profile.php");

        if (sdoResponse.ok) {
            let sdoText = await sdoResponse.text();

            let profileDocument = new DOMParser().parseFromString(sdoText, "text/html");

            let mailto = profileDocument.querySelector("a[href^='mailto:']");
            let userId = mailto.textContent.match("\\d+");

            return userId[0];
        }
    }
}
