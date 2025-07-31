/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main navigation element
  const nav = element.querySelector('nav.secondnavigationbar-body');
  if (!nav) return;
  const navUL = nav.querySelector('ul.secondnavigationbar-body-links');
  if (!navUL) return;
  const tabLis = Array.from(navUL.children).filter(child => child.tagName === 'LI');

  // Build rows: header row, then one row per tab (label, content)
  const rows = [];
  // Header row: single cell with 'Tabs'
  rows.push(['Tabs']);

  tabLis.forEach(li => {
    // Tab label: main <a> inside the li
    const tabLabelAnchor = li.querySelector(':scope > a');
    let tabLabel;
    if (tabLabelAnchor) {
      tabLabel = tabLabelAnchor;
    } else {
      tabLabel = document.createTextNode(li.textContent.trim());
    }
    // Tab content: subnav <ul> if exists
    let tabContent = '';
    const subnav = li.querySelector(':scope > div.second-subnav');
    if (subnav) {
      const subUL = subnav.querySelector(':scope > ul');
      if (subUL) {
        tabContent = subUL;
      }
    }
    rows.push([tabLabel, tabContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
