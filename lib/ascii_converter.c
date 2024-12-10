#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <math.h>
#include <wand/MagickWand.h>

#define ASCII_CHARS " .:-=+*#%@"
#define DEFAULT_WIDTH 100
#define DEFAULT_HEIGHT 100
#define MAX_WIDTH 1000
#define MAX_HEIGHT 1000

void generate_ascii_png(const char* output_png_path, char ascii_art[MAX_HEIGHT][MAX_WIDTH + 1], 
                        size_t width, size_t height, size_t original_width, size_t original_height) {
    MagickWand *png_wand = NewMagickWand();
    PixelWand *background = NewPixelWand();
    PixelWand *text_color = NewPixelWand();
    DrawingWand *drawing_wand = NewDrawingWand();

    double aspect_ratio = (double)original_width / original_height;
    size_t png_width = width * 10;
    size_t png_height = height * 40;

    if (aspect_ratio > 1) {
        png_height = (size_t)(png_width / aspect_ratio);
    } else {
        png_width = (size_t)(png_height * aspect_ratio);
    }

    PixelSetColor(background, "white");
    PixelSetColor(text_color, "black");

    MagickNewImage(png_wand, png_width, png_height, background);

    DrawSetFillColor(drawing_wand, text_color);
    DrawSetFont(drawing_wand, "DejaVu-Sans-Mono");
    DrawSetFontSize(drawing_wand, 16);
    DrawSetTextAntialias(drawing_wand, MagickTrue);

    for (size_t y = 0; y < height; y++) {
        DrawAnnotation(drawing_wand, 0, (y + 1) * 20, 
                       (const unsigned char*)ascii_art[y]);
    }

    MagickDrawImage(png_wand, drawing_wand);
    MagickWriteImage(png_wand, output_png_path);

    drawing_wand = DestroyDrawingWand(drawing_wand);
    png_wand = DestroyMagickWand(png_wand);
    background = DestroyPixelWand(background);
    text_color = DestroyPixelWand(text_color);
}

int image_to_ascii(const char* input_path, const char* output_text_path, const char* output_png_path, size_t custom_width, size_t custom_height) {
    MagickWand *magick_wand;
    PixelIterator *iterator;
    PixelWand **pixels;
    FILE *output_file;
    char ascii_art[MAX_HEIGHT][MAX_WIDTH + 1];

    MagickWandGenesis();
    magick_wand = NewMagickWand();

    if (MagickReadImage(magick_wand, input_path) == MagickFalse) {
        fprintf(stderr, "Error reading image\n");
        return 1;
    }

    size_t original_width = MagickGetImageWidth(magick_wand);
    size_t original_height = MagickGetImageHeight(magick_wand);

    if (custom_width == 0 || custom_height == 0 || 
        custom_width > MAX_WIDTH || custom_height > MAX_HEIGHT) {
        custom_width = DEFAULT_WIDTH;
        custom_height = DEFAULT_HEIGHT;
    }

    MagickResizeImage(magick_wand, custom_width, custom_height, LanczosFilter, 1.0);
    MagickSetImageType(magick_wand, GrayscaleType);

    output_file = fopen(output_text_path, "w");
    if (!output_file) {
        fprintf(stderr, "Error opening output text file\n");
        return 1;
    }

    iterator = NewPixelIterator(magick_wand);

    for (size_t y = 0; y < custom_height; y++) {
        size_t row_width;
        pixels = PixelGetNextIteratorRow(iterator, &row_width);
        
        for (size_t x = 0; x < row_width; x++) {
            double red = PixelGetRed(pixels[x]);
            double green = PixelGetGreen(pixels[x]);
            double blue = PixelGetBlue(pixels[x]);
            double intensity = 0.299 * red + 0.587 * green + 0.114 * blue;
            
            int char_index = (int)floor(intensity * (strlen(ASCII_CHARS) - 1));
            char ascii_char = ASCII_CHARS[char_index];
            
            ascii_art[y][x] = ascii_char;
            fputc(ascii_char, output_file);
        }
        
        ascii_art[y][custom_width] = '\0';
        fputc('\n', output_file);
    }

    fclose(output_file);
    generate_ascii_png(output_png_path, ascii_art, custom_width, custom_height, original_width, original_height);

    iterator = DestroyPixelIterator(iterator);
    magick_wand = DestroyMagickWand(magick_wand);
    MagickWandTerminus();

    return 0;
}

int main(int argc, char *argv[]) {
    size_t width = DEFAULT_WIDTH;
    size_t height = DEFAULT_HEIGHT;

    if (argc == 6) {
        width = atoi(argv[3]);
        height = atoi(argv[4]);
    }

    return image_to_ascii(argv[1], argv[2], argv[5], width, height);
}
