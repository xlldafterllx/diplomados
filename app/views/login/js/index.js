const API_LOGIN = API_URL + "auth/login.php";

const login = new ComponentHelper("#login-form");

const rules = {
    "username": {
        name: "Usuario",
        rules: "required|string"
    },
    "password": {
        name: "Contraseña",
        rules: "required|string"
    }
};

$(".form-control").each(function (e) {
    $(this).on("click select2:open", function (event) {
        $(this).removeClass("is-invalid");
    });
});

login.onAction("login", async () => {
    login.clearValidation();

    const validator = Validator.make(login, rules);

    if (validator.fails()) {
        const errors = validator.errors();

        for (const [field, messages] of Object.entries(errors)) {
            login.setInvalid(field, messages[0]);
        }

        Toast.fire({
            icon: "error",
            title: "Uno o más campos no cumplen con el formato requerido.",
            theme: "light"
        });

        return;
    }

    try {
        await HttpClient.post(API_LOGIN, login.getData());
        window.location.reload();
    } catch (error) {
        console.log(error.response ?? error);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            theme: "light",
            html: error.message,
        });
    }
});

login.$context[0].addEventListener("keydown", (e) => { if (e.keyCode == 13) login.getAction("login").click() });