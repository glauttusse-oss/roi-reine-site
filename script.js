/* ============================================================
   ROI & REINE — ÉDITION ROUGE
   SCRIPT COMPLET
   Curiosité • Marchés • Paiements • Commande • Animations
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       1. CONFIGURATION DES MARCHÉS
    ========================================================= */

    const MARKETS = {

        kinshasa: {

            key: "kinshasa",
            city: "Kinshasa",
            country: "RDC",
            flag: "🇨🇩",
            price: 23.90,
            currency: "USD",

            paymentProviders: [

                {
                    name: "M-Pesa",
                    number: "+243826787512"
                },

                {
                    name: "Orange Money",
                    number: "+243850691536"
                }

            ]

        },


        brazzaville: {

            key: "brazzaville",
            city: "Brazzaville",
            country: "Congo",
            flag: "🇨🇬",
            price: 13500,
            currency: "XAF",

            paymentProviders: [

                {
                    name: "M-Pesa",
                    number: "+243826787512"
                },

                {
                    name: "Orange Money",
                    number: "+243850691536"
                }

            ]

        },


        libreville: {

            key: "libreville",
            city: "Libreville",
            country: "Gabon",
            flag: "🇬🇦",

            price: null,

            currency: "XAF",

            paymentProviders: [

                {
                    name: "M-Pesa",
                    number: "+243826787512"
                },

                {
                    name: "Orange Money",
                    number: "+243850691536"
                }

            ]

        }

    };


    /* =========================================================
       2. CONFIGURATION DES PAIEMENTS
    ========================================================= */

    const PAYMENT_ACCOUNTS = {

        "M-Pesa": {

            name: "M-Pesa",
            number: "+243826787512"

        },


        "Orange Money": {

            name: "Orange Money",
            number: "+243850691536"

        }

    };


    /* =========================================================
       API ROI & REINE
    ========================================================= */

    const API_BASE_URL =
        "https://api.ky5globaltrade.com";

    const ORDER_API_URL =
        `${API_BASE_URL}/api/roi-reine/orders`;


    /* =========================================================
       3. NUMÉRO WHATSAPP DES COMMANDES
    ========================================================= */

    /*
        IMPORTANT :

        Pour wa.me :

        - pas de +
        - pas d'espace
        - pas de tiret
    */

    const OWNER_WHATSAPP = "243850691536";


    /* =========================================================
       4. ÉTAT DU SITE
    ========================================================= */

    let currentMarket =
        localStorage.getItem("roiReineMarket")
        || "kinshasa";


    if (!MARKETS[currentMarket]) {

        currentMarket =
            "kinshasa";

    }


    let quantity = 1;

    let mobileMenuOpened = false;


    /* =========================================================
       5. RÉCUPÉRATION DES ÉLÉMENTS HTML
    ========================================================= */

    const body =
        document.body;


    /* AGE */

    const ageScreen =
        document.getElementById(
            "ageScreen"
        );

    const enterSite =
        document.getElementById(
            "enterSite"
        );

    const leaveSite =
        document.getElementById(
            "leaveSite"
        );


    /* HEADER */

    const siteHeader =
        document.getElementById(
            "siteHeader"
        );

    const scrollProgressBar =
        document.getElementById(
            "scrollProgressBar"
        );


    /* MENU MOBILE */

    const mobileMenuButton =
        document.getElementById(
            "mobileMenuButton"
        );

    const mobileMenu =
        document.getElementById(
            "mobileMenu"
        );

    const mobileMenuLinks =
        document.querySelectorAll(
            ".mobile-menu a"
        );


    /* MARCHÉS */

    const marketButton =
        document.getElementById(
            "marketButton"
        );

    const mobileMarketButton =
        document.getElementById(
            "mobileMarketButton"
        );

    const marketModal =
        document.getElementById(
            "marketModal"
        );

    const marketModalClose =
        document.getElementById(
            "marketModalClose"
        );

    const marketChoices =
        document.querySelectorAll(
            ".market-choice"
        );

    const marketShortcutButtons =
        document.querySelectorAll(
            "[data-footer-market]"
        );


    /* COMMANDE */

    const productPrice =
        document.getElementById(
            "productPrice"
        );

    const selectedMarketName =
        document.getElementById(
            "selectedMarketName"
        );

    const quantityValue =
        document.getElementById(
            "quantityValue"
        );

    const decreaseQuantity =
        document.getElementById(
            "decreaseQuantity"
        );

    const increaseQuantity =
        document.getElementById(
            "increaseQuantity"
        );

    const orderTotal =
        document.getElementById(
            "orderTotal"
        );

    const paymentTotal =
        document.getElementById(
            "paymentTotal"
        );

    const citySelect =
        document.getElementById(
            "city"
        );

    const orderForm =
        document.getElementById(
            "orderForm"
        );


    /* PAIEMENT */

    const paymentMobileMoney =
        document.getElementById(
            "paymentMobileMoney"
        );

    const paymentDelivery =
        document.getElementById(
            "paymentDelivery"
        );

    const paymentProviderWrapper =
        document.getElementById(
            "paymentProviderWrapper"
        );

    const paymentProvider =
        document.getElementById(
            "paymentProvider"
        );

    const paymentInformation =
        document.getElementById(
            "paymentInformation"
        );


    /* =========================================================
       6. BLOQUER / LIBÉRER LE SCROLL
    ========================================================= */

    function updateBodyScroll() {

        const ageVisible =
            ageScreen
            &&
            ageScreen.style.display !== "none";


        const marketVisible =
            marketModal
            &&
            marketModal.classList.contains(
                "active"
            );


        const mobileVisible =
            mobileMenu
            &&
            mobileMenu.classList.contains(
                "active"
            );


        if (
            ageVisible
            ||
            marketVisible
            ||
            mobileVisible
        ) {

            body.classList.add(
                "no-scroll"
            );

        }

        else {

            body.classList.remove(
                "no-scroll"
            );

        }

    }


    /* =========================================================
       7. FORMATAGE DES PRIX
    ========================================================= */

    function formatPrice(
        value,
        marketKey = currentMarket
    ) {

        const market =
            MARKETS[marketKey];


        if (
            !market
            ||
            value === null
            ||
            typeof value !== "number"
        ) {

            return "Prix à confirmer";

        }


        /* BRAZZAVILLE / LIBREVILLE */

        if (
            market.currency === "XAF"
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


        /* KINSHASA */

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
       8. CALCUL DU TOTAL
    ========================================================= */

    function calculateTotal() {

        const market =
            MARKETS[currentMarket];


        if (
            !market
            ||
            market.price === null
        ) {

            return null;

        }


        return (
            market.price
            *
            quantity
        );

    }


    /* =========================================================
       9. FOURNISSEURS MOBILE MONEY
    ========================================================= */

    function updatePaymentProviders() {

        if (!paymentProvider) {

            return;

        }


        const market =
            MARKETS[currentMarket];


        if (!market) {

            return;

        }


        const previousProvider =
            paymentProvider.value;


        paymentProvider.innerHTML =
            "";


        market
            .paymentProviders
            .forEach(provider => {


                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    provider.name;


                option.dataset.paymentNumber =
                    provider.number;


                option.textContent =
                    `${provider.name} — ${formatPhoneNumber(provider.number)}`;


                paymentProvider.appendChild(
                    option
                );


            });


        const stillExists =
            market
                .paymentProviders
                .some(
                    provider =>
                        provider.name === previousProvider
                );


        if (stillExists) {

            paymentProvider.value =
                previousProvider;

        }


        updatePaymentInformation();

    }


    /* =========================================================
       10. FORMATAGE NUMÉRO
    ========================================================= */

    function formatPhoneNumber(number) {

        if (!number) {

            return "";

        }


        const cleaned =
            number
                .replace(/\s+/g, "");


        if (
            cleaned === "+243826787512"
        ) {

            return "+243 826 787 512";

        }


        if (
            cleaned === "+243850691536"
        ) {

            return "+243 850 691 536";

        }


        return number;

    }


    /* =========================================================
       11. RÉCUPÉRER LE NUMÉRO DE PAIEMENT
    ========================================================= */

    function getSelectedPaymentAccount() {

        if (!paymentProvider) {

            return null;

        }


        const providerName =
            paymentProvider.value;


        return (
            PAYMENT_ACCOUNTS[providerName]
            ||
            null
        );

    }


    /* =========================================================
       12. INFORMATIONS DU PAIEMENT
    ========================================================= */

    function updatePaymentInformation() {

        if (!paymentInformation) {

            return;

        }


        const account =
            getSelectedPaymentAccount();


        if (!account) {

            paymentInformation.innerHTML =
                "Sélectionnez un moyen de paiement.";

            return;

        }


        const total =
            calculateTotal();


        const totalText =
            formatPrice(
                total,
                currentMarket
            );


        let priceMessage =
            `Montant à payer : <strong>${totalText}</strong>`;


        if (total === null) {

            priceMessage =
                "<strong>Le montant sera confirmé avant le paiement.</strong>";

        }


        paymentInformation.innerHTML =
            `
                <strong>${account.name}</strong><br>
                Numéro de paiement :
                <strong>${formatPhoneNumber(account.number)}</strong><br><br>

                ${priceMessage}<br><br>

                Après le paiement, cliquez sur
                <strong>« Confirmer ma commande »</strong>.<br>
                La commande sera enregistrée sur notre serveur
                puis une confirmation WhatsApp pourra être envoyée.
            `;

    }


    /* =========================================================
       13. AFFICHAGE MOBILE MONEY
    ========================================================= */

    function updatePaymentMethodDisplay() {

        if (!paymentProviderWrapper) {

            return;

        }


        const mobileSelected =
            !paymentDelivery
            ||
            paymentMobileMoney?.checked
            ||
            paymentDelivery.disabled;


        if (mobileSelected) {

            paymentProviderWrapper.style.display =
                "block";

        }

        else {

            paymentProviderWrapper.style.display =
                "none";

        }


        updatePaymentInformation();

    }


    /* =========================================================
       14. MISE À JOUR PRIX / TOTAL / MARCHÉ
    ========================================================= */

    function updateOrderDisplay() {

        const market =
            MARKETS[currentMarket];


        if (!market) {

            return;

        }


        const total =
            calculateTotal();


        /* QUANTITÉ */

        if (quantityValue) {

            quantityValue.textContent =
                quantity;

        }


        /* PRIX UNITAIRE */

        if (productPrice) {

            productPrice.textContent =
                formatPrice(
                    market.price,
                    currentMarket
                );

        }


        /* MARCHÉ */

        if (selectedMarketName) {

            selectedMarketName.textContent =
                `${market.city} · ${market.country}`;

        }


        /* TOTAL */

        const totalText =
            formatPrice(
                total,
                currentMarket
            );


        if (orderTotal) {

            orderTotal.textContent =
                totalText;

        }


        if (paymentTotal) {

            paymentTotal.textContent =
                totalText;

        }


        updatePaymentInformation();

    }


    /* =========================================================
       15. APPLIQUER UN MARCHÉ
    ========================================================= */

    function applyMarket(
        marketKey,
        closeModalAfter = true
    ) {

        if (!MARKETS[marketKey]) {

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


        const marketLabel =
            `${market.flag} ${market.city}`;


        /* HEADER */

        if (marketButton) {

            marketButton.textContent =
                marketLabel;

        }


        /* MOBILE */

        if (mobileMarketButton) {

            mobileMarketButton.textContent =
                marketLabel;

        }


        /* FORMULAIRE */

        if (citySelect) {

            citySelect.value =
                market.city;

        }


        updatePaymentProviders();

        updateOrderDisplay();

        updatePaymentMethodDisplay();


        if (closeModalAfter) {

            closeMarketModal();

        }

    }


    /* =========================================================
       16. MODAL MARCHÉS
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


    marketChoices.forEach(choice => {

        choice.addEventListener(
            "click",
            () => {


                const marketKey =
                    choice.dataset.market;


                applyMarket(
                    marketKey
                );


            }
        );

    });


    /* =========================================================
       17. BOUTONS MARCHÉS BAS DE PAGE
    ========================================================= */

    marketShortcutButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {


                const marketKey =
                    button.dataset.footerMarket;


                applyMarket(
                    marketKey,
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
       18. CHANGEMENT DE VILLE
    ========================================================= */

    if (citySelect) {

        citySelect.addEventListener(
            "change",
            () => {


                const selectedCity =
                    citySelect.value;


                switch (
                    selectedCity
                ) {

                    case "Brazzaville":

                        applyMarket(
                            "brazzaville",
                            false
                        );

                        break;


                    case "Libreville":

                        applyMarket(
                            "libreville",
                            false
                        );

                        break;


                    default:

                        applyMarket(
                            "kinshasa",
                            false
                        );

                }


            }
        );

    }


    /* =========================================================
       19. CHANGEMENT DU SERVICE DE PAIEMENT
    ========================================================= */

    if (paymentProvider) {

        paymentProvider.addEventListener(
            "change",
            () => {

                updatePaymentInformation();

            }
        );

    }


    if (paymentMobileMoney) {

        paymentMobileMoney.addEventListener(
            "change",
            updatePaymentMethodDisplay
        );

    }


    if (paymentDelivery) {

        paymentDelivery.addEventListener(
            "change",
            updatePaymentMethodDisplay
        );

    }


    /* =========================================================
       20. ÉCRAN 18+
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


                /*
                    Première visite :
                    on demande le marché.
                */

                const savedMarket =
                    localStorage.getItem(
                        "roiReineMarket"
                    );


                if (!savedMarket) {

                    setTimeout(
                        openMarketModal,
                        500
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
                            padding:30px;
                            text-align:center;
                            background:
                                radial-gradient(
                                    circle at center,
                                    #27050d,
                                    #020102 58%
                                );
                            color:#fff4e9;
                            font-family:Arial,sans-serif;
                        "
                    >

                        <div
                            style="
                                max-width:550px;
                            "
                        >

                            <h1
                                style="
                                    margin-bottom:18px;
                                    color:#ff143d;
                                    font-family:Georgia,serif;
                                    font-size:4rem;
                                    font-weight:400;
                                "
                            >
                                ROI & REINE
                            </h1>

                            <p
                                style="
                                    color:#b7a2a5;
                                    line-height:1.8;
                                "
                            >
                                Cette expérience est réservée
                                exclusivement aux personnes
                                âgées de 18 ans ou plus.
                            </p>

                        </div>

                    </main>
                    `;


            }
        );

    }


    /* =========================================================
       21. MENU MOBILE
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
       22. HEADER
    ========================================================= */

    function updateHeader() {

        if (!siteHeader) {

            return;

        }


        if (
            window.scrollY > 55
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
       23. BARRE DE PROGRESSION
    ========================================================= */

    function updateScrollProgress() {

        if (!scrollProgressBar) {

            return;

        }


        const scrollTop =
            window.scrollY;


        const scrollHeight =
            document.documentElement.scrollHeight
            -
            window.innerHeight;


        if (
            scrollHeight <= 0
        ) {

            scrollProgressBar.style.width =
                "0%";

            return;

        }


        const progress =
            (
                scrollTop
                /
                scrollHeight
            )
            *
            100;


        scrollProgressBar.style.width =
            `${progress}%`;

    }


    /* =========================================================
       24. ANIMATIONS D'APPARITION
    ========================================================= */

    const revealElements =
        document.querySelectorAll(
            `
            .statement-section h2,
            .experience-copy,
            .mystery-content,
            .cards-heading,
            .card-reveal-stage,
            .choice-content,
            .journey-heading,
            .journey-copy,
            .last-card-product,
            .last-card-copy,
            .pre-order-section,
            .order-product,
            .order-form
            `
        );


    revealElements.forEach(element => {


        element.style.opacity =
            "0";


        element.style.transform =
            "translateY(42px)";


        element.style.transition =
            `
            opacity 0.9s cubic-bezier(.2,.7,.2,1),
            transform 0.9s cubic-bezier(.2,.7,.2,1)
            `;


    });


    if (
        "IntersectionObserver"
        in window
    ) {


        const revealObserver =
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


                            revealObserver.unobserve(
                                entry.target
                            );


                        }


                    });


                },

                {

                    threshold: 0.13,

                    rootMargin:
                        "0px 0px -40px 0px"

                }

            );


        revealElements.forEach(element => {

            revealObserver.observe(
                element
            );

        });


    }

    else {


        revealElements.forEach(element => {

            element.style.opacity =
                "1";

            element.style.transform =
                "none";

        });


    }


    /* =========================================================
       25. PARALLAX DES GRANDES IMAGES
    ========================================================= */

    const parallaxImages =
        document.querySelectorAll(
            `
            .experience-photo img,
            .mystery-photo img,
            .journey-image img
            `
        );


    function updateParallax() {


        if (
            window.innerWidth <= 760
        ) {


            parallaxImages.forEach(image => {

                image.style.translate =
                    "";

            });


            return;

        }


        parallaxImages.forEach(image => {


            const parent =
                image.closest(
                    `
                    .experience-panel,
                    .mystery-section,
                    .journey-card
                    `
                );


            if (!parent) {

                return;

            }


            const rect =
                parent
                    .getBoundingClientRect();


            if (
                rect.bottom < 0
                ||
                rect.top >
                window.innerHeight
            ) {

                return;

            }


            const sectionCenter =
                rect.top
                +
                rect.height / 2;


            const viewportCenter =
                window.innerHeight / 2;


            const distance =
                sectionCenter
                -
                viewportCenter;


            const movement =
                distance
                *
                -0.022;


            image.style.translate =
                `0 ${movement}px`;


        });


    }


    /* =========================================================
       26. EFFET HERO
    ========================================================= */

    const hero =
        document.querySelector(
            ".hero"
        );

    const heroProduct =
        document.querySelector(
            ".hero-product"
        );

    const heroRedLight =
        document.querySelector(
            ".hero-red-light"
        );


    if (hero) {


        hero.addEventListener(
            "mousemove",
            event => {


                if (
                    window.innerWidth <= 760
                ) {

                    return;

                }


                const rect =
                    hero.getBoundingClientRect();


                const x =
                    (
                        event.clientX
                        -
                        rect.left
                    )
                    /
                    rect.width
                    -
                    0.5;


                const y =
                    (
                        event.clientY
                        -
                        rect.top
                    )
                    /
                    rect.height
                    -
                    0.5;


                if (heroProduct) {

                    heroProduct.style.translate =
                        `${x * 12}px ${y * 10}px`;

                }


                if (heroRedLight) {

                    heroRedLight.style.translate =
                        `${x * 35}px ${y * 30}px`;

                }


            }
        );


        hero.addEventListener(
            "mouseleave",
            () => {


                if (heroProduct) {

                    heroProduct.style.translate =
                        "0 0";

                }


                if (heroRedLight) {

                    heroRedLight.style.translate =
                        "0 0";

                }


            }
        );


    }


    /* =========================================================
       27. QUANTITÉ
    ========================================================= */

    if (increaseQuantity) {

        increaseQuantity.addEventListener(
            "click",
            () => {


                if (
                    quantity < 20
                ) {


                    quantity++;


                    updateOrderDisplay();


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


                    updateOrderDisplay();


                }


            }
        );

    }


    /* =========================================================
       28. FORMULAIRE DE COMMANDE
    ========================================================= */

    if (orderForm) {

        orderForm.addEventListener(
            "submit",
            async event => {


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
                        "Veuillez renseigner votre nom, votre téléphone et votre adresse de livraison."
                    );


                    return;


                }


                const market =
                    MARKETS[currentMarket];


                if (!market) {

                    alert(
                        "Le marché sélectionné est invalide."
                    );

                    return;

                }


                /*
                    Libreville reste volontairement bloqué
                    tant que le prix officiel n'a pas été communiqué.
                */

                if (
                    currentMarket === "libreville"
                    ||
                    market.price === null
                ) {

                    alert(
                        "Le prix de ROI & REINE à Libreville n'est pas encore configuré. La commande ne peut pas encore être validée pour ce marché."
                    );

                    return;

                }


                /* =================================================
                   PAIEMENT
                ================================================= */

                const account =
                    getSelectedPaymentAccount();


                if (!account) {

                    alert(
                        "Veuillez sélectionner un moyen de paiement."
                    );

                    return;

                }


                const provider =
                    account.name;


                const paymentNumber =
                    account.number;


                /* =================================================
                   DONNÉES ENVOYÉES À L'API

                   IMPORTANT :
                   aucun prix n'est envoyé.
                   Le serveur calcule lui-même le prix officiel.
                ================================================= */

                const orderPayload = {

                    customerName:
                        fullName,

                    phone:
                        phone,

                    email:
                        email || null,

                    city:
                        market.city,

                    deliveryAddress:
                        address,

                    quantity:
                        quantity,

                    paymentProvider:
                        provider,

                    paymentPhone:
                        phone,

                    notes:
                        note || null

                };


                const submitButton =
                    orderForm.querySelector(
                        'button[type="submit"]'
                    );


                const originalButtonContent =
                    submitButton
                        ? submitButton.innerHTML
                        : "";


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.innerHTML =
                        `
                            Enregistrement...
                            <span>→</span>
                        `;

                }


                try {


                    /* =============================================
                       CRÉATION RÉELLE DE LA COMMANDE
                    ============================================= */

                    const response =
                        await fetch(
                            ORDER_API_URL,
                            {
                                method: "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json",

                                    "Accept":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify(
                                        orderPayload
                                    )

                            }
                        );


                    let result =
                        null;


                    try {

                        result =
                            await response.json();

                    }

                    catch (jsonError) {

                        console.error(
                            "Réponse API non JSON :",
                            jsonError
                        );

                    }


                    if (
                        !response.ok
                        ||
                        !result
                        ||
                        result.success !== true
                    ) {


                        const apiMessage =
                            result?.message
                            ||
                            `Erreur serveur (${response.status}).`;


                        throw new Error(
                            apiMessage
                        );

                    }


                    const apiOrder =
                        result.order;


                    const apiPayment =
                        result.payment;


                    if (
                        !apiOrder
                        ||
                        !apiOrder.reference
                    ) {

                        throw new Error(
                            "La commande a été créée, mais la référence retournée par le serveur est invalide."
                        );

                    }


                    /* =============================================
                       MÉMORISER LA DERNIÈRE COMMANDE
                    ============================================= */

                    localStorage.setItem(
                        "roiReineLastOrderReference",
                        apiOrder.reference
                    );


                    /* =============================================
                       MONTANTS OFFICIELS RETOURNÉS PAR LE SERVEUR
                    ============================================= */

                    const unitPriceText =
                        formatPrice(
                            Number(
                                apiOrder.unitPrice
                            ),
                            currentMarket
                        );


                    const totalText =
                        formatPrice(
                            Number(
                                apiOrder.totalAmount
                            ),
                            currentMarket
                        );


                    /* =============================================
                       MESSAGE DE CONFIRMATION WHATSAPP

                       WhatsApp n'enregistre pas la commande.
                       La commande est déjà enregistrée dans l'API.
                    ============================================= */

                    const message =
`❤️ ROI & REINE — COMMANDE ENREGISTRÉE

✅ RÉFÉRENCE
${apiOrder.reference}

👤 CLIENT
Nom : ${apiOrder.customerName}
Téléphone / WhatsApp : ${apiOrder.phone}
E-mail : ${apiOrder.email || "Non renseigné"}

📍 LIVRAISON
Marché : ${market.flag} ${apiOrder.city}
Pays : ${apiOrder.country}
Adresse : ${apiOrder.deliveryAddress}

🎴 PRODUIT
${apiOrder.productName}
Quantité : ${apiOrder.quantity}

💰 COMMANDE
Prix unitaire officiel : ${unitPriceText}
Total officiel : ${totalText}

💳 PAIEMENT
Mode : Mobile Money
Service : ${apiPayment?.provider || provider}
Numéro de paiement : ${formatPhoneNumber(paymentNumber)}
Statut : ${apiOrder.paymentStatus}

🧾 RÉFÉRENCE PAIEMENT
${apiPayment?.paymentReference || "En attente"}

📝 NOTE
${note || "Aucune"}

La commande est déjà enregistrée sur le serveur.
Le paiement reste en attente de confirmation.

18+ · Consentement · Respect`;


                    /* =============================================
                       FEEDBACK UTILISATEUR
                    ============================================= */

                    if (submitButton) {

                        submitButton.innerHTML =
                            `
                                Commande enregistrée ✓
                                <span>→</span>
                            `;

                    }


                    alert(
                        `Commande enregistrée avec succès.\n\nRéférence : ${apiOrder.reference}\nMontant : ${totalText}\nStatut du paiement : ${apiOrder.paymentStatus}`
                    );


                    /* =============================================
                       WHATSAPP = CONFIRMATION / ACCOMPAGNEMENT
                       PAS TRAITEMENT DU PAIEMENT
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


                        const whatsappWindow =
                            window.open(
                                whatsappURL,
                                "_blank"
                            );


                        if (!whatsappWindow) {

                            console.log(
                                "La fenêtre WhatsApp a été bloquée par le navigateur. Redirection vers WhatsApp."
                            );


                            window.location.href =
                                whatsappURL;

                        }


                    }


                }

                catch (error) {


                    console.error(
                        "Erreur création commande ROI & REINE :",
                        error
                    );


                    alert(
                        error?.message
                        ||
                        "Impossible d'enregistrer la commande pour le moment. Veuillez réessayer."
                    );


                }

                finally {


                    if (submitButton) {

                        setTimeout(
                            () => {

                                submitButton.disabled =
                                    false;

                                submitButton.innerHTML =
                                    originalButtonContent;

                            },
                            1200
                        );

                    }


                }


            }
        );

    }


    /* =========================================================
       29. SCROLL GLOBAL
    ========================================================= */

    let ticking =
        false;


    function handleScroll() {


        if (ticking) {

            return;

        }


        window.requestAnimationFrame(
            () => {


                updateHeader();

                updateScrollProgress();

                updateParallax();


                ticking =
                    false;


            }
        );


        ticking =
            true;

    }


    window.addEventListener(
        "scroll",
        handleScroll,
        {
            passive: true
        }
    );


    /* =========================================================
       30. REDIMENSIONNEMENT
    ========================================================= */

    window.addEventListener(
        "resize",
        () => {


            updateScrollProgress();

            updateParallax();


            if (
                window.innerWidth > 1150
                &&
                mobileMenuOpened
            ) {


                closeMobileMenu();


            }


        }
    );


    /* =========================================================
       31. TOUCHE ESC
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
       32. INITIALISATION
    ========================================================= */

    applyMarket(
        currentMarket,
        false
    );


    updatePaymentProviders();

    updatePaymentMethodDisplay();

    updateOrderDisplay();

    updatePaymentInformation();

    updateHeader();

    updateScrollProgress();

    updateParallax();


});