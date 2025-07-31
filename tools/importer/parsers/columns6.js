/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row containing all columns
  const compareRow = element.querySelector('.compare-row');
  if (!compareRow) return;

  // Get all visible compare-column elements (role="cell" and not display:none/hidden)
  const columnEls = Array.from(compareRow.querySelectorAll(':scope > .compare-column[role="cell"]'))
    .filter(col => {
      const style = col.getAttribute('style') || '';
      return !/display:\s*none|visibility:\s*hidden/i.test(style);
    });

  // For each column, gather all content (including text, figures, and any descendants)
  function getCellContent(col) {
    const nodes = [];
    col.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        nodes.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        nodes.push(document.createTextNode(node.textContent));
      }
    });
    return nodes.length ? (nodes.length === 1 ? nodes[0] : nodes) : col;
  }
  const contentCells = columnEls.map(getCellContent);

  // Correct header row: exactly one cell
  const tableRows = [
    ['Columns (columns6)'],
    contentCells
  ];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
