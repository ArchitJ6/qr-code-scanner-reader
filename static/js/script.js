document.getElementById('generate-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const data = document.getElementById('data').value;

    fetch('/generate_qr', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${data}`,
    })
        .then(response => response.json())
        .then(data => {
            const qrImageContainer = document.getElementById('qr-image-container');
            qrImageContainer.innerHTML = `<img src="data:image/png;base64,${data.image_data}" alt="QR Code">`;
        });
});

function copyToClipboard(text) {
    document.getElementById("copy-button").innerHTML = "Copied!";
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
}

const scanner = new Instascan.Scanner({ video: document.getElementById("scanner") });
document.getElementById("scan-again").style.display = "none";

function startScanning() {
    scanner.addListener("scan", function (content) {
        document.getElementById("qr-result").innerHTML = "Scanned: " + content;
        document.getElementById("copy-button").style.display = "inline-block";
        // scanner.stop();
        document.getElementById("scan-again").style.display = "inline-block";

        document.getElementById("copy-button").addEventListener("click", function () {
            const decodedText = content; // Replace with your actual decoded text
            copyToClipboard(decodedText);
        });
    });

    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]); // Start scanning using the first available camera
        } else {
            console.error("No cameras found.");
            document.getElementById("qr-result").innerHTML = "No cameras found.";
        }
    }).catch(function (error) {
        console.error("Camera access error:", error);
        document.getElementById("qr-result").innerHTML = "Camera access error: " + error.message;
    });
}

document.getElementById("scan-again").addEventListener("click", function () {
    document.getElementById("qr-result").innerHTML = "";
    document.getElementById("scan-again").style.display = "none";
    document.getElementById("copy-button").innerHTML = "Copy Decoded Text";
    document.getElementById("copy-button").style.display = "none";
    startScanning();
});

startScanning(); // Initial scanning
