const API_LOGOUT = BASE_URL + "app/api/auth/logout.php";

async function logout() {
    try {
        await HttpClient.post(API_LOGOUT);
        window.location.reload();
    } catch (err) {
        console.log(err.response);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: err.message
        });
    }    
}