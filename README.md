# Mimic - Figma Pattern Learning Plugin

A Figma/FigJam plugin that learns design patterns from examples and applies them to multiple elements at once.

## What is Mimic?

Mimic helps you maintain design consistency by learning the transformation between two elements and applying that same pattern to other elements. Instead of manually copying individual properties, Mimic captures the entire transformation and replicates it across your selection.

## Features

Mimic can learn and apply the following properties:

- **Rotation** - Angular changes
- **Scale** - Width and height transformations
- **Opacity** - Transparency adjustments
- **Fill Colors** - Solid color changes
- **Stroke Colors** - Border color changes
- **Stroke Width** - Border thickness adjustments
- **Font Size** - Text size changes (for text elements)

## How to Use

### Learning a Pattern

1. Select exactly **2 nodes** in Figma (these can be frames, groups, or individual elements)
2. Click **"Learn Pattern"** in the plugin interface
3. Mimic will compare the first editable child element in each selection and learn the differences

### Applying a Pattern

1. Select one or more nodes where you want to apply the learned pattern
2. Click **"Apply Pattern to Selection"**
3. The pattern will be applied to all editable elements within your selection

## Installation

### From Figma Community

*(Coming soon - plugin will be published to Figma Community)*

### Manual Installation (Development)

1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/mimic-plugin.git
   cd mimic-plugin
   ```

2. In Figma:
   - Go to **Plugins** → **Development** → **Import plugin from manifest**
   - Select the `manifest.json` file from this repository

3. The plugin is now available in your Figma plugins menu

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

```bash
npm install
```

### Project Structure

```
mimic-plugin/
├── manifest.json    # Plugin configuration
├── code.js          # Main plugin logic (compiled)
├── ui.html          # Plugin UI interface
├── package.json     # Dependencies
└── tsconfig.json    # TypeScript configuration
```

### Building

The `code.js` file is already compiled. If you modify the source TypeScript files, rebuild using:

```bash
npx esbuild code.ts --bundle --outfile=code.js
```

## How It Works

1. **Pattern Learning**: Mimic finds the first editable leaf element within each of the two selected nodes and extracts their properties (size, color, opacity, etc.)
2. **Difference Calculation**: It calculates the delta/transformation between these properties
3. **Pattern Application**: When applying, it finds all editable leaf elements in the selection and applies the same transformation to each

## Example Use Cases

- **Design System Updates**: Update button styles across multiple components
- **Responsive Design**: Scale elements proportionally while maintaining style changes
- **Theme Variations**: Apply color and opacity changes to create dark/light mode variants
- **Typography Scaling**: Adjust font sizes consistently across text elements

## License

MIT License - see [LICENSE](LICENSE) file for details

## Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests

## Author

Chandra

## Acknowledgments

Built for the Figma platform using the Figma Plugin API.
