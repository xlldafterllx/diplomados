function createTableComponent(name, configuration, data, context) {
    const container = context.getContainer(name);

    moment.updateLocale("es", {
        invalidDate: "S/D"
    });

    let htmlcont = '<table data-table="' + name + '" class="table align-middle table-striped table-hover min_space" style="width:100%; border-collapse: collapse;">' +
        '<thead></thead>' +
        '<tbody></tbody>';

    if (configuration.footerCallback) {
        if (configuration.footerCombined) {
            htmlcont += '<tfoot><tr><th colspan="' + configuration.columns.length + '" class="text-end"></th></tr></tfoot>';
        } else {
            htmlcont += '<tfoot><tr>';
            for (let i = 0; i < configuration.columns.length; i++) {
                htmlcont += '<th></th>';
            }
            htmlcont += '</tr></tfoot>';
        }
    }    

    htmlcont += '</table>';

    container.html(htmlcont);

    const table = context.getTable(name);

    const datatable = table.DataTable({
        columns: configuration.columns,
        data: data,
        scrollX: true,
        paging: configuration.paging ?? false,
        bFilter: configuration.bFilter ?? false,
        info: configuration.info ?? false,
        ordering: true,
        destroy: true,
        lengthChange: false,
        order: configuration.order,
        scrollY: "60vh",
        scrollCollapse: true,
        lengthMenu: [[50, 100, 200, -1], [50, 100, 200, "Mostrar todo"]],
        pagingType: "full_numbers",
        initComplete: function () {
            this.api().columns.adjust();
        },
        drawCallback: function () {
            this.api().columns.adjust();
        },
        language: {
            url: "../content/json/language-es-MX.json"
        },
        layout: {
            topStart: {
                buttons: [
                    {
                        extend: "collection",
                        text: "Exportar",
                        buttons: [
                            {
                                extend: "copyHtml5",
                                text: "Copiar",
                                title: configuration.title,
                                footer: true,
                                exportOptions: configuration.exportOptions ?? ""
                            },
                            {
                                extend: "excelHtml5", text: "Excel",
                                title: configuration.title,
                                filename: configuration.exportName,
                                footer: true,
                                exportOptions: configuration.exportOptions ?? ""
                            },
                            {
                                extend: "csvHtml5",
                                text: "CSV",
                                title: configuration.title,
                                filename: configuration.exportName,
                                footer: true,
                                exportOptions: configuration.exportOptions ?? ""
                            },
                            {
                                extend: "pdfHtml5",
                                text: "PDF",
                                title: configuration.title,
                                filename: configuration.exportName,
                                orientation: "landscape",
                                pageSize: "LEGAL",
                                footer: true,
                                exportOptions: configuration.exportOptions ?? "",
                                customize : function(doc){
                                    doc.content[1].table.widths = Array(doc.content[1].table.body[0].length + 1).join("*").split("");
                                    doc.defaultStyle.alignment = "left";
                                    doc.styles.tableHeader.alignment = "left";
                                }
                            },
                            {
                                extend: "print",
                                text: "Imprimir",
                                title: configuration.title,
                                footer: true,
                                exportOptions: configuration.exportOptions ?? ""
                            }
                        ],
                    },
                ]
            }
        },
        columnDefs: configuration.columnDefs ?? "",
        fixedColumns: configuration.fixedColumns ?? "",
        footerCallback: configuration.footerCallback ?? ""
    });

    return datatable;
}

function updateTableData(datatable, data) {
    datatable.clear();
    datatable.rows.add(data);
    datatable.draw();
}