function generateRandomNumber() {
  return Math.trunc(Math.random() * 255);
}
function colorPaletteGenerator(count) {
  const colors = [];

  for (let i = 0; i < count; i++) {
    const r = generateRandomNumber();
    const g = generateRandomNumber();
    const b = generateRandomNumber();
    colors.push(`${r}, ${g}, ${b}`);
  }

  return colors;
}

const hex2rgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgb(${r}, ${g}, ${b})`;
};

export { generateRandomNumber, colorPaletteGenerator, hex2rgb };
