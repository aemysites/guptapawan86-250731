/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Cards (cards4)'];

  // Find the UL with role="list" (cards container)
  const list = element.querySelector('ul[role="list"]');
  if (!list) return;

  const cardRows = [];
  // For each LI (card)
  list.querySelectorAll(':scope > li').forEach((li) => {
    // --- IMAGE CELL ---
    // Find the first <img> (possibly inside <picture>)
    let img = li.querySelector('picture img, img');
    // If not found, leave undefined (should not happen here)

    // --- TEXT CELL ---
    // For the text cell, we need both 'title' and 'description'
    // The text is usually in .bento-box or .bentobox-item or direct children
    // We'll combine all .copy elements, handling headings and descriptions
    let textContainer = li.querySelector('.bento-box, .bentobox-item, .column.large-12, .column');
    if (!textContainer) textContainer = li;
    // Special case: When text is split across multiple columns (e.g. the display sizes card)
    // We'll collect all visible .copy elements, ignoring .visuallyhidden
    const textEls = [];
    textContainer.querySelectorAll('.copy, span.copy, p.copy').forEach((el) => {
      if (!el.classList.contains('visuallyhidden') && el.textContent.trim()) {
        textEls.push(el);
      }
    });
    // Some cards (e.g. chip/battery) have an active comparison gallery, which is part of the text
    // Only include the currently active (data-active-content="true")
    const galleryActive = li.querySelector('[data-active-content="true"]');
    if (galleryActive) {
      textEls.push(galleryActive);
    }
    // Fallback: If nothing found, just collect all paragraphs
    if (textEls.length === 0) {
      textContainer.querySelectorAll('p').forEach((p) => {
        if (p.textContent.trim()) textEls.push(p);
      });
    }
    // Compose the cell, single element or array
    const textCell = textEls.length === 1 ? textEls[0] : textEls;

    cardRows.push([img, textCell]);
  });

  // Compose the table data
  const tableData = [headerRow, ...cardRows];
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
