import { LocalNotifications } from '@capacitor/local-notifications';
import { Share } from '@capacitor/share';

async function requestNotifyPermission() {
    const permissionStatus = await LocalNotifications.requestPermissions();
    return permissionStatus.display === 'granted';
}

document.addEventListener("DOMContentLoaded", () => {
    const dobInput = document.getElementById("dobInput");
    const countdownBtn = document.getElementById("countdownBtn");
    const countdownResult = document.getElementById("countdownResult");
    const shareCountdown = document.getElementById("shareCountdown");

    countdownBtn.addEventListener("click", async () => {
        const inputDate = dobInput.value.trim();
        const [day, month] = inputDate.split("/").map(Number);

        if (!day || !month || day < 1 || day > 31 || month < 1 || month > 12) {
            countdownResult.textContent = "Vui lòng nhập ngày sinh hợp lệ!";
            return;
        }

        const currentDate = new Date();
        const thisYear = currentDate.getFullYear();
        let upcomingBirthday = new Date(thisYear, month - 1, day);

        if (upcomingBirthday < currentDate) {
            upcomingBirthday.setFullYear(thisYear + 1);
        }

        const daysRemaining = Math.ceil((upcomingBirthday - currentDate) / (1000 * 60 * 60 * 24));
        countdownResult.textContent = `Còn ${daysRemaining} ngày đến sinh nhật của bạn rồi🥳🎉`;

        if (await requestNotifyPermission()) {
            await LocalNotifications.schedule({
                notifications: [
                    {
                        title: "Đếm ngược sinh nhật",
                        body: `Còn ${daysRemaining} ngày đến sinh nhật của bạn rồi 🥳🎉🎂`,
                        id: 1,
                    },
                ],
            });
        }

        shareCountdown.style.display = "block";
        shareCountdown.onclick = async () => {
            await Share.share({
                title: "Đếm ngược sinh nhật",
                text: `Còn ${daysRemaining} ngày đến sinh nhật của tôi! Bạn thử xem còn bao lâu nào!`,
                dialogTitle: "Chia sẻ kết quả",
            });
        };
    });
});
