const API_DETAILS = API_URL + "check/details.php";
const API_CHECK = API_URL + "check/check.php";

const asistencia = new ComponentHelper("#asistencia");

const rules = {
    "correo": {
        name: "Correo electrónico",
        rules: "required|email"
    }
};

$(function () {
    clearValidation();
    initialize();
    load();
});

function initialize() {
    asistencia.onAction("check", async () => {
        asistencia.clearValidation();

        const validator = Validator.make(asistencia, rules);

        if (validator.fails()) {
            const errors = validator.errors();

            for (const [field, messages] of Object.entries(errors)) {
                asistencia.setInvalid(field, messages[0]);
            }

            Toast.fire({
                icon: "error",
                title: "Uno o más campos no cumplen con el formato requerido.",
                theme: "light"
            });

            return;
        }

        try {
            asistencia.buttonOff("check");

            await HttpClient.post(API_CHECK, { "token": TOKEN, "correo": asistencia.getField("correo").val() });
            Toast.fire({
                icon: "success",
                title: "Asistencia registrada correctamente.",
                theme: "light"
            });
        } catch (error) {
            console.log(error.response ?? error);

            Toast.fire({
                icon: "error",
                title: error.message,
                theme: "light"
            });
        } finally {
            asistencia.buttonOn("check");
        }
    });

    asistencia.$context[0].addEventListener("keydown", (e) => { if (e.keyCode == 13) asistencia.getAction("check").click() });
}

async function load() {
    try {
        const result = await HttpClient.post(API_DETAILS, { "token": TOKEN });

        asistencia.setBinds({
            "diplomado": `Diplomado: ${result.data.diplomado_nombre}`,
            "grupo": `Grupo: ${result.data.grupo_nombre}`
        });

    } catch (error) {
        console.log(error.response ?? error);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            theme: "light",
            html: error.message,
        });
    }
}

function clearValidation() {
    $(".form-control").each(function (e) {
        $(this).on("click select2:open", function (event) {
            $(this).removeClass("is-invalid");
        });
    });
}