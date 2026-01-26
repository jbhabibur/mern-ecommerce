import { User, UserPlus, Heart } from "lucide-react";

export const NAVIGATION_DATA_DESKTOP = [
  { id: 1, label: "Home", slug: "/" },
  { id: 2, label: "Dirty Boys", slug: "dirty-boys" },
  {
    id: 3,
    label: "❅WINTER WARDROBE❅",
    slug: "winter-25-26",
    hasArrow: true,
    children: [
      { label: "JACKET", slug: "jacket" },
      { label: "STREETWEAR JACKET", slug: "streetwear-jacket" },
      { label: "SWEATER", slug: "sweater" },
      { label: "SWEATSHIRT", slug: "sweatshirt" },
      { label: "T-SHIRT", slug: "t-shirt" },
      { label: "POLO", slug: "polo" },
      { label: "CASUAL COAT", slug: "casual-coat" },
      { label: "CASUAL SHIRT", slug: "casual-shirt" },
      { label: "SUIT/COAT/BLAZER", slug: "blazer-suit-coat" },
      { label: "FATUA", slug: "fatua" },
    ],
  },
  {
    id: 4,
    label: "Men Top",
    slug: "men-top",
    hasArrow: true,
    children: [
      {
        label: "Panjabi",
        slug: "panjabi",
        children: [
          { label: "Semi Fit", slug: "semi-fit" },
          { label: "Regular Fit", slug: "regular-fit" },
          { label: "Trendy Fit", slug: "trendy-fit" },
        ],
      },
      {
        label: "Shirt",
        slug: "shirt",
        children: [
          { label: "Formal Shirt", slug: "formal-shirt" },
          { label: "Casual Full Sleeve", slug: "trendy-fit-shirt" },
          { label: "Casual Short Sleeve", slug: "trendy-fit-short-sleeve" },
          { label: "Cuban Collar", slug: "cuban-collar" },
        ],
      },
      {
        label: "Polo",
        slug: "polo",
        children: [
          { label: "Full Sleeve", slug: "full-sleeve-polo" },
          { label: "Short Sleeve", slug: "short-sleeve-polo" },
        ],
      },
      {
        label: "T-Shirt",
        slug: "t-shirt",
        children: [
          { label: "Full Sleeve", slug: "full-sleeve-t-shirt" },
          { label: "Short Sleeve", slug: "short-sleeve-t-shirt" },
        ],
      },
      { label: "Fatua", slug: "fatua" },
      { label: "Bapari Shirt", slug: "bapari-shirt" },
    ],
  },
  {
    id: 5,
    label: "Men Bottom",
    slug: "men-bottom",
    hasArrow: true,
    children: [
      {
        label: "Pant",
        slug: "pant",
        children: [
          { label: "Jeans", slug: "jeans" },
          { label: "Gavardine", slug: "gavardine" },
          { label: "Formal", slug: "formal" },
        ],
      },
      {
        label: "Trousers",
        slug: "trousers",
        children: [
          { label: "Long Trousers", slug: "long-trousers" },
          { label: "Short Trousers", slug: "short-trousers" },
        ],
      },
      { label: "Pajama", slug: "pajama" },
      { label: "Joggers", slug: "joggers-pant" },
    ],
  },
  {
    id: 6,
    label: "Outerware",
    slug: "blazer-suit-coat",
    hasArrow: true,
    children: [
      { label: "Blazer", slug: "blazer" },
      { label: "Suit", slug: "suit" },
      { label: "Coat", slug: "coat" },
    ],
  },
  { id: 7, label: "Fragrance 30% OFF", slug: "fragrance" },
  {
    id: 8,
    label: "Accessories",
    slug: "accessories",
    hasArrow: true,
    children: [
      { label: "Belt", slug: "belt" },
      { label: "Tie", slug: "tie" },
      { label: "Woven Boxer", slug: "woven-boxer" },
      { label: "Underware", slug: "underware" },
      { label: "Fragrance", slug: "fragrance" },
    ],
  },
  { id: 9, label: "Gift Card", slug: "gift-card" },
  { id: 10, label: "Contact Us", slug: "contact-us" },
];

export const NAVIGATION_DATA_MOBILE = [
  { id: 1, label: "Home", slug: "/" },
  { id: 2, label: "Dirty Boys", slug: "dirty-boys" },
  {
    id: 3,
    label: "❅WINTER WARDROBE❅",
    slug: "winter-25-26", // Desktop slug-er sathe mil kora hoyeche
    hasArrow: true,
    children: [
      { label: "Go To ❅WINTER WARDROBE❅", slug: "winter-25-26" },
      { label: "JACKET", slug: "jacket" },
      { label: "STREETWEAR JACKET", slug: "streetwear-jacket" },
      { label: "SWEATER", slug: "sweater" },
      { label: "SWEATSHIRT", slug: "sweatshirt" },
      { label: "T-SHIRT", slug: "t-shirt" },
      { label: "POLO", slug: "polo" },
      { label: "CASUAL COAT", slug: "casual-coat" },
      { label: "CASUAL SHIRT", slug: "casual-shirt" },
      { label: "SUIT/COAT/BLAZER", slug: "blazer-suit-coat" }, // Adjusted
      { label: "FATUA", slug: "fatua" },
    ],
  },
  {
    id: 4,
    label: "Men Top",
    slug: "men-top",
    hasArrow: true,
    children: [
      {
        label: "Panjabi",
        slug: "panjabi",
        hasArrow: true,
        children: [
          { label: "Semi Fit", slug: "semi-fit" },
          { label: "Regular Fit", slug: "regular-fit" },
          { label: "Trendy Fit", slug: "trendy-fit" },
        ],
      },
      {
        label: "Shirt",
        slug: "shirt",
        hasArrow: true,
        children: [
          { label: "Formal Shirt", slug: "formal-shirt" },
          { label: "Casual Full Sleeve", slug: "trendy-fit-shirt" }, // Desktop slug follow kora hoyeche
          { label: "Casual Short Sleeve", slug: "trendy-fit-short-sleeve" }, // Desktop slug follow kora hoyeche
          { label: "Cuban Collar", slug: "cuban-collar" },
        ],
      },
      {
        label: "Polo",
        slug: "polo",
        hasArrow: true,
        children: [
          { label: "Full Sleeve", slug: "full-sleeve-polo" }, // Updated
          { label: "Short Sleeve", slug: "short-sleeve-polo" }, // Updated
        ],
      },
      {
        label: "T-Shirt",
        slug: "t-shirt",
        hasArrow: true,
        children: [
          { label: "Full Sleeve", slug: "full-sleeve-t-shirt" }, // Updated
          { label: "Short Sleeve", slug: "short-sleeve-t-shirt" }, // Updated
        ],
      },
      { label: "Fatua", slug: "fatua" },
      { label: "Bapari Shirt", slug: "bapari-shirt" },
    ],
  },
  {
    id: 5,
    label: "Men Bottom",
    slug: "men-bottom",
    hasArrow: true,
    children: [
      {
        label: "Pant",
        slug: "pant",
        hasArrow: true,
        children: [
          { label: "Jeans", slug: "jeans" },
          { label: "Gavardine", slug: "gavardine" },
          { label: "Formal", slug: "formal" },
        ],
      },
      {
        label: "Trousers",
        slug: "trousers",
        hasArrow: true,
        children: [
          { label: "Long Trousers", slug: "long-trousers" },
          { label: "Short Trousers", slug: "short-trousers" },
        ],
      },
      { label: "Pajama", slug: "pajama" },
      { label: "Joggers", slug: "joggers-pant" }, // Desktop follow kora hoyeche
    ],
  },
  {
    id: 6,
    label: "Outerware",
    slug: "blazer-suit-coat", // Desktop follow kora hoyeche
    hasArrow: true,
    children: [
      { label: "Blazer", slug: "blazer" },
      { label: "Suit", slug: "suit" },
      { label: "Coat", slug: "coat" },
    ],
  },
  { id: 7, label: "Fragrance 30% OFF", slug: "fragrance" }, // Slug updated
  {
    id: 8,
    label: "Accessories",
    slug: "accessories",
    hasArrow: true,
    children: [
      { label: "Belt", slug: "belt" },
      { label: "Tie", slug: "tie" },
      { label: "Woven Boxer", slug: "woven-boxer" },
      { label: "Underware", slug: "underware" },
      { label: "Fragrance", slug: "fragrance" },
    ],
  },
  { id: 9, label: "Gift Card", slug: "gift-card" },
  { id: 10, label: "Contact Us", slug: "contact-us" },
  {
    id: 11,
    label: "Sign In",
    slug: "login",
    isCapital: false,
    icon: User,
    isBold: false,
  },
  {
    id: 12,
    label: "Create an Account",
    slug: "register",
    isCapital: false,
    icon: UserPlus,
    isBold: false,
  },
  {
    id: 13,
    label: "My Wish List",
    slug: "wishlist",
    isCapital: false,
    icon: Heart,
    isBold: false,
  },
];
