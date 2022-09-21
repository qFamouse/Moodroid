export const isVerifiedUser = async function () : Promise<boolean> {
    let whiteList = [
        "1901080131", // Ткач
        "1901080028", // Иванов
        "1901080030", // Кириллов
        "1901080027", // Шерегов
        "1901080024", // Струков
        "1901080025", // Попов
        "1901080130", // Немцов
        "1901080133", // Веренич
        "1901080036", // Ковзов
        "1601080114", // Троцкий
        "1901080033", // Дашкевич
        "1901080021", // Кулаков
        "1901080037", // Кузьменков
        "1901080022", // Тюрин
        "1901080026" // Пищейко
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
