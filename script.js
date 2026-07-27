const ua = navigator.userAgent;

const match = ua.match(/\(PlayStation Vita[^)]*\)/i);

if (match) {
    alert("Hello there vita user!!!");
}
