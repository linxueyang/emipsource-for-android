cordova.define("cordova-plugin-datetime-picker.DateTimePicker", function(require, exports, module) {

var exec = require("cordova/exec");

var DateTimePicker = function () {
    this.name = "DateTimePicker";
};

DateTimePicker.prototype.selectDate = function (onSuccess, onError, value) {
    exec(onSuccess, onError, "DateTimePicker", "selectDate", [value]);
};

DateTimePicker.prototype.selectTime = function (onSuccess, onError, value, step) {
    var args = [value];
    if (step) {
        args.push(step);
    }
    exec(onSuccess, onError, "DateTimePicker", "selectTime", args);
};

module.exports = new DateTimePicker();

});
