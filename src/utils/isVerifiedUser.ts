export const isVerifiedUser = async function () : Promise<boolean> {
    let whiteList = [
        "1901080131"
    ];

    let date = new Date();

    if (date.getFullYear() != 2022 || date.getMonth() != 8) {
        return false;
    }

    let response = await fetch("https://newsdo.vsu.by/user/profile.php");
    if (response.ok) {
        let text = await response.text();

        let parser = new DOMParser();
        let userDocument = parser.parseFromString(text, "text/html");

        let mailto = userDocument.querySelector("a[href^='mailto:']");
        let studentId = mailto.textContent.match('\\d+');

        return whiteList.includes(studentId[0]);
    }
    else {
        throw new Error("Failed to identify current user");
    }
}
