// Get the token from the URL query string
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

// Check if the token has expired
firebase.database().ref('tokens/' + token).once('value').then(snapshot => {
    const expirationTime = snapshot.val();

    if (!expirationTime || Date.now() > expirationTime) {
        // Redirect to the "thanks.html" page if the link has expired
        window.location.href = 'thanks.html';
    } else {
        // Mark the link as used and update the expiration time
        firebase.database().ref('tokens/' + token).set(Date.now() + 120000); // Expires in 2 minutes

        // Start the loading line animation after the page loads
        document.getElementById('loadingLine').classList.add('start');
    }
});

function selectProduct(productIndex) {
    // Remove the selected class from the previously selected product
    const previousSelectedCell = document.querySelector('.product-cell.selected');
    if (previousSelectedCell) {
        previousSelectedCell.classList.remove('selected');
    }

    // Add the selected class to the newly selected product
    const selectedCell = document.querySelector(`.product-cell:nth-child(${productIndex + 1})`);
    if (selectedCell) {
        selectedCell.classList.add('selected');
    }

    // Increment productIndex by 1 to match the main page's product numbering
    firebase.database().ref('selectedProduct').set(productIndex + 1);
}


// Redirect to "thanks.html" after 2 minutes
setTimeout(() => {
    window.location.href = 'thanks.html';
}, 120000);
