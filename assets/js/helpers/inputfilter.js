(function ($) {
    $.fn.inputFilter = function (callback, errMsg) {
        return this.on("input keydown keyup mousedown mouseup select contextmenu drop focusout", function (e) {
            if (callback(this.value)) {
                // Accepted value
                if (["keydown", "mousedown", "focusout"].indexOf(e.type) >= 0) {
                    this.setCustomValidity("");
                }
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                // Rejected value - restore the previous one
                Toast.fire({
                    icon: "warning",
                    title: errMsg,
                });
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                // Rejected value - nothing to restore
                this.value = "";
            }
        });
    };

    $.fn.filterKD = function (callback, errMsg) {
        return this.on("keydown keyup focusout", function (e) {
            if (callback(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                Toast.fire({
                    icon: "warning",
                    title: errMsg,
                });
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    };

    $.fn.filterFO = function (callback, errMsg) {
        return this.on("focusout", function (e) {
            if (callback(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else {
                Toast.fire({
                    icon: "warning",
                    title: errMsg,
                });
                this.value = "";
            }
        });
    };
}(jQuery));

function enteros(element, context) {
    context.getField(element).inputFilter(function (value) {
        return /^-?\d*$/.test(value);
    }, "Sólo se permiten enteros");
}

function digitos(element, context) {
    context.getField(element).inputFilter(function (value) {
        return /^\d*$/.test(value);
    }, "Sólo se permiten digitos");
}

function enterosLim(element, lim, context) {
    context.getField(element).inputFilter(function (value) {
        return /^\d*$/.test(value) && (value === "" || parseInt(value) <= lim);
    }, "El valor debe ser entre 0 y " + lim);
}

function flotante(element, context) {
    context.getField(element).inputFilter(function (value) {
        return /^-?\d*[.]?\d*$/.test(value);
    }, "Sólo se permiten digitos");
}

function moneda(element, context) {
    context.getField(element).inputFilter(function (value) {
        return /^-?\d*[.,]?\d{0,2}$/.test(value);
    }, "Sólo se permiten cantidades de moneda");
}

function alfabetico(element, context) {
    context.getField(element).inputFilter(function (value) {
        return /^[a-zñ]*$/i.test(value);
    }, "Sólo se permiten carácteres alfabéticos");
}

function alfanumerico(element, context) {
    context.getField(element).inputFilter(function (value) {
        return /^[0-9a-zñ]*$/i.test(value);
    }, "Sólo se permiten carácteres alfabéticos");
}

function hexadecimal(element, context) {
    context.getField(element).inputFilter(function (value) {
        return /^[0-9a-f]*$/i.test(value);
    }, "Sólo se permite un valor hexadecimal");
}


function integers(element, context) {
    context.getField(element).filterKD(function (value) {
        return /^-?\d*$/.test(value);
    }, "Sólo se permiten enteros");
}

function decimal(element, context) {
    context.getField(element).filterKD(function (value) {
        return /^\d*[.]?\d{0,2}$/.test(value);
    }, "Sólo se permiten digitos y dos decimales");
}

function numberLengthOld(control, length) {
    context.getField(element).filterKD(function (value) {
        return eval("/^\\d{0," + length + "}$/").test(value);
    }, "Sólo se permiten máximo " + length + " digitos");
}

function numberLength(element, length) {
    element.filterKD(function (value) {
        return eval("/^\\d{0," + length + "}$/").test(value);
    }, "Sólo se permiten máximo " + length + " digitos");
}

function integersLimited(element, limInf, limSup, context) {
    context.getField(element).filterKD(function (value) {
        return /^\d*$/.test(value);
    }, "Sólo se permiten digitos");

    if (limInf != "" && limSup != "") {
        context.getField(element).filterFO(function (value) {
            return /^\d*$/.test(value) && (value === "" || (parseInt(value) >= limInf && parseInt(value) <= limSup));
        }, "El valor debe ser entre " + limInf + " y " + limSup);
    } else if (limInf != "") {
        context.getField(element).filterFO(function (value) {
            return /^\d*$/.test(value) && (value === "" || parseInt(value) >= limInf);
        }, "El valor debe ser " + limInf + " o mayor");
    } else if (limSup != "") {
        context.getField(element).filterFO(function (value) {
            return /^\d*$/.test(value) && (value === "" || parseInt(value) <= limSup);
        }, "El valor debe ser " + limSup + " o menor");
    }
}

function integersLimitedFormated(element, limInf, limSup, context) {
    context.getField(element).filterKD(function (value) {
        return /^\d*$/.test(value);
    }, "Sólo se permiten digitos");

    if (limInf != "" && limSup != "") {
        context.getField(element).filterFO(function (value) {
            return /^\d*$/.test(value) && (value === "" || (parseInt(value) >= limInf && parseInt(value) <= limSup));
        }, "El valor debe ser entre " + normNumber(limInf, 2) + " y " + normNumber(limSup, 2));
    } else if (limInf != "") {
        context.getField(element).filterFO(function (value) {
            return /^\d*$/.test(value) && (value === "" || parseInt(value) >= limInf);
        }, "El valor debe ser " + normNumber(limInf, 2) + " o mayor");
    } else if (limSup != "") {
        context.getField(element).filterFO(function (value) {
            return /^\d*$/.test(value) && (value === "" || parseInt(value) <= limSup);
        }, "El valor debe ser " + normNumber(limSup, 2) + " o menor");
    }
}

function decimalsLimitedFormated(element, limInf, limSup, context) {
    context.getField(element).filterKD(function (value) {
        return /^-?\d*[.]?\d*$/.test(value);
    }, "Sólo se permiten digitos");

    if (limInf != "" && limSup != "") {
        context.getField(element).filterFO(function (value) {
            value = parseFloat(value);
            limInf = parseFloat(limInf);
            limSup = parseFloat(limSup);

            console.log("value: " + value);
            console.log("limInf: " + limInf);
            console.log("limSup: " + limSup);

            return value === "" || (value >= limInf && value <= limSup);
        }, "El valor debe ser entre " + normNumber(limInf, 2) + " y " + normNumber(limSup, 2));
    } else if (limInf != "") {
        context.getField(element).filterFO(function (value) {
            value = parseFloat(value);
            limInf = parseFloat(limInf);
            limSup = parseFloat(limSup);
            return value === "" || value >= limInf;
        }, "El valor debe ser " + normNumber(limInf, 2) + " o mayor");
    } else if (limSup != "") {
        context.getField(element).filterFO(function (value) {
            value = parseFloat(value);
            limInf = parseFloat(limInf);
            limSup = parseFloat(limSup);
            return value === "" || value <= limSup;
        }, "El valor debe ser " + normNumber(limSup, 2) + " o menor");
    }
}