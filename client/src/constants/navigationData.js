import { User, UserPlus, Heart } from "lucide-react";

export const NAVIGATION_DATA_DESKTOP = [
  { id: 1, label: "Home" },
  { id: 2, label: "Dirty Boys" },
  {
    id: 3,
    label: "❅WINTER WARDROBE❅",
    hasArrow: true,
    children: [
      { label: "JACKET" },
      { label: "STREETWEAR JACKET" },
      { label: "SWEATER" },
      { label: "SWEATSHIRT" },
      { label: "T-SHIRT" },
      { label: "POLO" },
      { label: "CASUAL COAT" },
      { label: "CASUAL SHIRT" },
      { label: "SUIT/COAT/BLAZER" },
      { label: "FATUA" },
    ],
  },
  {
    id: 4,
    label: "Men Top",
    hasArrow: true,
    children: [
      {
        label: "Panjabi",
        children: [
          { label: "Semi Fit" },
          { label: "Regular Fit" },
          { label: "Trendy Fit" },
        ],
      },
      {
        label: "Shirt",
        children: [
          { label: "Formal Shirt" },
          { label: "Casual Full Sleeve" },
          { label: "Casual Short Sleeve" },
          { label: "Cuban Collar" },
        ],
      },
      {
        label: "Polo",
        children: [{ label: "Full Sleeve" }, { label: "Short Sleeve" }],
      },
      {
        label: "T-Shirt",
        children: [{ label: "Full Sleeve" }, { label: "Short Sleeve" }],
      },
      { label: "Fatua" },
      { label: "Bapari Shirt" },
    ],
  },
  {
    id: 5,
    label: "Men Bottom",
    hasArrow: true,
    children: [
      {
        label: "Pant",
        children: [
          { label: "Jeans" },
          { label: "Gavardine" },
          { label: "Formal" },
        ],
      }, // Example sub-child
      {
        label: "Trousers",
        children: [{ label: "Long Trousers" }, { label: "Short Trousers" }],
      },
      { label: "Pajama" },
      { label: "Joggers" },
    ],
  },
  {
    id: 6,
    label: "Outerware",
    hasArrow: true,
    children: [{ label: "Blazer" }, { label: "Suit" }, { label: "Coat" }],
  },
  { id: 7, label: "Fragrance 30% OFF" },
  {
    id: 8,
    label: "Accessories",
    hasArrow: true,
    children: [
      { label: "Belt" },
      { label: "Tie" },
      { label: "Woven Boxer" },
      { label: "Underware" },
      { label: "Fragrance" },
    ],
  },
  { id: 9, label: "Gift Card" },
  { id: 10, label: "Contact Us" },
];

export const NAVIGATION_DATA_MOBILE = [
  { id: 1, label: "Home" },
  { id: 2, label: "Dirty Boys" },
  {
    id: 3,
    label: "❅WINTER WARDROBE❅",
    hasArrow: true,
    children: [
      { label: "Go To ❅WINTER WARDROBE❅" },
      { label: "JACKET" },
      { label: "STREETWEAR JACKET" },
      { label: "SWEATER" },
      { label: "SWEATSHIRT" },
      { label: "T-SHIRT" },
      { label: "POLO" },
      { label: "CASUAL COAT" },
      { label: "CASUAL SHIRT" },
      { label: "SUIT/COAT/BLAZER" },
      { label: "FATUA" },
    ],
  },
  {
    id: 4,
    label: "Men Top",
    hasArrow: true,
    children: [
      {
        label: "Panjabi",
        hasArrow: true,
        children: [
          { label: "Semi Fit" },
          { label: "Regular Fit" },
          { label: "Trendy Fit" },
        ],
      },
      {
        label: "Shirt",
        hasArrow: true,
        children: [
          { label: "Formal Shirt" },
          { label: "Casual Full Sleeve" },
          { label: "Casual Short Sleeve" },
          { label: "Cuban Collar" },
        ],
      },
      {
        label: "Polo",
        hasArrow: true,
        children: [{ label: "Full Sleeve" }, { label: "Short Sleeve" }],
      },
      {
        label: "T-Shirt",
        children: [{ label: "Full Sleeve" }, { label: "Short Sleeve" }],
      },
      { label: "Fatua" },
      { label: "Bapari Shirt" },
    ],
  },
  { id: 5, label: "Men Bottom", hasArrow: true, children: [] },
  { id: 6, label: "Outerware", hasArrow: true, children: [] },
  { id: 7, label: "Fragrance 30% OFF" },
  { id: 8, label: "Accessories", hasArrow: true, children: [] },
  { id: 9, label: "Gift Card" },
  { id: 10, label: "Contact Us" },
  { id: 11, label: "Sign In", isCapital: false, icon: User, isBold: false },
  {
    id: 12,
    label: "Create an Account",
    isCapital: false,
    icon: UserPlus,
    isBold: false,
  },
  {
    id: 13,
    label: "My Wish List",
    isCapital: false,
    icon: Heart,
    isBold: false,
  },
];
