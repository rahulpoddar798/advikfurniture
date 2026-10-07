// Maintainer helper: turn the curated photo pool into a complete sample catalog.
const fs = require('node:fs');
const path = require('node:path');
const pool = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/sample-photo-pool.json'), 'utf8'));
// Each row: photo index, display name, example INR price, material, W x D x H in cm, color, design detail.
const rows = {
  Chairs: [
    [1,'Nordic White Bar Stool',3990,'Painted wood','40 x 40 x 75','White','A compact backless stool with a square seat and foot rails'],
    [2,'Linen Lounge Chair',8990,'Woven upholstery, metal base','65 x 68 x 82','Oatmeal','A softly rounded lounge seat for a reading corner'],
    [3,'Ash Upholstered Dining Chair',6990,'Fabric upholstery, wood legs','52 x 58 x 86','Grey','A high-back dining chair with tapered wood legs'],
    [4,'Heritage Ladder Back Chair',5490,'Wood','46 x 50 x 92','Natural Wood','An open ladder back and traditional turned front legs'],
    [5,'Vintage Timber Side Chair',4990,'Wood','45 x 49 x 85','Warm Brown','A simple timber seat with a broad back panel'],
    [6,'Onyx Shell Bar Chair',7990,'Moulded shell, wood and steel base','48 x 50 x 108','Black','A sculpted shell seat above a braced tall base'],
    [7,'Contour Black Side Chair',5990,'Moulded shell, metal base','48 x 53 x 82','Black','A curved shell with a clean contemporary silhouette'],
    [8,'Ivory Tufted Accent Chair',15990,'Upholstery, wood frame','78 x 76 x 96','Ivory','A button-tufted back with a generous rounded seat'],
    [9,'Birch Plywood Dining Chair',6490,'Plywood, wood frame','48 x 52 x 80','Natural Wood','An airy plywood back and smooth curved seat'],
    [10,'Mustard Reading Chair',13990,'Fabric upholstery, wood legs','74 x 78 x 91','Mustard','A bright upholstered armchair for a relaxed reading space'],
  ],
  Sofas: [
    [0,'Cloud Ivory Sofa',38990,'Fabric upholstery, wood frame','210 x 90 x 84','Ivory','A light-toned sofa with loose cushions and a relaxed profile'],
    [0,'Canyon Tan Sofa',46990,'Leather-look upholstery, wood frame','215 x 92 x 85','Tan','A warm-toned sofa designed around broad comfortable seats'],
    [3,'Sand Leather Style Loveseat',32990,'Leather-look upholstery, frame','170 x 90 x 82','Sand','A compact two-seat silhouette with padded armrests'],
    [4,'Forest Textured Sofa',36990,'Textured fabric, wood frame','205 x 90 x 85','Forest Green','Deep green upholstery and cushions create a cozy lounge concept'],
    [5,'Coastal Window Sofa',39990,'Fabric upholstery, wood frame','210 x 95 x 84','White','A relaxed light sofa with contrasting blue cushion styling'],
    [6,'Amber Mid Century Sofa',45990,'Leather-look upholstery, wood legs','210 x 88 x 82','Cognac','A slim raised base and warm upholstery for a mid-century look'],
    [7,'Slate High Back Sofa',48990,'Fabric upholstery, wood frame','220 x 94 x 105','Slate Grey','A tall cushioned back and broad seat for a quiet lounge'],
    [8,'Metro Grey Sectional',59990,'Fabric upholstery, wood frame','275 x 165 x 86','Light Grey','A modular corner arrangement for a larger sitting area'],
    [9,'Emerald Three Seat Sofa',42990,'Fabric upholstery, wood legs','215 x 88 x 84','Emerald','Three generous seats and slim legs in a rich green finish'],
    [10,'Crimson Tufted Sofa',54990,'Velvet-style upholstery, wood frame','220 x 90 x 85','Crimson','Deep button tufting and rolled arms create a traditional silhouette'],
  ],
  Tables: [
    [1,'Timber Beam Coffee Table',10990,'Wood top, metal legs','120 x 60 x 42','Natural Wood','A substantial rectangular top balanced on an open metal base'],
    [2,'Glass Frame Coffee Table',12990,'Glass, wood, metal','110 x 60 x 40','Walnut and Black','A glass top and framed lower shelf for an airy living space'],
    [4,'Classic Wood End Table',4990,'Wood','45 x 45 x 55','Dark Brown','A compact square side table with a lower display shelf'],
    [5,'Walnut Lounge Coffee Table',8990,'Wood','105 x 55 x 42','Walnut','A warm tabletop for books and a relaxed coffee setting'],
    [6,'Nordic Rectangular Table',18990,'Wood, metal legs','150 x 85 x 75','Natural and Black','A light rectangular top paired with a dark base'],
    [7,'Studio Gathering Table',21990,'Wood','180 x 90 x 75','Warm Brown','A long versatile tabletop for shared meals or gathering'],
    [8,'Graphite Gathering Table',24990,'Wood, metal base','180 x 90 x 75','Graphite','A dark rectangular table with an open modern base'],
    [10,'Industrial Trunk Coffee Table',13990,'Wood, metal trim','110 x 60 x 42','Weathered Green','A vintage-inspired trunk profile with metal detailing'],
    [11,'Round Hairpin Coffee Table',7990,'Wood top, metal legs','70 x 70 x 42','Natural Wood','A circular wood surface supported by slender hairpin legs'],
    [0,'Round Oak Gathering Table',17990,'Wood','110 x 110 x 75','Oak','A round gathering table with an inviting natural finish'],
  ],
  Beds: [
    [1,'Calm Panel Queen Bed',29990,'Wood frame, panel headboard','165 x 210 x 105','Warm Wood','A calm bedroom concept with a simple panel headboard'],
    [2,'Coastal Upholstered Queen Bed',35990,'Upholstered frame','165 x 210 x 110','Neutral','A soft upholstered bed styled with blue and white linens'],
    [3,'Oak Slat Platform King Bed',42990,'Wood frame, slatted headboard','195 x 215 x 105','Oak','A low platform profile with a wide slatted headboard'],
    [4,'Monochrome Panel Double Bed',27990,'Wood frame','150 x 205 x 100','Light Wood','A compact bed concept with a simple understated headboard'],
    [5,'Woven Headboard Queen Bed',33990,'Wood frame, woven headboard','165 x 210 x 112','Natural','A warm woven headboard for a relaxed bedroom setting'],
    [6,'Charcoal Curve King Bed',47990,'Fabric upholstery, wood frame','195 x 215 x 112','Charcoal','A broad curved upholstered headboard with a soft outline'],
    [7,'Mist Upholstered Queen Bed',36990,'Fabric upholstery, wood frame','165 x 210 x 108','Mist Grey','A clean upholstered silhouette for a light bedroom'],
    [8,'Harbour Queen Bed',34990,'Upholstered frame','165 x 210 x 105','Stone','A neutral bed frame styled in a crisp coastal palette'],
    [9,'Linen Rest King Bed',44990,'Fabric upholstery, wood frame','195 x 215 x 110','Linen','A generous neutral headboard for an uncluttered bedroom'],
    [11,'Blush Tufted Queen Bed',39990,'Fabric upholstery, wood frame','165 x 210 x 120','Blush','A tall button-tufted headboard with a soft warm finish'],
  ],
  Dining: [
    [3,'Sunny Wood Dining Set',39990,'Wood table and chairs','Table: 160 x 85 x 75','Natural Wood','A dining table with six coordinated wood chairs'],
    [4,'Ivory Formal Dining Set',64990,'Wood table, upholstered chairs','Table: 180 x 90 x 75','Ivory','A six-seat dining concept with soft upholstered chairs'],
    [5,'Amber Dining Ensemble',45990,'Wood table, upholstered chairs','Table: 170 x 90 x 75','Amber and Cream','A warm table setting with six upholstered dining chairs'],
    [6,'Midnight Dining Set',59990,'Dark table, upholstered chairs','Table: 180 x 90 x 75','Charcoal and Taupe','A six-chair dining ensemble with a dark tabletop'],
    [8,'Studio Six Seat Dining Set',54990,'Wood table, upholstered chairs','Table: 180 x 90 x 75','Walnut and Grey','A streamlined dining concept for six people'],
    [9,'Compact Bistro Dining Set',24990,'Table, upholstered chairs','Table: 100 x 70 x 75','Cream','A two-seat dining arrangement for a smaller home'],
    [10,'Brick House Dining Set',49990,'Wood table, upholstered chairs','Table: 180 x 90 x 75','Walnut and Grey','A six-seat dark timber dining arrangement'],
    [12,'Country Gathering Dining Set',57990,'Wood table and chairs','Table: 200 x 95 x 75','Natural Wood','An eight-seat table concept with rustic wood chairs'],
    [13,'Garden Round Dining Set',69990,'Wood table, upholstered chairs','Table: 140 x 140 x 75','Brown and Floral','A round table styled with six patterned upholstered chairs'],
    [14,'Minimal Eight Seat Dining Set',61990,'Table, upholstered chairs','Table: 220 x 100 x 75','Light Stone','An open eight-seat arrangement with a pale tabletop'],
  ],
  'Living Room': [
    [1,'Serene Ivory Lounge Set',79990,'Fabric seating, wood tables','Suggested room: 400 x 350 cm','Ivory','A sofa, two accent seats and a round coffee-table concept'],
    [2,'Ochre Loft Lounge Set',74990,'Fabric seating, wood tables','Suggested room: 380 x 330 cm','Ochre','A warm sofa and coffee-table concept for a loft-style space'],
    [3,'Dusk Corner Lounge Set',89990,'Fabric seating, wood tables','Suggested room: 450 x 400 cm','Sand','A spacious lounge concept built around soft corner seating'],
    [4,'Gallery White Lounge Set',69990,'Fabric seating, occasional table','Suggested room: 360 x 320 cm','White','A light sofa and occasional-table concept for a compact lounge'],
    [5,'Earth Tone Lounge Set',84990,'Fabric seating, wood tables','Suggested room: 420 x 360 cm','Taupe and Terracotta','A neutral sofa with accent seating and coffee-table styling'],
    [6,'Bay Window Lounge Set',87990,'Fabric seating, wood tables','Suggested room: 450 x 400 cm','Cream and Teal','A spacious seating and coffee-table concept with teal accents'],
    [7,'Urban Tan Lounge Set',82990,'Leather-look seating, wood tables','Suggested room: 400 x 350 cm','Tan','A warm sofa and coffee-table concept for a modern open room'],
    [0,'Metro Compact Lounge Set',65990,'Fabric seating, wood table','Suggested room: 350 x 300 cm','Grey','A grey modular-sofa concept with space for a coffee table'],
    [9,'Arched Window Lounge Set',92990,'Fabric seating, wood tables','Suggested room: 500 x 420 cm','Ivory','A coordinated sofa, accent-chair and coffee-table concept'],
    [10,'Natural Light Lounge Set',85990,'Fabric seating, wood tables','Suggested room: 430 x 380 cm','Cream','A relaxed seating and wood coffee-table concept in neutral tones'],
  ],
};
const overrides = { 'Sofas:0':pool['Living Room'][3], 'Sofas:1':pool['Living Room'][6], 'Tables:9':pool.Dining[10], 'Living Room:7':pool.Sofas[7] };
const catalog = Object.entries(rows).flatMap(([categoryName, items]) => items.map(([photoIndex,name,price,material,dimensions,color,detail],index) => {
  const photo = overrides[`${categoryName}:${index}`] || pool[categoryName][photoIndex-1];
  const sku = `AFI-DEMO-${categoryName.toUpperCase().replaceAll(' ','-')}-${String(index+1).padStart(2,'0')}`;
  const care = /upholster|fabric|leather|velvet/i.test(material) ? 'Vacuum gently and spot-clean with a dry soft cloth; test any cleaner on a hidden area' : 'Wipe with a soft dry cloth and protect from standing water, heat and direct sunlight';
  const inclusion = categoryName === 'Beds' ? 'Example listing covers the bed frame only; mattress, bedding and room accessories are excluded' : categoryName === 'Living Room' ? 'The proposed furniture grouping is illustrative; rugs, lighting, art and other room accessories are excluded' : categoryName === 'Dining' ? 'The example set covers the table and chair count described; tableware, lighting and room accessories are excluded' : 'Example listing covers the named furniture piece only; accessories and other furniture in the photo are excluded';
  return { name:`${name} (Sample)`, slug:`sample-${name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`, categoryName, sku, price, discountPrice:null, stock:0, status:'PUBLISHED', featured:index===0, isTrending:false, isBestSeller:false, material, dimensions, colors:[color], tags:['sample-catalog',categoryName.toLowerCase(),'illustrative'], images:[`${photo.image}?auto=format&fit=crop&w=1200&q=85`], shortDescription:`Sample catalog listing. ${detail}. Example price and specifications; availability requires admin confirmation.`, description:`SAMPLE CATALOG LISTING — illustrative photography; this is not confirmed Advik Furniture inventory. ${detail}. Proposed material: ${material}; proposed color: ${color}; example dimensions: ${dimensions}. ${inclusion}. Care guidance: ${care}. Assembly, customization, delivery charges, lead time and warranty require confirmation from Advik Furniture before any order. The INR price and specifications are examples and must be verified by the admin. Stock is set to zero until real inventory is confirmed. Photo credit: ${photo.photographer} / Unsplash`, imageCredit:{...photo,license:'https://unsplash.com/license'} };
}));
fs.writeFileSync(path.join(__dirname,'../data/sample-catalog.json'),JSON.stringify(catalog,null,2)+'\n');
console.log(`Prepared ${catalog.length} complete sample products.`);
