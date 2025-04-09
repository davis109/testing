with open('app.py', 'r') as f:
    content = f.read()

# Create a corrected extract_frames function
fixed_extract_frames = """        # Set up enhanced extract_frames function
        def extract_frames(video_path):
            frames = []
            
            try:
                cap = cv2.VideoCapture(video_path)
                if not cap.isOpened():
                    raise Exception(f"Could not open video file {video_path}")
                    
                fps = max(int(cap.get(cv2.CAP_PROP_FPS)), 24)  # Default to 24fps if detection fails
                total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
                
                print(f"Video has {total_frames} frames at {fps} fps")
                
                # If video has no frames, return error
                if total_frames == 0:
                    raise Exception("Video has no frames")
                    
                # Process frames
                frame_count = 0
                while cap.isOpened():
                    ret, frame = cap.read()
                    if not ret:
                        break
                    
                    # Save frame with full path
                    frame_path = os.path.join(FRAMES_FOLDER, f"frame_{frame_count:04d}.png")
                    cv2.imwrite(frame_path, frame)
                    frames.append(frame_path)
                    frame_count += 1
                
                # Verify we extracted at least some frames
                if len(frames) == 0:
                    raise Exception("No frames could be extracted from the video")
                
                cap.release()
                return frames, fps
            except Exception as e:
                print(f"Error extracting frames: {str(e)}")
                raise"""

# Find and replace the problematic function
current_extract = content.find('def extract_frames(video_path):')
if current_extract != -1:
    # Find the start and end of the function
    function_start = content.rfind('# Set up enhanced extract_frames function', 0, current_extract)
    function_end = content.find('# Load DeOldify safely', current_extract)
    
    # Replace the function
    if function_start != -1 and function_end != -1:
        fixed_content = content[:function_start] + fixed_extract_frames + content[function_end:]
    
        # Write the fixed content
        with open('app.py.fixed', 'w') as f:
            f.write(fixed_content)
        
        print("Extract frames function fixed. New file created: app.py.fixed")
        print("To apply the fix, run: copy app.py.fixed app.py")
    else:
        print("Could not find the exact function boundaries")
else:
    print("Could not find the extract_frames function") 