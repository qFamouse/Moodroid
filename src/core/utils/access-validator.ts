import CryptoJS from "crypto-js";

export class AccessValidator {
    public static async validate() {
        let fromServer: object = await chrome.storage.session.get(["version", "state"]);
        let currentVersion = chrome.runtime.getManifest().version;

        // for optimization, we immediately check match
        if (fromServer["version"] === currentVersion && fromServer["state"] === "active") {
            return;
        }
        // Starting point of problems, we clarify and, if possible, solve them

        // If the Internet is not available, and the test is available, in any case we give the opportunity to use the extension
        if (fromServer["version"] === "NO" && fromServer["state"] === "INTERNET") {
            return;
        }

        if (fromServer["version"] === undefined || fromServer["state"] === undefined) {
            console.log("[AccessValidator] undefined detected");
            await this.syncServer();
            return await this.validate();
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
        let serverResponse = await fetch("https://my-json-server.typicode.com/GlobalAnswers/Extension-Authentication/extension", {
            method: "GET"
        });

        if (serverResponse.ok) {
            let serverText = await serverResponse.text();
            let serverJson = JSON.parse(serverText);

            if (!serverJson.version || !serverJson.state) {
                throw new Error("No data about necessary version or state");
            }

            let version = CryptoJS.AES.decrypt(serverJson.version, "daenerys").toString(CryptoJS.enc.Utf8);
            let state = CryptoJS.AES.decrypt(serverJson.state, "daenerys").toString(CryptoJS.enc.Utf8);

            await chrome.storage.session.set({ version: version, state: state });
        } else {
            let yandexResponse = await fetch("https://ya.ru/", { method: "GET" });
            if (!yandexResponse.ok) {
                await chrome.storage.session.set({ version: "NO", state: "INTERNET" });
            } else {
                throw new Error("The server is not responding");
            }
        }
    }
}
