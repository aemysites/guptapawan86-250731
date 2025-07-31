/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block (should match the example exactly)
  const headerRow = ['Hero (hero12)'];

  // --- Extract the hero image (row 2) ---
  let imageEl = null;
  // Try to find the image in a <picture> (prefer) or <img>
  const picture = element.querySelector('picture');
  if (picture) {
    imageEl = picture;
  } else {
    // Fallback: try img directly
    const img = element.querySelector('img');
    if (img) imageEl = img;
  }

  // --- Extract the heading/subheading/paragraph/CTA (row 3) ---
  // Find the left column with text content
  let textContent = [];
  const textCol = element.querySelector('.bento-box .bentobox-item .column.large-6.medium-6.small-12.p55DB2B');
  if (textCol) {
    // Get all non-empty children except empty divs/spans
    textContent = Array.from(textCol.children).filter((el) => {
      // Ignore empty divs
      if (el.tagName === 'DIV' && el.textContent.trim() === '') return false;
      // Allow h1-h6, p, a
      return ['H1','H2','H3','H4','H5','H6','P','A'].includes(el.tagName);
    });
    // Find link inside the inner row (optional CTA)
    const innerLink = textCol.querySelector('a');
    if (innerLink && !textContent.includes(innerLink)) {
      textContent.push(innerLink);
    }
  }

  // Fallback: if couldn't find column, grab all headings, paragraphs, and links in element
  if (textContent.length === 0) {
    textContent = Array.from(element.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a'));
  }

  // Edge case: If still no content, insert empty placeholder
  if (textContent.length === 0) {
    textContent = [document.createTextNode('')];
  }

  // --- Compose the block table ---
  const cells = [
    headerRow,
    [imageEl ? imageEl : ''],
    [textContent]
  ];

  // --- Replace original element with the block table ---
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
