export interface MenuItem {
  id: string;
  name: string;
  category?: 'hotdogs' | 'pasteis' | 'combos' | 'bebidas' | string;
  description: string;
  price: number;
  tag?: string;
  image?: string;
  popular?: boolean;
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
  { id: 'extra-bacon', name: 'Bacon Crocante em Cubos', price: 4.0 },
  { id: 'extra-cheddar', name: 'Cheddar Cremoso Extra', price: 4.0 },
  { id: 'extra-catupiry', name: 'Catupiry® Original Cremoso', price: 4.0 },
  { id: 'extra-salsicha', name: 'Salsicha Premium Adicional', price: 3.0 },
  { id: 'extra-ovo', name: 'Ovo Frito na Chapa', price: 3.5 },
  { id: 'extra-pure', name: 'Purê de Batata Especial', price: 3.0 },
  { id: 'extra-mussarela', name: 'Muçarela Derretida Dobrada', price: 4.0 },
  { id: 'extra-batata', name: 'Batata Palha Extra', price: 2.5 },
];

export const AVAILABLE_REMOVALS: RemovalOption[] = [
  { id: 'no-cebola', name: 'Sem Cebola' },
  { id: 'no-milho', name: 'Sem Milho' },
  { id: 'no-batata-palha', name: 'Sem Batata Palha' },
  { id: 'no-maionese', name: 'Sem Maionese da Casa' },
  { id: 'no-pure', name: 'Sem Purê de Batata' },
  { id: 'no-molho', name: 'Sem Molho Especial' },
  { id: 'no-queijo-ralado', name: 'Sem Queijo Ralado' },
  { id: 'no-ervilha', name: 'Sem Ervilha' },
];

export interface MenuCategory {
  id: string;
  label: string;
  emoji: string;
  items: MenuItem[];
}

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'hotdogs',
    label: 'Hot Dogs',
    emoji: '🌭',
    items: [
      {
        id: 'dog-classico',
        name: '67 Clássico',
        category: 'hotdogs',
        description: 'Salsicha premium, milho, batata palha, queijo ralado e molho especial da casa.',
        price: 14,
      },
      {
        id: 'dog-duplo',
        name: 'Six Seven Duplo',
        category: 'hotdogs',
        description: 'Duas salsichas, queijo cheddar derretido, bacon crocante, milho e batata palha.',
        price: 19,
        tag: 'Mais pedido',
        popular: true,
      },
      {
        id: 'dog-bacon',
        name: 'Dog Bacon Explosion',
        category: 'hotdogs',
        description: 'Salsicha envolvida em bacon, cheddar cremoso, cebola caramelizada e barbecue.',
        price: 21,
      },
      {
        id: 'dog-frango',
        name: 'Dog Frango Cremoso',
        category: 'hotdogs',
        description: 'Frango desfiado cremoso com catupiry, milho, batata palha e orégano.',
        price: 17,
      },
      {
        id: 'dog-calabresa',
        name: 'Dog Calabresa Acebolada',
        category: 'hotdogs',
        description: 'Calabresa fatiada na chapa com cebola, molho de tomate caseiro e batata palha.',
        price: 16,
      },
      {
        id: 'dog-veg',
        name: 'Dog Veggie',
        category: 'hotdogs',
        description: 'Salsicha vegetal, milho, ervilha, cenoura, batata palha e maionese da casa.',
        price: 15,
      },
    ],
  },
  {
    id: 'pasteis',
    label: 'Pastéis Crocantes',
    emoji: '🥟',
    items: [
      {
        id: 'pastel-queijo',
        name: 'Pastel de Queijo',
        category: 'pasteis',
        description: 'Massa crocante recheada com muito queijo muçarela derretido.',
        price: 10,
      },
      {
        id: 'pastel-carne',
        name: 'Pastel de Carne',
        category: 'pasteis',
        description: 'Carne moída temperada com acebolado, azeitona e ovo.',
        price: 11,
      },
      {
        id: 'pastel-frango',
        name: 'Pastel de Frango c/ Catupiry',
        category: 'pasteis',
        description: 'Frango desfiado suculento com catupiry original.',
        price: 12,
        tag: 'Favorito',
        popular: true,
      },
      {
        id: 'pastel-pizza',
        name: 'Pastel de Pizza',
        category: 'pasteis',
        description: 'Muçarela, presunto, tomate e orégano.',
        price: 12,
      },
      {
        id: 'pastel-doce',
        name: 'Pastel Doce de Banana',
        category: 'pasteis',
        description: 'Banana caramelizada com canela e açúcar, massa extra crocante.',
        price: 9,
      },
    ],
  },
  {
    id: 'combos',
    label: 'Combos',
    emoji: '🔥',
    items: [
      {
        id: 'combo-67',
        name: 'Combo 67',
        category: 'combos',
        description: '1 Six Seven Duplo + 1 pastel de queijo + refrigerante lata.',
        price: 32,
        tag: 'Economize',
        popular: true,
      },
      {
        id: 'combo-casal',
        name: 'Combo Casal',
        category: 'combos',
        description: '2 hot dogs clássicos + 2 pastéis + 2 refrigerantes lata.',
        price: 49,
      },
      {
        id: 'combo-familia',
        name: 'Combo Família',
        category: 'combos',
        description: '4 hot dogs clássicos + 4 pastéis sortidos + refrigerante 2L.',
        price: 89,
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
        name: 'Refrigerante Lata',
        category: 'bebidas',
        description: 'Coca-Cola, Guaraná, Fanta ou Sprite — 350ml gelado.',
        price: 6,
      },
      {
        id: 'refri-2l',
        name: 'Refrigerante 2L',
        category: 'bebidas',
        description: 'Coca-Cola ou Guaraná — garrafa 2 litros.',
        price: 14,
      },
      {
        id: 'suco',
        name: 'Suco Natural',
        category: 'bebidas',
        description: 'Laranja, maracujá ou limão — copo 500ml feito na hora.',
        price: 8,
      },
      {
        id: 'agua',
        name: 'Água Mineral',
        category: 'bebidas',
        description: 'Garrafa 500ml, com ou sem gás.',
        price: 4,
      },
    ],
  },
  {
    id: 'adicionais',
    label: 'Adicionais',
    emoji: '➕',
    items: [
      {
        id: 'add-bacon',
        name: 'Bacon Extra',
        category: 'adicionais',
        description: 'Porção generosa de bacon crocante.',
        price: 4,
      },
      {
        id: 'add-cheddar',
        name: 'Cheddar Extra',
        category: 'adicionais',
        description: 'Cheddar cremoso derretido.',
        price: 4,
      },
      {
        id: 'add-salsicha',
        name: 'Salsicha Extra',
        category: 'adicionais',
        description: 'Uma salsicha premium a mais no seu dog.',
        price: 3,
      },
      {
        id: 'add-catupiry',
        name: 'Catupiry',
        category: 'adicionais',
        description: 'Catupiry original cremoso.',
        price: 4,
      },
    ],
  },
];

export const MENU_ITEMS: MenuItem[] = MENU_CATEGORIES.flatMap((c) => c.items);

export const ESTABLISHMENT_INFO = {
  name: '67 Dog',
  subname: 'Six Seven Hot Dog',
  tagline: 'Hot Dogs Especiais & Pastéis Crocantes',
  bio: 'O melhor Hot Dog da região e pastéis recheados de verdade. Pão fresquinho, fritura sequinha e sabor incomparável!',
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
