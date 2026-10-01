export interface MenuItem {
  id: string;
  name: string;
  category?: 'hotdogs' | 'combos' | 'hamburgueres' | 'pasteis' | 'bebidas' | string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  isDailyOffer?: boolean;
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
  { id: 'extra-hamburguer', name: 'Blend Burger 150g Extra', price: 9.0 },
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
  { id: 'no-alface', name: 'Sem Alface' },
  { id: 'no-picles', name: 'Sem Picles' },
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
        id: 'dog-democratico',
        name: '1. Democrático',
        category: 'hotdogs',
        description: 'Pão de hot dog macio, vina, maionese artesanal da casa, ketchup e mostarda.',
        price: 12.9,
        ingredients: ['Pão Macio', 'Vina', 'Maionese Especial', 'Ketchup', 'Mostarda'],
      },
      {
        id: 'dog-raiz',
        name: '2. Raiz',
        category: 'hotdogs',
        description: 'Pão de hot dog, vina, tomate fresco, milho verde, cebola, maionese e batata palha crocante.',
        price: 15.9,
        popular: true,
        ingredients: ['Vina', 'Tomate', 'Milho', 'Cebola', 'Maionese', 'Batata Palha'],
      },
      {
        id: 'dog-raiz-duplo',
        name: '3. Raiz Duplo',
        category: 'hotdogs',
        description: 'Pão de hot dog, 2 vinas, tomate, milho, cebola, maionese artesanal e batata palha.',
        price: 17.9,
        ingredients: ['2 Vinas', 'Tomate', 'Milho', 'Cebola', 'Maionese', 'Batata Palha'],
      },
      {
        id: 'dog-frangolino',
        name: '4. Frangolino',
        category: 'hotdogs',
        description: 'Pão de hot dog, vina, frango desfiado temperado, purê especial, tomate, milho, cebola, maionese e batata palha.',
        price: 21.9,
        ingredients: ['Vina', 'Frango Desfiado', 'Purê Especial', 'Milho', 'Tomate', 'Cebola', 'Maionese', 'Batata Palha'],
      },
      {
        id: 'dog-calabresaco',
        name: '5. Calabresaço',
        category: 'hotdogs',
        description: 'Pão de hot dog, vina, calabresa fatiada na chapa, purê especial, tomate, milho, cebola, maionese e batata palha.',
        price: 22.9,
        ingredients: ['Vina', 'Calabresa na Chapa', 'Purê Especial', 'Milho', 'Tomate', 'Cebola', 'Maionese', 'Batata Palha'],
      },
      {
        id: 'dog-baconzeira',
        name: '6. Baconzeira',
        category: 'hotdogs',
        description: 'Pão de hot dog, vina, bacon crocante em tiras, purê especial, tomate, milho, cebola, maionese e batata palha.',
        price: 22.9,
        ingredients: ['Vina', 'Bacon Crocante', 'Purê Especial', 'Milho', 'Tomate', 'Cebola', 'Maionese', 'Batata Palha'],
      },
      {
        id: 'dog-costelaco',
        name: '7. Costelaço',
        category: 'hotdogs',
        description: 'Pão de hot dog, vina, costela desfiada suculenta, purê especial, tomate, milho, cebola, maionese e batata palha.',
        price: 27.9,
        ingredients: ['Vina', 'Costela Desfiada', 'Purê Especial', 'Milho', 'Tomate', 'Cebola', 'Maionese', 'Batata Palha'],
      },
      {
        id: 'dog-six-seven',
        name: '8. Six Seven',
        category: 'hotdogs',
        description: 'O mais completo! Pão de hot dog, 2 vinas, frango desfiado, calabresa, bacon, purê, tomate, milho, cebola, maionese e batata palha.',
        price: 33.9,
        popular: true,
        ingredients: ['2 Vinas', 'Frango Desfiado', 'Calabresa', 'Bacon Crocante', 'Purê', 'Milho', 'Tomate', 'Cebola', 'Maionese', 'Batata Palha'],
      },
    ],
  },
  {
    id: 'combos',
    label: 'Combos 67',
    emoji: '🔥',
    badge: 'Mais Pedidos',
    items: [
      {
        id: 'combo-six-seven-na-medida',
        name: '1. Six Seven na Medida',
        category: 'combos',
        description: '1 Six Seven + 1 refrigerante lata (350 ml). O lanche mais completo com a sua bebida geladinha.',
        price: 39.9,
        comboItems: ['1x 8. Six Seven (Completo)', '1x Refrigerante Lata 350 ml'],
      },
      {
        id: 'combo-duplinha',
        name: '2. Duplinha',
        category: 'combos',
        description: '1 Costelaço + 1 Six Seven + 1 Coca-Cola 600 ml. Perfeito para dividir ou comer a dois com muito sabor!',
        price: 64.9,
        popular: true,
        comboItems: ['1x 7. Costelaço (Costela desfiada)', '1x 8. Six Seven (Completo)', '1x Coca-Cola 600 ml Gelada'],
      },
      {
        id: 'combo-galera',
        name: '3. Galera Six Seven',
        category: 'combos',
        description: '1 Six Seven + 1 Costelaço + 2 Raiz + 1 Coca-Cola 2 L. O combo definitivo para reunir os amigos e a família.',
        price: 98.9,
        comboItems: ['1x 8. Six Seven', '1x 7. Costelaço', '2x 2. Raiz', '1x Coca-Cola 2 Litros'],
      },
    ],
  },
  {
    id: 'hamburgueres',
    label: 'Hambúrgueres',
    emoji: '🍔',
    badge: 'Artesanais',
    items: [
      {
        id: 'burger-x-salada',
        name: '1. X-Salada',
        category: 'hamburgueres',
        description: 'Pão brioche selado na manteiga, blend bovino artesanal suculento, queijo derretido, maionese da casa, alface e tomate fresco.',
        price: 18.9,
        ingredients: ['Pão Brioche', 'Blend Bovino', 'Queijo Derretido', 'Alface Fresca', 'Tomate', 'Maionese da Casa'],
      },
      {
        id: 'burger-x-frango',
        name: '2. X-Frango',
        category: 'hamburgueres',
        description: 'Pão brioche macio, frango desfiado temperado suculento, queijo derretido, maionese artesanal da casa, alface e tomate.',
        price: 18.06,
        ingredients: ['Pão Brioche', 'Frango Desfiado', 'Queijo Derretido', 'Alface', 'Tomate', 'Maionese da Casa'],
      },
      {
        id: 'burger-x-bacon',
        name: '3. X-Bacon',
        category: 'hamburgueres',
        description: 'Pão brioche, blend bovino artesanal, fatias generosas de bacon super crocante, queijo derretido e maionese da casa.',
        price: 23.9,
        popular: true,
        ingredients: ['Pão Brioche', 'Blend Bovino', 'Bacon Crocante em Tiras', 'Queijo Derretido', 'Maionese da Casa'],
      },
      {
        id: 'burger-x-calabresa',
        name: '4. X-Calabresa',
        category: 'hamburgueres',
        description: 'Pão brioche selado, blend bovino, calabresa fatiada dourada na chapa, queijo derretido e maionese especial.',
        price: 23.9,
        ingredients: ['Pão Brioche', 'Blend Bovino', 'Calabresa Fatiada na Chapa', 'Queijo Derretido', 'Maionese Especial'],
      },
      {
        id: 'burger-x-costela',
        name: '5. X-Costela',
        category: 'hamburgueres',
        description: 'A especialidade da casa! Pão brioche, costela bovina desfiada no molho especial da casa e queijo muçarela derretido.',
        price: 25.9,
        ingredients: ['Pão Brioche', 'Costela Bovina Desfiada', 'Queijo Derretido', 'Molho Especial'],
      },
      {
        id: 'burger-x-tudo',
        name: '6. X-Tudo',
        category: 'hamburgueres',
        description: 'O lanche supremo! Blend bovino, frango desfiado, bacon crocante, calabresa na chapa, queijo derretido, alface, tomate e maionese especial.',
        price: 31.9,
        ingredients: ['Pão Brioche', 'Blend Bovino', 'Frango Desfiado', 'Bacon Crocante', 'Calabresa', 'Queijo Derretido', 'Alface', 'Tomate', 'Maionese'],
      },
    ],
  },
  {
    id: 'pasteis',
    label: 'Pastéis',
    emoji: '🥟',
    badge: 'Fritos na Hora',
    items: [
      {
        id: 'pastel-carne',
        name: '1. Pastel de Carne',
        category: 'pasteis',
        description: 'Massa artesanal super crocante e sequinha recheada com carne moída de primeira temperada artesanalmente, azeitona e cheiro verde.',
        price: 16.9,
        popular: true,
        ingredients: ['Massa Crocante 67', 'Carne Moída Especial', 'Azeitona', 'Cheiro Verde'],
      },
      {
        id: 'pastel-frango',
        name: '2. Pastel de Frango',
        category: 'pasteis',
        description: 'Massa dourada e sequinha recheada com frango desfiado bem temperado e suculento com temperos da casa.',
        price: 17.9,
        ingredients: ['Massa Crocante 67', 'Frango Desfiado Especial', 'Temperos da Casa'],
      },
      {
        id: 'pastel-queijo',
        name: '3. Pastel de Queijo',
        category: 'pasteis',
        description: 'Pastel super sequinho com queijo muçarela abundante que derrete e estica até a última mordida, com toque suave de orégano.',
        price: 16.9,
        ingredients: ['Massa Crocante 67', 'Muçarela Abundante', 'Orégano'],
      },
      {
        id: 'pastel-pizza',
        name: '4. Pastel de Pizza',
        category: 'pasteis',
        description: 'Muçarela fatiada derretida, presunto selecionado em cubinhos, rodelas de tomate fresco e orégano chileno.',
        price: 17.9,
        ingredients: ['Massa Crocante 67', 'Muçarela', 'Presunto', 'Tomate Fresco', 'Orégano'],
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
  phone: '5541997774498',
  phoneDisplay: '(41) 99777-4498',
  address: 'Av. Estados Unidos, 389 - Nações, Fazenda Rio Grande - PR, 83823-114',
  mapsUrl: 'https://maps.google.com/?q=Av.+Estados+Unidos,+389+-+Nações,+Fazenda+Rio+Grande+-+PR,+83823-114',
  wazeUrl: 'https://waze.com/ul?q=Av.+Estados+Unidos,+389+-+Nações,+Fazenda+Rio+Grande+-+PR,+83823-114',
  ifoodUrl: 'https://www.ifood.com.br/delivery/sao-paulo-sp/six-seven-dog',
  instagram: 'https://instagram.com',
  tiktok: 'https://tiktok.com',
  facebook: 'https://facebook.com',
  pixKey: '69172430000197',
  pixKeyDisplay: '69172430000197',
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
