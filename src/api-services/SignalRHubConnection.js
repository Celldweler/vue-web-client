import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import APIRoutes from "@/config/APIRoutes";

let SignalRHubConnection = (async () => {
    const SignalRubConnectionFunc = new HubConnectionBuilder()
        .configureLogging(LogLevel.None)
        .withUrl(APIRoutes.getSignalRUrl())
        .withAutomaticReconnect()
        .build();

    await SignalRubConnectionFunc.start();

    return SignalRubConnectionFunc;
})();

export default SignalRHubConnection;