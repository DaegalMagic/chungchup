from PIL import Image, ImageSequence

def make_gif_background_transparent(input_path, output_path, color_to_replace=(255, 255, 255), tolerance=30):
    """
    Processes a GIF to make a specific color and its close variations transparent.

    :param input_path: Path to the input GIF file.
    :param output_path: Path to save the output GIF file.
    :param color_to_replace: The target RGB color tuple to make transparent (e.g., (255, 255, 255) for white).
    :param tolerance: How close a color needs to be to the target to be made transparent.
    """
    try:
        with Image.open(input_path) as im:
            new_frames = []
            
            # Get original animation properties
            duration = im.info.get('duration', 100)
            loop = im.info.get('loop', 0)

            for frame in ImageSequence.Iterator(im):
                # Convert the frame to RGBA to ensure it has an alpha channel
                rgba_frame = frame.convert("RGBA")
                
                # Get pixel data
                datas = rgba_frame.getdata()

                newData = []
                for item in datas:
                    # Check if the pixel color is close to the target color
                    if (abs(item[0] - color_to_replace[0]) < tolerance and
                        abs(item[1] - color_to_replace[1]) < tolerance and
                        abs(item[2] - color_to_replace[2]) < tolerance):
                        # If it is, make it transparent
                        newData.append((255, 255, 255, 0))
                    else:
                        # Otherwise, keep the original pixel
                        newData.append(item)
                
                rgba_frame.putdata(newData)
                new_frames.append(rgba_frame)

            # Save the new frames as a new animated GIF
            new_frames[0].save(output_path,
                               save_all=True,
                               append_images=new_frames[1:],
                               duration=duration,
                               loop=loop,
                               disposal=2,  # Important for transparency handling between frames
                               transparency=0)
            print(f"Successfully created transparent GIF: {output_path}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    input_gif = 'public/play.gif'
    output_gif = 'public/play_transparent.gif'
    # For white, we target (255, 255, 255)
    make_gif_background_transparent(input_gif, output_gif, color_to_replace=(255, 255, 255), tolerance=40)
