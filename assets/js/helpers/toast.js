const Toast = {
	fire(options) {
		return Swal.fire({
			toast: true,
			theme: Theme.getResolved(),
			position: "top-end",
			showConfirmButton: false,
			timer: 3000,
			timerProgressBar: true,

			didOpen: toast => {
				toast.addEventListener(
					"mouseenter",
					Swal.stopTimer
				);

				toast.addEventListener(
					"mouseleave",
					Swal.resumeTimer
				);
			},

			...options
		});
	}
};