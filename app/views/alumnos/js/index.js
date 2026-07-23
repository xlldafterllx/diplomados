const alumnosListApi = API_URL + "alumnos/list.php";

// Components
let alumnos;

// Tables
let tableAlumnos;

// Tables data
let tableAlumnosData = [];

$(function () {
    initialize();
});

function initialize() {
    window.HttpClient = HttpClient;
    window.HttpException = HttpException;
    components();
    tables();
    //loadAlumnos();
}

function components() {
    alumnos = new ComponentHelper("#alumnos");

    cmpValidationFields();
    cmpActions();
}

function cmpValidationFields() {
    /*modal.setMandatoryFields([
        { field: "nombre", name: "Nombre", type: "input" }
    ]);*/
}

function cmpActions() {
    /*alumnos.onAction("new", () => {
        modal.getBind("title").text("Agregar alumno");
        modal.getBind("name").text("Nombre del alumno");
        modal.getContainer("button").attr("data-action", "save");
        modal.getContainer("value").attr("data-value", "alumno");
        modal.getField("nombre").val("");
        modal.open();
    });*/
}

function tables() {
    tblAlumnos();
}

function tblAlumnos() {
    const columns = [
        {
            data: 'nombre',
            name: 'nombre',
            title: 'Nombre del alumno'
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
                        '<button type="button" title="Editar alumno" class="btn btn-outline-success" onclick="editAlumno(' + data + ')">' +
                        '<i class="fa-solid fa-pen-to-square"></i>' +
                        '</button>' +
                        '&nbsp' +
                        '<button type="button" title="Eliminar alumno" class="btn btn-outline-danger" onclick="deleteAlumno(' + data + ', \'' + row["nombre"] + '\'' + ')">' +
                        '<i class="fa-solid fa-trash-can"></i>' +
                        '</button>' +
                        '</div>';
                }
                return data;
            }
        }
    ]

    tableAlumnos = TableHelper.create(
        alumnos,
        "alumnos",
        {
            columns,
            tableAlumnosData,
            fixedColumns: { left: 0, right: 1 },
            order: [{ name: "nombre", dir: "asc" }],
            columnDefs: [
                { targets: "actions:name", width: 1, orderable: false, className: "notexport" },
                { targets: "_all", className: "align-content-center dt-head-nowrap dt-head-left dt-body-left" }
            ],
            ...TableHelper.exportButtons({
                title: "Alumnos",
                filename: "alumnos_" + moment(TODAY).format(formatDateExport)
            }),
            exportOptions: {
                columns: ":not(.notexport)"
            }
        }
    );
}

async function loadAlumnos() {
    try {
        Loader.show();
        //modulos.slideUp();

        const result = await HttpClient.post(alumnosListApi, {});
        tableAlumnosData = result.data;

        TableHelper.update(tableAlumnos, tableAlumnosData);
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

async function updateAlumnosData() {
    try {
        Loader.show();

        const result = await HttpClient.post(alumnosListApi, {});
        tableAlumnosData = result.data;

        TableHelper.update(tableAlumnos, tableAlumnosData);
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

async function newAlumno() {
    if (!modal.validateMandatory()) return;
    modal.buttonOff("save");

    try {
        const result = await HttpClient.post(alumnosStoreApi, modal.getData());
        updateAlumnosData();
        modal.close();

        Toast.fire({
            icon: "success",
            title: "Alumno creado"
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

async function editAlumno(alumno) {
    try {
        Loader.show();

        modal.getBind("title").text("Editar alumno");
        modal.getBind("name").text("Nombre del alumno");
        modal.getContainer("button").attr("data-action", "update");
        modal.getContainer("value").attr("data-value", "alumno");
        modal.getField("alumno").val(alumno);

        const result = await HttpClient.post(alumnosEditApi, { "alumno": alumno });
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

async function updateAlumno() {
    if (!modal.validateMandatory()) return;
    modal.buttonOff("save");

    try {
        const result = await HttpClient.post(alumnosUpdateApi, modal.getData());
        updateAlumnosData();
        modal.close();

        Toast.fire({
            icon: "success",
            title: "Alumno actualizado"
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

function deleteAlumno(alumno, nombre) {
    Swal.fire({
        title: "¿Quieres borrar este alumno?",
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
                const result = await HttpClient.post(alumnosDeleteApi, { "alumno": alumno });
                updateAlumnosData();
                //modulos.slideUp();

                Toast.fire({
                    icon: "success",
                    title: "Alumno eliminado"
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