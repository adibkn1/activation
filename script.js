document.addEventListener('DOMContentLoaded', function() {
    let isInitialized = false;
    let activeContainer = 0;
    
    const productContainers = [
        document.getElementById('productContainer1'),
        document.getElementById('productContainer2'),
        document.getElementById('productContainer3'),
        document.getElementById('productContainer4'),
        document.getElementById('productContainer5'),
        document.getElementById('productContainer6'),
        document.getElementById('productContainer7')
    ];

    const qrCodeElement = document.getElementById('qrCode');
    let currentToken = null;
    const dbRef = firebase.database().ref('selectedProduct');

    // Initialize without transition
    productContainers[activeContainer].classList.remove('hidden');
    productContainers[activeContainer].style.zIndex = "2";
    isInitialized = true;
    firebase.database().ref('selectedProduct').set(0);
    switchProduct(0);  // Initialize the first product
    isInitialized = true;  // Now set the flag to true
    
    dbRef.on('value', (snapshot) => {
        const selectedProductIndex = snapshot.val();
        if (selectedProductIndex !== null && selectedProductIndex !== activeContainer) {
            switchProduct(selectedProductIndex);
        }
    });

    function switchProduct(selectedProductIndex) {
        if (selectedProductIndex === activeContainer) {
            return; // No transition if selected image and current image are the same
        }

        console.log("Switching product to:", selectedProductIndex);

        const currentContainer = productContainers[activeContainer];
        const nextContainer = productContainers[selectedProductIndex];

        // Place the next image behind the current image
        nextContainer.style.zIndex = "1";
        nextContainer.classList.remove('hidden');

        // Apply disintegration transition to the current image
        currentContainer.style.zIndex = "2";
        currentContainer.classList.add('disintegrate');

        // After the transition, cleanup
        setTimeout(() => {
            currentContainer.classList.add('hidden');
            currentContainer.classList.remove('disintegrate');
        }, 1000);  // 1s matches your CSS animation time

        activeContainer = selectedProductIndex;
    }
    

    function generateUniqueURL() {
        if (currentToken) {
            firebase.database().ref('tokens/' + currentToken).once('value').then(snapshot => {
                const expirationTime = snapshot.val();
                if (!expirationTime || Date.now() > expirationTime) {
                    createNewUniqueLink();
                }
            });
        } else {
            createNewUniqueLink();
        }
    }

    function createNewUniqueLink() {
    currentToken = Math.random().toString(36).substr(2, 10);
    const baseURL = 'https://adibkn1.github.io/activation/';  // Define the base URL as a string
    const uniqueURL = baseURL + 'mobile.html?token=' + currentToken;  // Concatenate the parts
    const expirationTime = Date.now() + 120000;

        firebase.database().ref('tokens/' + currentToken).set(expirationTime);
        qrCodeElement.innerHTML = '';
        const qrCode = new QRCode(qrCodeElement, {
            text: uniqueURL,
            width: 128,
            height: 128
        });

        qrCode.makeCode(uniqueURL);
        switchProduct(0, true);
    }

    generateUniqueURL();
    setInterval(generateUniqueURL, 120000);
    setInterval(() => {
        generateUniqueURL();
        switchProduct(0);  // Reset to the first image with a transition
    }, 120000);
});
