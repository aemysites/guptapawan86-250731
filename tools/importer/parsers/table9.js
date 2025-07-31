/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row must be exactly as specified
  const headerRow = ['Table (table9)'];

  // 2. Find all compare-row blocks (each represents a data row)
  const rows = Array.from(element.querySelectorAll(':scope > .compare-row'));
  if (!rows.length) return;

  // 3. For each row, extract the visible product columns (ignore hidden ones)
  // Each column is a cell in this data row
  const dataRows = rows.map(row => {
    // Select visible columns only
    const cols = Array.from(row.querySelectorAll(':scope > .compare-column')).filter(col => {
      // Check for display: none or visibility: hidden
      const style = col.getAttribute('style') || '';
      const styleLower = style.toLowerCase();
      return !(styleLower.includes('display: none') || styleLower.includes('visibility: hidden'));
    });
    // For each visible column, collect its full content
    return cols.map(col => {
      // If there's a .stat-content, we want all its content (including text nodes)
      const statContent = col.querySelector('.stat-content');
      let contentNodes;
      if (statContent) {
        // Use all children AND text nodes (not just elements)
        contentNodes = Array.from(statContent.childNodes).filter(node => {
          // Exclude empty text nodes
          return !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim());
        });
      } else {
        // Fallback to all children/text nodes of the column
        contentNodes = Array.from(col.childNodes).filter(node => {
          return !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim());
        });
      }
      // If empty, fallback to em dash (to preserve table shape)
      if (!contentNodes.length) {
        const dash = document.createElement('span');
        dash.textContent = '—';
        return dash;
      }
      // If only one node, just return that node (string, text, or element)
      return contentNodes.length === 1 ? contentNodes[0] : contentNodes;
    });
  });

  // Compose the table: one header row, then data rows
  const cells = [headerRow, ...dataRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
