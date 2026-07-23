const Toast = Swal.mixin({
	toast: true,
	theme: "auto",
	position: "top-end",
	showConfirmButton: false,
	timer: 3000,
	timerProgressBar: true,
	didOpen: (toast) => {
		toast.addEventListener("mouseenter", Swal.stopTimer)
		toast.addEventListener("mouseleave", Swal.resumeTimer)
	}
})