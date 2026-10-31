export interface MenuItem {
  id: string;
  name: string;
  category?: 'hotdogs' | 'combos' | 'pasteis' | 'bebidas' | string;
  subgroup?: 'hotdogs' | 'pasteis';
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
        id: 'dog-democratico',
        name: '1. Democrático',
        category: 'hotdogs',
        description: 'Pão de hot dog macio, vina, maionese artesanal da casa, ketchup e mostarda.',
        price: 8.0,
        ingredients: ['Pão Macio', 'Vina', 'Maionese Especial', 'Ketchup', 'Mostarda'],
      },
      {
        id: 'dog-raiz',
        name: '2. Raiz',
        category: 'hotdogs',
        description: 'Pão de hot dog, vina, tomate fresco, milho verde, cebola, maionese e batata palha crocante.',
        price: 10.0,
        popular: true,
        ingredients: ['Vina', 'Tomate', 'Milho', 'Cebola', 'Maionese', 'Batata Palha'],
      },
      {
        id: 'dog-raiz-duplo',
        name: '3. Duplo Raiz',
        category: 'hotdogs',
        description: 'Pão de hot dog, 2 vinas, tomate, milho, cebola, maionese artesanal e batata palha.',
        price: 12.0,
        ingredients: ['2 Vinas', 'Tomate', 'Milho', 'Cebola', 'Maionese', 'Batata Palha'],
      },
      {
        id: 'dog-frangolino',
        name: '4. Frangolino',
        category: 'hotdogs',
        description: 'Pão de hot dog, vina, frango desfiado temperado, purê especial, tomate, milho, cebola, maionese e batata palha.',
        price: 15.0,
        ingredients: ['Vina', 'Frango Desfiado', 'Purê Especial', 'Milho', 'Tomate', 'Cebola', 'Maionese', 'Batata Palha'],
      },
      {
        id: 'dog-calabresaco',
        name: '5. Calabresaço',
        category: 'hotdogs',
        description: 'Pão de hot dog, vina, calabresa fatiada na chapa, purê especial, tomate, milho, cebola, maionese e batata palha.',
        price: 15.0,
        ingredients: ['Vina', 'Calabresa na Chapa', 'Purê Especial', 'Milho', 'Tomate', 'Cebola', 'Maionese', 'Batata Palha'],
      },
      {
        id: 'dog-baconzeira',
        name: '6. Baconzeira',
        category: 'hotdogs',
        description: 'Pão de hot dog, vina, bacon crocante em tiras, purê especial, tomate, milho, cebola, maionese e batata palha.',
        price: 17.0,
        ingredients: ['Vina', 'Bacon Crocante', 'Purê Especial', 'Milho', 'Tomate', 'Cebola', 'Maionese', 'Batata Palha'],
      },
      {
        id: 'dog-six-seven',
        name: '7. Six Seven',
        category: 'hotdogs',
        description: 'O mais completo! Pão de hot dog, 2 vinas, frango desfiado, calabresa, bacon, purê, tomate, milho, cebola, maionese e batata palha.',
        price: 19.0,
        popular: true,
        ingredients: ['2 Vinas', 'Frango Desfiado', 'Calabresa', 'Bacon Crocante', 'Purê', 'Milho', 'Tomate', 'Cebola', 'Maionese', 'Batata Palha'],
      },
      {
        id: 'dog-costelaco',
        name: '8. Costelaço',
        category: 'hotdogs',
        description: 'Pão de hot dog, vina, costela desfiada suculenta, purê especial, tomate, milho, cebola, maionese e batata palha.',
        price: 20.0,
        ingredients: ['Vina', 'Costela Desfiada', 'Purê Especial', 'Milho', 'Tomate', 'Cebola', 'Maionese', 'Batata Palha'],
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
        name: '1. Combo Na Medida',
        category: 'combos',
        subgroup: 'hotdogs',
        tag: 'Hot Dog',
        description: '1 Six Seven + 1 mini Coca-Cola (220 ml) geladinha. Na medida certa para matar sua fome!',
        price: 27.0,
        popular: true,
        comboItems: ['1x 7. Six Seven (Completo)', '1x Mini Coca-Cola 220 ml'],
      },
      {
        id: 'combo-duplinha',
        name: '2. Combo Duplinha',
        category: 'combos',
        subgroup: 'hotdogs',
        tag: 'Hot Dog',
        description: '1 Costelaço + 1 Six Seven + 2 mini Coca-Cola (220 ml). Perfeito para dividir ou comer a dois com muito sabor!',
        price: 49.0,
        popular: true,
        comboItems: ['1x 8. Costelaço', '1x 7. Six Seven', '2x Mini Coca-Cola 220 ml'],
      },
      {
        id: 'combo-galera',
        name: '3. Combo Six Seven Galera',
        category: 'combos',
        subgroup: 'hotdogs',
        tag: 'Hot Dog',
        description: '1 Six Seven + 1 Costelaço + 2 Raiz + 4 mini Coca-Cola (220 ml). O combo definitivo para reunir os amigos e a família.',
        price: 79.0,
        comboItems: ['1x 7. Six Seven', '1x 8. Costelaço', '2x 2. Raiz', '4x Mini Coca-Cola 220 ml'],
      },
      {
        id: 'combo-pastel-individual',
        name: '4. Combo Individual Pastel',
        category: 'combos',
        subgroup: 'pasteis',
        tag: 'Pastel',
        description: '1 pastel tradicional à sua escolha (Carne, Frango, Pizza ou Queijo) + 1 mini Coca-Cola (220 ml) geladinha.',
        price: 19.0,
        comboItems: ['1x Pastel Tradicional (Carne, Frango, Pizza ou Queijo)', '1x Mini Coca-Cola 220 ml'],
      },
      {
        id: 'combo-pastel-individual-costela',
        name: '5. Combo Individual Costela',
        category: 'combos',
        subgroup: 'pasteis',
        tag: 'Pastel',
        description: '1 pastel de costela desfiada bem suculento + 1 mini Coca-Cola (220 ml) geladinha.',
        price: 20.0,
        comboItems: ['1x Pastel de Costela Especial', '1x Mini Coca-Cola 220 ml'],
      },
      {
        id: 'combo-pastel-duplo',
        name: '6. Combo Duplo de Pastéis',
        category: 'combos',
        subgroup: 'pasteis',
        tag: 'Pastel',
        description: '2 pastéis fritos na hora à sua escolha + 2 mini Coca-Cola (220 ml). Informe os sabores nas observações!',
        price: 34.0,
        comboItems: ['2x Pastéis Fritos na Hora', '2x Mini Coca-Cola 220 ml'],
      },
      {
        id: 'combo-pastel-familia',
        name: '7. Combo Família de Pastéis',
        category: 'combos',
        subgroup: 'pasteis',
        tag: 'Pastel',
        description: '4 pastéis fritos na hora à sua escolha + 4 mini Coca-Cola (220 ml). Economia e crocância para a família toda!',
        price: 55.0,
        popular: true,
        comboItems: ['4x Pastéis Fritos na Hora', '4x Mini Coca-Cola 220 ml'],
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
        price: 10.0,
        popular: true,
        ingredients: ['Massa Crocante 67', 'Carne Moída Especial', 'Azeitona', 'Cheiro Verde'],
      },
      {
        id: 'pastel-frango',
        name: '2. Pastel de Frango',
        category: 'pasteis',
        description: 'Massa dourada e sequinha recheada com frango desfiado bem temperado e suculento com temperos da casa.',
        price: 10.0,
        ingredients: ['Massa Crocante 67', 'Frango Desfiado Especial', 'Temperos da Casa'],
      },
      {
        id: 'pastel-pizza',
        name: '3. Pastel de Pizza',
        category: 'pasteis',
        description: 'Muçarela fatiada derretida, presunto selecionado em cubinhos, rodelas de tomate fresco e orégano chileno.',
        price: 10.0,
        ingredients: ['Massa Crocante 67', 'Muçarela', 'Presunto', 'Tomate Fresco', 'Orégano'],
      },
      {
        id: 'pastel-queijo',
        name: '4. Pastel de Queijo',
        category: 'pasteis',
        description: 'Pastel super sequinho com queijo muçarela abundante que derrete e estica até a última mordida, com toque suave de orégano.',
        price: 10.0,
        ingredients: ['Massa Crocante 67', 'Muçarela Abundante', 'Orégano'],
      },
      {
        id: 'pastel-costela',
        name: '5. Pastel de Costela',
        category: 'pasteis',
        description: 'O especial da casa! Recheado com bastante costela desfiada suculenta, douradinho, sequinho e crocante.',
        price: 18.0,
        popular: true,
        ingredients: ['Massa Crocante 67', 'Costela Desfiada Suculenta', 'Temperos da Casa'],
      },
    ],
  },
  {
    id: 'bebidas',
    label: 'Bebidas',
    emoji: '🥤',
    items: [
      {
        id: 'coca-350',
        name: 'Coca-Cola 350 ml',
        category: 'bebidas',
        description: 'Lata 350 ml trincando de gelada.',
        price: 6.0,
        popular: true,
      },
      {
        id: 'fanta-350',
        name: 'Fanta 350 ml',
        category: 'bebidas',
        description: 'Lata 350 ml bem gelada.',
        price: 5.5,
      },
      {
        id: 'guarana-350',
        name: 'Guaraná 350 ml',
        category: 'bebidas',
        description: 'Lata 350 ml bem gelada.',
        price: 5.5,
      },
      {
        id: 'kapo-200',
        name: 'Suco Kapo 200 ml',
        category: 'bebidas',
        description: 'Caixinha 200 ml geladinha, ideal para acompanhar seu lanche.',
        price: 4.0,
      },
      {
        id: 'agua-500',
        name: 'Água Mineral 500 ml',
        category: 'bebidas',
        description: 'Garrafa 500 ml bem gelada, com ou sem gás.',
        price: 4.0,
      },
      {
        id: 'coca-mini-info',
        name: 'Coca-Cola Mini 220 ml',
        category: 'bebidas',
        tag: 'Exclusiva dos Combos',
        description: 'Exclusiva dos nossos combos de Hot Dogs e Pastéis! Não vendida separadamente.',
        price: 0.0,
      },
    ],
  },
];

export const MENU_ITEMS: MenuItem[] = MENU_CATEGORIES.flatMap((c) => c.items);

export const ESTABLISHMENT_INFO = {
  name: '67 Dog',
  subname: 'Hot Dog & Pastel',
  tagline: 'Hot Dog com Vina & Pastel Frito na Hora',
  bio: 'Hot dog caprichado com vina e pastel frito na hora, no bairro Nações, em Fazenda Rio Grande. Bateu a fome? Vem de 67!',
  phone: '5541998802280',
  phoneDisplay: '(41) 99880-2280',
  address: 'Av. Estados Unidos, 389 - Nações, Fazenda Rio Grande - PR, 83823-114',
  mapsUrl: 'https://maps.google.com/?q=Av.+Estados+Unidos,+389+-+Nações,+Fazenda+Rio+Grande+-+PR,+83823-114',
  wazeUrl: 'https://waze.com/ul?q=Av.+Estados+Unidos,+389+-+Nações,+Fazenda+Rio+Grande+-+PR,+83823-114',
  instagram: 'https://instagram.com/67lanches',
  instagramDisplay: '@67lanches',
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
