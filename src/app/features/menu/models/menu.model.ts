export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: MenuCategory;
  price: number;
  sizes: DrinkSize[];
  available: boolean;
  imageUrl?: string;
  ingredients: string[];
  calories: number;
  prepTime: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

export enum MenuCategory {
  COFFEE = 'COFFEE',
  ESPRESSO = 'ESPRESSO',
  TEA = 'TEA',
  BLENDED = 'BLENDED',
  PASTRIES = 'PASTRIES',
  SNACKS = 'SNACKS',
}

export interface DrinkSize {
  name: 'Small' | 'Medium' | 'Large';
  price: number;
  ounces: number;
}

export interface CreateMenuItemDto {
  name: string;
  description: string;
  category: MenuCategory;
  price: number;
  sizes: DrinkSize[];
  ingredients: string[];
  calories: number;
  prepTime: number;
}

export interface UpdateMenuItemDto extends Partial<CreateMenuItemDto> {
  available?: boolean;
}
