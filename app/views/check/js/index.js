const API_DETAILS = API_URL + "check/details.php";
const API_CHECK = API_URL + "check/check.php";

const asistencia = new ComponentHelper("#asistencia");

$(function () {
    clearValidation();
    initialize();
    load();
});

function initialize() {
    asistencia.setMandatoryFields([
        { field: "correo", name: "Correo electrónico", type: "input" }
    ]);

    asistencia.onAction("check", async () => {
        try {
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
        }
    });
    asistencia.$context[0].addEventListener("keydown", (e) => { if (e.keyCode == 13) asistencia.getAction("check").click() });
}

async function load() {
    asistencia.buttonOff("check");
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
    } finally {
        asistencia.buttonOn("check");
    }
}

function clearValidation() {
    $(".form-control").each(function (e) {
        $(this).on("click select2:open", function (event) {
            $(this).removeClass("is-invalid");
        });
    });
}