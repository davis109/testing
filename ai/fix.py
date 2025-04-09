# Fix indentation errors and try-except issues in app.py
with open('app.py', 'r') as f:
    lines = f.readlines()

# Dictionary of line numbers (0-indexed) and their correct indentations
fixes = {
    152: '            out.write(frame)\n',                           # Line 153
    355: '                video_data_url = video_to_data_url(output_path)\n',  # Line 356
    511: '    image_data_url = request.json.get(\'image\')\n',       # Line 512
    523: '    input_path = os.path.join("uploads", filename)\n',     # Line 524
    988: '            out.write(frame)\n',                           # Line 989
    1071: '                video_data_url = video_to_data_url(output_path)\n',  # Line 1072
    931: '                cap = cv2.VideoCapture(video_path)\n',      # Line 932
    963: '            except Exception as e:\n',                      # Line 964
    1005: '            frames, fps = extract_frames(video_path)\n',   # Line 1006
    1063: '            create_video(colorized_frames, output_path, fps)\n', # Line 1064
    
    # Fix try blocks that don't have except clauses
    931: '                try:\n',
    945: '                    frame_count = 0\n',
    946: '                    while cap.isOpened():\n',
    947: '                        ret, frame = cap.read()\n',
    948: '                        if not ret:\n',
    949: '                            break\n',
    950: '                        \n',
    951: '                        # Save frame with full path\n',
    952: '                        frame_path = os.path.join(FRAMES_FOLDER, f"frame_{frame_count:04d}.png")\n',
    953: '                        cv2.imwrite(frame_path, frame)\n',
    954: '                        frames.append(frame_path)\n',
    955: '                        frame_count += 1\n',
    956: '                    \n',
    957: '                    # Verify we extracted at least some frames\n',
    958: '                    if len(frames) == 0:\n',
    959: '                        raise Exception("No frames could be extracted from the video")\n',
    960: '                    \n',
    961: '                    cap.release()\n',
    962: '                    return frames, fps\n',
    
    # Add except blocks for other try statements
    352: '        try:\n',
    353: '            # For small videos, still provide data URL for backward compatibility\n',
    354: '            if os.path.getsize(output_path) < 10 * 1024 * 1024:  # Less than 10MB\n',
    371: '        except Exception as e:\n',
    372: '            return jsonify({"error": str(e)}), 500\n',
    
    1004: '        try:\n',
    1010: '        except Exception as e:\n',
    1011: '            return jsonify({"error": f"Failed to extract frames: {str(e)}"}), 500\n'
}

# Apply all fixes
for line_num, new_line in fixes.items():
    try:
        lines[line_num] = new_line
    except IndexError:
        print(f"Warning: Line {line_num+1} doesn't exist in the file")

# Write back the fixed file
with open('app.py.fixed', 'w') as f:
    f.writelines(lines)

print("Fixed indentation errors and try-except blocks. Result saved to app.py.fixed")
print("Run this command to apply the fix: copy app.py.fixed app.py") 