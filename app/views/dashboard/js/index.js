let welcome;

$(function () {
    initialize();
});

async function initialize() {
    window.HttpClient = HttpClient;
    window.HttpException = HttpException;
    initializeComponent();
    init();
}

function initializeComponent() {
    welcome = new ComponentHelper("#welcome");
}

function init() {
    welcome.fadeIn();
}