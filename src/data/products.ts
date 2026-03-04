export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  ageGroup: string;
  badge?: string;
  rating: number;
  colors?: string[];
  sizes?: string[];
  description?: string;
  images?: string[];
}

export const products: Product[] = [
  { id: "1", title: "Rainbow Stacking Rings", price: 14.99, originalPrice: 19.99, image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop", category: "Toys", brand: "PlayTime", ageGroup: "0-2", badge: "Sale", rating: 4.8, colors: ["#FF6B6B", "#4ECDC4", "#FFE66D"], description: "Colorful stacking rings for developing motor skills." },
  { id: "2", title: "Wooden Building Blocks", price: 24.99, image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop", category: "Toys", brand: "WoodCraft", ageGroup: "2-4", rating: 4.9, colors: ["#FF6B6B", "#4ECDC4"], description: "Premium wooden blocks for creative building." },
  { id: "3", title: "RC Monster Truck", price: 49.99, originalPrice: 64.99, image: "https://images.unsplash.com/photo-1581235707960-35f13de9805f?w=400&h=400&fit=crop", category: "RC Cars", brand: "SpeedKing", ageGroup: "6-8", badge: "Hot", rating: 4.7, description: "High-speed remote control monster truck." },
  { id: "4", title: "Kids Denim Jacket", price: 34.99, image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=400&fit=crop", category: "Clothes", brand: "TinyFashion", ageGroup: "4-6", rating: 4.5, sizes: ["2T", "3T", "4T", "5T"], description: "Stylish denim jacket for little ones." },
  { id: "5", title: "Adventure Story Book Set", price: 19.99, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop", category: "Books", brand: "StoryLand", ageGroup: "4-6", badge: "New", rating: 4.6, description: "A set of 5 adventure story books." },
  { id: "6", title: "Plush Teddy Bear", price: 22.99, originalPrice: 29.99, image: "https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=400&h=400&fit=crop", category: "Gifts", brand: "CuddlePals", ageGroup: "0-2", badge: "Sale", rating: 4.9, description: "Super soft plush teddy bear." },
  { id: "7", title: "Art & Craft Kit", price: 29.99, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop", category: "Gifts", brand: "CreativeKids", ageGroup: "6-8", rating: 4.4, description: "Complete art and craft supply kit." },
  { id: "8", title: "Musical Xylophone", price: 18.99, image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop", category: "Toys", brand: "MelodyMakers", ageGroup: "2-4", badge: "Popular", rating: 4.7, description: "Colorful xylophone with 8 notes." },
];

export const categories = [
  { name: "Toys", icon: "🧸", color: "toy-orange", count: 156 },
  { name: "Clothes", icon: "👕", color: "toy-cyan", count: 89 },
  { name: "Gifts", icon: "🎁", color: "toy-purple", count: 64 },
  { name: "RC Cars", icon: "🏎️", color: "toy-red", count: 42 },
];
