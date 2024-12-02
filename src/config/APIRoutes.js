import APIConfig from "./APIConfig";

const APIRoutes = {
    getSignalRUrl: () => APIConfig.ApiUrl + "/chathub",

    getMessagesUrl: () => APIConfig.ApiUrl + "/api/chat/messages"
}

export default APIRoutes;