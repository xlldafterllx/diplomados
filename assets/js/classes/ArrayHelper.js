class ArrayHelper {
    /**
     * Busca un elemento por el valor de una propiedad.
     *
     * @param {Array<object>} array
     * @param {string} field
     * @param {*} value
     * @returns {{ index: number, data: object } | null}
     */
    static find(array, field, value) {
        const index = array.findIndex(row => row[field] === value);

        if (index === -1) {
            return null;
        }

        return {
            index,
            data: array[index]
        };
    }

    /**
     * Indica si existe un elemento con el valor proporcionado.
     *
     * @param {Array<object>} array
     * @param {string} field
     * @param {*} value
     * @returns {boolean}
     */
    static exists(array, field, value) {
        return array.some(row => row[field] === value);
    }

    /**
     * Agrega un elemento solamente si no existe.
     *
     * @param {Array<object>} array
     * @param {object} data
     * @param {string} field
     * @returns {boolean}
     */
    static addUnique(array, data, field = "id") {
        if (this.exists(array, field, data[field])) {
            return false;
        }

        array.push(data);

        return true;
    }

    /**
     * Elimina un elemento por el valor de una propiedad.
     *
     * @param {Array<object>} array
     * @param {string} field
     * @param {*} value
     * @returns {boolean}
     */
    static remove(array, field, value) {
        const index = array.findIndex(row => row[field] === value);

        if (index === -1) {
            return false;
        }

        array.splice(index, 1);

        return true;
    }

    /**
     * Elimina un elemento por la propiedad id.
     *
     * @param {Array<object>} array
     * @param {string} id
     */
    static removeById(array, id) {
        return this.remove(array, "id", id);
    }
}