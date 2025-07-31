/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Block header row, as in the example
  const headerRow = ['Table (table5)'];

  // 2. Find the visible header row with dropdowns
  const selectorTable = element.querySelector('.compare.selector-table.with-fullwidthrowheader');
  if (!selectorTable) return;
  const interactiveHeader = selectorTable.querySelector('#interactive-compare-header');
  if (!interactiveHeader) return;

  // 3. Get all directly visible columns in the header (dropdown columns)
  const columns = Array.from(interactiveHeader.querySelectorAll(':scope > .compare-column-interactive[role="cell"]'));
  // Only those that are visible (use style attr, as computed style may be unreliable in some envs)
  const visibleColumns = columns.filter(col => {
    const style = col.getAttribute('style') || '';
    return !(style.includes('display: none') || style.includes('visibility: hidden'));
  });

  // 4. For each column, get the label displayed (selected text in <select>, which matches the screenshot)
  const dataRow = visibleColumns.map(col => {
    const select = col.querySelector('select');
    if (select) {
      const option = select.options[select.selectedIndex];
      return option ? option.textContent.trim() : '';
    }
    // fallback: any text in the column
    return col.textContent.trim();
  });

  // 5. Create the cells as in the block table (header row is 1 col, then 1 row with all model labels, as in the screenshot)
  const cells = [
    headerRow,
    [ ...dataRow ]
  ];

  // 6. Create table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
