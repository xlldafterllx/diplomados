class InputFormatHelper {
    static applySeparator(input, options = {}) {
        const {
            positions = [],
            separator = "-",
            cleanPattern = /[^a-zA-Z0-9]/g,
            uppercase = false,
            maxLength = null
        } = options;

        const $input = input instanceof jQuery
            ? input
            : $(input);

        const formatValue = (value) => {
            let cleanValue = String(value ?? "")
                .replace(cleanPattern, "");

            if (uppercase) {
                cleanValue = cleanValue.toUpperCase();
            }

            if (maxLength !== null) {
                cleanValue = cleanValue.substring(0, maxLength);
            }

            let result = "";
            let lastPosition = 0;

            for (const position of positions) {
                result += cleanValue.substring(lastPosition, position);

                if (cleanValue.length > position) {
                    result += separator;
                }

                lastPosition = position;
            }

            result += cleanValue.substring(lastPosition);

            return result;
        };

        $input
            .off(".inputFormat")
            .on("input.inputFormat", function () {
                this.value = formatValue(this.value);
            });

        $input.val(formatValue($input.val()));

        return $input;
    }
}