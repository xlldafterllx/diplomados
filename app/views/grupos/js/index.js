const API_GRUPOS_ALL = API_URL + "grupos/all.php";

const panelState = {
    alumnos: false,
    clases: false,
    asistencias: false
};

let general;

$(document).ready(async function () {
    await initialize();
});

async function initialize() {
    window.HttpClient = HttpClient;
    window.HttpException = HttpException;

    initializeGrupos();
    initializeAlumnos();
    initializeClases();
    initializeAsistencias();
    initializeEvents();

    loadAll();
}

function initializeEvents() {
    $("#nav-tab")
        .off("shown.bs.tab.panels")
        .on("shown.bs.tab.panels", '[data-bs-toggle="tab"]', async function () {
            const target = $(this).data("bs-target");

            switch (target) {
                case "#alumnos-tab":
                    await loadAlumnosOnce();
                    break;

                case "#clases-tab":
                    await loadClasesOnce();
                    break;

                case "#asistencia-tab":
                    await loadAsistenciasOnce();
                    break;
            }
        });
}

async function loadAll() {
    try {
        Loader.show();

        const result = await HttpClient.post(API_GRUPOS_ALL, {});
        const { grupos, catalogos } = result.data;

        tableGruposData = grupos;
        
        TableHelper.update(tableGrupos, tableGruposData);

        SelectHelper.fill("diplomado", catalogos.diplomados, { context: modalGrupo, triggerChange: false });
        SelectHelper.fill("tiempo", catalogos.tiempo, { context: modalClaseCrear, triggerChange: false });
    } catch (error) {
        console.log(error.response ?? error);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: error.message
        });
    } finally {
        Loader.hide();
    }
}