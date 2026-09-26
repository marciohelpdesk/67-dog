export interface MenuItem {
  id: string;
  name: string;
  category: 'hotdogs' | 'pasteis' | 'combos' | 'bebidas';
  description: string;
  price: number;
  image?: string;
  popular?: boolean;
  tag?: string;
}

export interface ExtraOption {
  id: string;
  name: string;
  price: number;
}

export interface RemovalOption {
  id: string;
  name: string;
}

export const AVAILABLE_EXTRAS: ExtraOption[] = [
  { id: 'extra-bacon', name: 'Bacon Crocante em Cubos', price: 4.50 },
  { id: 'extra-calabresa', name: 'Calabresa Fatiada na Chapa', price: 4.00 },
  { id: 'extra-ovos', name: 'Ovo Frito na Chapa', price: 3.50 },
  { id: 'extra-cheddar', name: 'Cheddar Cremoso Extra', price: 4.00 },
  { id: 'extra-catupiry', name: 'Catupiry® Original Extra', price: 4.50 },
  { id: 'extra-salsicha', name: 'Salsicha Artesanal Adicional', price: 3.50 },
  { id: 'extra-mussarela', name: 'Muçarela Derretida Dobrada', price: 4.00 },
];

export const AVAILABLE_REMOVALS: RemovalOption[] = [
  { id: 'no-cebola', name: 'Sem Cebola / Caramelizada' },
  { id: 'no-tomate', name: 'Sem Tomate / Vinagrete' },
  { id: 'no-milho', name: 'Sem Milho' },
  { id: 'no-batata-palha', name: 'Sem Batata Palha' },
  { id: 'no-maionese', name: 'Sem Maionese Verde' },
  { id: 'no-pure', name: 'Sem Purê de Batata' },
  { id: 'no-molho', name: 'Sem Molho da Casa' },
];

export const MENU_ITEMS: MenuItem[] = [
  // Hot Dogs
  {
    id: 'hd-1',
    name: 'Monster Cheddar Bacon',
    category: 'hotdogs',
    description: 'Duas salsichas especiais, creme cheddar artesanal maçaricado, farofa crocante de bacon, cebola caramelizada, maionese verde da casa e batata palha.',
    price: 26.90,
    popular: true,
    tag: 'Mais Pedido 🔥'
  },
  {
    id: 'hd-2',
    name: 'Tradicional Prensado Duplo',
    category: 'hotdogs',
    description: 'Pão macio prensado, 2 salsichas suculentas, purê de batata cremoso, molho artesanal, milho fresco, vinagrete e batata palha fininha.',
    price: 22.90,
    popular: false,
    tag: 'Clássico da Rua'
  },
  {
    id: 'hd-3',
    name: 'Vulcão 4 Queijos Especial',
    category: 'hotdogs',
    description: 'Salsicha artesanal selada, muçarela derretida na chapa, Catupiry® Original, provolone defumado, toque de cheddar cremoso e orégano.',
    price: 28.50,
    popular: false,
    tag: 'Super Queijudo'
  },
  {
    id: 'hd-4',
    name: 'Dogão Six Seven Supremo 22cm',
    category: 'hotdogs',
    description: 'Pão brioche 22cm, 3 salsichas grelhadas, frango desfiado com catupiry, bacon em cubos, purê aveludado, queijo gratinado e maionese defumada.',
    price: 33.90,
    popular: true,
    tag: 'Gigante da Casa'
  },

  // Pastéis
  {
    id: 'pt-1',
    name: 'Pastel Especial da Casa (Frango & Catupiry)',
    category: 'pasteis',
    description: 'Massa artesanal sequinha e super crocante de 25cm, peito de frango desfiado suculento, Catupiry® Original em abundância, milho e bacon.',
    price: 21.90,
    popular: true,
    tag: 'Favorito dos Clientes ⭐'
  },
  {
    id: 'pt-2',
    name: 'Pastel Carne Louca com Queijo',
    category: 'pasteis',
    description: 'Carne bovina temperada lentamente na panela com pimentões, azeitonas selecionadas, ovo cozido e muçarela fatiada derretida.',
    price: 19.90,
    popular: false,
    tag: 'Recheio Turbinado'
  },
  {
    id: 'pt-3',
    name: 'Pastel Pizza Especial Paulista',
    category: 'pasteis',
    description: 'Fatias nobres de presunto cozido, camada dupla de queijo muçarela derretido, rodelas de tomate fresco e orégano aromático.',
    price: 18.90,
    popular: false,
    tag: 'Crocância Perfeita'
  },
  {
    id: 'pt-4',
    name: 'Pastel Doce Sensação de Morango',
    category: 'pasteis',
    description: 'Massa crocante salpicada com canela e açúcar, recheio farto de chocolate ao leite nobre e morangos frescos selecionados picados.',
    price: 20.90,
    popular: true,
    tag: 'Sobremesa Irresistível'
  },

  // Combos
  {
    id: 'cb-1',
    name: 'Combo Six Seven Individual',
    category: 'combos',
    description: '1 Hot Dog Monster Cheddar Bacon + 1 Batata Frita Média com cheddar e bacon + 1 Refrigerante lata 350ml geladinho.',
    price: 37.90,
    popular: true,
    tag: 'Melhor Custo-Benefício'
  },
  {
    id: 'cb-2',
    name: 'Combo Casal Dog & Pastel',
    category: 'combos',
    description: '1 Monster Dog + 1 Pastel Especial de Frango com Catupiry + 1 Porção de Batata Crocante + 2 Refrigerantes lata.',
    price: 56.90,
    popular: true,
    tag: 'Para Compartilhar'
  },
  {
    id: 'cb-3',
    name: 'Batata Suprema Six Seven (400g)',
    category: 'combos',
    description: 'Porção generosa de batatas onduladas crocantes, cobertas com calda cremosa de queijo cheddar e farofa de bacon defumado.',
    price: 25.00,
    popular: false,
    tag: 'Porção'
  },

  // Bebidas
  {
    id: 'bb-1',
    name: 'Caldo de Cana Gelado c/ Limão 500ml',
    category: 'bebidas',
    description: 'Extraído na hora, geladinho com toque cítrico de limão taiti. O par clássico do pastel!',
    price: 8.50,
    popular: true,
    tag: 'Tradição'
  },
  {
    id: 'bb-2',
    name: 'Coca-Cola Original Lata 350ml',
    category: 'bebidas',
    description: 'Lata trincando de gelada.',
    price: 6.00,
    popular: false,
  },
  {
    id: 'bb-3',
    name: 'Guaraná Antarctica Lata 350ml',
    category: 'bebidas',
    description: 'Super gelado com gás.',
    price: 6.00,
    popular: false,
  },
  {
    id: 'bb-4',
    name: 'Suco Natural de Laranja 500ml',
    category: 'bebidas',
    description: '100% natural, sem adição de açúcar ou água, espremido no dia.',
    price: 9.00,
    popular: false,
  },
];

export const ESTABLISHMENT_INFO = {
  name: '67 Dog',
  subname: 'Six Seven Hot Dog',
  tagline: 'Hot Dogs Especiais & Pastéis Crocantes',
  bio: 'O melhor Hot Dog da região e pastéis recheados de verdade. Pão fresquinho, fritura sequinha e sabor incomparável!',
  phone: '19417207983',
  phoneDisplay: '+1 (941) 720-7983',
  address: 'Av. das Nações Unidas, 1250 - Vila Gourmet, São Paulo - SP',
  mapsUrl: 'https://maps.google.com/?q=Av.+das+Nações+Unidas,+1250',
  wazeUrl: 'https://waze.com/ul?q=Av.+das+Nações+Unidas,+1250',
  ifoodUrl: 'https://www.ifood.com.br/delivery/sao-paulo-sp/six-seven-dog',
  instagram: 'https://instagram.com/sixsevendog',
  tiktok: 'https://tiktok.com/@sixsevendog',
  facebook: 'https://facebook.com/sixsevendog',
  pixKey: '+19417207983',
  pixType: 'Chave / Celular',
  pixBeneficiary: '67 Dog',
  hours: [
    { day: 'Segunda-feira', time: 'Fechado (Descanso da equipe)', open: false },
    { day: 'Terça-feira', time: '18:00 às 23:30', open: true },
    { day: 'Quarta-feira', time: '18:00 às 23:30', open: true },
    { day: 'Quinta-feira', time: '18:00 às 23:30', open: true },
    { day: 'Sexta-feira', time: '18:00 às 01:00', open: true },
    { day: 'Sábado', time: '18:00 às 01:00', open: true },
    { day: 'Domingo', time: '18:00 às 23:30', open: true },
  ],
};
