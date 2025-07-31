/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cards10)'];
  const rows = [headerRow];

  // In the provided HTML, there are two columns representing two cards
  // Each card is a 'bento-box' within the main element
  const bentoBoxes = element.querySelectorAll('.bento-box');
  bentoBoxes.forEach((bento) => {
    // Each bento-box has a .bentobox-item which holds card content
    const cardItem = bento.querySelector('.bentobox-item');
    if (!cardItem) return;
    
    // ICON (small icon at top): first .column where picture source is small (first one)
    let icon = null;
    const iconCol = cardItem.querySelector('div[class*="b18A020"], div[class*="dCF28D6"]');
    if (iconCol) {
      const iconPicture = iconCol.querySelector('picture, img');
      if (iconPicture) icon = iconPicture;
    }
    // MAIN IMAGE: (typically at bottom), a .column with a picture
    let mainImg = null;
    const mainImgCol = cardItem.querySelector('div[class*="u5C8722"], div[class*="s074652"]');
    if (mainImgCol) {
      const mainPicture = mainImgCol.querySelector('picture, img');
      if (mainPicture) mainImg = mainPicture;
    }
    // Compose cell 1: icon (if present), then main image (if present)
    let cell1 = [];
    if (icon) cell1.push(icon);
    if (mainImg) cell1.push(mainImg);
    if (cell1.length === 0) cell1 = '';
    else if (cell1.length === 1) cell1 = cell1[0];
    // HEADING and PARAGRAPH (always present)
    let cell2Content = [];
    const textCol = cardItem.querySelector('div[class*="j6C8F63"], div[class*="b17F598"]');
    if (textCol) {
      const heading = textCol.querySelector('h3');
      const desc = textCol.querySelector('p');
      if (heading) cell2Content.push(heading);
      if (desc) cell2Content.push(desc);
    }
    if (cell2Content.length === 0) cell2Content = '';
    else if (cell2Content.length === 1) cell2Content = cell2Content[0];
    rows.push([cell1, cell2Content]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
