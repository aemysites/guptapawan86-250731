/* global WebImporter */
export default function parse(element, { document }) {
  // Find all visible columns (ignore those with display: none or visibility: hidden)
  const visibleColumns = Array.from(
    element.querySelectorAll('.compare-column[role="cell"]')
  ).filter(col => {
    const style = col.getAttribute('style') || '';
    return !style.includes('display: none') && !style.includes('visibility: hidden');
  });

  // Collect the full content of each column for the block row
  const contentRow = visibleColumns.map(col => {
    // Grab everything inside the main .row-colors
    const rowColors = col.querySelector('.row-colors');
    return rowColors || document.createElement('div');
  });

  // Compose table with a single header cell, and a content row with N cells/columns
  const cells = [
    ['Columns (columns7)'],
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
