const formatDateExport = "DDMMYYYY";

$(".form-control").each(function (e) {
    $(this).on("click select2:open", function (event) {
        $(this).removeClass("is-invalid");
    });
});

function scrollToElement(element) {
    $("html, body").animate({
        scrollTop: element.$context.offset().top
    }, 500);
}

function clearValidation() {
    $(".form-control").each(function (e) {
        $(this).on("click select2:open", function (event) {
            $(this).removeClass("is-invalid");
        });
    });
}

function capitalizeFirstLetter(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function notReadyJet() {
    Swal.fire({
        title: "Opción aún no disponible",
        theme: Theme.getResolved(),
        imageUrl: BASE_URL + "assets/img/not-ready/cat-programming-2.gif",
        imageHeight: 300,
        html: "Nuestro ingeniero aún está trabajando en esta opción.</br>"
    });
}

function formatDateTime(value) {
    if(!value) return value;

    const strVal = value.replaceAll("-", "/");

    const date = strVal instanceof Date
        ? strVal
        : new Date(strVal);

    const formatter = new Intl.DateTimeFormat("es-MX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    return formatter.format(date);
}

function formatDate(value) {
    if(!value) return value;

    const strVal = value.replaceAll("-", "/");

    const date = strVal instanceof Date
        ? strVal
        : new Date(strVal);

    const formatter = new Intl.DateTimeFormat("es-MX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });

    return formatter.format(date);
}

function formatTime(value) {
    if(!value) return value;
    
    const date = value instanceof Date
        ? value
        : new Date(value);

    const formatter = new Intl.DateTimeFormat("es-MX", {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    return formatter.format(date);
}