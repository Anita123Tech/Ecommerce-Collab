const products = {
  bridal: [
    { name: "Red Embroidered Lehenga", fabric: "Silk | Zari Work", price: 45999, image: "images/bridal-1.webp", hover: "images/bridal-2.webp", colors: ["#CC0000", "#8B0000", "#DAA520"] },
    { name: "Gold Tissue Sharara", fabric: "Organza | Silk Blend", price: 38999, image: "images/bridal-2.webp", hover: "images/bridal-3.webp", colors: ["#DAA520", "#FFD700", "#8B4513"] },
    { name: "Green Bridal Lehenga", fabric: "Silk | Embroidered", price: 42999, image: "images/bridal-3.webp", hover: "images/bridal-4.webp", colors: ["#006400", "#228B22", "#DAA520"] },
    { name: "Pastel Pink Sharara", fabric: "Chiffon | Floral Work", price: 35999, image: "images/bridal-4.webp", hover: "images/bridal-5.webp", colors: ["#FFB6C1", "#FFC0CB", "#FFF0F5"] },
    { name: "Maroon Velvet Gharara", fabric: "Velvet | Gold Embroidery", price: 49999, image: "images/bridal-5.webp", hover: "images/bridal-6.webp", colors: ["#800020", "#4A0404", "#DAA520"] },
    { name: "Dusty Rose Lehenga", fabric: "Raw Silk | Handwork", price: 47999, image: "images/bridal-6.webp", hover: "images/bridal-7.webp", colors: ["#D2B48C", "#DEB887", "#BC8F8F"] },
    { name: "Navy Blue Bridal Suit", fabric: "Jamawar | Handwoven", price: 54999, image: "images/bridal-7.webp", hover: "images/bridal-8.webp", colors: ["#191970", "#000080", "#DAA520"] },
    { name: "Ivory Net Lehenga", fabric: "Net | Silk Blend", price: 59999, image: "images/bridal-8.webp", hover: "images/bridal-1.webp", colors: ["#FFFFF0", "#FDF5E6", "#E8D5B7"] }
  ],
  daily: [
    { name: "Embroidered Lawn Suit", fabric: "Premium Lawn | Digital Print", price: 3499, image: "https://i.pinimg.com/736x/de/5a/55/de5a55f977a1c20f7e13697f97492aee.jpg", hover: "https://i.pinimg.com/736x/18/9d/87/189d877a738a53a3615455c95737f356.jpg", colors: ["#FFB6C1", "#98FB98", "#87CEEB"] },
    { name: "Chiffon Embroidered Kurta", fabric: "Chiffon | Hand Embroidered", price: 4299, image: "https://i.pinimg.com/736x/18/9d/87/189d877a738a53a3615455c95737f356.jpg", hover: "https://i.pinimg.com/736x/ab/6e/1c/ab6e1ccbf11eeb35e270248038471ce0.jpg", colors: ["#FFF0F5", "#E6E6FA", "#F5FFFA"] },
    { name: "Cotton Printed 3-Piece", fabric: "Cotton | Digital Printed", price: 2799, image: "https://i.pinimg.com/736x/ab/6e/1c/ab6e1ccbf11eeb35e270248038471ce0.jpg", hover: "https://i.pinimg.com/736x/78/0c/07/780c073d5fa127131fa5b42ae9b29557.jpg", colors: ["#FFE4B5", "#FFDAB9", "#E6E6FA"] },
    { name: "Khaddar Kurti & Trousers", fabric: "Khaddar | Handloom", price: 2199, image: "https://i.pinimg.com/736x/78/0c/07/780c073d5fa127131fa5b42ae9b29557.jpg", hover: "https://i.pinimg.com/736x/b8/3a/d1/b83ad1204280d5a4295901633f7b632b.jpg", colors: ["#D2B48C", "#DEB887", "#BC8F8F"] },
    { name: "Lawn Unstitched 3-Piece", fabric: "Premium Lawn | Unstitched", price: 3299, image: "https://i.pinimg.com/736x/b8/3a/d1/b83ad1204280d5a4295901633f7b632b.jpg", hover: "https://i.pinimg.com/736x/30/0d/57/300d5751315566c5bc507386e9aafa75.jpg", colors: ["#FFB6C1", "#FF69B4", "#DB7093"] },
    { name: "Silk Straight Kurta", fabric: "Silk Blend | Embroidered", price: 4999, image: "https://i.pinimg.com/736x/30/0d/57/300d5751315566c5bc507386e9aafa75.jpg", hover: "https://i.pinimg.com/1200x/72/a1/ef/72a1ef2fdf2b79859a98a53cb401751d.jpg", colors: ["#FFFFF0", "#F5F5DC", "#E8D5B7"] },
    { name: "Organza 3-Piece Suit", fabric: "Organza | Digital Print", price: 5499, image: "https://i.pinimg.com/1200x/72/a1/ef/72a1ef2fdf2b79859a98a53cb401751d.jpg", hover: "https://i.pinimg.com/1200x/63/35/97/63359794b67897e2d5231151b7753685.jpg", colors: ["#F0E68C", "#BDB76B", "#EEE8AA"] },
    { name: "Cambric Palazzo Suit", fabric: "Cambric | Relaxed Fit", price: 2999, image: "https://i.pinimg.com/1200x/63/35/97/63359794b67897e2d5231151b7753685.jpg", hover: "https://i.pinimg.com/736x/de/5a/55/de5a55f977a1c20f7e13697f97492aee.jpg", colors: ["#B0E0E6", "#AFEEEE", "#D8BFD8"] }
  ],
  summer: [
    { name: "Lawn 3-Piece Suit", fabric: "Premium Lawn | Unstitched", price: 5499, image: "images/summer-1.webp", hover: "images/summer-2.webp", colors: ["#FFB6C1", "#98FB98", "#87CEEB"] },
    { name: "Digital Print Lawn", fabric: "Textured Lawn | Printed", price: 4499, image: "images/summer-2.webp", hover: "images/summer-3.webp", colors: ["#FFD700", "#FFA500", "#FF6347"] },
    { name: "Embroidered Lawn Kurti", fabric: "Lawn | Thread Embroidered", price: 3299, image: "images/summer-3.webp", hover: "images/summer-4.webp", colors: ["#F0E68C", "#BDB76B", "#EEE8AA"] },
    { name: "Cotton Lawn Suit", fabric: "Cotton Dobby | Breathable", price: 3999, image: "images/summer-4.webp", hover: "images/summer-5.webp", colors: ["#E0FFFF", "#F0FFFF", "#F5FFFA"] },
    { name: "Printed Lawn Dupatta", fabric: "Chiffon Lawn | Lightweight", price: 2499, image: "images/summer-5.webp", hover: "images/summer-6.webp", colors: ["#FFC0CB", "#FFE4E1", "#FFF0F5"] },
    { name: "Solid Lawn Kurta", fabric: "Lawn | Solid Color", price: 2199, image: "images/summer-6.webp", hover: "images/summer-7.webp", colors: ["#FFFFFF", "#F8F8FF", "#FFFAFA"] },
    { name: "Floral Print Suit", fabric: "Cotton Lawn | Floral", price: 3799, image: "images/summer-7.webp", hover: "images/summer-8.webp", colors: ["#FFB6C1", "#FF69B4", "#DB7093"] },
    { name: "Linen Straight Suit", fabric: "Linen Blend | Summer", price: 4999, image: "images/summer-8.webp", hover: "images/summer-1.webp", colors: ["#F5DEB3", "#DEB887", "#D2B48C"] }
  ],
  sale: [
    { name: "Embroidered Lawn Suit", fabric: "Premium Lawn | Digital Print", price: 3499, originalPrice: 6999, image: "images/sale-1.webp", hover: "images/sale-2.webp", colors: ["#FFB6C1", "#98FB98", "#87CEEB"] },
    { name: "Chiffon Embroidered Kurta", fabric: "Chiffon | Hand Embroidered", price: 4299, originalPrice: 8599, image: "images/sale-2.webp", hover: "images/sale-3.webp", colors: ["#FFF0F5", "#E6E6FA", "#F5FFFA"] },
    { name: "Cotton Printed 3-Piece", fabric: "Cotton | Digital Printed", price: 2799, originalPrice: 5599, image: "images/sale-3.webp", hover: "images/sale-4.webp", colors: ["#FFE4B5", "#FFDAB9", "#E6E6FA"] },
    { name: "Khaddar Kurti & Trousers", fabric: "Khaddar | Handloom", price: 2199, originalPrice: 4399, image: "images/sale-4.webp", hover: "images/sale-5.webp", colors: ["#D2B48C", "#DEB887", "#BC8F8F"] },
    { name: "Lawn Unstitched 3-Piece", fabric: "Premium Lawn | Unstitched", price: 3299, originalPrice: 6599, image: "images/sale-5.webp", hover: "images/sale-6.webp", colors: ["#FFB6C1", "#FF69B4", "#DB7093"] },
    { name: "Silk Straight Kurta", fabric: "Silk Blend | Embroidered", price: 4999, originalPrice: 9999, image: "images/sale-6.webp", hover: "images/sale-7.webp", colors: ["#FFFFF0", "#F5F5DC", "#E8D5B7"] },
    { name: "Organza 3-Piece Suit", fabric: "Organza | Digital Print", price: 5499, originalPrice: 10999, image: "images/sale-7.webp", hover: "images/sale-1.webp", colors: ["#F0E68C", "#BDB76B", "#EEE8AA"] },
    { name: "Cambric Palazzo Suit", fabric: "Cambric | Relaxed Fit", price: 2999, originalPrice: 5999, image: "images/sale-1.webp", hover: "images/sale-2.webp", colors: ["#B0E0E6", "#AFEEEE", "#D8BFD8"] }
  ],
  kids: [
    { name: "Kids Shalwar Kameez", fabric: "Cotton | Comfort Fit", price: 1999, image: "images/new-1.webp", hover: "images/new-2.webp", colors: ["#4169E1", "#32CD32", "#FF4500"] },
    { name: "Girls Embroidered Frock", fabric: "Chiffon | Party Wear", price: 2499, image: "images/new-2.webp", hover: "images/new-3.webp", colors: ["#FFB6C1", "#FF69B4", "#DDA0DD"] },
    { name: "Boys Kurta Pajama", fabric: "Khaddar | Traditional", price: 1799, image: "images/new-3.webp", hover: "images/new-4.webp", colors: ["#FFFFFF", "#F5F5DC", "#E0E0E0"] },
    { name: "Kids 3-Piece Suit", fabric: "Lawn | Printed Set", price: 2999, image: "images/new-4.webp", hover: "images/new-5.webp", colors: ["#87CEEB", "#98FB98", "#FFD700"] },
    { name: "Baby Girl Frock Set", fabric: "Cotton | Soft Touch", price: 1599, image: "images/new-5.webp", hover: "images/new-6.webp", colors: ["#FFB6C1", "#FFC0CB", "#FFF0F5"] },
    { name: "Kids Waistcoat Suit", fabric: "Velvet | Festive", price: 3499, image: "images/new-6.webp", hover: "images/new-7.webp", colors: ["#800020", "#191970", "#006400"] },
    { name: "Girls Lehenga Choli", fabric: "Silk | Embroidered", price: 3999, image: "images/new-7.webp", hover: "images/new-8.webp", colors: ["#FF1493", "#FF69B4", "#DAA520"] },
    { name: "Toddler Shalwar Kameez", fabric: "Cotton Lawn | Soft", price: 1299, image: "images/new-8.webp", hover: "images/new-1.webp", colors: ["#87CEEB", "#98FB98", "#FFD700"] }
  ]
};
