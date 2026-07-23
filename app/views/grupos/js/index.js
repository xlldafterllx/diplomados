const gruposListApi = API_URL + "grupos/list.php";

// Components
let grupos;

// Tables
let tableGrupos;

// Tables data
let tableGruposData = [];

$(function () {
    initialize();
});

function initialize() {
    window.HttpClient = HttpClient;
    window.HttpException = HttpException;
    components();
    tables();
    //loadGrupos();
}

function components() {
    grupos = new ComponentHelper("#grupos");

    cmpValidationFields();
    cmpActions();
}

function cmpValidationFields() {
    /*modal.setMandatoryFields([
        { field: "nombre", name: "Nombre", type: "input" }
    ]);*/
}

function cmpActions() {
    /*grupos.onAction("new", () => {
        modal.getBind("title").text("Agregar grupo");
        modal.getBind("name").text("Nombre del grupo");
        modal.getContainer("button").attr("data-action", "save");
        modal.getContainer("value").attr("data-value", "grupo");
        modal.getField("nombre").val("");
        modal.open();
    });*/
}

function tables() {
    tblGrupos();
}

function tblGrupos() {
    const columns = [
        {
            data: 'nombre',
            name: 'nombre',
            title: 'Nombre del grupo'
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

async function loadGrupos() {
    try {
        Loader.show();
        //modulos.slideUp();

        const result = await HttpClient.post(gruposListApi, {});
        tableGruposData = result.data;

        TableHelper.update(tableGrupos, tableGruposData);
    } catch (err) {
        console.log(err.response);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: err.message
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
    } catch (err) {
        console.log(err.response);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: err.message
        });
    } finally {
        Loader.hide();
    }
}

async function newGrupo() {
    if (!modal.validateMandatory()) return;
    modal.buttonOff("save");

    try {
        const result = await HttpClient.post(gruposStoreApi, modal.getData());
        updateGruposData();
        modal.close();

        Toast.fire({
            icon: "success",
            title: "Grupo creado"
        });
    } catch (err) {
        console.log(err.response);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: err.message
        });
    } finally {
        modal.buttonOn("save");
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
    } catch (err) {
        console.log(err.response);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: err.message
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
    } catch (err) {
        console.log(err.response);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: err.message
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