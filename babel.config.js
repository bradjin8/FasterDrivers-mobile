module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ["module:react-native-dotenv", {
      "moduleName": "@env",
      "path": ".env",
      "blacklist": null,
      "whitelist": null,
      "safe": false,
      "allowUndefined": true
    }],
    "import-glob-meta",
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          src: './src',
          assets: './src/assets',
          navigation: './src/navigation',
          store: './src/store',
          screens: './src/screens',
          components: './src/components',
          utils: './src/utils',
          apis: './src/apis'
        },
      },
    ],
    ['react-native-reanimated/plugin', {
      relativeSourceLocation: true,
    }]
  ]
};
