import { STORAGE_CLASSNAME_MESSAGE } from "./defaultSettings.js";
import { UI_ELEMENTS } from "./UI_ELEMENTS.js";

export function createMessage(text, author, time, companion = STORAGE_CLASSNAME_MESSAGE.COMPANION) {
	const message = document.createElement("div");
	message.classList.add(STORAGE_CLASSNAME_MESSAGE.MESSAGE, STORAGE_CLASSNAME_MESSAGE.CHAT_MESSAGE);

	if (companion === STORAGE_CLASSNAME_MESSAGE.ME) {
		message.classList.add(STORAGE_CLASSNAME_MESSAGE.MESSAGE_ME);
	}

	if (companion === STORAGE_CLASSNAME_MESSAGE.COMPANION) {
		message.classList.add(STORAGE_CLASSNAME_MESSAGE.MESSAGE_COMPANION);
	}

	if (
		companion !== STORAGE_CLASSNAME_MESSAGE.ME &&
		companion !== STORAGE_CLASSNAME_MESSAGE.COMPANION
	) {
		console.error("Неизвестный собеседник");
		return;
	}

	message.appendChild(UI_ELEMENTS.messageTemplate.content.cloneNode(true));
	message.querySelector(`.${STORAGE_CLASSNAME_MESSAGE.AUTHOR}`).textContent = `${author}:`;
	message.querySelector(`.${STORAGE_CLASSNAME_MESSAGE.TEXT}`).textContent = text;

	const date = new Date(Date.parse(time));
	const hours = addZeroTime(date.getHours());
	const minutes = addZeroTime(date.getMinutes());

	message.querySelector(
		`.${STORAGE_CLASSNAME_MESSAGE.TIME}`,
	).textContent = `${date.getDate()} ${hours}:${minutes}`;

	UI_ELEMENTS.screenChat.appendChild(message);
}

function addZeroTime(time) {
	time = String(time);

	if (time.length <= 1) {
		return `0${time}`;
	}

	return time;
}
