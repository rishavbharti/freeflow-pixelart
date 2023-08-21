import { colorPaletteGenerator, hex2rgb } from './utils.js';

let selectedTool;
let selectedColor;
let canvasEl;

/*
 * Creates pixel art grid
 * @param el DOM Element
 * @param rows Number of rows
 * @param rows Number of cols
 */
function PixelArt(element, rows, cols) {
  // logic to create pixel art grid.
  element.style.gridTemplateRows = `repeat(${rows + 1}, 1fr)`;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < rows; i++) {
    const row = document.createElement('div');
    row.classList.add('row');
    row.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    const rowFragment = document.createDocumentFragment();

    for (let j = 0; j < cols; j++) {
      const cell = document.createElement('div');
      cell.setAttribute('id', `${i}-${j}`);
      cell.classList.add('cell');
      rowFragment.appendChild(cell);
    }

    row.appendChild(rowFragment);

    fragment.appendChild(row);
  }

  element.appendChild(fragment);

  element.addEventListener('click', function (e) {
    if (e.target.classList.contains('cell')) {
      if (
        selectedTool &&
        ['rgb(255, 255, 255)', 'rgb(240, 240, 240)'].includes(
          e.target.style.backgroundColor
        )
      ) {
        selectedTool = undefined;
        element.removeEventListener('mouseover', handleTool);
        return;
      }

      if (!selectedTool && e.target.style.backgroundColor === selectedColor) {
        selectedColor = undefined;
        element.removeEventListener('mouseover', createArt);
        return;
      }

      selectedTool ? handleTool(e) : createArt(e);
      element.addEventListener(
        'mouseover',
        selectedTool ? handleTool : createArt
      );
    }
  });
}

function createArt(e) {
  if (selectedColor && e.target.classList.contains('cell')) {
    e.target.style.backgroundColor = selectedColor;
  }
}

function handleTool(e) {
  switch (selectedTool) {
    case 'eraser': {
      const idArr = e.target.getAttribute('id').split('-');
      const id = parseInt(idArr[0]) + parseInt(idArr[1]);
      if (id % 2 !== 0) {
        e.target.style.backgroundColor = '#f0f0f0';
      } else {
        e.target.style.backgroundColor = '#ffffff';
      }

      break;
    }

    default:
      return;
  }
}

function createColorPalette(el, count) {
  const element = document.querySelector(el);
  const colors = colorPaletteGenerator(count);

  const fragment = document.createDocumentFragment();

  const colorSwatch = document.createElement('input');
  colorSwatch.setAttribute('type', 'color');
  colorSwatch.setAttribute('value', '#f6b73c');
  colorSwatch.classList.add('color-swatch');
  colorSwatch.addEventListener('change', handleColorSelectionFromSwatch);
  fragment.appendChild(colorSwatch);

  colors.forEach((color) => {
    const colorCell = document.createElement('div');
    colorCell.classList.add('tool-cell');
    colorCell.style.backgroundColor = `rgb(${color})`;
    fragment.appendChild(colorCell);
  });

  element.appendChild(fragment);

  element.addEventListener('click', handleColorSelection);
}

async function createToolbar(el) {
  const element = document.querySelector(el);

  const tools = [
    {
      name: 'eraser',
      icon: 'eraser',
    },
  ];

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < tools.length; i++) {
    const { name, icon } = tools[i];

    const toolCell = document.createElement('div');
    toolCell.setAttribute('id', 'tool');
    toolCell.setAttribute('data-name', name);
    const svgRes = await fetch(`../assets/${icon}.svg`);
    const svg = await svgRes.text();
    toolCell.innerHTML = svg;
    toolCell.classList.add('tool-cell');

    fragment.appendChild(toolCell);
  }

  element.appendChild(fragment);

  element.addEventListener('click', handleToolSelection);
}

function handleToolSelection(e) {
  const _selectedTool = e.target.closest('#tool');
  if (_selectedTool) {
    selectedColor = null;
    const tool = _selectedTool.getAttribute('data-name');
    selectedTool = tool;
  }
}

function handleColorSelection(e) {
  selectedColor = e.target.style.backgroundColor;
  removeListenerFromCanvas();
}

function handleColorSelectionFromSwatch(e) {
  selectedColor = hex2rgb(e.target.value);
  removeListenerFromCanvas();
}

function removeListenerFromCanvas() {
  selectedTool = null;
  canvasEl.removeEventListener('mouseover', createArt);
}

(function init() {
  canvasEl = document.querySelector('#grid');
  const density = Number(window.prompt('Enter value for pixel density: ', 80));

  new PixelArt(canvasEl, density, density);
  createColorPalette('#palette-container', 25);
  createToolbar('#toolbar');
})();
