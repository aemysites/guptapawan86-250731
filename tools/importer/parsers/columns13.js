/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all child <a> tags
  const links = Array.from(element.querySelectorAll('a'));

  // Table rows: header is a single cell, then a row with a cell for each link
  const headerRow = ['Columns (columns13)'];
  const columnsRow = links;

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);
  element.replaceWith(table);
}