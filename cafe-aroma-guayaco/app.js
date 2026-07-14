/* ==========================================================================
   APP.JS - LÓGICA E INTERACTIVIDAD DE CAFÉ AROMA GUAYACO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. TEMA CLARO / OSCURO (THEME TOGGLE)
    // -------------------------------------------------------------
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Cargar preferencia del localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('light-theme')) {
            document.body.classList.replace('light-theme', 'dark-theme');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.replace('dark-theme', 'light-theme');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    // -------------------------------------------------------------
    // 2. MENÚ MÓVIL (MOBILE MENU)
    // -------------------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const isMenuOpen = navMenu.classList.contains('open');
        mobileMenuBtn.querySelector('i').classList.replace(
            isMenuOpen ? 'fa-bars' : 'fa-xmark',
            isMenuOpen ? 'fa-xmark' : 'fa-bars'
        );
    });

    // Cerrar menú al hacer clic en un enlace de navegación
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            mobileMenuBtn.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
        });
    });

    // Highlight activo en enlaces durante el scroll
    const sections = document.querySelectorAll('.section-hero, .section-container, .scroll-margin');
    window.addEventListener('scroll', () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 120)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            let targetHref = link.getAttribute('href').substring(1);
            if (currentSection === targetHref) {
                link.classList.add('active');
            }
        });
    });

    // -------------------------------------------------------------
    // 3. SELECCIÓN DE TAMAÑOS Y PRECIO DINÁMICO
    // -------------------------------------------------------------
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const siblingButtons = productCard.querySelectorAll('.size-btn');
            
            // Activar botón seleccionado
            siblingButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Actualizar precio
            const newPrice = e.target.getAttribute('data-price');
            productCard.querySelector('.price-value').textContent = newPrice;
        });
    });

    // -------------------------------------------------------------
    // 4. CARRITO DE COMPRAS (SHOPPING CART)
    // -------------------------------------------------------------
    let cart = JSON.parse(localStorage.getItem('aroma_cart')) || [];
    const cartToggle = document.getElementById('cartToggle');
    const closeCart = document.getElementById('closeCart');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalPrice = document.getElementById('cartTotalPrice');
    const cartCount = document.getElementById('cartCount');
    const btnCheckout = document.getElementById('btnCheckout');
    
    // Toggle Carrito
    function openCartMenu() {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('open');
    }

    function closeCartMenu() {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('open');
    }

    cartToggle.addEventListener('click', openCartMenu);
    closeCart.addEventListener('click', closeCartMenu);
    cartOverlay.addEventListener('click', closeCartMenu);

    // Renderizar artículos del carrito
    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalQty = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fa-solid fa-bag-shopping"></i>
                    <p>Tu carrito está vacío. ¡Elige un Café Aroma Guayaco!</p>
                </div>
            `;
            btnCheckout.disabled = true;
        } else {
            btnCheckout.disabled = false;
            cart.forEach((item, index) => {
                total += item.price * item.qty;
                totalQty += item.qty;

                // Definir ícono de producto según tipo
                let iconClass = 'fa-mug-hot';
                if (item.id === 'grano') iconClass = 'fa-seedling';
                if (item.id === 'premium') iconClass = 'fa-crown';
                if (item.id === 'combo') iconClass = 'fa-boxes-packing';

                const cartItemHTML = `
                    <div class="cart-item">
                        <div class="cart-item-icon">
                            <i class="fa-solid ${iconClass}"></i>
                        </div>
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <span class="cart-item-size">Tamaño: ${item.size}</span>
                            <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                        <div class="cart-item-qty">
                            <button class="qty-btn minus" data-index="${index}">-</button>
                            <span class="qty-val">${item.qty}</span>
                            <button class="qty-btn plus" data-index="${index}">+</button>
                        </div>
                        <button class="remove-item-btn" data-index="${index}" aria-label="Eliminar"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                `;
                cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
            });
        }

        cartTotalPrice.textContent = `$${total.toFixed(2)}`;
        cartCount.textContent = totalQty;
        localStorage.setItem('aroma_cart', JSON.stringify(cart));
    }

    // Agregar producto al carrito
    const addCartBtns = document.querySelectorAll('.btn-add-cart');
    addCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            const productName = btn.getAttribute('data-name');
            const activeSizeBtn = productCard.querySelector('.size-btn.active');
            const productSize = activeSizeBtn.getAttribute('data-size');
            const productPrice = parseFloat(activeSizeBtn.getAttribute('data-price'));

            // Verificar si el artículo id+tamaño ya existe
            const existingItemIndex = cart.findIndex(item => item.id === productId && item.size === productSize);
            
            if (existingItemIndex > -1) {
                cart[existingItemIndex].qty += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    size: productSize,
                    price: productPrice,
                    qty: 1
                });
            }

            renderCart();
            openCartMenu();
        });
    });

    // Controlar acciones en carrito (+, -, Borrar)
    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const index = parseInt(target.getAttribute('data-index'));

        if (target.classList.contains('qty-btn')) {
            if (target.classList.contains('plus')) {
                cart[index].qty += 1;
            } else if (target.classList.contains('minus')) {
                if (cart[index].qty > 1) {
                    cart[index].qty -= 1;
                } else {
                    cart.splice(index, 1);
                }
            }
        } else if (target.classList.contains('remove-item-btn')) {
            cart.splice(index, 1);
        }

        renderCart();
    });

    // Inicializar renderizado del carrito
    renderCart();

    // -------------------------------------------------------------
    // 5. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
    // -------------------------------------------------------------
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isCurrentlyActive = item.classList.contains('active');
            
            // Cerrar todos los acordeones abiertos
            document.querySelectorAll('.accordion-item').forEach(acc => {
                acc.classList.remove('active');
                acc.querySelector('.accordion-content').style.maxHeight = null;
            });

            // Si no estaba activo, lo abrimos
            if (!isCurrentlyActive) {
                item.classList.add('active');
                const content = item.querySelector('.accordion-content');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // -------------------------------------------------------------
    // 6. MODALES DE RECETAS DE POSTRES
    // -------------------------------------------------------------
    const recipeModal = document.getElementById('recipeModal');
    const recipeModalBody = document.getElementById('recipeModalBody');
    const closeRecipeModal = document.getElementById('closeRecipeModal');
    const openRecipeBtns = document.querySelectorAll('.open-recipe-btn');

    const recipesData = {
        brownibs: {
            title: "Brownibs de Café",
            time: "35-40 min (Horneado: 25-30 min)",
            difficulty: "Media",
            icon: "fa-cookie",
            ingredients: [
                "150g de chocolate oscuro",
                "100g de mantequilla",
                "150g de azúcar",
                "3 huevos",
                "100g de harina de trigo",
                "1 cucharada generosa de Café Aroma Guayaco (preparado fuerte o instantáneo disuelto)"
            ],
            preparation: "Derretir el chocolate oscuro con la mantequilla al baño maría o microondas. Disolver el Café Aroma Guayaco en una cucharada de agua caliente e incorporarlo a la mezcla. Batir los huevos con el azúcar en un recipiente aparte hasta blanquear un poco, luego añadir el chocolate fundido. Incorporar la harina tamizada con movimientos suaves. Verter en un molde y hornear de 25 a 30 minutos a 180°C. Deja enfriar antes de cortar para una textura súper húmeda."
        },
        mousse: {
            title: "Mousse de Café",
            time: "3 horas (Refrigeración: 2 horas)",
            difficulty: "Media",
            icon: "fa-ice-cream",
            ingredients: [
                "1 taza de crema de leche para batir (muy fría)",
                "1/2 taza de Café Aroma Guayaco (filtrado, frío y bien fuerte)",
                "1/3 taza de azúcar glass",
                "1 cucharadita de gelatina sin sabor (aprox. 5g)",
                "2 cucharadas de agua tibia",
                "Cacao en polvo al gusto para espolvorear"
            ],
            preparation: "Hidratar la gelatina sin sabor en dos cucharadas de agua y luego disolver en microondas por 10 segundos. En un bol, batir la crema de leche fría con el azúcar glass a medio punto. Añadir el Café Aroma Guayaco frío y la gelatina disuelta en forma de hilo, mezclando suavemente con espátula en movimientos envolventes para no perder el aire. Repartir en copas o vasos individuales y refrigerar un mínimo de 2 horas. Decorar con cacao espolvoreado al servir."
        },
        cheesecake: {
            title: "Cheesecake de Café en Vaso",
            time: "2 horas 30 min (Refrigeración: 2 horas)",
            difficulty: "Fácil",
            icon: "fa-cake-slice",
            ingredients: [
                "100g de galletas dulces (tipo vainilla o maría) trituradas",
                "50g de mantequilla derretida",
                "200g de queso crema a temperatura ambiente",
                "1/2 taza de Café Aroma Guayaco (frío)",
                "1/4 taza de azúcar",
                "Chocolate amargo rallado para decorar"
            ],
            preparation: "Mezclar las galletas trituradas con la mantequilla derretida para formar la base. Distribuir esta mezcla en el fondo de 4 vasos presionando suavemente. Por otro lado, batir el queso crema con el azúcar y el Café Aroma Guayaco frío hasta obtener una crema homogénea y suave. Rellenar los vasos sobre la base de galletas utilizando una manga pastelera o cuchara. Refrigerar por 2 horas y decorar con abundante chocolate rallado antes de consumir."
        },
        galletas: {
            title: "Galletas de Café y Chocolate",
            time: "25-30 min (Horneado: 12-15 min)",
            difficulty: "Fácil",
            icon: "fa-cookie-bite",
            ingredients: [
                "200g de harina de trigo",
                "100g de mantequilla a temperatura ambiente",
                "100g de azúcar morena",
                "1 huevo",
                "1 cucharadita de Café Aroma Guayaco (instantáneo en polvo o molido muy fino)",
                "100g de chispas o trocitos de chocolate"
            ],
            preparation: "Batir la mantequilla blanda con el azúcar morena hasta lograr una textura cremosa. Agregar el huevo y batir bien. Incorporar el Café Aroma Guayaco directamente y mezclar. Tamizar la harina sobre la mezcla e integrar con una espátula. Agregar las chispas de chocolate. Formar bolitas pequeñas y colocarlas en una bandeja con papel para hornear, separadas entre sí. Hornear a 180°C de 12 a 15 minutos. Dejar enfriar sobre rejilla."
        },
        cupcakes: {
            title: "Cupcakes de Café con Cream",
            time: "45 min (Horneado: 18-20 min)",
            difficulty: "Media",
            icon: "fa-stroopwafel",
            ingredients: [
                "1 taza de harina para repostería",
                "1/2 taza de azúcar blanca",
                "1/2 taza de mantequilla",
                "2 huevos grandes",
                "1/2 taza de Café Aroma Guayaco preparado (frío)",
                "1 cucharadita de polvo de hornear",
                "Crema chantilly o de mantequilla saborizada con café para decorar"
            ],
            preparation: "Bate la mantequilla a temperatura ambiente con el azúcar hasta que doble su volumen. Incorpora los huevos de uno en uno. Añade la harina y el polvo de hornear tamizados, alternando poco a poco con el Café Aroma Guayaco preparado. Reparte en moldes para cupcakes (capacillos) hasta llenar 2/3 partes. Hornea a 180°C durante 18-20 minutos. Una vez fríos, decóralos con una manga usando crema batida con café instantáneo disuelto."
        },
        helado: {
            title: "Helado Casero de Café",
            time: "6 horas (Congelación: 5-6 horas)",
            difficulty: "Fácil",
            icon: "fa-bowl-food",
            ingredients: [
                "1 taza de crema de leche para batir (mínimo 35% grasa, muy fría)",
                "1/2 taza de leche condensada",
                "1/2 taza de Café Aroma Guayaco (concentrado, frío y fuerte)"
            ],
            preparation: "En un recipiente amplio batir la crema de leche fría hasta que monte a punto de chantilly firme. Aparte, mezclar homogéneamente la leche condensada con el café concentrado de Aroma Guayaco frío. Incorporar esta mezcla de café a la crema batida en tres partes, con espátula de goma en forma envolvente para evitar que la mezcla se baje. Verter en un molde apto para freezer y congelar un mínimo de 6 horas. Opcional: batir la mezcla cada hora las primeras 3 horas para evitar cristales."
        }
    };

    openRecipeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const recipeCard = e.target.closest('.recipe-card');
            const recipeId = recipeCard.getAttribute('data-recipe');
            const recipe = recipesData[recipeId];

            if (recipe) {
                // Poblamos modal
                let ingredientsHTML = '';
                recipe.ingredients.forEach(ing => {
                    ingredientsHTML += `<li>${ing}</li>`;
                });

                recipeModalBody.innerHTML = `
                    <div class="recipe-modal-header">
                        <div class="recipe-modal-icon">
                            <i class="fa-solid ${recipe.icon}"></i>
                        </div>
                        <div class="recipe-modal-title">
                            <h2>${recipe.title}</h2>
                            <div class="recipe-modal-meta">
                                <span><i class="fa-regular fa-clock"></i> ${recipe.time}</span>
                                <span><i class="fa-solid fa-chart-line"></i> Dificultad: ${recipe.difficulty}</span>
                            </div>
                        </div>
                    </div>
                    <div class="recipe-modal-content">
                        <h3 class="recipe-section-title">Ingredientes</h3>
                        <ul class="recipe-ingredients-list">
                            ${ingredientsHTML}
                        </ul>
                        <h3 class="recipe-section-title">Preparación Paso a Paso</h3>
                        <p class="recipe-preparation-text">${recipe.preparation}</p>
                    </div>
                `;

                recipeModal.classList.add('open');
                document.body.style.overflow = 'hidden'; // Detener scroll de fondo
            }
        });
    });

    function closeRecipe() {
        recipeModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    closeRecipeModal.addEventListener('click', closeRecipe);
    recipeModal.addEventListener('click', (e) => {
        if (e.target === recipeModal) closeRecipe();
    });

    // -------------------------------------------------------------
    // 7. FORMULARIO DE CONTACTO E INTERACCIÓN
    // -------------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameVal = document.getElementById('formName').value;
        const emailVal = document.getElementById('formEmail').value;
        
        // Simular envío
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Enviando...`;

        setTimeout(() => {
            // Reestablecer botón
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            // Mostrar notificación
            alert(`¡Gracias ${nameVal}! Tu mensaje ha sido enviado correctamente. Café Aroma Guayaco se pondrá en contacto al correo: ${emailVal} lo antes posible.`);
            
            // Limpiar formulario
            contactForm.reset();
        }, 1500);
    });

    // -------------------------------------------------------------
    // 8. FINALIZACIÓN DE PEDIDO (CHECKOUT SIMULADO)
    // -------------------------------------------------------------
    const btnCheckoutAction = document.getElementById('btnCheckout');
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckoutModal = document.getElementById('closeCheckoutModal');
    const btnConfirmOrder = document.getElementById('btnConfirmOrder');
    const orderSummaryBox = document.getElementById('orderSummaryBox');

    btnCheckoutAction.addEventListener('click', () => {
        if (cart.length === 0) return;

        // Generar resumen del pedido
        let itemsListHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const sub = item.price * item.qty;
            total += sub;
            itemsListHTML += `
                <div class="order-summary-item">
                    <span>${item.name} (${item.size}) x${item.qty}</span>
                    <span>$${sub.toFixed(2)}</span>
                </div>
            `;
        });

        orderSummaryBox.innerHTML = `
            <h4>Resumen de Compra</h4>
            <div class="order-summary-list">
                ${itemsListHTML}
            </div>
            <div class="order-summary-total">
                <span>Total a Pagar:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        `;

        // Cerrar carrito
        closeCartMenu();

        // Abrir modal de checkout
        checkoutModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    function closeCheckout() {
        checkoutModal.classList.remove('open');
        document.body.style.overflow = '';
        // Vaciar el carrito tras confirmar pedido
        cart = [];
        renderCart();
    }

    closeCheckoutModal.addEventListener('click', closeCheckout);
    btnConfirmOrder.addEventListener('click', closeCheckout);
    checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) closeCheckout();
    });
});
