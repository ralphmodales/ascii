import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const uploadsDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const formData = await request.formData();
    const image = formData.get('image');
    const width = formData.get('width') || 100;
    const height = formData.get('height') || 100;

    if (!image) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    const inputFilename = `input_${Date.now()}.${image.name.split('.').pop()}`;
    const inputPath = path.join(uploadsDir, inputFilename);
    const outputTextPath = path.join(uploadsDir, `output_${Date.now()}.txt`);
    const outputPngPath = path.join(uploadsDir, `output_${Date.now()}.png`);

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(inputPath, buffer);

    return new Promise((resolve, reject) => {
      exec(`./public/converter/ascii_converter ${inputPath} ${outputTextPath} ${width} ${height} ${outputPngPath}`,
        (error, stdout, stderr) => {
          if (error) {
            console.error('Execution error:', error);
            return resolve(NextResponse.json({ error: 'Conversion failed' }, { status: 500 }));
          }

          try {
            const asciiArt = fs.readFileSync(outputTextPath, 'utf8');
            const pngBuffer = fs.readFileSync(outputPngPath);
            const base64Png = pngBuffer.toString('base64');

            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputTextPath);
            fs.unlinkSync(outputPngPath);

            resolve(NextResponse.json({
              asciiArt,
              pngDataUrl: `data:image/png;base64,${base64Png}`
            }));
          } catch (readError) {
            console.error('File read error:', readError);
            resolve(NextResponse.json({ error: 'Failed to read output' }, { status: 500 }));
          }
        }
      );
    });
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json({ error: 'Conversion failed' }, { status: 500 });
  }
}
