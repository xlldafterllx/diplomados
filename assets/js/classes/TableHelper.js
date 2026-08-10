class TableHelper {
    static defaults(configuration = {}) {
        return {
            scrollX: true,
            ordering: true,
            destroy: true,
            scrollY: "60vh",
            scrollCollapse: true,
            info: false,
            paging: false,
            lengthChange: false,

            language: {
                url: "assets/vendor/datatables/json/language-es-MX.json"
            },

            drawCallback: function () {
                const table = this.api();
                const $table = $(table.table().node());

                const hasData = table
                    .rows({
                        search: "applied"
                    })
                    .count() > 0;

                const previousState = $table.hasClass("dt-has-data");

                $table.toggleClass("dt-has-data", hasData);
                $table.toggleClass("dt-no-data", !hasData);

                if (previousState !== hasData) {
                    requestAnimationFrame(() => {
                        table.columns.adjust();
                    });
                }
            },

            ...configuration
        };
    }

    static create(component, name, configuration = {}) {
        const table = component.getTable(name);
        const options = { ...configuration };

        const rebuild = options.rebuild ?? false;
        delete options.rebuild;

        if (rebuild) {
            if ($.fn.DataTable.isDataTable(table)) {
                table.DataTable().destroy();
            }

            table.empty();
        }

        if (options.footer) {
            this.createFooter(
                table,
                configuration.columns,
                configuration.footer
            );

            delete options.footer;
        }

        return table.DataTable(
            this.defaults(options)
        );
    }

    static update(datatable, data) {
        datatable.clear();
        datatable.rows.add(data);
        datatable.draw();
        datatable.columns.adjust();
    }

    static destroy(datatable) {
        datatable.destroy();
    }

    static createFooter(table, columns, footerConfiguration) {
        const combined = footerConfiguration?.combined ?? false;

        table.find("tfoot").remove();

        let html = "<tfoot><tr>";

        if (combined) {
            html += `<th colspan="${columns.length}"></th>`;
        } else {
            columns.forEach(() => {
                html += "<th></th>";
            });
        }

        html += "</tr></tfoot>";

        table.append(html);
    }

    static exportButtons(configuration = {}) {
        const buttons = [
            {
                extend: "collection",
                text: "Exportar",
                buttons: [
                    {
                        extend: "copyHtml5",
                        text: "Copiar",
                        title: configuration.title,
                        footer: true,
                        exportOptions: configuration.exportOptions ?? {}
                    },
                    {
                        extend: "excelHtml5",
                        text: "Excel",
                        title: configuration.title,
                        filename: configuration.filename,
                        footer: true,
                        autoFilter: true,
                        exportOptions: configuration.exportOptions ?? {}
                    },
                    {
                        extend: "csvHtml5",
                        text: "CSV",
                        title: configuration.title,
                        filename: configuration.filename,
                        footer: true,
                        exportOptions: configuration.exportOptions ?? {}
                    },
                    {
                        extend: "pdfHtml5",
                        text: "PDF",
                        title: configuration.title,
                        filename: configuration.filename,
                        orientation: configuration.orientation ?? "landscape",
                        pageSize: configuration.pageSize ?? "LEGAL",
                        footer: true,
                        exportOptions: configuration.exportOptions ?? {},
                        customize: configuration.customize
                    },
                    {
                        extend: "print",
                        text: "Imprimir",
                        title: configuration.title,
                        footer: true,
                        exportOptions: configuration.exportOptions ?? {}
                    }
                ]
            },

            ...(configuration.buttons ?? [])
        ];

        return {
            layout: {
                topStart: {
                    buttons
                }
            }
        };
    }

}