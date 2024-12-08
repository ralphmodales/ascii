#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <math.h>
#include <wand/MagickWand.h>

#define ASCII_CHARS " .:-=+*#%@"
#define MAX_WIDTH 200
#define MAX_HEIGHT 200

int image_to_ascii(const char* input_path, const char* output_path) {
    MagickWand *magick_wand;
    PixelIterator *iterator;
    PixelWand **pixels;
    FILE *output_file;

    // Initialize ImageMagick library
    MagickWandGenesis();
    magick_wand = NewMagickWand();

    // Read the image
    if (MagickReadImage(magick_wand, input_path) == MagickFalse) {
        fprintf(stderr, "Error reading image\n");
        return 1;
    }

    // Resize image while maintaining aspect ratio
    size_t width = MagickGetImageWidth(magick_wand);
    size_t height = MagickGetImageHeight(magick_wand);
    double scale = fmin((double)MAX_WIDTH / width, (double)MAX_HEIGHT / height);
    
    size_t new_width = width * scale;
    size_t new_height = height * scale;
    
    MagickResizeImage(magick_wand, new_width, new_height, LanczosFilter, 1.0);

    // Convert to grayscale
    MagickSetImageType(magick_wand, GrayscaleType);

    // Open output file
    output_file = fopen(output_path, "w");
    if (!output_file) {
        fprintf(stderr, "Error opening output file\n");
        return 1;
    }

    // Create pixel iterator
    iterator = NewPixelIterator(magick_wand);

    // Convert image to ASCII
    for (size_t y = 0; y < new_height; y++) {
        size_t row_width;
        pixels = PixelGetNextIteratorRow(iterator, &row_width);
        
        for (size_t x = 0; x < row_width; x++) {
            // Get pixel intensity
            double red = PixelGetRed(pixels[x]);
            double green = PixelGetGreen(pixels[x]);
            double blue = PixelGetBlue(pixels[x]);
            double intensity = 0.299 * red + 0.587 * green + 0.114 * blue;
            
            // Map intensity to ASCII character
            int char_index = (int)floor(intensity * (strlen(ASCII_CHARS) - 1));
            char ascii_char = ASCII_CHARS[char_index];
            
            // Write to file
            fputc(ascii_char, output_file);
        }
        
        // Add newline after each row
        fputc('\n', output_file);
    }

    // Cleanup
    fclose(output_file);
    iterator = DestroyPixelIterator(iterator);
    magick_wand = DestroyMagickWand(magick_wand);
    MagickWandTerminus();

    return 0;
}

int main(int argc, char *argv[]) {
    if (argc != 3) {
        fprintf(stderr, "Usage: %s <input_image> <output_file>\n", argv[0]);
        return 1;
    }

    return image_to_ascii(argv[1], argv[2]);
}

