setup_interop = function () {
    window.interop_functions = {
        //showPrompt: function (text) {
        //    return prompt(text, 'Type your name here');
        //},
        //displayWelcome: function (welcomeMessage) {
        //    document.getElementById('welcome').innerText = welcomeMessage;
        //},
        objRef: {},
        setObject: function (obj) {
            this.objRef = obj;
        },

        returnArrayAsyncJs: function () {
            DotNet.invokeMethodAsync('BlazorSample', 'ReturnArrayAsync')
                .then(data => {
                    data.push(4);
                    console.log(data);
                });
        },
        sayHello: function (dotnetHelper) {
            return dotnetHelper.invokeMethodAsync('SayHello')
                .then(r => console.log(r));
        },

        dice_selected: function (dice) {
            this.objRef.invokeMethod("OnDiceSelected", dice);
        }
    };
}