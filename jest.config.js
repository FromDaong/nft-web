module.exports = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: ["**/*.{ts,tsx}", "!**/*.d.ts", "!**/node_modules/**"],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  transform: {
    "^.+\\.(ts|tsx)$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.(scss|sass|css)$": "<rootDir>/transformers/cssTransform.js",
  },
  transformIgnorePatterns: ["/node_modules/"],
  moduleNameMapper: {
    "^.+\\.module\\.(scss|sass|css)$": "identity-obj-proxy",
  },
};
