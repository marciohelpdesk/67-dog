export interface MenuItem {
  id: string;
  name: string;
  category?: 'hotdogs' | 'combos' | 'bebidas' | string;
  description: string;
  price: number;
  tag?: string;
  image?: string;
  popular?: boolean;
  ingredients?: string[];
  comboItems?: string[];
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
  { id: 'extra-vina', name: 'Vina Adicional', price: 3.0 },
  { id: 'extra-costela', name: 'Costela Desfiada Extra', price: 5.0 },
  { id: 'extra-bacon', name: 'Bacon Crocante Extra', price: 4.0 },
  { id: 'extra-frango', name: 'Frango Desfiado Extra', price: 4.0 },
  { id: 'extra-calabresa', name: 'Calabresa Fatiada Extra', price: 4.0 },
  { id: 'extra-pure', name: 'Purê de Batata Especial', price: 3.0 },
  { id: 'extra-cheddar', name: 'Cheddar Cremoso Extra', price: 4.0 },
  { id: 'extra-catupiry', name: 'Catupiry® Original Cremoso', price: 4.0 },
  { id: 'extra-batata', name: 'Batata Palha Extra', price: 2.5 },
];

export const AVAILABLE_REMOVALS: RemovalOption[] = [
  { id: 'no-cebola', name: 'Sem Cebola' },
  { id: 'no-tomate', name: 'Sem Tomate' },
  { id: 'no-milho', name: 'Sem Milho' },
  { id: 'no-pure', name: 'Sem Purê de Batata' },
  { id: 'no-batata-palha', name: 'Sem Batata Palha' },
  { id: 'no-maionese', name: 'Sem Maionese' },
  { id: 'no-ketchup', name: 'Sem Ketchup' },
  { id: 'no-mostarda', name: 'Sem Mostarda' },
];

export interface MenuCategory {
  id: string;
  label: string;
  emoji: string;
  badge?: string;
  items: MenuItem[];
}

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'hotdogs',
    label: 'Hot Dogs',
    emoji: '🌭',
    badge: 'Com Vina',
    items: [
      {
        id: 'dog-six-seven',
        name: 'SIX SEVEN',
        category: 'hotdogs',
        description: 'Pão de hot dog, 2 vinas, frango desfiado, calabresa, bacon, purê, tomate, milho, cebola, maionese e batata palha.',
        price: 23.9,
        tag: '🔥 O Mais Completo',
        popular: true,
        ingredients: ['2 Vinas', 'Frango Desfiado', 'Calabresa', 'Bacon Crocante', 'Purê', 'Milho', 'Tomate', 'Cebola', 'Maionese', 'Batata Palha'],
      },
      {
        id: 'dog-costelaco',
        name: 'COSTELAÇO',
        category: 'hotdogs',
        description: 'Pão de hot dog, vina, costela desfiada, purê, tomate, milho, cebola, maionese e batata palha.',
        price: 21.9,
        tag: '🥩 Costela Suculenta',
        popular: true,
        ingredients: ['Vina', 'Costela Desfiada', 'Purê Especial', 'Milho', 'Tomate', 'Cebola', 'Maionese', 'Batata Palha'],
      },
      {
        id: 'dog-baconzeira',
        name: 'BACONZEIRA',
        category: 'hotdogs',
        description: 'Pão de hot dog, vina, bacon, purê, tomate, milho, cebola, maionese e batata palha.',
        price: 19.9,
        tag: '🥓 Muito Bacon',
        ingredients: ['Vina', 'Bacon Crocante', 'Purê Especial', 'Milho', 'Tomate', 'Cebola', 'Maionese', 'Batata Palha'],
      },
      {
        id: 'dog-frangolino',
        name: 'FRANGOLINO',
        category: 'hotdogs',
        description: 'Pão de hot dog, vina, frango desfiado, purê, tomate, milho, cebola, maionese e batata palha.',
        price: 18.9,
        tag: '🍗 Frango Suculento',
        ingredients: ['Vina', 'Frango Desfiado', 'Purê Especial', 'Milho', 'Tomate', 'Cebola', 'Maionese', 'Batata Palha'],
      },
      {
        id: 'dog-calabresaco',
        name: 'CALABRESAÇO',
        category: 'hotdogs',
        description: 'Pão de hot dog, vina, calabresa, purê, tomate, milho, cebola, maionese e batata palha.',
        price: 18.9,
        tag: '🔥 Calabresa na Chapa',
        ingredients: ['Vina', 'Calabresa Fatiada', 'Purê Especial', 'Milho', 'Tomate', 'Cebola', 'Maionese', 'Batata Palha'],
      },
      {
        id: 'dog-raiz-duplo',
        name: 'RAIZ DUPLO',
        category: 'hotdogs',
        description: 'Pão de hot dog, 2 vinas, tomate, milho, cebola, maionese e batata palha.',
        price: 15.9,
        tag: '🌭 2 Vinas',
        ingredients: ['2 Vinas', 'Tomate', 'Milho', 'Cebola', 'Maionese', 'Batata Palha'],
      },
      {
        id: 'dog-raiz',
        name: 'RAIZ',
        category: 'hotdogs',
        description: 'Pão de hot dog, vina, tomate, milho, cebola, maionese e batata palha.',
        price: 12.9,
        tag: 'Tradicional',
        ingredients: ['Vina', 'Tomate', 'Milho', 'Cebola', 'Maionese', 'Batata Palha'],
      },
      {
        id: 'dog-democratico',
        name: 'DEMOCRÁTICO',
        category: 'hotdogs',
        description: 'Pão de hot dog, vina, maionese, ketchup e mostarda.',
        price: 6.7,
        tag: '⭐ Especial R$ 6,70',
        ingredients: ['Pão Macio', 'Vina', 'Maionese', 'Ketchup', 'Mostarda'],
      },
    ],
  },
  {
    id: 'combos',
    label: 'Combos 67',
    emoji: '🔥',
    badge: 'Economize',
    items: [
      {
        id: 'combo-six-seven-na-medida',
        name: 'SIX SEVEN NA MEDIDA',
        category: 'combos',
        description: '1 Six Seven + 1 refrigerante lata (350 ml). O lanche mais completo com a sua bebida geladinha.',
        price: 29.9,
        tag: '🌭 Individual Perfeito',
        popular: true,
        comboItems: ['1x Six Seven (Completo)', '1x Refrigerante Lata 350 ml'],
      },
      {
        id: 'combo-duplinha',
        name: 'DUPLINHA',
        category: 'combos',
        description: '1 Costelaço + 1 Six Seven + 1 Coca-Cola 600 ml. Perfeito para dividir ou comer a dois com economia!',
        price: 49.9,
        tag: '❤️ Combo Casal',
        popular: true,
        comboItems: ['1x Costelaço (Costela desfiada)', '1x Six Seven (Completo)', '1x Coca-Cola 600 ml Gelada'],
      },
      {
        id: 'combo-galera',
        name: 'GALERA SIX SEVEN',
        category: 'combos',
        description: '1 Six Seven + 1 Costelaço + 2 Raiz + 1 Coca-Cola 2 L. O combo definitivo para reunir os amigos e a família.',
        price: 74.9,
        tag: '👥 Para 4 Pessoas',
        popular: true,
        comboItems: ['1x Six Seven', '1x Costelaço', '2x Raiz', '1x Coca-Cola 2 Litros'],
      },
    ],
  },
  {
    id: 'bebidas',
    label: 'Bebidas',
    emoji: '🥤',
    items: [
      {
        id: 'refri-lata',
        name: 'Refrigerante Lata 350 ml',
        category: 'bebidas',
        description: 'Coca-Cola, Guaraná Antarctica ou Fanta — 350ml bem gelado.',
        price: 6.0,
      },
      {
        id: 'coca-600',
        name: 'Coca-Cola 600 ml',
        category: 'bebidas',
        description: 'Garrafa 600ml gelada na medida certa.',
        price: 9.0,
      },
      {
        id: 'refri-2l',
        name: 'Coca-Cola 2 Litros',
        category: 'bebidas',
        description: 'Tamanho família 2L bem gelada para acompanhar seu dog.',
        price: 14.0,
      },
      {
        id: 'agua-500',
        name: 'Água Mineral 500 ml',
        category: 'bebidas',
        description: 'Garrafa 500ml, gelada com ou sem gás.',
        price: 4.0,
      },
    ],
  },
];

export const MENU_ITEMS: MenuItem[] = MENU_CATEGORIES.flatMap((c) => c.items);

export const ESTABLISHMENT_INFO = {
  name: '67 Dog',
  subname: 'Six Seven Hot Dog',
  tagline: 'O Autêntico Hot Dog com Vina & Combos Especiais',
  bio: 'O melhor Hot Dog com vina da região! Pão fresquinho, costela suculenta, bacon estalando e molhos especiais.',
  phone: '5541997719054',
  phoneDisplay: '(41) 99771-9054',
  address: 'Av. das Nações Unidas, 1250 - Vila Gourmet, São Paulo - SP',
  mapsUrl: 'https://maps.google.com/?q=Av.+das+Nações+Unidas,+1250,+São+Paulo',
  wazeUrl: 'https://waze.com/ul?q=Av.+das+Nações+Unidas,+1250,+São+Paulo',
  ifoodUrl: 'https://www.ifood.com.br/delivery/sao-paulo-sp/six-seven-dog',
  instagram: 'https://instagram.com',
  tiktok: 'https://tiktok.com',
  facebook: 'https://facebook.com',
  pixKey: '69172430000197',
  pixKeyDisplay: '69.172.430/0001-97',
  pixType: 'CNPJ',
  pixBeneficiary: '67 Dog',
  deliveryFee: 5,
  hoursDisplay: 'Ter–Dom, 18h–23h',
  paymentDisplay: 'Pix, cartão, dinheiro',
  hours: [
    { day: 'Segunda-feira', time: 'Fechado (Descanso da equipe)', open: false },
    { day: 'Terça a Domingo', time: '18:00 às 23:00', open: true },
  ],
};
