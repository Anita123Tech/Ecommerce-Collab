const products = {
  bridal: [
    { name: "Red Bridal Lehenga", fabric: "Zari Tissue | Silk", price: 45999, image: "images/bridal-1.jpg", hover: "images/bridal-2.jpg", colors: ["#CC0000", "#8B0000", "#DAA520"] },
    { name: "Gold Embroidered Sharara", fabric: "Organza | Silk", price: 38999, image: "images/bridal-2.jpg", hover: "images/bridal-3.jpg", colors: ["#DAA520", "#FFD700", "#8B4513"] },
    { name: "Maroon Gharara Set", fabric: "Jamawar | Silk", price: 32999, image: "images/bridal-3.jpg", hover: "images/bridal-4.jpg", colors: ["#800020", "#4A0404"] },
    { name: "Pearl Bridal Dupatta", fabric: "Chiffon | Hand-Embroidered", price: 18999, image: "images/bridal-4.jpg", hover: "images/bridal-1.jpg", colors: ["#FFFFF0", "#F5F5DC", "#E8D5B7"] },
    { name: "Ivory Bridal Maxi", fabric: "Net | Silk Blend", price: 54999, image: "images/summer-1.jpg", hover: "images/summer-2.jpg", colors: ["#FFFFF0", "#FDF5E6"] },
    { name: "Pink Bridal Gown", fabric: "Raw Silk | Embroidered", price: 41999, image: "images/summer-2.jpg", hover: "images/summer-3.jpg", colors: ["#FFB6C1", "#FF69B4", "#DB7093"] },
    { name: "Embroidered Bridal Kurti", fabric: "Velvet | Gold Work", price: 25999, image: "images/summer-3.jpg", hover: "images/summer-4.jpg", colors: ["#800020", "#006400", "#191970"] },
    { name: "Bridal Boutique Suit", fabric: "Jamawar | Handwoven", price: 59999, image: "images/summer-4.jpg", hover: "images/summer-1.jpg", colors: ["#DAA520", "#800020", "#006400"] }
  ],
  daily: [
    { name: "Cotton Shalwar Kameez", fabric: "Premium Cotton | Cambric", price: 3499, image: "images/daily-1.jpg", hover: "images/daily-2.jpg", colors: ["#FFFFFF", "#F5F5DC", "#B0C4DE"] },
    { name: "Khaddar Kurti Pants", fabric: "Khaddar | Handloom", price: 2899, image: "images/daily-2.jpg", hover: "images/daily-3.jpg", colors: ["#D2B48C", "#DEB887", "#BC8F8F"] },
    { name: "Printed 3-Piece Suit", fabric: "Cambric | Digital Print", price: 4499, image: "images/daily-3.jpg", hover: "images/daily-4.jpg", colors: ["#FFB6C1", "#98FB98", "#87CEEB"] },
    { name: "Casual Kurta Dupatta", fabric: "Cotton Viscose | Blend", price: 2499, image: "images/daily-4.jpg", hover: "images/daily-1.jpg", colors: ["#F0FFF0", "#FFF0F5", "#F5FFFA"] },
    { name: "Embroidered Straight Kurta", fabric: "Cotton Silk | Thread Work", price: 3999, image: "images/hero-bridal.jpg", hover: "images/hero-daily.jpg", colors: ["#FFE4B5", "#FFDAB9", "#E6E6FA"] },
    { name: "Palazzo Pant Suit", fabric: "Cambric | Relaxed Fit", price: 3299, image: "images/hero-daily.jpg", hover: "images/hero-summer.jpg", colors: ["#B0E0E6", "#AFEEEE", "#D8BFD8"] },
    { name: "Digital Print Kurta", fabric: "Lawn | Summer Weight", price: 2799, image: "images/hero-summer.jpg", hover: "images/banner-daily.jpg", colors: ["#FFFACD", "#E0FFFF", "#F0E68C"] },
    { name: "Trouser Suit Formal", fabric: "Cotton Dobby | Structured", price: 4999, image: "images/banner-daily.jpg", hover: "images/hero-bridal.jpg", colors: ["#708090", "#778899", "#A9A9A9"] }
  ],
  summer: [
    { name: "Lawn 3-Piece Suit", fabric: "Premium Lawn | Unstitched", price: 5499, image: "images/bridal-1.jpg", hover: "images/bridal-2.jpg", colors: ["#FFB6C1", "#98FB98", "#87CEEB"] },
    { name: "Digital Print Lawn", fabric: "Textured Lawn | Printed", price: 4499, image: "images/bridal-2.jpg", hover: "images/bridal-3.jpg", colors: ["#FFD700", "#FFA500", "#FF6347"] },
    { name: "Embroidered Lawn Kurti", fabric: "Lawn | Thread Embroidered", price: 3299, image: "images/bridal-3.jpg", hover: "images/bridal-4.jpg", colors: ["#F0E68C", "#BDB76B", "#EEE8AA"] },
    { name: "Cotton Lawn Suit", fabric: "Cotton Dobby | Breathable", price: 3999, image: "images/bridal-4.jpg", hover: "images/bridal-1.jpg", colors: ["#E0FFFF", "#F0FFFF", "#F5FFFA"] },
    { name: "Printed Lawn Dupatta", fabric: "Chiffon Lawn | Lightweight", price: 2499, image: "images/banner-kids.jpg", hover: "images/kids-4.jpg", colors: ["#FFC0CB", "#FFE4E1", "#FFF0F5"] },
    { name: "Solid Lawn Kurta", fabric: "Lawn | Solid Color", price: 2199, image: "images/kids-4.jpg", hover: "images/kids-3.jpg", colors: ["#FFFFFF", "#F8F8FF", "#FFFAFA"] },
    { name: "Floral Print Suit", fabric: "Cotton Lawn | Floral", price: 3799, image: "images/kids-3.jpg", hover: "images/kids-2.jpg", colors: ["#FFB6C1", "#FF69B4", "#DB7093"] },
    { name: "Linen Straight Suit", fabric: "Linen Blend | Summer", price: 4999, image: "images/kids-2.jpg", hover: "images/kids-1.jpg", colors: ["#F5DEB3", "#DEB887", "#D2B48C"] }
  ],
  sale: [
    { name: "Embroidered Lawn Suit", fabric: "Premium Lawn | Digital Print", price: 3499, originalPrice: 6999, image: "images/sale-1.jpg", hover: "images/sale-2.jpg", colors: ["#FFB6C1", "#98FB98", "#87CEEB"] },
    { name: "Chiffon Embroidered Kurta", fabric: "Chiffon | Hand Embroidered", price: 4299, originalPrice: 8599, image: "images/sale-2.jpg", hover: "images/sale-3.jpg", colors: ["#FFF0F5", "#E6E6FA", "#F5FFFA"] },
    { name: "Cotton Printed 3-Piece", fabric: "Cotton | Digital Printed", price: 2799, originalPrice: 5599, image: "images/sale-3.jpg", hover: "images/sale-4.jpg", colors: ["#FFE4B5", "#FFDAB9", "#E6E6FA"] },
    { name: "Khaddar Kurti & Trousers", fabric: "Khaddar | Handloom", price: 2199, originalPrice: 4399, image: "images/sale-4.jpg", hover: "images/sale-5.jpg", colors: ["#D2B48C", "#DEB887", "#BC8F8F"] },
    { name: "Lawn Unstitched 3-Piece", fabric: "Premium Lawn | Unstitched", price: 3299, originalPrice: 6599, image: "images/sale-5.jpg", hover: "images/sale-6.jpg", colors: ["#FFB6C1", "#FF69B4", "#DB7093"] },
    { name: "Silk Straight Kurta", fabric: "Silk Blend | Embroidered", price: 4999, originalPrice: 9999, image: "images/sale-6.jpg", hover: "images/sale-7.jpg", colors: ["#FFFFF0", "#F5F5DC", "#E8D5B7"] },
    { name: "Organza 3-Piece Suit", fabric: "Organza | Digital Print", price: 5499, originalPrice: 10999, image: "images/sale-7.jpg", hover: "images/sale-1.jpg", colors: ["#F0E68C", "#BDB76B", "#EEE8AA"] },
    { name: "Cambric Palazzo Suit", fabric: "Cambric | Relaxed Fit", price: 2999, originalPrice: 5999, image: "images/sale-1.jpg", hover: "images/sale-2.jpg", colors: ["#B0E0E6", "#AFEEEE", "#D8BFD8"] }
  ],
  kids: [
    { name: "Kids Shalwar Kameez", fabric: "Cotton | Comfort Fit", price: 1999, image: "images/new-1.jpg", hover: "images/new-2.jpg", colors: ["#4169E1", "#32CD32", "#FF4500"] },
    { name: "Girls Embroidered Frock", fabric: "Chiffon | Party Wear", price: 2499, image: "images/new-2.jpg", hover: "images/new-3.jpg", colors: ["#FFB6C1", "#FF69B4", "#DDA0DD"] },
    { name: "Boys Kurta Pajama", fabric: "Khaddar | Traditional", price: 1799, image: "images/new-3.jpg", hover: "images/new-4.jpg", colors: ["#FFFFFF", "#F5F5DC", "#E0E0E0"] },
    { name: "Kids 3-Piece Suit", fabric: "Lawn | Printed Set", price: 2999, image: "images/new-4.jpg", hover: "images/new-5.jpg", colors: ["#87CEEB", "#98FB98", "#FFD700"] },
    { name: "Baby Girl Frock Set", fabric: "Cotton | Soft Touch", price: 1599, image: "images/new-5.jpg", hover: "images/new-6.jpg", colors: ["#FFB6C1", "#FFC0CB", "#FFF0F5"] },
    { name: "Kids Waistcoat Suit", fabric: "Velvet | Festive", price: 3499, image: "images/new-6.jpg", hover: "images/new-7.jpg", colors: ["#800020", "#191970", "#006400"] },
    { name: "Girls Lehenga Choli", fabric: "Silk | Embroidered", price: 3999, image: "images/new-7.jpg", hover: "images/new-8.jpg", colors: ["#FF1493", "#FF69B4", "#DAA520"] },
    { name: "Toddler Shalwar Kameez", fabric: "Cotton Lawn | Soft", price: 1299, image: "images/new-8.jpg", hover: "images/new-1.jpg", colors: ["#87CEEB", "#98FB98", "#FFD700"] }
  ]
};
