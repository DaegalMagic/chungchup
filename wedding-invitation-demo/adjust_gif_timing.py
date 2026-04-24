from PIL import Image, ImageSequence

def adjust_complex_gif_timing(input_path, output_path, timings):
    """
    Adjusts GIF frame durations based on a set of rules.

    :param input_path: Path to the input GIF file.
    :param output_path: Path to save the output GIF file.
    :param timings: A dictionary with timing rules.
    """
    try:
        with Image.open(input_path) as im:
            frames = [frame.copy() for frame in ImageSequence.Iterator(im)]
            
            # Get original animation properties
            original_duration = im.info.get('duration', 100)
            loop = im.info.get('loop', 0)
            
            # Create a list of durations for each frame
            num_frames = len(frames)
            if isinstance(original_duration, list):
                durations = original_duration[:num_frames]
            else:
                durations = [original_duration] * num_frames
            
            if len(durations) < num_frames:
                durations.extend([original_duration] * (num_frames - len(durations)))
            
            # Apply new timing rules
            # Rule 1: First frame
            if num_frames > 0:
                durations[0] = timings.get('first_frame', durations[0])

            # Rule 2: From a specific frame onwards
            start_frame_index = timings.get('from_frame_60_start_index', 59)
            if num_frames > start_frame_index:
                for i in range(start_frame_index, num_frames - 1):
                    durations[i] = timings.get('from_frame_60_duration', durations[i])

            # Rule 3: Last frame (overwrites previous rules if it's the last frame)
            if num_frames > 1:
                durations[-1] = timings.get('last_frame', durations[-1])

            # Save the new frames with the adjusted durations
            frames[0].save(output_path,
                           save_all=True,
                           append_images=frames[1:],
                           duration=durations,
                           loop=loop,
                           disposal=2) # Preserve transparency handling
            
            print(f"Successfully created GIF with new complex timing: {output_path}")
            print(f"Number of frames: {num_frames}")
            print(f"Durations: {durations}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    input_gif = 'public/play_transparent.gif'
    output_gif = 'public/play_timed.gif'
    
    # New timing rules:
    # 1. First frame: 1100ms
    # 2. From frame 60 (index 59) onwards: 80ms
    # 3. Last frame: 30000ms
    new_timings = {
        'first_frame': 1100,
        'from_frame_60_start_index': 59, # Frame 60 is at index 59
        'from_frame_60_duration': 80,
        'last_frame': 30000
    }
    
    adjust_complex_gif_timing(input_gif, output_gif, new_timings)