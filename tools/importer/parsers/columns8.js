/* global WebImporter */
export default function parse(element, { document }) {
  // Find all visible .compare-column elements (not display:none/visibility:hidden and rendered)
  const allColumns = Array.from(element.querySelectorAll('.compare-column'));
  const visibleColumns = allColumns.filter(col => {
    // Check for style attribute as well as element layout
    const style = col.getAttribute('style') || '';
    const isHiddenByStyle = /display:\s*none/.test(style) || /visibility:\s*hidden/.test(style);
    // Also check if not rendered in the DOM (offsetParent)
    const isDisplayed = col.offsetParent !== null;
    // The offsetParent check fails if element or ancestor is display:none
    return !isHiddenByStyle && isDisplayed;
  });

  // Create a cell for each visible column, including all text and elements
  const columnCells = visibleColumns.map(col => {
    // Gather all child nodes, including text, elements, br, etc.
    // Filter out comments and empty text nodes
    const nodes = Array.from(col.childNodes).filter(node => {
      if (node.nodeType === Node.COMMENT_NODE) return false;
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return true;
    });
    // If nothing, fallback to .innerText just in case (rare)
    if (!nodes.length) {
      return col.innerText ? col.innerText : '';
    }
    // Only one node: return the node, else return array
    return nodes.length === 1 ? nodes[0] : nodes;
  });

  // Make sure we have at least one column, otherwise do nothing
  if (!columnCells.length) return;

  // Header row: must match example
  const headerRow = ['Columns (columns8)'];
  const rows = [headerRow, columnCells];
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
