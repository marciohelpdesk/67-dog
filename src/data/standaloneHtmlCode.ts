export const STANDALONE_HTML_CODE = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Six Seven Dog | Hot Dogs Especiais & Pastéis Crocantes</title>
  <meta name="description" content="Cartão de Visita Digital e Cardápio Interativo do Six Seven Dog." />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  
  <style>
    /* Reset & Base */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      font-family: 'Poppins', sans-serif;
      min-height: 100vh;
      background-color: #0c0c10;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 16px 12px;
      position: relative;
      overflow-x: hidden;
    }

    /* Fixed Dark Background with Food/Eatery Texture */
    .bg-overlay {
      position: fixed;
      inset: 0;
      background: radial-gradient(circle at top center, rgba(230, 57, 70, 0.15) 0%, rgba(12, 12, 16, 0.95) 70%),
                  linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.85)),
                  url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;
      z-index: 0;
    }

    /* Main Glassmorphic Container */
    .card-container {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 420px;
      background: rgba(18, 18, 24, 0.82);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 28px;
      padding: 28px 20px 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Profile / Branding Header */
    .profile-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 22px;
    }

    .avatar-wrapper {
      position: relative;
      margin-bottom: 14px;
    }

    .avatar-img {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      object-fit: cover;
      border: 3.5px solid #FF9F1C;
      box-shadow: 0 0 22px rgba(255, 159, 28, 0.45);
      background-color: #1a1a24;
      display: block;
    }

    .avatar-badge {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 24px;
      height: 24px;
      background: #E63946;
      border: 2px solid #121218;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      color: #fff;
    }

    .brand-title {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #ffffff;
      margin-bottom: 3px;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    }

    .brand-subtitle {
      font-size: 13px;
      font-weight: 600;
      color: #FF9F1C;
      margin-bottom: 10px;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      color: #34d399;
      margin-bottom: 12px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background-color: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px #10b981;
      animation: pulseDot 1.8s infinite;
    }

    @keyframes pulseDot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }

    .brand-bio {
      font-size: 12px;
      line-height: 1.5;
      color: #d1d5db;
      max-width: 320px;
    }

    /* Action Buttons Grid */
    .quick-grid {
      display: grid;
      grid-template-cols: repeat(2, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }

    .grid-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 10px;
      background: rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      color: #ffffff;
      text-decoration: none;
      font-size: 11px;
      font-weight: 600;
      text-align: center;
      transition: all 0.25s ease;
      cursor: pointer;
    }

    .grid-btn i {
      font-size: 20px;
      color: #FF9F1C;
      transition: transform 0.25s ease;
    }

    .grid-btn.whatsapp-btn i {
      color: #25D366;
    }

    .grid-btn:hover, .grid-btn:active {
      transform: scale(1.03);
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 159, 28, 0.5);
    }

    .grid-btn:hover i {
      transform: translateY(-2px);
    }

    /* Main Highlight CTA Button */
    .main-cta-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 16px 20px;
      margin-bottom: 22px;
      background: linear-gradient(135deg, #E63946 0%, #FF9F1C 100%);
      border: none;
      border-radius: 18px;
      color: #ffffff;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      text-decoration: none;
      box-shadow: 0 6px 24px rgba(230, 57, 70, 0.45);
      cursor: pointer;
      position: relative;
      overflow: hidden;
      animation: ctaGlow 2.4s infinite ease-in-out;
      transition: transform 0.2s ease;
    }

    .main-cta-btn:hover, .main-cta-btn:active {
      transform: scale(1.03);
    }

    @keyframes ctaGlow {
      0%, 100% {
        box-shadow: 0 0 18px rgba(230, 57, 70, 0.45), 0 0 32px rgba(255, 159, 28, 0.3);
      }
      50% {
        box-shadow: 0 0 28px rgba(230, 57, 70, 0.75), 0 0 45px rgba(255, 159, 28, 0.55);
      }
    }

    /* Shimmer light pass */
    .main-cta-btn::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -100%;
      width: 200%;
      height: 200%;
      background: linear-gradient(60deg, transparent 30%, rgba(255, 255, 255, 0.25) 50%, transparent 70%);
      animation: shimmer 3.5s infinite;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    /* Highlights Section */
    .highlights-section {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 14px;
      margin-bottom: 20px;
    }

    .highlights-title {
      font-size: 13px;
      font-weight: 700;
      color: #FF9F1C;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .highlights-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }

    .dish-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }

    .dish-card:hover {
      transform: translateY(-2px);
      border-color: rgba(255, 159, 28, 0.4);
    }

    .dish-img {
      width: 100%;
      height: 86px;
      object-fit: cover;
      background: #181822;
    }

    .dish-body {
      padding: 8px;
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: space-between;
    }

    .dish-name {
      font-size: 11px;
      font-weight: 700;
      color: #f3f4f6;
      line-height: 1.25;
      margin-bottom: 6px;
    }

    .dish-order-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      width: 100%;
      padding: 6px 4px;
      background: #E63946;
      border: none;
      border-radius: 8px;
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      transition: background 0.2s;
    }

    .dish-order-btn:hover {
      background: #c1121f;
    }

    /* Footer */
    .card-footer {
      text-align: center;
      padding-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .social-links {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-bottom: 12px;
    }

    .social-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #e5e7eb;
      text-decoration: none;
      font-size: 14px;
      transition: all 0.2s ease;
    }

    .social-icon:hover {
      background: #FF9F1C;
      color: #121218;
      transform: scale(1.1);
    }

    .footer-address {
      font-size: 11px;
      color: #9ca3af;
      margin-bottom: 6px;
      line-height: 1.4;
    }

    .footer-copy {
      font-size: 10px;
      color: #6b7280;
    }

    /* Basic Modal Window for Quick Actions */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.8);
      backdrop-filter: blur(8px);
      z-index: 100;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .modal-overlay.active {
      display: flex;
    }

    .modal-content {
      background: #181824;
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 20px;
      padding: 20px;
      max-width: 360px;
      width: 100%;
      text-align: center;
    }
  </style>
</head>
<body>

  <!-- Fixed Dark Food Background -->
  <div class="bg-overlay"></div>

  <!-- Main Glassmorphic Bio Card -->
  <main class="card-container">
    
    <!-- Top Branding -->
    <header class="profile-header">
      <div class="avatar-wrapper">
        <img 
          src="https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=300&q=80" 
          alt="Six Seven Dog Logo" 
          class="avatar-img"
        />
        <div class="avatar-badge">
          <i class="fa-solid fa-fire"></i>
        </div>
      </div>
      <h1 class="brand-title">Six Seven Dog</h1>
      <h2 class="brand-subtitle">Hot Dogs Especiais & Pastéis Crocantes</h2>
      
      <div class="status-badge">
        <span class="status-dot"></span>
        <span>Aberto Agora - Faça seu Pedido</span>
      </div>

      <p class="brand-bio">
        O melhor Hot Dog da região e pastéis recheados de verdade. Sabor incomparável!
      </p>
    </header>

    <!-- Quick Action 2-Column Grid -->
    <section class="quick-grid">
      <!-- Botão 1: WhatsApp -->
      <a 
        href="https://wa.me/5511998765432?text=Ol%C3%A1!%20Gostaria%20de%20fazer%20um%20pedido%20no%20Six%20Seven%20Dog." 
        target="_blank" 
        class="grid-btn whatsapp-btn"
      >
        <i class="fa-brands fa-whatsapp"></i>
        <span>Pedir no WhatsApp</span>
      </a>

      <!-- Botão 2: Cardápio Completo -->
      <a 
        href="#cardapio" 
        onclick="openSimpleModal('Cardápio Completo', '🌭 Monster Cheddar Bacon: R$ 26,90<br>🌭 Vulcão 4 Queijos: R$ 28,50<br>🥟 Pastel Especial Frango Catupiry: R$ 21,90<br>🥟 Pastel Carne Louca: R$ 19,90<br>🥤 Caldo de Cana Gelado 500ml: R$ 8,50'); return false;"
        class="grid-btn"
      >
        <i class="fa-solid fa-utensils"></i>
        <span>Cardápio Completo</span>
      </a>

      <!-- Botão 3: Como Chegar / Localização -->
      <a 
        href="https://maps.google.com/?q=Av.+das+Nações+Unidas,+1250" 
        target="_blank" 
        class="grid-btn"
      >
        <i class="fa-solid fa-location-dot"></i>
        <span>Como Chegar</span>
      </a>

      <!-- Botão 4: Horários de Funcionamento -->
      <a 
        href="#horarios" 
        onclick="openSimpleModal('Horários de Atendimento', 'Terça a Quinta: 18h às 23h30<br>Sexta e Sábado: 18h às 01h00<br>Domingo: 18h às 23h30<br>Segunda: Fechado (Descanso)'); return false;"
        class="grid-btn"
      >
        <i class="fa-solid fa-clock"></i>
        <span>Horários</span>
      </a>
    </section>

    <!-- Main Highlight Button -->
    <a 
      href="https://wa.me/5511998765432?text=Ol%C3%A1!%20Quero%20fazer%20um%20pedido%20para%20entrega%20delivery!" 
      target="_blank" 
      class="main-cta-btn"
    >
      <i class="fa-solid fa-motorcycle"></i>
      <span>FAZER PEDIDO AGORA (DELIVERY)</span>
    </a>

    <!-- Menu Highlights -->
    <section class="highlights-section">
      <div class="highlights-title">
        <i class="fa-solid fa-fire-flame-curved"></i>
        <span>Destaques do Dia</span>
      </div>

      <div class="highlights-grid">
        <!-- Card 1: Hot Dog Especial -->
        <article class="dish-card">
          <img 
            src="https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=300&q=80" 
            alt="Hot Dog Monster Cheddar" 
            class="dish-img"
          />
          <div class="dish-body">
            <h3 class="dish-name">Hot Dog Monster Cheddar</h3>
            <a 
              href="https://wa.me/5511998765432?text=Ol%C3%A1!%20Gostaria%20de%20pedir%20o%20Hot%20Dog%20Monster%20Cheddar%20Bacon!" 
              target="_blank" 
              class="dish-order-btn"
            >
              <i class="fa-solid fa-bag-shopping"></i> Pedir
            </a>
          </div>
        </article>

        <!-- Card 2: Pastel Crocante Recheado -->
        <article class="dish-card">
          <img 
            src="https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=300&q=80" 
            alt="Pastel Especial Frango Catupiry" 
            class="dish-img"
          />
          <div class="dish-body">
            <h3 class="dish-name">Pastel Frango & Catupiry</h3>
            <a 
              href="https://wa.me/5511998765432?text=Ol%C3%A1!%20Gostaria%20de%20pedir%20o%20Pastel%20Especial%20de%20Frango%20com%20Catupiry!" 
              target="_blank" 
              class="dish-order-btn"
            >
              <i class="fa-solid fa-bag-shopping"></i> Pedir
            </a>
          </div>
        </article>
      </div>
    </section>

    <!-- Footer -->
    <footer class="card-footer">
      <div class="social-links">
        <a href="https://instagram.com" target="_blank" class="social-icon" aria-label="Instagram">
          <i class="fa-brands fa-instagram"></i>
        </a>
        <a href="https://tiktok.com" target="_blank" class="social-icon" aria-label="TikTok">
          <i class="fa-brands fa-tiktok"></i>
        </a>
        <a href="https://facebook.com" target="_blank" class="social-icon" aria-label="Facebook">
          <i class="fa-brands fa-facebook-f"></i>
        </a>
      </div>

      <p class="footer-address">
        Av. das Nações Unidas, 1250 - Vila Gourmet, SP
      </p>
      <p class="footer-copy">
        © 2026 Six Seven Dog. Todos os direitos reservados.
      </p>
    </footer>

  </main>

  <!-- Interactive Modal Container -->
  <div id="simpleModal" class="modal-overlay" onclick="closeSimpleModal()">
    <div class="modal-content" onclick="event.stopPropagation()">
      <h3 id="modalTitle" style="color: #FF9F1C; font-size: 16px; margin-bottom: 12px; font-weight: 700;"></h3>
      <div id="modalBody" style="font-size: 13px; line-height: 1.6; color: #e5e7eb; margin-bottom: 18px; text-align: left;"></div>
      <button 
        onclick="closeSimpleModal()" 
        style="padding: 10px 20px; background: #FF9F1C; border: none; border-radius: 12px; color: #000; font-weight: 700; cursor: pointer; font-size: 12px;"
      >
        Fechar
      </button>
    </div>
  </div>

  <script>
    function openSimpleModal(title, content) {
      document.getElementById('modalTitle').innerHTML = title;
      document.getElementById('modalBody').innerHTML = content;
      document.getElementById('simpleModal').classList.add('active');
    }

    function closeSimpleModal() {
      document.getElementById('simpleModal').classList.remove('active');
    }
  </script>
</body>
</html>`;
