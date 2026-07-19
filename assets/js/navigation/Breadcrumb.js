class Breadcrumb {
    static set(title) {        
        $("#breadcrumb").html(
            `
                <li class="breadcrumb-item">
                    Inicio
                </li>

                <li class="breadcrumb-item active">
                    ${title}
                </li>
            `
        );
    }
}