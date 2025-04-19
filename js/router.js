let pageUrls = {  
    about: '/index.html?about',
    gallery: '/index.html?gallery',  
    contact:'/index.html?contact'  
}; 
 
function OnStartUp() {      
    popStateHandler();  
} 
 
OnStartUp(); 
 
document.querySelector('#about-link').addEventListener('click', (event) => {      
    let stateObj = { page: 'about' };  
    document.title = 'About';  
    history.pushState(stateObj, "about", "?about");  
    RenderAboutPage();  
}); 

document.querySelector('#galery-link').addEventListener('click', (event) => {  
    let stateObj = { page: 'gallery' };  
    document.title = 'Gallery';  
    history.pushState(stateObj, "gallery", "?gallery");  
    RenderGalleryPage();  
});

document.querySelector('#contact-link').addEventListener('click', (event) => {      
    let stateObj = { page: 'contact' };  
    document.title = 'Contact';  
    history.pushState(stateObj, "contact", "?contact");  
    RenderContactPage();  
}); 
 
function RenderAboutPage() {      
    document.querySelector('main').innerHTML = ` 
        <h1 class="title">About Me</h1>
        <h2>O obozie<h2> 
        <p>Dwa tygodnie w Białym Dunajcu spędzamy na chodzeniu po górach, modlitwie i integracji. Na szlaku spotkać nas można w ciągu tygodnia, kiedy po wczesnej pobudce wyruszamy na tatrzańskie szczyty przed tłumami turystów. Wieczorami uczestniczymy w Eucharystii. Najczęściej wspólnie spotykamy się w miejscowym kościele, ale czasem zostajemy w naszych chatkach na Mszy duszpasterskiej. Po tym najważniejszym w ciągu dnia momencie mamy czas na integrację. Tańczymy na imprezach, wychodzimy na pizzę albo gramy w planszówki. 

W weekendy mamy czas żeby odpocząć od Tatr, ale nie oznacza to nudy. Uczestniczymy wtedy w wydarzeniach ogólnoobozowych, o których przeczytasz poniżej.</p>`; 
} 

function RenderGalleryPage() {
    document.querySelector('main').innerHTML = `
        <h1 class="title">Gallery</h1>
        <div id="gallery-grid" class="gallery-grid"></div>
        <div id="modal" class="modal hidden">
            <span id="modal-close">&times;</span>
            <img class="modal-content" id="modal-image" />
        </div>
    `;

    const galleryGrid = document.getElementById('gallery-grid');
    
    const imageUrls = [
        'images/img1.jpg', 'images/img2.jpg', 'images/img3.jpg', 
        'images/img4.jpg', 'images/img5.JPG', 'images/img6.JPG',
        'images/img7.JPG', 'images/img8.JPG', 'images/img9.JPG'
    ];

    imageUrls.forEach((url, index) => {
        const imgWrapper = document.createElement('div');
        imgWrapper.classList.add('thumbnail-wrapper');
        
        const img = document.createElement('img');
        img.setAttribute('data-src', url);
        img.classList.add('thumbnail');
        img.setAttribute('alt', `Image ${index+1}`);

        imgWrapper.appendChild(img);
        galleryGrid.appendChild(imgWrapper);
    });

    lazyLoadImages();
    setupModal();
}

function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                fetch(img.dataset.src)
                    .then(res => res.blob())
                    .then(blob => {
                        img.src = URL.createObjectURL(blob);
                        img.removeAttribute('data-src');
                    });
                obs.unobserve(img);
            }
        });
    }, { threshold: 0.1 });

    images.forEach(img => observer.observe(img));
}

function setupModal() {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-image');
    const closeBtn = document.getElementById('modal-close');

    document.querySelectorAll('.thumbnail').forEach(img => {
        img.addEventListener('click', () => {
            modal.classList.remove('hidden');
            modalImg.src = img.src;
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        modalImg.src = '';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            modalImg.src = '';
        }
    });
}

function RenderContactPage() {
    document.querySelector('main').innerHTML = `
        <h1 class="title">Contact with me</h1> 
        <form id="contact-form"> 
            <label for="name">Name:</label> 
            <input type="text" id="name" name="name" required> 

            <label for="email">Email:</label> 
            <input type="email" id="email" name="email" required> 

            <label for="message">Message:</label> 
            <textarea id="message" name="message" required></textarea> 

            <div id="recaptcha-container"></div>

            <button type="submit">Send</button> 
        </form> 
    `;

    const form = document.getElementById('contact-form');

    // Inicjalizuj reCAPTCHA dopiero po załadowaniu formularza
    if (typeof grecaptcha !== 'undefined') {
        grecaptcha.render('recaptcha-container', {
            sitekey: '6Lfafh0rAAAAANvF4ZvQw3vy5B-DixopnAOI5JfD'
        });
    } else {
        console.error('reCAPTCHA script not loaded.');
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const recaptchaResponse = grecaptcha.getResponse();

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const message = form.message.value.trim();

        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }

        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (!recaptchaResponse || recaptchaResponse.length === 0) {
            alert('Please verify you are not a robot.');
            return;
        }

        alert('Form submitted!');
        form.reset();
        grecaptcha.reset();
    });
}

function validateEmail(email) {
    const re = `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`;
    return re.test(email);
}


document.getElementById('theme-toggle').addEventListener('click', () => { 
    document.body.classList.toggle('dark-mode'); 
});  
function popStateHandler() {  
    let loc = window.location.href.toString().split(window.location.host)[1];  
 
    if (loc === pageUrls.contact){ RenderContactPage(); } 
    if (loc === pageUrls.gallery) { RenderGalleryPage(); }
    if(loc === pageUrls.about){ RenderAboutPage(); } 
} 
 
window.onpopstate = popStateHandler; 

