/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all relevant card content from a column
  function extractColumnContent(columnElem) {
    const bento = columnElem.querySelector('.bento-box');
    if (!bento) return [];
    const card = bento.querySelector('.bentobox-item');
    if (!card) return [];
    const pic = card.querySelector('picture');
    const heading = card.querySelector('h3');
    const para = card.querySelector('p');
    const arr = [];
    if (pic) arr.push(pic);
    if (heading) arr.push(heading);
    if (para) arr.push(para);
    return arr;
  }

  // Get all immediate child columns
  const columns = element.querySelectorAll(':scope > div.column');
  if (columns.length === 0) return;

  // Build the header row with a single cell (as required by markdown example)
  const headerRow = ['Columns (columns11)'];
  // Build the content row with one cell per column (usually two columns)
  const contentRow = Array.from(columns).map(extractColumnContent);

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
