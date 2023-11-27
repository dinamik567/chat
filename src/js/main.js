import Cookies from "js-cookie";
import { UI_ELEMENTS } from "./module/UI_ELEMENTS";
import {
	STORAGE_CLASSNAME_MESSAGE,
	STORAGE_CLASSNAME_FORM,
	LOCAL_STORAGE_KEY,
} from "./module/defaultSettings";
import { createMessage } from "./module/createMessage";

const socket = new WebSocket(`wss://edu.strada.one/websockets?${Cookies.get("token")}`);
function submiFormHandler(e) {
	e.preventDefault();

	if (e.target.value === "") {
		console.log("empty");
		return;
	}

	const inputMessage = e.target.querySelector(`.${STORAGE_CLASSNAME_FORM.fieldInputMessage}`);

	socket.send(JSON.stringify({ text: inputMessage.value }));

	inputMessage.value = "";
}

UI_ELEMENTS.messageForm.addEventListener("submit", submiFormHandler);

const URL = {
	MESSAGES: "https://edu.strada.one/api/messages/",
};

async function requestServer(url) {
	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});

	if (!response.ok) {
		console.error("ошибка при запросе");
	}

	const ansewer = await response.json();
	const { messages } = ansewer;

	localStorage.setItem(LOCAL_STORAGE_KEY.MESSAGES, JSON.stringify(messages));
}

requestServer(URL.MESSAGES);

const indexMessages = {
	maxAmount: 5,
	index: 0,
	count: 10,
};

function render() {
	UI_ELEMENTS.screenChat.innerHTML = "";

	const arrayMessages = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.MESSAGES));

	[...arrayMessages]
		.splice(indexMessages.index, indexMessages.count)
		.reverse()
		.map((obj) => {
			if (obj.user.email === Cookies.get("email")) {
				createMessage(obj.text, obj.user.name, obj.updatedAt, STORAGE_CLASSNAME_MESSAGE.ME);
				return;
			}

			createMessage(obj.text, obj.user.name, obj.updatedAt);
		});

	if (arrayMessages.lenth <= indexMessages.count) {
		console.log("сообщений больше нет");
	}
}

render();
UI_ELEMENTS.screenChat.scrollIntoView(false);


socket.onopen = function (e) {
	console.log("соединение установлено");
};

socket.onmessage = function (e) {
	const date = JSON.parse(e.data);

	if (date.user.email === Cookies.get("email")) {
		createMessage(date.text, date.user.name, date.updatedAt, STORAGE_CLASSNAME_MESSAGE.ME);
		UI_ELEMENTS.screenChat.scrollIntoView(false);
		return;
	}

	createMessage(date.text, date.user.name, date.updatedAt);
	UI_ELEMENTS.screenChat.scrollIntoView(false);
};

const url = "https://edu.strada.one/api/user";

async function clickHandlerRequest(e) {
	e.preventDefault();

	const emailObject = { email: UI_ELEMENTS.inputFormEmail.value };
	Cookies.set("email", UI_ELEMENTS.inputFormEmail.value);

	UI_ELEMENTS.inputFormEmail.value = "";

	const request = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
		body: JSON.stringify(emailObject),
	});
}

UI_ELEMENTS.recieveCode.addEventListener("click", clickHandlerRequest);

async function clickHandlerSaveToken(e) {
	e.preventDefault();

	Cookies.set("token", UI_ELEMENTS.inputFormEmail.value);
	UI_ELEMENTS.inputFormEmail.value = "";

	const response = await fetch("https://edu.strada.one/api/user/me", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
	});

	if (!response.ok) {
		throw new Error('ошибка при авторизации')
	}
}

UI_ELEMENTS.enterCode.addEventListener("click", clickHandlerSaveToken);

async function submitHandlerChangeName(e) {
	e.preventDefault();

	const newName = UI_ELEMENTS.inputFormSettingName.value;
	const objName = { name: newName };
	UI_ELEMENTS.inputFormSettingName.value = "";

	const response = await fetch("https://edu.strada.one/api/user", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${Cookies.get("token")}`,
		},
		body: JSON.stringify(objName),
	});

	if (!response.ok) {
		console.error("Что то пошло не так при смене никнейма");
	}
}

UI_ELEMENTS.formSetting.addEventListener("submit", submitHandlerChangeName);

UI_ELEMENTS.screenInner.addEventListener("scroll", () => {
	const previosScrollHeight = UI_ELEMENTS.screenInner.scrollHeight;

	if (UI_ELEMENTS.screenInner.scrollTop === 0) {
		indexMessages.count += indexMessages.maxAmount;
		render();

		const diference = UI_ELEMENTS.screenInner.scrollHeight - previosScrollHeight;
		UI_ELEMENTS.screenInner.scrollTop = diference;
	}
});
