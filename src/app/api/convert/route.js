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

    if (!image) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    const inputFilename = `input_${Date.now()}.${image.name.split('.').pop()}`;
    const inputPath = path.join(uploadsDir, inputFilename);
    const outputPath = path.join(uploadsDir, `output_${Date.now()}.txt`);

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(inputPath, buffer);

    return new Promise((resolve, reject) => {
      exec(`./public/converter/ascii_converter ${inputPath} ${outputPath}`, 
        (error, stdout, stderr) => {
          if (error) {
            console.error('Execution error:', error);
            return resolve(NextResponse.json({ error: 'Conversion failed' }, { status: 500 }));
          }

          try {
            const asciiArt = fs.readFileSync(outputPath, 'utf8');

            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);

            resolve(NextResponse.json({ asciiArt }));
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
