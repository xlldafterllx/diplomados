const gruposListApi = API_URL + "grupos/list.php";
const gruposAllApi = API_URL + "grupos/all.php";
const gruposCreateApi = API_URL + "grupos/create.php";

// Components
let grupos;
let grupoData;
let modalGrupo;

// Tables
let tableGrupos;

// Tables data
let tableGruposData = [];

$(function () {
    initialize();
});

async function initialize() {
    window.HttpClient = HttpClient;
    window.HttpException = HttpException;
    initializeComponents();
    initializeSelects();
    initializeDatesTimes();
    initializeTables();
    initializeInputs();
    initializeEvents();
    initializeTabActions();
    await loadAll();
    clearValidation();
}

function initializeComponents() {
    grupos = new ComponentHelper("#grupos");
    grupoData = new ComponentHelper("#grupo-data");
    modalGrupo = new ComponentHelper("#modal-grupo");

    initializeComponentValidationFields();
    initializeComponentActions();
}

function initializeComponentValidationFields() {
    modalGrupo.setMandatoryFields([
        { field: "nombre", name: "Nombre", type: "input" },
        { field: "diplomado", name: "Diplomado", type: "select" },
        { field: "fecha-inicio", name: "Nombre", type: "datetimepicker" },
        { field: "hora-inicio", name: "Nombre", type: "timepicker" },
        { field: "clases", name: "Nombre", type: "input" }
    ]);
}

function initializeComponentActions() {
    grupos.onAction("new", () => {
        modalGrupo.clear();
        modalGrupo.getBind("title").text("Agregar grupo");
        modalGrupo.getContainer("button").attr("data-action", "save");
        modalGrupo.getField("nombre").val("");
        modalGrupo.open();
    });

    modalGrupo.onAction("save", async () => {
        newGrupo();
    });
}

function initializeSelects() {
    const options = {
        context: modalGrupo,
        triggerChange: false
    }

    SelectHelper.fill("diplomado", [], options);
    SelectHelper.fill("dia", [], {
        context: modalGrupo,
        triggerChange: false,
        placeholder: ""
    });
}

function initializeDatesTimes() {
    DateHelper.date("fecha-inicio", {
        context: modalGrupo,
        minDate: TODAY
    });

    DateHelper.time("hora-inicio", {
        context: modalGrupo,
        minuteIncrement: 15
    });
}

function initializeInputs() {
    InputHelper.integer("clases", {
        context: modalGrupo,
        min: 1,
        max: 100
    });
}

function initializeEvents() {
    DateHelper.on(
        "fecha-inicio",
        "change",
        function (selectedDates, dateStr) {
            const selectedDate = selectedDates[0];
            const day = selectedDate ? selectedDate.getDay() : "";

            modalGrupo.setData({
                "dia": day
            });
        },
        modalGrupo
    );
}

function initializeGroupTabs() {
    const $groupData = grupoData.$context;

    function showTabActions(tabName) {
        $groupData
            .find("[data-tab-action]")
            .hide()
            .filter(`[data-tab-action="${tabName}"]`)
            .fadeIn();
    }

    $groupData
        .find('[data-bs-toggle="tab"]')
        .off("shown.bs.tab.group")
        .on("shown.bs.tab.group", function (event) {
            const target = $(event.target).attr("data-bs-target");
            const tabName = target.replace("#", "");

            showTabActions(tabName);
        });

    const activeTarget = $groupData
        .find('[data-bs-toggle="tab"].active')
        .attr("data-bs-target");

    if (activeTarget) {
        showTabActions(activeTarget.replace("#", ""));
    }
}

function initializeTabActions(context = document) {
    $(context)
        .find("[data-tab-actions]")
        .each(function () {
            const $component = $(this);

            console.log($component);
            

            function updateActions(target) {
                $component
                    .find("[data-tab-action]")
                    .hide()
                    .filter(`[data-tab-action="${target}"]`)
                    .fadeIn();
            }

            $component
                .find('[data-bs-toggle="tab"]')
                .off("shown.bs.tab.actions")
                .on("shown.bs.tab.actions", function (event) {
                    const target = $(event.target)
                        .attr("data-bs-target")
                        ?.replace("#", "");

                    if (target) {
                        updateActions(target);
                    }
                });

            const initialTarget = $component
                .find('[data-bs-toggle="tab"].active')
                .attr("data-bs-target")
                ?.replace("#", "");

            if (initialTarget) {
                updateActions(initialTarget);
            }
        });
}

function initializeTables() {
    initializeTableGrupos();
}

function initializeTableGrupos() {
    const columns = [
        {
            data: 'grupo_nombre',
            name: 'grupo_nombre',
            title: 'Nombre del grupo'
        },
        {
            data: 'diplomado_nombre',
            name: 'diplomado_nombre',
            title: 'Nombre del diplomado'
        },
        {
            data: 'fecha_inicio',
            name: 'fecha_inicio',
            title: 'Fecha de inicio',
            render: DataTable.render.datetime('DD/MM/YYYY')
        },
        {
            data: 'dia_semana',
            name: 'dia_semana',
            title: 'Cada (día)'
        },
        {
            data: 'fecha_creacion',
            name: 'fecha_creacion',
            title: 'Fecha de creación',
            render: DataTable.render.datetime('DD/MM/YYYY h:mm a')
        },
        {
            data: 'usuario_creacion',
            name: 'usuario_creacion',
            title: 'Usuario que lo creo'
        },
        {
            data: 'id',
            name: 'actions',
            title: '',
            render: function (data, type, row, meta) {
                if (type === 'display') {
                    data =
                        '<div class="d-flex justify-content-around align-items-stretch">' +
                        '<button type="button" title="Ver módulos" class="btn btn-outline-primary" onclick="loadModulos(' + data + ', \'' + row["nombre"] + '\'' + ')">' +
                        '<i class="fa-solid fa-file-arrow-down"></i>' +
                        '</button>' +
                        '&nbsp' +
                        '<button type="button" title="Editar grupo" class="btn btn-outline-success" onclick="editGrupo(' + data + ')">' +
                        '<i class="fa-solid fa-pen-to-square"></i>' +
                        '</button>' +
                        '&nbsp' +
                        '<button type="button" title="Eliminar grupo" class="btn btn-outline-danger" onclick="deleteGrupo(' + data + ', \'' + row["nombre"] + '\'' + ')">' +
                        '<i class="fa-solid fa-trash-can"></i>' +
                        '</button>' +
                        '</div>';
                }
                return data;
            }
        }
    ]

    tableGrupos = TableHelper.create(
        grupos,
        "grupos",
        {
            columns,
            tableGruposData,
            fixedColumns: { left: 0, right: 1 },
            order: [{ name: "nombre", dir: "asc" }],
            columnDefs: [
                { targets: "actions:name", width: 1, orderable: false, className: "notexport" },
                { targets: "_all", className: "align-content-center dt-head-nowrap dt-head-left dt-body-left" }
            ],
            ...TableHelper.exportButtons({
                title: "Grupos",
                filename: "grupos_" + moment(TODAY).format(formatDateExport)
            }),
            exportOptions: {
                columns: ":not(.notexport)"
            }
        }
    );
}

async function loadAll() {
    try {
        Loader.show();

        const result = await HttpClient.post(gruposAllApi, {});

        tableGruposData = result.data.grupos;
        TableHelper.update(tableGrupos, tableGruposData);

        const options = {
            context: modalGrupo,
            triggerChange: false
        }

        SelectHelper.fill("diplomado", result.data.catalogos.diplomados, options);
        SelectHelper.fill("dia", result.data.catalogos.dias, {
            context: modalGrupo,
            triggerChange: false,
            placeholder: ""
        });
    } catch (error) {
        console.log(error.response);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: error.message
        });
    } finally {
        Loader.hide();
    }
}

async function loadGrupos() {
    try {
        Loader.show();
        //modulos.slideUp();

        const result = await HttpClient.post(gruposListApi, {});
        tableGruposData = result.data;

        TableHelper.update(tableGrupos, tableGruposData);
    } catch (error) {
        console.log(error.response);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: error.message
        });
    } finally {
        Loader.hide();
    }
}

async function loadGrupoData() {
    try {
        Loader.show();
        grupoData.slideUp();

        const result = await HttpClient.post(gruposListApi, {});
        tableGruposData = result.data;

        TableHelper.update(tableGrupos, tableGruposData);
    } catch (error) {
        console.log(error.response);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: error.message
        });
    } finally {
        Loader.hide();
    }
}

async function updateGruposData() {
    try {
        Loader.show();

        const result = await HttpClient.post(gruposListApi, {});
        tableGruposData = result.data;

        TableHelper.update(tableGrupos, tableGruposData);
    } catch (error) {
        console.log(error.response);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: error.message
        });
    } finally {
        Loader.hide();
    }
}

async function newGrupo() {
    const clases = modalGrupo.getField("clases");

    if (!modalGrupo.validateMandatory()) return;

    if (Number(clases.val()) < 1 || Number(clases.val()) > 100) {
        modalGrupo.setInvalidClass(clases);
        Toast.fire({
            icon: "warning",
            title: "La cantidad de clases de ser un valor entre 1 y 100.",
        });
        return;
    }

    try {
        Loader.show();

        await HttpClient.post(gruposCreateApi, modalGrupo.getData());
        updateGruposData();

        modalGrupo.close();
    } catch (error) {
        console.log(error.response);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: error.message
        });
    } finally {
        Loader.hide();
    }
}

async function editGrupo(grupo) {
    try {
        Loader.show();

        modal.getBind("title").text("Editar grupo");
        modal.getBind("name").text("Nombre del grupo");
        modal.getContainer("button").attr("data-action", "update");
        modal.getContainer("value").attr("data-value", "grupo");
        modal.getField("grupo").val(grupo);

        const result = await HttpClient.post(gruposEditApi, { "grupo": grupo });
        modal.getField("nombre").val(result.data);
    } catch (error) {
        console.log(error.response);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: error.message
        });
    } finally {
        Loader.hide();
        modal.open();
    }
}

async function updateGrupo() {
    if (!modal.validateMandatory()) return;
    modal.buttonOff("save");

    try {
        const result = await HttpClient.post(gruposUpdateApi, modal.getData());
        updateGruposData();
        modal.close();

        Toast.fire({
            icon: "success",
            title: "Grupo actualizado"
        });
    } catch (error) {
        console.log(error.response);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: error.message
        });
    } finally {
        modal.buttonOn("save");
    }
}

function deleteGrupo(grupo, nombre) {
    Swal.fire({
        title: "¿Quieres borrar este grupo?",
        text: nombre,
        theme: "auto",
        reverseButtons: true,
        showCancelButton: true,
        cancelButtonColor: "#6c757d",
        confirmButtonColor: "#dc3545",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, borrar",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const result = await HttpClient.post(gruposDeleteApi, { "grupo": grupo });
                updateGruposData();
                //modulos.slideUp();

                Toast.fire({
                    icon: "success",
                    title: "Grupo eliminado"
                });
            } catch (err) {
                console.log(err.response);

                Toast.fire({
                    icon: "error",
                    title: "Ocurrió un error",
                    html: err.message
                });
            }
        }
    });
}