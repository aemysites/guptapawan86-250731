/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by class name
  function findChildByClass(parent, className) {
    return Array.from(parent.children).find(el => el.classList.contains(className));
  }

  // --- 1. Get background image (row.q540661) ---
  let bgImg = null;
  const bgRow = element.querySelector('.row.q540661');
  if (bgRow) {
    const bgPicture = bgRow.querySelector('picture');
    if (bgPicture) {
      bgImg = bgPicture;
    }
  }

  // --- 2. Compose main content (logo, headline image, product, ctas) ---
  const mainContent = [];
  // 2.1 logo image (h2>picture)
  const logo = element.querySelector('.row.j29BAE3 h2 > picture');
  if (logo) {
    mainContent.push(logo);
  }
  // 2.2 headline image (row.b56655F > picture)
  const headlineRow = element.querySelector('.row.b56655F');
  if (headlineRow) {
    const headlinePic = headlineRow.querySelector('picture');
    if (headlinePic) mainContent.push(headlinePic);
  }
  // 2.3 product image (row.e7AFD3F > picture)
  const productRow = element.querySelector('.row.e7AFD3F');
  if (productRow) {
    const productPic = productRow.querySelector('picture');
    if (productPic) mainContent.push(productPic);
  }
  // 2.4 CTA text and buttons (row.m1D2BFA > .column)
  const ctaRow = element.querySelector('.row.m1D2BFA');
  if (ctaRow) {
    const ctaCol = ctaRow.querySelector('.column');
    if (ctaCol) {
      // Get any <p> for supplemental message
      const ctaMsg = ctaCol.querySelector('p');
      if (ctaMsg) mainContent.push(ctaMsg);
      // Get CTA buttons (all <a>)
      const ctaBtns = ctaCol.querySelectorAll('a');
      ctaBtns.forEach(btn => mainContent.push(btn));
    }
  }

  // Compose the table rows
  const cells = [
    ['Hero (hero3)'], // header
    [bgImg ? bgImg : ''],
    [mainContent] // array: logo, headline, product image, cta msg, buttons
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
