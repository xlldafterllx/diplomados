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