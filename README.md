# ASCII Art Converter

## Setup

1. Install dependencies
\`\`\`bash
npm install
\`\`\`

2. Compile C converter
\`\`\`bash
gcc -o public/converter/ascii_converter lib/ascii_converter.c `pkg-config --cflags --libs MagickWand` -lm
\`\`\`

3. Run the development server
\`\`\`bash
npm run dev
\`\`\`
