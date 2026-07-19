const API_VIEWS_LOAD = BASE_URL + "app/api/views/load.php";
class ViewLoader {
    static async load(view) {
        try {
            const result = await HttpClient.post(API_VIEWS_LOAD, {
                view: view
            });

            $("#view-content").html(result.data);
            ComponentHelper.cards("#view-content");

            return true;

        } catch (err) {
            console.log(err.response);

            Toast.fire({
                icon: "error",
                title: "Ocurrió un error",
                html: err.message
            });

            return false;
        }
    }
}