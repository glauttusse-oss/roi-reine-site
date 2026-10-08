/* ============================================================
   ROI & REINE — ÉDITION ROUGE
   SCRIPT COMPLET — VERSION ALLÉGÉE

   Marchés
   Commandes
   Livraison
   WhatsApp
   Animations
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


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

            currency: "USD"

        },


        brazzaville: {

            key: "brazzaville",

            city: "Brazzaville",

            country: "Congo",

            flag: "🇨🇬",

            price: 13500,

            currency: "XAF"

        },


        libreville: {

            key: "libreville",

            city: "Libreville",

            country: "Gabon",

            flag: "🇬🇦",

            price: null,

            currency: "XAF"

        }

    };


    /* =========================================================
       2. API ROI & REINE
    ========================================================= */

    const API_BASE_URL =
        "https://api.ky5globaltrade.com";


    const ORDER_API_URL =
        `${API_BASE_URL}/api/roi-reine/orders`;


    /* =========================================================
       3. WHATSAPP COMMANDES
    ========================================================= */

    const OWNER_WHATSAPP =
        "243850691536";


    /* =========================================================
       4. ÉTAT DU SITE
    ========================================================= */

    let currentMarket =
        localStorage.getItem(
            "roiReineMarket"
        )
        ||
        "kinshasa";


    if (!MARKETS[currentMarket]) {

        currentMarket =
            "kinshasa";

    }


    let quantity = 1;

    let mobileMenuOpened = false;

    let submittingOrder = false;


    /* =========================================================
       5. ÉLÉMENTS HTML
    ========================================================= */

    const body =
        document.body;


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


    const siteHeader =
        document.getElementById(
            "siteHeader"
        );


    const scrollProgressBar =
        document.getElementById(
            "scrollProgressBar"
        );


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


    const citySelect =
        document.getElementById(
            "city"
        );


    const orderForm =
        document.getElementById(
            "orderForm"
        );


    const localityLabel =
        document.getElementById(
            "localityLabel"
        );


    const localityHelp =
        document.getElementById(
            "localityHelp"
        );


    const preferredDeliveryDate =
        document.getElementById(
            "preferredDeliveryDate"
        );


    /* =========================================================
       6. OUTILS
    ========================================================= */

    function cleanValue(value) {

        return typeof value === "string"
            ? value.trim()
            : "";

    }


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
            ||
            Number.isNaN(value)
        ) {

            return "Prix à confirmer";

        }


        if (
            market.currency ===
            "XAF"
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


    function formatDeliveryTimeSlot(value) {

        switch (value) {

            case "matin":

                return "Matin";


            case "apres_midi":

                return "Après-midi";


            case "soir":

                return "Soir";


            default:

                return "À confirmer avec l’équipe";

        }

    }


    function buildDeliveryAddress({

        city,

        locality,

        neighborhood,

        street,

        houseNumber,

        landmark

    }) {


        let localityPrefix =
            "Localité";


        if (
            city ===
            "Kinshasa"
        ) {

            localityPrefix =
                "Commune de";

        }


        if (
            city ===
            "Brazzaville"
        ) {

            localityPrefix =
                "Arrondissement";

        }


        const parts = [

            houseNumber
                ? `N° ${houseNumber}`
                : null,

            street,

            neighborhood
                ? `Quartier ${neighborhood}`
                : null,

            locality
                ? `${localityPrefix} ${locality}`
                : null,

            city,

            landmark
                ? `Repère : ${landmark}`
                : null

        ];


        return parts

            .filter(Boolean)

            .join(", ");

    }


    function getTodayForInput() {

        const now =
            new Date();


        const localDate =
            new Date(

                now.getTime()

                -

                now.getTimezoneOffset()
                *
                60000

            );


        return localDate

            .toISOString()

            .slice(0, 10);

    }


    /* =========================================================
       7. GESTION DU SCROLL
    ========================================================= */

    function updateBodyScroll() {

        const ageVisible =
            ageScreen
            &&
            ageScreen.style.display !==
            "none";


        const marketVisible =
            marketModal
            &&
            marketModal
                .classList
                .contains("active");


        const mobileVisible =
            mobileMenu
            &&
            mobileMenu
                .classList
                .contains("active");


        body.classList.toggle(

            "no-scroll",

            Boolean(

                ageVisible
                ||
                marketVisible
                ||
                mobileVisible

            )

        );

    }


    /* =========================================================
       8. LIVRAISON PAR VILLE
    ========================================================= */

    function updateDeliveryContext() {

        if (
            !localityLabel
            ||
            !localityHelp
        ) {

            return;

        }


        if (
            currentMarket ===
            "brazzaville"
        ) {

            localityLabel.textContent =
                "Arrondissement";


            localityHelp.textContent =
                "Indiquez votre arrondissement.";


            return;

        }


        if (
            currentMarket ===
            "libreville"
        ) {

            localityLabel.textContent =
                "Arrondissement / commune";


            localityHelp.textContent =
                "Indiquez votre arrondissement ou commune.";


            return;

        }


        localityLabel.textContent =
            "Commune";


        localityHelp.textContent =
            "Indiquez votre commune.";

    }


    /* =========================================================
       9. PRIX / QUANTITÉ / MARCHÉ
    ========================================================= */

    function updateOrderDisplay() {

        const market =
            MARKETS[currentMarket];


        if (!market) {

            return;

        }


        const total =
            calculateTotal();


        if (quantityValue) {

            quantityValue.textContent =
                String(quantity);

        }


        if (productPrice) {

            productPrice.textContent =
                formatPrice(
                    market.price,
                    currentMarket
                );

        }


        if (selectedMarketName) {

            selectedMarketName.textContent =
                `${market.city} · ${market.country}`;

        }


        if (orderTotal) {

            orderTotal.textContent =
                formatPrice(
                    total,
                    currentMarket
                );

        }

    }


    /* =========================================================
       10. MODAL MARCHÉ
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


        if (marketButton) {

            marketButton.textContent =
                marketLabel;

        }


        if (mobileMarketButton) {

            mobileMarketButton.textContent =
                marketLabel;

        }


        if (citySelect) {

            citySelect.value =
                market.city;

        }


        updateOrderDisplay();

        updateDeliveryContext();


        if (closeModalAfter) {

            closeMarketModal();

        }

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


                window.setTimeout(

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


    marketChoices.forEach(

        choice => {

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

        }

    );


    marketShortcutButtons.forEach(

        button => {

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

                        orderSection.scrollIntoView({

                            behavior: "smooth",

                            block: "start"

                        });

                    }

                }

            );

        }

    );


    if (citySelect) {

        citySelect.addEventListener(

            "change",

            () => {

                const selectedCity =
                    citySelect.value;


                switch (selectedCity) {

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

                        break;

                }

            }

        );

    }


    /* =========================================================
       11. ÉCRAN 18+
    ========================================================= */

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


    const ageAccepted =
        localStorage.getItem(
            "roiReineAgeAccepted"
        );


    if (
        ageAccepted ===
        "true"
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


                const savedMarket =
                    localStorage.getItem(
                        "roiReineMarket"
                    );


                if (!savedMarket) {

                    window.setTimeout(

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

                document.body.innerHTML = `

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


    mobileMenuLinks.forEach(

        link => {

            link.addEventListener(

                "click",

                closeMobileMenu

            );

        }

    );


    /* =========================================================
       13. HEADER
    ========================================================= */

    function updateHeader() {

        if (!siteHeader) {

            return;

        }


        siteHeader.classList.toggle(

            "scrolled",

            window.scrollY > 55

        );

    }


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
            `${Math.min(
                100,
                Math.max(
                    0,
                    progress
                )
            )}%`;

    }


    /* =========================================================
       14. ANIMATIONS D’APPARITION
    ========================================================= */

    const revealElements =
        document.querySelectorAll(`

            .statement-section h2,
            .experience-copy,
            .pre-order-section,
            .order-product,
            .order-form

        `);


    revealElements.forEach(

        element => {

            element.style.opacity =
                "0";


            element.style.transform =
                "translateY(38px)";


            element.style.transition = `

                opacity .8s cubic-bezier(.2,.7,.2,1),

                transform .8s cubic-bezier(.2,.7,.2,1)

            `;

        }

    );


    if (
        "IntersectionObserver"
        in window
    ) {

        const revealObserver =
            new IntersectionObserver(

                entries => {

                    entries.forEach(

                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {

                                return;

                            }


                            entry.target.style.opacity =
                                "1";


                            entry.target.style.transform =
                                "translateY(0)";


                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    );

                },

                {

                    threshold: 0.12,

                    rootMargin:
                        "0px 0px -30px 0px"

                }

            );


        revealElements.forEach(

            element => {

                revealObserver.observe(
                    element
                );

            }

        );

    }
    else {

        revealElements.forEach(

            element => {

                element.style.opacity =
                    "1";


                element.style.transform =
                    "none";

            }

        );

    }


    /* =========================================================
       15. PARALLAX DES DEUX IMAGES
    ========================================================= */

    const parallaxImages =
        document.querySelectorAll(
            ".experience-photo img"
        );


    function updateParallax() {

        if (
            window.innerWidth <=
            760
        ) {

            parallaxImages.forEach(

                image => {

                    image.style.translate =
                        "";

                }

            );


            return;

        }


        parallaxImages.forEach(

            image => {

                const parent =
                    image.closest(
                        ".experience-panel"
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
                    -0.018;


                image.style.translate =
                    `0 ${movement}px`;

            }

        );

    }


    /* =========================================================
       16. EFFET HERO
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
                    window.innerWidth <=
                    760
                ) {

                    return;

                }


                const rect =
                    hero
                        .getBoundingClientRect();


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
       17. QUANTITÉ
    ========================================================= */

    if (increaseQuantity) {

        increaseQuantity.addEventListener(

            "click",

            () => {

                if (
                    quantity >= 20
                ) {

                    return;

                }


                quantity += 1;


                updateOrderDisplay();

            }

        );

    }


    if (decreaseQuantity) {

        decreaseQuantity.addEventListener(

            "click",

            () => {

                if (
                    quantity <= 1
                ) {

                    return;

                }


                quantity -= 1;


                updateOrderDisplay();

            }

        );

    }


    /* =========================================================
       18. DATE MINIMALE
    ========================================================= */

    if (preferredDeliveryDate) {

        preferredDeliveryDate.min =
            getTodayForInput();

    }


    /* =========================================================
       19. FORMULAIRE DE COMMANDE
    ========================================================= */

    if (orderForm) {

        orderForm.addEventListener(

            "submit",

            async event => {

                event.preventDefault();


                if (submittingOrder) {

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


                /* =================================================
                   LIBREVILLE RESTE BLOQUÉ
                ================================================= */

                if (
                    currentMarket ===
                    "libreville"
                    ||
                    market.price ===
                    null
                ) {

                    alert(
                        "Le prix de ROI & REINE à Libreville n'est pas encore configuré. La commande n'est pas encore disponible pour cette ville."
                    );


                    return;

                }


                /* =================================================
                   CLIENT
                ================================================= */

                const fullName =
                    cleanValue(

                        document
                            .getElementById(
                                "fullName"
                            )
                            ?.value

                    );


                const phone =
                    cleanValue(

                        document
                            .getElementById(
                                "phone"
                            )
                            ?.value

                    );


                const whatsappPhone =
                    cleanValue(

                        document
                            .getElementById(
                                "whatsappPhone"
                            )
                            ?.value

                    );


                const email =
                    cleanValue(

                        document
                            .getElementById(
                                "email"
                            )
                            ?.value

                    );


                /* =================================================
                   ADRESSE
                ================================================= */

                const locality =
                    cleanValue(

                        document
                            .getElementById(
                                "locality"
                            )
                            ?.value

                    );


                const neighborhood =
                    cleanValue(

                        document
                            .getElementById(
                                "neighborhood"
                            )
                            ?.value

                    );


                const street =
                    cleanValue(

                        document
                            .getElementById(
                                "street"
                            )
                            ?.value

                    );


                const houseNumber =
                    cleanValue(

                        document
                            .getElementById(
                                "houseNumber"
                            )
                            ?.value

                    );


                const landmark =
                    cleanValue(

                        document
                            .getElementById(
                                "landmark"
                            )
                            ?.value

                    );


                /* =================================================
                   LIVRAISON
                ================================================= */

                const deliveryDate =
                    cleanValue(

                        document
                            .getElementById(
                                "preferredDeliveryDate"
                            )
                            ?.value

                    );


                const deliveryTimeSlot =
                    cleanValue(

                        document
                            .getElementById(
                                "deliveryTimeSlot"
                            )
                            ?.value

                    )
                    ||
                    "a_confirmer";


                const note =
                    cleanValue(

                        document
                            .getElementById(
                                "note"
                            )
                            ?.value

                    );


                /* =================================================
                   VALIDATION
                ================================================= */

                if (
                    !fullName
                    ||
                    !phone
                    ||
                    !locality
                    ||
                    !neighborhood
                    ||
                    !street
                    ||
                    !landmark
                ) {

                    alert(
                        "Veuillez renseigner votre nom, votre téléphone et toutes les informations obligatoires de livraison."
                    );


                    return;

                }


                /* =================================================
                   ADRESSE COMPLÈTE
                ================================================= */

                const deliveryAddress =
                    buildDeliveryAddress({

                        city:
                            market.city,

                        locality:
                            locality,

                        neighborhood:
                            neighborhood,

                        street:
                            street,

                        houseNumber:
                            houseNumber,

                        landmark:
                            landmark

                    });


                /* =================================================
                   DONNÉES API
                   LE SERVEUR CALCULE LE PRIX OFFICIEL
                ================================================= */

                const orderPayload = {

                    customerName:
                        fullName,

                    phone:
                        phone,

                    whatsAppPhone:
                        whatsappPhone
                        ||
                        phone,

                    email:
                        email
                        ||
                        null,

                    city:
                        market.city,

                    locality:
                        locality,

                    neighborhood:
                        neighborhood,

                    street:
                        street,

                    houseNumber:
                        houseNumber
                        ||
                        null,

                    landmark:
                        landmark,

                    deliveryAddress:
                        deliveryAddress,

                    preferredDeliveryDate:
                        deliveryDate
                        ||
                        null,

                    deliveryTimeSlot:
                        deliveryTimeSlot,

                    quantity:
                        quantity,

                    notes:
                        note
                        ||
                        null

                };


                /* =================================================
                   BOUTON
                ================================================= */

                const submitButton =
                    orderForm.querySelector(
                        'button[type="submit"]'
                    );


                const originalButtonContent =
                    submitButton
                        ? submitButton.innerHTML
                        : "";


                submittingOrder =
                    true;


                if (submitButton) {

                    submitButton.disabled =
                        true;


                    submitButton.innerHTML = `

                        Envoi de la demande...

                        <span>→</span>

                    `;

                }


                try {


                    /* =============================================
                       CRÉATION DE LA COMMANDE
                    ============================================= */

                    const response =
                        await fetch(

                            ORDER_API_URL,

                            {

                                method:
                                    "POST",

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
                        result.success !==
                        true
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


                    if (!apiOrder?.reference) {

                        throw new Error(
                            "La demande a été enregistrée, mais la référence retournée par le serveur est invalide."
                        );

                    }


                    /* =============================================
                       MÉMORISER LA RÉFÉRENCE
                    ============================================= */

                    localStorage.setItem(

                        "roiReineLastOrderReference",

                        apiOrder.reference

                    );


                    /* =============================================
                       MONTANTS DU SERVEUR
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


                    const slotText =
                        formatDeliveryTimeSlot(

                            apiOrder.deliveryTimeSlot

                            ||

                            deliveryTimeSlot

                        );


                    const requestedDateText =
                        apiOrder.preferredDeliveryDate
                        ||
                        deliveryDate
                        ||
                        "À confirmer";


                    /* =============================================
                       MESSAGE WHATSAPP
                    ============================================= */

                    const message =
`❤️ ROI & REINE — NOUVELLE COMMANDE

✅ RÉFÉRENCE
${apiOrder.reference}

👤 CLIENT
Nom : ${apiOrder.customerName}
Téléphone : ${apiOrder.phone}
WhatsApp : ${apiOrder.whatsAppPhone || apiOrder.phone}
E-mail : ${apiOrder.email || "Non renseigné"}

📍 LIVRAISON
Ville : ${market.flag} ${apiOrder.city}
Pays : ${apiOrder.country}
Commune / arrondissement : ${apiOrder.locality}
Quartier : ${apiOrder.neighborhood}
Avenue / rue : ${apiOrder.street}
N° maison / parcelle : ${apiOrder.houseNumber || "Non renseigné"}
Point de repère : ${apiOrder.landmark}

Adresse complète :
${apiOrder.deliveryAddress}

🗓️ LIVRAISON SOUHAITÉE
Date : ${requestedDateText}
Créneau : ${slotText}

🎴 COMMANDE
Produit : ${apiOrder.productName}
Quantité : ${apiOrder.quantity}
Prix unitaire : ${unitPriceText}
Total : ${totalText}

📝 NOTE
${apiOrder.notes || note || "Aucune"}

La commande a été enregistrée.
Merci de contacter le client pour confirmer les informations de livraison.`;


                    /* =============================================
                       CONFIRMATION
                    ============================================= */

                    if (submitButton) {

                        submitButton.innerHTML = `

                            Demande enregistrée ✓

                            <span>→</span>

                        `;

                    }


                    alert(
`Votre demande de commande a bien été enregistrée.

Référence : ${apiOrder.reference}
Total : ${totalText}

Notre équipe vous contactera pour confirmer les informations de livraison.`
                    );


                    /* =============================================
                       OUVERTURE WHATSAPP
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

                            window.location.href =
                                whatsappURL;

                        }

                    }


                    /* =============================================
                       RÉINITIALISATION
                    ============================================= */

                    orderForm.reset();


                    quantity =
                        1;


                    if (citySelect) {

                        citySelect.value =
                            market.city;

                    }


                    if (preferredDeliveryDate) {

                        preferredDeliveryDate.min =
                            getTodayForInput();

                    }


                    updateOrderDisplay();

                    updateDeliveryContext();

                }
                catch (error) {

                    console.error(

                        "Erreur commande ROI & REINE :",

                        error

                    );


                    alert(

                        error?.message

                        ||

                        "Impossible d'enregistrer votre demande pour le moment. Veuillez réessayer."

                    );

                }
                finally {

                    submittingOrder =
                        false;


                    if (submitButton) {

                        window.setTimeout(

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
       20. SCROLL GLOBAL
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
       21. REDIMENSIONNEMENT
    ========================================================= */

    window.addEventListener(

        "resize",

        () => {

            updateScrollProgress();

            updateParallax();


            if (
                window.innerWidth >
                1150
                &&
                mobileMenuOpened
            ) {

                closeMobileMenu();

            }

        }

    );


    /* =========================================================
       22. TOUCHE ESC
    ========================================================= */

    document.addEventListener(

        "keydown",

        event => {

            if (
                event.key !==
                "Escape"
            ) {

                return;

            }


            if (
                marketModal
                &&
                marketModal
                    .classList
                    .contains(
                        "active"
                    )
            ) {

                closeMarketModal();

            }


            if (
                mobileMenu
                &&
                mobileMenu
                    .classList
                    .contains(
                        "active"
                    )
            ) {

                closeMobileMenu();

            }

        }

    );


    /* =========================================================
       23. INITIALISATION
    ========================================================= */

    applyMarket(

        currentMarket,

        false

    );


    updateOrderDisplay();

    updateDeliveryContext();

    updateHeader();

    updateScrollProgress();

    updateParallax();

});