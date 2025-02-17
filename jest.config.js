// jest.config.js
module.exports = {
    preset: 'ts-jest',               // Usa ts-jest para transformar TypeScript
    testEnvironment: 'node',         // Entorno de pruebas en Node.js
    transform: {
      '^.+\\.tsx?$': 'ts-jest',       // Transforma archivos .ts y .tsx
    },
    transformIgnorePatterns: [
      "/node_modules/"
    ],
    testMatch: [
      "**/tests/**/*.test.(ts|tsx|js)" // Ubicación de los archivos de test
    ],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  };
  