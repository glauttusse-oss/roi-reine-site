/* ============================================================
   ROI & REINE — ÉDITION ROUGE
   SCRIPT FINAL
   Navigation • 18+ • Marchés • Prix • Commande • Animations
============================================================ */


document.addEventListener("DOMContentLoaded", () => {


    /* =========================================================
       1. CONFIGURATION
    ========================================================= */

    const MARKETS = {

        kinshasa: {
            name: "Kinshasa",
            flag: "🇨🇩",
            price: 23.90
        },

        brazzaville: {
            name: "Brazzaville",
            flag: "🇨🇬",
            price: 13500
        }

    };


    /*
       =========================================================
       WHATSAPP

       Quand tu auras le numéro qui reçoit les commandes,
       remplace simplement "" par le numéro international.

       Exemple :
       const OWNER_WHATSAPP = "243812345678";

       IMPORTANT :
       - pas de +
       - pas d'espace
       - pas de tiret
       =========================================================
    */

    const OWNER_WHATSAPP = "";



    /* =========================================================
       2. ÉTAT DU SITE
    ========================================================= */

    let currentMarket =
        localStorage.getItem("roiReineMarket")
        || "kinshasa";


    let quantity = 1;

    let mobileMenuOpened = false;



    /* =========================================================
       3. ÉLÉMENTS HTML
    ========================================================= */

    const body =
        document.body;


    /* 18+ */

    const ageScreen =
        document.getElementById("ageScreen");

    const enterSite =
        document.getElementById("enterSite");

    const leaveSite =
        document.getElementById("leaveSite");


    /* HEADER */

    const siteHeader =
        document.getElementById("siteHeader");

    const scrollProgressBar =
        document.getElementById("scrollProgressBar");


    /* MOBILE */

    const mobileMenuButton =
        document.getElementById("mobileMenuButton");

    const mobileMenu =
        document.getElementById("mobileMenu");

    const mobileMenuLinks =
        document.querySelectorAll(
            ".mobile-menu a"
        );


    /* MARCHÉ */

    const marketButton =
        document.getElementById("marketButton");

    const mobileMarketButton =
        document.getElementById("mobileMarketButton");

    const marketModal =
        document.getElementById("marketModal");

    const marketModalClose =
        document.getElementById("marketModalClose");

    const marketChoices =
        document.querySelectorAll(
            ".market-choice"
        );

    const footerMarketButtons =
        document.querySelectorAll(
            "[data-footer-market]"
        );


    /* COMMANDE */

    const productPrice =
        document.getElementById("productPrice");

    const quantityValue =
        document.getElementById("quantityValue");

    const orderTotal =
        document.getElementById("orderTotal");

    const decreaseQuantity =
        document.getElementById("decreaseQuantity");

    const increaseQuantity =
        document.getElementById("increaseQuantity");

    const city =
        document.getElementById("city");

    const orderForm =
        document.getElementById("orderForm");



    /* =========================================================
       4. SCROLL LOCK
    ========================================================= */

    function updateBodyScroll() {

        const ageVisible =
            ageScreen
            &&
            ageScreen.style.display !== "none";


        const marketVisible =
            marketModal
            &&
            marketModal.classList.contains("active");


        const mobileVisible =
            mobileMenu
            &&
            mobileMenu.classList.contains("active");


        if (
            ageVisible
            ||
            marketVisible
            ||
            mobileVisible
        ) {

            body.classList.add("no-scroll");

        }

        else {

            body.classList.remove("no-scroll");

        }

    }



    /* =========================================================
       5. PRIX
    ========================================================= */

    function formatPrice(
        value,
        marketKey = currentMarket
    ) {

        if (
            marketKey === "brazzaville"
        ) {

            return (
                new Intl.NumberFormat(
                    "fr-FR",
                    {
                        maximumFractionDigits: 0
                    }
                ).format(value)
                +
                " F CFA"
            );

        }


        return (
            new Intl.NumberFormat(
                "fr-FR",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            ).format(value)
            +
            " $"
        );

    }



    /* =========================================================
       6. METTRE À JOUR LA COMMANDE
    ========================================================= */

    function updateOrder() {

        const market =
            MARKETS[currentMarket];


        if (!market) {
            return;
        }


        if (quantityValue) {

            quantityValue.textContent =
                quantity;

        }


        if (productPrice) {

            productPrice.textContent =
                formatPrice(
                    market.price,
                    currentMarket
                );

        }


        if (orderTotal) {

            orderTotal.textContent =
                formatPrice(
                    market.price * quantity,
                    currentMarket
                );

        }

    }



    /* =========================================================
       7. APPLIQUER LE MARCHÉ
    ========================================================= */

    function applyMarket(
        marketKey,
        closeAfter = true
    ) {

        if (
            !MARKETS[marketKey]
        ) {

            return;

        }


        currentMarket =
            marketKey;


        const market =
            MARKETS[currentMarket];


        localStorage.setItem(
            "roiReineMarket",
            currentMarket
        );


        const label =
            `${market.flag} ${market.name}`;


        if (marketButton) {

            marketButton.textContent =
                label;

        }


        if (mobileMarketButton) {

            mobileMarketButton.textContent =
                label;

        }


        if (city) {

            city.value =
                market.name;

        }


        updateOrder();


        if (closeAfter) {

            closeMarketModal();

        }

    }



    /* =========================================================
       8. MARKET MODAL
    ========================================================= */

    function openMarketModal() {

        if (!marketModal) {
            return;
        }


        marketModal.classList.add(
            "active"
        );


        updateBodyScroll();

    }



    function closeMarketModal() {

        if (!marketModal) {
            return;
        }


        marketModal.classList.remove(
            "active"
        );


        updateBodyScroll();

    }



    if (marketButton) {

        marketButton.addEventListener(
            "click",
            openMarketModal
        );

    }



    if (mobileMarketButton) {

        mobileMarketButton.addEventListener(
            "click",
            () => {

                closeMobileMenu();

                setTimeout(
                    openMarketModal,
                    220
                );

            }
        );

    }



    if (marketModalClose) {

        marketModalClose.addEventListener(
            "click",
            closeMarketModal
        );

    }



    marketChoices.forEach(choice => {

        choice.addEventListener(
            "click",
            () => {

                const selectedMarket =
                    choice.dataset.market;


                applyMarket(
                    selectedMarket
                );

            }
        );

    });



    if (marketModal) {

        marketModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    marketModal
                ) {

                    closeMarketModal();

                }

            }
        );

    }



    /* =========================================================
       9. FOOTER MARKETS
    ========================================================= */

    footerMarketButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const selectedMarket =
                    button.dataset.footerMarket;


                applyMarket(
                    selectedMarket,
                    false
                );


                const orderSection =
                    document.getElementById(
                        "commander"
                    );


                if (orderSection) {

                    orderSection.scrollIntoView(
                        {
                            behavior: "smooth",
                            block: "start"
                        }
                    );

                }

            }
        );

    });



    /* =========================================================
       10. SELECT VILLE
    ========================================================= */

    if (city) {

        city.addEventListener(
            "change",
            () => {

                if (
                    city.value ===
                    "Brazzaville"
                ) {

                    applyMarket(
                        "brazzaville",
                        false
                    );

                }

                else {

                    applyMarket(
                        "kinshasa",
                        false
                    );

                }

            }
        );

    }



    /* =========================================================
       11. CONTRÔLE 18+
    ========================================================= */

    const ageAccepted =
        localStorage.getItem(
            "roiReineAgeAccepted"
        );


    function showAgeScreen() {

        if (!ageScreen) {
            return;
        }


        ageScreen.style.display =
            "flex";


        updateBodyScroll();

    }



    function hideAgeScreen() {

        if (!ageScreen) {
            return;
        }


        ageScreen.style.display =
            "none";


        updateBodyScroll();

    }



    if (
        ageAccepted === "true"
    ) {

        hideAgeScreen();


        applyMarket(
            currentMarket,
            false
        );

    }

    else {

        showAgeScreen();

    }



    if (enterSite) {

        enterSite.addEventListener(
            "click",
            () => {

                localStorage.setItem(
                    "roiReineAgeAccepted",
                    "true"
                );


                hideAgeScreen();


                const savedMarket =
                    localStorage.getItem(
                        "roiReineMarket"
                    );


                if (!savedMarket) {

                    setTimeout(
                        openMarketModal,
                        350
                    );

                }

                else {

                    applyMarket(
                        savedMarket,
                        false
                    );

                }

            }
        );

    }



    if (leaveSite) {

        leaveSite.addEventListener(
            "click",
            () => {

                document.body.innerHTML =
                `
                <main
                    style="
                        min-height:100vh;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        background:
                            radial-gradient(
                                circle at center,
                                #27050d,
                                #030102 55%
                            );
                        padding:30px;
                        text-align:center;
                        color:#fff4e9;
                        font-family:Arial,sans-serif;
                    "
                >

                    <div
                        style="
                            max-width:520px;
                        "
                    >

                        <h1
                            style="
                                margin-bottom:20px;
                                font-family:Georgia,serif;
                                font-size:3.6rem;
                                font-weight:400;
                                color:#ff143d;
                            "
                        >
                            ROI & REINE
                        </h1>

                        <p
                            style="
                                color:#baa4a7;
                                line-height:1.8;
                            "
                        >
                            Cette expérience
                            est exclusivement réservée
                            aux personnes âgées
                            de 18 ans ou plus.
                        </p>

                    </div>

                </main>
                `;

            }
        );

    }



    /* =========================================================
       12. MENU MOBILE
    ========================================================= */

    function openMobileMenu() {

        if (
            !mobileMenu
            ||
            !mobileMenuButton
        ) {

            return;

        }


        mobileMenu.classList.add(
            "active"
        );


        mobileMenuButton.classList.add(
            "active"
        );


        mobileMenuOpened =
            true;


        updateBodyScroll();

    }



    function closeMobileMenu() {

        if (
            !mobileMenu
            ||
            !mobileMenuButton
        ) {

            return;

        }


        mobileMenu.classList.remove(
            "active"
        );


        mobileMenuButton.classList.remove(
            "active"
        );


        mobileMenuOpened =
            false;


        updateBodyScroll();

    }



    if (mobileMenuButton) {

        mobileMenuButton.addEventListener(
            "click",
            () => {

                if (mobileMenuOpened) {

                    closeMobileMenu();

                }

                else {

                    openMobileMenu();

                }

            }
        );

    }



    mobileMenuLinks.forEach(link => {

        link.addEventListener(
            "click",
            closeMobileMenu
        );

    });



    /* =========================================================
       13. HEADER AU SCROLL
    ========================================================= */

    function updateHeader() {

        if (!siteHeader) {
            return;
        }


        if (
            window.scrollY > 50
        ) {

            siteHeader.classList.add(
                "scrolled"
            );

        }

        else {

            siteHeader.classList.remove(
                "scrolled"
            );

        }

    }



    /* =========================================================
       14. BARRE DE PROGRESSION
    ========================================================= */

    function updateScrollProgress() {

        if (!scrollProgressBar) {
            return;
        }


        const scrollTop =
            window.scrollY;


        const scrollableHeight =
            document.documentElement.scrollHeight
            -
            window.innerHeight;


        if (
            scrollableHeight <= 0
        ) {

            scrollProgressBar.style.width =
                "0%";

            return;

        }


        const progress =
            (
                scrollTop
                /
                scrollableHeight
            )
            *
            100;


        scrollProgressBar.style.width =
            `${progress}%`;

    }



    /* =========================================================
       15. ANIMATION D'APPARITION
    ========================================================= */

    const revealElements =
        document.querySelectorAll(
            `
            .scene-content,
            .cards-intro,
            .how-copy,
            .final-content,
            .final-card,
            .order-product,
            .order-form
            `
        );


    revealElements.forEach(element => {

        element.style.opacity =
            "0";

        element.style.transform =
            "translateY(35px)";

        element.style.transition =
            `
            opacity 0.85s ease,
            transform 0.85s ease
            `;

    });



    if (
        "IntersectionObserver"
        in window
    ) {

        const observer =
            new IntersectionObserver(

                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.style.opacity =
                                "1";

                            entry.target.style.transform =
                                "translateY(0)";


                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },

                {
                    threshold: 0.16
                }

            );


        revealElements.forEach(element => {

            observer.observe(
                element
            );

        });

    }

    else {

        revealElements.forEach(element => {

            element.style.opacity =
                "1";

            element.style.transform =
                "translateY(0)";

        });

    }



    /* =========================================================
       16. LÉGER PARALLAX SUR LES PHOTOS
    ========================================================= */

    const cinematicImages =
        document.querySelectorAll(
            `
            .experience-scene .full-background img,
            .how-photo img
            `
        );


    function updateParallax() {

        if (
            window.innerWidth <= 760
        ) {

            cinematicImages.forEach(image => {

                image.style.translate =
                    "";

            });


            return;

        }


        cinematicImages.forEach(image => {

            const section =
                image.closest(
                    ".experience-scene, .how-row"
                );


            if (!section) {
                return;
            }


            const rect =
                section.getBoundingClientRect();


            if (
                rect.bottom < 0
                ||
                rect.top > window.innerHeight
            ) {

                return;

            }


            const center =
                rect.top
                +
                rect.height / 2;


            const screenCenter =
                window.innerHeight / 2;


            const distance =
                center
                -
                screenCenter;


            const movement =
                distance
                *
                -0.025;


            image.style.translate =
                `0 ${movement}px`;

        });

    }



    /* =========================================================
       17. SCROLL
    ========================================================= */

    let scrollTicking =
        false;


    function handleScroll() {

        if (scrollTicking) {
            return;
        }


        requestAnimationFrame(
            () => {

                updateHeader();

                updateScrollProgress();

                updateParallax();


                scrollTicking =
                    false;

            }
        );


        scrollTicking =
            true;

    }



    window.addEventListener(
        "scroll",
        handleScroll,
        {
            passive: true
        }
    );



    window.addEventListener(
        "resize",
        () => {

            updateScrollProgress();

            updateParallax();


            if (
                window.innerWidth > 1120
                &&
                mobileMenuOpened
            ) {

                closeMobileMenu();

            }

        }
    );



    /* =========================================================
       18. QUANTITÉ
    ========================================================= */

    if (increaseQuantity) {

        increaseQuantity.addEventListener(
            "click",
            () => {

                if (
                    quantity < 20
                ) {

                    quantity++;

                    updateOrder();

                }

            }
        );

    }



    if (decreaseQuantity) {

        decreaseQuantity.addEventListener(
            "click",
            () => {

                if (
                    quantity > 1
                ) {

                    quantity--;

                    updateOrder();

                }

            }
        );

    }



    /* =========================================================
       19. FORMULAIRE
    ========================================================= */

    if (orderForm) {

        orderForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const fullName =
                    document
                    .getElementById(
                        "fullName"
                    )
                    .value
                    .trim();


                const phone =
                    document
                    .getElementById(
                        "phone"
                    )
                    .value
                    .trim();


                const email =
                    document
                    .getElementById(
                        "email"
                    )
                    .value
                    .trim();


                const address =
                    document
                    .getElementById(
                        "address"
                    )
                    .value
                    .trim();


                const note =
                    document
                    .getElementById(
                        "note"
                    )
                    .value
                    .trim();



                if (
                    !fullName
                    ||
                    !phone
                    ||
                    !address
                ) {

                    alert(
                        "Veuillez renseigner votre nom, votre téléphone et votre adresse."
                    );

                    return;

                }



                const market =
                    MARKETS[currentMarket];


                const total =
                    market.price
                    *
                    quantity;



                const message =
`❤️ ROI & REINE — NOUVELLE COMMANDE

👤 Nom :
${fullName}

📱 Téléphone / WhatsApp :
${phone}

📧 E-mail :
${email || "Non renseigné"}

📍 Ville :
${market.name}

🎴 Produit :
ROI & REINE
Action ou Vérité — Édition Rouge

📦 Quantité :
${quantity}

💰 Prix unitaire :
${formatPrice(
    market.price,
    currentMarket
)}

💳 TOTAL :
${formatPrice(
    total,
    currentMarket
)}

🏠 Adresse de livraison :
${address}

📝 Note :
${note || "Aucune"}`;



                /* =============================================
                   WHATSAPP CONFIGURÉ
                ============================================= */

                if (OWNER_WHATSAPP) {

                    const whatsappURL =
                        "https://wa.me/"
                        +
                        OWNER_WHATSAPP
                        +
                        "?text="
                        +
                        encodeURIComponent(
                            message
                        );


                    window.open(
                        whatsappURL,
                        "_blank"
                    );


                    return;

                }



                /* =============================================
                   WHATSAPP PAS ENCORE CONFIGURÉ
                ============================================= */

                console.log(
                    message
                );


                alert(
                    "La commande fonctionne correctement. Il reste seulement à connecter le numéro WhatsApp qui recevra les commandes."
                );

            }
        );

    }



    /* =========================================================
       20. TOUCHE ÉCHAP
    ========================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Escape"
            ) {

                return;

            }


            if (
                marketModal
                &&
                marketModal
                .classList
                .contains("active")
            ) {

                closeMarketModal();

            }


            if (
                mobileMenu
                &&
                mobileMenu
                .classList
                .contains("active")
            ) {

                closeMobileMenu();

            }

        }
    );



    /* =========================================================
       21. INITIALISATION
    ========================================================= */

    applyMarket(
        currentMarket,
        false
    );


    updateOrder();

    updateHeader();

    updateScrollProgress();

    updateParallax();


});