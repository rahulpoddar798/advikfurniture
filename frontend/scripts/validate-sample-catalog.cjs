const assert = require('node:assert/strict');
const catalog = require('../data/sample-catalog.json');
const categories = ['Sofas','Chairs','Tables','Beds','Dining','Living Room'];
assert.equal(catalog.length,60);
for (const field of ['sku','slug','name']) assert.equal(new Set(catalog.map(p=>p[field])).size,60,`Duplicate ${field}`);
for (const category of categories) {
  const products = catalog.filter(p=>p.categoryName===category);
  assert.equal(products.length,10,category);
  assert.equal(new Set(products.map(p=>p.images[0])).size,10,`Repeated photos in ${category}`);
}
for (const product of catalog) {
  for (const field of ['name','sku','slug','description','shortDescription','material','dimensions']) assert.ok(product[field]?.trim(),`${product.sku}: ${field}`);
  assert.ok(product.name.endsWith('(Sample)'));
  assert.ok(product.description.includes('Stock is set to zero'));
  assert.equal(product.stock,0);
  assert.equal(product.status,'PUBLISHED');
  assert.equal(product.isBestSeller,false);
  assert.equal(product.isTrending,false);
  assert.equal(product.discountPrice,null);
  assert.ok(Number.isFinite(product.price) && product.price>0);
  assert.ok(product.colors.length && product.tags.includes('sample-catalog'));
  assert.equal(product.images.length,1);
  assert.equal(new URL(product.images[0]).hostname,'images.unsplash.com');
  assert.equal(new URL(product.imageCredit.source).hostname,'unsplash.com');
  assert.ok(product.imageCredit.photographer);
}
assert.equal(catalog.filter(p=>p.featured).length,6);
console.log('Catalog verified: 60 complete listings, 10 distinct photos per category, unique identities, sample labels and zero stock.');
