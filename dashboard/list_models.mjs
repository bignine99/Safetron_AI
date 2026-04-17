async function listModels() {
    const key = "AIzaSyDZ0QWi-KHqFSTFWdTdEE_KdnjMMyJ3PUo";
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch(e) {
        console.error(e);
    }
}
listModels();
