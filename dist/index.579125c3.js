const frame = document.getElementById("frame");
const onBootstrap = ()=>{
    return new Promise((resolve)=>{
        const onMessage = (event)=>{
            if (event.data?.key === "SWIT_AUTH_APP_BOOTSTRAP") {
                resolve();
                window.removeEventListener("message", onMessage);
            }
        };
        window.addEventListener("message", onMessage);
    });
};
const init = ()=>{
    return new Promise((resolve)=>{
        const channel = new MessageChannel();
        channel.port1.addEventListener("message", ()=>{
            resolve(channel.port1);
        });
        channel.port1.start();
        frame.contentWindow.postMessage({
            key: "SWIT_AUTH_HANDSHAKE_REQUEST"
        }, "*", [
            channel.port2
        ]);
    });
};
const invoke = (port, requestMessage, responseMessageKey)=>{
    return new Promise((resolve)=>{
        const onMessage = (event)=>{
            if (event.data?.key === responseMessageKey) {
                resolve(event.data);
                removeEventListener("message", onMessage);
            }
        };
        port.addEventListener("message", onMessage);
        port.postMessage(requestMessage);
    });
};
(async ()=>{
    await onBootstrap();
    const port = await init();
    const testName = await invoke(port, {
        key: "SWIT_AUTH_HELLO"
    }, "SWIT_AUTH_HELLO_RESPONSE");
    const accounts = await invoke(port, {
        key: `SWIT_AUTH_GET_ACCOUNTS`
    }, "SWIT_AUTH_GET_ACCOUNTS_RESPONSE");
    const signedAccount = await invoke(port, {
        key: `SWIT_AUTH_GET_SIGNED_ACCOUNT`
    }, `SWIT_AUTH_GET_SIGNED_ACCOUNT_RESPONSE`);
    console.log(accounts);
    console.log(signedAccount);
})();

//# sourceMappingURL=index.579125c3.js.map
