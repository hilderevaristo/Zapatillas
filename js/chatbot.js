const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const CloseChatbot = document.querySelector("#close-chatbot");


// API Setup
// API Configuración
const API_KEY = "AIzaSyANo5X-swMnvm1_4PZryQnlwpe95wWapWg";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
const CATALOGO_ZAPATILLAS = `
    Eres un asistente de ventas de zapatillas de la tienda "GoZapas" y tu única fuente de conocimiento es el siguiente catálogo.
    Debes responder amablemente y dar detalles de las zapatillas (color, uso, precio) usando EXCLUSIVAMENTE esta lista.
    Si te preguntan por zapatillas o precios que NO están en la lista, debes indicar amablemente que no tienes esa información.

    No es necesario saludar en la primera respuesta que des, ya que arriba ya dice "Hola!👋
    ¿Cómo puedo ayudarte hoy?"

    --- Catálogo de Zapatillas y Precios ---
    
    Adidas:
      Adidas Campus
        Color: Gris claro. Zapatilla casual, ideal para uso diario y estilo urbano.
        Precio: S/339.00
      
      Adidas Forum Drop
        Color: Blanco con detalles azules. Zapatilla retro, perfecta para outfits modernos y clásicos.
        Precio: S/319.00 (antes S/399.00)
      
      Adidas Runfalcon
        Color: Negro. Zapatilla deportiva, recomendada para correr y actividades físicas.
        Precio: S/199.00
      
      Adidas Samba
        Color: Blanco con negro. Zapatilla clásica, pensada para fútbol sala y moda casual.
        Precio: S/359.00
      
      Zapatilla Tyshawn
        Color: Blanco. Inspirada en el skateboarding, resistente y cómoda para patinar o vestir casual.
        Precio: S/244.00
    
    Nike:
      Nike Air Force 1 Panda
        Color: Blanco y negro. Zapatilla icónica, versátil para cualquier ocasión y estilo urbano.
        Precio: S/409.00 (antes S/480.00)
      
      Nike Air Max 97
        Color: Gris metálico. Zapatilla deportiva, famosa por su comodidad y diseño futurista.
        Precio: S/989.00
      
      Nike Blazer Mid 77
        Color: Blanco con detalles negros. Zapatilla vintage, ideal para looks retro y casuales.
        Precio: S/429.00
      
      Nike Dunk Panda
        Color: Blanco y negro. Zapatilla de moda, popular en cultura urbana y skate.
        Precio: S/409.00 (antes S/480.00)
      
      Nike Gamma Force
        Color: Blanco con detalles verdes. Zapatilla moderna, pensada para uso diario y deporte ligero.
        Precio: S/329.00 (antes S/379.00)
      
      Nike Revolution 7
        Color: Negro. Zapatilla running, ligera y cómoda para entrenamientos y caminatas.
        Precio: S/219.00
    
    Puma:
      Puma Caven 2.0
        Color: Blanco. Zapatilla casual, cómoda para el día a día y actividades urbanas.
        Precio: S/229.00
      
      Puma R78
        Color: Gris con azul. Zapatilla retro running, ideal para caminar y vestir casual.
        Precio: S/209.00
      
      Puma Speedcat
        Color: Negro. Inspirada en el automovilismo, perfecta para estilo deportivo y casual.
        Precio: S/389.00
      
      Puma Suede XL
        Color: Negro. Zapatilla clásica de gamuza, recomendada para moda urbana y skate.
        Precio: S/379.00
      
      Puma Smash
        Color: Blanco. Zapatilla sencilla, pensada para tenis y uso casual.
        Precio: S/169.00 (antes S/229.00)
`;

const userData = {
    message: null
};

const chatHistory = [];
const initialInputHeight = messageInput.scrollHeight;

// Scroll to the latest message
// Desplácese hasta el último mensaje
const scrollToLatestMessage = () => { chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth"}) };

// Create message element with dynamic classes and return it
// Crea un elemento de mensaje con clases dinámicas y devuélvelo
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
};

// Generate bot response using API
// Generar respuesta de bot usando API
const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector(".message-text");

    // Add user message to chat history
    // Agregar mensaje de usuario al historial de chat
    chatHistory.push({
        role: "user",
        parts: [{ text: userData.message }] // Simplificado: solo envía texto
    });

    // API request options
    // Opciones de solicitud de API
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: chatHistory,
            systemInstruction: {
                parts: [
                    { text: CATALOGO_ZAPATILLAS }
                ]
            }
        })
    }

    try {
        // Fetch bot response from API
        // Obtener la respuesta del bot desde la API
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if(!response.ok) throw new Error(data.error.message);

        // Extract and display bot's response text
        // Extraer y mostrar el texto de respuesta del bot
        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        messageElement.innerText = apiResponseText;

        // Add bot response to chat history
        // Agregar la respuesta del bot al historial de chat
        chatHistory.push({
            role: "model",
            parts: [{ text: apiResponseText }]
        });

    } catch (error) {
        // Handle error in API response
        // Manejar error en respuesta API
        console.error(error);
        messageElement.innerText = error.message;
        messageElement.style.color = "#ff0000";
    } finally {
        // Reset user's file data, removing thinking indicator and scroll chat to bottom
        // Restablecer los datos del archivo del usuario, eliminar el indicador de pensamiento y desplazar el chat hasta el final
        // (Ya no se necesita userData.file = {};)
        incomingMessageDiv.classList.remove("thinking");
        scrollToLatestMessage();
    }
}

// Handle outgoing user messages
// Gestionar mensajes salientes de usuario
const handleOutgoingMessage = (e) => {
    e.preventDefault();
    userData.message = messageInput.value.trim();
    if (!userData.message) return; // No enviar mensajes vacíos
    
    messageInput.value = "";
    messageInput.dispatchEvent(new Event("input"));

    // Create display user message
    // Crear mensaje de usuario para mostrar
    const messageContent = `<div class="message-text"></div>`; // Simplificado: sin <img>

    const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
    outgoingMessageDiv.querySelector(".message-text").textContent = userData.message;
    chatBody.appendChild(outgoingMessageDiv);
    scrollToLatestMessage();

    // Simulate bot response with thinking indicator after a delay
    // Simular la respuesta del bot con el indicador de pensamiento después de un retraso
    setTimeout(() => {
        const messageContent = `
                <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
                    <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
                </svg>
                <div class="message-text">
                    <div class="thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>`;

        const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking");
        chatBody.appendChild(incomingMessageDiv);
        scrollToLatestMessage();
        generateBotResponse(incomingMessageDiv);
    }, 600);
};

// Handle Enter key press for sending messages
// Manejar la pulsación de la tecla 'Enter' para enviar mensajes
messageInput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();
    if(e.key === "Enter" && userMessage && !e.shiftKey && window.innerWidth > 768){
        handleOutgoingMessage(e);
    }
});

// Adjust input field height dynamically
// Ajustar la altura del campo de entrada dinámicamente
messageInput.addEventListener("input",() => {
    messageInput.style.height = `${initialInputHeight}px`;
    messageInput.style.height = `${messageInput.scrollHeight}px`;
    document.querySelector(".chat-form").style.borderRadius = messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
});

// Event listeners
sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
CloseChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"));