with open('app.py', 'r') as f:
    lines = f.readlines()

# Find the extract_frames function and remove the nonlocal statement
for i, line in enumerate(lines):
    # Remove the incorrect nonlocal statement in the global extract_frames function
    if 'def extract_frames(video_path):' in line and 'nonlocal frames' in lines[i+1]:
        lines[i+1] = '    frames = []\n'
        break

# Write the fixed file
with open('app.py.fixed', 'w') as f:
    f.writelines(lines)

print("Fixed nonlocal binding issue. New file created: app.py.fixed")
print("To apply the fix, run: copy app.py.fixed app.py") 