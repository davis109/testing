import re

with open('app.py', 'r') as f:
    content = f.read()

# Replace the problematic video_colorizer function with a corrected version
new_video_colorizer = """
@app.route('/colorize/video', methods=['POST'])
def video_colorizer():
    try:
        video_data_url = request.json.get('video')
        
        if not video_data_url:
            return jsonify({"error": "No video provided"}), 400

        header, encoded = video_data_url.split(',', 1)
        video_data = base64.b64decode(encoded)

        # Create necessary directories with absolute paths
        base_dir = os.path.abspath('.')
        FRAMES_FOLDER = os.path.join(base_dir, 'uploads', 'frames')
        COLORIZED_FRAMES_FOLDER = os.path.join(base_dir, 'uploads', 'colorized_frames')
        RESULT_FOLDER = os.path.join(base_dir, 'uploads', 'result')

        # Create all necessary directories
        for directory in [FRAMES_FOLDER, COLORIZED_FRAMES_FOLDER, RESULT_FOLDER, 'models']:
            os.makedirs(directory, exist_ok=True)

        # Save the input video with a unique name to avoid conflicts
        video_filename = f"input_video_{uuid.uuid4().hex[:8]}.mp4"
        output_filename = f"colorized_video_{uuid.uuid4().hex[:8]}.mp4"
        video_path = os.path.join(base_dir, 'uploads', video_filename)
        output_path = os.path.join(RESULT_FOLDER, output_filename)
        
        print(f"Saving video to {video_path}")
        with open(video_path, "wb") as f:
            f.write(video_data)
            
        # Check if the video file is valid
        if not os.path.exists(video_path) or os.path.getsize(video_path) == 0:
            return jsonify({"error": "Failed to save video file"}), 500
            
        # Explicitly create an empty list for storing frames
        frames = []
        
        # Set up enhanced extract_frames function
        def extract_frames(video_path):
            nonlocal frames
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
                raise
                
        # Set up enhanced video creation function
        def create_video(colorized_frames, output_path, fps):
            if not colorized_frames:
                raise Exception("No colorized frames provided")
                
            first_frame = cv2.imread(colorized_frames[0])
            if first_frame is None:
                raise Exception(f"Could not read first frame: {colorized_frames[0]}")
                
            height, width = first_frame.shape[:2]
            
            # Use a more reliable codec
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
            
            if not out.isOpened():
                raise Exception(f"Failed to create video writer at {output_path}")
            
            for frame_path in colorized_frames:
                frame = cv2.imread(frame_path)
                if frame is not None:  # Skip frames that failed to load
                    out.write(frame)
                
            out.release()

            # Verify output file was created
            if not os.path.exists(output_path) or os.path.getsize(output_path) == 0:
                raise Exception("Failed to create output video file")

        # Load DeOldify safely
        try:
            _colorizer = get_image_colorizer(artistic=True)
        except Exception as e:
            return jsonify({"error": f"Failed to initialize DeOldify colorizer: {str(e)}"}), 500

        # Extract frames with better error reporting
        print("Extracting frames...")
        try:
            frames, fps = extract_frames(video_path)
            print(f"Successfully extracted {len(frames)} frames")
        except Exception as e:
            return jsonify({"error": f"Failed to extract frames: {str(e)}"}), 500
            
        # Process frames with better error handling
        print("Colorizing frames with DeOldify...")
        colorized_frames = []
        frame_errors = 0
        for i, frame_path in enumerate(tqdm(frames)):
            try:
                # Process with DeOldify
                colorized_frame = _colorizer.get_transformed_image(
                    path=frame_path,
                    render_factor=30,
                    watermarked=False,
                    post_process=True
                )
                
                if isinstance(colorized_frame, bytes):
                    colorized_frame = Image.open(BytesIO(colorized_frame))

                # Save the colorized frame with a unique path
                colorized_frame_path = os.path.join(COLORIZED_FRAMES_FOLDER, f"colorized_frame_{i:04d}.png")
                colorized_frame.save(colorized_frame_path)
                colorized_frames.append(colorized_frame_path)
                
            except Exception as frame_error:
                # Count errors for tracking
                frame_errors += 1
                print(f"Error processing frame {i}: {str(frame_error)}")
                
                # Use a simple fallback
                try:
                    img = cv2.imread(frame_path, cv2.IMREAD_GRAYSCALE)
                    if img is None:
                        raise Exception(f"Could not read frame at {frame_path}")
                        
                    # Apply colormap for simple colorization
                    colorized = cv2.applyColorMap(img, cv2.COLORMAP_BONE)
                    colorized_frame_path = os.path.join(COLORIZED_FRAMES_FOLDER, f"colorized_frame_{i:04d}.png")
                    cv2.imwrite(colorized_frame_path, colorized)
                    colorized_frames.append(colorized_frame_path)
                except Exception as fallback_error:
                    print(f"Fallback colorization failed for frame {i}: {str(fallback_error)}")
                    # Skip this frame if both methods fail
        
        # Check if we have enough colorized frames to make a video
        if len(colorized_frames) == 0:
            return jsonify({"error": "Failed to colorize any frames"}), 500
            
        if frame_errors > 0:
            print(f"Warning: {frame_errors} frames had errors and used fallback colorization")

        # Create output video
        print("Creating output video...")
        
        try:
            create_video(colorized_frames, output_path, fps)
        except Exception as e:
            return jsonify({"error": f"Failed to create output video: {str(e)}"}), 500

        # Return appropriate response based on video size
        try:
            # For small videos, still provide data URL for backward compatibility
            if os.path.getsize(output_path) < 10 * 1024 * 1024:  # Less than 10MB
                video_data_url = video_to_data_url(output_path)
                
                # Clean up
                for folder in [FRAMES_FOLDER, COLORIZED_FRAMES_FOLDER]:
                    try:
                        shutil.rmtree(folder)
                    except Exception as e:
                        print(f"Warning: Failed to clean up {folder}: {str(e)}")
                        
                return jsonify({
                    "success": True,
                    "processedVideo": video_data_url
                })
            else:
                # For larger videos, provide a direct URL
                video_url = f"/video/{output_filename}"
                
                # Clean up
                for folder in [FRAMES_FOLDER, COLORIZED_FRAMES_FOLDER]:
                    try:
                        shutil.rmtree(folder)
                    except Exception as e:
                        print(f"Warning: Failed to clean up {folder}: {str(e)}")
                        
                return jsonify({
                    "success": True,
                    "processedVideo": video_url,
                    "isDirectUrl": True
                })
        except Exception as e:
            return jsonify({"error": f"Failed to process video response: {str(e)}"}), 500

    except Exception as e:
        traceback.print_exc()
        print(f"Video colorization failed: {str(e)}")
        
        # Clean up if possible
        try:
            for folder in [FRAMES_FOLDER, COLORIZED_FRAMES_FOLDER]:
                if 'folder' in locals() and os.path.exists(folder):
                    shutil.rmtree(folder)
        except:
            pass  # Ignore cleanup errors
            
        return jsonify({"error": str(e)}), 500
"""

# Pattern to match the entire function
pattern = r"@app\.route\('/colorize/video', methods=\['POST'\]\)\ndef video_colorizer\(\):.*?@app\.route\('/stylize'"
replacement = new_video_colorizer + "\n\n\n@app.route('/stylize'"

# Replace the pattern in the content
content_with_fixed_function = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Write the fixed content to a new file
with open('app.py.fixed', 'w') as f:
    f.write(content_with_fixed_function)

print("Successfully replaced the video_colorizer function.")
print("To use the updated file, run: copy app.py.fixed app.py") 